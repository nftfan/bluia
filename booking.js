// Bluia Sisters private chat booking experience
(() => {
  "use strict";

  const FIREBASE_VERSION = "10.14.1";
  const BUY_PIN_URL = "https://buy.stripe.com/4gMbITgUo0jc1yF3F5bAs04";
  const PIN_HASH = "f8dc9104d6c66966c0a1b9dd7dd8327018b4882425ccaa90d5a69eef1d09997b";
  let selectedSister = "";
  let pendingBooking = null;
  let dbMod = null;
  let bookingsRef = null;

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
      .booking-hero{text-align:center;color:#fff;padding:6px 8px 15px}
      .booking-hero .kicker{margin:0 0 6px;font-size:8px;font-weight:950;letter-spacing:1.1px;text-transform:uppercase;color:#ffd7e7}
      .booking-hero h2{margin:0 0 7px;font:700 25px/1.08 Georgia,"Times New Roman",serif;letter-spacing:-.45px}
      .booking-hero p{max-width:390px;margin:0 auto;color:#ffeaf2;font-size:10.5px;line-height:1.5}
      .booking-model-title{display:flex;align-items:end;justify-content:space-between;gap:10px;margin:0 2px 8px;color:#fff}
      .booking-model-title strong{font-size:12px}.booking-model-title span{font-size:8.5px;color:#ffd4e4}
      .booking-model-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px}
      .booking-model-card{position:relative;width:100%;aspect-ratio:2/3;padding:0;border:1px solid rgba(255,255,255,.28);border-radius:13px;overflow:hidden;background:#34101f;cursor:pointer;box-shadow:0 8px 22px rgba(90,8,39,.18)}
      .booking-model-card img{display:block;width:100%;height:100%;object-fit:cover;object-position:top center}
      .booking-model-card:after{content:"Chat";position:absolute;left:6px;right:6px;bottom:6px;min-height:22px;display:grid;place-items:center;border:1px solid rgba(255,255,255,.22);border-radius:999px;background:rgba(20,5,12,.72);color:#fff;font-size:8px;font-weight:900}
      .booking-model-card.selected{border-color:#fff;box-shadow:0 0 0 2px rgba(255,255,255,.22),0 10px 26px rgba(90,8,39,.25)}

      .booking-wizard{display:none;margin-top:14px;padding:14px;border:1px solid rgba(255,255,255,.24);border-radius:19px;background:rgba(24,6,14,.93);box-shadow:0 18px 48px rgba(76,5,32,.28)}
      .booking-wizard.open{display:block}
      .wizard-top{display:grid;grid-template-columns:100px minmax(0,1fr);gap:13px;align-items:stretch;margin-bottom:13px}
      .wizard-image{width:100%;aspect-ratio:2/3;object-fit:cover;object-position:top center;border-radius:12px;background:#211018;border:1px solid #5d3043}
      .wizard-copy{display:flex;flex-direction:column;justify-content:center}.wizard-copy small{margin-bottom:5px;color:#ff83b5;font-size:8px;font-weight:950;letter-spacing:.8px;text-transform:uppercase}
      .wizard-copy h3{margin:0 0 6px;color:#fff;font-size:17px}.wizard-copy p{margin:0;color:#cdb9c2;font-size:9.7px;line-height:1.45}
      .wizard-label{display:block;margin:10px 0 5px;color:#e8d8df;font-size:9px;font-weight:850}
      .wizard-input,.wizard-select{width:100%;min-height:44px;padding:10px 11px;border:1px solid #583043;border-radius:11px;background:#10090d;color:#fff;font-size:16px;outline:none}
      .wizard-input:focus,.wizard-select:focus{border-color:#ff6aa8;box-shadow:0 0 0 2px rgba(255,106,168,.12)}
      .wizard-row{display:grid;grid-template-columns:1fr 1fr;gap:8px}
      .wizard-strip{display:grid;grid-auto-flow:column;grid-auto-columns:62px;gap:6px;overflow-x:auto;padding:2px 1px 5px;scrollbar-width:none}.wizard-strip::-webkit-scrollbar{display:none}
      .wizard-thumb{width:62px;aspect-ratio:2/3;padding:0;border:2px solid transparent;border-radius:9px;overflow:hidden;background:#241219;cursor:pointer}.wizard-thumb img{width:100%;height:100%;object-fit:cover;object-position:top center}.wizard-thumb.selected{border-color:#ff71ad}
      .wizard-note{margin:6px 1px 0;color:#a997a0;font-size:8.5px}.wizard-book{width:100%;min-height:48px;margin-top:13px;border:0;border-radius:12px;background:linear-gradient(135deg,#ff6aa8,#d93679);color:#fff;font-size:11.5px;font-weight:950;cursor:pointer}.wizard-status{min-height:18px;margin-top:7px;color:#d6c4cc;font-size:9px;text-align:center}

      .bookings-heading{display:flex;align-items:center;justify-content:space-between;margin:18px 2px 9px;color:#fff}.bookings-heading strong{font-size:12px}.bookings-heading span{font-size:8px;color:#ffd1e1}
      .bookings-list{display:grid;gap:8px}.booking-entry{display:grid;grid-template-columns:72px minmax(0,1fr);overflow:hidden;border:1px solid rgba(255,255,255,.28);border-radius:14px;background:#fff;box-shadow:0 9px 24px rgba(89,7,40,.17)}
      .booking-entry img{display:block;width:72px;height:96px;object-fit:cover;object-position:top center;background:#eed6e0}.booking-entry-body{padding:10px 11px;min-width:0}
      .booking-entry-top{display:flex;align-items:center;justify-content:space-between;gap:7px;margin-bottom:5px}.booking-entry-name{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#ce3374;font-size:10.5px;font-weight:950}.booking-entry-badge{padding:3px 6px;border-radius:999px;background:#fff0f6;color:#cf3975;font-size:7px;font-weight:900}.booking-entry-time{color:#2c1821;font-size:10px;font-weight:850;line-height:1.4}.booking-entry-duration{margin-top:4px;color:#8c707c;font-size:8.5px}
      .bookings-empty{padding:14px;border:1px dashed rgba(255,255,255,.45);border-radius:13px;color:#ffe9f1;font-size:9.5px;text-align:center}

      .pin-modal{position:fixed;inset:0;z-index:100001;display:flex;align-items:center;justify-content:center;padding:18px;background:rgba(0,0,0,.82);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);opacity:0;visibility:hidden;pointer-events:none;transition:.18s ease}.pin-modal.open{opacity:1;visibility:visible;pointer-events:auto}
      .pin-card{position:relative;width:min(92vw,340px);padding:20px 17px 17px;border:1px solid #563046;border-radius:20px;background:radial-gradient(circle at top right,rgba(255,97,158,.16),transparent 35%),linear-gradient(180deg,#161014,#0b090a);color:#fff;box-shadow:0 28px 80px rgba(0,0,0,.72)}
      .pin-close{position:absolute;top:10px;right:10px;width:32px;height:32px;border:1px solid #64364b;border-radius:50%;background:#211118;color:#fff;font-size:17px;cursor:pointer}.pin-icon{width:43px;height:43px;display:grid;place-items:center;margin-bottom:11px;border:1px solid #5d3044;border-radius:13px;background:#25121b;color:#ff6da8;font-size:18px}
      .pin-card h3{margin:0 42px 7px 0;font:700 19px/1.15 Georgia,"Times New Roman",serif}.pin-copy{margin:0 0 13px;color:#cdbbc3;font-size:10px;line-height:1.5}
      .pin-input{width:100%;min-height:49px;padding:10px 12px;border:1px solid #5c3346;border-radius:12px;background:#0c090a;color:#fff;font-size:19px;font-weight:900;letter-spacing:5px;text-align:center;outline:none}.pin-error{min-height:18px;margin:6px 0 0;color:#ff8db8;font-size:9px;text-align:center}.pin-confirm{width:100%;min-height:46px;margin-top:3px;border:0;border-radius:11px;background:linear-gradient(135deg,#ff68a5,#d83879);color:#fff;font-size:11px;font-weight:950;cursor:pointer}
      .pin-divider{height:1px;margin:14px 0;background:#38262f}.pin-help{margin:0 0 9px;color:#aa98a0;font-size:9px;line-height:1.45}.pin-buy{min-height:42px;display:flex;align-items:center;justify-content:center;border:1px solid #69501d;border-radius:11px;background:linear-gradient(135deg,#e7c75f,#b88828);color:#160f04;text-decoration:none;font-size:10.5px;font-weight:950}.pin-email-note{margin:8px 2px 0;color:#8e7d85;font-size:8.5px;line-height:1.4;text-align:center}
      @media(max-width:370px){.media-tab{padding:0 6px!important;font-size:8.7px!important}.wizard-top{grid-template-columns:88px minmax(0,1fr)}.booking-entry{grid-template-columns:64px minmax(0,1fr)}.booking-entry img{width:64px;height:88px}}
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

  function localDate(){
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
  }

  function defaultTime(){
    const d = new Date(Date.now()+3600000);
    d.setMinutes(Math.ceil(d.getMinutes()/30)*30,0,0);
    return `${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
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
          <p>Click on any Bluia Sister to chat. Choose your date and time, then confirm your private booking with a PIN.</p>
        </div>
        <div class="booking-model-title"><strong>Choose a Bluia Sister</strong><span>Tap a profile to start</span></div>
        <div class="booking-model-grid" id="booking-model-grid"></div>

        <div class="booking-wizard" id="booking-wizard">
          <div class="wizard-top"><img class="wizard-image" id="wizard-image" alt="Selected Bluia Sister"><div class="wizard-copy"><small>Booking details</small><h3>Book your private chat</h3><p>Select the Bluia Sister, your preferred date and time, then confirm with your booking PIN.</p></div></div>
          <label class="wizard-label">Choose Bluia Sister</label><div class="wizard-strip" id="wizard-strip"></div>
          <label class="wizard-label" for="booking-name">Your name</label><input class="wizard-input" id="booking-name" type="text" maxlength="50" autocomplete="name" placeholder="Your name">
          <div class="wizard-row"><div><label class="wizard-label" for="booking-date">Date</label><input class="wizard-input" id="booking-date" type="date"></div><div><label class="wizard-label" for="booking-time">Time</label><input class="wizard-input" id="booking-time" type="time" step="900"></div></div>
          <label class="wizard-label" for="booking-duration">Chat duration</label><select class="wizard-select" id="booking-duration"><option value="15">15 minutes</option><option value="30" selected>30 minutes</option><option value="45">45 minutes</option><option value="60">60 minutes</option></select>
          <div class="wizard-note">30 minutes is selected by default.</div>
          <button class="wizard-book" id="wizard-book" type="button">Book Private Chat</button><div class="wizard-status" id="wizard-status" aria-live="polite"></div>
        </div>

        <div class="bookings-heading"><strong>Bookings</strong><span>All confirmed bookings</span></div>
        <div class="bookings-list" id="bookings-list"><div class="bookings-empty">Loading bookings…</div></div>
      </div>`;

    main.insertBefore(panel,main.querySelector(".page-content") || null);

    const modal = document.createElement("div");
    modal.className = "pin-modal";
    modal.id = "pin-modal";
    modal.innerHTML = `<div class="pin-card" role="dialog" aria-modal="true"><button class="pin-close" id="pin-close" type="button" aria-label="Close">×</button><div class="pin-icon">✦</div><h3>Enter your booking PIN</h3><p class="pin-copy">Enter the PIN you received for Bluia Sisters private chat booking.</p><input class="pin-input" id="pin-input" type="password" inputmode="numeric" maxlength="6" autocomplete="one-time-code" placeholder="••••••"><div class="pin-error" id="pin-error"></div><button class="pin-confirm" id="pin-confirm" type="button">Confirm Booking</button><div class="pin-divider"></div><p class="pin-help"><strong style="color:#fff">Need a PIN?</strong><br>Buy your booking PIN securely through Stripe. You will receive the PIN at the email address used during checkout.</p><a class="pin-buy" href="${BUY_PIN_URL}" target="_blank" rel="noopener noreferrer">Buy Booking PIN</a><p class="pin-email-note">Use an email address you can access. Your booking PIN will be delivered there.</p></div>`;
    document.body.appendChild(modal);

    renderSisters();
    setupDefaults();
    setupActions(tab,panel);
  }

  function renderSisters(){
    const grid = document.getElementById("booking-model-grid");
    const strip = document.getElementById("wizard-strip");
    sisters().forEach((url,i) => {
      const b = document.createElement("button");
      b.type="button"; b.className="booking-model-card"; b.dataset.url=url; b.setAttribute("aria-label",`Book Bluia Sister ${i+1}`);
      b.innerHTML=`<img src="${url}" alt="Bluia Sister ${i+1}" loading="lazy" decoding="async">`;
      b.onclick=()=>selectSister(url,true); grid?.appendChild(b);
      const t=document.createElement("button"); t.type="button"; t.className="wizard-thumb"; t.dataset.url=url; t.innerHTML=`<img src="${url}" alt="Bluia Sister ${i+1}" loading="lazy" decoding="async">`; t.onclick=()=>selectSister(url,false); strip?.appendChild(t);
    });
  }

  function selectSister(url,scroll){
    selectedSister=url;
    document.querySelectorAll(".booking-model-card").forEach(x=>x.classList.toggle("selected",x.dataset.url===url));
    document.querySelectorAll(".wizard-thumb").forEach(x=>x.classList.toggle("selected",x.dataset.url===url));
    const img=document.getElementById("wizard-image"), wizard=document.getElementById("booking-wizard");
    if(img) img.src=url; wizard?.classList.add("open");
    if(scroll) setTimeout(()=>wizard?.scrollIntoView({behavior:"smooth",block:"start"}),60);
  }

  function setupDefaults(){
    const date=document.getElementById("booking-date"), time=document.getElementById("booking-time");
    if(date){date.min=localDate();date.value=localDate()} if(time) time.value=defaultTime();
  }

  function setupActions(tab,panel){
    tab.onclick=()=>{document.querySelectorAll(".media-tab").forEach(x=>x.classList.toggle("active",x===tab));document.querySelectorAll(".media-panel").forEach(x=>x.classList.toggle("active",x===panel));document.getElementById("tv-video")?.pause();document.getElementById("reel-video")?.pause()};
    document.querySelectorAll(".media-tab:not(.booking-tab)").forEach(x=>x.addEventListener("click",()=>{tab.classList.remove("active");panel.classList.remove("active")}));
    document.getElementById("wizard-book")?.addEventListener("click",prepareBooking);
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
    if(!selectedSister){status.textContent="Choose a Bluia Sister first.";return}
    if(!name){status.textContent="Enter your name.";document.getElementById("booking-name")?.focus();return}
    if(!date||!time){status.textContent="Choose a date and time.";return}
    const moment=new Date(`${date}T${time}`); if(!Number.isNaN(moment.getTime())&&moment.getTime()<Date.now()-60000){status.textContent="Choose a future booking time.";return}
    pendingBooking={name:name.slice(0,50),sisterImage:selectedSister,date,time,duration,createdAt:Date.now()}; status.textContent=""; openPin();
  }

  function openPin(){const m=document.getElementById("pin-modal"),i=document.getElementById("pin-input"),e=document.getElementById("pin-error");if(i)i.value="";if(e)e.textContent="";m?.classList.add("open");setTimeout(()=>i?.focus(),100)}
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
    button.disabled=true;button.textContent="Confirming…";
    try{const ref=dbMod.push(bookingsRef);await dbMod.set(ref,pendingBooking);closePin();status.textContent="Booking confirmed 💗";document.getElementById("booking-name").value="";pendingBooking=null}catch(err){console.warn("Booking save failed",err);error.textContent="Could not save your booking. Please try again."}finally{button.disabled=false;button.textContent="Confirm Booking"}
  }

  function bookingText(date,time){const d=new Date(`${date}T${time}`);if(Number.isNaN(d.getTime()))return `${date} · ${time}`;try{return new Intl.DateTimeFormat(undefined,{weekday:"short",month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"}).format(d)}catch(e){return `${date} · ${time}`}}

  function renderBookings(items){
    const list=document.getElementById("bookings-list"); if(!list)return; list.innerHTML="";
    if(!items.length){list.innerHTML='<div class="bookings-empty">No bookings yet. Choose a Bluia Sister above to book the first private chat.</div>';return}
    items.forEach(item=>{
      const card=document.createElement("article");card.className="booking-entry";
      const img=document.createElement("img");img.src=item.sisterImage||sisters()[0]||"";img.alt="Booked Bluia Sister";img.loading="lazy";
      const body=document.createElement("div");body.className="booking-entry-body";
      body.innerHTML=`<div class="booking-entry-top"><div class="booking-entry-name"></div><span class="booking-entry-badge">Confirmed</span></div><div class="booking-entry-time"></div><div class="booking-entry-duration"></div>`;
      body.querySelector(".booking-entry-name").textContent=item.name||"Guest";
      body.querySelector(".booking-entry-time").textContent=bookingText(item.date||"",item.time||"");
      body.querySelector(".booking-entry-duration").textContent=`${Number(item.duration)||30} minute private chat`;
      card.append(img,body);list.appendChild(card);
    });
  }

  async function initFirebase(){
    try{
      const [appMod,databaseMod]=await Promise.all([import(`https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/firebase-app.js`),import(`https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/firebase-database.js`)]);
      const app=appMod.getApps().length?appMod.getApp():appMod.initializeApp({projectId:"bluias",databaseURL:"https://bluias-default-rtdb.firebaseio.com"});
      dbMod=databaseMod;const db=databaseMod.getDatabase(app);bookingsRef=databaseMod.ref(db,"chatBookings");
      databaseMod.onValue(bookingsRef,snap=>{const items=[];snap.forEach(c=>items.push({id:c.key,...(c.val()||{})}));items.sort((a,b)=>(new Date(`${a.date||""}T${a.time||"00:00"}`).getTime()||a.createdAt||0)-(new Date(`${b.date||""}T${b.time||"00:00"}`).getTime()||b.createdAt||0));renderBookings(items)},err=>{console.warn("Booking read failed",err);document.getElementById("bookings-list").innerHTML='<div class="bookings-empty">Bookings cannot be loaded right now.</div>'});
    }catch(err){console.warn("Firebase booking setup failed",err);document.getElementById("bookings-list").innerHTML='<div class="bookings-empty">Booking service is temporarily unavailable.</div>'}
  }

  function start(){addStyles();removeBottomModels();buildUI();initFirebase()}
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start,{once:true});else start();
})();
