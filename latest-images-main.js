(()=>{
  "use strict";

  const $=(selector,root=document)=>root.querySelector(selector);

  function addStyles(){
    if($("#bluia-latest-images-style")) return;
    const style=document.createElement("style");
    style.id="bluia-latest-images-style";
    style.textContent=`
      .bluia-latest-images{width:min(100%,440px);margin:26px auto 0;padding:18px 14px 0;border-top:1px solid #251c21;text-align:left;background:#000}
      .bluia-latest-images-head{display:flex;align-items:end;justify-content:space-between;gap:10px;margin-bottom:10px}
      .bluia-latest-images-head h2{margin:0;color:#fff;font-size:15px;line-height:1.2}
      .bluia-latest-images-head span{color:#8f7e86;font-size:8px}
      .bluia-latest-images-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
      .bluia-latest-image-card{overflow:hidden;border:1px solid #2f2329;border-radius:13px;background:#0d0d0d;box-shadow:0 8px 24px rgba(0,0,0,.22)}
      .bluia-latest-image-card img{display:block;width:100%;aspect-ratio:4/5;object-fit:cover;object-position:top center;background:#111}
      @media(max-width:360px){.bluia-latest-images-grid{gap:6px}.bluia-latest-image-card{border-radius:10px}}
    `;
    document.head.appendChild(style);
  }

  async function build(){
    if($("#bluia-latest-images")) return;
    addStyles();
    try{
      const response=await fetch(`/req/?latest-images=${Date.now()}`,{cache:"no-store"});
      if(!response.ok) return;
      const html=await response.text();
      const doc=new DOMParser().parseFromString(html,"text/html");
      const images=[...doc.querySelectorAll(".latest-card img")].slice(0,3);
      if(!images.length) return;

      const section=document.createElement("section");
      section.className="bluia-latest-images";
      section.id="bluia-latest-images";
      section.setAttribute("aria-label","Latest images");
      section.innerHTML=`
        <div class="bluia-latest-images-head">
          <h2>Latest Images</h2>
          <span>Latest 3</span>
        </div>
        <div class="bluia-latest-images-grid"></div>`;

      const grid=section.querySelector(".bluia-latest-images-grid");
      images.forEach(source=>{
        const card=document.createElement("div");
        card.className="bluia-latest-image-card";
        const img=document.createElement("img");
        img.src=source.getAttribute("src")||"";
        img.alt=source.getAttribute("alt")||"Latest Bluia Sisters image";
        img.loading="lazy";
        img.decoding="async";
        card.appendChild(img);
        grid.appendChild(card);
      });

      const footer=$(".site-footer");
      if(footer) footer.insertAdjacentElement("beforebegin",section);
      else document.querySelector("main")?.appendChild(section);
    }catch(error){
      console.error("Latest images section error",error);
    }
  }

  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",build,{once:true});
  else build();
})();