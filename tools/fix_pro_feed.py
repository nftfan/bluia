from pathlib import Path

p = Path('pro/index.html')
s = p.read_text()
start = s.find("function makeItem(item)")
end_marker = "feed.querySelectorAll('video.feed-media').forEach(v=>videoObserver.observe(v));"
end = s.find(end_marker, start)
if start < 0 or end < 0:
    raise SystemExit('Pro feed block not found')
end += len(end_marker)

replacement = r'''function ensureVideoSrc(v){if(!v.getAttribute('src')&&v.dataset.src){v.src=v.dataset.src;v.load()}}
const lazyVideoObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){ensureVideoSrc(entry.target);lazyVideoObserver.unobserve(entry.target)}}),{rootMargin:'500px 0px'});
const videoObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{const v=entry.target;if(entry.isIntersecting&&entry.intersectionRatio>=.28){ensureVideoSrc(v);document.querySelectorAll('video.feed-media').forEach(x=>{if(x!==v)x.pause()});const attempt=v.play();if(attempt&&attempt.catch)attempt.catch(()=>{})}else v.pause()}),{threshold:[0,.15,.28,.5]});
function makeItem(item){const wrap=document.createElement('div');wrap.className='feed-item';const bar=document.createElement('div');bar.className='feed-brand';bar.textContent='Bluia Sisters Pro';wrap.appendChild(bar);if(item.type==='photo'){const img=document.createElement('img');img.className='feed-media photo';img.src=item.src;img.alt='Bluia Sisters Pro';img.loading='lazy';img.decoding='async';wrap.appendChild(img)}else{const v=document.createElement('video');v.className=`feed-media ${item.type}`;v.dataset.src=item.src;v.muted=true;v.defaultMuted=true;v.autoplay=true;v.loop=true;v.playsInline=true;v.preload='none';v.setAttribute('muted','');v.setAttribute('playsinline','');v.setAttribute('webkit-playsinline','');const load=document.createElement('div');load.className='video-loader show';load.innerHTML='<span></span><span></span><span></span>';wrap.appendChild(v);wrap.appendChild(load);['canplay','playing'].forEach(e=>v.addEventListener(e,()=>load.classList.remove('show')));['loadstart','waiting','stalled'].forEach(e=>v.addEventListener(e,()=>load.classList.add('show')));v.addEventListener('error',()=>load.classList.remove('show'));const controls=document.createElement('div');controls.className='video-controls';const mute=document.createElement('button');mute.className='mini-control';mute.type='button';mute.innerHTML=iconMute;mute.onclick=e=>{e.stopPropagation();ensureVideoSrc(v);v.muted=!v.muted;mute.innerHTML=v.muted?iconMute:iconSound;if(v.paused)v.play().catch(()=>{})};const full=document.createElement('button');full.className='mini-control';full.type='button';full.innerHTML=iconFull;full.onclick=e=>{e.stopPropagation();ensureVideoSrc(v);(v.requestFullscreen||v.webkitEnterFullscreen)?.call(v)};controls.append(mute,full);wrap.appendChild(controls);v.addEventListener('click',()=>{ensureVideoSrc(v);if(v.paused)v.play().catch(()=>{})});lazyVideoObserver.observe(v);videoObserver.observe(v)}return wrap}
let feedObserver=null;function finishFeed(){if(feedEnd)feedEnd.classList.add('show');if(loader)loader.style.display='none';if(feedObserver&&loader)feedObserver.unobserve(loader)}function appendBatch(n=4){if(loading||cursor>=queue.length)return;loading=true;const frag=document.createDocumentFragment();const end=Math.min(cursor+n,queue.length);while(cursor<end)frag.appendChild(makeItem(queue[cursor++]));feed.appendChild(frag);loading=false;if(startup&&!startup.classList.contains('done'))requestAnimationFrame(()=>startup.classList.add('done'));if(cursor>=queue.length)finishFeed()}
appendBatch(4);feedObserver=new IntersectionObserver(es=>{if(es.some(e=>e.isIntersecting))appendBatch(4)},{rootMargin:'250px 0px'});if(cursor<queue.length)feedObserver.observe(loader);'''

s = s[:start] + replacement + s[end:]
p.write_text(s)
