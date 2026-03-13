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

import { escape, iconBaseUrl, loadIcon, stylesUrl } from './utils.js';

function brandLinkHTML(brandLink) {
  return `
    <a href="${escape(brandLink)}" class="au-wc-brand au-wc-brand--link" aria-label="Vlaanderen">
      <div class="au-wc-brand__logo">
        <img src="${iconBaseUrl}/vlaanderen-logo.svg" alt="Logo Vlaanderen" aria-hidden="true">
      </div>
      <p class="au-wc-brand__logotype">
        <span class="au-wc-brand__main">Vlaanderen</span>
      </p>
    </a>
  `;
}

async function buildContactItemHTML(href, label) {
  if (!href) return '';

  const iconInner = await loadIcon('question-circle');
  const iconSvg = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="au-wc-icon" aria-hidden="true">${iconInner}</svg>`;

  return `
    <li>
      <a href="${escape(href)}" class="au-wc-link au-wc-link--secondary">
        ${iconSvg}
        ${label}
      </a>
    </li>
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

  connectedCallback() { this._render(); }

  attributeChangedCallback() { if (this.isConnected) this._render(); }

  async _render() {
    const brandLink = this.getAttribute('brand-link') || '/';
    const homeHref = this.getAttribute('home-href') || '/';
    const appTitle = escape(this.getAttribute('app-title') || '');
    const contactHref = this.getAttribute('contact-href');
    const contactLabel = escape(this.getAttribute('contact-label') || 'Contacteer ons');

    const contactItem = await buildContactItemHTML(contactHref, contactLabel);
    if (!this.isConnected) return;

    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="${stylesUrl}">
      <header class="au-wc-main-header">
        <div class="au-wc-main-header__title-group">
          ${brandLinkHTML(brandLink)}
          <a href="${escape(homeHref)}" class="au-wc-main-header__title au-wc-main-header__title--link">
            ${appTitle}
          </a>
          <a href="#content" class="au-wc-main-header__skiplink">
            Naar de hoofdinhoud
          </a>
        </div>
        <nav aria-label="Informatie en instellingen" class="au-wc-main-header__actions">
          <ul class="au-wc-main-header__nav-list">
            ${contactItem}
            <li><slot></slot></li>
          </ul>
        </nav>
      </header>
    `;
  }
}

customElements.define('au-wc-main-header', AuWcMainHeader);
