(() => {
  "use strict";

  const FIREBASE_VERSION = "10.14.1";
  const BUY_PIN_URL = "https://buy.stripe.com/4gMbITgUo0jc1yF3F5bAs04";
  const PIN_HASH = "f8dc9104d6c66966c0a1b9dd7dd8327018b4882425ccaa90d5a69eef1d09997b";
  const firebaseConfig = {
    apiKey: "AIzaSyDmDAHuk6CEObzaJMhIlvNReOI0K83wK0k",
    authDomain: "bluias.firebaseapp.com",
    databaseURL: "https://bluias-default-rtdb.firebaseio.com",
    projectId: "bluias",
    storageBucket: "bluias.firebasestorage.app",
    messagingSenderId: "604309456152",
    appId: "1:604309456152:web:71dfcb29cbcda483260a6d"
  };

  const models = Array.isArray(window.BluiaBookingModels) ? window.BluiaBookingModels : [];
  const $ = selector => document.querySelector(selector);

  let dbMod = null;
  let db = null;
  let bookingsRef = null;
  let existingBookings = [];
  let selectedSister = "";
  let selectedSisterId = "";
  let pendingBooking = null;

  function sisterKey(url){
    let hash = 2166136261;
    for(let i=0;i<url.length;i++){
      hash ^= url.charCodeAt(i);
      hash = Math.imul(hash,16777619);
    }
    return `s_${(hash>>>0).toString(36)}`;
  }

  function randomSisterId(){
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    const bytes = new Uint8Array(4);
    crypto.getRandomValues(bytes);
    let out = "";
    for(let i=0;i<4;i++) out += chars[bytes[i] % chars.length];
    return out;
  }

  function resolveSister(){
    const params = new URLSearchParams(location.search);
    let index = Number(params.get("s"));
    if(!Number.isInteger(index)){
      try{ index = Number(localStorage.getItem("bluiaBookingSisterIndex")); }
      catch(e){ index = 0; }
    }
    if(!Number.isInteger(index)) index = 0;
    index = Math.max(0,Math.min(index,Math.max(0,models.length-1)));
    selectedSister = models[index] || "";
    try{ localStorage.setItem("bluiaBookingSisterIndex",String(index)); }catch(e){}
  }

  function viewerTimeZone(){
    try{return Intl.DateTimeFormat().resolvedOptions().timeZone || "Local";}
    catch(e){return "Local";}
  }

  function localDate(){
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
  }

  function defaultTime(){
    const d = new Date(Date.now()+3600000);
    d.setMinutes(Math.ceil(d.getMinutes()/30)*30,0,0);
    return `${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
  }

  function localStartMs(date,time){
    const d = new Date(`${date||""}T${time||""}`);
    return Number.isNaN(d.getTime()) ? NaN : d.getTime();
  }

  function bookingStartMs(item){
    const direct = Number(item?.startAtMs);
    if(Number.isFinite(direct) && direct > 0) return direct;
    return localStartMs(item?.date,item?.time);
  }

  function bookingBounds(item){
    const start = bookingStartMs(item);
    const duration = Math.max(1,Number(item?.duration)||30) * 60000;
    return {start,end:start+duration};
  }

  function sameSister(a,b){
    if(a.sisterId && b.sisterId) return a.sisterId === b.sisterId;
    return (a.sisterImage||"") === (b.sisterImage||"");
  }

  function overlapsExisting(candidate,items=existingBookings){
    const a = bookingBounds(candidate);
    if(!Number.isFinite(a.start)) return false;
    return items.some(item => {
      if(!sameSister(candidate,item)) return false;
      const b = bookingBounds(item);
      return Number.isFinite(b.start) && a.start < b.end && a.end > b.start;
    });
  }

  function formatLocal(ms){
    if(!Number.isFinite(ms)) return "Time unavailable";
    try{
      return new Intl.DateTimeFormat(undefined,{weekday:"short",month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"}).format(new Date(ms));
    }catch(e){ return new Date(ms).toLocaleString(); }
  }

  function formatParis(ms){
    if(!Number.isFinite(ms)) return "Time unavailable";
    try{
      return new Intl.DateTimeFormat(undefined,{timeZone:"Europe/Paris",weekday:"short",month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"}).format(new Date(ms));
    }catch(e){ return new Date(ms).toLocaleString(); }
  }

  function updateSelectedLabel(){
    const el = $("#selected-sister-id");
    if(el) el.textContent = selectedSisterId ? `ID ${selectedSisterId}` : "ID …";
  }

  function updateTimePreview(){
    const wrap = $("#booking-time-preview");
    if(!wrap) return;
    const ms = localStartMs($("#booking-date")?.value||"",$("#booking-time")?.value||"");
    if(!Number.isFinite(ms)){ wrap.innerHTML = ""; return; }
    wrap.innerHTML = `<div class="time-zone-box"><strong>Your time</strong>${formatLocal(ms)}<small>${viewerTimeZone()}</small></div><div class="time-zone-box"><strong>Paris time</strong>${formatParis(ms)}<small>Europe/Paris</small></div>`;
  }

  function compactRemaining(ms){
    const total = Math.max(0,Math.floor(ms/1000));
    const days = Math.floor(total/86400);
    const hours = Math.floor((total%86400)/3600);
    const minutes = Math.floor((total%3600)/60);
    const seconds = total%60;
    if(days>0) return `${days}d ${hours}h ${minutes}m`;
    if(hours>0) return `${hours}h ${minutes}m ${seconds}s`;
    return `${minutes}m ${seconds}s`;
  }

  function updateCountdowns(){
    if(document.hidden) return;
    const now = Date.now();
    document.querySelectorAll(".booking-countdown[data-start]").forEach(el => {
      const start = Number(el.dataset.start||0);
      const duration = Math.max(1,Number(el.dataset.duration||30))*60000;
      const end = start + duration;
      el.classList.remove("live","ended");
      if(!Number.isFinite(start)||!start){el.textContent="Schedule unavailable";return;}
      if(now < start){el.textContent=`Starts in ${compactRemaining(start-now)}`;return;}
      if(now < end){el.textContent=`Chat live · ${compactRemaining(end-now)} remaining`;el.classList.add("live");return;}
      el.textContent="Chat ended";
      el.classList.add("ended");
    });
  }

  function looksLikeBooking(node){
    if(!node || typeof node !== "object" || Array.isArray(node)) return false;
    const hasTime = Number.isFinite(Number(node.startAtMs)) || (typeof node.date === "string" && typeof node.time === "string");
    const hasBookingData = "name" in node || "duration" in node || "sisterId" in node || "sisterImage" in node || "createdAt" in node;
    return hasTime && hasBookingData;
  }

  function collectBookings(raw){
    const result = [];
    const seen = new Set();

    function walk(node,path){
      if(!node || typeof node !== "object") return;
      if(looksLikeBooking(node)){
        const id = path || String(node.id||result.length);
        const key = `${id}|${node.createdAt||""}|${node.startAtMs||""}|${node.name||""}`;
        if(!seen.has(key)){
          seen.add(key);
          result.push({id,...node});
        }
        return;
      }
      Object.entries(node).forEach(([key,value]) => walk(value,path ? `${path}/${key}` : key));
    }

    walk(raw,"");
    return result;
  }

  function renderBookings(items){
    const list = $("#bookings-list");
    if(!list) return;

    const sorted = [...items].sort((a,b) => {
      const aa = Number(a.createdAt)||bookingStartMs(a)||0;
      const bb = Number(b.createdAt)||bookingStartMs(b)||0;
      return bb-aa;
    });

    const meta = $("#bookings-meta");
    if(meta) meta.textContent = sorted.length ? `${sorted.length} confirmed · newest first` : "No confirmed bookings";

    const fragment = document.createDocumentFragment();
    sorted.forEach((item,index) => {
      const start = bookingStartMs(item);
      const card = document.createElement("article");
      card.className = "booking-row";
      card.dataset.bookingIndex = String(index);

      const top = document.createElement("div");
      top.className = "booking-row-top";
      const name = document.createElement("strong");
      name.textContent = item.name || "Guest";
      const badge = document.createElement("span");
      badge.textContent = "Confirmed";
      top.append(name,badge);

      const local = document.createElement("div");
      local.className = "booking-row-time";
      local.textContent = `Your time · ${formatLocal(start)}`;

      const paris = document.createElement("div");
      paris.className = "booking-row-paris";
      paris.textContent = `Paris · ${formatParis(start)}`;

      const details = document.createElement("div");
      details.className = "booking-row-meta";
      details.textContent = `${Number(item.duration)||30} min · ${item.sisterId ? `Bluia Sister ID ${item.sisterId}` : "Bluia Sister"}`;

      const countdown = document.createElement("div");
      countdown.className = "booking-countdown";
      countdown.dataset.start = String(Number.isFinite(start)?start:"");
      countdown.dataset.duration = String(Number(item.duration)||30);

      card.append(top,local,paris,details,countdown);
      fragment.appendChild(card);
    });

    list.replaceChildren();
    if(!sorted.length){
      const empty = document.createElement("div");
      empty.className = "booking-empty";
      empty.textContent = "No confirmed bookings yet.";
      list.appendChild(empty);
    }else{
      list.appendChild(fragment);
    }
    updateCountdowns();
  }

  async function ensureSisterId(){
    if(!dbMod || !db || !selectedSister) return;
    const ref = dbMod.ref(db,`sisterProfiles/${sisterKey(selectedSister)}`);
    try{
      const result = await dbMod.runTransaction(ref,current => {
        if(current?.id) return current;
        return {id:randomSisterId(),image:selectedSister,createdAt:Date.now()};
      },{applyLocally:false});
      const value = result.snapshot.val() || {};
      selectedSisterId = value.id || "";
      updateSelectedLabel();
    }catch(err){
      console.warn("Bluia Sister ID setup failed",err);
    }
  }

  function prepareBooking(){
    const status = $("#booking-status");
    const name = ($("#booking-name")?.value||"").trim();
    const date = $("#booking-date")?.value||"";
    const time = $("#booking-time")?.value||"";
    const duration = Number($("#booking-duration")?.value||30);

    if(!selectedSister){status.textContent="No Bluia Sister was selected. Return to the main page and choose one.";return;}
    if(!name){status.textContent="Enter your name.";$("#booking-name")?.focus();return;}
    if(!date||!time){status.textContent="Choose a date and time.";return;}

    const startAtMs = localStartMs(date,time);
    if(!Number.isFinite(startAtMs)){status.textContent="Choose a valid date and time.";return;}
    if(startAtMs < Date.now()-60000){status.textContent="Choose a future booking time.";return;}

    const candidate = {
      name:name.slice(0,50),
      sisterImage:selectedSister,
      sisterId:selectedSisterId,
      date,
      time,
      duration,
      startAtMs,
      visitorTimeZone:viewerTimeZone(),
      visitorOffsetMinutes:new Date(startAtMs).getTimezoneOffset(),
      createdAt:Date.now()
    };

    if(overlapsExisting(candidate)){
      status.textContent="That Bluia Sister is already booked during this time. Please choose another time.";
      return;
    }

    pendingBooking = candidate;
    status.textContent = "";
    $("#pin-error").textContent = "";
    $("#pin-modal")?.classList.add("open");
    document.documentElement.style.overflow = "hidden";
    setTimeout(() => $("#pin-input")?.focus(),80);
  }

  async function hashText(text){
    const data = new TextEncoder().encode(text);
    const hash = await crypto.subtle.digest("SHA-256",data);
    return [...new Uint8Array(hash)].map(b=>b.toString(16).padStart(2,"0")).join("");
  }

  function closePin(){
    $("#pin-modal")?.classList.remove("open");
    document.documentElement.style.overflow = "";
  }

  async function confirmPin(){
    const input = $("#pin-input");
    const error = $("#pin-error");
    const button = $("#pin-confirm");
    const status = $("#booking-status");

    if(await hashText((input?.value||"").trim()) !== PIN_HASH){
      error.textContent = "Incorrect PIN. Check the PIN sent to your email.";
      input?.focus();
      return;
    }
    if(!pendingBooking || !bookingsRef || !dbMod){
      error.textContent = "Booking service is not ready. Please try again.";
      return;
    }

    button.disabled = true;
    button.textContent = "Confirming…";

    try{
      const newKey = dbMod.push(bookingsRef).key;
      let overlap = false;
      const result = await dbMod.runTransaction(bookingsRef,current => {
        overlap = false;
        const source = current && typeof current === "object" ? current : {};
        const items = collectBookings(source);
        if(overlapsExisting(pendingBooking,items)){
          overlap = true;
          return;
        }
        return {...source,[newKey]:pendingBooking};
      },{applyLocally:false});

      if(!result.committed){
        error.textContent = overlap ? "This time was just booked by someone else. Please choose another time." : "Could not confirm this booking. Please try again.";
        return;
      }

      pendingBooking = null;
      if(input) input.value = "";
      if($("#booking-name")) $("#booking-name").value = "";
      closePin();
      status.textContent = "Booking confirmed 💗";
      setTimeout(() => $("#bookings-section")?.scrollIntoView({behavior:"smooth",block:"start"}),80);
    }catch(err){
      console.warn("Booking save failed",err);
      error.textContent = "Could not save your booking. Please try again.";
    }finally{
      button.disabled = false;
      button.textContent = "Confirm Booking";
    }
  }

  async function initFirebase(){
    try{
      const [appMod,databaseMod] = await Promise.all([
        import(`https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/firebase-app.js`),
        import(`https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/firebase-database.js`)
      ]);

      let app = appMod.getApps().find(x=>x.name === "bluia-booking-page");
      if(!app) app = appMod.initializeApp(firebaseConfig,"bluia-booking-page");

      dbMod = databaseMod;
      db = databaseMod.getDatabase(app);
      bookingsRef = databaseMod.ref(db,"chatBookings");

      // Start the booking feed immediately. Do not wait for sister ID setup.
      databaseMod.onValue(bookingsRef,snapshot => {
        const items = collectBookings(snapshot.val() || {});
        existingBookings = items;
        renderBookings(items);
      },error => {
        console.warn("Booking read failed",error);
        const list = $("#bookings-list");
        if(list) list.innerHTML = '<div class="booking-empty">Bookings could not be loaded right now.</div>';
      });

      // Also perform a direct initial read so the full current list is painted immediately.
      databaseMod.get(bookingsRef).then(snapshot => {
        const items = collectBookings(snapshot.val() || {});
        existingBookings = items;
        renderBookings(items);
      }).catch(()=>{});

      ensureSisterId();
    }catch(err){
      console.warn("Firebase setup failed",err);
      const status = $("#booking-status");
      const list = $("#bookings-list");
      if(status) status.textContent = "Booking service is temporarily unavailable.";
      if(list) list.innerHTML = '<div class="booking-empty">Bookings could not be loaded right now.</div>';
    }
  }

  function start(){
    resolveSister();
    updateSelectedLabel();

    const date = $("#booking-date");
    const time = $("#booking-time");
    if(date){date.min = localDate();date.value = localDate();}
    if(time) time.value = defaultTime();
    updateTimePreview();

    $("#booking-date")?.addEventListener("change",updateTimePreview);
    $("#booking-time")?.addEventListener("input",updateTimePreview);
    $("#booking-time")?.addEventListener("change",updateTimePreview);
    $("#continue-pin")?.addEventListener("click",prepareBooking);
    $("#pin-close")?.addEventListener("click",closePin);
    $("#pin-modal")?.addEventListener("click",event=>{if(event.target.id==="pin-modal")closePin();});
    $("#pin-confirm")?.addEventListener("click",confirmPin);
    $("#pin-input")?.addEventListener("keydown",event=>{if(event.key==="Enter")confirmPin();});
    document.addEventListener("keydown",event=>{if(event.key==="Escape")closePin();});
    $("#buy-pin")?.setAttribute("href",BUY_PIN_URL);

    initFirebase();
    setInterval(updateCountdowns,1000);
    document.addEventListener("visibilitychange",()=>{if(!document.hidden)updateCountdowns();});
  }

  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded",start,{once:true});
  else start();
})();