/**
 * au-wc-heading web component
 *
 * Light DOM port of ember-appuniversum's AuHeading.
 * The custom element host IS the heading — no inner wrapper created.
 *
 * Attributes:
 *   level — string: "1"–"6", sets aria-level and default visual size
 *   skin  — string: "1"–"6" | "functional", overrides visual size only
 *
 * Usage:
 *   <au-wc-heading level="2" skin="4">Title</au-wc-heading>
 */

import { userClasses } from './utils.js';

class AuWcHeading extends HTMLElement {
  static get observedAttributes() { return ['level', 'skin']; }

  connectedCallback() { this._update(); }

  attributeChangedCallback() { if (this.isConnected) this._update(); }

  _update() {
    const level   = this.getAttribute('level') || '1';
    const skin    = this.getAttribute('skin') || level;
    const classes = ['au-wc-heading', `au-wc-heading--${skin}`, ...userClasses(this, 'au-wc-heading')];

    this.setAttribute('role', 'heading');
    this.setAttribute('aria-level', level);
    this.className = classes.join(' ');
  }
}

customElements.define('au-wc-heading', AuWcHeading);
