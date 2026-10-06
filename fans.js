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
  const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

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
      .fans-field{width:100%;margin:0 0 8px;padding:11px 12px;border:1px solid #563141;border-radius:11px;background:#120b0f;color:#fff;font-size:11px;outline:none}
      textarea.fans-field{min-height:92px;resize:vertical;line-height:1.45}
      .fans-field:focus{border-color:#ff6aa8;box-shadow:0 0 0 2px rgba(255,106,168,.12)}
      .fans-photo-row{display:flex;align-items:center;gap:8px;margin:2px 0 10px}
      .fans-photo-label{display:inline-flex;align-items:center;justify-content:center;min-height:36px;padding:0 11px;border:1px solid #633346;border-radius:10px;background:#1a0d13;color:#ff91bc;font-size:9.5px;font-weight:800;cursor:pointer}
      #fan-photo{position:absolute;left:-9999px;width:1px;height:1px;opacity:0}
      #fan-photo-name{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#bca8b0;font-size:9px}
      .fans-post-button{width:100%;min-height:44px;border:0;border-radius:11px;background:linear-gradient(135deg,#ff6aa8,#db397b);color:#fff;font-size:11px;font-weight:900;cursor:pointer;box-shadow:0 8px 22px rgba(223,55,121,.25)}
      .fans-post-button:disabled{opacity:.55;cursor:default}
      .fans-status{min-height:18px;margin:7px 2px 0;color:#d6c5cc;font-size:9px;line-height:1.35;text-align:center}
      .fans-latest-title{margin:18px 2px 9px;color:#fff;font-size:12px;font-weight:900}
      .fans-list{display:grid;gap:9px}
      .fan-card{overflow:hidden;border:1px solid rgba(255,255,255,.24);border-radius:15px;background:#fff;color:#241019;box-shadow:0 10px 26px rgba(98,8,44,.18)}
      .fan-card-body{padding:12px}
      .fan-card-top{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:6px}
      .fan-card-name{color:#d53678;font-size:11px;font-weight:900}
      .fan-card-time{color:#a68d98;font-size:8px;white-space:nowrap}
      .fan-card-message{margin:0;color:#3a2530;font-size:10.5px;line-height:1.5;white-space:pre-wrap;overflow-wrap:anywhere}
      .fan-card-image{display:block;width:100%;max-height:360px;object-fit:cover;background:#ead5df}
      .fans-empty{padding:14px;border:1px dashed rgba(255,255,255,.45);border-radius:13px;color:#ffeaf2;font-size:10px;text-align:center}
      @media(max-width:370px){.media-tab{padding:0 7px !important;font-size:9px !important}.media-tabs{gap:4px !important}}
    `;
    document.head.appendChild(style);
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
          <p>Leave a love message for Bluia Sisters and share an optional photo.</p>
        </div>

        <form class="fans-compose" id="fans-form">
          <h3>Post a love message</h3>
          <input class="fans-field" id="fan-name" type="text" maxlength="40" autocomplete="name" placeholder="Your name" required>
          <textarea class="fans-field" id="fan-message" maxlength="300" placeholder="Write your love message..." required></textarea>
          <div class="fans-photo-row">
            <label class="fans-photo-label" for="fan-photo">Attach photo</label>
            <input id="fan-photo" type="file" accept="image/*">
            <span id="fan-photo-name">Optional · JPG/PNG/WebP · max 5 MB</span>
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

    const openFans = () => {
      document.querySelectorAll(".media-tab").forEach(tab => tab.classList.toggle("active", tab === fansTab));
      document.querySelectorAll(".media-panel").forEach(item => item.classList.toggle("active", item === panel));
      const tv = document.getElementById("tv-video");
      const reel = document.getElementById("reel-video");
      if (tv) tv.pause();
      if (reel) reel.pause();
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

      if (item.imageUrl) {
        const image = document.createElement("img");
        image.className = "fan-card-image";
        image.src = item.imageUrl;
        image.alt = `Photo shared by ${item.name || "a fan"}`;
        image.loading = "lazy";
        card.appendChild(image);
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

  async function initFirebaseFans(){
    const status = document.getElementById("fans-status");
    const form = document.getElementById("fans-form");
    const submit = document.getElementById("fans-submit");
    const photo = document.getElementById("fan-photo");
    const photoName = document.getElementById("fan-photo-name");
    if (!form || !submit || !photo) return;

    try {
      const [appMod, analyticsMod, dbMod, storageMod] = await Promise.all([
        import(`https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/firebase-app.js`),
        import(`https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/firebase-analytics.js`),
        import(`https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/firebase-database.js`),
        import(`https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/firebase-storage.js`)
      ]);

      const app = appMod.getApps().length ? appMod.getApp() : appMod.initializeApp(firebaseConfig);

      try {
        if (await analyticsMod.isSupported()) analyticsMod.getAnalytics(app);
      } catch (error) {}

      const db = dbMod.getDatabase(app);
      const storage = storageMod.getStorage(app);
      const messagesRef = dbMod.ref(db, "fanMessages");
      const latestQuery = dbMod.query(messagesRef, dbMod.orderByChild("createdAt"), dbMod.limitToLast(5));

      dbMod.onValue(latestQuery, snapshot => {
        const items = [];
        snapshot.forEach(child => items.push({id: child.key, ...child.val()}));
        items.sort((a,b) => (Number(b.createdAt) || 0) - (Number(a.createdAt) || 0));
        renderMessages(items.slice(0,5));
      }, error => {
        const list = document.getElementById("fans-list");
        if (list) list.innerHTML = '<div class="fans-empty">Messages cannot be loaded right now.</div>';
        console.warn("Fans messages read failed:", error);
      });

      photo.addEventListener("change", () => {
        const file = photo.files && photo.files[0];
        photoName.textContent = file ? file.name : "Optional · JPG/PNG/WebP · max 5 MB";
      });

      form.addEventListener("submit", async event => {
        event.preventDefault();

        const nameInput = document.getElementById("fan-name");
        const messageInput = document.getElementById("fan-message");
        const name = (nameInput?.value || "").trim();
        const message = (messageInput?.value || "").trim();
        const file = photo.files && photo.files[0];

        if (!name || !message) {
          status.textContent = "Please add your name and a message.";
          return;
        }

        if (file && !file.type.startsWith("image/")) {
          status.textContent = "Please choose an image file.";
          return;
        }

        if (file && file.size > MAX_IMAGE_BYTES) {
          status.textContent = "Photo must be 5 MB or smaller.";
          return;
        }

        const lastPost = Number(localStorage.getItem("bluiaLastFanPost") || 0);
        if (Date.now() - lastPost < 15000) {
          status.textContent = "Please wait a few seconds before posting again.";
          return;
        }

        submit.disabled = true;
        submit.textContent = "Posting…";
        status.textContent = "";

        try {
          let imageUrl = "";

          if (file) {
            status.textContent = "Uploading photo…";
            const cleanName = file.name.replace(/[^a-zA-Z0-9._-]+/g, "-").slice(-80) || "photo";
            const imageRef = storageMod.ref(storage, `fan-photos/${Date.now()}-${Math.random().toString(36).slice(2,8)}-${cleanName}`);
            await storageMod.uploadBytes(imageRef, file, {contentType: file.type});
            imageUrl = await storageMod.getDownloadURL(imageRef);
          }

          status.textContent = "Posting message…";
          const newMessageRef = dbMod.push(messagesRef);
          await dbMod.set(newMessageRef, {
            name: name.slice(0,40),
            message: message.slice(0,300),
            imageUrl,
            createdAt: Date.now()
          });

          localStorage.setItem("bluiaLastFanPost", String(Date.now()));
          form.reset();
          photoName.textContent = "Optional · JPG/PNG/WebP · max 5 MB";
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
