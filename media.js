// Bluia Sisters media list
// Free version: 1 TV video, 1 Reel, 3 Photos.
// Pro page remains separate at /pro.

window.BluiaMedia = {
  // Free Preview — 16:9 TV
  tv: [
    "https://huggingface.co/buckets/veebluia/drama/resolve/grok-video-a4f971c6-547e-4f13-8642-a3dd06da3ee2.mp4?download=true"
  ],

  // Bluia Sisters used by Play
  models: [
    "https://huggingface.co/buckets/veebluia/bluiaimages/resolve/ChatGPT%20Image%20Oct%202%2C%202026%2C%2008_49_55%20AM.png?download=true",
    "https://huggingface.co/buckets/veebluia/bluiaimages/resolve/ChatGPT%20Image%20Oct%209%2C%202026%2C%2001_13_56%20PM.png?download=true",
    "https://huggingface.co/buckets/veebluia/bluiaimages/resolve/ChatGPT%20Image%20Oct%209%2C%202026%2C%2001_13_33%20PM.png?download=true",
    "https://huggingface.co/buckets/veebluia/bluiaimages/resolve/ChatGPT%20Image%20Oct%209%2C%202026%2C%2001_13_22%20PM.png?download=true",
    "https://huggingface.co/buckets/veebluia/bluiaimages/resolve/ChatGPT%20Image%20Oct%209%2C%202026%2C%2001_13_11%20PM.png?download=true",
    "https://huggingface.co/buckets/veebluia/bluiaimages/resolve/ChatGPT%20Image%20Oct%202%2C%202026%2C%2008_50_09%20AM.png?download=true",
    "https://huggingface.co/buckets/veebluia/bluiaimages/resolve/ChatGPT%20Image%20Oct%202%2C%202026%2C%2008_50_19%20AM.png?download=true",
    "https://huggingface.co/buckets/veebluia/bluiaimages/resolve/ChatGPT%20Image%20Oct%202%2C%202026%2C%2008_50_36%20AM.png?download=true",
    "https://huggingface.co/buckets/veebluia/bluiaimages/resolve/ChatGPT%20Image%20Oct%204%2C%202026%2C%2010_11_06%20AM.png?download=true",
    "https://huggingface.co/buckets/veebluia/bluiaimages/resolve/ChatGPT%20Image%20Oct%204%2C%202026%2C%2010_10_51%20AM.png?download=true",
    "https://huggingface.co/buckets/veebluia/bluiaimages/resolve/ChatGPT%20Image%20Oct%204%2C%202026%2C%2010_10_31%20AM.png?download=true",
    "https://huggingface.co/buckets/veebluia/bluiaimages/resolve/ChatGPT%20Image%20Oct%204%2C%202026%2C%2010_10_25%20AM.png?download=true",
    "https://huggingface.co/buckets/veebluia/bluiaimages/resolve/ChatGPT%20Image%20Oct%204%2C%202026%2C%2010_10_11%20AM.png?download=true"
  ],

  // Free Preview — 9:16 Reel
  reels: [
    "https://huggingface.co/buckets/veebluia/drama/resolve/grok-video-66e1277e-ffcc-47eb-b056-82e1d33f48ed.mp4?download=true"
  ],

  // Free Preview — 3 photos
  gallery: [
    "https://huggingface.co/buckets/veebluia/bluiaimages/resolve/ChatGPT%20Image%20Oct%205%2C%202026%2C%2011_08_28%20AM.png?download=true",
    "https://huggingface.co/buckets/veebluia/bluiaimages/resolve/ChatGPT%20Image%20Oct%205%2C%202026%2C%2011_08_08%20AM.png?download=true",
    "https://huggingface.co/buckets/veebluia/bluiaimages/resolve/ChatGPT%20Image%20Oct%204%2C%202026%2C%2010_01_28%20AM.png?download=true"
  ]
};

