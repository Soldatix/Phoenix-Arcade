(() => {
  'use strict';

  const requestedAtLoad = new URLSearchParams(location.search).get('install') === 'web';
  let installRequested = requestedAtLoad;
  let deferredWebInstallPrompt = null;
  let installState = 'waiting';

  const TEXT = {
    en: {
      title: 'Install Phoenix Arcade',
      description: 'Install the Web App for quick access in a standalone game window.',
      install: 'Install Web App',
      continueBrowser: 'Continue in browser',
      installedAction: 'Installed',
      waiting: 'Checking whether installation is available…',
      ready: 'Phoenix Arcade is ready to install.',
      installing: 'Opening the browser install dialog…',
      installed: 'Phoenix Arcade is installed.',
      dismissed: 'Installation was dismissed. You can keep playing in the browser.',
      unavailable: 'The automatic install dialog is not available right now. You can also install from your browser menu.'
    },
    hr: {
      title: 'Instaliraj Phoenix Arcade',
      description: 'Instaliraj Web App za brzi pristup u zasebnom prozoru igre.',
      install: 'Instaliraj Web App',
      continueBrowser: 'Nastavi u pregledniku',
      installedAction: 'Instalirano',
      waiting: 'Provjeravam je li instalacija dostupna…',
      ready: 'Phoenix Arcade je spreman za instalaciju.',
      installing: 'Otvaram instalacijski dijalog preglednika…',
      installed: 'Phoenix Arcade je instaliran.',
      dismissed: 'Instalacija je otkazana. Možeš nastaviti igrati u pregledniku.',
      unavailable: 'Automatski instalacijski dijalog trenutačno nije dostupan. Instalaciju možeš pokrenuti i iz izbornika preglednika.'
    },
    de: {
      title: 'Phoenix Arcade installieren',
      description: 'Installiere die Web App für schnellen Zugriff in einem eigenen Spielfenster.',
      install: 'Web-App installieren',
      continueBrowser: 'Im Browser fortfahren',
      installedAction: 'Installiert',
      waiting: 'Es wird geprüft, ob die Installation verfügbar ist…',
      ready: 'Phoenix Arcade ist zur Installation bereit.',
      installing: 'Der Installationsdialog des Browsers wird geöffnet…',
      installed: 'Phoenix Arcade ist installiert.',
      dismissed: 'Die Installation wurde abgebrochen. Du kannst im Browser weiterspielen.',
      unavailable: 'Der automatische Installationsdialog ist derzeit nicht verfügbar. Du kannst auch über das Browsermenü installieren.'
    },
    it: {
      title: 'Installa Phoenix Arcade',
      description: 'Installa la Web App per un accesso rapido in una finestra di gioco dedicata.',
      install: 'Installa Web App',
      continueBrowser: 'Continua nel browser',
      installedAction: 'Installato',
      waiting: 'Verifica della disponibilità dell’installazione…',
      ready: 'Phoenix Arcade è pronto per l’installazione.',
      installing: 'Apertura della finestra di installazione del browser…',
      installed: 'Phoenix Arcade è installato.',
      dismissed: 'Installazione annullata. Puoi continuare a giocare nel browser.',
      unavailable: 'La finestra automatica di installazione non è disponibile al momento. Puoi installare anche dal menu del browser.'
    },
    es: {
      title: 'Instalar Phoenix Arcade',
      description: 'Instala la Web App para un acceso rápido en una ventana de juego independiente.',
      install: 'Instalar Web App',
      continueBrowser: 'Continuar en el navegador',
      installedAction: 'Instalado',
      waiting: 'Comprobando si la instalación está disponible…',
      ready: 'Phoenix Arcade está listo para instalarse.',
      installing: 'Abriendo el diálogo de instalación del navegador…',
      installed: 'Phoenix Arcade está instalado.',
      dismissed: 'La instalación se canceló. Puedes seguir jugando en el navegador.',
      unavailable: 'El diálogo automático de instalación no está disponible ahora. También puedes instalar desde el menú del navegador.'
    }
  };

  function language() {
    const code = (document.documentElement.lang || 'en').slice(0, 2).toLowerCase();
    return Object.prototype.hasOwnProperty.call(TEXT, code) ? code : 'en';
  }

  function copy() {
    return TEXT[language()];
  }

  function isStandalone() {
    return Boolean(
      window.matchMedia?.('(display-mode: standalone)').matches ||
      window.navigator.standalone === true
    );
  }

  function removeInstallParameter() {
    try {
      const url = new URL(location.href);
      url.searchParams.delete('install');
      const next = url.pathname + (url.search ? url.search : '') + url.hash;
      history.replaceState({}, '', next);
    } catch (error) {
      console.warn('Phoenix Arcade install URL cleanup failed', error);
    }
  }

  function continueInBrowser() {
    installRequested = false;
    document.getElementById('webInstallBanner')?.remove();
    removeInstallParameter();
  }

  function statusText(text) {
    return text[installState] || text.waiting;
  }

  function render(state = null) {
    if (state) installState = state;
    if (!installRequested) {
      document.getElementById('webInstallBanner')?.remove();
      return;
    }

    if (isStandalone()) installState = 'installed';

    let banner = document.getElementById('webInstallBanner');
    if (!banner) {
      banner = document.createElement('aside');
      banner.id = 'webInstallBanner';
      banner.className = 'web-install-banner';
      banner.setAttribute('role', 'region');
      document.body.appendChild(banner);
    }

    const text = copy();
    banner.replaceChildren();

    const heading = document.createElement('div');
    heading.className = 'web-install-heading';

    const icon = document.createElement('img');
    icon.className = 'web-install-icon';
    icon.src = './icons/phoenix-192.png';
    icon.alt = '';
    icon.setAttribute('aria-hidden', 'true');

    const headingText = document.createElement('div');
    const title = document.createElement('strong');
    title.id = 'webInstallTitle';
    title.textContent = text.title;
    const description = document.createElement('p');
    description.textContent = text.description;
    headingText.append(title, description);
    heading.append(icon, headingText);

    const status = document.createElement('p');
    status.className = 'web-install-status';
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    status.textContent = statusText(text);

    const actions = document.createElement('div');
    actions.className = 'web-install-actions';

    const install = document.createElement('button');
    install.type = 'button';
    install.id = 'installWebAppButton';
    install.className = 'web-install-primary';
    install.textContent = installState === 'installed' ? text.installedAction : text.install;
    install.disabled = installState === 'installed' || installState === 'installing';
    install.addEventListener('click', async () => {
      if (isStandalone()) {
        render('installed');
        return;
      }
      if (!deferredWebInstallPrompt) {
        render('unavailable');
        return;
      }

      const promptEvent = deferredWebInstallPrompt;
      render('installing');
      promptEvent.prompt();
      const choice = await promptEvent.userChoice;
      deferredWebInstallPrompt = null;
      render(choice.outcome === 'accepted' ? 'installing' : 'dismissed');
    });

    const continueButton = document.createElement('button');
    continueButton.type = 'button';
    continueButton.id = 'continueWebButton';
    continueButton.className = 'web-install-secondary';
    continueButton.textContent = text.continueBrowser;
    continueButton.addEventListener('click', continueInBrowser);

    actions.append(install, continueButton);
    banner.setAttribute('aria-labelledby', title.id);
    banner.append(heading, status, actions);
  }

  window.addEventListener('beforeinstallprompt', (event) => {
    if (!installRequested) return;
    event.preventDefault();
    deferredWebInstallPrompt = event;
    render('ready');
  });

  window.addEventListener('appinstalled', () => {
    deferredWebInstallPrompt = null;
    if (installRequested) render('installed');
  });

  const languageObserver = new MutationObserver(() => {
    if (installRequested && document.getElementById('webInstallBanner')) render();
  });
  languageObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });

  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    navigator.serviceWorker.register('./sw.js', { scope: './' })
      .then(() => navigator.serviceWorker.ready)
      .catch((error) => {
        console.warn('Phoenix Arcade service worker registration failed', error);
      });
  }

  if (installRequested) {
    render(isStandalone() ? 'installed' : 'waiting');
    window.setTimeout(() => {
      if (installRequested && !deferredWebInstallPrompt && !isStandalone() && installState === 'waiting') {
        render('unavailable');
      }
    }, 8000);
  }
})();
