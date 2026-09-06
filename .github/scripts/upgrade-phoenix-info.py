from pathlib import Path

p = Path('index.html')
s = p.read_text(encoding='utf-8')

if 'id="phoenix-standard-info"' in s:
    print('Phoenix Info already upgraded')
    raise SystemExit(0)

css = r'''

    /* Apps & Games standard Info / Donations */
    #infoModal .modal-card{width:min(760px,100%);max-height:min(90dvh,840px);padding:0;overflow:hidden;display:flex;flex-direction:column;background:linear-gradient(145deg,#171033,#0a061a)}
    #infoModal .modal-head{margin:0;padding:18px 20px;border-bottom:1px solid var(--line);background:rgba(8,5,22,.58)}
    .phoenix-info-scroll{padding:18px 20px;overflow:auto;display:flex;flex-direction:column;gap:14px}
    .phoenix-info-charity{padding:14px 16px;border:1px solid rgba(72,231,255,.22);border-radius:15px;background:rgba(72,231,255,.06);color:#d9d4e8;font-size:13px;line-height:1.65}
    .phoenix-info-kicker,.phoenix-info-section{font-size:11px;font-weight:900;letter-spacing:.13em;text-transform:uppercase}
    .phoenix-info-kicker{color:var(--cyan);margin-bottom:8px}.phoenix-info-charity p{margin:0}.phoenix-info-charity p+p{margin-top:8px}.phoenix-info-section{color:#aaa5c2}
    .phoenix-payment-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.phoenix-payment-card{min-width:0;padding:15px;border-radius:15px;border:1px solid var(--line);background:rgba(6,3,17,.48);display:flex;flex-direction:column;gap:10px}.phoenix-payment-brand{display:flex;align-items:center;gap:9px}.phoenix-payment-symbol{width:38px;height:38px;display:grid;place-items:center;border-radius:11px;border:1px solid rgba(72,231,255,.32);background:rgba(72,231,255,.09);color:var(--cyan);font-weight:900}.phoenix-payment-brand strong{font-size:15px}.phoenix-payment-desc{color:#d0cae2;font-size:12px;line-height:1.55;flex:1}.phoenix-payment-badges{display:flex;flex-wrap:wrap;gap:6px}.phoenix-payment-badge{padding:4px 8px;border:1px solid var(--line);border-radius:999px;background:#1a1035;color:#d8d1e8;font-size:10px;font-weight:800}.phoenix-payment-action{min-height:43px;display:flex;align-items:center;justify-content:center;text-decoration:none;border-radius:11px;font-weight:900;color:#140923;text-align:center;padding:9px 12px;background:linear-gradient(100deg,#4ce8ff,#8f7aff)}.phoenix-payment-card.stripe .phoenix-payment-action{background:linear-gradient(100deg,#ffd45a,#ff8b6e)}.phoenix-payment-note{color:#aaa5c2;font-size:11px}
    .phoenix-crypto-list{display:flex;flex-direction:column;gap:8px}.phoenix-crypto-row{display:grid;grid-template-columns:72px minmax(0,1fr) auto;align-items:center;gap:10px;padding:11px 12px;border-radius:12px;border:1px solid var(--line);background:rgba(5,3,14,.62)}.phoenix-crypto-code{color:var(--cyan);font-weight:900;font-family:ui-monospace,SFMono-Regular,Consolas,monospace}.phoenix-crypto-address{min-width:0;color:#ece8f7;font-size:11px;line-height:1.45;font-family:ui-monospace,SFMono-Regular,Consolas,monospace;overflow-wrap:anywhere;user-select:text;-webkit-user-select:text}.phoenix-copy-btn{min-width:78px;padding:7px 9px;border-radius:9px;border:1px solid var(--line);background:#211540;color:#eeeaff;font-size:11px;font-weight:800}.phoenix-copy-btn.copied{border-color:rgba(72,231,255,.58);background:rgba(72,231,255,.12);color:#91f1ff}.phoenix-info-footer{padding:12px 20px;border-top:1px solid var(--line);display:flex;justify-content:flex-end;background:rgba(8,5,22,.58)}.phoenix-info-close{min-width:100px;height:40px;border:1px solid var(--line);border-radius:12px;background:#211540;color:#fff;font-weight:800}
    @media(max-width:640px){.phoenix-payment-grid{grid-template-columns:1fr}.phoenix-crypto-row{grid-template-columns:58px minmax(0,1fr)}.phoenix-copy-btn{grid-column:2;justify-self:end}.phoenix-info-scroll{padding:15px}.phoenix-info-footer{padding:10px 15px}}
'''

