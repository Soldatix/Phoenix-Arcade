/* Phoenix Arcade — Adsterra banner for its own APPROVED publisher subdomain.
 * The publisher-provided GET CODE snippets are kept unchanged.
 * Requests are blocked unless an explicit, current shared advertising opt-in exists.
 * Parser-time document.write is used to preserve the original code structure;
 * this remains subject to provider technical confirmation.
 * One request per page: menu-only, not in gameplay, no reloads or auto-refresh.
 */
(() => {
  "use strict";
  if (location.hostname !== "phoenix-arcade.appsandgames.org") return;
  if (document.readyState !== "loading") return;
  if (!document.body?.classList.contains("menu-active")) return;
  const current = document.currentScript;
  const slot = current?.parentElement;
  if (!slot || !slot.classList.contains("phoenix-ad-unit")) return;
  const wide = matchMedia("(min-width: 1024px) and (min-height: 800px)").matches;
  const unit = current.dataset.unit;
  if (!matchMedia("(min-width: 320px)").matches) return;
  if (wide && unit !== "desktop" || !wide && unit !== "mobile") return;
  let allowed = false;
  try {
    const pair = document.cookie.split("; ").find(s => s.startsWith("ag_privacy_choices_v1="));
    const data = pair && JSON.parse(decodeURIComponent(pair.slice("ag_privacy_choices_v1=".length)));
    const age = data && Date.now() - data.timestamp;
    allowed = !!data && data.version === 1 &&
      data.partnerRevision === "adsterra-2026-11" &&
      data.advertising === true && Number.isFinite(age) &&
      age >= 0 && age <= 180 * 24 * 60 * 60 * 1000;
  } catch (_) { allowed = false; }
  if (!allowed) return;
  const snippets = {
    desktop: "<script>\n  atOptions = {\n    'key' : '82f2ec7d4d36d4b13fc13d46af67d79d',\n    'format' : 'iframe',\n    'height' : 90,\n    'width' : 728,\n    'params' : {}\n  };\n</script>\n<script src=\"https://bauval.org/22/82f2ec7d4d36d4b13fc13d46af67d79d\"></script>",
    mobile: "<script>\n  atOptions = {\n    'key' : '82977f105f694f9d1f6f9a73fd17e623',\n    'format' : 'iframe',\n    'height' : 50,\n    'width' : 320,\n    'params' : {}\n  };\n</script>\n<script src=\"https://bauval.org/22/82977f105f694f9d1f6f9a73fd17e623\"></script>"
  };
  slot.hidden = false;
  const label = document.createElement("span");
  label.className = "phoenix-ad-label";
  label.textContent = "Advertisement";
  slot.insertBefore(label, current);
  document.write(snippets[unit]);
})();
