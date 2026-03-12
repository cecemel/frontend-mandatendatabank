/**
 * au-wc-link-external web component
 *
 * Shadow DOM port of ember-appuniversum's AuLinkExternal.
 * Renders a real <a> element with target="_blank" (default) and optional icon.
 *
 * Attributes:
 *   href            — string, the URL
 *   skin            — string: "primary" (default) | "secondary" | "bold" |
 *                             "button" | "button-secondary" | "button-naked"
 *   icon            — string: icon name (e.g. "download", "mail")
 *   icon-alignment  — string: "left" (default) | "right"
 *   new-tab         — boolean: default true; set new-tab="false" to open in same tab
 *   width           — string: "block"
 *   download        — boolean: mirrors download attribute onto the inner <a>
 *
 * Requires: utils.js
 *
 * Usage:
 *   <au-wc-link-external href="https://example.com">Link text</au-wc-link-external>
 *   <au-wc-link-external href="/file.csv" skin="button" icon="download" download>
 *     Download CSV
 *   </au-wc-link-external>
 */

(function () {
  'use strict';

  const SKIN_MAP = {
    'primary':          'au-wc-link',
    'secondary':        'au-wc-link au-wc-link--secondary',
    'bold':             'au-wc-link au-wc-link--bold',
    'button':           'au-wc-button au-wc-button--primary',
    'button-secondary': 'au-wc-button au-wc-button--secondary',
    'button-naked':     'au-wc-button au-wc-button--naked',
  };

  class AuWcLinkExternal extends HTMLElement {
    static get observedAttributes() {
      return ['href', 'skin', 'icon', 'icon-alignment', 'new-tab', 'width', 'download'];
    }

    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }

    connectedCallback() { this._render(); }

    attributeChangedCallback() { if (this.isConnected) this._render(); }

    async _render() {
      const href          = this.getAttribute('href') || '';
      const skin          = this.getAttribute('skin') || 'primary';
      const icon          = this.getAttribute('icon');
      const iconAlignment = this.getAttribute('icon-alignment') || 'left';
      const newTab        = !this.hasAttribute('new-tab') || AuWc.boolAttr(this, 'new-tab');
      const width         = this.getAttribute('width');
      const isDownload    = this.hasAttribute('download');

      const skinClass  = SKIN_MAP[skin] || 'au-wc-link';
      const isButton   = skin.startsWith('button');
      const widthClass = width === 'block'
        ? (isButton ? 'au-wc-button--block' : 'au-wc-link--block')
        : '';

      const iconHtml  = icon ? await AuWc.makeSvgIcon(icon) : '';
      const iconLeft  = icon && iconAlignment !== 'right' ? iconHtml : '';
      const iconRight = icon && iconAlignment === 'right' ? iconHtml : '';

      if (!this.isConnected) return;

      const classes      = [skinClass, widthClass].filter(Boolean).join(' ');
      const targetAttr   = newTab ? ' target="_blank"' : '';
      const relAttr      = newTab ? ' rel="noopener noreferrer"' : '';
      const downloadAttr = isDownload ? ' download' : '';
      const safeHref     = AuWc.escape(href);

      this.shadowRoot.innerHTML = `
        <link rel="stylesheet" href="${AuWc.stylesUrl}">
        <a class="${classes}" href="${safeHref}"${targetAttr}${relAttr}${downloadAttr}>${iconLeft}<slot></slot>${iconRight}</a>
      `;
    }
  }

  customElements.define('au-wc-link-external', AuWcLinkExternal);
})();
