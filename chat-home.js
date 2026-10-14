(() => {
  "use strict";

  const KISS_IMAGE_URL = "https://huggingface.co/buckets/veebluia/bluiaimages/resolve/ChatGPT%20Image%20Oct%208%2C%202026%2C%2009_45_20%20PM.png?download=true";
  const SNIFF_IMAGE_URL = "https://huggingface.co/buckets/veebluia/bluiaimages/resolve/ChatGPT%20Image%20Oct%209%2C%202026%2C%2001_11_13%20PM.png?download=true";
  const STRIPE_URL = "https://buy.stripe.com/4gMbITgUo0jc1yF3F5bAs04";
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const models = () => Array.isArray(window.BluiaMedia?.models) ? window.BluiaMedia.models : [];
  let selectedIndex = 0;

  const kissIcon = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.4 11.1c2.2-2.6 4.6-4 7-4.1 1.2 0 2.1.4 2.8 1.1.7-.7 1.7-1.1 2.8-1.1 2.2.1 4.1 1.5 5.7 4.1-2.9 3.8-6.1 5.8-9.4 5.9-3.3-.1-6.2-2.1-8.9-5.9Zm3.1.3c1.9 1.7 3.8 2.6 5.8 2.7 2-.1 4-.9 5.9-2.7-1-.9-2-1.4-3-1.4-1 0-1.9.4-2.8 1.2-.9-.8-1.8-1.2-2.8-1.2-1 0-2.1.5-3.1 1.4Z"/></svg>`;
  const sniffIcon = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.3 3.2c.8 2.2.8 4.3.1 6.2-.4 1.1-1 2.2-1.8 3.3-.5.7-.7 1.3-.5 1.7.2.4.8.7 1.8.7h2.4c1.4 0 2.3.7 2.3 1.8 0 1.5-1.5 3-3.6 3-1.5 0-2.8-.7-3.6-1.9l1.5-1c.5.7 1.2 1.1 2.1 1.1 1 0 1.7-.6 1.8-1.1-.1-.1-.3-.1-.6-.1h-2.4c-1.8 0-3-.6-3.5-1.8-.5-1.2-.2-2.4.8-3.8.7-1 1.2-1.9 1.5-2.7.5-1.5.5-3.1-.1-4.8l1.8-.6Z"/></svg>`;
  const heartIcon = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7.2-4.5-9.6-8.8C.3 8.4 2.2 4.5 6.1 4.2c2.2-.2 4 1 5.9 3.2 1.9-2.2 3.7-3.4 5.9-3.2 3.9.3 5.8 4.2 3.7 8C19.2 16.5 12 21 12 21Z"/></svg>`;
  const lockIcon = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10V8a5 5 0 0 1 10 0v2h1.5A1.5 1.5 0 0 1 20 11.5v8A1.5 1.5 0 0 1 18.5 21h-13A1.5 1.5 0 0 1 4 19.5v-8A1.5 1.5 0 0 1 5.5 10H7Zm2 0h6V8a3 3 0 0 0-6 0v2Z"/></svg>`;

  function addStyles(){
    $("#bluia-chat-home-style")?.remove();
    const style = document.createElement("style");
    style.id = "bluia-chat-home-style";
    style.textContent = `
      .media-tabs{grid-template-columns:repeat(5,minmax(0,1fr))!important;gap:5px!important}
      .chat-home-tab{border-color:#ff6ba7!important;color:#ff8fba!important;background:#211019!important}
      .chat-home-tab.active{border-color:#ff4f95!important;background:linear-gradient(135deg,#ff6aa8,#d93778)!important;color:#fff!important}
      #panel-chat-home{min-height:calc(100svh - 52px);padding:24px 14px 34px;background:linear-gradient(180deg,#f4518f 0%,#e74282 54%,#ca306c 100%)}
      .chat-home-shell{width:min(100%,420px);margin:0 auto;display:flex;flex-direction:column;align-items:center}
      .chat-home-photo{display:block;width:min(72vw,270px);aspect-ratio:2/3;object-fit:cover;object-position:top center;border:1px solid rgba(255,255,255,.52);border-radius:20px;background:#d9457f;box-shadow:0 18px 42px rgba(74,5,31,.24)}
      .play-actions{display:grid;grid-template-columns:repeat(3,minmax(0,1fr))!important;grid-template-rows:46px 49px;gap:8px;width:min(100%,360px);margin-top:14px;align-items:stretch}
      .kiss-button,.sniff-button,.marry-button{display:flex;align-items:center;justify-content:center;gap:6px;width:100%;border:1px solid rgba(255,255,255,.96);border-radius:13px;background:#fff;font-size:10.5px;font-weight:950;cursor:pointer;box-shadow:0 8px 20px rgba(87,10,40,.15);transition:transform .14s ease,box-shadow .14s ease}
      .play-actions>.kiss-button{grid-column:1;grid-row:1;height:46px!important;min-height:46px!important;margin:0!important;padding:0 6px!important}
      .play-actions>.sniff-button{grid-column:2;grid-row:1;height:46px!important;min-height:46px!important;margin:0!important;padding:0 6px!important}
      .play-actions>.private-chat-button{grid-column:3!important;grid-row:1!important;height:46px!important;min-height:46px!important;margin:0!important;padding:0 6px!important;width:100%!important;border-radius:13px!important}
      .kiss-button{color:#dd3f7b}.sniff-button{color:#bd8900}
      .kiss-button:active,.sniff-button:active,.marry-button:active{transform:scale(.975)}
      .kiss-button svg,.sniff-button svg,.marry-button svg{width:17px;height:17px;fill:currentColor;flex:0 0 17px}
      .marry-button{grid-column:1/-1;grid-row:2;width:100%;height:49px;min-height:49px;margin:0;border-color:#ffd3e4;background:linear-gradient(135deg,#fff,#ffe8f1);color:#d62d6d;font-size:11.5px;box-shadow:0 10px 24px rgba(117,8,49,.2)}
      .chat-home-slider{display:flex;width:100%;gap:8px;overflow-x:auto;padding:14px 1px 4px;scrollbar-width:none;scroll-snap-type:x proximity;-webkit-overflow-scrolling:touch}
      .chat-home-slider::-webkit-scrollbar{display:none}
      .chat-home-thumb{flex:0 0 66px;width:66px;aspect-ratio:2/3;padding:0;border:2px solid transparent;border-radius:12px;overflow:hidden;background:#b52c62;cursor:pointer;scroll-snap-align:start;box-shadow:0 6px 15px rgba(74,5,31,.16);transition:transform .14s ease,border-color .14s ease}
      .chat-home-thumb:active{transform:scale(.97)}
      .chat-home-thumb img{display:block;width:100%;height:100%;object-fit:cover;object-position:top center}
      .chat-home-thumb.selected{border-color:#fff;box-shadow:0 0 0 2px rgba(255,255,255,.16),0 7px 18px rgba(74,5,31,.2)}
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
      .marry-hearts{position:fixed;inset:0;z-index:100020;pointer-events:none;overflow:hidden}
      .marry-heart{position:absolute;top:-12vh;color:#ff2e78;text-shadow:0 4px 14px rgba(112,0,42,.2);animation:heartFall var(--duration) linear forwards;opacity:.96}
      .marry-heart svg{display:block;width:100%;height:100%;fill:currentColor}
      .marry-burst{position:fixed;left:50%;top:48%;z-index:100021;width:110px;height:110px;display:grid;place-items:center;border-radius:50%;background:rgba(255,255,255,.92);color:#ed3d7e;box-shadow:0 18px 60px rgba(87,0,33,.28);pointer-events:none;transform:translate(-50%,-50%) scale(.3);opacity:0;animation:marryBurst 1.05s cubic-bezier(.2,.9,.2,1) forwards}
      .marry-burst svg{width:58px;height:58px;fill:currentColor;filter:drop-shadow(0 6px 12px rgba(214,45,109,.25))}
      @keyframes heartFall{0%{transform:translate3d(0,-10vh,0) rotate(0deg);opacity:0}10%{opacity:1}100%{transform:translate3d(var(--drift),115vh,0) rotate(var(--spin));opacity:.85}}
      @keyframes marryBurst{0%{transform:translate(-50%,-50%) scale(.25);opacity:0}20%{opacity:1}55%{transform:translate(-50%,-50%) scale(1.08);opacity:1}100%{transform:translate(-50%,-50%) scale(.92);opacity:0}}
      @media(max-width:350px){#panel-chat-home{padding-left:10px;padding-right:10px}.play-actions{gap:6px}.kiss-button,.sniff-button,.marry-button,.play-actions>.private-chat-button{font-size:9.5px!important}.chat-home-thumb{flex-basis:60px;width:60px}}
      @media(prefers-reduced-motion:reduce){.kiss-button,.sniff-button,.marry-button,.chat-home-thumb,.kiss-modal{transition:none!important}.marry-heart{animation-duration:.01ms!important}.marry-burst{animation-duration:.01ms!important}}
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

  function setModal(modal,open){
    if(!modal) return;
    modal.classList.toggle("open",open);
    modal.setAttribute("aria-hidden",open ? "false" : "true");
    document.documentElement.style.overflow = open ? "hidden" : "";
  }

  function selectSister(index){
    const list=models();
    if(!list.length) return;
    selectedIndex=Math.max(0,Math.min(Number(index)||0,list.length-1));
    const preview=$("#chat-home-photo");
    if(preview) preview.src=list[selectedIndex];
    $$(".chat-home-thumb").forEach((button,i)=>button.classList.toggle("selected",i===selectedIndex));
  }

  function renderSlider(){
    const slider=$("#chat-home-slider");
    if(!slider) return;
    const fragment=document.createDocumentFragment();
    models().forEach((url,index)=>{
      const button=document.createElement("button");
      button.type="button";
      button.className="chat-home-thumb";
      button.setAttribute("aria-label",`Choose Bluia Sister ${index+1}`);
      const img=document.createElement("img");
      img.src=url;
      img.alt=`Bluia Sister ${index+1}`;
      img.loading=index<4?"eager":"lazy";
      img.decoding="async";
      button.appendChild(img);
      button.addEventListener("click",()=>selectSister(index));
      fragment.appendChild(button);
    });
    slider.replaceChildren(fragment);
  }

  function openKiss(){
    if(selectedIndex!==0){setModal($("#kiss-unlock-modal"),true);return;}
    const img = $("#kiss-special-image");
    if(img) img.src = KISS_IMAGE_URL;
    setModal($("#kiss-image-modal"),true);
  }

  function openSniff(){
    if(selectedIndex!==0){setModal($("#kiss-unlock-modal"),true);return;}
    const img = $("#sniff-special-image");
    if(img) img.src = SNIFF_IMAGE_URL;
    setModal($("#sniff-image-modal"),true);
  }

  function celebrateMarriage(){
    document.querySelector(".marry-hearts")?.remove();
    document.querySelector(".marry-burst")?.remove();
    const rain=document.createElement("div");
    rain.className="marry-hearts";
    document.body.appendChild(rain);
    for(let i=0;i<32;i++){
      const heart=document.createElement("span");
      heart.className="marry-heart";
      heart.innerHTML=heartIcon;
      const size=14+Math.random()*25;
      heart.style.left=`${Math.random()*100}%`;
      heart.style.width=`${size}px`;
      heart.style.height=`${size}px`;
      heart.style.setProperty("--duration",`${2.6+Math.random()*2.4}s`);
      heart.style.setProperty("--drift",`${-55+Math.random()*110}px`);
      heart.style.setProperty("--spin",`${-180+Math.random()*360}deg`);
      heart.style.animationDelay=`${Math.random()*.8}s`;
      rain.appendChild(heart);
    }
    const burst=document.createElement("div");
    burst.className="marry-burst";
    burst.innerHTML=heartIcon;
    document.body.appendChild(burst);
    setTimeout(()=>rain.remove(),5600);
    setTimeout(()=>burst.remove(),1300);
  }

  function openMarry(){
    if(selectedIndex!==0){setModal($("#marry-unlock-modal"),true);return;}
    celebrateMarriage();
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
        <img class="chat-home-photo" id="chat-home-photo" alt="Bluia Sister preview" decoding="async" fetchpriority="high">
        <div class="play-actions">
          <button class="kiss-button" id="kiss-button" type="button">${kissIcon}<span>Kiss</span></button>
          <button class="sniff-button" id="sniff-button" type="button">${sniffIcon}<span>Sniff</span></button>
          <button class="marry-button" id="marry-button" type="button">${heartIcon}<span>Marry Me</span></button>
        </div>
        <div class="chat-home-slider" id="chat-home-slider" aria-label="Choose a Bluia Sister"></div>
      </div>`;
    main.insertBefore(panel,main.querySelector(".page-content") || null);

    document.body.insertAdjacentHTML("beforeend",`
      <div class="kiss-modal" id="kiss-image-modal" aria-hidden="true"><div class="kiss-modal-card" role="dialog" aria-modal="true" aria-label="Special kiss"><button class="kiss-close" type="button" aria-label="Close">×</button><img class="kiss-preview" id="kiss-special-image" alt="Bluia Sisters kiss" decoding="async"></div></div>
      <div class="kiss-modal" id="sniff-image-modal" aria-hidden="true"><div class="kiss-modal-card" role="dialog" aria-modal="true" aria-label="Special sniff"><button class="kiss-close" type="button" aria-label="Close">×</button><img class="kiss-preview" id="sniff-special-image" alt="Bluia Sisters sniff" decoding="async"></div></div>
      <div class="kiss-modal" id="kiss-unlock-modal" aria-hidden="true"><div class="kiss-modal-card unlock-card" role="dialog" aria-modal="true"><button class="kiss-close" type="button" aria-label="Close">×</button><div class="unlock-icon">${lockIcon}</div><h3>Unlock more</h3><p>Become a member to unlock more Bluia Sisters content and special moments.</p><a class="unlock-member" href="${STRIPE_URL}" target="_blank" rel="noopener noreferrer">Become member</a></div></div>
      <div class="kiss-modal" id="marry-unlock-modal" aria-hidden="true"><div class="kiss-modal-card unlock-card" role="dialog" aria-modal="true" aria-labelledby="marry-unlock-title"><button class="kiss-close" type="button" aria-label="Close">×</button><div class="unlock-icon">${heartIcon}</div><h3 id="marry-unlock-title">Marry this Bluia Sister</h3><p>Become a member to unlock Marry Me for this Bluia Sister.</p><a class="unlock-member" href="${STRIPE_URL}" target="_blank" rel="noopener noreferrer">Become a member to marry</a></div></div>`);

    renderSlider();
    selectSister(0);

    $("#kiss-button")?.addEventListener("click",openKiss);
    $("#sniff-button")?.addEventListener("click",openSniff);
    $("#marry-button")?.addEventListener("click",openMarry);
    tab.addEventListener("click",() => activatePlay(tab,panel));
    $$(".media-tab:not(.chat-home-tab)").forEach(other => other.addEventListener("click",() => { tab.classList.remove("active"); panel.classList.remove("active"); }));
    $$(".kiss-close").forEach(button => button.addEventListener("click",() => setModal(button.closest(".kiss-modal"),false)));
    $$(".kiss-modal").forEach(modal => modal.addEventListener("click",event => { if(event.target === modal) setModal(modal,false); }));
    document.addEventListener("keydown",event => { if(event.key === "Escape") $$(".kiss-modal.open").forEach(modal => setModal(modal,false)); });

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