from pathlib import Path

p = Path('index.html')
s = p.read_text()

old_css = '''    .feed-startup{height:110px;display:flex;align-items:center;justify-content:center;gap:6px;background:#000;transition:opacity .28s ease,height .28s ease;overflow:hidden}.feed-startup.done{opacity:0;height:0;pointer-events:none}.feed-startup span{width:7px;height:7px;border-radius:50%;background:#fff;box-shadow:0 0 12px rgba(255,111,168,.95);animation:startupPulse .9s ease-in-out infinite}.feed-startup span:nth-child(2){animation-delay:.12s}.feed-startup span:nth-child(3){animation-delay:.24s}@keyframes startupPulse{0%,70%,100%{transform:translateY(0) scale(.72);opacity:.3}35%{transform:translateY(-5px) scale(1);opacity:1}}'''
new_css = '''    .feed-startup{height:168px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;background:radial-gradient(circle at 50% 45%,rgba(242,92,154,.10),transparent 42%),#000;transition:opacity .65s ease,height .65s cubic-bezier(.2,.7,.2,1);overflow:hidden}.feed-startup.done{opacity:0;height:0;pointer-events:none}.feed-startup-title{color:#ffe7f1;font:800 13px/1 Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif;letter-spacing:.7px;text-transform:none;text-shadow:0 0 18px rgba(242,92,154,.42)}.feed-startup-bar{width:min(62vw,240px);height:4px;border-radius:999px;overflow:hidden;background:#241019;box-shadow:inset 0 0 0 1px rgba(255,255,255,.04)}.feed-startup-progress{display:block;width:42%;height:100%;border-radius:inherit;background:linear-gradient(90deg,#b82d69,#ff79ad,#ffd3e4);box-shadow:0 0 14px rgba(255,89,154,.72);animation:startupBar 1.15s cubic-bezier(.4,0,.2,1) infinite}@keyframes startupBar{0%{transform:translateX(-115%)}60%,100%{transform:translateX(250%)}}.feed-item{opacity:0;transform:translateY(18px) scale(.995);filter:blur(2px);transition:opacity .72s cubic-bezier(.22,.61,.36,1),transform .72s cubic-bezier(.22,.61,.36,1),filter .72s ease}.feed-item.feed-visible{opacity:1;transform:translateY(0) scale(1);filter:blur(0)}'''
if old_css not in s:
    raise SystemExit('startup CSS block not found')
s = s.replace(old_css, new_css, 1)

old_html = '''<div class="feed-startup" id="feed-startup" aria-label="Loading Bluia Updates"><span></span><span></span><span></span></div>'''
new_html = '''<div class="feed-startup" id="feed-startup" aria-label="Loading Bluia Sisters"><div class="feed-startup-title">Loading Bluia Sisters</div><div class="feed-startup-bar" aria-hidden="true"><span class="feed-startup-progress"></span></div></div>'''
if old_html not in s:
    raise SystemExit('startup HTML block not found')
s = s.replace(old_html, new_html, 1)

old_js = '''    function appendBatch(count=4){if(loading||cursor>=queue.length)return;loading=true;const frag=document.createDocumentFragment();for(let n=0;n<count&&cursor<queue.length;n++){const item=queue[cursor++];frag.appendChild(buildMedia(item))}feed.appendChild(frag);loading=false;if(cursor>=queue.length&&feedObserver)feedObserver.unobserve(loader)}function finishStartup(){if(!startup||startup.classList.contains('done'))return;startup.classList.add('done');setTimeout(()=>startup.remove(),320)}appendBatch(4);const firstMedia=feed.querySelector('.feed-media');'''
new_js = '''    function revealItems(items,delay=40){items.forEach((el,i)=>setTimeout(()=>el.classList.add('feed-visible'),delay+i*95))}\n    function appendBatch(count=4){if(loading||cursor>=queue.length)return;loading=true;const frag=document.createDocumentFragment(),added=[];const initial=cursor===0;for(let n=0;n<count&&cursor<queue.length;n++){const item=queue[cursor++],el=buildMedia(item);added.push(el);frag.appendChild(el)}feed.appendChild(frag);if(!initial)requestAnimationFrame(()=>revealItems(added,30));loading=false;if(cursor>=queue.length&&feedObserver)feedObserver.unobserve(loader)}function finishStartup(){if(!startup||startup.classList.contains('done'))return;startup.classList.add('done');const first=[...feed.querySelectorAll('.feed-item')].slice(0,4);setTimeout(()=>revealItems(first,40),180);setTimeout(()=>startup.remove(),700)}appendBatch(4);const firstMedia=feed.querySelector('.feed-media');'''
if old_js not in s:
    raise SystemExit('feed JS block not found')
s = s.replace(old_js, new_js, 1)

# Respect reduced-motion users without removing the feature for others.
needle = '''@media(prefers-reduced-motion:reduce){'''
if needle in s and '.feed-item{transition:none!important' not in s:
    s = s.replace(needle, needle + '.feed-item{transition:none!important;transform:none!important;filter:none!important}.feed-startup-progress{animation:none!important;transform:none!important;width:100%!important}', 1)

p.write_text(s)
