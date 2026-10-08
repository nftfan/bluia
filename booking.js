// Bluia Sisters private chat booking experience
(() => {
  "use strict";

  const FIREBASE_VERSION = "10.14.1";
  const BUY_PIN_URL = "https://buy.stripe.com/4gMbITgUo0jc1yF3F5bAs04";
  const PIN_HASH = "f8dc9104d6c66966c0a1b9dd7dd8327018b4882425ccaa90d5a69eef1d09997b";

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
    const s = document.createElement("style");
    s.id = "bluia-booking-style";
    s.textContent = `
      .media-tabs{grid-template-columns:repeat(5,minmax(0,1fr))!important;gap:5px!important}
      .booking-tab{border-color:#ff6ba7!important;color:#ff8fba!important;background:#211019!important}
      .booking-tab.active{border-color:#ff4f95!important;background:linear-gradient(135deg,#ff6aa8,#d93778)!important;color:#fff!important}
      #panel-booking{min-height:calc(100svh - 52px);padding:16px 12px 30px;background:radial-gradient(circle at 50% -10%,rgba(255,161,198,.24),transparent 34%),linear-gradient(180deg,#f14d8d 0%,#dc3f7c 42%,#ba2e67 100%)}
      .booking-shell{width:min(100%,460px);margin:0 auto;text-align:left}
      .booking-hero{text-align:center;color:#fff;padding:6px 8px 14px}
      .booking-hero .kicker{margin:0 0 6px;font-size:8px;font-weight:950;letter-spacing:1.1px;text-transform:uppercase;color:#ffd7e7}
      .booking-hero h2{margin:0 0 7px;font:700 25px/1.08 Georgia,"Times New Roman",serif;letter-spacing:-.45px}
      .booking-hero p{max-width:390px;margin:0 auto;color:#ffeaf2;font-size:10.5px;line-height:1.5}

      .booking-wizard{display:block;padding:13px;border:1px solid rgba(255,255,255,.24);border-radius:19px;background:rgba(24,6,14,.93);box-shadow:0 18px 48px rgba(76,5,32,.28)}
      .wizard-top{display:grid;grid-template-columns:94px minmax(0,1fr);gap:12px;align-items:stretch;margin-bottom:11px}
      .wizard-image{width:94px;aspect-ratio:2/3;object-fit:cover;object-position:top center;border-radius:12px;background:#211018;border:1px solid #5d3043}
      .wizard-copy{display:flex;flex-direction:column;justify-content:center;min-width:0}
      .wizard-copy small{margin-bottom:4px;color:#ff83b5;font-size:8px;font-weight:950;letter-spacing:.75px;text-transform:uppercase}
      .wizard-copy h3{margin:0 0 5px;color:#fff;font-size:17px}
      .wizard-copy p{margin:0;color:#cdb9c2;font-size:9.4px;line-height:1.42}
      .wizard-sister-id{margin-top:7px;color:#8f7d86;font-size:7px;line-height:1.2;letter-spacing:.45px;text-transform:uppercase}
      .wizard-label{display:block;margin:8px 0 4px;color:#e8d8df;font-size:8.5px;font-weight:850}
      .wizard-input,.wizard-select{width:100%;min-height:39px;padding:7px 9px;border:1px solid #583043;border-radius:10px;background:#10090d;color:#fff;font-size:16px;outline:none}
      .wizard-input:focus,.wizard-select:focus{border-color:#ff6aa8;box-shadow:0 0 0 2px rgba(255,106,168,.12)}
      .wizard-row{display:grid;grid-template-columns:1fr 1fr;gap:7px}
      .wizard-row .wizard-label{margin-top:7px}
      .wizard-time-preview{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:7px}
      .wizard-time-zone{padding:7px 8px;border:1px solid #34242b;border-radius:9px;background:#0d090b;color:#a997a0;font-size:7.8px;line-height:1.35}
      .wizard-time-zone strong{display:block;margin-bottom:2px;color:#ff83b5;font-size:7px;letter-spacing:.45px;text-transform:uppercase}
      .wizard-strip{display:grid;grid-auto-flow:column;grid-auto-columns:58px;gap:6px;overflow-x:auto;padding:2px 1px 4px;scrollbar-width:none}.wizard-strip::-webkit-scrollbar{display:none}
      .wizard-thumb{width:58px;aspect-ratio:2/3;padding:0;border:2px solid transparent;border-radius:9px;overflow:hidden;background:#241219;cursor:pointer}.wizard-thumb img{width:100%;height:100%;object-fit:cover;object-position:top center}.wizard-thumb.selected{border-color:#ff71ad;box-shadow:0 0 0 2px rgba(255,113,173,.14)}
      .wizard-note{margin:5px 1px 0;color:#91818a;font-size:7.5px}.wizard-book{width:100%;min-height:45px;margin-top:11px;border:0;border-radius:11px;background:linear-gradient(135deg,#ff6aa8,#d93679);color:#fff;font-size:11px;font-weight:950;cursor:pointer}.wizard-status{min-height:17px;margin-top:6px;color:#d6c4cc;font-size:8.5px;text-align:center}

      .bookings-heading{display:flex;align-items:center;justify-content:space-between;margin:17px 2px 9px;color:#fff}.bookings-heading strong{font-size:12px}.bookings-heading span{font-size:8px;color:#ffd1e1}
      .bookings-list{display:grid;gap:8px}.booking-entry{display:grid;grid-template-columns:72px minmax(0,1fr);overflow:hidden;border:1px solid rgba(255,255,255,.28);border-radius:14px;background:#fff;box-shadow:0 9px 24px rgba(89,7,40,.17)}
      .booking-entry img{display:block;width:72px;height:112px;object-fit:cover;object-position:top center;background:#eed6e0}.booking-entry-body{padding:9px 10px;min-width:0}
      .booking-entry-top{display:flex;align-items:center;justify-content:space-between;gap:7px;margin-bottom:4px}.booking-entry-name{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#ce3374;font-size:10.5px;font-weight:950}.booking-entry-badge{padding:3px 6px;border-radius:999px;background:#fff0f6;color:#cf3975;font-size:7px;font-weight:900}.booking-entry-time{color:#2c1821;font-size:9.5px;font-weight:850;line-height:1.4}.booking-entry-zone{margin-top:2px;color:#8c707c;font-size:7.6px;line-height:1.4}.booking-entry-duration{margin-top:3px;color:#8c707c;font-size:8.2px}.booking-entry-id{margin-top:4px;color:#b19aa4;font-size:7px;letter-spacing:.35px;text-transform:uppercase}.booking-entry-countdown{margin-top:5px;padding-top:5px;border-top:1px solid #f3d7e3;color:#cf3975;font-size:8px;font-weight:900}.booking-entry-countdown.live{color:#c51e65}.booking-entry-countdown.ended{color:#9d8790}
      .bookings-empty{padding:14px;border:1px dashed rgba(255,255,255,.45);border-radius:13px;color:#ffe9f1;font-size:9.5px;text-align:center}

      .pin-modal{position:fixed;inset:0;z-index:100001;display:flex;align-items:center;justify-content:center;padding:18px;background:rgba(0,0,0,.82);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);opacity:0;visibility:hidden;pointer-events:none;transition:.18s ease}.pin-modal.open{opacity:1;visibility:visible;pointer-events:auto}
      .pin-card{position:relative;width:min(92vw,340px);padding:20px 17px 17px;border:1px solid #563046;border-radius:20px;background:radial-gradient(circle at top right,rgba(255,97,158,.16),transparent 35%),linear-gradient(180deg,#161014,#0b090a);color:#fff;box-shadow:0 28px 80px rgba(0,0,0,.72)}
      .pin-close{position:absolute;top:10px;right:10px;width:32px;height:32px;border:1px solid #64364b;border-radius:50%;background:#211118;color:#fff;font-size:17px;cursor:pointer}.pin-icon{width:43px;height:43px;display:grid;place-items:center;margin-bottom:11px;border:1px solid #5d3044;border-radius:13px;background:#25121b;color:#ff6da8;font-size:18px}
      .pin-card h3{margin:0 42px 7px 0;font:700 19px/1.15 Georgia,"Times New Roman",serif}.pin-copy{margin:0 0 13px;color:#cdbbc3;font-size:10px;line-height:1.5}
      .pin-input{width:100%;min-height:49px;padding:10px 12px;border:1px solid #5c3346;border-radius:12px;background:#0c090a;color:#fff;font-size:19px;font-weight:900;letter-spacing:5px;text-align:center;outline:none}.pin-error{min-height:18px;margin:6px 0 0;color:#ff8db8;font-size:9px;text-align:center}.pin-confirm{width:100%;min-height:46px;margin-top:3px;border:0;border-radius:11px;background:linear-gradient(135deg,#ff68a5,#d83879);color:#fff;font-size:11px;font-weight:950;cursor:pointer}
      .pin-divider{height:1px;margin:14px 0;background:#38262f}.pin-help{margin:0 0 9px;color:#aa98a0;font-size:9px;line-height:1.45}.pin-buy{min-height:42px;display:flex;align-items:center;justify-content:center;border:1px solid #69501d;border-radius:11px;background:linear-gradient(135deg,#e7c75f,#b88828);color:#160f04;text-decoration:none;font-size:10.5px;font-weight:950}.pin-email-note{margin:8px 2px 0;color:#8e7d85;font-size:8.5px;line-height:1.4;text-align:center}
      @media(max-width:370px){.media-tab{padding:0 6px!important;font-size:8.7px!important}.wizard-top{grid-template-columns:82px minmax(0,1fr)}.wizard-image{width:82px}.booking-entry{grid-template-columns:64px minmax(0,1fr)}.booking-entry img{width:64px;height:104px}}
    `;
    document.head.appendChild(s);
  }

  function removeBottomModels(){
    document.querySelector('.sub-tab[data-subpanel="models"]')?.remove();
    document.getElementById("subpanel-models")?.remove();
    const tabs = document.querySelector(".sub-tabs");
    if (tabs) {
      const n = tabs.querySelectorAll(".sub-tab").length;
      if (n) tabs.style.gridTemplateColumns = `repeat(${n},1fr)`;
    }
  }

  function viewerTimeZone(){
    try{return Intl.DateTimeFormat().resolvedOptions().timeZone || "Local"}catch(e){return "Local"}
  }

  function localDate(){
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
  }

  function defaultTime(){
    const d = new Date(Date.now()+3600000);
    d.setMinutes(Math.ceil(d.getMinutes()/30)*30,0,0);
    return `${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
  }

  function localStartMs(date,time){
    const d=new Date(`${date||""}T${time||""}`);
    return Number.isNaN(d.getTime()) ? NaN : d.getTime();
  }

  function sisterKey(url){
    let hash = 2166136261;
    for (let i=0;i<url.length;i++) {
      hash ^= url.charCodeAt(i);
      hash = Math.imul(hash,16777619);
    }
    return `s_${(hash>>>0).toString(36)}`;
  }

  function randomSisterId(){
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let out = "";
    const bytes = new Uint8Array(4);
    crypto.getRandomValues(bytes);
    for (let i=0;i<4;i++) out += chars[bytes[i] % chars.length];
    return out;
  }

  function updateSelectedSisterId(){
    const el = document.getElementById("wizard-sister-id");
    if (!el) return;
    const id = sisterIds.get(selectedSister);
    el.textContent = id ? `ID ${id}` : "ID …";
  }

  function slotNumber(date,time){
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date||"");
    const t = /^(\d{2}):(\d{2})$/.exec(time||"");
    if (!m || !t) return NaN;
    return Date.UTC(Number(m[1]),Number(m[2])-1,Number(m[3]),Number(t[1]),Number(t[2])) / 60000;
  }

  function bookingStartMs(item){
    if(Number.isFinite(Number(item?.startAtMs))) return Number(item.startAtMs);
    if(Number.isFinite(Number(item?.startSlot))) return Number(item.startSlot) * 60000;
    return localStartMs(item?.date,item?.time);
  }

  function bookingBounds(item){
    const start = bookingStartMs(item);
    const duration = Math.max(1,Number(item?.duration)||30) * 60000;
    return {start,end:start+duration};
  }

  function sameSister(a,b){
    if (a.sisterId && b.sisterId) return a.sisterId === b.sisterId;
    return (a.sisterImage||"") === (b.sisterImage||"");
  }

  function overlapsExisting(candidate,items=existingBookings){
    const a = bookingBounds(candidate);
    if (!Number.isFinite(a.start)) return false;
    return items.some(item => {
      if (!sameSister(candidate,item)) return false;
      const b = bookingBounds(item);
      if (!Number.isFinite(b.start)) return false;
      return a.start < b.end && a.end > b.start;
    });
  }

  function formatZone(ms,timeZone){
    if(!Number.isFinite(ms)) return "Time unavailable";
    try{
      return new Intl.DateTimeFormat(undefined,{timeZone,weekday:"short",month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"}).format(new Date(ms));
    }catch(e){
      return new Date(ms).toLocaleString();
    }
  }

  function formatLocal(ms){
    if(!Number.isFinite(ms)) return "Time unavailable";
    try{
      return new Intl.DateTimeFormat(undefined,{weekday:"short",month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"}).format(new Date(ms));
    }catch(e){
      return new Date(ms).toLocaleString();
    }
  }

  function updateTimePreview(){
    const wrap=document.getElementById("wizard-time-preview");
    if(!wrap)return;
    const date=document.getElementById("booking-date")?.value||"";
    const time=document.getElementById("booking-time")?.value||"";
    const ms=localStartMs(date,time);
    if(!Number.isFinite(ms)){
      wrap.innerHTML="";
      return;
    }
    wrap.innerHTML=`<div class="wizard-time-zone"><strong>Your time</strong>${formatLocal(ms)}<br>${viewerTimeZone()}</div><div class="wizard-time-zone"><strong>Paris time</strong>${formatZone(ms,"Europe/Paris")}<br>Europe/Paris</div>`;
  }

  function compactRemaining(ms){
    const total=Math.max(0,Math.floor(ms/1000));
    const days=Math.floor(total/86400);
    const hours=Math.floor((total%86400)/3600);
    const minutes=Math.floor((total%3600)/60);
    const seconds=total%60;
    if(days>0)return `${days}d ${hours}h ${minutes}m`;
    if(hours>0)return `${hours}h ${minutes}m ${seconds}s`;
    return `${minutes}m ${seconds}s`;
  }

  function updateCountdowns(){
    const now=Date.now();
    document.querySelectorAll(".booking-entry-countdown[data-start]").forEach(el=>{
      const start=Number(el.dataset.start||0);
      const duration=Math.max(1,Number(el.dataset.duration||30))*60000;
      const end=start+duration;
      el.classList.remove("live","ended");
      if(!Number.isFinite(start)||!start){el.textContent="Schedule unavailable";return}
      if(now<start){el.textContent=`Starts in ${compactRemaining(start-now)}`;return}
      if(now<end){el.textContent=`Chat live · ${compactRemaining(end-now)} remaining`;el.classList.add("live");return}
      el.textContent="Chat ended";el.classList.add("ended");
    });
  }

  function buildUI(){
    if (document.getElementById("panel-booking")) return;
    const nav = document.querySelector(".media-tabs");
    const main = document.querySelector("main");
    if (!nav || !main) return;

    const tab = document.createElement("button");
    tab.className = "media-tab booking-tab";
    tab.type = "button";
    tab.dataset.panel = "booking";
    tab.textContent = "Chat";
    nav.insertBefore(tab,nav.firstElementChild);

    const panel = document.createElement("section");
    panel.className = "media-panel";
    panel.id = "panel-booking";
    panel.innerHTML = `
      <div class="booking-shell">
        <div class="booking-hero">
          <div class="kicker">Private chat booking</div>
          <h2>Chat with Bluia Sisters 💗</h2>
          <p>Choose a Bluia Sister below, select your date and time in your own timezone, then confirm your private booking with a PIN.</p>
        </div>

        <div class="booking-wizard" id="booking-wizard">
          <div class="wizard-top">
            <img class="wizard-image" id="wizard-image" alt="Selected Bluia Sister">
            <div class="wizard-copy">
              <small>Bluia Sister</small>
              <h3>Booking details</h3>
              <p>Your booking time is shown in your local timezone and Paris time.</p>
              <div class="wizard-sister-id" id="wizard-sister-id">ID …</div>
            </div>
          </div>

          <label class="wizard-label">Choose Bluia Sister</label>
          <div class="wizard-strip" id="wizard-strip"></div>

          <label class="wizard-label" for="booking-name">Your name</label>
          <input class="wizard-input" id="booking-name" type="text" maxlength="50" autocomplete="name" placeholder="Your name">

          <div class="wizard-row">
            <div><label class="wizard-label" for="booking-date">Date · your time</label><input class="wizard-input" id="booking-date" type="date"></div>
            <div><label class="wizard-label" for="booking-time">Time · your time</label><input class="wizard-input" id="booking-time" type="time" step="900"></div>
          </div>
          <div class="wizard-time-preview" id="wizard-time-preview"></div>

          <label class="wizard-label" for="booking-duration">Chat duration</label>
          <select class="wizard-select" id="booking-duration"><option value="15">15 minutes</option><option value="30" selected>30 minutes</option><option value="45">45 minutes</option><option value="60">60 minutes</option></select>
          <div class="wizard-note">30 minutes is selected by default. Overlapping bookings for the same Bluia Sister are blocked.</div>
          <button class="wizard-book" id="wizard-book" type="button">Book Private Chat</button>
          <div class="wizard-status" id="wizard-status" aria-live="polite"></div>
        </div>

        <div class="bookings-heading"><strong>Bookings</strong><span>Your time · Paris time · live countdown</span></div>
        <div class="bookings-list" id="bookings-list"><div class="bookings-empty">Loading bookings…</div></div>
      </div>`;

    main.insertBefore(panel,main.querySelector(".page-content") || null);

    const modal = document.createElement("div");
    modal.className = "pin-modal";
    modal.id = "pin-modal";
    modal.innerHTML = `<div class="pin-card" role="dialog" aria-modal="true"><button class="pin-close" id="pin-close" type="button" aria-label="Close">×</button><div class="pin-icon">✦</div><h3>Enter your booking PIN</h3><p class="pin-copy">Enter the PIN you received for Bluia Sisters private chat booking.</p><input class="pin-input" id="pin-input" type="password" inputmode="numeric" maxlength="6" autocomplete="one-time-code" placeholder="••••••"><div class="pin-error" id="pin-error"></div><button class="pin-confirm" id="pin-confirm" type="button">Confirm Booking</button><div class="pin-divider"></div><p class="pin-help"><strong style="color:#fff">Need a PIN?</strong><br>Buy your booking PIN securely through Stripe. You will receive the PIN at the email address used during checkout.</p><a class="pin-buy" href="${BUY_PIN_URL}" target="_blank" rel="noopener noreferrer">Buy Booking PIN</a><p class="pin-email-note">Use an email address you can access. Your booking PIN will be delivered there.</p></div>`;
    document.body.appendChild(modal);

    renderSisterStrip();
    setupDefaults();
    setupActions(tab,panel);

    const first = sisters()[0];
    if (first) selectSister(first,false);
  }

  function renderSisterStrip(){
    const strip = document.getElementById("wizard-strip");
    sisters().forEach((url,i) => {
      const t=document.createElement("button");
      t.type="button";
      t.className="wizard-thumb";
      t.dataset.url=url;
      t.setAttribute("aria-label",`Choose Bluia Sister ${i+1}`);
      t.innerHTML=`<img src="${url}" alt="Bluia Sister ${i+1}" loading="lazy" decoding="async">`;
      t.onclick=()=>selectSister(url,false);
      strip?.appendChild(t);
    });
  }

  function selectSister(url){
    selectedSister=url;
    document.querySelectorAll(".wizard-thumb").forEach(x=>x.classList.toggle("selected",x.dataset.url===url));
    const img=document.getElementById("wizard-image");
    if(img) img.src=url;
    updateSelectedSisterId();
  }

  function setupDefaults(){
    const date=document.getElementById("booking-date"), time=document.getElementById("booking-time");
    if(date){date.min=localDate();date.value=localDate()}
    if(time) time.value=defaultTime();
    updateTimePreview();
  }

  function setupActions(tab,panel){
    tab.onclick=()=>{
      document.querySelectorAll(".media-tab").forEach(x=>x.classList.toggle("active",x===tab));
      document.querySelectorAll(".media-panel").forEach(x=>x.classList.toggle("active",x===panel));
      document.getElementById("tv-video")?.pause();
      document.getElementById("reel-video")?.pause();
    };
    document.querySelectorAll(".media-tab:not(.booking-tab)").forEach(x=>x.addEventListener("click",()=>{tab.classList.remove("active");panel.classList.remove("active")}));
    document.getElementById("wizard-book")?.addEventListener("click",prepareBooking);
    document.getElementById("booking-date")?.addEventListener("change",updateTimePreview);
    document.getElementById("booking-time")?.addEventListener("change",updateTimePreview);
    document.getElementById("booking-time")?.addEventListener("input",updateTimePreview);
    document.getElementById("pin-close")?.addEventListener("click",closePin);
    document.getElementById("pin-modal")?.addEventListener("click",e=>{if(e.target.id==="pin-modal")closePin()});
    document.getElementById("pin-confirm")?.addEventListener("click",confirmPin);
    document.getElementById("pin-input")?.addEventListener("keydown",e=>{if(e.key==="Enter")confirmPin()});
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

    const startSlot=slotNumber(date,time);
    const candidate={
      name:name.slice(0,50),
      sisterImage:selectedSister,
      sisterId,
      date,
      time,
      duration,
      startSlot,
      startAtMs,
      visitorTimeZone:viewerTimeZone(),
      visitorOffsetMinutes:new Date(startAtMs).getTimezoneOffset(),
      createdAt:Date.now()
    };
    if(overlapsExisting(candidate)){
      status.textContent="That Bluia Sister is already booked during this time. Please choose another time.";
      return;
    }

    pendingBooking=candidate;
    status.textContent="";
    openPin();
  }

  function openPin(){
    const m=document.getElementById("pin-modal"),i=document.getElementById("pin-input"),e=document.getElementById("pin-error");
    if(i)i.value="";
    if(e)e.textContent="";
    m?.classList.add("open");
    setTimeout(()=>i?.focus(),100);
  }

  function closePin(){document.getElementById("pin-modal")?.classList.remove("open")}

  async function hashText(text){
    const data=new TextEncoder().encode(text);
    const hash=await crypto.subtle.digest("SHA-256",data);
    return [...new Uint8Array(hash)].map(b=>b.toString(16).padStart(2,"0")).join("");
  }

  async function confirmPin(){
    const input=document.getElementById("pin-input"), error=document.getElementById("pin-error"), button=document.getElementById("pin-confirm"), status=document.getElementById("wizard-status");
    if(await hashText((input?.value||"").trim())!==PIN_HASH){error.textContent="Incorrect PIN. Check the PIN sent to your email.";input?.focus();return}
    if(!pendingBooking||!bookingsRef||!dbMod){error.textContent="Booking service is not ready. Please try again.";return}

    button.disabled=true;
    button.textContent="Confirming…";

    try{
      const newKey=dbMod.push(bookingsRef).key;
      let overlap=false;
      const result=await dbMod.runTransaction(bookingsRef,current=>{
        overlap=false;
        const source=current&&typeof current==="object"?current:{};
        const items=Object.values(source).filter(Boolean);
        if(overlapsExisting(pendingBooking,items)){
          overlap=true;
          return;
        }
        return {...source,[newKey]:pendingBooking};
      },{applyLocally:false});

      if(!result.committed){
        if(overlap){
          error.textContent="This time was just booked by someone else. Please choose another time.";
          closePin();
          status.textContent="That Bluia Sister is no longer available at this time.";
        }else{
          error.textContent="Could not confirm this booking. Please try again.";
        }
        return;
      }

      closePin();
      status.textContent="Booking confirmed 💗";
      document.getElementById("booking-name").value="";
      pendingBooking=null;
    }catch(err){
      console.warn("Booking save failed",err);
      error.textContent="Could not save your booking. Please try again.";
    }finally{
      button.disabled=false;
      button.textContent="Confirm Booking";
    }
  }

  function renderBookings(items){
    const list=document.getElementById("bookings-list");
    if(!list)return;
    list.innerHTML="";
    if(!items.length){list.innerHTML='<div class="bookings-empty">No bookings yet. Choose a Bluia Sister above to book the first private chat.</div>';return}
    items.forEach(item=>{
      const card=document.createElement("article");
      card.className="booking-entry";
      const img=document.createElement("img");
      img.src=item.sisterImage||sisters()[0]||"";
      img.alt="Booked Bluia Sister";
      img.loading="lazy";
      const body=document.createElement("div");
      body.className="booking-entry-body";
      body.innerHTML=`<div class="booking-entry-top"><div class="booking-entry-name"></div><span class="booking-entry-badge">Confirmed</span></div><div class="booking-entry-time"></div><div class="booking-entry-zone booking-entry-paris"></div><div class="booking-entry-duration"></div><div class="booking-entry-id"></div><div class="booking-entry-countdown" data-start="" data-duration=""></div>`;
      const start=bookingStartMs(item);
      body.querySelector(".booking-entry-name").textContent=item.name||"Guest";
      body.querySelector(".booking-entry-time").textContent=`Your time · ${formatLocal(start)}`;
      body.querySelector(".booking-entry-paris").textContent=`Paris · ${formatZone(start,"Europe/Paris")}`;
      body.querySelector(".booking-entry-duration").textContent=`${Number(item.duration)||30} minute private chat`;
      body.querySelector(".booking-entry-id").textContent=item.sisterId?`Bluia Sister · ID ${item.sisterId}`:"Bluia Sister";
      const countdown=body.querySelector(".booking-entry-countdown");
      countdown.dataset.start=String(start||"");
      countdown.dataset.duration=String(Number(item.duration)||30);
      card.append(img,body);
      list.appendChild(card);
    });
    updateCountdowns();
  }

  async function ensureSisterIds(){
    if(!dbMod||!db)return;
    await Promise.all(sisters().map(async url=>{
      const key=sisterKey(url);
      const ref=dbMod.ref(db,`sisterProfiles/${key}`);
      try{
        const result=await dbMod.runTransaction(ref,current=>{
          if(current&&current.id)return current;
          return {id:randomSisterId(),image:url,createdAt:Date.now()};
        },{applyLocally:false});
        const value=result.snapshot.val()||{};
        if(value.id)sisterIds.set(url,value.id);
      }catch(err){
        console.warn("Bluia Sister ID setup failed",err);
      }
    }));
    updateSelectedSisterId();
  }

  async function initFirebase(){
    try{
      const [appMod,databaseMod]=await Promise.all([
        import(`https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/firebase-app.js`),
        import(`https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/firebase-database.js`)
      ]);
      const app=appMod.getApps().length?appMod.getApp():appMod.initializeApp({projectId:"bluias",databaseURL:"https://bluias-default-rtdb.firebaseio.com"});
      dbMod=databaseMod;
      db=databaseMod.getDatabase(app);
      bookingsRef=databaseMod.ref(db,"chatBookings");

      await ensureSisterIds();

      databaseMod.onValue(bookingsRef,snap=>{
        const items=[];
        snap.forEach(c=>items.push({id:c.key,...(c.val()||{})}));
        existingBookings=items;
        items.sort((a,b)=>{
          const aa=bookingBounds(a).start;
          const bb=bookingBounds(b).start;
          return (Number.isFinite(aa)?aa:0)-(Number.isFinite(bb)?bb:0);
        });
        renderBookings(items);
      },err=>{
        console.warn("Booking read failed",err);
        document.getElementById("bookings-list").innerHTML='<div class="bookings-empty">Bookings cannot be loaded right now.</div>';
      });
    }catch(err){
      console.warn("Firebase booking setup failed",err);
      document.getElementById("bookings-list").innerHTML='<div class="bookings-empty">Booking service is temporarily unavailable.</div>';
    }
  }

  function start(){
    addStyles();
    removeBottomModels();
    buildUI();
    initFirebase();
    if(countdownTimer)clearInterval(countdownTimer);
    countdownTimer=setInterval(updateCountdowns,1000);
  }

  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start,{once:true});
  else start();
})();