pos = s.rfind('</style>')
if pos < 0:
    raise SystemExit('No style closing tag found')
s = s[:pos] + css + '\n  ' + s[pos:]

wallets = [
    ('BTC','bc1qwlrxrh64peukga0fp59m9yg7gpf0yj8q7fxnsc'),
    ('ETH','0xA99A52085c6725854daa46bb302041569c8bA4E3'),
    ('XRP','rP43SsrkhPkxTsFohMAm32sAQg7vqwmDpr'),
    ('SOL','8xkdVTEaDGuWu4aE3HpEx8r9Aux98JZbdsMiDQvJWBWR'),
    ('DOGE','DGAT32ku8WmFaTDxCgVuRuVpUFmfdmD5Jb'),
    ('XLM','GCYH4OD4I2GNRKFFOYROE3N3S2HCT5RXIML3TZV5DP3TLTLXPXQXIJZ3'),
    ('LTC','LWtaFniqdYpv2xJtqo9WqDwCsQ2cW6PYWi'),
    ('RVN','RAtXzKZyB3awfq2u2cK8YppC9kJamU5tPQ'),
]
wallet_html = '\n'.join(
    f'        <div class="phoenix-crypto-row"><div class="phoenix-crypto-code">{coin}</div><div class="phoenix-crypto-address">{addr}</div><button class="phoenix-copy-btn" data-address="{addr}" onclick="copyPhoenixWallet(this)">Copy</button></div>'
    for coin, addr in wallets
)

modal = f'''  <div class="modal hidden" id="infoModal" role="dialog" aria-modal="true" aria-labelledby="infoTitle">
    <div class="modal-card" id="phoenix-standard-info">
      <div class="modal-head"><h2 id="infoTitle">Information / Donations</h2><button class="close" data-close="infoModal" aria-label="Close">✕</button></div>
      <div class="phoenix-info-scroll">
        <div class="phoenix-info-charity">
          <div class="phoenix-info-kicker" id="phoenixInfoCharityTitle">Charity purpose</div>
          <p id="phoenixInfoFree"><strong>The game is free to use, but voluntary donations are welcome.</strong></p>
          <p id="phoenixInfoCharity">A part of the received donations will be forwarded to various charitable organizations. The largest part will be donated to institutions caring for children without adequate parental care.</p>
        </div>
        <div class="phoenix-info-section" id="phoenixInfoDirect">Direct online payments</div>
        <div class="phoenix-payment-grid">
          <div class="phoenix-payment-card">
            <div class="phoenix-payment-brand"><span class="phoenix-payment-symbol">P</span><strong>PayPal</strong></div>
            <div class="phoenix-payment-desc" id="phoenixPaypalDesc">Pay securely with PayPal or other payment options offered by PayPal Checkout.</div>
            <div class="phoenix-payment-badges"><span class="phoenix-payment-badge">PayPal</span><span class="phoenix-payment-badge phoenix-card-badge">Debit / Credit Card</span><span class="phoenix-payment-badge">Apple Pay</span></div>
            <a class="phoenix-payment-action" id="phoenixPaypalButton" href="https://www.paypal.com/ncp/payment/RU2CWCNVQ7XD6" target="_blank" rel="noopener noreferrer">Donate with PayPal ↗</a>
          </div>
          <div class="phoenix-payment-card stripe">
            <div class="phoenix-payment-brand"><span class="phoenix-payment-symbol">S</span><strong>Stripe</strong></div>
            <div class="phoenix-payment-desc" id="phoenixStripeDesc">Pay securely by card or with payment methods available through Stripe Checkout.</div>
            <div class="phoenix-payment-badges"><span class="phoenix-payment-badge phoenix-card-badge">Debit / Credit Card</span><span class="phoenix-payment-badge">Link</span><span class="phoenix-payment-badge" id="phoenixWalletBadge">Digital wallets</span></div>
            <a class="phoenix-payment-action" id="phoenixStripeButton" href="https://buy.stripe.com/7sYeVd7Blfe89cm0k02kw00" target="_blank" rel="noopener noreferrer">Donate with Stripe ↗</a>
          </div>
        </div>
        <div class="phoenix-payment-note" id="phoenixPaymentNote">Available payment methods can vary by country, device and payment provider.</div>
        <div class="phoenix-info-section" id="phoenixCryptoTitle">Crypto Wallets</div>
        <div class="phoenix-crypto-list">
{wallet_html}
        </div>
      </div>
      <div class="phoenix-info-footer"><button class="phoenix-info-close" id="phoenixInfoClose" data-close="infoModal">Close</button></div>
    </div>
  </div>
'''

