// Bluia Sisters private chat booking experience
(() => {
  "use strict";

  const FIREBASE_VERSION = "10.14.1";
  const BUY_PIN_URL = "https://buy.stripe.com/4gMbITgUo0jc1yF3F5bAs04";
  const PIN_HASH = "f8dc9104d6c66966c0a1b9dd7dd8327018b4882425ccaa90d5a69eef1d09997b";

  const firebaseConfig = {
    apiKey: "AIzaSyDmDAHuk6CEObzaJMhIlvNReOI0K83wK0k",
    authDomain: "bluias.firebaseapp.com",
    databaseURL: "https://bluias-default-rtdb.firebaseio.com",
    projectId: "bluias",
    storageBucket: "bluias.firebasestorage.app",
    messagingSenderId: "604309456152",
    appId: "1:604309456152:web:71dfcb29cbcda483260a6d",
    measurementId: "G-GQJY1FF8BT"
  };

  let selectedSister = "";
  let pendingBooking = null;
  let dbMod = null;
  let db = null;
  let bookingsRef = null;
  let existingBookings = [];
  let countdownTimer = null;
  const sisterIds = new Map();

  const sisters = () => Array.isArray(window.BluiaMedia?.models) ? window.BluiaMedia.models : [];

  function addStyles(){
    if (document.getElementById("bluia-booking-style")) return;
    const style = document.createElement("style");
    style.id = "bluia-booking-style";
    style.textContent = `
      .media-tabs{grid-template-columns:repeat(5,minmax(0,1fr))!important;gap:5px!important}
      .booking-tab{border-color:#ff6ba7!important;color:#ff8fba!important;background:#211019!important}
      .booking-tab.active{border-color:#ff4f95!important;background:linear-gradient(135deg,#ff6aa8,#d93778)!important;color:#fff!important}
      #panel-booking{min-height:calc(100svh - 52px);padding:14px 0 34px;background:linear-gradient(180deg,#f4518f 0%,#e74282 54%,#ca306c 100%)}
      .booking-shell{width:100%;max-width:none;margin:0;text-align:left}

      .chat-main{display:grid;grid-template-columns:158px minmax(0,1fr);gap:16px;align-items:stretch;padding:0 14px 12px}
      .chat-main-photo{display:block;width:158px;aspect-ratio:2/3;object-fit:cover;object-position:top center;border:1px solid rgba(255,255,255,.38);border-radius:16px;background:#d9457f;box-shadow:0 12px 30px rgba(83,7,37,.20)}
      .chat-main-copy{display:flex;flex-direction:column;justify-content:center;min-width:0}
      .chat-kicker{margin:0 0 5px;color:#ffd4e4;font-size:7px;line-height:1.2;font-weight:950;letter-spacing:.9px;text-transform:uppercase}
      .chat-title{margin:0 0 7px;color:#fff;font-size:11px;line-height:1.3;font-weight:950}
      .chat-copy{margin:0 0 7px;color:#ffe8f0;font-size:9px;line-height:1.46}
      .chat-detail{margin:0 0 3px;color:#66152f;font-size:8px;font-weight:950}
      .chat-time-copy{margin:0;color:#ffe2ec;font-size:8px;line-height:1.42}
      .chat-sister-id{margin-top:7px;color:#6c1c39;font-size:7px;letter-spacing:.45px;text-transform:uppercase}
      .chat-open-button{margin-top:10px;min-height:43px;display:flex;align-items:center;justify-content:center;gap:7px;width:100%;border:1px solid rgba(255,255,255,.92);border-radius:12px;background:#fff;color:#dd3f7b;font-size:10.5px;font-weight:950;cursor:pointer;box-shadow:0 9px 24px rgba(87,10,40,.18);transition:transform .16s ease,box-shadow .16s ease}
      .chat-open-button:active{transform:scale(.985)}
      .chat-open-button svg{width:15px;height:15px;fill:currentColor;flex:0 0 15px}

      .chat-slider-wrap{padding:0 14px 15px}
      .chat-slider-label{display:flex;align-items:center;justify-content:space-between;gap:8px;margin:0 0 7px;color:#fff}
      .chat-slider-label strong{font-size:9px}.chat-slider-label span{color:#ffd6e5;font-size:7px}
      .chat-slider{display:grid;grid-auto-flow:column;grid-auto-columns:64px;gap:7px;overflow-x:auto;padding:1px 1px 6px;scrollbar-width:none;scroll-snap-type:x proximity}
      .chat-slider::-webkit-scrollbar{display:none}
      .chat-sister-thumb{width:64px;aspect-ratio:2/3;padding:0;border:2px solid transparent;border-radius:11px;overflow:hidden;background:#ba2c65;cursor:pointer;scroll-snap-align:start;box-shadow:0 6px 16px rgba(88,7,39,.15)}
      .chat-sister-thumb img{display:block;width:100%;height:100%;object-fit:cover;object-position:top center}
      .chat-sister-thumb.selected{border-color:#fff;box-shadow:0 0 0 2px rgba(255,255,255,.18),0 7px 18px rgba(88,7,39,.22)}

      .bookings-heading{display:flex;align-items:center;justify-content:space-between;gap:8px;margin:2px 14px 9px;color:#fff}
      .bookings-heading strong{font-size:11px}.bookings-heading span{font-size:8px;color:#ffd4e3}
      .bookings-list{display:grid;gap:8px;margin:0 14px}
      .booking-entry{display:grid;grid-template-columns:78px minmax(0,1fr);overflow:hidden;border:1px solid rgba(255,255,255,.30);border-radius:14px;background:#fff;box-shadow:0 9px 24px rgba(89,7,40,.17)}
      .booking-entry img{display:block;width:78px;height:118px;object-fit:cover;object-position:top center;background:#eed6e0}
      .booking-entry-body{padding:9px 10px;min-width:0}
      .booking-entry-top{display:flex;align-items:center;justify-content:space-between;gap:7px;margin-bottom:4px}
      .booking-entry-name{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#ce3374;font-size:10.5px;font-weight:950}
      .booking-entry-badge{padding:3px 6px;border-radius:999px;background:#fff0f6;color:#cf3975;font-size:7px;font-weight:900}
      .booking-entry-time{color:#2c1821;font-size:9.2px;font-weight:850;line-height:1.38}
      .booking-entry-zone{margin-top:2px;color:#8c707c;font-size:7px;line-height:1.35}
      .booking-entry-duration{margin-top:3px;color:#8c707c;font-size:8px}
      .booking-entry-id{margin-top:4px;color:#b19aa4;font-size:7px;letter-spacing:.35px;text-transform:uppercase}
      .booking-entry-countdown{margin-top:5px;padding-top:5px;border-top:1px solid #f3d7e3;color:#cf3975;font-size:8px;font-weight:900}
      .booking-entry-countdown.live{color:#c51e65}.booking-entry-countdown.ended{color:#9d8790}
      .bookings-empty{padding:15px;border:1px dashed rgba(255,255,255,.52);border-radius:13px;color:#fff0f6;font-size:9.5px;text-align:center}

      .booking-modal,.pin-modal{position:fixed;inset:0;z-index:100001;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(0,0,0,.80);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);opacity:0;visibility:hidden;pointer-events:none;transition:.18s ease}
      .pin-modal{z-index:100002}
      .booking-modal.open,.pin-modal.open{opacity:1;visibility:visible;pointer-events:auto}
      .booking-card,.pin-card{position:relative;width:min(94vw,390px);max-height:91dvh;overflow:auto;padding:18px;border:1px solid #563246;border-radius:21px;background:radial-gradient(circle at 100% 0%,rgba(255,89,151,.12),transparent 30%),linear-gradient(180deg,#171014,#0b090a);color:#fff;box-shadow:0 30px 90px rgba(0,0,0,.74)}
      .booking-close,.pin-close{position:absolute;top:10px;right:10px;width:32px;height:32px;border:1px solid #64364b;border-radius:50%;background:#211118;color:#fff;font-size:17px;cursor:pointer}
      .booking-modal-kicker{margin:0 42px 4px 0;color:#ff79ae;font-size:7px;font-weight:950;letter-spacing:.8px;text-transform:uppercase}
      .booking-card-title{margin:0 42px 5px 0;color:#fff;font-size:15px;line-height:1.25;font-weight:950}
      .booking-card-copy{margin:0 42px 12px 0;color:#cdb8c1;font-size:8.8px;line-height:1.5}
      .booking-selected{display:flex;align-items:center;justify-content:space-between;gap:8px;margin:0 0 11px;padding:9px 10px;border:1px solid #3d2731;border-radius:11px;background:#100b0d}
      .booking-selected strong{color:#fff;font-size:9px}.booking-selected span{color:#ff83b5;font-size:7.5px;font-weight:900;letter-spacing:.35px}
      .wizard-label{display:block;margin:8px 0 4px;color:#e8d8df;font-size:8.5px;font-weight:850}
      .wizard-input,.wizard-select{width:100%;min-height:40px;padding:7px 9px;border:1px solid #583043;border-radius:10px;background:#10090d;color:#fff;font-size:16px;outline:none}
      .wizard-input:focus,.wizard-select:focus{border-color:#ff6aa8;box-shadow:0 0 0 2px rgba(255,106,168,.12)}
      .wizard-row{display:grid;grid-template-columns:1fr 1fr;gap:7px}
      .wizard-time-preview{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:7px}
      .wizard-time-zone{padding:7px 8px;border:1px solid #34242b;border-radius:9px;background:#0d090b;color:#a997a0;font-size:7.8px;line-height:1.35}
      .wizard-time-zone strong{display:block;margin-bottom:2px;color:#ff83b5;font-size:7px;letter-spacing:.45px;text-transform:uppercase}
      .wizard-note{margin:6px 1px 0;color:#91818a;font-size:7.5px;line-height:1.35}
      .wizard-book{width:100%;min-height:46px;margin-top:12px;border:0;border-radius:11px;background:linear-gradient(135deg,#ff6aa8,#d93679);color:#fff;font-size:11px;font-weight:950;cursor:pointer;box-shadow:0 9px 24px rgba(217,54,121,.18)}
      .wizard-status{min-height:17px;margin-top:6px;color:#d6c4cc;font-size:8.5px;text-align:center}

      .pin-card{width:min(92vw,340px)}
      .pin-icon{width:43px;height:43px;display:grid;place-items:center;margin-bottom:11px;border:1px solid #5d3044;border-radius:13px;background:#25121b;color:#ff6da8;font-size:18px}
      .pin-card h3{margin:0 42px 7px 0;font-size:15px}.pin-copy{margin:0 0 13px;color:#cdbbc3;font-size:9px;line-height:1.5}
      .pin-input{width:100%;min-height:49px;padding:10px 12px;border:1px solid #5c3346;border-radius:12px;background:#0c090a;color:#fff;font-size:19px;font-weight:900;letter-spacing:5px;text-align:center;outline:none}
      .pin-error{min-height:18px;margin:6px 0 0;color:#ff8db8;font-size:9px;text-align:center}
      .pin-confirm{width:100%;min-height:46px;margin-top:3px;border:0;border-radius:11px;background:linear-gradient(135deg,#ff68a5,#d83879);color:#fff;font-size:11px;font-weight:950;cursor:pointer}
      .pin-divider{height:1px;margin:14px 0;background:#38262f}.pin-help{margin:0 0 9px;color:#aa98a0;font-size:9px;line-height:1.45}.pin-buy{min-height:42px;display:flex;align-items:center;justify-content:center;border:1px solid #69501d;border-radius:11px;background:linear-gradient(135deg,#e7c75f,#b88828);color:#160f04;text-decoration:none;font-size:10.5px;font-weight:950}.pin-email-note{margin:8px 2px 0;color:#8e7d85;font-size:8.5px;line-height:1.4;text-align:center}

      @media(max-width:390px){.chat-main{grid-template-columns:142px minmax(0,1fr);gap:12px;padding-left:11px;padding-right:11px}.chat-main-photo{width:142px}.chat-slider-wrap{padding-left:11px;padding-right:11px}.bookings-heading,.bookings-list{margin-left:11px;margin-right:11px}}
      @media(max-width:340px){.chat-main{grid-template-columns:125px minmax(0,1fr);gap:10px}.chat-main-photo{width:125px}.chat-copy{font-size:8.3px}.chat-open-button{font-size:9.5px}}
    `;
    document.head.appendChild(style);
  }

  function removeBottomModels(){
    document.querySelector('.sub-tab[data-subpanel="models"]')?.remove();
    document.getElementById("subpanel-models")?.remove();
    const tabs=document.querySelector(".sub-tabs");
    if(tabs){const n=tabs.querySelectorAll(".sub-tab").length;if(n)tabs.style.gridTemplateColumns=`repeat(${n},1fr)`;}
  }

  function viewerTimeZone(){try{return Intl.DateTimeFormat().resolvedOptions().timeZone||"Local"}catch(e){return"Local"}}
  function localDate(){const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`}
  function defaultTime(){const d=new Date(Date.now()+3600000);d.setMinutes(Math.ceil(d.getMinutes()/30)*30,0,0);return `${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`}
  function localStartMs(date,time){const d=new Date(`${date||""}T${time||""}`);return Number.isNaN(d.getTime())?NaN:d.getTime()}

  function sisterKey(url){let hash=2166136261;for(let i=0;i<url.length;i++){hash^=url.charCodeAt(i);hash=Math.imul(hash,16777619)}return `s_${(hash>>>0).toString(36)}`}
  function randomSisterId(){const chars="ABCDEFGHJKLMNPQRSTUVWXYZ23456789";let out="";const bytes=new Uint8Array(4);crypto.getRandomValues(bytes);for(let i=0;i<4;i++)out+=chars[bytes[i]%chars.length];return out}

  function selectedId(){return sisterIds.get(selectedSister)||"…"}
  function updateSelectedSister(){
    const mainImg=document.getElementById("chat-main-photo");
    const mainId=document.getElementById("chat-main-id");
    const modalId=document.getElementById("booking-selected-id");
    if(mainImg&&selectedSister)mainImg.src=selectedSister;
    if(mainId)mainId.textContent=`ID ${selectedId()}`;
    if(modalId)modalId.textContent=`ID ${selectedId()}`;
    document.querySelectorAll(".chat-sister-thumb").forEach(x=>x.classList.toggle("selected",x.dataset.url===selectedSister));
  }

  function bookingStartMs(item){if(Number.isFinite(Number(item?.startAtMs)))return Number(item.startAtMs);return localStartMs(item?.date,item?.time)}
  function bookingBounds(item){const start=bookingStartMs(item);const duration=Math.max(1,Number(item?.duration)||30)*60000;return{start,end:start+duration}}
  function sameSister(a,b){if(a.sisterId&&b.sisterId)return a.sisterId===b.sisterId;return(a.sisterImage||"")===(b.sisterImage||"")}
  function overlapsExisting(candidate,items=existingBookings){const a=bookingBounds(candidate);if(!Number.isFinite(a.start))return false;return items.some(item=>{if(!sameSister(candidate,item))return false;const b=bookingBounds(item);if(!Number.isFinite(b.start))return false;return a.start<b.end&&a.end>b.start})}

  function formatZone(ms,timeZone){if(!Number.isFinite(ms))return"Time unavailable";try{return new Intl.DateTimeFormat(undefined,{timeZone,weekday:"short",month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"}).format(new Date(ms))}catch(e){return new Date(ms).toLocaleString()}}
  function formatLocal(ms){if(!Number.isFinite(ms))return"Time unavailable";try{return new Intl.DateTimeFormat(undefined,{weekday:"short",month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"}).format(new Date(ms))}catch(e){return new Date(ms).toLocaleString()}}

  function updateTimePreview(){
    const wrap=document.getElementById("wizard-time-preview");
    if(!wrap)return;
    const date=document.getElementById("booking-date")?.value||"";
    const time=document.getElementById("booking-time")?.value||"";
    const ms=localStartMs(date,time);
    if(!Number.isFinite(ms)){wrap.innerHTML="";return}
    wrap.innerHTML=`<div class="wizard-time-zone"><strong>Your time</strong>${formatLocal(ms)}<br>${viewerTimeZone()}</div><div class="wizard-time-zone"><strong>Paris time</strong>${formatZone(ms,"Europe/Paris")}<br>Europe/Paris</div>`;
  }

  function compactRemaining(ms){const total=Math.max(0,Math.floor(ms/1000));const days=Math.floor(total/86400);const hours=Math.floor((total%86400)/3600);const minutes=Math.floor((total%3600)/60);const seconds=total%60;if(days>0)return`${days}d ${hours}h ${minutes}m`;if(hours>0)return`${hours}h ${minutes}m ${seconds}s`;return`${minutes}m ${seconds}s`}
  function updateCountdowns(){
    const now=Date.now();
    document.querySelectorAll(".booking-entry-countdown[data-start]").forEach(el=>{
      const start=Number(el.dataset.start||0);const duration=Math.max(1,Number(el.dataset.duration||30))*60000;const end=start+duration;
      el.classList.remove("live","ended");
      if(!Number.isFinite(start)||!start){el.textContent="Schedule unavailable";return}
      if(now<start){el.textContent=`Starts in ${compactRemaining(start-now)}`;return}
      if(now<end){el.textContent=`Chat live · ${compactRemaining(end-now)} remaining`;el.classList.add("live");return}
      el.textContent="Chat ended";el.classList.add("ended");
    });
  }

  function buildUI(){
    if(document.getElementById("panel-booking"))return;
    const nav=document.querySelector(".media-tabs");
    const main=document.querySelector("main");
    if(!nav||!main)return;

    const tab=document.createElement("button");
    tab.className="media-tab booking-tab";tab.type="button";tab.dataset.panel="booking";tab.textContent="Chat";
    nav.insertBefore(tab,nav.firstElementChild);

    const panel=document.createElement("section");
    panel.className="media-panel";panel.id="panel-booking";
    panel.innerHTML=`
      <div class="booking-shell">
        <div class="chat-main">
          <img class="chat-main-photo" id="chat-main-photo" alt="Selected Bluia Sister">
          <div class="chat-main-copy">
            <div class="chat-kicker">Private chat booking</div>
            <div class="chat-title">Chat with Bluia Sisters 💗</div>
            <p class="chat-copy">Choose a Bluia Sister from the photo slider, then book a private chat in your own timezone.</p>
            <div class="chat-detail">Booking details</div>
            <p class="chat-time-copy">Your local time and Paris time are shown automatically. 30 minutes is selected by default.</p>
            <div class="chat-sister-id" id="chat-main-id">ID …</div>
            <button class="chat-open-button" id="chat-open-booking" type="button" aria-label="Book a private chat">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3C6.49 3 2 6.81 2 11.5c0 2.51 1.31 4.83 3.58 6.42L5 21l3.5-1.62c1.1.4 2.28.62 3.5.62 5.51 0 10-3.81 10-8.5S17.51 3 12 3Zm-4 9.5a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5Zm4 0a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5Zm4 0a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5Z"/></svg>
              Book private chat
            </button>
          </div>
        </div>

        <div class="chat-slider-wrap">
          <div class="chat-slider-label"><strong>Choose a Bluia Sister</strong><span>Swipe to see more</span></div>
          <div class="chat-slider" id="chat-sister-slider"></div>
        </div>

        <div class="bookings-heading"><strong>Latest bookings</strong><span>Latest 10 · live countdown</span></div>
        <div class="bookings-list" id="bookings-list"><div class="bookings-empty">Loading latest bookings…</div></div>
      </div>`;
    main.insertBefore(panel,main.querySelector(".page-content")||null);

    const bookingModal=document.createElement("div");
    bookingModal.className="booking-modal";bookingModal.id="booking-modal";
    bookingModal.innerHTML=`
      <div class="booking-card" role="dialog" aria-modal="true" aria-labelledby="booking-modal-title">
        <button class="booking-close" id="booking-close" type="button" aria-label="Close">×</button>
        <div class="booking-modal-kicker">Bluia Sisters private chat</div>
        <h3 class="booking-card-title" id="booking-modal-title">Book your private chat</h3>
        <p class="booking-card-copy">Choose your preferred date and time. The booking is shown in your timezone and Paris time before confirmation.</p>
        <div class="booking-selected"><strong>Bluia Sister</strong><span id="booking-selected-id">ID …</span></div>
        <label class="wizard-label" for="booking-name">Your name</label>
        <input class="wizard-input" id="booking-name" type="text" maxlength="50" autocomplete="name" placeholder="Your name">
        <div class="wizard-row">
          <div><label class="wizard-label" for="booking-date">Date · your time</label><input class="wizard-input" id="booking-date" type="date"></div>
          <div><label class="wizard-label" for="booking-time">Time · your time</label><input class="wizard-input" id="booking-time" type="time" step="900"></div>
        </div>
        <div class="wizard-time-preview" id="wizard-time-preview"></div>
        <label class="wizard-label" for="booking-duration">Chat duration</label>
        <select class="wizard-select" id="booking-duration"><option value="15">15 minutes</option><option value="30" selected>30 minutes</option><option value="45">45 minutes</option><option value="60">60 minutes</option></select>
        <div class="wizard-note">Overlapping bookings for the same Bluia Sister are blocked automatically.</div>
        <button class="wizard-book" id="wizard-book" type="button">Continue to booking PIN</button>
        <div class="wizard-status" id="wizard-status" aria-live="polite"></div>
      </div>`;
    document.body.appendChild(bookingModal);

    const pinModal=document.createElement("div");
    pinModal.className="pin-modal";pinModal.id="pin-modal";
    pinModal.innerHTML=`<div class="pin-card" role="dialog" aria-modal="true"><button class="pin-close" id="pin-close" type="button" aria-label="Close">×</button><div class="pin-icon">✦</div><h3>Enter your booking PIN</h3><p class="pin-copy">Enter the PIN sent to your email after purchasing a booking PIN.</p><input class="pin-input" id="pin-input" type="password" inputmode="numeric" maxlength="6" autocomplete="one-time-code" placeholder="••••••"><div class="pin-error" id="pin-error"></div><button class="pin-confirm" id="pin-confirm" type="button">Confirm Booking</button><div class="pin-divider"></div><p class="pin-help"><strong style="color:#fff">Need a PIN?</strong><br>Buy your booking PIN securely through Stripe. You will receive it at the email address used during checkout.</p><a class="pin-buy" href="${BUY_PIN_URL}" target="_blank" rel="noopener noreferrer">Buy Booking PIN</a><p class="pin-email-note">Use an email address you can access. Your PIN will be delivered there.</p></div>`;
    document.body.appendChild(pinModal);

    renderSisterSlider();
    setupDefaults();
    setupActions(tab,panel);
    const first=sisters()[0];if(first){selectedSister=first;updateSelectedSister()}
    setTimeout(()=>tab.click(),100);
  }

  function renderSisterSlider(){
    const slider=document.getElementById("chat-sister-slider");
    sisters().forEach((url,i)=>{
      const button=document.createElement("button");
      button.type="button";button.className="chat-sister-thumb";button.dataset.url=url;button.setAttribute("aria-label",`Choose Bluia Sister ${i+1}`);
      button.innerHTML=`<img src="${url}" alt="Bluia Sister ${i+1}" loading="lazy" decoding="async">`;
      button.addEventListener("click",()=>{selectedSister=url;updateSelectedSister()});
      slider?.appendChild(button);
    });
  }

  function setupDefaults(){
    const date=document.getElementById("booking-date"),time=document.getElementById("booking-time");
    if(date){date.min=localDate();date.value=localDate()}
    if(time)time.value=defaultTime();
    updateTimePreview();
  }

  function openBooking(){
    const status=document.getElementById("wizard-status");if(status)status.textContent="";
    updateSelectedSister();updateTimePreview();
    document.getElementById("booking-modal")?.classList.add("open");
  }
  function closeBooking(){document.getElementById("booking-modal")?.classList.remove("open")}
  function openPin(){const input=document.getElementById("pin-input"),error=document.getElementById("pin-error");if(input)input.value="";if(error)error.textContent="";document.getElementById("pin-modal")?.classList.add("open");setTimeout(()=>input?.focus(),100)}
  function closePin(){document.getElementById("pin-modal")?.classList.remove("open")}

  function setupActions(tab,panel){
    tab.onclick=()=>{document.querySelectorAll(".media-tab").forEach(x=>x.classList.toggle("active",x===tab));document.querySelectorAll(".media-panel").forEach(x=>x.classList.toggle("active",x===panel));document.getElementById("tv-video")?.pause();document.getElementById("reel-video")?.pause()};
    document.querySelectorAll(".media-tab:not(.booking-tab)").forEach(x=>x.addEventListener("click",()=>{tab.classList.remove("active");panel.classList.remove("active")}));
    document.getElementById("chat-open-booking")?.addEventListener("click",openBooking);
    document.getElementById("booking-close")?.addEventListener("click",closeBooking);
    document.getElementById("booking-modal")?.addEventListener("click",e=>{if(e.target.id==="booking-modal")closeBooking()});
    document.getElementById("wizard-book")?.addEventListener("click",prepareBooking);
    document.getElementById("booking-date")?.addEventListener("change",updateTimePreview);
    document.getElementById("booking-time")?.addEventListener("change",updateTimePreview);
    document.getElementById("booking-time")?.addEventListener("input",updateTimePreview);
    document.getElementById("pin-close")?.addEventListener("click",closePin);
    document.getElementById("pin-modal")?.addEventListener("click",e=>{if(e.target.id==="pin-modal")closePin()});
    document.getElementById("pin-confirm")?.addEventListener("click",confirmPin);
    document.getElementById("pin-input")?.addEventListener("keydown",e=>{if(e.key==="Enter")confirmPin()});
    document.addEventListener("keydown",e=>{if(e.key==="Escape"){closePin();closeBooking()}});
  }

  function prepareBooking(){
    const status=document.getElementById("wizard-status");
    const name=(document.getElementById("booking-name")?.value||"").trim();
    const date=document.getElementById("booking-date")?.value||"";
    const time=document.getElementById("booking-time")?.value||"";
    const duration=Number(document.getElementById("booking-duration")?.value||30);
    const sisterId=sisterIds.get(selectedSister)||"";
    if(!selectedSister){status.textContent="Choose a Bluia Sister first.";return}
    if(!name){status.textContent="Enter your name.";document.getElementById("booking-name")?.focus();return}
    if(!date||!time){status.textContent="Choose a date and time.";return}
    const startAtMs=localStartMs(date,time);
    if(!Number.isFinite(startAtMs)){status.textContent="Choose a valid date and time.";return}
    if(startAtMs<Date.now()-60000){status.textContent="Choose a future booking time.";return}
    const candidate={name:name.slice(0,50),sisterImage:selectedSister,sisterId,date,time,duration,startAtMs,visitorTimeZone:viewerTimeZone(),visitorOffsetMinutes:new Date(startAtMs).getTimezoneOffset(),createdAt:Date.now()};
    if(overlapsExisting(candidate)){status.textContent="That Bluia Sister is already booked during this time. Please choose another time.";return}
    pendingBooking=candidate;status.textContent="";openPin();
  }

  async function hashText(text){const data=new TextEncoder().encode(text);const hash=await crypto.subtle.digest("SHA-256",data);return[...new Uint8Array(hash)].map(b=>b.toString(16).padStart(2,"0")).join("")}

  async function confirmPin(){
    const input=document.getElementById("pin-input"),error=document.getElementById("pin-error"),button=document.getElementById("pin-confirm"),status=document.getElementById("wizard-status");
    if(await hashText((input?.value||"").trim())!==PIN_HASH){error.textContent="Incorrect PIN. Check the PIN sent to your email.";input?.focus();return}
    if(!pendingBooking||!bookingsRef||!dbMod){error.textContent="Booking service is not ready. Please try again.";return}
    button.disabled=true;button.textContent="Confirming…";
    try{
      const newKey=dbMod.push(bookingsRef).key;let overlap=false;
      const result=await dbMod.runTransaction(bookingsRef,current=>{
        overlap=false;const source=current&&typeof current==="object"?current:{};const items=Object.values(source).filter(Boolean);
        if(overlapsExisting(pendingBooking,items)){overlap=true;return}
        return{...source,[newKey]:pendingBooking};
      },{applyLocally:false});
      if(!result.committed){
        closePin();
        status.textContent=overlap?"That Bluia Sister was just booked at this time. Please choose another slot.":"Could not confirm this booking. Please try again.";
        return;
      }
      const saved={id:newKey,...pendingBooking};
      existingBookings=[...existingBookings,saved];
      renderBookings(existingBookings);
      closePin();closeBooking();
      document.getElementById("booking-name").value="";
      pendingBooking=null;
    }catch(err){console.warn("Booking save failed",err);error.textContent="Could not save your booking. Please try again."}
    finally{button.disabled=false;button.textContent="Confirm Booking"}
  }

  function renderBookings(items){
    const list=document.getElementById("bookings-list");if(!list)return;
    list.innerHTML="";
    const sorted=[...items].sort((a,b)=>(Number(b.createdAt)||bookingStartMs(b)||0)-(Number(a.createdAt)||bookingStartMs(a)||0)).slice(0,10);
    if(!sorted.length){list.innerHTML='<div class="bookings-empty">No confirmed bookings yet.</div>';return}
    sorted.forEach(item=>{
      const card=document.createElement("article");card.className="booking-entry";
      const img=document.createElement("img");img.src=item.sisterImage||sisters()[0]||"";img.alt="Booked Bluia Sister";img.loading="lazy";
      const body=document.createElement("div");body.className="booking-entry-body";
      body.innerHTML=`<div class="booking-entry-top"><div class="booking-entry-name"></div><span class="booking-entry-badge">Confirmed</span></div><div class="booking-entry-time"></div><div class="booking-entry-zone booking-entry-paris"></div><div class="booking-entry-duration"></div><div class="booking-entry-id"></div><div class="booking-entry-countdown" data-start="" data-duration=""></div>`;
      const start=bookingStartMs(item);
      body.querySelector(".booking-entry-name").textContent=item.name||"Guest";
      body.querySelector(".booking-entry-time").textContent=`Your time · ${formatLocal(start)}`;
      body.querySelector(".booking-entry-paris").textContent=`Paris · ${formatZone(start,"Europe/Paris")}`;
      body.querySelector(".booking-entry-duration").textContent=`${Number(item.duration)||30} minute private chat`;
      body.querySelector(".booking-entry-id").textContent=item.sisterId?`Bluia Sister · ID ${item.sisterId}`:"Bluia Sister";
      const countdown=body.querySelector(".booking-entry-countdown");countdown.dataset.start=String(start||"");countdown.dataset.duration=String(Number(item.duration)||30);
      card.append(img,body);list.appendChild(card);
    });
    updateCountdowns();
  }

  async function ensureSisterIds(){
    if(!dbMod||!db)return;
    await Promise.all(sisters().map(async url=>{
      const ref=dbMod.ref(db,`sisterProfiles/${sisterKey(url)}`);
      try{
        const result=await dbMod.runTransaction(ref,current=>current&&current.id?current:{id:randomSisterId(),image:url,createdAt:Date.now()},{applyLocally:false});
        const value=result.snapshot.val()||{};if(value.id)sisterIds.set(url,value.id);
      }catch(err){console.warn("Bluia Sister ID setup failed",err)}
    }));
    updateSelectedSister();
  }

  async function initFirebase(){
    try{
      const [appMod,databaseMod]=await Promise.all([import(`https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/firebase-app.js`),import(`https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/firebase-database.js`)]);
      const app=appMod.getApps().length?appMod.getApp():appMod.initializeApp(firebaseConfig);
      dbMod=databaseMod;db=databaseMod.getDatabase(app);bookingsRef=databaseMod.ref(db,"chatBookings");
      await ensureSisterIds();
      databaseMod.onValue(bookingsRef,snap=>{
        const items=[];snap.forEach(c=>items.push({id:c.key,...(c.val()||{})}));existingBookings=items;renderBookings(items);
      },err=>{console.warn("Booking read failed",err);document.getElementById("bookings-list").innerHTML='<div class="bookings-empty">Bookings cannot be loaded right now.</div>'});
    }catch(err){console.warn("Firebase booking setup failed",err);document.getElementById("bookings-list").innerHTML='<div class="bookings-empty">Booking service is temporarily unavailable.</div>'}
  }

  function start(){addStyles();removeBottomModels();buildUI();initFirebase();if(countdownTimer)clearInterval(countdownTimer);countdownTimer=setInterval(updateCountdowns,1000)}
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start,{once:true});else start();
})();
