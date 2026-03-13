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

import { escape, stylesUrl } from './utils.js';

function sectionClasses(pictureSize) {
  const classes = ['au-wc-content-header'];
  if (pictureSize === 'large') classes.push('au-wc-content-header--large');
  return classes.join(' ');
}

function titleSpan(cssClass, text) {
  if (!text) return '';
  return `<span class="${cssClass}">${text}</span>`;
}

class AuWcContentHeader extends HTMLElement {
  static get observedAttributes() {
    return ['title-part-one', 'title-part-two', 'picture-size'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() { this._render(); }

  attributeChangedCallback() { if (this.isConnected) this._render(); }

  _render() {
    const titleOne  = escape(this.getAttribute('title-part-one') || '');
    const titleTwo  = escape(this.getAttribute('title-part-two') || '');
    const picSize   = this.getAttribute('picture-size');

    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="${stylesUrl}">
      <section aria-label="pagina introductie" class="${sectionClasses(picSize)}">
        <picture class="au-wc-content-header__bg">
          <slot></slot>
        </picture>
        <div class="au-wc-content-header__wrapper">
          <div class="au-wc-layout">
            ${titleSpan('au-wc-content-header__top', titleOne)}
            <br>
            ${titleSpan('au-wc-content-header__bottom', titleTwo)}
          </div>
        </div>
      </section>
    `;
  }
}

customElements.define('au-wc-content-header', AuWcContentHeader);
