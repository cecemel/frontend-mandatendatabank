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

import { makeSvgIcon, userClasses } from './utils.js';

const SKIN_CLASSES = {
  border: 'au-wc-badge--border',
  action: 'au-wc-badge--action',
  brand: 'au-wc-badge--brand',
  success: 'au-wc-badge--success',
  warning: 'au-wc-badge--warning',
  error: 'au-wc-badge--error',
};

function buildClasses(skin, size, el) {
  const classes = [
    'au-wc-badge',
    SKIN_CLASSES[skin] || 'au-wc-badge--default',
    ...userClasses(el, 'au-wc-badge'),
  ];
  if (size === 'small') classes.push('au-wc-badge--small');
  return classes.join(' ');
}

class AuWcBadge extends HTMLElement {
  static get observedAttributes() {
    return ['skin', 'icon', 'number', 'size'];
  }

  connectedCallback() { this._scheduleUpdate(); }

  attributeChangedCallback() { if (this.isConnected) this._scheduleUpdate(); }

  // Defer rendering so all attributes are set before we read them.
  _scheduleUpdate() {
    clearTimeout(this._updateTimer);
    this._updateTimer = setTimeout(() => this._update(), 0);
  }

  async _update() {
    const skin = this.getAttribute('skin');
    const icon = this.getAttribute('icon');
    const number = this.getAttribute('number');
    const size = this.getAttribute('size');

    this.className = buildClasses(skin, size, this);
    this.setAttribute('aria-hidden', 'true');

    if (icon) {
      this.innerHTML = await makeSvgIcon(icon);
    } else if (number) {
      this.innerHTML = `<span class="au-wc-badge__number">${number}</span>`;
    }
  }
}

customElements.define('au-wc-badge', AuWcBadge);
