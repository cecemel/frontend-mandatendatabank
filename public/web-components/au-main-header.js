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

  /* Vlaanderen lion SVG path */
  const LION_PATH = 'M19.61,16c-1.08-.82-1.59,0-2.27,0s-1.12-1-1.56-.75c-0.85.43,0.34,2,.86,2.27a12.51,12.51,0,0,0,1.18.59,1.72,1.72,0,0,1,1,1.55,3,3,0,0,1,0,.75c-0.31,1.32-2.64,2.52-4,1.61a3,3,0,0,1-1.4-2c-0.36-1.73-1.62-3-2-4.7-0.25-1-.43-2.12-0.7-3.15S10.17,10,9.94,9A27.44,27.44,0,0,0,9,5.92C7.71,2.61,7.14,2.85,7.14,2.85s0.46,0.92,2.15,9A47.8,47.8,0,0,0,10.42,17c0.16,0.42.44,1.32,0.62,1.72,0.54,1.16,2,2.92,2.05,4.51,0.05,0.92.16,1.68,0.18,2.37a7.37,7.37,0,0,0,.24,1.4c0.35,1,3.14,4.09,6.1,4.09V28.68a10.88,10.88,0,0,1-5.79-1.82,6.37,6.37,0,0,1,.35-1.7,2.78,2.78,0,0,1,2.39-1.94,17.91,17.91,0,0,1,3,.31V16ZM6.82,7.36c-0.11,1.77-2.87,4.2-3.73,5.75A11.43,11.43,0,0,0,2,15.95a7.53,7.53,0,0,0,.62,4.67c0.91,2.18-.12,3,0.59,2.54,0.88-.72.75-2.39,0.68-3.43a14.77,14.77,0,0,1,0-2.82A13.29,13.29,0,0,1,6.3,11.58a4.84,4.84,0,0,0,.52-4.22m0.56,5s0.29,1.4-1,5c-3.26,9.45,3,10.34,4.74,12.56,0,0,.69-1-2.14-4-1-1.12-2-3.6-1.15-7.15,1.17-5.13-.5-6.39-0.5-6.39M1.21,6.2A4.53,4.53,0,0,1,1,4.7C1.2,2.48,3.23,1.58,3.73,1.25A2.7,2.7,0,0,0,4.76,0,3,3,0,0,1,3.55,3.67,6.06,6.06,0,0,0,1.21,6.2M6.32,4.05c0.11,0.23,1,1.45-2.48,4.27s-2.36,4.84-2.36,4.84-3.66-2,.56-5.53S5.39,3.43,5.39,3.43a1.05,1.05,0,0,1,.93.63m4.46,1.08c0.59,0.08,1,1.92,2.35,2.32,1,0.29,2.08.13,2.32,0.74a0.52,0.52,0,0,0,.37.92C16.21,8,16.4,3.88,10.79,5.14ZM12.64,6c0-.13.12,0,0.27-0.12a1.66,1.66,0,0,1,.59-0.48,1,1,0,0,1,.62,0c0.12,0,0,.33,0,0.4s-0.74-.09-0.74.32c0,0.67.91,0,1.38,0,0.23,1.64-2.48,1.19-2.08-.16h0Z';

  /* Question-circle icon for contact link */
  const QUESTION_CIRCLE_PATH = '<path d="M12,22 C10.0222009,22 8.08879087,21.4135009 6.44430087,20.3147009 C4.79981087,19.2159009 3.51809087,17.6541009 2.76121087,15.8268009 C2.00433087,13.9996009 1.80630087,11.9889009 2.19215087,10.0491009 C2.57800087,8.10929087 3.53041087,6.32746087 4.92894087,4.92894087 C6.32746087,3.53041087 8.10929087,2.57800087 10.0491009,2.19215087 C11.9889009,1.80630087 13.9996009,2.00433087 15.8268009,2.76121087 C17.6541009,3.51809087 19.2159009,4.79981087 20.3147009,6.44430087 C21.4135009,8.08879087 22,10.0222009 22,12 C22,14.6522009 20.9464009,17.1957009 19.0711009,19.0711009 C17.1957009,20.9464009 14.6522009,22 12,22 Z M12.0000016,4.00000087 C10.4178009,4.00000087 8.87104087,4.46920087 7.55544087,5.34825087 C6.23985087,6.22730087 5.21447087,7.47673087 4.60897087,8.93854087 C4.00347087,10.4003009 3.84504087,12.0089009 4.15372087,13.5607009 C4.46240087,15.1126009 5.22433087,16.5380009 6.34315087,17.6569009 C7.46197087,18.7757009 8.88743087,19.5376009 10.4393009,19.8463009 C11.9911009,20.1550009 13.5997009,19.9965009 15.0615009,19.3910009 C16.5233009,18.7855009 17.7727009,17.7602009 18.6518009,16.4446009 C19.5308009,15.1290009 20.0000016,13.5823009 20.0000016,12.0000009 C20.0000016,9.87827087 19.1572009,7.84344087 17.6569009,6.34315087 C16.1566009,4.84286087 14.1217009,4.00000087 12.0000016,4.00000087 Z M13.0000009,15.0000009 L11.0000009,15.0000009 L11.0000009,12.0000009 L12.0000009,12.0000009 C12.3956009,12.0000009 12.7822009,11.8827009 13.1111009,11.6629009 C13.4400009,11.4432009 13.6964009,11.1308009 13.8478009,10.7654009 C13.9991009,10.3999009 14.0387009,9.99779087 13.9616009,9.60982087 C13.8844009,9.22186087 13.6939009,8.86550087 13.4142009,8.58579087 C13.1345009,8.30609087 12.7781009,8.11560087 12.3902009,8.03843087 C12.0022009,7.96126087 11.6001009,8.00087087 11.2346009,8.15225087 C10.8692009,8.30362087 10.5568009,8.55997087 10.3371009,8.88886087 C10.1173009,9.21776087 10.0000009,9.60444087 10.0000009,10.0000009 L8.00000087,10.0000009 C8.00132087,9.25217087 8.21225087,8.51968087 8.60885087,7.88567087 C9.00546087,7.25167087 9.57185087,6.74154087 10.2438009,6.41319087 C10.9157009,6.08485087 11.6661009,5.95143087 12.4100009,6.02809087 C13.1539009,6.10476087 13.8614009,6.38842087 14.4523009,6.84689087 C15.0431009,7.30537087 15.4935009,7.92028087 15.7525009,8.62185087 C16.0115009,9.32341087 16.0686009,10.0835009 15.9174009,10.8159009 C15.7661009,11.5483009 15.4126009,12.2236009 14.8969009,12.7652009 C14.3813009,13.3068009 13.7241009,13.6930009 13.0000009,13.8800009 L13.0000009,15.0000009 Z M12.0000009,18.2499934 C11.7528009,18.2499934 11.5111009,18.1767009 11.3055009,18.0393009 C11.1000009,17.9020009 10.9398009,17.7068009 10.8452009,17.4784009 C10.7505009,17.2499934 10.7258009,16.9986009 10.7740009,16.7561009 C10.8223009,16.5137009 10.9413009,16.2909009 11.1161009,16.1161009 C11.2909009,15.9413009 11.5137009,15.8223009 11.7561009,15.7740009 C11.9986009,15.7258009 12.2499934,15.7505009 12.4784009,15.8452009 C12.7068009,15.9398009 12.9020009,16.1000009 13.0393009,16.3055009 C13.1767009,16.5111009 13.2499934,16.7528009 13.2499934,17.0000009 C13.2499934,17.3315009 13.1183009,17.6495009 12.8839009,17.8839009 C12.6495009,18.1183009 12.3315009,18.2499934 12.0000009,18.2499934 Z"/>';

  function safeAttr(str) {
    return (str || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function brandLinkHTML(brandLink) {
    const href = safeAttr(brandLink || '/');
    return `
      <a href="${href}" class="au-wc-brand au-wc-brand--link" aria-label="Vlaanderen">
        <div class="au-wc-brand__logo">
          <svg role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19.61 31.05" aria-hidden="true">
            <title>Logo Vlaanderen</title>
            <path d="${LION_PATH}"/>
          </svg>
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

    _render() {
      const brandLink    = this.getAttribute('brand-link') || '/';
      const homeHref     = this.getAttribute('home-href') || '/';
      const appTitle     = this._escape(this.getAttribute('app-title') || '');
      const contactHref  = this.getAttribute('contact-href');
      const contactLabel = this._escape(this.getAttribute('contact-label') || 'Contacteer ons');

      const contactItem = contactHref ? `
        <li>
          <a href="${safeAttr(contactHref)}" class="au-wc-link au-wc-link--secondary">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="au-wc-icon" aria-hidden="true">${QUESTION_CIRCLE_PATH}</svg>
            ${contactLabel}
          </a>
        </li>
      ` : '';

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
