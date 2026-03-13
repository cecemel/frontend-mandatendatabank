/**
 * au-wc-help-text web component
 *
 * Light DOM port of ember-appuniversum's AuHelpText.
 * The custom element host IS the help-text span.
 *
 * Attributes:
 *   skin — string: "normal" | "large" | "secondary" | "tertiary" | "error" | "warning"
 *
 * Usage:
 *   <au-wc-help-text>Helper message</au-wc-help-text>
 *   <au-wc-help-text skin="error">Required field</au-wc-help-text>
 */

import { userClasses } from './utils.js';

class AuWcHelpText extends HTMLElement {
  static get observedAttributes() { return ['skin']; }

  connectedCallback() { this._update(); }

  attributeChangedCallback() { if (this.isConnected) this._update(); }

  _update() {
    const skin    = this.getAttribute('skin');
    const classes = ['au-wc-help-text', ...userClasses(this, 'au-wc-help-text')];
    if (skin) classes.push(`au-wc-help-text--${skin}`);
    this.className = classes.join(' ');
  }
}

customElements.define('au-wc-help-text', AuWcHelpText);
