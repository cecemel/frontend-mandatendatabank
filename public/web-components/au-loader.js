/**
 * au-wc-loader web component
 *
 * Light DOM port of ember-appuniversum's AuLoader.
 * The custom element host IS the loader div. An animation div is prepended;
 * the existing text content (from Ember's yielded block) follows naturally.
 *
 * Usage:
 *   <au-wc-loader>Aan het laden</au-wc-loader>
 *   <au-wc-loader class="au-u-margin-bottom-huge">Mandatarissen aan het laden</au-wc-loader>
 */

(function () {
  'use strict';

  class AuWcLoader extends HTMLElement {
    connectedCallback() {
      // Guard against double-init (e.g. element moved in DOM).
      if (this._ready) return;
      this._ready = true;

      this.setAttribute('role', 'status');

      // Preserve user classes (e.g. au-u-margin-bottom-huge).
      const userClasses = Array.from(this.classList)
        .filter(c => !c.startsWith('au-wc-loader'));

      this.className = ['au-wc-loader', ...userClasses].join(' ');

      // Prepend animation div; Ember appends text content after connectedCallback.
      const anim = document.createElement('div');
      anim.className = 'au-wc-loader__anim';
      anim.setAttribute('aria-hidden', 'true');
      this.insertBefore(anim, this.firstChild);
    }
  }

  customElements.define('au-wc-loader', AuWcLoader);
})();
