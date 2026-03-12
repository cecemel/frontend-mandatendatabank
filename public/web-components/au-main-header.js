/**
 * au-wc-main-header web component
 *
 * Shadow DOM port of ember-appuniversum's AuMainHeader.
 * Renders the application top-bar with Vlaanderen brand, app title, skip-link,
 * and optional contact nav link.
 *
 * Attributes:
 *   brand-link     — string: href for the Vlaanderen logo (default: "/")
 *   home-href      — string: href for the app-title link (default: "/")
 *   app-title      — string: application name shown next to the brand
 *   contact-href   — string: href for the "Contacteer ons" nav item; omit to hide
 *   contact-label  — string: custom contact link label (default: "Contacteer ons")
 *
 * Slot (default): extra nav items rendered in the header actions bar.
 *
 * Usage:
 *   <au-wc-main-header
 *     brand-link="https://mandaten.lokaalbestuur.vlaanderen.be/"
 *     home-href="/"
 *     app-title="Mandatendatabank"
 *     contact-href="/contact"
 *   ></au-wc-main-header>
 */

(function () {
  'use strict';

  const STYLES_URL = (function () {
    const src = document.currentScript && document.currentScript.src;
    return src ? src.replace(/\/[^/]+$/, '/styles.css') : 'web-components/styles.css';
  })();

  const ICON_BASE_URL = (function () {
    const src = document.currentScript && document.currentScript.src;
    return src ? src.replace(/\/[^/]+$/, '/icons') : '/web-components/icons';
  })();

  const _iconCache = Object.create(null);

  function loadIcon(name) {
    if (!_iconCache[name]) {
      _iconCache[name] = fetch(`${ICON_BASE_URL}/${name}.svg`)
        .then(function (r) { return r.text(); })
        .then(function (text) {
          return text.replace(/<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
        });
    }
    return _iconCache[name];
  }

  function safeAttr(str) {
    return (str || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function brandLinkHTML(brandLink) {
    const href = safeAttr(brandLink || '/');
    return `
      <a href="${href}" class="au-wc-brand au-wc-brand--link" aria-label="Vlaanderen">
        <div class="au-wc-brand__logo">
          <img src="${ICON_BASE_URL}/vlaanderen-logo.svg" alt="Logo Vlaanderen" aria-hidden="true">
        </div>
        <p class="au-wc-brand__logotype">
          <span class="au-wc-brand__main">Vlaanderen</span>
        </p>
      </a>
    `;
  }

  class AuWcMainHeader extends HTMLElement {
    static get observedAttributes() {
      return ['brand-link', 'home-href', 'app-title', 'contact-href', 'contact-label'];
    }

    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
      this._render();
    }

    attributeChangedCallback() {
      if (this.isConnected) this._render();
    }

    async _render() {
      const brandLink    = this.getAttribute('brand-link') || '/';
      const homeHref     = this.getAttribute('home-href') || '/';
      const appTitle     = this._escape(this.getAttribute('app-title') || '');
      const contactHref  = this.getAttribute('contact-href');
      const contactLabel = this._escape(this.getAttribute('contact-label') || 'Contacteer ons');

      let contactItem = '';
      if (contactHref) {
        const iconInner = await loadIcon('question-circle');
        const iconSvg = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="au-wc-icon" aria-hidden="true">${iconInner}</svg>`;
        contactItem = `
          <li>
            <a href="${safeAttr(contactHref)}" class="au-wc-link au-wc-link--secondary">
              ${iconSvg}
              ${contactLabel}
            </a>
          </li>
        `;
      }

      if (!this.isConnected) return;

      this.shadowRoot.innerHTML = `
        <link rel="stylesheet" href="${STYLES_URL}">
        <header class="au-wc-main-header">
          <div class="au-wc-main-header__title-group">
            ${brandLinkHTML(brandLink)}
            <a href="${safeAttr(homeHref)}" class="au-wc-main-header__title au-wc-main-header__title--link">
              ${appTitle}
            </a>
            <a href="#content" class="au-wc-main-header__skiplink">
              Naar de hoofdinhoud
            </a>
          </div>
          <nav aria-label="Informatie en instellingen" class="au-wc-main-header__actions">
            <ul class="au-wc-main-header__nav-list">
              ${contactItem}
              <li>
                <slot></slot>
              </li>
            </ul>
          </nav>
        </header>
      `;
    }

    _escape(str) {
      return (str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    }
  }

  customElements.define('au-wc-main-header', AuWcMainHeader);
})();
