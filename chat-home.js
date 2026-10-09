(() => {
  "use strict";

  const KISS_IMAGE_URL = "https://huggingface.co/buckets/veebluia/bluiaimages/resolve/ChatGPT%20Image%20Oct%208%2C%202026%2C%2009_45_20%20PM.png?download=true";
  const SNIFF_IMAGE_URL = "https://huggingface.co/buckets/veebluia/bluiaimages/resolve/ChatGPT%20Image%20Oct%209%2C%202026%2C%2001_11_13%20PM.png?download=true";
  const STRIPE_URL = "https://buy.stripe.com/4gMbITgUo0jc1yF3F5bAs04";
  const FREE_TELEGRAM_URL = "https://t.me/vbluia";
  const PREMIUM_TELEGRAM_URL = "https://t.me/+vieXRo_X9rM5NzRk";

  const models = () => Array.isArray(window.BluiaMedia?.models) ? window.BluiaMedia.models : [];
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  let selectedIndex = 0;

  const kissIcon = `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M3.4 11.1c2.2-2.6 4.6-4 7-4.1 1.2 0 2.1.4 2.8 1.1.7-.7 1.7-1.1 2.8-1.1 2.2.1 4.1 1.5 5.7 4.1-2.9 3.8-6.1 5.8-9.4 5.9-3.3-.1-6.2-2.1-8.9-5.9Zm3.1.3c1.9 1.7 3.8 2.6 5.8 2.7 2-.1 4-.9 5.9-2.7-1-.9-2-1.4-3-1.4-1 0-1.9.4-2.8 1.2-.9-.8-1.8-1.2-2.8-1.2-1 0-2.1.5-3.1 1.4Z"/>
    </svg>`;
  const sniffIcon = `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M13.3 3.2c.8 2.2.8 4.3.1 6.2-.4 1.1-1 2.2-1.8 3.3-.5.7-.7 1.3-.5 1.7.2.4.8.7 1.8.7h2.4c1.4 0 2.3.7 2.3 1.8 0 1.5-1.5 3-3.6 3-1.5 0-2.8-.7-3.6-1.9l1.5-1c.5.7 1.2 1.1 2.1 1.1 1 0 1.7-.6 1.8-1.1-.1-.1-.3-.1-.6-.1h-2.4c-1.8 0-3-.6-3.5-1.8-.5-1.2-.2-2.4.8-3.8.7-1 1.2-1.9 1.5-2.7.5-1.5.5-3.1-.1-4.8l1.8-.6ZM5 6.5c1.6 0 3 .8 3.9 2.1l-1.5 1C6.8 8.8 6 8.4 5 8.4V6.5Zm14 0v1.9c-1 0-1.8.4-2.4 1.2l-1.5-1c.9-1.3 2.3-2.1 3.9-2.1Z"/>
    </svg>`;
  const telegramIcon = `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M21.7 3.4 18.6 20c-.2 1.1-.8 1.4-1.7.9l-4.7-3.5-2.3 2.2c-.3.3-.5.5-1 .5l.3-4.8 8.8-7.9c.4-.3-.1-.5-.6-.2L6.7 14l-4.7-1.5c-1-.3-1-1 .2-1.5L20.5 4c.8-.3 1.5.2 1.2-.6Z"/>
    </svg>`;
  const premiumIcon = `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="m12 2.8 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 2.8Zm0 4.1-1.5 3.1-3.4.5 2.5 2.4-.6 3.4 3-1.6 3 1.6-.6-3.4 2.5-2.4-3.4-.5L12 6.9Z"/>
    </svg>`;
  const lockIcon = `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M7 10V8a5 5 0 0 1 10 0v2h1.5A1.5 1.5 0 0 1 20 11.5v8A1.5 1.5 0 0 1 18.5 21h-13A1.5 1.5 0 0 1 4 19.5v-8A1.5 1.5 0 0 1 5.5 10H7Zm2 0h6V8a3 3 0 0 0-6 0v2Zm3 3a2 2 0 0 0-1 3.7V19h2v-2.3a2 2 0 0 0-1-3.7Z"/>
    </svg>`;

  function addStyles(){
    $("#bluia-chat-home-style")?.remove();
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
      .chat-home-small{margin:0;color:#6d1b3a;font-size:8px;line-height:1.42;font-weight:850}
      .play-actions{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px;margin-top:10px;width:100%}
      .kiss-button,.sniff-button{min-height:43px;display:flex;align-items:center;justify-content:center;gap:7px;width:100%;border:1px solid rgba(255,255,255,.96);border-radius:12px;background:#fff;font-size:10.5px;font-weight:950;cursor:pointer;box-shadow:0 7px 18px rgba(87,10,40,.14);transition:transform .14s ease,box-shadow .14s ease}
      .kiss-button{color:#dd3f7b}
      .sniff-button{color:#bd8900}
      .kiss-button:active,.sniff-button:active{transform:scale(.975)}
      .kiss-button svg,.sniff-button svg{width:17px;height:17px;fill:currentColor;flex:0 0 17px}
      .chat-home-slider-wrap{padding:0 14px 4px}
      .chat-home-slider-label{display:flex;align-items:center;justify-content:space-between;gap:8px;margin:0 0 7px;color:#fff}
      .chat-home-slider-label strong{font-size:9px}.chat-home-slider-label span{color:#ffd6e5;font-size:7px}
      .chat-home-slider{display:flex;gap:7px;overflow-x:auto;overscroll-behavior-inline:contain;padding:1px 1px 7px;scrollbar-width:none;scroll-snap-type:x proximity;-webkit-overflow-scrolling:touch}
      .chat-home-slider::-webkit-scrollbar{display:none}
      .chat-home-thumb{flex:0 0 64px;width:64px;aspect-ratio:2/3;padding:0;border:2px solid transparent;border-radius:11px;overflow:hidden;background:#ba2c65;cursor:pointer;scroll-snap-align:start;box-shadow:0 5px 14px rgba(88,7,39,.12)}
      .chat-home-thumb img{display:block;width:100%;height:100%;object-fit:cover;object-position:top center}
      .chat-home-thumb.selected{border-color:#fff;box-shadow:0 0 0 2px rgba(255,255,255,.16),0 6px 16px rgba(88,7,39,.18)}
      .telegram-groups{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;padding:7px 14px 0}
      .telegram-group{min-width:0;display:flex;align-items:center;gap:8px;padding:10px;border:1px solid rgba(255,255,255,.32);border-radius:13px;background:rgba(255,255,255,.94);text-decoration:none;box-shadow:0 7px 18px rgba(87,10,40,.10);transition:transform .14s ease}
      .telegram-group:active{transform:scale(.98)}
      .telegram-group-icon{width:30px;height:30px;display:grid;place-items:center;flex:0 0 30px;border-radius:9px}
      .telegram-group-icon svg{width:17px;height:17px;fill:currentColor}
      .telegram-group.free{color:#229ed9}
      .telegram-group.free .telegram-group-icon{background:#eaf7fd}
      .telegram-group.premium{color:#b88928}
      .telegram-group.premium .telegram-group-icon{background:#fff6d7}
      .telegram-group-copy{min-width:0;display:flex;flex-direction:column;gap:2px}
      .telegram-group-copy strong{color:#25131b;font-size:9px;line-height:1.15;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .telegram-group-copy span{color:#7d6871;font-size:7px;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .kiss-modal{position:fixed;inset:0;z-index:100005;display:grid;place-items:center;padding:16px;background:rgba(0,0,0,.84);opacity:0;visibility:hidden;pointer-events:none;transition:opacity .16s ease,visibility .16s ease}
      .kiss-modal.open{opacity:1;visibility:visible;pointer-events:auto}
      .kiss-modal-card{position:relative;width:min(94vw,410px);max-height:92dvh;overflow:auto;border:1px solid #60364b;border-radius:20px;background:#120d10;box-shadow:0 28px 80px rgba(0,0,0,.65)}
      .kiss-close{position:absolute;z-index:2;top:9px;right:9px;width:34px;height:34px;border:1px solid rgba(255,255,255,.35);border-radius:50%;background:rgba(12,8,10,.84);color:#fff;font-size:20px;line-height:1;cursor:pointer}
      .kiss-preview{display:block;width:100%;height:auto;border-radius:19px}
      .unlock-card{padding:25px 18px 18px;text-align:center}
      .unlock-icon{width:48px;height:48px;display:grid;place-items:center;margin:0 auto 12px;border-radius:15px;background:#2b1320;color:#ff74aa}
      .unlock-icon svg{width:23px;height:23px;fill:currentColor}
      .unlock-card h3{margin:0 0 7px;color:#fff;font-size:17px}
      .unlock-card p{margin:0 auto 15px;max-width:280px;color:#bca9b2;font-size:9.5px;line-height:1.55}
      .unlock-member{min-height:46px;display:flex;align-items:center;justify-content:center;border-radius:12px;background:linear-gradient(135deg,#ed5b96,#c93370);color:#fff;text-decoration:none;font-size:11px;font-weight:950}
      @media(max-width:390px){.chat-home-main{grid-template-columns:142px minmax(0,1fr);gap:12px;padding-left:11px;padding-right:11px}.chat-home-photo{width:142px}.chat-home-slider-wrap,.telegram-groups{padding-left:11px;padding-right:11px}}
      @media(max-width:340px){.chat-home-main{grid-template-columns:125px minmax(0,1fr);gap:10px}.chat-home-photo{width:125px}.chat-home-text{font-size:8.3px}.kiss-button,.sniff-button{font-size:9.5px}.telegram-group{padding:8px 7px;gap:6px}.telegram-group-icon{width:27px;height:27px;flex-basis:27px}}
      @media(prefers-reduced-motion:reduce){.kiss-button,.sniff-button,.telegram-group,.kiss-modal{transition:none!important}}
    `;
    document.head.appendChild(style);
  }

  function cleanupOldUi(){
    $(".sub-tab[data-subpanel='models']")?.remove();
    $("#subpanel-models")?.remove();
    $(".sub-tab[data-subpanel='love']")?.remove();
    $("#subpanel-love")?.remove();
    $(".telegram-button")?.remove();
    $("#premium-telegram-info")?.remove();
    $$(".premium-telegram-info,.premium-telegram-button,.chat-home-telegram,.chat-home-book").forEach(el => el.remove());
    const tabs = $(".sub-tabs");
    if(tabs && !tabs.querySelector(".sub-tab")) tabs.remove();
  }

  function activatePlay(tab,panel){
    $$(".media-tab").forEach(x => x.classList.toggle("active",x===tab));
    $$(".media-panel").forEach(x => x.classList.toggle("active",x===panel));
    $("#tv-video")?.pause();
    $("#reel-video")?.pause();
  }

  function selectSister(index){
    const list = models();
    if(!list.length) return;
    selectedIndex = Math.max(0,Math.min(Number(index)||0,list.length-1));
    const url = list[selectedIndex];
    const image = $("#chat-home-photo");
    if(image && image.getAttribute("src") !== url) image.src = url;
    $$(".chat-home-thumb").forEach((button,i) => button.classList.toggle("selected",i===selectedIndex));
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

  function setModal(modal,open){
    if(!modal) return;
    modal.classList.toggle("open",open);
    modal.setAttribute("aria-hidden",open ? "false" : "true");
    document.documentElement.style.overflow = open ? "hidden" : "";
  }

  function openKiss(){
    if(selectedIndex === 0){
      const img = $("#kiss-special-image");
      if(img && img.getAttribute("src") !== KISS_IMAGE_URL) img.src = KISS_IMAGE_URL;
      setModal($("#kiss-image-modal"),true);
    } else {
      setModal($("#kiss-unlock-modal"),true);
    }
  }

  function openSniff(){
    if(selectedIndex === 0){
      const img = $("#sniff-special-image");
      if(img && img.getAttribute("src") !== SNIFF_IMAGE_URL) img.src = SNIFF_IMAGE_URL;
      setModal($("#sniff-image-modal"),true);
    } else {
      setModal($("#kiss-unlock-modal"),true);
    }
  }

  function buildPlay(){
    if($("#panel-chat-home")) return;
    const nav = $(".media-tabs");
    const main = $("main");
    if(!nav || !main) return;

    const tab = document.createElement("button");
    tab.type = "button";
    tab.className = "media-tab chat-home-tab";
    tab.textContent = "Play";
    nav.insertBefore(tab,nav.firstElementChild);

    const panel = document.createElement("section");
    panel.className = "media-panel";
    panel.id = "panel-chat-home";
    panel.innerHTML = `
      <div class="chat-home-shell">
        <div class="chat-home-main">
          <img class="chat-home-photo" id="chat-home-photo" alt="Selected Bluia Sister" decoding="async" fetchpriority="high">
          <div class="chat-home-copy">
            <div class="chat-home-kicker">Bluia Sisters</div>
            <div class="chat-home-title">Play</div>
            <p class="chat-home-text">Choose a Bluia Sister below, then choose Kiss or Sniff.</p>
            <p class="chat-home-small">The first Bluia Sister has both moments unlocked. Other models are available for members.</p>
            <div class="play-actions">
              <button class="kiss-button" id="kiss-button" type="button">${kissIcon}<span>Kiss</span></button>
              <button class="sniff-button" id="sniff-button" type="button">${sniffIcon}<span>Sniff</span></button>
            </div>
          </div>
        </div>
        <div class="chat-home-slider-wrap">
          <div class="chat-home-slider-label"><strong>Choose a Bluia Sister</strong><span>Tap a photo</span></div>
          <div class="chat-home-slider" id="chat-home-slider"></div>
        </div>
        <div class="telegram-groups" aria-label="Bluia Sisters Telegram groups">
          <a class="telegram-group free" href="${FREE_TELEGRAM_URL}" target="_blank" rel="noopener noreferrer">
            <span class="telegram-group-icon">${telegramIcon}</span>
            <span class="telegram-group-copy"><strong>Free Telegram</strong><span>Join the free group</span></span>
          </a>
          <a class="telegram-group premium" href="${PREMIUM_TELEGRAM_URL}" target="_blank" rel="noopener noreferrer">
            <span class="telegram-group-icon">${premiumIcon}</span>
            <span class="telegram-group-copy"><strong>Premium Telegram</strong><span>500 Stars / month</span></span>
          </a>
        </div>
      </div>`;
    main.insertBefore(panel,main.querySelector(".page-content") || null);

    document.body.insertAdjacentHTML("beforeend",`
      <div class="kiss-modal" id="kiss-image-modal" aria-hidden="true">
        <div class="kiss-modal-card" role="dialog" aria-modal="true" aria-label="Special kiss">
          <button class="kiss-close" type="button" aria-label="Close">×</button>
          <img class="kiss-preview" id="kiss-special-image" alt="Bluia Sisters kiss" decoding="async">
        </div>
      </div>
      <div class="kiss-modal" id="sniff-image-modal" aria-hidden="true">
        <div class="kiss-modal-card" role="dialog" aria-modal="true" aria-label="Special sniff">
          <button class="kiss-close" type="button" aria-label="Close">×</button>
          <img class="kiss-preview" id="sniff-special-image" alt="Bluia Sisters sniff" decoding="async">
        </div>
      </div>
      <div class="kiss-modal" id="kiss-unlock-modal" aria-hidden="true">
        <div class="kiss-modal-card unlock-card" role="dialog" aria-modal="true" aria-labelledby="unlock-more-title">
          <button class="kiss-close" type="button" aria-label="Close">×</button>
          <div class="unlock-icon">${lockIcon}</div>
          <h3 id="unlock-more-title">Unlock more</h3>
          <p>Become a member to unlock more Bluia Sisters content and special moments.</p>
          <a class="unlock-member" href="${STRIPE_URL}" target="_blank" rel="noopener noreferrer">Become member</a>
        </div>
      </div>`);

    renderSlider();
    $("#kiss-button")?.addEventListener("click",openKiss);
    $("#sniff-button")?.addEventListener("click",openSniff);
    tab.addEventListener("click",() => activatePlay(tab,panel));
    $$(".media-tab:not(.chat-home-tab)").forEach(other => other.addEventListener("click",() => {
      tab.classList.remove("active");
      panel.classList.remove("active");
    }));
    $$(".kiss-close").forEach(button => button.addEventListener("click",() => setModal(button.closest(".kiss-modal"),false)));
    $$(".kiss-modal").forEach(modal => modal.addEventListener("click",event => {
      if(event.target === modal) setModal(modal,false);
    }));
    document.addEventListener("keydown",event => {
      if(event.key !== "Escape") return;
      $$(".kiss-modal.open").forEach(modal => setModal(modal,false));
    });

    selectSister(0);
    requestAnimationFrame(() => activatePlay(tab,panel));
  }

  function start(){
    addStyles();
    cleanupOldUi();
    buildPlay();
    setTimeout(cleanupOldUi,150);
  }

  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded",start,{once:true});
  else start();
})();