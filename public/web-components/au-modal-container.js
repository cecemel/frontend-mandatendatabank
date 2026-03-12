/**
 * au-wc-modal-container web component
 *
 * Light DOM port of ember-appuniversum's AuModalContainer.
 * Sets the data-au-modal-container attribute that the modal system targets.
 *
 * Usage:
 *   <au-wc-modal-container></au-wc-modal-container>
 */

(function () {
  'use strict';

  class AuWcModalContainer extends HTMLElement {
    connectedCallback() {
      this.setAttribute('data-au-modal-container', '');
    }
  }

  customElements.define('au-wc-modal-container', AuWcModalContainer);
})();
