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

  const ICON_PATHS = {
    'check':    '<polygon points="21.207115 6.353545 8.499995 19.060665 2.792885 13.353565 4.207095 11.939365 8.499995 16.232265 19.792915 4.939335"/>',
    'download': '<path d="M11,2 L13,2 L13,14.08 L15.29,11.88 L16.7,13.24 L12,17.76 L7.29,13.24 L8.7,11.88 L11,14.08 L11,2 Z M2,20 L22,20 L22,22 L2,22 L2,20 Z"/>',
    'users':    '<path d="M10,4 C7.79086,4 6,5.79086 6,8 C6,10.2091 7.79086,12 10,12 C12.2091,12 14,10.2091 14,8 C14,5.79086 12.2091,4 10,4 Z M4,8 C4,4.68629 6.68629,2 10,2 C13.3137,2 16,4.68629 16,8 C16,11.3137 13.3137,14 10,14 C6.68629,14 4,11.3137 4,8 Z M16.8284,3.75736 C17.219,3.36683 17.8521,3.36683 18.2426,3.75736 C20.5858,6.1005 20.5858,9.8995 18.2426,12.2426 C17.8521,12.6332 17.219,12.6332 16.8284,12.2426 C16.4379,11.8521 16.4379,11.219 16.8284,10.8284 C18.3905,9.26633 18.3905,6.73367 16.8284,5.17157 C16.4379,4.78105 16.4379,4.14788 16.8284,3.75736 Z M17.5299,16.7575 C17.6638,16.2217 18.2067,15.8959 18.7425,16.0299 C20.0705,16.3618 20.911,17.2109 21.3944,18.1778 C21.8622,19.1133 22,20.1571 22,21 C22,21.5523 21.5523,22 21,22 C20.4477,22 20,21.5523 20,21 C20,20.3429 19.8878,19.6367 19.6056,19.0722 C19.339,18.5391 18.9295,18.1382 18.2575,17.9701 C17.7217,17.8362 17.3959,17.2933 17.5299,16.7575 Z M6.5,18 C5.24054,18 4,19.2135 4,21 C4,21.5523 3.55228,22 3,22 C2.44772,22 2,21.5523 2,21 C2,18.3682 3.89347,16 6.5,16 L13.5,16 C16.1065,16 18,18.3682 18,21 C18,21.5523 17.5523,22 17,22 C16.4477,22 16,21.5523 16,21 C16,19.2135 14.7595,18 13.5,18 L6.5,18 Z"/>',
  };

  function makeSvgIcon(name) {
    const path = ICON_PATHS[name];
    if (!path) return '';
    return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="au-wc-icon" aria-hidden="true">${path}</svg>`;
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

    _update() {
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
        this.innerHTML = makeSvgIcon(icon);
      } else if (number) {
        this.innerHTML = `<span class="au-wc-badge__number">${number}</span>`;
      }
    }
  }

  customElements.define('au-wc-badge', AuWcBadge);
})();
