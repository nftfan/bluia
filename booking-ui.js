// Runtime polish for Bluia Sisters Chat booking
(() => {
  "use strict";

  let applied = false;

  function addStyles(){
    if (document.getElementById("bluia-booking-ui-polish")) return;
    const style = document.createElement("style");
    style.id = "bluia-booking-ui-polish";
    style.textContent = `
      #panel-booking{padding-top:12px!important}
      #panel-booking .booking-hero{display:none!important}
      #panel-booking .booking-wizard{padding:14px!important}
      #panel-booking .wizard-top{
        grid-template-columns:128px minmax(0,1fr)!important;
        gap:14px!important;
        align-items:stretch!important;
        margin-bottom:12px!important;
      }
      #panel-booking .wizard-image{
        width:128px!important;
        min-height:192px!important;
        aspect-ratio:2/3!important;
        border-radius:14px!important;
        object-fit:cover!important;
        object-position:top center!important;
      }
      #panel-booking .wizard-copy{
        justify-content:center!important;
        gap:0!important;
        min-width:0!important;
      }
      #panel-booking .wizard-copy *{font-family:Arial,Helvetica,sans-serif!important}
      #panel-booking .booking-side-kicker{
        margin:0 0 5px!important;
        color:#ff9bc2!important;
        font-size:7px!important;
        line-height:1.2!important;
        font-weight:950!important;
        letter-spacing:.9px!important;
        text-transform:uppercase!important;
      }
      #panel-booking .booking-side-title{
        margin:0 0 7px!important;
        color:#ffffff!important;
        font-size:11px!important;
        line-height:1.28!important;
        font-weight:950!important;
      }
      #panel-booking .booking-side-copy{
        margin:0 0 8px!important;
        color:#e8c8d5!important;
        font-size:9px!important;
        line-height:1.45!important;
        font-weight:500!important;
      }
      #panel-booking .booking-side-label{
        margin:0 0 3px!important;
        color:#ff73aa!important;
        font-size:8px!important;
        line-height:1.25!important;
        font-weight:900!important;
      }
      #panel-booking .booking-side-time{
        margin:0!important;
        color:#bda8b1!important;
        font-size:8px!important;
        line-height:1.42!important;
      }
      #panel-booking .wizard-sister-id{
        margin-top:7px!important;
        color:#87737c!important;
        font-size:7px!important;
        line-height:1.2!important;
      }
      #panel-booking .wizard-label{font-size:8.5px!important}
      #panel-booking .wizard-note{font-size:7.5px!important}
      #panel-booking .wizard-time-zone{font-size:7.8px!important}
      #panel-booking .wizard-time-zone strong{font-size:7px!important}
      #panel-booking .wizard-book{font-size:11px!important}
      #panel-booking .wizard-status{font-size:8.5px!important}
      @media(max-width:390px){
        #panel-booking .wizard-top{grid-template-columns:116px minmax(0,1fr)!important;gap:11px!important}
        #panel-booking .wizard-image{width:116px!important;min-height:174px!important}
        #panel-booking .booking-side-title{font-size:10.5px!important}
        #panel-booking .booking-side-copy{font-size:8.5px!important}
      }
      @media(max-width:340px){
        #panel-booking .wizard-top{grid-template-columns:104px minmax(0,1fr)!important;gap:10px!important}
        #panel-booking .wizard-image{width:104px!important;min-height:156px!important}
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
    time.textContent = "Your booking time is shown in your local timezone and Paris time.";

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
