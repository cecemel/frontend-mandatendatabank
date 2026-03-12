/**
 * au-wc-content-header web component
 *
 * Shadow DOM port of ember-appuniversum's AuContentHeader.
 * Renders a hero section with a background picture and overlaid title.
 *
 * Attributes:
 *   title-part-one — string: first (light-weight) title line
 *   title-part-two — string: second (medium-weight) title line
 *   picture-size   — string: "large" (full-width bg, no clipping triangle)
 *
 * Slot (default): place an <img> or <picture> element here; it becomes
 * the background image of the section.
 *
 * Usage:
 *   <au-wc-content-header title-part-one="Vlaanderen" title-part-two="Mandatendatabank" picture-size="large">
 *     <img src="/banner.jpg" alt="">
 *   </au-wc-content-header>
 */

(function () {
  'use strict';

  const STYLES_URL = (function () {
    const src = document.currentScript && document.currentScript.src;
    return src ? src.replace(/\/[^/]+$/, '/styles.css') : 'web-components/styles.css';
  })();

  class AuWcContentHeader extends HTMLElement {
    static get observedAttributes() {
      return ['title-part-one', 'title-part-two', 'picture-size'];
    }

    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
      this._render();
    }

    attributeChangedCallback() {
      if (this.isConnected) this._render();
    }

    _render() {
      const titleOne    = this._escape(this.getAttribute('title-part-one') || '');
      const titleTwo    = this._escape(this.getAttribute('title-part-two') || '');
      const pictureSize = this.getAttribute('picture-size');
      const largeClass  = pictureSize === 'large' ? ' au-wc-content-header--large' : '';

      this.shadowRoot.innerHTML = `
        <link rel="stylesheet" href="${STYLES_URL}">
        <section aria-label="pagina introductie" class="au-wc-content-header${largeClass}">
          <picture class="au-wc-content-header__bg">
            <slot></slot>
          </picture>
          <div class="au-wc-content-header__wrapper">
            ${titleOne ? `<span class="au-wc-content-header__top">${titleOne}</span>` : ''}
            <br>
            ${titleTwo ? `<span class="au-wc-content-header__bottom">${titleTwo}</span>` : ''}
          </div>
        </section>
      `;
    }

    _escape(str) {
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    }
  }

  customElements.define('au-wc-content-header', AuWcContentHeader);
})();
