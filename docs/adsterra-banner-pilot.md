# Phoenix Arcade — Adsterra banner pilot (review only)

## Approval and codes
- Publisher domain: phoenix-arcade.appsandgames.org
- Adsterra website ID: 6185853 — Approved, as shown in the publisher portal
- Desktop GET CODE key: `82f2ec7d4d36d4b13fc13d46af67d79d` (728 × 90)
- Mobile GET CODE key: `82977f105f694f9d1f6f9a73fd17e623` (320 × 50)
- Both original snippets are stored unchanged in `phoenix-adsterra-loader.js`.
- This branch MUST NOT be merged before the root Apps & Games shared-consent deployment is confirmed.

## Consent dependency
This game imports the five-language consent JS and CSS from the approved Apps & Games portal.
Its loader checks a **first-party shared cookie** (`ag_privacy_choices_v1`) scoped to `appsandgames.org`.
The cookie contains analytics/advertising booleans, choice timestamp, schema version and provider revision.
A positive `advertising` choice is required before even calling the Adsterra script.
Unknown version, missing/expired choice, changed partner revision, wrong hostname and denied consent fail closed.
The root consent script is the single source of the consent UI; this does not create another advertising network popup.
On first arrival to the game without a stored choice, the same unified privacy dialog can appear.
The new footer preference control is accessible from the game menu and the Information modal.

## Visibility and gameplay
- Exactly one unit: 728 × 90 when viewport >=1024 px wide **and** >=800 px tall; otherwise 320 × 50 for width >=320 px.
- Banner is located AFTER Play/Resume and other start menu controls.
- An active game hides the menu overlay and all ad slots. No overlay of canvas or touch controls.
- No auto-refresh, no artificial impressions, no extra iframe wrapper.
- Fullscreen, sound, movement, firing, saved progress and game engine remain unchanged.

## Release and verification gates
1. Root website PR: deploy shared consent cookie and privacy policy; check a choice is stored without unwanted network requests.
2. This Phoenix PR: only after explicit separate production approval.
3. Confirm one menu banner after consent on a normal browser session; after start, game controls must not be obstructed.
4. Confirm no Adsterra requests if consent is rejected or withdrawn.
5. Check in the Publisher Portal whether impressions are attributed to Phoenix's own placements and whether any revenue is recognized; one visual impression is not proof of earnings.
6. Adsterra has not specifically confirmed the original-code parser-time `document.write()` loading method; their instructions require GET CODE to remain unchanged.

## Risk / scope
- Root privacy script/CSS are network dependencies; when unavailable, no newly approved banner requests should occur.
- The standalone PWA game remains usable without ads, including offline gameplay.
- This PR changes no other app/game and does not alter Cloudflare settings.
