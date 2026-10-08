// Runtime polish for Bluia Sisters Chat booking
(() => {
  "use strict";

  let applied = false;

  function addStyles(){
    if (document.getElementById("bluia-booking-ui-polish")) return;
    const style = document.createElement("style");
    style.id = "bluia-booking-ui-polish";
    style.textContent = `
      #panel-booking{
        padding:12px 0 30px!important;
      }
      #panel-booking .booking-shell{
        width:100%!important;
        max-width:none!important;
        margin:0!important;
      }
      #panel-booking .booking-hero{display:none!important}
      #panel-booking .booking-wizard{
        width:100%!important;
        margin:0!important;
        padding:0 14px 14px!important;
        border:0!important;
        border-radius:0!important;
        background:transparent!important;
        box-shadow:none!important;
      }
      #panel-booking .wizard-top{
        display:grid!important;
        grid-template-columns:150px minmax(0,1fr)!important;
        gap:15px!important;
        align-items:stretch!important;
        width:100%!important;
        margin:0 0 13px!important;
      }
      #panel-booking .wizard-image{
        display:block!important;
        width:150px!important;
        min-height:225px!important;
        aspect-ratio:2/3!important;
        border:1px solid rgba(255,255,255,.26)!important;
        border-radius:15px!important;
        background:rgba(35,8,20,.28)!important;
        object-fit:cover!important;
        object-position:top center!important;
        box-shadow:0 10px 28px rgba(88,7,38,.18)!important;
      }
      #panel-booking .wizard-copy{
        display:flex!important;
        flex-direction:column!important;
        justify-content:center!important;
        min-width:0!important;
      }
      #panel-booking .wizard-copy *{font-family:Arial,Helvetica,sans-serif!important}
      #panel-booking .booking-side-kicker{
        margin:0 0 5px!important;
        color:#ffd0e2!important;
        font-size:7px!important;
        line-height:1.2!important;
        font-weight:950!important;
        letter-spacing:.9px!important;
        text-transform:uppercase!important;
      }
      #panel-booking .booking-side-title{
        margin:0 0 8px!important;
        color:#ffffff!important;
        font-size:11px!important;
        line-height:1.3!important;
        font-weight:950!important;
      }
      #panel-booking .booking-side-copy{
        margin:0 0 9px!important;
        color:#ffe5ef!important;
        font-size:9px!important;
        line-height:1.48!important;
        font-weight:500!important;
      }
      #panel-booking .booking-side-label{
        margin:0 0 3px!important;
        color:#5b102d!important;
        font-size:8px!important;
        line-height:1.25!important;
        font-weight:950!important;
      }
      #panel-booking .booking-side-time{
        margin:0!important;
        color:#ffe0eb!important;
        font-size:8px!important;
        line-height:1.45!important;
      }
      #panel-booking .wizard-sister-id{
        margin-top:8px!important;
        color:#6f233f!important;
        font-size:7px!important;
        line-height:1.2!important;
        letter-spacing:.45px!important;
      }
      #panel-booking .wizard-label{
        color:#fff3f7!important;
        font-size:8.5px!important;
      }
      #panel-booking .wizard-note{
        color:#7c2948!important;
        font-size:7.5px!important;
      }
      #panel-booking .wizard-time-preview{width:100%!important}
      #panel-booking .wizard-time-zone{
        border-color:rgba(255,255,255,.22)!important;
        background:rgba(54,10,28,.30)!important;
        color:#ffe5ef!important;
        font-size:7.8px!important;
      }
      #panel-booking .wizard-time-zone strong{
        color:#fff!important;
        font-size:7px!important;
      }
      #panel-booking .wizard-strip{
        width:100%!important;
        padding-bottom:6px!important;
      }
      #panel-booking .wizard-book{font-size:11px!important}
      #panel-booking .wizard-status{font-size:8.5px!important}
      #panel-booking .bookings-heading,
      #panel-booking .bookings-list{
        margin-left:14px!important;
        margin-right:14px!important;
      }
      #panel-booking .bookings-heading strong{font-size:11px!important}
      #panel-booking .bookings-heading span{font-size:8px!important}
      #panel-booking .booking-entry-name{font-size:10.5px!important}
      #panel-booking .booking-entry-time{font-size:9.5px!important}
      #panel-booking .booking-entry-zone,
      #panel-booking .booking-entry-id{font-size:7px!important}
      #panel-booking .booking-entry-duration,
      #panel-booking .booking-entry-countdown{font-size:8px!important}

      @media(max-width:390px){
        #panel-booking .booking-wizard{padding-left:11px!important;padding-right:11px!important}
        #panel-booking .wizard-top{grid-template-columns:136px minmax(0,1fr)!important;gap:12px!important}
        #panel-booking .wizard-image{width:136px!important;min-height:204px!important}
        #panel-booking .booking-side-title{font-size:10.5px!important}
        #panel-booking .booking-side-copy{font-size:8.5px!important;line-height:1.43!important}
        #panel-booking .bookings-heading,
        #panel-booking .bookings-list{margin-left:11px!important;margin-right:11px!important}
      }
      @media(max-width:340px){
        #panel-booking .wizard-top{grid-template-columns:120px minmax(0,1fr)!important;gap:10px!important}
        #panel-booking .wizard-image{width:120px!important;min-height:180px!important}
        #panel-booking .booking-side-copy{font-size:8px!important;line-height:1.38!important}
      }
    `;
    document.head.appendChild(style);
  }

  function apply(){
    if (applied) return true;

    const tab = document.querySelector('.booking-tab[data-panel="booking"]');
    const panel = document.getElementById("panel-booking");
    const hero = panel?.querySelector(".booking-hero");
    const copy = panel?.querySelector(".wizard-copy");
    const id = document.getElementById("wizard-sister-id");
    if (!tab || !panel || !hero || !copy || !id) return false;

    addStyles();

    const kickerText = hero.querySelector(".kicker")?.textContent?.trim() || "Private chat booking";
    const titleText = hero.querySelector("h2")?.textContent?.trim() || "Chat with Bluia Sisters 💗";
    const introText = hero.querySelector("p")?.textContent?.trim() || "Choose a Bluia Sister, select your date and time, then confirm your private booking with a PIN.";

    copy.innerHTML = "";

    const kicker = document.createElement("div");
    kicker.className = "booking-side-kicker";
    kicker.textContent = kickerText;

    const title = document.createElement("div");
    title.className = "booking-side-title";
    title.textContent = titleText;

    const intro = document.createElement("p");
    intro.className = "booking-side-copy";
    intro.textContent = introText;

    const details = document.createElement("div");
    details.className = "booking-side-label";
    details.textContent = "Booking details";

    const time = document.createElement("p");
    time.className = "booking-side-time";
    time.textContent = "Your time and Paris time are shown automatically. Chat duration is 30 minutes by default.";

    copy.append(kicker, title, intro, details, time, id);
    hero.remove();

    applied = true;

    // Chat is the default section when the page first opens.
    setTimeout(() => tab.click(), 80);
    return true;
  }

  function start(){
    if (apply()) return;
    const observer = new MutationObserver(() => {
      if (apply()) observer.disconnect();
    });
    observer.observe(document.documentElement, {childList:true, subtree:true});
    setTimeout(() => observer.disconnect(), 10000);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, {once:true});
  else start();
})();
