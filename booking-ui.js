// Bluia Sisters runtime helpers: Premium Telegram, model cleanup, complete booking feed, and Chat Telegram shortcut
(() => {
  "use strict";

  const FIREBASE_VERSION = "10.14.1";
  const FREE_TELEGRAM_URL = "https://t.me/vbluia";
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

  let allBookings = [];
  let bookingWatchStarted = false;

  function addStyles(){
    if(document.getElementById("bluia-premium-telegram-style"))return;
    const style=document.createElement("style");
    style.id="bluia-premium-telegram-style";
    style.textContent=`
      .premium-telegram-info{width:100%;margin:10px 0 0;padding:10px 2px 2px;text-align:left}
      .premium-telegram-kicker{margin:0 0 3px;color:#d7b24b;font-size:8px;font-weight:950;letter-spacing:.7px;text-transform:uppercase}
      .premium-telegram-title{margin:0 0 5px;color:#fff;font-size:11px;font-weight:900}
      .premium-telegram-copy{margin:0 0 7px;color:#bfaeb6;font-size:9px;line-height:1.5}
      .premium-telegram-price{margin:0 0 8px;color:#e2c25b;font-size:9px;font-weight:900}
      .premium-telegram-button{min-height:42px;display:flex;align-items:center;justify-content:center;width:100%;border:1px solid #6b5421;border-radius:11px;background:linear-gradient(135deg,#e6c65c,#b88928);color:#140f04;text-decoration:none;font-size:10.5px;font-weight:950;box-shadow:0 8px 24px rgba(196,153,49,.18)}
      .chat-actions-row{display:flex;align-items:stretch;gap:7px;margin-top:10px;width:100%}
      .chat-actions-row .chat-open-button{flex:1 1 auto;width:auto!important;margin-top:0!important;min-width:0}
      .chat-telegram-button{display:flex;align-items:center;justify-content:center;flex:0 0 43px;width:43px;min-height:43px;border:1px solid rgba(255,255,255,.92);border-radius:12px;background:#fff;color:#229ed9;text-decoration:none;box-shadow:0 9px 24px rgba(87,10,40,.18);transition:transform .16s ease,box-shadow .16s ease}
      .chat-telegram-button:active{transform:scale(.97)}
      .chat-telegram-button svg{display:block;width:18px;height:18px;fill:currentColor}
    `;
    document.head.appendChild(style);
  }

  function applyPremiumTelegram(){
    const freeButton=document.querySelector(".telegram-button");
    if(!freeButton)return false;

    const lovePanel=document.getElementById("subpanel-love");
    const premiumHref=lovePanel?.querySelector("a[href]")?.href||"https://t.me/+vieXRo_X9rM5NzRk";

    document.querySelector('.sub-tab[data-subpanel="love"]')?.remove();
    lovePanel?.remove();
    const subTabs=document.querySelector(".sub-tabs");
    if(subTabs&&!subTabs.querySelector(".sub-tab"))subTabs.remove();

    addStyles();
    if(document.getElementById("premium-telegram-info"))return true;

    const wrap=document.createElement("div");
    wrap.className="premium-telegram-info";
    wrap.id="premium-telegram-info";
    wrap.innerHTML=`
      <div class="premium-telegram-kicker">Premium Telegram</div>
      <div class="premium-telegram-title">More from Bluia Sisters</div>
      <p class="premium-telegram-copy">Get behind-the-scenes posts, exclusive photo and video updates, and extra Bluia Sisters content.</p>
      <div class="premium-telegram-price">500 Telegram Stars / month</div>
      <a class="premium-telegram-button" target="_blank" rel="noopener noreferrer">Join Premium Telegram</a>`;
    wrap.querySelector("a").href=premiumHref;
    freeButton.insertAdjacentElement("afterend",wrap);
    return true;
  }

  function applyChatTelegramButton(){
    addStyles();
    const chatButton=document.querySelector("#panel-booking .chat-open-button");
    if(!chatButton)return false;
    if(document.getElementById("chat-telegram-button"))return true;

    const row=document.createElement("div");
    row.className="chat-actions-row";
    chatButton.parentNode.insertBefore(row,chatButton);
    row.appendChild(chatButton);

    const telegram=document.createElement("a");
    telegram.id="chat-telegram-button";
    telegram.className="chat-telegram-button";
    telegram.href=FREE_TELEGRAM_URL;
    telegram.target="_blank";
    telegram.rel="noopener noreferrer";
    telegram.setAttribute("aria-label","Open free Bluia Sisters Telegram");
    telegram.title="Telegram";
    telegram.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21.8 3.2 18.7 20c-.23 1.18-.85 1.47-1.72.92l-4.72-3.48-2.28 2.19c-.25.25-.46.46-.95.46l.34-4.81 8.76-7.91c.38-.34-.08-.53-.59-.19L6.71 14 2.04 12.54c-1.02-.32-1.04-1.02.21-1.51L20.5 4c.85-.31 1.59.19 1.3-.8Z"/></svg>';
    row.appendChild(telegram);
    return true;
  }

  function removeFirstModel(){
    const models=window.BluiaMedia?.models;
    if(!Array.isArray(models)||!models.length)return false;

    if(!window.__bluiaRemovedFirstModel){
      window.__bluiaRemovedFirstModel=models.shift();
    }
    const removed=window.__bluiaRemovedFirstModel;

    document.querySelectorAll(".chat-sister-thumb").forEach(button=>{
      if(button.dataset.url===removed)button.remove();
    });

    const main=document.getElementById("chat-main-photo");
    if(main&&removed&&main.src===removed){
      const first=document.querySelector(".chat-sister-thumb");
      if(first)first.click();
      else if(models[0])main.src=models[0];
    }

    return true;
  }

  function bookingStartMs(item){
    const direct=Number(item?.startAtMs);
    if(Number.isFinite(direct)&&direct>0)return direct;
    const date=item?.date||"";
    const time=item?.time||"";
    const parsed=new Date(`${date}T${time}`);
    return Number.isNaN(parsed.getTime())?NaN:parsed.getTime();
  }

  function formatLocal(ms){
    if(!Number.isFinite(ms))return "Time unavailable";
    try{return new Intl.DateTimeFormat(undefined,{weekday:"short",month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"}).format(new Date(ms));}
    catch(e){return new Date(ms).toLocaleString();}
  }

  function formatParis(ms){
    if(!Number.isFinite(ms))return "Time unavailable";
    try{return new Intl.DateTimeFormat(undefined,{timeZone:"Europe/Paris",weekday:"short",month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"}).format(new Date(ms));}
    catch(e){return new Date(ms).toLocaleString();}
  }

  function renderAllBookings(items){
    const list=document.getElementById("bookings-list");
    if(!list)return false;

    const sorted=[...items].sort((a,b)=>{
      const ac=Number(a.createdAt)||bookingStartMs(a)||0;
      const bc=Number(b.createdAt)||bookingStartMs(b)||0;
      return bc-ac;
    });

    const heading=document.querySelector("#panel-booking .bookings-heading");
    if(heading){
      const strong=heading.querySelector("strong");
      const meta=heading.querySelector("span");
      if(strong)strong.textContent="Bookings";
      if(meta)meta.textContent=sorted.length?`${sorted.length} confirmed · newest first`:"All confirmed bookings";
    }

    list.innerHTML="";
    if(!sorted.length){
      list.innerHTML='<div class="bookings-empty">No confirmed bookings yet.</div>';
      return true;
    }

    sorted.forEach(item=>{
      const card=document.createElement("article");
      card.className="booking-entry";

      const img=document.createElement("img");
      img.src=item.sisterImage||window.BluiaMedia?.models?.[0]||"";
      img.alt="Booked Bluia Sister";
      img.loading="lazy";

      const body=document.createElement("div");
      body.className="booking-entry-body";
      body.innerHTML=`<div class="booking-entry-top"><div class="booking-entry-name"></div><span class="booking-entry-badge">Confirmed</span></div><div class="booking-entry-time"></div><div class="booking-entry-zone booking-entry-paris"></div><div class="booking-entry-duration"></div><div class="booking-entry-id"></div><div class="booking-entry-countdown" data-start="" data-duration=""></div>`;

      const start=bookingStartMs(item);
      body.querySelector(".booking-entry-name").textContent=item.name||"Guest";
      body.querySelector(".booking-entry-time").textContent=`Your time · ${formatLocal(start)}`;
      body.querySelector(".booking-entry-paris").textContent=`Paris · ${formatParis(start)}`;
      body.querySelector(".booking-entry-duration").textContent=`${Number(item.duration)||30} minute private chat`;
      body.querySelector(".booking-entry-id").textContent=item.sisterId?`Bluia Sister · ID ${item.sisterId}`:"Bluia Sister";

      const countdown=body.querySelector(".booking-entry-countdown");
      countdown.dataset.start=String(Number.isFinite(start)?start:"");
      countdown.dataset.duration=String(Number(item.duration)||30);

      card.append(img,body);
      list.appendChild(card);
    });
    return true;
  }

  function keepCompleteBookingList(){
    if(!allBookings.length)return;
    setTimeout(()=>renderAllBookings(allBookings),0);
    setTimeout(()=>renderAllBookings(allBookings),120);
  }

  async function watchBookings(){
    if(bookingWatchStarted)return;
    bookingWatchStarted=true;
    try{
      const [appMod,dbMod]=await Promise.all([
        import(`https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/firebase-app.js`),
        import(`https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/firebase-database.js`)
      ]);

      let app=appMod.getApps().find(x=>x.name==="bluia-booking-feed");
      if(!app)app=appMod.initializeApp(firebaseConfig,"bluia-booking-feed");
      const db=dbMod.getDatabase(app);
      const ref=dbMod.ref(db,"chatBookings");

      dbMod.onValue(ref,snapshot=>{
        const items=[];
        snapshot.forEach(child=>items.push({id:child.key,...(child.val()||{})}));
        allBookings=items;
        if(allBookings.length)keepCompleteBookingList();
        else renderAllBookings([]);
      },error=>{
        console.warn("Complete booking feed failed",error);
        const list=document.getElementById("bookings-list");
        if(list)list.innerHTML='<div class="bookings-empty">Bookings could not be loaded right now.</div>';
      });
    }catch(error){
      console.warn("Booking feed setup failed",error);
      bookingWatchStarted=false;
    }
  }

  function applyChatFixes(){
    removeFirstModel();
    applyChatTelegramButton();
    watchBookings();
    if(allBookings.length)keepCompleteBookingList();
  }

  function start(){
    applyPremiumTelegram();
    applyChatFixes();

    const observer=new MutationObserver(()=>{
      applyPremiumTelegram();
      removeFirstModel();
      applyChatTelegramButton();
      if(allBookings.length)keepCompleteBookingList();
    });
    observer.observe(document.documentElement,{childList:true,subtree:true});

    setInterval(()=>{
      removeFirstModel();
      applyChatTelegramButton();
      if(allBookings.length)renderAllBookings(allBookings);
    },3000);
  }

  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start,{once:true});
  else start();
})();
