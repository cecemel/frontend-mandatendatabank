/**
 * au-wc-content web component
 *
 * Light DOM port of ember-appuniversum's AuContent.
 * The custom element host IS the content div.
 *
 * Attributes:
 *   skin — string: "small"
 *
 * Requires: utils.js
 *
 * Usage:
 *   <au-wc-content>
 *     <p>Body text</p>
 *   </au-wc-content>
 *   <au-wc-content skin="small">...</au-wc-content>
 */

(function () {
  'use strict';

  class AuWcContent extends HTMLElement {
    static get observedAttributes() { return ['skin']; }

    connectedCallback() { this._update(); }

    attributeChangedCallback() { if (this.isConnected) this._update(); }

    _update() {
      const skin    = this.getAttribute('skin');
      const classes = ['au-wc-content', ...AuWc.userClasses(this, 'au-wc-content')];
      if (skin) classes.push(`au-wc-content--${skin}`);
      this.className = classes.join(' ');
    }
  }

  customElements.define('au-wc-content', AuWcContent);
})();
