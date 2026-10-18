from pathlib import Path

p=Path('index.html')
s=p.read_text()

s=s.replace('grid-template-columns:repeat(3,minmax(0,1fr))','grid-template-columns:repeat(4,minmax(0,1fr))',1)

css_anchor='    .nav-btn[data-panel="members"].active{background:linear-gradient(135deg,#ffe58b,#c9952c);border-color:#f6d96d;color:#140e02;box-shadow:0 6px 24px rgba(233,194,71,.38)}\n'
css_add='''    .nav-btn[data-panel="moms"]{position:relative;border:2px solid #ff74b1;background:#12060d;color:#ffd9ea;box-shadow:0 0 8px rgba(255,73,149,.65),inset 0 0 8px rgba(255,73,149,.12);animation:momsGlow 1.8s ease-in-out infinite}.nav-btn[data-panel="moms"].active{background:linear-gradient(135deg,#ff79b4,#b92f70);color:#fff;border-color:#ffc3dd;box-shadow:0 0 16px rgba(255,73,149,.9),0 7px 22px rgba(226,59,132,.28)}@keyframes momsGlow{0%,100%{box-shadow:0 0 6px rgba(255,73,149,.5),inset 0 0 6px rgba(255,73,149,.1)}50%{box-shadow:0 0 17px rgba(255,99,169,.95),0 0 28px rgba(255,73,149,.28),inset 0 0 10px rgba(255,120,179,.16)}}\n'''
if css_anchor not in s: raise SystemExit('nav css anchor missing')
s=s.replace(css_anchor,css_anchor+css_add,1)

style_anchor='    .feed-membership-float{position:fixed;'
moms_css='''    .moms-wrap{width:min(100%,560px);margin:0 auto;padding:0 14px 36px}.moms-cover{display:block;width:calc(100% + 28px);margin:0 -14px 16px;height:auto;max-height:72vh;object-fit:cover;background:#12080d}.moms-card{padding:20px 16px;border:1px solid #5f2441;border-radius:20px;background:radial-gradient(circle at 90% 0,rgba(255,91,157,.17),transparent 34%),linear-gradient(180deg,#150a10,#090909);box-shadow:0 18px 45px rgba(0,0,0,.34)}.moms-kicker{color:#ff89b9;font-size:8px;font-weight:900;letter-spacing:1px;text-transform:uppercase}.moms-card h2{margin:6px 0 8px;color:#ffe1ee;font:700 27px/1.05 Georgia,"Times New Roman",serif}.moms-card p{margin:0 0 14px;color:#cdb3bf;font-size:10px;line-height:1.6}.moms-benefits{display:grid;gap:8px;margin:0 0 16px}.moms-benefit{padding:11px 12px;border:1px solid #39202d;border-radius:13px;background:#10090c;color:#f0d7e1;font-size:10px;line-height:1.35}.moms-buy{width:100%;min-height:50px;border:0;border-radius:13px;background:linear-gradient(135deg,#ff7db7,#c83f7a);color:#fff;font-size:11px;font-weight:950;cursor:pointer;box-shadow:0 12px 28px rgba(204,50,118,.22)}.moms-telegram{margin-top:10px;min-height:52px;display:flex;align-items:center;justify-content:center;border-radius:13px;text-decoration:none;border:1px solid #ff7fb7;background:linear-gradient(135deg,#3f1028,#170910);color:#ffd7e8;font-size:10px;font-weight:900;box-shadow:0 10px 24px rgba(0,0,0,.26)}.moms-payment-modal{position:fixed;inset:0;z-index:5250;display:grid;place-items:center;padding:16px;background:rgba(0,0,0,.86);opacity:0;visibility:hidden;pointer-events:none;transition:.16s ease}.moms-payment-modal.open{opacity:1;visibility:visible;pointer-events:auto}.moms-payment-card{position:relative;width:min(92vw,360px);padding:22px 16px 16px;border-radius:20px;border:1px solid #7a2f52;background:radial-gradient(circle at 90% 0,rgba(255,91,157,.18),transparent 34%),linear-gradient(180deg,#180b12,#090909);box-shadow:0 22px 60px rgba(0,0,0,.5);text-align:center}.moms-payment-card h3{margin:0 32px 8px;font-size:18px;color:#ffd9e9}.moms-payment-card p{margin:0 0 14px;color:#d5bcc7;font-size:10px;line-height:1.6}.moms-payment-final{width:100%;min-height:48px;border:0;border-radius:13px;background:linear-gradient(135deg,#ff7db7,#c83f7a);color:#fff;font-size:11px;font-weight:950;cursor:pointer}.moms-payment-close{position:absolute;top:8px;right:8px;width:32px;height:32px;border:0;border-radius:50%;background:rgba(255,255,255,.08);color:#fff;font-size:18px;cursor:pointer}\n'''
if style_anchor not in s: raise SystemExit('style anchor missing')
s=s.replace(style_anchor,moms_css+style_anchor,1)

