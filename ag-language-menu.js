(() => {
  'use strict';

  const FLAGS = {
    hr: `<svg viewBox="0 0 30 20" aria-hidden="true"><rect width="30" height="6.67" fill="#ff0000"/><rect y="6.67" width="30" height="6.66" fill="#fff"/><rect y="13.33" width="30" height="6.67" fill="#171796"/><path d="M12 5h6v7.2c0 2.4-1.7 4.1-3 4.8-1.3-.7-3-2.4-3-4.8z" fill="#fff" stroke="#d10b2f" stroke-width=".8"/><path d="M12.4 6h1.3v1.3h-1.3zm2.6 0h1.3v1.3H15zm-1.3 1.3H15v1.3h-1.3zm2.6 0h1.3v1.3h-1.3zm-3.9 1.3h1.3v1.3h-1.3zm2.6 0h1.3v1.3H15z" fill="#d10b2f"/></svg>`,
    en: `<svg viewBox="0 0 30 20" aria-hidden="true"><rect width="30" height="20" fill="#012169"/><path d="M0 0l30 20M30 0L0 20" stroke="#fff" stroke-width="4"/><path d="M0 0l30 20M30 0L0 20" stroke="#C8102E" stroke-width="2"/><path d="M15 0v20M0 10h30" stroke="#fff" stroke-width="6"/><path d="M15 0v20M0 10h30" stroke="#C8102E" stroke-width="3.2"/></svg>`,
    de: `<svg viewBox="0 0 30 20" aria-hidden="true"><rect width="30" height="6.67" fill="#000"/><rect y="6.67" width="30" height="6.66" fill="#DD0000"/><rect y="13.33" width="30" height="6.67" fill="#FFCE00"/></svg>`,
    it: `<svg viewBox="0 0 30 20" aria-hidden="true"><rect width="10" height="20" fill="#009246"/><rect x="10" width="10" height="20" fill="#fff"/><rect x="20" width="10" height="20" fill="#CE2B37"/></svg>`,
    es: `<svg viewBox="0 0 30 20" aria-hidden="true"><rect width="30" height="5" fill="#AA151B"/><rect y="5" width="30" height="10" fill="#F1BF00"/><rect y="15" width="30" height="5" fill="#AA151B"/></svg>`
  };

  const LANGUAGES = [
    { value: 'hr', label: 'Hrvatski' },
    { value: 'en', label: 'English' },
    { value: 'de', label: 'Deutsch' },
    { value: 'it', label: 'Italiano' },
    { value: 'es', label: 'Español' }
  ];

  function enhance(select) {
    if (!select || select.dataset.agLanguageReady === 'true') return;
    select.dataset.agLanguageReady = 'true';

    const wrapper = document.createElement('div');
    wrapper.className = 'ag-language-menu';

    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'ag-language-trigger';
    trigger.setAttribute('aria-haspopup', 'listbox');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-label', select.getAttribute('aria-label') || 'Language');

    const list = document.createElement('div');
    list.className = 'ag-language-list';
    list.setAttribute('role', 'listbox');
    list.tabIndex = -1;

    function languageFor(value) {
      return LANGUAGES.find(item => item.value === value) || LANGUAGES.find(item => item.value === 'en');
    }

    function renderTrigger() {
      const item = languageFor(select.value);
      trigger.innerHTML = `<span class="ag-language-flag">${FLAGS[item.value]}</span><span class="ag-language-label">${item.label}</span><span class="ag-language-chevron" aria-hidden="true">▾</span>`;
      list.querySelectorAll('[role="option"]').forEach(option => {
        const active = option.dataset.value === item.value;
        option.setAttribute('aria-selected', active ? 'true' : 'false');
        option.classList.toggle('is-active', active);
      });
    }

    function closeMenu(returnFocus = false) {
      wrapper.classList.remove('is-open');
      trigger.setAttribute('aria-expanded', 'false');
      if (returnFocus) trigger.focus();
    }

    function openMenu() {
      wrapper.classList.add('is-open');
      trigger.setAttribute('aria-expanded', 'true');
      const active = list.querySelector('[aria-selected="true"]') || list.querySelector('[role="option"]');
      if (active) requestAnimationFrame(() => active.focus());
    }

    function choose(value) {
      if (select.value !== value) {
        select.value = value;
        select.dispatchEvent(new Event('change', { bubbles: true }));
      }
      renderTrigger();
      closeMenu(true);
    }

    LANGUAGES.forEach(item => {
      const option = document.createElement('button');
      option.type = 'button';
      option.className = 'ag-language-option';
      option.dataset.value = item.value;
      option.setAttribute('role', 'option');
      option.innerHTML = `<span class="ag-language-flag">${FLAGS[item.value]}</span><span>${item.label}</span><span class="ag-language-check" aria-hidden="true">✓</span>`;
      option.addEventListener('click', () => choose(item.value));
      option.addEventListener('keydown', event => {
        const options = [...list.querySelectorAll('[role="option"]')];
        const index = options.indexOf(option);
        if (event.key === 'ArrowDown') {
          event.preventDefault();
          options[(index + 1) % options.length].focus();
        } else if (event.key === 'ArrowUp') {
          event.preventDefault();
          options[(index - 1 + options.length) % options.length].focus();
        } else if (event.key === 'Home') {
          event.preventDefault();
          options[0].focus();
        } else if (event.key === 'End') {
          event.preventDefault();
          options[options.length - 1].focus();
        } else if (event.key === 'Escape') {
          event.preventDefault();
          closeMenu(true);
        } else if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          choose(option.dataset.value);
        }
      });
      list.appendChild(option);
    });

    trigger.addEventListener('click', () => wrapper.classList.contains('is-open') ? closeMenu() : openMenu());
    trigger.addEventListener('keydown', event => {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        openMenu();
      } else if (event.key === 'Escape') {
        closeMenu();
      }
    });

    select.addEventListener('change', renderTrigger);
    document.addEventListener('pointerdown', event => {
      if (!wrapper.contains(event.target)) closeMenu();
    });

    select.classList.add('ag-language-native-enhanced');
    select.tabIndex = -1;
    select.setAttribute('aria-hidden', 'true');
    select.insertAdjacentElement('afterend', wrapper);
    wrapper.append(trigger, list);
    renderTrigger();
  }

  document.querySelectorAll('select[data-ag-language-menu]').forEach(enhance);
})();
