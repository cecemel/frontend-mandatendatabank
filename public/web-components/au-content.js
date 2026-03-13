/**
 * au-wc-content web component
 *
 * Light DOM port of ember-appuniversum's AuContent.
 * The custom element host IS the content div.
 *
 * Attributes:
 *   skin — string: "small"
 *
 * Usage:
 *   <au-wc-content>
 *     <p>Body text</p>
 *   </au-wc-content>
 *   <au-wc-content skin="small">...</au-wc-content>
 */

import { userClasses } from './utils.js';

class AuWcContent extends HTMLElement {
  static get observedAttributes() { return ['skin']; }

  connectedCallback() { this._update(); }

  attributeChangedCallback() { if (this.isConnected) this._update(); }

  _update() {
    const skin    = this.getAttribute('skin');
    const classes = ['au-wc-content', ...userClasses(this, 'au-wc-content')];
    if (skin) classes.push(`au-wc-content--${skin}`);
    this.className = classes.join(' ');
  }
}

customElements.define('au-wc-content', AuWcContent);
