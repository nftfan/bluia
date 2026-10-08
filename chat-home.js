(() => {
  "use strict";

  const FREE_TELEGRAM_URL = "https://t.me/vbluia";
  const PREMIUM_TELEGRAM_URL = "https://t.me/+vieXRo_X9rM5NzRk";
  const PROFILE_BASE = "https://bluias-default-rtdb.firebaseio.com/sisterProfiles";

  const models = () => Array.isArray(window.BluiaMedia?.models) ? window.BluiaMedia.models : [];
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  let selectedIndex = 0;
  let profileRequest = 0;

  function sisterKey(url){
    let hash = 2166136261;
    for(let i=0;i<url.length;i++){
      hash ^= url.charCodeAt(i);
      hash = Math.imul(hash,16777619);
    }
    return `s_${(hash>>>0).toString(36)}`;
  }

  function addStyles(){
    if($("#bluia-chat-home-style")) return;
    const style = document.createElement("style");
    style.id = "bluia-chat-home-style";
    style.textContent = `
      .media-tabs{grid-template-columns:repeat(5,minmax(0,1fr))!important;gap:5px!important}
      .chat-home-tab{border-color:#ff6ba7!important;color:#ff8fba!important;background:#211019!important}
      .chat-home-tab.active{border-color:#ff4f95!important;background:linear-gradient(135deg,#ff6aa8,#d93778)!important;color:#fff!important}
      #panel-chat-home{min-height:calc(100svh - 52px);padding:14px 0 32px;background:linear-gradient(180deg,#f4518f 0%,#e74282 54%,#ca306c 100%)}
      .chat-home-shell{width:100%;margin:0;text-align:left}
      .chat-home-main{display:grid;grid-template-columns:158px minmax(0,1fr);gap:16px;align-items:stretch;padding:0 14px 12px}
      .chat-home-photo{display:block;width:158px;aspect-ratio:2/3;object-fit:cover;object-position:top center;border:1px solid rgba(255,255,255,.38);border-radius:16px;background:#d9457f;box-shadow:0 10px 24px rgba(83,7,37,.16)}
      .chat-home-copy{display:flex;flex-direction:column;justify-content:center;min-width:0}
      .chat-home-kicker{margin:0 0 5px;color:#ffd4e4;font-size:7px;line-height:1.2;font-weight:950;letter-spacing:.9px;text-transform:uppercase}
      .chat-home-title{margin:0 0 7px;color:#fff;font-size:11px;line-height:1.3;font-weight:950}
      .chat-home-text{margin:0 0 7px;color:#ffe8f0;font-size:9px;line-height:1.46}
      .chat-home-detail{margin:0 0 3px;color:#66152f;font-size:8px;font-weight:950}
      .chat-home-small{margin:0;color:#ffe2ec;font-size:8px;line-height:1.42}
      .chat-home-id{margin-top:7px;color:#6c1c39;font-size:7px;letter-spacing:.45px;text-transform:uppercase}
      .chat-home-actions{display:flex;align-items:stretch;gap:7px;margin-top:10px;width:100%}
      .chat-home-book{min-height:43px;display:flex;align-items:center;justify-content:center;gap:7px;flex:1 1 auto;min-width:0;border:1px solid rgba(255,255,255,.94);border-radius:12px;background:#fff;color:#dd3f7b;text-decoration:none;font-size:10.5px;font-weight:950;box-shadow:0 7px 18px rgba(87,10,40,.14);transition:transform .14s ease}
      .chat-home-book:active,.chat-home-telegram:active{transform:scale(.975)}
      .chat-home-book svg{width:15px;height:15px;fill:currentColor;flex:0 0 15px}
      .chat-home-telegram{display:flex;align-items:center;justify-content:center;flex:0 0 43px;width:43px;min-height:43px;border:1px solid rgba(255,255,255,.94);border-radius:12px;background:#fff;color:#229ed9;text-decoration:none;box-shadow:0 7px 18px rgba(87,10,40,.14);transition:transform .14s ease}
      .chat-home-telegram svg{display:block;width:18px;height:18px;fill:currentColor}
      .chat-home-slider-wrap{padding:0 14px 4px}
      .chat-home-slider-label{display:flex;align-items:center;justify-content:space-between;gap:8px;margin:0 0 7px;color:#fff}
      .chat-home-slider-label strong{font-size:9px}.chat-home-slider-label span{color:#ffd6e5;font-size:7px}
      .chat-home-slider{display:flex;gap:7px;overflow-x:auto;overscroll-behavior-inline:contain;padding:1px 1px 7px;scrollbar-width:none;scroll-snap-type:x proximity;-webkit-overflow-scrolling:touch}
      .chat-home-slider::-webkit-scrollbar{display:none}
      .chat-home-thumb{flex:0 0 64px;width:64px;aspect-ratio:2/3;padding:0;border:2px solid transparent;border-radius:11px;overflow:hidden;background:#ba2c65;cursor:pointer;scroll-snap-align:start;box-shadow:0 5px 14px rgba(88,7,39,.12)}
      .chat-home-thumb img{display:block;width:100%;height:100%;object-fit:cover;object-position:top center}
      .chat-home-thumb.selected{border-color:#fff;box-shadow:0 0 0 2px rgba(255,255,255,.16),0 6px 16px rgba(88,7,39,.18)}
      .premium-telegram-info{width:min(calc(100% - 28px),440px);margin:10px auto 0;padding:10px 2px 2px;text-align:left}
      .premium-telegram-kicker{margin:0 0 3px;color:#d7b24b;font-size:8px;font-weight:950;letter-spacing:.7px;text-transform:uppercase}
      .premium-telegram-title{margin:0 0 5px;color:#fff;font-size:11px;font-weight:900}
      .premium-telegram-copy{margin:0 0 7px;color:#bfaeb6;font-size:9px;line-height:1.5}
      .premium-telegram-price{margin:0 0 8px;color:#e2c25b;font-size:9px;font-weight:900}
      .premium-telegram-button{min-height:42px;display:flex;align-items:center;justify-content:center;width:100%;border:1px solid #6b5421;border-radius:11px;background:linear-gradient(135deg,#e6c65c,#b88928);color:#140f04;text-decoration:none;font-size:10.5px;font-weight:950}
      @media(max-width:390px){.chat-home-main{grid-template-columns:142px minmax(0,1fr);gap:12px;padding-left:11px;padding-right:11px}.chat-home-photo{width:142px}.chat-home-slider-wrap{padding-left:11px;padding-right:11px}}
      @media(max-width:340px){.chat-home-main{grid-template-columns:125px minmax(0,1fr);gap:10px}.chat-home-photo{width:125px}.chat-home-text{font-size:8.3px}.chat-home-book{font-size:9.5px}}
      @media(prefers-reduced-motion:reduce){.chat-home-book,.chat-home-telegram{transition:none!important}}
    `;
    document.head.appendChild(style);
  }

  function removeLegacyBottomTabs(){
    $(".sub-tab[data-subpanel='models']")?.remove();
    $("#subpanel-models")?.remove();
    $(".sub-tab[data-subpanel='love']")?.remove();
    $("#subpanel-love")?.remove();
    const tabs = $(".sub-tabs");
    if(tabs && !tabs.querySelector(".sub-tab")) tabs.remove();
  }

  function applyPremiumTelegram(){
    const freeButton = $(".telegram-button");
    if(!freeButton || $("#premium-telegram-info")) return;
    const wrap = document.createElement("div");
    wrap.id = "premium-telegram-info";
    wrap.className = "premium-telegram-info";
    wrap.innerHTML = `<div class="premium-telegram-kicker">Premium Telegram</div><div class="premium-telegram-title">More from Bluia Sisters</div><p class="premium-telegram-copy">Get behind-the-scenes posts, exclusive photo and video updates, and extra Bluia Sisters content.</p><div class="premium-telegram-price">500 Telegram Stars / month</div><a class="premium-telegram-button" href="${PREMIUM_TELEGRAM_URL}" target="_blank" rel="noopener noreferrer">Join Premium Telegram</a>`;
    freeButton.insertAdjacentElement("afterend",wrap);
  }

  function activateChat(tab,panel){
    $$(".media-tab").forEach(x => x.classList.toggle("active",x===tab));
    $$(".media-panel").forEach(x => x.classList.toggle("active",x===panel));
    $("#tv-video")?.pause();
    $("#reel-video")?.pause();
  }

  async function loadProfileId(index,url){
    const request = ++profileRequest;
    const id = $("#chat-home-id");
    if(id) id.textContent = "ID …";
    try{
      const response = await fetch(`${PROFILE_BASE}/${sisterKey(url)}.json`,{cache:"no-store"});
      const value = response.ok ? await response.json() : null;
      if(request !== profileRequest || index !== selectedIndex) return;
      if(id) id.textContent = value?.id ? `ID ${value.id}` : "Bluia Sister";
    }catch(e){
      if(request === profileRequest && index === selectedIndex && id) id.textContent = "Bluia Sister";
    }
  }

  function selectSister(index){
    const list = models();
    if(!list.length) return;
    selectedIndex = Math.max(0,Math.min(Number(index)||0,list.length-1));
    const url = list[selectedIndex];
    const image = $("#chat-home-photo");
    const booking = $("#chat-home-book");
    if(image && image.getAttribute("src") !== url) image.src = url;
    if(booking) booking.href = `/booking?s=${selectedIndex}`;
    $$(".chat-home-thumb").forEach((button,i) => button.classList.toggle("selected",i===selectedIndex));
    try{localStorage.setItem("bluiaBookingSisterIndex",String(selectedIndex));}catch(e){}
    loadProfileId(selectedIndex,url);
  }

  function renderSlider(){
    const slider = $("#chat-home-slider");
    if(!slider) return;
    const fragment = document.createDocumentFragment();
    models().forEach((url,index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "chat-home-thumb";
      button.setAttribute("aria-label",`Choose Bluia Sister ${index+1}`);
      const img = document.createElement("img");
      img.src = url;
      img.alt = `Bluia Sister ${index+1}`;
      img.loading = index < 4 ? "eager" : "lazy";
      img.decoding = "async";
      button.appendChild(img);
      button.addEventListener("click",() => selectSister(index));
      fragment.appendChild(button);
    });
    slider.replaceChildren(fragment);
  }

  function buildChat(){
    if($("#panel-chat-home")) return;
    const nav = $(".media-tabs");
    const main = $("main");
    if(!nav || !main) return;

    const tab = document.createElement("button");
    tab.type = "button";
    tab.className = "media-tab chat-home-tab";
    tab.textContent = "Chat";
    nav.insertBefore(tab,nav.firstElementChild);

    const panel = document.createElement("section");
    panel.className = "media-panel";
    panel.id = "panel-chat-home";
    panel.innerHTML = `
      <div class="chat-home-shell">
        <div class="chat-home-main">
          <img class="chat-home-photo" id="chat-home-photo" alt="Selected Bluia Sister" decoding="async" fetchpriority="high">
          <div class="chat-home-copy">
            <div class="chat-home-kicker">Private chat</div>
            <div class="chat-home-title">Chat with Bluia Sisters 💗</div>
            <p class="chat-home-text">Choose a Bluia Sister below, then book a private chat at a time that works for you.</p>
            <div class="chat-home-detail">Booking</div>
            <p class="chat-home-small">Tap Book private chat to choose your date, time and duration on the booking page.</p>
            <div class="chat-home-id" id="chat-home-id">ID …</div>
            <div class="chat-home-actions">
              <a class="chat-home-book" id="chat-home-book" href="/booking"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16v12H8l-4 4V4Zm3 4v2h10V8H7Zm0 4v2h7v-2H7Z"/></svg><span>Book private chat</span></a>
              <a class="chat-home-telegram" href="${FREE_TELEGRAM_URL}" target="_blank" rel="noopener noreferrer" aria-label="Open free Bluia Sisters Telegram" title="Telegram"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21.8 3.2 18.7 20c-.23 1.18-.85 1.47-1.72.92l-4.72-3.48-2.28 2.19c-.25.25-.46.46-.95.46l.34-4.81 8.76-7.91c.38-.34-.08-.53-.59-.19L6.71 14 2.04 12.54c-1.02-.32-1.04-1.02.21-1.51L20.5 4c.85-.31 1.59.19 1.3-.8Z"/></svg></a>
            </div>
          </div>
        </div>
        <div class="chat-home-slider-wrap">
          <div class="chat-home-slider-label"><strong>Choose a Bluia Sister</strong><span>Tap a photo</span></div>
          <div class="chat-home-slider" id="chat-home-slider"></div>
        </div>
      </div>`;
    main.insertBefore(panel,main.querySelector(".page-content") || null);

    renderSlider();
    tab.addEventListener("click",() => activateChat(tab,panel));
    $$(".media-tab:not(.chat-home-tab)").forEach(other => other.addEventListener("click",() => {
      tab.classList.remove("active");
      panel.classList.remove("active");
    }));

    let initial = 0;
    try{
      const stored = Number(localStorage.getItem("bluiaBookingSisterIndex"));
      if(Number.isInteger(stored)) initial = stored;
    }catch(e){}
    selectSister(initial);
    requestAnimationFrame(() => activateChat(tab,panel));
  }

  function start(){
    addStyles();
    removeLegacyBottomTabs();
    buildChat();
    applyPremiumTelegram();
    if(!$("#premium-telegram-info")) setTimeout(applyPremiumTelegram,180);
  }

  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded",start,{once:true});
  else start();
})();