// Bluia Sisters Fans tab powered by Firebase
(() => {
  "use strict";

  const firebaseConfig = {
    apiKey: "AIzaSyDmDAHuk6CEObzaJMhIlvNReOI0K83wK0k",
    authDomain: "bluias.firebaseapp.com",
    databaseURL: "https://bluias-default-rtdb.firebaseio.com",
    projectId: "bluias",
    storageBucket: "bluias.firebasestorage.app",
    messagingSenderId: "604309456152",
    appId: "1:604309456152:web:71dfcb29cbcda483260a6d",
    measurementId: "G-GQJY1FF8BT"
  };

  const FIREBASE_VERSION = "10.14.1";
  let selectedPhotoUrl = "";
  let latestFanItems = [];

  function addStyles(){
    if (document.getElementById("bluia-fans-style")) return;
    const style = document.createElement("style");
    style.id = "bluia-fans-style";
    style.textContent = `
      .media-tabs{grid-template-columns:repeat(5,minmax(0,1fr)) !important;gap:5px !important}
      .fans-tab{border-color:#ff6ba7 !important;color:#ff8fba !important;background:#211019 !important}
      .fans-tab.active{border-color:#ff4f95 !important;background:linear-gradient(135deg,#ff6aa8,#d93778) !important;color:#fff !important}
      #panel-fans{background:#f14d8d;min-height:calc(100svh - 52px);padding:16px 12px 28px}
      .fans-shell{width:min(100%,440px);margin:0 auto;text-align:left}
      .fans-hero{padding:6px 4px 14px;color:#fff;text-align:center}
      .fans-hero h2{margin:0 0 6px;font:700 24px/1.1 Georgia,"Times New Roman",serif;letter-spacing:-.35px}
      .fans-hero p{margin:0 auto;max-width:360px;font-size:10.5px;line-height:1.5;color:#ffe7f0}
      .fans-compose{padding:14px;border:1px solid rgba(255,255,255,.25);border-radius:18px;background:rgba(28,5,16,.88);box-shadow:0 16px 38px rgba(87,7,40,.24)}
      .fans-compose h3{margin:0 0 10px;color:#fff;font-size:14px}
      .fans-field{width:100%;margin:0 0 8px;padding:11px 12px;border:1px solid #563141;border-radius:11px;background:#120b0f;color:#fff;font-size:16px;outline:none}
      textarea.fans-field{min-height:92px;resize:vertical;line-height:1.45}
      .fans-field:focus{border-color:#ff6aa8;box-shadow:0 0 0 2px rgba(255,106,168,.12)}
      .fans-photo-picker{margin:2px 0 10px}
      .fans-photo-picker-row{display:flex;align-items:center;gap:8px}
      .fans-photo-toggle{min-height:38px;padding:0 12px;border:1px solid #633346;border-radius:10px;background:#1a0d13;color:#ff91bc;font-size:10px;font-weight:900;cursor:pointer}
      .fans-photo-clear{display:none;min-height:38px;padding:0 10px;border:0;background:transparent;color:#baa4ae;font-size:10px;font-weight:800;cursor:pointer}
      .fans-photo-clear.show{display:inline-block}
      .fans-selected-photo{display:none;margin-top:8px;align-items:center;gap:8px;color:#d7c6ce;font-size:9.5px}
      .fans-selected-photo.show{display:flex}
      .fans-selected-photo img{width:42px;height:56px;object-fit:cover;object-position:top center;border-radius:7px;border:1px solid #663449;background:#111}
      .fans-photo-dropdown{display:none;margin-top:8px;padding:8px;border:1px solid #563141;border-radius:12px;background:#120b0f}
      .fans-photo-dropdown.open{display:block}
      .fans-photo-dropdown-title{margin:0 0 7px;color:#d9c8d0;font-size:9px;font-weight:800}
      .fans-photo-options{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:5px;max-height:260px;overflow:auto}
      .fan-photo-choice{position:relative;display:block;width:100%;aspect-ratio:2/3;padding:0;border:2px solid transparent;border-radius:8px;overflow:hidden;background:#241219;cursor:pointer}
      .fan-photo-choice img{display:block;width:100%;height:100%;object-fit:cover;object-position:top center}
      .fan-photo-choice.selected{border-color:#ff72ad;box-shadow:0 0 0 2px rgba(255,114,173,.18)}
      .fans-post-button{width:100%;min-height:44px;border:0;border-radius:11px;background:linear-gradient(135deg,#ff6aa8,#db397b);color:#fff;font-size:11px;font-weight:900;cursor:pointer;box-shadow:0 8px 22px rgba(223,55,121,.25)}
      .fans-post-button:disabled{opacity:.55;cursor:default}
      .fans-status{min-height:18px;margin:7px 2px 0;color:#d6c5cc;font-size:9px;line-height:1.35;text-align:center}
      .fans-latest-title{margin:18px 2px 9px;color:#fff;font-size:12px;font-weight:900}
      .fans-list{display:grid;gap:9px}
      .fan-card{display:grid;grid-template-columns:92px minmax(0,1fr);min-height:122px;overflow:hidden;border:1px solid rgba(255,255,255,.24);border-radius:15px;background:#fff;color:#241019;box-shadow:0 10px 26px rgba(98,8,44,.18)}
      .fan-card.no-photo{display:block;min-height:0}
      .fan-card-image{display:block;width:100%;height:100%;min-height:122px;object-fit:cover;object-position:top center;background:#ead5df}
      .fan-card-body{padding:12px;min-width:0}
      .fan-card-top{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:6px}
      .fan-card-name{color:#d53678;font-size:11px;font-weight:900;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
      .fan-card-time{color:#a68d98;font-size:8px;white-space:nowrap}
      .fan-card-message{margin:0;color:#3a2530;font-size:10.5px;line-height:1.5;white-space:pre-wrap;overflow-wrap:anywhere}
      .fans-empty{padding:14px;border:1px dashed rgba(255,255,255,.45);border-radius:13px;color:#ffeaf2;font-size:10px;text-align:center}
      @media(max-width:370px){.media-tab{padding:0 7px !important;font-size:9px !important}.media-tabs{gap:4px !important}.fans-photo-options{grid-template-columns:repeat(3,minmax(0,1fr))}.fan-card{grid-template-columns:82px minmax(0,1fr)}}
    `;
    document.head.appendChild(style);
  }

  function buildPhotoPicker(){
    const optionsWrap = document.getElementById("fans-photo-options");
    if (!optionsWrap) return;
    const photos = Array.isArray(window.BluiaMedia?.gallery) ? window.BluiaMedia.gallery : [];
    optionsWrap.innerHTML = "";
    if (!photos.length) {
      optionsWrap.innerHTML = '<div style="grid-column:1/-1;color:#bca8b0;font-size:9px;padding:8px 2px;">No Photos-tab images available.</div>';
      return;
    }
    photos.forEach((url, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "fan-photo-choice";
      button.dataset.url = url;
      button.setAttribute("aria-label", `Select Bluia Sisters photo ${index + 1}`);
      const img = document.createElement("img");
      img.src = url;
      img.alt = `Bluia Sisters photo ${index + 1}`;
      img.loading = "lazy";
      img.decoding = "async";
      button.appendChild(img);
      button.addEventListener("click", () => selectGalleryPhoto(url, button));
      optionsWrap.appendChild(button);
    });
  }

  function selectGalleryPhoto(url, choiceButton){
    selectedPhotoUrl = url || "";
    document.querySelectorAll(".fan-photo-choice").forEach(item => item.classList.toggle("selected", item === choiceButton));
    const preview = document.getElementById("fans-selected-photo");
    const previewImg = document.getElementById("fans-selected-photo-img");
    const clear = document.getElementById("fans-photo-clear");
    const dropdown = document.getElementById("fans-photo-dropdown");
    const toggle = document.getElementById("fans-photo-toggle");
    if (selectedPhotoUrl) {
      if (previewImg) previewImg.src = selectedPhotoUrl;
      if (preview) preview.classList.add("show");
      if (clear) clear.classList.add("show");
      if (toggle) toggle.textContent = "Change photo";
    }
    if (dropdown) dropdown.classList.remove("open");
  }

  function clearGalleryPhoto(){
    selectedPhotoUrl = "";
    document.querySelectorAll(".fan-photo-choice").forEach(item => item.classList.remove("selected"));
    const preview = document.getElementById("fans-selected-photo");
    const previewImg = document.getElementById("fans-selected-photo-img");
    const clear = document.getElementById("fans-photo-clear");
    const toggle = document.getElementById("fans-photo-toggle");
    if (preview) preview.classList.remove("show");
    if (previewImg) previewImg.removeAttribute("src");
    if (clear) clear.classList.remove("show");
    if (toggle) toggle.textContent = "Choose a photo";
  }

  function buildFansUI(){
    if (document.getElementById("panel-fans")) return;
    const nav = document.querySelector(".media-tabs");
    const main = document.querySelector("main");
    if (!nav || !main) return;

    const fansTab = document.createElement("button");
    fansTab.className = "media-tab fans-tab";
    fansTab.type = "button";
    fansTab.dataset.panel = "fans";
    fansTab.textContent = "Fans";
    const membersTab = nav.querySelector('[data-panel="members"]');
    if (membersTab) nav.insertBefore(fansTab, membersTab);
    else nav.appendChild(fansTab);

    const panel = document.createElement("section");
    panel.className = "media-panel";
    panel.id = "panel-fans";
    panel.innerHTML = `
      <div class="fans-shell">
        <div class="fans-hero">
          <h2>Love from the Fans 💗</h2>
          <p>Leave a love message for Bluia Sisters and optionally choose one of the photos from our Photos tab.</p>
        </div>
        <form class="fans-compose" id="fans-form">
          <h3>Post a love message</h3>
          <input class="fans-field" id="fan-name" type="text" maxlength="40" autocomplete="name" placeholder="Your name" required>
          <textarea class="fans-field" id="fan-message" maxlength="300" placeholder="Write your love message..." required></textarea>
          <div class="fans-photo-picker">
            <div class="fans-photo-picker-row">
              <button class="fans-photo-toggle" id="fans-photo-toggle" type="button">Choose a photo</button>
              <button class="fans-photo-clear" id="fans-photo-clear" type="button">Remove</button>
            </div>
            <div class="fans-selected-photo" id="fans-selected-photo">
              <img id="fans-selected-photo-img" alt="Selected Bluia Sisters photo">
              <span>Selected from Photos</span>
            </div>
            <div class="fans-photo-dropdown" id="fans-photo-dropdown">
              <div class="fans-photo-dropdown-title">Select any photo from the Photos tab</div>
              <div class="fans-photo-options" id="fans-photo-options"></div>
            </div>
          </div>
          <button class="fans-post-button" id="fans-submit" type="submit">Post Love Message</button>
          <div class="fans-status" id="fans-status" aria-live="polite"></div>
        </form>
        <div class="fans-latest-title">Latest love messages</div>
        <div class="fans-list" id="fans-list"><div class="fans-empty">Loading messages…</div></div>
      </div>
    `;

    const pageContent = main.querySelector(".page-content");
    if (pageContent) main.insertBefore(panel, pageContent);
    else main.appendChild(panel);
    buildPhotoPicker();

    const photoToggle = document.getElementById("fans-photo-toggle");
    const photoDropdown = document.getElementById("fans-photo-dropdown");
    const photoClear = document.getElementById("fans-photo-clear");
    photoToggle?.addEventListener("click", () => photoDropdown?.classList.toggle("open"));
    photoClear?.addEventListener("click", clearGalleryPhoto);

    const openFans = () => {
      document.querySelectorAll(".media-tab").forEach(tab => tab.classList.toggle("active", tab === fansTab));
      document.querySelectorAll(".media-panel").forEach(item => item.classList.toggle("active", item === panel));
      document.getElementById("tv-video")?.pause();
      document.getElementById("reel-video")?.pause();
    };
    fansTab.addEventListener("click", openFans);
    document.querySelectorAll(".media-tab:not(.fans-tab)").forEach(tab => {
      tab.addEventListener("click", () => {
        fansTab.classList.remove("active");
        panel.classList.remove("active");
      });
    });
  }

  function formatDate(value){
    const date = new Date(Number(value) || Date.now());
    try {
      return new Intl.DateTimeFormat(undefined, {month:"short", day:"numeric", hour:"2-digit", minute:"2-digit"}).format(date);
    } catch (error) {
      return date.toLocaleString();
    }
  }

  function normalizedPhoto(item){
    return item?.imageUrl || item?.photoUrl || item?.selectedPhotoUrl || item?.image || "";
  }

  function renderMessages(items){
    const list = document.getElementById("fans-list");
    if (!list) return;
    list.innerHTML = "";
    if (!items.length) {
      const empty = document.createElement("div");
      empty.className = "fans-empty";
      empty.textContent = "No love messages yet. Be the first 💗";
      list.appendChild(empty);
      return;
    }

    items.forEach(item => {
      const card = document.createElement("article");
      card.className = "fan-card";
      const photoUrl = normalizedPhoto(item);
      if (photoUrl) {
        const image = document.createElement("img");
        image.className = "fan-card-image";
        image.src = photoUrl;
        image.alt = `Bluia Sisters photo selected by ${item.name || "a fan"}`;
        image.loading = "lazy";
        image.decoding = "async";
        image.addEventListener("error", () => {
          image.remove();
          card.classList.add("no-photo");
        }, {once:true});
        card.appendChild(image);
      } else {
        card.classList.add("no-photo");
      }

      const body = document.createElement("div");
      body.className = "fan-card-body";
      const top = document.createElement("div");
      top.className = "fan-card-top";
      const name = document.createElement("div");
      name.className = "fan-card-name";
      name.textContent = item.name || "Fan";
      const time = document.createElement("div");
      time.className = "fan-card-time";
      time.textContent = formatDate(item.createdAt);
      const message = document.createElement("p");
      message.className = "fan-card-message";
      message.textContent = item.message || "";
      top.append(name, time);
      body.append(top, message);
      card.appendChild(body);
      list.appendChild(card);
    });
  }

  function setLatestItems(items){
    latestFanItems = items
      .filter(Boolean)
      .sort((a,b) => (Number(b.createdAt) || 0) - (Number(a.createdAt) || 0))
      .slice(0,5);
    renderMessages(latestFanItems);
  }

  async function initFirebaseFans(){
    const status = document.getElementById("fans-status");
    const form = document.getElementById("fans-form");
    const submit = document.getElementById("fans-submit");
    if (!form || !submit) return;

    try {
      const [appMod, analyticsMod, dbMod] = await Promise.all([
        import(`https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/firebase-app.js`),
        import(`https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/firebase-analytics.js`),
        import(`https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/firebase-database.js`)
      ]);

      const app = appMod.getApps().length ? appMod.getApp() : appMod.initializeApp(firebaseConfig);
      try {
        if (await analyticsMod.isSupported()) analyticsMod.getAnalytics(app);
      } catch (error) {}

      const db = dbMod.getDatabase(app);
      const messagesRef = dbMod.ref(db, "fanMessages");

      // Read the collection directly instead of orderByChild/limitToLast.
      // This avoids Firebase rule/index combinations that can stop the preview listener.
      dbMod.onValue(messagesRef, snapshot => {
        const items = [];
        snapshot.forEach(child => {
          const value = child.val() || {};
          items.push({id: child.key, ...value});
        });
        setLatestItems(items);
      }, error => {
        console.warn("Fans messages read failed:", error);
        if (!latestFanItems.length) {
          const list = document.getElementById("fans-list");
          if (list) list.innerHTML = '<div class="fans-empty">Messages cannot be loaded right now.</div>';
        }
      });

      form.addEventListener("submit", async event => {
        event.preventDefault();
        const nameInput = document.getElementById("fan-name");
        const messageInput = document.getElementById("fan-message");
        const name = (nameInput?.value || "").trim();
        const message = (messageInput?.value || "").trim();
        if (!name || !message) {
          status.textContent = "Please add your name and a message.";
          return;
        }

        const lastPost = Number(localStorage.getItem("bluiaLastFanPost") || 0);
        if (Date.now() - lastPost < 15000) {
          status.textContent = "Please wait a few seconds before posting again.";
          return;
        }

        submit.disabled = true;
        submit.textContent = "Posting…";
        status.textContent = "Posting message…";

        try {
          const createdAt = Date.now();
          const photoForPost = selectedPhotoUrl;
          const newMessageRef = dbMod.push(messagesRef);
          const newItem = {
            id: newMessageRef.key,
            name: name.slice(0,40),
            message: message.slice(0,300),
            imageUrl: photoForPost,
            photoUrl: photoForPost,
            createdAt
          };

          await dbMod.set(newMessageRef, {
            name: newItem.name,
            message: newItem.message,
            imageUrl: photoForPost,
            photoUrl: photoForPost,
            createdAt
          });

          // Show the new card immediately. The realtime listener will then reconcile it.
          setLatestItems([newItem, ...latestFanItems.filter(item => item.id !== newItem.id)]);
          localStorage.setItem("bluiaLastFanPost", String(Date.now()));
          form.reset();
          clearGalleryPhoto();
          status.textContent = "Love message posted 💗";
        } catch (error) {
          console.warn("Fans message post failed:", error);
          status.textContent = "Could not post. Please try again.";
        } finally {
          submit.disabled = false;
          submit.textContent = "Post Love Message";
        }
      });
    } catch (error) {
      console.warn("Firebase Fans setup failed:", error);
      if (status) status.textContent = "Fan messages are temporarily unavailable.";
      const list = document.getElementById("fans-list");
      if (list) list.innerHTML = '<div class="fans-empty">Fan messages are temporarily unavailable.</div>';
    }
  }

  function start(){
    addStyles();
    buildFansUI();
    initFirebaseFans();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, {once:true});
  } else {
    start();
  }
})();
