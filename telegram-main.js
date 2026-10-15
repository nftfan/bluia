(()=>{
  "use strict";

  const FREE_TELEGRAM="https://t.me/vbluia";
  const PREMIUM_TELEGRAM="https://t.me/+vieXRo_X9rM5NzRk";
  const $=(selector,root=document)=>root.querySelector(selector);

  function addStyles(){
    if($("#bluia-telegram-main-style")) return;
    const style=document.createElement("style");
    style.id="bluia-telegram-main-style";
    style.textContent=`
      .bluia-telegram-groups{width:min(100%,440px);margin:14px auto 0;padding:0 14px;text-align:left}
      .bluia-telegram-title{margin:0 0 8px;color:#fff;font-size:12px;font-weight:900}
      .bluia-telegram-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
      .bluia-telegram-link{min-height:50px;display:flex;align-items:center;justify-content:center;gap:7px;padding:10px 12px;border-radius:12px;text-decoration:none;font-size:10px;font-weight:900;box-shadow:0 8px 20px rgba(0,0,0,.2)}
      .bluia-telegram-link svg{width:16px;height:16px;fill:currentColor;flex:0 0 16px}
      .bluia-telegram-free{border:1px solid #2788c7;background:#0d1720;color:#62b9ef}
      .bluia-telegram-premium{border:1px solid #d8b24d;background:linear-gradient(135deg,#241d0b,#151106);color:#f0cf68}
      .bluia-telegram-note{margin:7px 0 0;color:#8e7d85;font-size:8px;line-height:1.45;text-align:center}
      @media(max-width:360px){.bluia-telegram-grid{grid-template-columns:1fr}.bluia-telegram-link{min-height:46px}}
    `;
    document.head.appendChild(style);
  }

  function build(){
    if($("#bluia-telegram-groups")) return;
    addStyles();

    const section=document.createElement("section");
    section.className="bluia-telegram-groups";
    section.id="bluia-telegram-groups";
    section.setAttribute("aria-label","Bluia Sisters Telegram channels");
    section.innerHTML=`
      <h2 class="bluia-telegram-title">Telegram Channels</h2>
      <div class="bluia-telegram-grid">
        <a class="bluia-telegram-link bluia-telegram-free" href="${FREE_TELEGRAM}" target="_blank" rel="noopener noreferrer" aria-label="Join free Bluia Sisters Telegram">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21.6 3.4 18.4 19c-.2 1.1-.9 1.4-1.8.9l-4.9-3.6-2.4 2.3c-.3.3-.5.5-1 .5l.4-5 9.1-8.2c.4-.4-.1-.6-.6-.2L5.9 12.8 1 11.3c-1.1-.3-1.1-1.1.2-1.6L20.3 2.3c.9-.3 1.7.2 1.3 1.1Z"/></svg>
          <span>Free Telegram</span>
        </a>
        <a class="bluia-telegram-link bluia-telegram-premium" href="${PREMIUM_TELEGRAM}" target="_blank" rel="noopener noreferrer" aria-label="Join premium Bluia Sisters Telegram">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21.6 3.4 18.4 19c-.2 1.1-.9 1.4-1.8.9l-4.9-3.6-2.4 2.3c-.3.3-.5.5-1 .5l.4-5 9.1-8.2c.4-.4-.1-.6-.6-.2L5.9 12.8 1 11.3c-1.1-.3-1.1-1.1.2-1.6L20.3 2.3c.9-.3 1.7.2 1.3 1.1Z"/></svg>
          <span>Premium Telegram</span>
        </a>
      </div>
      <p class="bluia-telegram-note">Premium Telegram · 500 Stars/month</p>`;

    const pageContent=$(".page-content");
    const footer=$(".site-footer");
    if(pageContent) pageContent.insertAdjacentElement("afterend",section);
    else if(footer) footer.insertAdjacentElement("beforebegin",section);
    else document.querySelector("main")?.appendChild(section);
  }

  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",build,{once:true});
  else build();
})();