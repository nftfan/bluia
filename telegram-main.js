(()=>{
  "use strict";

  const FREE_TELEGRAM="https://t.me/vbluia";
  const PREMIUM_TELEGRAM="https://t.me/+vieXRo_X9rM5NzRk";
  const PREMIUM_IMAGE="https://huggingface.co/buckets/Bluia/bimg/resolve/IMG_4923.jpeg?download=true";
  const $=(selector,root=document)=>root.querySelector(selector);

  function addStyles(){
    if($("#bluia-telegram-main-style")) return;
    const style=document.createElement("style");
    style.id="bluia-telegram-main-style";
    style.textContent=`
      .bluia-telegram-groups{width:min(100%,440px);margin:14px auto 0;padding:0 14px;text-align:left}
      .bluia-telegram-title{margin:0 0 9px;color:#fff;font-size:12px;font-weight:900}
      .bluia-telegram-free{min-height:50px;display:flex;align-items:center;justify-content:center;gap:7px;padding:10px 12px;border:1px solid #2788c7;border-radius:12px;background:#0d1720;color:#62b9ef;text-decoration:none;font-size:10px;font-weight:900;box-shadow:0 8px 20px rgba(0,0,0,.2)}
      .bluia-telegram-free svg{width:16px;height:16px;fill:currentColor;flex:0 0 16px}
      .bluia-premium-card{position:relative;display:block;width:100%;aspect-ratio:16/9;margin-top:9px;overflow:hidden;border:1px solid rgba(255,255,255,.13);border-radius:18px;background:#111;color:#fff;text-decoration:none;box-shadow:0 16px 40px rgba(0,0,0,.32);isolation:isolate;transition:transform .16s ease,box-shadow .16s ease}
      .bluia-premium-card:active{transform:scale(.985)}
      .bluia-premium-card-bg{position:absolute;inset:-5%;width:110%;height:110%;object-fit:cover;object-position:center;filter:blur(4px) saturate(.92) brightness(.82);transform:scale(1.03)}
      .bluia-premium-card-overlay{position:absolute;inset:0;background:linear-gradient(180deg,rgba(8,4,7,.08) 0%,rgba(8,4,7,.22) 42%,rgba(8,4,7,.78) 100%);backdrop-filter:blur(2px);-webkit-backdrop-filter:blur(2px)}
      .bluia-premium-card-content{position:absolute;inset:0;z-index:2;display:flex;flex-direction:column;justify-content:flex-end;padding:15px}
      .bluia-premium-badge{position:absolute;top:13px;right:13px;padding:6px 9px;border-radius:999px;background:linear-gradient(135deg,#f0d36a,#b98724);color:#171004;font-size:8px;font-weight:950;letter-spacing:.5px;box-shadow:0 7px 18px rgba(191,147,40,.28)}
      .bluia-premium-card h3{margin:0 0 5px;color:#fff;font-size:18px;line-height:1.08;font-weight:900;text-shadow:0 2px 12px rgba(0,0,0,.38)}
      .bluia-premium-card p{margin:0 0 10px;max-width:92%;color:rgba(255,255,255,.88);font-size:9.5px;line-height:1.45;text-shadow:0 1px 10px rgba(0,0,0,.3)}
      .bluia-premium-footer{display:flex;align-items:center;justify-content:space-between;gap:10px}
      .bluia-premium-price{color:#f4d772;font-size:9px;font-weight:900}
      .bluia-premium-cta{padding:7px 10px;border:1px solid rgba(255,255,255,.22);border-radius:999px;background:rgba(255,255,255,.12);color:#fff;font-size:8.5px;font-weight:900;backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}
      @media(max-width:360px){.bluia-telegram-free{min-height:46px}.bluia-premium-card-content{padding:12px}.bluia-premium-card h3{font-size:16px}.bluia-premium-card p{font-size:8.5px;margin-bottom:8px}}
      @media(prefers-reduced-motion:reduce){.bluia-premium-card{transition:none!important}}
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

      <a class="bluia-telegram-free" href="${FREE_TELEGRAM}" target="_blank" rel="noopener noreferrer" aria-label="Join free Bluia Sisters Telegram">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21.6 3.4 18.4 19c-.2 1.1-.9 1.4-1.8.9l-4.9-3.6-2.4 2.3c-.3.3-.5.5-1 .5l.4-5 9.1-8.2c.4-.4-.1-.6-.6-.2L5.9 12.8 1 11.3c-1.1-.3-1.1-1.1.2-1.6L20.3 2.3c.9-.3 1.7.2 1.3 1.1Z"/></svg>
        <span>Free Telegram</span>
      </a>

      <a class="bluia-premium-card" href="${PREMIUM_TELEGRAM}" target="_blank" rel="noopener noreferrer" aria-label="Join Premium Telegram for 500 Stars per month">
        <img class="bluia-premium-card-bg" src="${PREMIUM_IMAGE}" alt="" loading="lazy" decoding="async">
        <div class="bluia-premium-card-overlay"></div>
        <div class="bluia-premium-card-content">
          <div class="bluia-premium-badge">VIP</div>
          <h3>Premium Telegram</h3>
          <p>Private Bluia Sisters content, exclusive updates, behind-the-scenes and premium access.</p>
          <div class="bluia-premium-footer">
            <span class="bluia-premium-price">500 Stars / month</span>
            <span class="bluia-premium-cta">Tap to Join</span>
          </div>
        </div>
      </a>`;

    const pageContent=$(".page-content");
    const footer=$(".site-footer");
    if(pageContent) pageContent.insertAdjacentElement("afterend",section);
    else if(footer) footer.insertAdjacentElement("beforebegin",section);
    else document.querySelector("main")?.appendChild(section);
  }

  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",build,{once:true});
  else build();
})();