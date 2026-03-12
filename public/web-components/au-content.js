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

(function () {
  'use strict';

  class AuWcContent extends HTMLElement {
    static get observedAttributes() {
      return ['skin'];
    }

    connectedCallback() {
      this._update();
    }

    attributeChangedCallback() {
      if (this.isConnected) this._update();
    }

    _update() {
      const skin = this.getAttribute('skin');

      const userClasses = Array.from(this.classList)
        .filter(c => !c.startsWith('au-wc-content'));

      this.className = [
        'au-wc-content',
        skin ? `au-wc-content--${skin}` : '',
        ...userClasses,
      ].filter(Boolean).join(' ');
    }
  }

  customElements.define('au-wc-content', AuWcContent);
})();
