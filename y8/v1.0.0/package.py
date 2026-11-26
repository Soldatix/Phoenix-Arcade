#!/usr/bin/env python3
"""Create only the Y8 upload ZIP, not a release approval."""
from pathlib import Path
import zipfile, re, hashlib
root=Path(__file__).resolve().parent
files=["index.html","ag-language-menu.js","y8-ads.js","icons/phoenix-192.png"]
html=(root/"index.html").read_text(encoding="utf-8")
assert re.findall(r'https?://[^"\'\s<>]+',html)==["https://cdn.y8.com/minimal-sdk/2-0/y8.min.js"]
assert not re.search(r'<a\s|adsterra|paypal|stripe|pwa-install\.js|manifest\.webmanifest',html,re.I)
out=root.parent.parent/"Phoenix_Arcade_Y8_v1.0.0.zip"
with zipfile.ZipFile(out,"w",zipfile.ZIP_DEFLATED) as z:
    for name in files: z.write(root/name,name)
with zipfile.ZipFile(out) as z:
    assert z.testzip() is None and set(z.namelist())==set(files)
print(out)
print("SHA256",hashlib.sha256(out.read_bytes()).hexdigest())
print("Package checks PASS; browser, SDK and media QA are still required.")
