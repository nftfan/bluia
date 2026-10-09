(() => {
  "use strict";

  const KISS_IMAGE_URL = "https://huggingface.co/buckets/veebluia/bluiaimages/resolve/ChatGPT%20Image%20Oct%208%2C%202026%2C%2009_45_20%20PM.png?download=true";
  const SNIFF_IMAGE_URL = "https://huggingface.co/buckets/veebluia/bluiaimages/resolve/ChatGPT%20Image%20Oct%209%2C%202026%2C%2001_11_13%20PM.png?download=true";
  const STRIPE_URL = "https://buy.stripe.com/4gMbITgUo0jc1yF3F5bAs04";

  const models = () => Array.isArray(window.BluiaMedia?.models) ? window.BluiaMedia.models : [];
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  let selectedIndex = 0;

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
      .kiss-button,.sniff-button{min-height:43px;display:flex;align-items:center;justify-content:center;gap:7px;width:100%;border-radius:12px;font-size:10.5px;font-weight:950;cursor:pointer;box-shadow:0 7px 18px rgba(87,10,40,.14);transition:transform .14s ease}
      .kiss-button{margin-top:10px;border:1px solid rgba(255,255,255,.94);background:#fff;color:#dd3f7b}
      .sniff-button{margin-top:7px;border:1px solid #f4c935;background:linear-gradient(135deg,#ffe66b,#f5c934);color:#5b4300}
      .kiss-button:active,.sniff-button:active{transform:scale(.975)}
      .kiss-icon,.sniff-icon{font-size:16px;line-height:1}
      .chat-home-slider-wrap{padding:0 14px 4px}
      .chat-home-slider-label{display:flex;align-items:center;justify-content:space-between;gap:8px;margin:0 0 7px;color:#fff}
      .chat-home-slider-label strong{font-size:9px}.chat-home-slider-label span{color:#ffd6e5;font-size:7px}
      .chat-home-slider{display:flex;gap:7px;overflow-x:auto;overscroll-behavior-inline:contain;padding:1px 1px 7px;scrollbar-width:none;scroll-snap-type:x proximity;-webkit-overflow-scrolling:touch}
      .chat-home-slider::-webkit-scrollbar{display:none}
      .chat-home-thumb{flex:0 0 64px;width:64px;aspect-ratio:2/3;padding:0;border:2px solid transparent;border-radius:11px;overflow:hidden;background:#ba2c65;cursor:pointer;scroll-snap-align:start;box-shadow:0 5px 14px rgba(88,7,39,.12)}
      .chat-home-thumb img{display:block;width:100%;height:100%;object-fit:cover;object-position:top center}
      .chat-home-thumb.selected{border-color:#fff;box-shadow:0 0 0 2px rgba(255,255,255,.16),0 6px 16px rgba(88,7,39,.18)}
      .kiss-modal{position:fixed;inset:0;z-index:100005;display:grid;place-items:center;padding:16px;background:rgba(0,0,0,.84);opacity:0;visibility:hidden;pointer-events:none;transition:opacity .16s ease,visibility .16s ease}
      .kiss-modal.open{opacity:1;visibility:visible;pointer-events:auto}
      .kiss-modal-card{position:relative;width:min(94vw,410px);max-height:92dvh;overflow:auto;border:1px solid #60364b;border-radius:20px;background:#120d10;box-shadow:0 28px 80px rgba(0,0,0,.65)}
      .kiss-close{position:absolute;z-index:2;top:9px;right:9px;width:34px;height:34px;border:1px solid rgba(255,255,255,.35);border-radius:50%;background:rgba(12,8,10,.84);color:#fff;font-size:20px;line-height:1;cursor:pointer}
      .kiss-preview{display:block;width:100%;height:auto;border-radius:19px}
      .unlock-card{padding:25px 18px 18px;text-align:center}
      .unlock-icon{width:48px;height:48px;display:grid;place-items:center;margin:0 auto 12px;border-radius:15px;background:#2b1320;color:#ff74aa;font-size:23px}
      .unlock-card h3{margin:0 0 7px;color:#fff;font-size:17px}
      .unlock-card p{margin:0 auto 15px;max-width:280px;color:#bca9b2;font-size:9.5px;line-height:1.55}
      .unlock-member{min-height:46px;display:flex;align-items:center;justify-content:center;border-radius:12px;background:linear-gradient(135deg,#ed5b96,#c93370);color:#fff;text-decoration:none;font-size:11px;font-weight:950}
      @media(max-width:390px){.chat-home-main{grid-template-columns:142px minmax(0,1fr);gap:12px;padding-left:11px;padding-right:11px}.chat-home-photo{width:142px}.chat-home-slider-wrap{padding-left:11px;padding-right:11px}}
      @media(max-width:340px){.chat-home-main{grid-template-columns:125px minmax(0,1fr);gap:10px}.chat-home-photo{width:125px}.chat-home-text{font-size:8.3px}.kiss-button,.sniff-button{font-size:9.5px}}
      @media(prefers-reduced-motion:reduce){.kiss-button,.sniff-button,.kiss-modal{transition:none!important}}
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

  function activateKiss(tab,panel){
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

  function buildKiss(){
    if($("#panel-chat-home")) return;
    const nav = $(".media-tabs");
    const main = $("main");
    if(!nav || !main) return;

    const tab = document.createElement("button");
    tab.type = "button";
    tab.className = "media-tab chat-home-tab";
    tab.textContent = "Kiss";
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
            <div class="chat-home-title">Kiss 💋</div>
            <p class="chat-home-text">Choose a Bluia Sister below, then tap Kiss or Sniff.</p>
            <p class="chat-home-small">The first Bluia Sister has special Kiss and Sniff moments waiting for you.</p>
            <button class="kiss-button" id="kiss-button" type="button"><span class="kiss-icon">💋</span><span>Kiss</span></button>
            <button class="sniff-button" id="sniff-button" type="button"><span class="sniff-icon">✨</span><span>Sniff</span></button>
          </div>
        </div>
        <div class="chat-home-slider-wrap">
          <div class="chat-home-slider-label"><strong>Choose a Bluia Sister</strong><span>Tap a photo</span></div>
          <div class="chat-home-slider" id="chat-home-slider"></div>
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
          <div class="unlock-icon">💗</div>
          <h3 id="unlock-more-title">Unlock more</h3>
          <p>Become a member to unlock more Bluia Sisters content and special moments.</p>
          <a class="unlock-member" href="${STRIPE_URL}" target="_blank" rel="noopener noreferrer">Become member</a>
        </div>
      </div>`);

    renderSlider();
    $("#kiss-button")?.addEventListener("click",openKiss);
    $("#sniff-button")?.addEventListener("click",openSniff);
    tab.addEventListener("click",() => activateKiss(tab,panel));
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
    requestAnimationFrame(() => activateKiss(tab,panel));
  }

  function start(){
    addStyles();
    cleanupOldUi();
    buildKiss();
    setTimeout(cleanupOldUi,150);
  }

  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded",start,{once:true});
  else start();
})();