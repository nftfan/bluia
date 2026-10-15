(()=>{
  "use strict";

  const IMAGE_URL="https://huggingface.co/buckets/Bluia/bimg/resolve/469AF640-2901-4D77-9B1B-1BD1E2B9A65C.png?download=true";

  function build(){
    const card=document.querySelector("#panel-members .members-card");
    if(!card || document.getElementById("bluia-members-hero")) return;

    if(!document.getElementById("bluia-members-hero-style")){
      const style=document.createElement("style");
      style.id="bluia-members-hero-style";
      style.textContent=`
        #panel-members .members-card{overflow:hidden;padding-top:0}
        .bluia-members-hero{display:block;width:calc(100% + 32px);height:auto;margin:0 -16px 16px;max-height:300px;object-fit:cover;object-position:center top;background:#111}
      `;
      document.head.appendChild(style);
    }

    const img=document.createElement("img");
    img.id="bluia-members-hero";
    img.className="bluia-members-hero";
    img.src=IMAGE_URL;
    img.alt="Bluia Sisters Members";
    img.loading="eager";
    img.decoding="async";
    card.prepend(img);
  }

  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",build,{once:true});
  else build();
})();
