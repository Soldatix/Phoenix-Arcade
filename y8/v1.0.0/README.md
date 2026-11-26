# Phoenix Arcade: Neon Edition — Y8 v1.0.0 (development candidate)

Source baseline: 34ab27fb7ae658594b3cc043211db7f41d1cfff3. The original root and main branch are not modified by this candidate. All files under this directory are isolated.

## Run
From this directory: `python -m http.server 8000`, then open http://localhost:8000. Local storage uses Y8-specific keys. SDK and ad availability depend on Y8 hosting; local failure must not prevent play. Do not test using file:// for SDK verification.

## Build
`python package.py` creates a game ZIP with index.html at its root. The ZIP contains no QA scripts, README, PWA, third-party ad scripts or donation links.

## QA gate
Before submission: actual browser tests (desktop Chromium/Firefox, Android Chrome, iOS Safari); focus loss, sound preference and pause, keyboard/touch, 4:3 and portrait/landscape, save/resume and all five languages. Test Y8 Draft preview with actual Y8 test ads: interstitial replay, capped/unavailable/rejected breaks, rewarded watched and dismissed, one reward per run including saved runs, blocked SDK and duplicate clicks. Check no third-party requests other than Y8 SDK and its services. Review rights and AI declaration. Capture real gameplay screenshots and video, then validate dimensions and sizes. No release or monetization claim until Y8 approval and reporting. No submission without owner approval.

## Status
Candidate source only. Static JavaScript parse and external URL checks performed at generation; runtime QA, package generation and media capture not performed yet.
