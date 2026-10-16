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
      .bluia-telegram-groups{width:min(100%,440px);margin:16px auto 0;padding:0 14px;text-align:left}
      .bluia-telegram-title{margin:0 0 9px;color:#fff;font-size:12px;font-weight:900;letter-spacing:.2px}
      .bluia-telegram-grid{display:grid;grid-template-columns:1fr 1fr;gap:9px}
      .bluia-telegram-link{position:relative;min-height:68px;display:flex;align-items:center;justify-content:flex-start;gap:10px;padding:11px 12px;border-radius:15px;text-decoration:none;overflow:hidden;box-shadow:0 10px 26px rgba(0,0,0,.28);transition:transform .16s ease,box-shadow .16s ease,border-color .16s ease}
      .bluia-telegram-link::after{content:"";position:absolute;inset:0;background:linear-gradient(120deg,rgba(255,255,255,.08),transparent 42%);pointer-events:none}
      .bluia-telegram-link:active{transform:scale(.975)}
      .bluia-telegram-icon{position:relative;z-index:1;width:34px;height:34px;flex:0 0 34px;display:grid;place-items:center;border-radius:50%;backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}
      .bluia-telegram-icon svg{width:17px;height:17px;fill:currentColor}
      .bluia-telegram-copy{position:relative;z-index:1;min-width:0;display:flex;flex-direction:column;gap:2px}
      .bluia-telegram-copy strong{font-size:10.5px;line-height:1.1;font-weight:950;color:#fff;white-space:nowrap}
      .bluia-telegram-copy span{font-size:7.5px;line-height:1.25;font-weight:750;opacity:.78;white-space:nowrap}
      .bluia-telegram-free{border:1px solid rgba(72,177,239,.55);background:radial-gradient(circle at 15% 0%,rgba(70,181,245,.26),transparent 42%),linear-gradient(135deg,#112b3d,#081720);color:#6cc8ff;box-shadow:0 10px 28px rgba(28,137,205,.16)}
      .bluia-telegram-free .bluia-telegram-icon{background:rgba(57,164,230,.15);border:1px solid rgba(99,196,255,.35)}
      .bluia-telegram-premium{border:1px solid rgba(226,193,91,.6);background:radial-gradient(circle at 15% 0%,rgba(239,204,92,.22),transparent 42%),linear-gradient(135deg,#2b220d,#120e05);color:#f4d56d;box-shadow:0 10px 28px rgba(196,153,49,.16)}
      .bluia-telegram-premium .bluia-telegram-icon{background:rgba(229,191,73,.14);border:1px solid rgba(244,213,109,.34)}
      .bluia-telegram-note{margin:8px 0 0;color:#8e7d85;font-size:8px;line-height:1.45;text-align:center}
      @media(max-width:360px){.bluia-telegram-grid{gap:6px}.bluia-telegram-link{min-height:64px;padding:9px}.bluia-telegram-icon{width:30px;height:30px;flex-basis:30px}.bluia-telegram-copy strong{font-size:9.5px}.bluia-telegram-copy span{font-size:7px}}
      @media(prefers-reduced-motion:reduce){.bluia-telegram-link{transition:none}}
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
          <span class="bluia-telegram-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21.6 3.4 18.4 19c-.2 1.1-.9 1.4-1.8.9l-4.9-3.6-2.4 2.3c-.3.3-.5.5-1 .5l.4-5 9.1-8.2c.4-.4-.1-.6-.6-.2L5.9 12.8 1 11.3c-1.1-.3-1.1-1.1.2-1.6L20.3 2.3c.9-.3 1.7.2 1.3 1.1Z"/></svg></span>
          <span class="bluia-telegram-copy"><strong>Free Telegram</strong><span>Join the community</span></span>
        </a>
        <a class="bluia-telegram-link bluia-telegram-premium" href="${PREMIUM_TELEGRAM}" target="_blank" rel="noopener noreferrer" aria-label="Join premium Bluia Sisters Telegram">
          <span class="bluia-telegram-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21.6 3.4 18.4 19c-.2 1.1-.9 1.4-1.8.9l-4.9-3.6-2.4 2.3c-.3.3-.5.5-1 .5l.4-5 9.1-8.2c.4-.4-.1-.6-.6-.2L5.9 12.8 1 11.3c-1.1-.3-1.1-1.1.2-1.6L20.3 2.3c.9-.3 1.7.2 1.3 1.1Z"/></svg></span>
          <span class="bluia-telegram-copy"><strong>Premium Telegram</strong><span>500 Stars / month</span></span>
        </a>
      </div>
      <p class="bluia-telegram-note">Choose free access or unlock the private premium channel.</p>`;

    const pageContent=$(".page-content");
    const footer=$(".site-footer");
    if(pageContent) pageContent.insertAdjacentElement("afterend",section);
    else if(footer) footer.insertAdjacentElement("beforebegin",section);
    else document.querySelector("main")?.appendChild(section);
  }

  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",build,{once:true});
  else build();
})();