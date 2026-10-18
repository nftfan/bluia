from pathlib import Path
p=Path('index.html')
s=p.read_text()
old='<button class="nav-btn" data-panel="members" type="button">Members <span class="media-count">1500</span></button>'
new='<button class="nav-btn" data-panel="members" type="button">Members</button>'
if old not in s:
    raise SystemExit('Members tab count markup not found')
s=s.replace(old,new,1)
p.write_text(s)
