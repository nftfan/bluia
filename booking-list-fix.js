(() => {
  "use strict";
  if (document.getElementById("booking-list-fix-style")) return;
  const style = document.createElement("style");
  style.id = "booking-list-fix-style";
  style.textContent = `
    #bookings-list{display:grid!important;grid-auto-flow:row!important;overflow:visible!important}
    #bookings-list .booking-entry{display:grid!important;content-visibility:visible!important;contain:none!important;position:relative!important;visibility:visible!important;opacity:1!important;transform:none!important}
  `;
  document.head.appendChild(style);
})();