start_marker = '  <div class="modal hidden" id="infoModal"'
end_marker = '  <div class="modal hidden" id="howModal"'
start = s.find(start_marker)
end = s.find(end_marker, start + len(start_marker))
if start < 0 or end < 0:
    raise SystemExit(f'Info modal boundaries not found: start={start}, end={end}')
s = s[:start] + modal + s[end:]

info_js = r'''
    const INFO_I18N={
      en:{menu:"Information / Donations",title:"Information / Donations",charityTitle:"Charity purpose",free:"The game is free to use, but voluntary donations are welcome.",charity:"A part of the received donations will be forwarded to various charitable organizations. The largest part will be donated to institutions caring for children without adequate parental care.",direct:"Direct online payments",paypalDesc:"Pay securely with PayPal or other payment options offered by PayPal Checkout.",stripeDesc:"Pay securely by card or with payment methods available through Stripe Checkout.",cards:"Debit / Credit Card",wallets:"Digital wallets",paypalButton:"Donate with PayPal ↗",stripeButton:"Donate with Stripe ↗",note:"Available payment methods can vary by country, device and payment provider.",crypto:"Crypto Wallets",copy:"Copy",copied:"Copied!",close:"Close"},
      hr:{menu:"Informacije / Donacije",title:"Informacije / Donacije",charityTitle:"Humanitarna svrha",free:"Igra je besplatna za korištenje, ali dobrovoljne donacije su dobrodošle.",charity:"Dio primljenih donacija proslijedit će se različitim humanitarnim organizacijama. Najveći dio bit će doniran ustanovama koje skrbe o djeci bez odgovarajuće roditeljske skrbi.",direct:"Izravna online plaćanja",paypalDesc:"Platite sigurno putem PayPala ili drugim načinima plaćanja koje nudi PayPal Checkout.",stripeDesc:"Platite sigurno karticom ili načinima plaćanja dostupnima putem Stripe Checkouta.",cards:"Debitna / kreditna kartica",wallets:"Digitalni novčanici",paypalButton:"Doniraj putem PayPala ↗",stripeButton:"Doniraj putem Stripea ↗",note:"Dostupni načini plaćanja mogu se razlikovati ovisno o državi, uređaju i pružatelju plaćanja.",crypto:"Kripto novčanici",copy:"Kopiraj",copied:"Kopirano!",close:"Zatvori"},
      de:{menu:"Informationen / Spenden",title:"Informationen / Spenden",charityTitle:"Wohltätiger Zweck",free:"Das Spiel kann kostenlos genutzt werden, freiwillige Spenden sind jedoch willkommen.",charity:"Ein Teil der erhaltenen Spenden wird an verschiedene gemeinnützige Organisationen weitergeleitet. Der größte Teil wird an Einrichtungen gespendet, die Kinder ohne angemessene elterliche Fürsorge betreuen.",direct:"Direkte Online-Zahlungen",paypalDesc:"Sicher mit PayPal oder weiteren von PayPal Checkout angebotenen Zahlungsmethoden bezahlen.",stripeDesc:"Sicher per Karte oder mit den über Stripe Checkout verfügbaren Zahlungsmethoden bezahlen.",cards:"Debit- / Kreditkarte",wallets:"Digitale Wallets",paypalButton:"Mit PayPal spenden ↗",stripeButton:"Mit Stripe spenden ↗",note:"Verfügbare Zahlungsmethoden können je nach Land, Gerät und Zahlungsanbieter variieren.",crypto:"Krypto-Wallets",copy:"Kopieren",copied:"Kopiert!",close:"Schließen"},
      it:{menu:"Informazioni / Donazioni",title:"Informazioni / Donazioni",charityTitle:"Scopo benefico",free:"Il gioco è gratuito, ma le donazioni volontarie sono benvenute.",charity:"Una parte delle donazioni ricevute sarà destinata a diverse organizzazioni benefiche. La parte maggiore sarà donata a istituti che si occupano di bambini privi di adeguate cure parentali.",direct:"Pagamenti online diretti",paypalDesc:"Paga in modo sicuro con PayPal o con gli altri metodi disponibili tramite PayPal Checkout.",stripeDesc:"Paga in modo sicuro con carta o con i metodi disponibili tramite Stripe Checkout.",cards:"Carta di debito / credito",wallets:"Portafogli digitali",paypalButton:"Dona con PayPal ↗",stripeButton:"Dona con Stripe ↗",note:"I metodi di pagamento disponibili possono variare in base al Paese, al dispositivo e al fornitore di pagamento.",crypto:"Portafogli crypto",copy:"Copia",copied:"Copiato!",close:"Chiudi"},
      es:{menu:"Información / Donaciones",title:"Información / Donaciones",charityTitle:"Finalidad benéfica",free:"El juego es gratuito, pero las donaciones voluntarias son bienvenidas.",charity:"Una parte de las donaciones recibidas se destinará a diversas organizaciones benéficas. La mayor parte se donará a instituciones que atienden a niños sin una atención parental adecuada.",direct:"Pagos directos en línea",paypalDesc:"Paga de forma segura con PayPal u otros métodos disponibles mediante PayPal Checkout.",stripeDesc:"Paga de forma segura con tarjeta o con los métodos disponibles mediante Stripe Checkout.",cards:"Tarjeta de débito / crédito",wallets:"Carteras digitales",paypalButton:"Donar con PayPal ↗",stripeButton:"Donar con Stripe ↗",note:"Los métodos de pago disponibles pueden variar según el país, el dispositivo y el proveedor de pago.",crypto:"Carteras de criptomonedas",copy:"Copiar",copied:"¡Copiado!",close:"Cerrar"}
    };
    function updateInfoLanguage(){const i=INFO_I18N[prefs.lang]||INFO_I18N.en,set=(sel,val)=>{const el=$(sel);if(el)el.textContent=val};set('#menuInfoBtn',i.menu);set('#infoTitle',i.title);set('#phoenixInfoCharityTitle',i.charityTitle);set('#phoenixInfoFree',i.free);set('#phoenixInfoCharity',i.charity);set('#phoenixInfoDirect',i.direct);set('#phoenixPaypalDesc',i.paypalDesc);set('#phoenixStripeDesc',i.stripeDesc);document.querySelectorAll('.phoenix-card-badge').forEach(el=>el.textContent=i.cards);set('#phoenixWalletBadge',i.wallets);set('#phoenixPaypalButton',i.paypalButton);set('#phoenixStripeButton',i.stripeButton);set('#phoenixPaymentNote',i.note);set('#phoenixCryptoTitle',i.crypto);set('#phoenixInfoClose',i.close);document.querySelectorAll('.phoenix-copy-btn').forEach(btn=>{if(!btn.classList.contains('copied'))btn.textContent=i.copy})}
    function fallbackPhoenixCopy(address,done){const ta=document.createElement('textarea');ta.value=address;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();try{document.execCommand('copy');done()}catch(e){}ta.remove()}
    window.copyPhoenixWallet=function(button){const i=INFO_I18N[prefs.lang]||INFO_I18N.en,address=button.dataset.address||'',done=()=>{button.classList.add('copied');button.textContent=i.copied;setTimeout(()=>{button.classList.remove('copied');button.textContent=(INFO_I18N[prefs.lang]||INFO_I18N.en).copy},1600)};if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(address).then(done).catch(()=>fallbackPhoenixCopy(address,done));else fallbackPhoenixCopy(address,done)};
'''

prefs_marker = "    let prefs={lang:'en',sound:true};"
if prefs_marker not in s:
    raise SystemExit('Preferences marker not found')
s = s.replace(prefs_marker, info_js + '\n' + prefs_marker, 1)

old_apply = "    function applyLanguage(){document.documentElement.lang=prefs.lang;document.querySelectorAll('[data-i18n]').forEach(el=>el.textContent=t(el.dataset.i18n));$('#howText').textContent=t('how');$('#language').value=prefs.lang;updatePowerHud();savePrefs()}"
new_apply = "    function applyLanguage(){document.documentElement.lang=prefs.lang;document.querySelectorAll('[data-i18n]').forEach(el=>el.textContent=t(el.dataset.i18n));$('#howText').textContent=t('how');$('#language').value=prefs.lang;updateInfoLanguage();updatePowerHud();savePrefs()}"
if old_apply not in s:
    raise SystemExit('applyLanguage marker not found')
s = s.replace(old_apply, new_apply, 1)

p.write_text(s, encoding='utf-8')
print('Phoenix Info upgraded')
