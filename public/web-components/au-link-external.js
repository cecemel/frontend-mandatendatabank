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
 * Usage:
 *   <au-wc-link-external href="https://example.com">Link text</au-wc-link-external>
 *   <au-wc-link-external href="/file.csv" skin="button" icon="download" download>
 *     Download CSV
 *   </au-wc-link-external>
 */

(function () {
  'use strict';

  // Capture base URL while document.currentScript is still available.
  const STYLES_URL = (function () {
    const src = document.currentScript && document.currentScript.src;
    return src ? src.replace(/\/[^/]+$/, '/styles.css') : 'web-components/styles.css';
  })();

  /* ---------- Icon registry ---------- */

  const ICON_PATHS = {
    'download': '<path d="M11,2 L13,2 L13,14.08 L15.29,11.88 L16.7,13.24 L12,17.76 L7.29,13.24 L8.7,11.88 L11,14.08 L11,2 Z M2,20 L22,20 L22,22 L2,22 L2,20 Z"/>',
    'mail':     '<path d="M10.5,10.6611 L1.5,2.3958 L1.5,13.5 L19.5,13.5 L19.5,2.3958 L10.5,10.6611 Z M21,15 L0,15 L0,0 L21,0 L21,15 Z M18.2579,1.5 L2.74214,1.5 L10.5,8.6246 L18.2579,1.5 Z" transform="translate(1.5 4.5)" fill-rule="evenodd"/>',
    'nav-right':'<polygon points="8.499955 20.4 7.099955 19 14.100045 12 7.099955 5 8.499955 3.6 16.900045 12"/>',
  };

  function makeSvgIcon(name) {
    const path = ICON_PATHS[name];
    if (!path) return '';
    return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="au-wc-icon" aria-hidden="true">${path}</svg>`;
  }

  /* ---------- Skin → CSS class map ---------- */

  const SKIN_MAP = {
    'primary':          'au-wc-link',
    'secondary':        'au-wc-link au-wc-link--secondary',
    'bold':             'au-wc-link au-wc-link--bold',
    'button':           'au-wc-button au-wc-button--primary',
    'button-secondary': 'au-wc-button au-wc-button--secondary',
    'button-naked':     'au-wc-button au-wc-button--naked',
  };

  /* ---------- Helper ---------- */

  function boolAttr(el, name) {
    const val = el.getAttribute(name);
    return val !== null && val !== 'false';
  }

  /* ---------- Component ---------- */

  class AuWcLinkExternal extends HTMLElement {
    static get observedAttributes() {
      return ['href', 'skin', 'icon', 'icon-alignment', 'new-tab', 'width', 'download'];
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
      const href          = this.getAttribute('href') || '';
      const skin          = this.getAttribute('skin') || 'primary';
      const icon          = this.getAttribute('icon');
      const iconAlignment = this.getAttribute('icon-alignment') || 'left';
      const newTab        = !this.hasAttribute('new-tab') || boolAttr(this, 'new-tab');
      const width         = this.getAttribute('width');
      const isDownload    = this.hasAttribute('download');

      const skinClass  = SKIN_MAP[skin] || 'au-wc-link';
      const isButton   = skin.startsWith('button');
      const widthClass = width === 'block'
        ? (isButton ? 'au-wc-button--block' : 'au-wc-link--block')
        : '';

      const iconHtml   = icon ? makeSvgIcon(icon) : '';
      const iconLeft   = icon && iconAlignment !== 'right' ? iconHtml : '';
      const iconRight  = icon && iconAlignment === 'right' ? iconHtml : '';

      const targetAttr  = newTab ? ' target="_blank"' : '';
      const relAttr     = newTab ? ' rel="noopener noreferrer"' : '';
      const downloadAttr = isDownload ? ' download' : '';
      const safeHref    = href.replace(/"/g, '&quot;');

      const classes = [skinClass, widthClass].filter(Boolean).join(' ');

      this.shadowRoot.innerHTML = `
        <link rel="stylesheet" href="${STYLES_URL}">
        <a class="${classes}" href="${safeHref}"${targetAttr}${relAttr}${downloadAttr}>${iconLeft}<slot></slot>${iconRight}</a>
      `;
    }
  }

  customElements.define('au-wc-link-external', AuWcLinkExternal);
})();
