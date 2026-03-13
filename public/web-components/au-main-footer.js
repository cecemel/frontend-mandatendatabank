/**
 * au-wc-main-footer web component
 *
 * Shadow DOM port of ember-appuniversum's AuMainFooter.
 * Renders a footer with the Vlaanderen brand (tagline "verbeelding werkt")
 * and a slot for footer content (links, headings, etc.).
 *
 * Usage:
 *   <au-wc-main-footer>
 *     <au-wc-heading level="2" skin="4">Site title</au-wc-heading>
 *     <p>Footer content…</p>
 *   </au-wc-main-footer>
 */

import { iconBaseUrl, stylesUrl } from './utils.js';

function brandHTML() {
  return `
    <div class="au-wc-brand au-wc-brand--tagline">
      <div class="au-wc-brand__logo">
        <img src="${iconBaseUrl}/vlaanderen-logo.svg" alt="Logo Vlaanderen" aria-hidden="true">
      </div>
      <p class="au-wc-brand__logotype">
        <span class="au-wc-brand__main">Vlaanderen</span>
        <span class="au-wc-brand__tagline">verbeelding werkt</span>
      </p>
    </div>
  `;
}

class AuWcMainFooter extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="${stylesUrl}">
      <footer class="au-wc-main-footer">
        <div class="au-wc-main-footer__brand">
          ${brandHTML()}
        </div>
        <div class="au-wc-main-footer__content">
          <slot></slot>
        </div>
      </footer>
    `;
  }
}

customElements.define('au-wc-main-footer', AuWcMainFooter);
