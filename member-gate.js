(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  function addStyles(){
    if($("#bluia-member-gate-style")) return;
    const style = document.createElement("style");
    style.id = "bluia-member-gate-style";
    style.textContent = `
      #member-gate-panel{min-height:calc(100svh - 52px);display:none;align-items:center;justify-content:center;padding:28px 16px;background:#000}
      #member-gate-panel.active{display:flex}
      .member-gate-card{width:min(100%,390px);padding:28px 20px;border:1px solid #3a2831;border-radius:20px;background:linear-gradient(180deg,#121012,#090909);text-align:center;box-shadow:0 24px 70px rgba(0,0,0,.45)}
      .member-gate-icon{width:54px;height:54px;display:grid;place-items:center;margin:0 auto 14px;border-radius:16px;background:#25141d;color:#ff6fa8}
      .member-gate-icon svg{width:25px;height:25px;fill:currentColor}
      .member-gate-card h2{margin:0 0 8px;color:#fff;font:700 22px/1.18 Georgia,"Times New Roman",serif}
      .member-gate-card p{margin:0 0 18px;color:#bcaab3;font-size:10px;line-height:1.6}
      .member-gate-button{width:100%;min-height:48px;border:0;border-radius:13px;background:linear-gradient(135deg,#ed5b96,#d43c77);color:#fff;font-size:11px;font-weight:950;cursor:pointer}
      .member-gate-button:active{transform:scale(.985)}
    `;
    document.head.appendChild(style);
  }

  function ensurePanel(){
    let panel = $("#member-gate-panel");
    if(panel) return panel;
    panel = document.createElement("section");
    panel.className = "media-panel";
    panel.id = "member-gate-panel";
    panel.innerHTML = `
      <div class="member-gate-card">
        <div class="member-gate-icon">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10V8a5 5 0 0 1 10 0v2h1.5A1.5 1.5 0 0 1 20 11.5v8A1.5 1.5 0 0 1 18.5 21h-13A1.5 1.5 0 0 1 4 19.5v-8A1.5 1.5 0 0 1 5.5 10H7Zm2 0h6V8a3 3 0 0 0-6 0v2Z"/></svg>
        </div>
        <h2>Become a member to unlock</h2>
        <p>This section is available to Bluia Sisters members.</p>
        <button class="member-gate-button" id="member-gate-buy" type="button">Become a member</button>
      </div>`;
    const main = $("main");
    if(main) main.insertBefore(panel,main.querySelector(".page-content") || null);
    $("#member-gate-buy")?.addEventListener("click",() => $("#buy-button")?.click());
    return panel;
  }

  function openGate(tab){
    const panel = ensurePanel();
    if(!panel) return;
    $$(".media-tab").forEach(item => item.classList.toggle("active",item === tab));
    $$(".media-panel").forEach(item => item.classList.toggle("active",item === panel));
    $("#tv-video")?.pause();
    $("#reel-video")?.pause();
  }

  function start(){
    addStyles();
    ensurePanel();
    document.addEventListener("click",event => {
      const tab = event.target.closest?.(".media-tab");
      if(!tab || tab.classList.contains("chat-home-tab")) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      openGate(tab);
    },true);
  }

  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded",start,{once:true});
  else start();
})();