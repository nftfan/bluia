(() => {
  "use strict";

  const COVER_URL = "https://huggingface.co/buckets/veebluia/bluiaimages/resolve/hbvnf.JPG?download=true";
  const BUY_URL = "https://buy.stripe.com/fZufZ98nS0jc6SZb7xbAs05";

  function addBookCard(){
    if(document.getElementById("bluia-lifestyle-book")) return true;
    const telegramGroups = document.querySelector(".telegram-groups");
    if(!telegramGroups) return false;

    if(!document.getElementById("bluia-book-style")){
      const style = document.createElement("style");
      style.id = "bluia-book-style";
      style.textContent = `
        .bluia-book-card{display:grid;grid-template-columns:92px minmax(0,1fr);gap:13px;align-items:center;margin:11px 14px 0;padding:11px;border:1px solid rgba(255,255,255,.35);border-radius:16px;background:rgba(255,255,255,.96);box-shadow:0 10px 26px rgba(87,10,40,.13)}
        .bluia-book-cover{display:block;width:92px;aspect-ratio:210/297;object-fit:cover;border-radius:10px;background:#eee;box-shadow:0 6px 16px rgba(0,0,0,.16)}
        .bluia-book-copy{min-width:0;display:flex;flex-direction:column;align-items:flex-start}
        .bluia-book-kicker{margin:0 0 4px;color:#d33d78;font-size:7px;line-height:1.2;font-weight:950;letter-spacing:.8px;text-transform:uppercase}
        .bluia-book-title{margin:0 0 5px;color:#23141b;font-size:12px;line-height:1.25;font-weight:950}
        .bluia-book-text{margin:0 0 9px;color:#77636d;font-size:8px;line-height:1.45}
        .bluia-book-buy{min-height:38px;display:inline-flex;align-items:center;justify-content:center;gap:7px;padding:0 14px;border-radius:10px;background:linear-gradient(135deg,#ed5b96,#ca3471);color:#fff;text-decoration:none;font-size:9.5px;font-weight:950;box-shadow:0 6px 16px rgba(202,52,113,.23);transition:transform .14s ease}
        .bluia-book-buy:active{transform:scale(.98)}
        .bluia-book-buy svg{width:14px;height:14px;fill:currentColor}
        @media(max-width:390px){.bluia-book-card{margin-left:11px;margin-right:11px;grid-template-columns:84px minmax(0,1fr);gap:11px}.bluia-book-cover{width:84px}}
        @media(max-width:340px){.bluia-book-card{grid-template-columns:76px minmax(0,1fr)}.bluia-book-cover{width:76px}.bluia-book-title{font-size:10.5px}.bluia-book-buy{padding:0 11px;font-size:8.8px}}
        @media(prefers-reduced-motion:reduce){.bluia-book-buy{transition:none!important}}
      `;
      document.head.appendChild(style);
    }

    const card = document.createElement("section");
    card.id = "bluia-lifestyle-book";
    card.className = "bluia-book-card";
    card.setAttribute("aria-label","Bluia Sisters Lifestyle PDF book");
    card.innerHTML = `
      <img class="bluia-book-cover" src="${COVER_URL}" alt="Bluia Sisters Lifestyle book cover" loading="lazy" decoding="async">
      <div class="bluia-book-copy">
        <div class="bluia-book-kicker">PDF Book</div>
        <h3 class="bluia-book-title">Bluia Sisters Lifestyle</h3>
        <p class="bluia-book-text">Get the Bluia Sisters Lifestyle digital PDF book.</p>
        <a class="bluia-book-buy" href="${BUY_URL}" target="_blank" rel="noopener noreferrer">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4h10v4h3v12H4V8h3V4Zm2 4h6V6H9v2Zm-3 2v8h12v-8H6Zm3 2h6v2H9v-2Z"/></svg>
          <span>Buy PDF Book</span>
        </a>
      </div>`;

    telegramGroups.insertAdjacentElement("afterend",card);
    return true;
  }

  function start(){
    if(addBookCard()) return;
    const observer = new MutationObserver(() => {
      if(addBookCard()) observer.disconnect();
    });
    observer.observe(document.documentElement,{childList:true,subtree:true});
    setTimeout(() => observer.disconnect(),10000);
  }

  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded",start,{once:true});
  else start();
})();