// Photos gallery in top menu
(() => {
  const applyPhotosUI = () => {
    const photos = Array.isArray(window.BluiaMedia?.gallery) ? window.BluiaMedia.gallery : [];
    const topPhotosTab = document.querySelector('.media-tab[data-panel="photos"]');
    if (topPhotosTab) topPhotosTab.textContent = "Photos";

    const topPhotosPanel = document.getElementById("panel-photos");
    if (topPhotosPanel) {
      topPhotosPanel.innerHTML = `
        <div class="photos-member-note">
          <strong>Free Preview</strong> · 3 photos
          <a href="#" id="photos-member-cta">Unlock all content</a>
        </div>
        <div class="photos-gallery-grid" id="photos-gallery-grid"></div>`;
    }

    const grid = document.getElementById("photos-gallery-grid");
    if (grid) {
      const fragment = document.createDocumentFragment();
      photos.forEach((url,index) => {
        const img = document.createElement("img");
        img.src = url;
        img.alt = `Bluia Sisters free preview photo ${index+1}`;
        img.loading = "lazy";
        img.decoding = "async";
        fragment.appendChild(img);
      });
      grid.replaceChildren(fragment);
    }

    document.getElementById("photos-member-cta")?.addEventListener("click",event => {
      event.preventDefault();
      document.getElementById("buy-button")?.click();
    });

    const lowerTab = document.querySelector('.sub-tab[data-subpanel="chat"]') ||
                     document.querySelector('.sub-tab[data-subpanel="albums"]') ||
                     document.querySelector('.sub-tab[data-subpanel="photos-grid"]');
    lowerTab?.remove();

    const lowerPanel = document.getElementById("subpanel-chat") ||
                       document.getElementById("subpanel-albums") ||
                       document.getElementById("subpanel-photos-grid");
    lowerPanel?.remove();

    if (!document.getElementById("bluia-photos-gallery-style")) {
      const style = document.createElement("style");
      style.id = "bluia-photos-gallery-style";
      style.textContent = `
        .photos-member-note{width:min(100%,440px);margin:0 auto;padding:13px 14px 10px;color:#c9bbc2;font-size:10px;line-height:1.5;text-align:center}
        .photos-member-note strong{color:#fff}
        .photos-member-note a{margin-left:5px;color:#ff6fa8;font-weight:900;text-decoration:none;white-space:nowrap}
        .photos-member-note a:hover,.photos-member-note a:focus{text-decoration:underline}
        .photos-gallery-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px;width:min(100%,440px);margin:0 auto;padding:0 14px 16px}
        .photos-gallery-grid img{display:block;width:100%;aspect-ratio:2/3;object-fit:cover;object-position:top center;border:0;border-radius:12px;background:#111;content-visibility:auto;contain-intrinsic-size:300px 450px}
      `;
      document.head.appendChild(style);
    }
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", applyPhotosUI, {once:true});
  else applyPhotosUI();
})();

// Telegram channels
(() => {
  if (document.querySelector('script[data-bluia-telegram-main]')) return;
  const script = document.createElement("script");
  script.src = "/telegram-main.js?v=20261016-polish-1";
  script.defer = true;
  script.dataset.bluiaTelegramMain = "1";
  document.head.appendChild(script);
})();

// Play experience
(() => {
  if (document.querySelector('script[data-bluia-chat-home]')) return;
  const script = document.createElement("script");
  script.src = "/chat-home.js?v=20261014-marry-1";
  script.defer = true;
  script.dataset.bluiaChatHome = "1";
  document.head.appendChild(script);
})();

// Member contact request popup
(() => {
  if (document.querySelector('script[data-bluia-private-chat]')) return;
  const script = document.createElement("script");
  script.src = "/private-chat.js?v=20261015-member-validation-2";
  script.defer = true;
  script.dataset.bluiaPrivateChat = "1";
  document.head.appendChild(script);
})();

// Bluia Sisters Lifestyle PDF book card under Telegram groups
(() => {
  if (document.querySelector('script[data-bluia-book-card]')) return;
  const script = document.createElement("script");
  script.src = "/book-card.js?v=20261010-1";
  script.defer = true;
  script.dataset.bluiaBookCard = "1";
  document.head.appendChild(script);
})();

// Members tab hero image
(() => {
  if (document.querySelector('script[data-bluia-members-hero]')) return;
  const script = document.createElement("script");
  script.src = "/members-hero.js?v=20261015-1";
  script.defer = true;
  script.dataset.bluiaMembersHero = "1";
  document.head.appendChild(script);
})();
