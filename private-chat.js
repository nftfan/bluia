(() => {
  "use strict";

  const EMAIL = "vbluia@outlook.com";
  const CHAT_URL = "https://bluia.online/chat";
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

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
      .private-chat-button{min-height:43px;display:flex;align-items:center;justify-content:center;gap:6px;width:100%;border:1px solid rgba(255,255,255,.96);border-radius:12px;background:#fff;color:#6a4ee8;font-size:10px;font-weight:950;cursor:pointer;box-shadow:0 7px 18px rgba(87,10,40,.14);transition:transform .14s ease}
      .private-chat-button:active{transform:scale(.975)}
      .private-chat-button svg{width:16px;height:16px;fill:currentColor;flex:0 0 16px}
      .private-chat-modal{position:fixed;inset:0;z-index:100010;display:grid;place-items:center;padding:16px;background:rgba(0,0,0,.86);opacity:0;visibility:hidden;pointer-events:none;transition:opacity .16s ease,visibility .16s ease}
      .private-chat-modal.open{opacity:1;visibility:visible;pointer-events:auto}
      .private-chat-card{position:relative;width:min(94vw,390px);padding:24px 18px 18px;border:1px solid #4b3140;border-radius:20px;background:linear-gradient(180deg,#171014,#0d0a0c);color:#fff;text-align:left;box-shadow:0 28px 80px rgba(0,0,0,.65)}
      .private-chat-close{position:absolute;top:9px;right:9px;width:34px;height:34px;border:1px solid rgba(255,255,255,.28);border-radius:50%;background:#21161c;color:#fff;font-size:20px;line-height:1;cursor:pointer}
      .private-chat-badge{display:inline-flex;align-items:center;gap:6px;margin-bottom:12px;padding:6px 9px;border-radius:999px;background:#261923;color:#ff8fba;font-size:8px;font-weight:900}
      .private-chat-card h3{margin:0 38px 7px 0;font-size:20px;line-height:1.2}
      .private-chat-card p{margin:0 0 11px;color:#c5b2bc;font-size:10px;line-height:1.55}
      .private-chat-sister{display:flex;align-items:center;gap:10px;margin:12px 0;padding:9px;border:1px solid #3c2933;border-radius:12px;background:#131013}
      .private-chat-sister img{width:48px;height:64px;object-fit:cover;object-position:top center;border-radius:9px;background:#222}
      .private-chat-sister strong{display:block;margin-bottom:3px;font-size:10px}
      .private-chat-sister span{color:#9f8994;font-size:8px}
      .private-chat-email{width:100%;min-height:46px;display:flex;align-items:center;justify-content:center;gap:7px;border-radius:12px;background:linear-gradient(135deg,#ed5b96,#cb3471);color:#fff;text-decoration:none;font-size:10.5px;font-weight:950}
      .private-chat-email svg{width:16px;height:16px;fill:currentColor}
      .private-chat-note{margin-top:10px!important;color:#8f7a85!important;font-size:8px!important;text-align:center}
      .members-chat-button{width:100%;min-height:48px;margin-top:9px;display:flex;align-items:center;justify-content:center;gap:8px;border:1px solid #6a4ee8;border-radius:12px;background:linear-gradient(135deg,#2b2147,#171225);color:#c9bcff;text-decoration:none;font-size:10.5px;font-weight:900;box-shadow:0 8px 20px rgba(37,25,70,.28);transition:transform .14s ease,border-color .14s ease}
      .members-chat-button:active{transform:scale(.98)}
      .members-chat-button svg{width:16px;height:16px;fill:currentColor}
      @media(max-width:350px){.private-chat-button{font-size:9px;gap:4px}.private-chat-button svg{width:14px;height:14px;flex-basis:14px}}
      @media(prefers-reduced-motion:reduce){.private-chat-button,.private-chat-modal,.members-chat-button{transition:none!important}}
    `;
    document.head.appendChild(style);
  }

  function selectedSister(){
    const thumbs = $$(".chat-home-thumb");
    const selected = thumbs.findIndex(button => button.classList.contains("selected"));
    const index = selected >= 0 ? selected : 0;
    const url = window.BluiaMedia?.models?.[index] || $("#chat-home-photo")?.src || "";
    return {index,url};
  }

  function mailtoFor(index){
    const sister = `Bluia Sister ${index + 1}`;
    const subject = `Private chat request — ${sister}`;
    const body = `Hello Bluia Sisters,\n\nI would like to schedule a private chat with ${sister}.\n\nMy preferred date:\nMy preferred time and timezone:\nMy name:\n\nPlease let me know the available times and next steps.\n\nThank you.`;
    return `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  function openModal(){
    const modal = $("#private-chat-modal");
    if(!modal) return;
    const {index,url} = selectedSister();
    const img = $("#private-chat-sister-image");
    const label = $("#private-chat-sister-label");
    const link = $("#private-chat-email-link");
    if(img) img.src = url;
    if(label) label.textContent = `Bluia Sister ${index + 1}`;
    if(link) link.href = mailtoFor(index);
    modal.classList.add("open");
    modal.setAttribute("aria-hidden","false");
    document.documentElement.style.overflow = "hidden";
  }

  function closeModal(){
    const modal = $("#private-chat-modal");
    if(!modal) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden","true");
    document.documentElement.style.overflow = "";
  }

  function buildPlayBooking(){
    if($("#private-chat-button")) return true;
    const actions = $(".play-actions");
    if(!actions) return false;

    const button = document.createElement("button");
    button.type = "button";
    button.className = "private-chat-button";
    button.id = "private-chat-button";
    button.innerHTML = `${chatIcon}<span>Chat</span>`;
    actions.appendChild(button);

    if(!$("#private-chat-modal")){
      document.body.insertAdjacentHTML("beforeend",`
        <div class="private-chat-modal" id="private-chat-modal" aria-hidden="true">
          <div class="private-chat-card" role="dialog" aria-modal="true" aria-labelledby="private-chat-title">
            <button class="private-chat-close" type="button" aria-label="Close">×</button>
            <div class="private-chat-badge">Private chat</div>
            <h3 id="private-chat-title">Schedule a private chat</h3>
            <p>Book a private chat session with the Bluia Sister you selected. Send us an email with your preferred date, time and timezone, and we’ll reply with availability and the next steps.</p>
            <div class="private-chat-sister">
              <img id="private-chat-sister-image" alt="Selected Bluia Sister" decoding="async">
              <div><strong id="private-chat-sister-label">Bluia Sister</strong><span>Your selected model</span></div>
            </div>
            <a class="private-chat-email" id="private-chat-email-link" href="mailto:${EMAIL}">${chatIcon}<span>Email to schedule your chat</span></a>
            <p class="private-chat-note">Email: ${EMAIL}</p>
          </div>
        </div>`);

      $(".private-chat-close")?.addEventListener("click",closeModal);
      $("#private-chat-modal")?.addEventListener("click",event => { if(event.target.id === "private-chat-modal") closeModal(); });
      document.addEventListener("keydown",event => { if(event.key === "Escape") closeModal(); });
    }

    button.addEventListener("click",openModal);
    return true;
  }

  function buildMembersChat(){
    if($("#members-chat-button")) return true;
    const card = $(".members-card");
    if(!card) return false;
    const note = card.querySelector(".members-note");
    const link = document.createElement("a");
    link.id = "members-chat-button";
    link.className = "members-chat-button";
    link.href = CHAT_URL;
    link.innerHTML = `${chatIcon}<span>Open Members Chat</span>`;
    link.setAttribute("aria-label","Open Bluia Sisters Chat");
    if(note) note.insertAdjacentElement("beforebegin",link);
    else card.appendChild(link);
    return true;
  }

  function start(){
    addStyles();
    const tryBuild = () => buildPlayBooking() && buildMembersChat();
    if(tryBuild()) return;
    const observer = new MutationObserver(() => {
      if(tryBuild()) observer.disconnect();
    });
    observer.observe(document.documentElement,{childList:true,subtree:true});
    setTimeout(() => observer.disconnect(),10000);
  }

  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded",start,{once:true});
  else start();
})();