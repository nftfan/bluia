(() => {
  "use strict";

  const CHAT_URL = "https://bluia.online/chat";
  const $ = (selector, root = document) => root.querySelector(selector);

  const chatIcon = `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M4 4h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-5 4v-4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm1 4v2h14V8H5Zm0 4v2h9v-2H5Z"/>
    </svg>`;

  function addStyles(){
    if($("#bluia-private-chat-style")) return;
    const style = document.createElement("style");
    style.id = "bluia-private-chat-style";
    style.textContent = `
      .play-actions{grid-template-columns:repeat(3,minmax(0,1fr))!important}
      .private-chat-button{min-height:43px;display:flex;align-items:center;justify-content:center;gap:6px;width:100%;border:1px solid rgba(255,255,255,.96);border-radius:12px;background:#fff;color:#6a4ee8;font-size:10px;font-weight:950;text-decoration:none;box-shadow:0 7px 18px rgba(87,10,40,.14);transition:transform .14s ease}
      .private-chat-button:active{transform:scale(.975)}
      .private-chat-button svg{width:16px;height:16px;fill:currentColor;flex:0 0 16px}
      @media(max-width:350px){.private-chat-button{font-size:9px;gap:4px}.private-chat-button svg{width:14px;height:14px;flex-basis:14px}}
      @media(prefers-reduced-motion:reduce){.private-chat-button{transition:none!important}}
    `;
    document.head.appendChild(style);
  }

  function build(){
    if($("#private-chat-button")) return true;
    const actions = $(".play-actions");
    if(!actions) return false;

    const link = document.createElement("a");
    link.className = "private-chat-button";
    link.id = "private-chat-button";
    link.href = CHAT_URL;
    link.innerHTML = `${chatIcon}<span>Chat</span>`;
    link.setAttribute("aria-label","Open Bluia Sisters Chat");
    actions.appendChild(link);
    return true;
  }

  function start(){
    addStyles();
    if(build()) return;
    const observer = new MutationObserver(() => {
      if(build()) observer.disconnect();
    });
    observer.observe(document.documentElement,{childList:true,subtree:true});
    setTimeout(() => observer.disconnect(),10000);
  }

  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded",start,{once:true});
  else start();
})();