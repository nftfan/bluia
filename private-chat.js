(() => {
  "use strict";

  const CHAT_URL = "https://bluia.online/chat";
  const MEMBERS_URL = "/members/members.json";
  const FIREBASE_REQUEST_URL = "https://bluias-default-rtdb.firebaseio.com/bluiaChat/v1/contactRequests.json";
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  let submitting = false;

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
      .private-chat-button{min-height:47px;display:flex;align-items:center;justify-content:center;gap:7px;width:100%;border:1px solid rgba(255,255,255,.96);border-radius:13px;background:#fff;color:#6a4ee8;font-size:10.5px;font-weight:950;cursor:pointer;box-shadow:0 8px 20px rgba(87,10,40,.15);transition:transform .14s ease}
      .private-chat-button:active{transform:scale(.975)}
      .private-chat-button svg{width:17px;height:17px;fill:currentColor;flex:0 0 17px}
      .private-chat-modal{position:fixed;inset:0;z-index:100010;display:grid;place-items:center;padding:16px;background:rgba(0,0,0,.86);opacity:0;visibility:hidden;pointer-events:none;transition:opacity .16s ease,visibility .16s ease}
      .private-chat-modal.open{opacity:1;visibility:visible;pointer-events:auto}
      .private-chat-card{position:relative;width:min(94vw,390px);padding:24px 18px 18px;border:1px solid #4b3140;border-radius:20px;background:linear-gradient(180deg,#171014,#0d0a0c);color:#fff;text-align:left;box-shadow:0 28px 80px rgba(0,0,0,.65)}
      .private-chat-close{position:absolute;top:9px;right:9px;width:34px;height:34px;border:1px solid rgba(255,255,255,.28);border-radius:50%;background:#21161c;color:#fff;font-size:20px;line-height:1;cursor:pointer}
      .private-chat-badge{display:inline-flex;align-items:center;gap:6px;margin-bottom:12px;padding:6px 9px;border-radius:999px;background:#261923;color:#ff8fba;font-size:8px;font-weight:900}
      .private-chat-card h3{margin:0 38px 7px 0;font-size:20px;line-height:1.2}
      .private-chat-card p{margin:0 0 13px;color:#c5b2bc;font-size:10px;line-height:1.55}
      .private-chat-field{display:block;margin:0 0 8px;color:#cbb9c3;font-size:8px;font-weight:900;letter-spacing:.35px;text-transform:uppercase}
      .private-chat-input{width:100%;height:48px;padding:0 13px;border:1px solid #4a3440;border-radius:12px;outline:none;background:#100d0f;color:#fff;font-size:16px;box-shadow:inset 0 1px 0 rgba(255,255,255,.025)}
      .private-chat-input:focus{border-color:#ff6fa8;box-shadow:0 0 0 3px rgba(255,95,157,.12)}
      .private-chat-submit{width:100%;min-height:48px;margin-top:10px;display:flex;align-items:center;justify-content:center;gap:7px;border:0;border-radius:12px;background:linear-gradient(135deg,#ed5b96,#cb3471);color:#fff;font-size:10.5px;font-weight:950;cursor:pointer}
      .private-chat-submit:disabled{opacity:.55;cursor:default}
      .private-chat-submit svg{width:16px;height:16px;fill:currentColor}
      .private-chat-status{min-height:18px;margin:9px 2px 0!important;color:#9d8993!important;font-size:8.5px!important;text-align:center}
      .private-chat-status.success{color:#91e2b6!important}.private-chat-status.error{color:#ff9ab7!important}
      .members-chat-button{width:100%;min-height:48px;margin-top:9px;display:flex;align-items:center;justify-content:center;gap:8px;border:1px solid #6a4ee8;border-radius:12px;background:linear-gradient(135deg,#2b2147,#171225);color:#c9bcff;text-decoration:none;font-size:10.5px;font-weight:900;box-shadow:0 8px 20px rgba(37,25,70,.28);transition:transform .14s ease,border-color .14s ease}
      .members-chat-button:active{transform:scale(.98)}
      .members-chat-button svg{width:16px;height:16px;fill:currentColor}
      @media(max-width:350px){.private-chat-button{font-size:9.5px;gap:5px}.private-chat-button svg{width:15px;height:15px;flex-basis:15px}}
      @media(prefers-reduced-motion:reduce){.private-chat-button,.private-chat-modal,.members-chat-button{transition:none!important}}
    `;
    document.head.appendChild(style);
  }

  function selectedSister(){
    const thumbs = $$(".chat-home-thumb");
    const selected = thumbs.findIndex(button => button.classList.contains("selected"));
    const index = selected >= 0 ? selected : 0;
    return {index,name:`Bluia Sister ${index + 1}`};
  }

  async function isMember(email){
    const response = await fetch(MEMBERS_URL,{cache:"no-store"});
    if(!response.ok) throw new Error(`Member list failed (${response.status})`);
    const data = await response.json();
    const members = Array.isArray(data?.members) ? data.members : [];
    return members.some(member => String(member).trim().toLowerCase() === email);
  }

  function openModal(){
    const modal = $("#private-chat-modal");
    if(!modal) return;
    const status = $("#private-chat-status");
    const input = $("#private-chat-member-email");
    if(status){status.textContent="";status.className="private-chat-status";}
    if(input) input.value = "";
    modal.classList.add("open");
    modal.setAttribute("aria-hidden","false");
    document.documentElement.style.overflow = "hidden";
    setTimeout(() => input?.focus(),80);
  }

  function closeModal(){
    const modal = $("#private-chat-modal");
    if(!modal || submitting) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden","true");
    document.documentElement.style.overflow = "";
  }

  async function submitMemberEmail(){
    if(submitting) return;
    const input = $("#private-chat-member-email");
    const button = $("#private-chat-submit");
    const status = $("#private-chat-status");
    const email = (input?.value || "").trim().toLowerCase();

    if(!/^\S+@\S+\.\S+$/.test(email)){
      if(status){status.textContent="Enter a valid email address.";status.className="private-chat-status error";}
      input?.focus();
      return;
    }

    submitting = true;
    if(button){button.disabled=true;button.textContent="Checking…";}
    if(status){status.textContent="Checking membership…";status.className="private-chat-status";}

    try{
      const member = await isMember(email);
      if(!member){
        if(status){
          status.textContent="You are not a member yet. First buy a membership, then use the same email address here.";
          status.className="private-chat-status error";
        }
        return;
      }

      const sister = selectedSister();
      if(button) button.textContent="Sending…";
      if(status){status.textContent="Membership confirmed. Sending your request…";status.className="private-chat-status";}

      const response = await fetch(FIREBASE_REQUEST_URL,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          email,
          sisterId:`sister_${String(sister.index + 1).padStart(2,"0")}`,
          sisterName:sister.name,
          member:true,
          createdAt:Date.now(),
          source:"main_play_chat"
        })
      });
      if(!response.ok) throw new Error(`Firebase request failed (${response.status})`);
      const data = await response.json();
      if(!data?.name) throw new Error("Firebase did not confirm the request");
      if(status){
        status.textContent="Membership confirmed. Your request was received. A Bluia Sister will email you her private contact.";
        status.className="private-chat-status success";
      }
      if(input) input.value="";
    }catch(error){
      if(status){
        status.textContent="Could not verify or save your request. Please try again.";
        status.className="private-chat-status error";
      }
      console.error("Bluia chat request error",error);
    }finally{
      submitting=false;
      if(button){button.disabled=false;button.innerHTML=`${chatIcon}<span>Send request</span>`;}
    }
  }

  function buildPlayChat(){
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
            <div class="private-chat-badge">Members chat</div>
            <h3 id="private-chat-title">Get her private contact</h3>
            <p>Enter the email address you used to buy your Bluia Sisters membership. Only active member emails can send a request.</p>
            <label class="private-chat-field" for="private-chat-member-email">Membership email</label>
            <input class="private-chat-input" id="private-chat-member-email" type="email" inputmode="email" autocomplete="email" autocapitalize="none" spellcheck="false" placeholder="you@example.com">
            <button class="private-chat-submit" id="private-chat-submit" type="button">${chatIcon}<span>Send request</span></button>
            <p class="private-chat-status" id="private-chat-status" aria-live="polite"></p>
          </div>
        </div>`);

      $(".private-chat-close")?.addEventListener("click",closeModal);
      $("#private-chat-modal")?.addEventListener("click",event => { if(event.target.id === "private-chat-modal") closeModal(); });
      $("#private-chat-submit")?.addEventListener("click",submitMemberEmail);
      $("#private-chat-member-email")?.addEventListener("keydown",event => { if(event.key === "Enter") submitMemberEmail(); });
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
    const tryBuild = () => buildPlayChat() && buildMembersChat();
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