nav_old='''    <button class="nav-btn" data-panel="members" type="button">Members <span class="media-count">1500</span></button>\n  </nav>'''
nav_new='''    <button class="nav-btn" data-panel="members" type="button">Members <span class="media-count">1500</span></button>\n    <button class="nav-btn" data-panel="moms" type="button">Moms</button>\n  </nav>'''
if nav_old not in s: raise SystemExit('nav html anchor missing')
s=s.replace(nav_old,nav_new,1)

members_end='''    <section class="panel" id="panel-members"><div class="inner"><div class="member-card member-card-simple"><h2 class="member-title-small">Unlock Hundreds of Reels, TV Episodes, Photos & Play</h2>'''
if members_end not in s: raise SystemExit('members section start missing')
# Insert Moms section just before closing main, after existing members section.
main_close='''  </main>\n  <footer class="site-footer">'''
moms_section='''    <section class="panel" id="panel-moms"><div class="moms-wrap"><img class="moms-cover" loading="lazy" decoding="async" src="https://huggingface.co/buckets/veebluia/bluiaimages/resolve/Golden-Hour%20Countryside%20Group%20Portrait.png?download=true" alt="Bluia Moms countryside group portrait"><div class="moms-card"><div class="moms-kicker">Bluia Moms</div><h2>Bluia Moms Pro</h2><p>Unlock the private Bluia Moms collection and follow new moments as they are added.</p><div class="moms-benefits"><div class="moms-benefit">1. Explore stories</div><div class="moms-benefit">2. Bluia Moms Moments</div><div class="moms-benefit">3. Photos and Videos from Bluia Moms</div></div><button class="moms-buy" id="moms-buy" type="button">Unlock Bluia Moms Pro</button><a class="moms-telegram" href="https://t.me/mbluia" target="_blank" rel="noopener noreferrer">Bluia Moms Exclusive Telegram Channel</a></div></div></section>\n'''
if main_close not in s: raise SystemExit('main close missing')
s=s.replace(main_close,moms_section+main_close,1)

payment_anchor='''  <div class="payment-modal" id="payment-modal" aria-hidden="true"><div class="payment-card"><button class="payment-close" id="payment-close" type="button" aria-label="Close">×</button><h3>Unlock Unlimited Content</h3><p>Use an email address you can access at checkout. Your private viewing link will be sent to that email.</p><button class="payment-final" id="payment-final" type="button">Continue to Payment — $5/month</button></div></div>\n'''
moms_modal='''  <div class="moms-payment-modal" id="moms-payment-modal" aria-hidden="true"><div class="moms-payment-card"><button class="moms-payment-close" id="moms-payment-close" type="button" aria-label="Close">×</button><h3>Unlock Bluia Moms Pro</h3><p>Use an email address you can access at checkout. Your Bluia Moms Pro access will use that email.</p><button class="moms-payment-final" id="moms-payment-final" type="button">Continue to Bluia Moms Pro</button></div></div>\n'''
if payment_anchor not in s: raise SystemExit('payment anchor missing')
s=s.replace(payment_anchor,payment_anchor+moms_modal,1)

s=s.replace('const PAYMENT_URL="https://buy.stripe.com/4gMbITgUo0jc1yF3F5bAs04";','const PAYMENT_URL="https://buy.stripe.com/4gMbITgUo0jc1yF3F5bAs04",MOMS_PAYMENT_URL="https://buy.stripe.com/8x23cnbA49TM1yFgrRbAs06";',1)
s=s.replace("if(feedMembershipFloat)feedMembershipFloat.hidden=btn.dataset.panel==='members'","if(feedMembershipFloat)feedMembershipFloat.hidden=['members','moms'].includes(btn.dataset.panel)",1)

js_anchor="document.getElementById('payment-final').onclick=()=>{window.location.href=PAYMENT_URL};document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeMoment();closeChat();closePayment()}});"
js_new="document.getElementById('payment-final').onclick=()=>{window.location.href=PAYMENT_URL};const momsPaymentModal=document.getElementById('moms-payment-modal');function openMomsPayment(){momsPaymentModal.classList.add('open');momsPaymentModal.setAttribute('aria-hidden','false');document.documentElement.style.overflow='hidden'}function closeMomsPayment(){momsPaymentModal.classList.remove('open');momsPaymentModal.setAttribute('aria-hidden','true');document.documentElement.style.overflow=''}document.getElementById('moms-buy').onclick=openMomsPayment;document.getElementById('moms-payment-close').onclick=closeMomsPayment;momsPaymentModal.addEventListener('click',e=>{if(e.target===momsPaymentModal)closeMomsPayment()});document.getElementById('moms-payment-final').onclick=()=>{window.location.href=MOMS_PAYMENT_URL};document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeMoment();closeChat();closePayment();closeMomsPayment()}});"
if js_anchor not in s: raise SystemExit('payment js anchor missing')
s=s.replace(js_anchor,js_new,1)

p.write_text(s)
