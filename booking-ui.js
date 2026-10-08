// Premium Telegram placement helper
(() => {
  "use strict";

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
    `;
    document.head.appendChild(style);
  }

  function apply(){
    const freeButton=document.querySelector(".telegram-button");
    if(!freeButton)return false;

    const lovePanel=document.getElementById("subpanel-love");
    const premiumHref=lovePanel?.querySelector("a[href]")?.href||"#";

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

  function start(){
    if(apply())return;
    const observer=new MutationObserver(()=>{if(apply())observer.disconnect()});
    observer.observe(document.documentElement,{childList:true,subtree:true});
    setTimeout(()=>observer.disconnect(),10000);
  }

  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start,{once:true});else start();
})();
