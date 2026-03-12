/**
 * au-wc-badge web component
 *
 * Light DOM port of ember-appuniversum's AuBadge (standalone use).
 * The custom element host IS the badge span.
 *
 * Note: The card-internal badge is handled inside au-card.js.
 * This element is for standalone badges (e.g. in organisation-card).
 *
 * Attributes:
 *   skin   — string: "action" | "brand" | "success" | "warning" | "error" | "border"
 *   icon   — string: icon name (e.g. "users", "check", "download")
 *   number — string/number: numeric content (used when no icon)
 *   size   — string: "small"
 *
 * Usage:
 *   <au-wc-badge skin="brand" icon="users"></au-wc-badge>
 */

(function () {
  'use strict';

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

  function makeSvgIcon(name) {
    return loadIcon(name).then(function (inner) {
      return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="au-wc-icon" aria-hidden="true">${inner}</svg>`;
    });
  }

  const SKIN_CLASSES = {
    border:  'au-wc-badge--border',
    action:  'au-wc-badge--action',
    brand:   'au-wc-badge--brand',
    success: 'au-wc-badge--success',
    warning: 'au-wc-badge--warning',
    error:   'au-wc-badge--error',
  };

  class AuWcBadge extends HTMLElement {
    static get observedAttributes() {
      return ['skin', 'icon', 'number', 'size'];
    }

    connectedCallback() {
      this._update();
    }

    attributeChangedCallback() {
      if (this.isConnected) this._update();
    }

    async _update() {
      const skin   = this.getAttribute('skin');
      const icon   = this.getAttribute('icon');
      const number = this.getAttribute('number');
      const size   = this.getAttribute('size');

      const userClasses = Array.from(this.classList)
        .filter(c => !c.startsWith('au-wc-badge'));

      this.className = [
        'au-wc-badge',
        SKIN_CLASSES[skin] || 'au-wc-badge--default',
        size === 'small' ? 'au-wc-badge--small' : '',
        ...userClasses,
      ].filter(Boolean).join(' ');

      this.setAttribute('aria-hidden', 'true');

      if (icon) {
        const svgHtml = await makeSvgIcon(icon);
        if (this.isConnected && this.getAttribute('icon') === icon) {
          this.innerHTML = svgHtml;
        }
      } else if (number) {
        this.innerHTML = `<span class="au-wc-badge__number">${number}</span>`;
      }
    }
  }

  customElements.define('au-wc-badge', AuWcBadge);
})();
