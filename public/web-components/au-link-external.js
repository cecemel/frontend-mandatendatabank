/**
 * au-wc-link-external web component
 *
 * Shadow DOM port of ember-appuniversum's AuLinkExternal.
 * Renders a real <a> element with target="_blank" (default) and optional icon.
 *
 * Attributes:
 *   href            — string, the URL
 *   skin            — string: "primary" (default) | "secondary" | "bold" |
 *                             "button" | "button-secondary" | "button-naked"
 *   icon            — string: icon name (e.g. "download", "mail")
 *   icon-alignment  — string: "left" (default) | "right"
 *   new-tab         — boolean: default true; set new-tab="false" to open in same tab
 *   width           — string: "block"
 *   download        — boolean: mirrors download attribute onto the inner <a>
 *
 * Usage:
 *   <au-wc-link-external href="https://example.com">Link text</au-wc-link-external>
 *   <au-wc-link-external href="/file.csv" skin="button" icon="download" download>
 *     Download CSV
 *   </au-wc-link-external>
 */

import { boolAttr, escape, makeSvgIcon, stylesUrl } from './utils.js';

const SKIN_MAP = {
  'primary': 'au-wc-link',
  'secondary': 'au-wc-link au-wc-link--secondary',
  'bold': 'au-wc-link au-wc-link--bold',
  'button': 'au-wc-button au-wc-button--primary',
  'button-secondary': 'au-wc-button au-wc-button--secondary',
  'button-naked': 'au-wc-button au-wc-button--naked',
};

function blockWidthClass(width, isButton) {
  if (width !== 'block') return '';
  return isButton ? 'au-wc-button--block' : 'au-wc-link--block';
}

function buildAnchorAttributes(newTab, isDownload) {
  const attrs = [];
  if (newTab) {
    attrs.push('target="_blank"');
    attrs.push('rel="noopener noreferrer"');
  }
  if (isDownload) {
    attrs.push('download');
  }
  return attrs.join(' ');
}

function placeIcon(iconHtml, alignment) {
  if (!iconHtml) {
    return { left: '', right: '' };
  }
  if (alignment === 'right') {
    return { left: '', right: iconHtml };
  }
  return { left: iconHtml, right: '' };
}

class AuWcLinkExternal extends HTMLElement {
  static get observedAttributes() {
    return ['href', 'skin', 'icon', 'icon-alignment', 'new-tab', 'width', 'download'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() { this._render(); }

  attributeChangedCallback() { if (this.isConnected) this._render(); }

  async _render() {
    const href = this.getAttribute('href') || '';
    const skin = this.getAttribute('skin') || 'primary';
    const iconName = this.getAttribute('icon');
    const iconAlignment = this.getAttribute('icon-alignment') || 'left';
    const newTab = !this.hasAttribute('new-tab') || boolAttr(this, 'new-tab');
    const width = this.getAttribute('width');
    const isDownload = this.hasAttribute('download');

    const isButton = skin.startsWith('button');
    const skinClass = SKIN_MAP[skin] || 'au-wc-link';
    const classes = [skinClass, blockWidthClass(width, isButton)].filter(Boolean).join(' ');

    const iconHtml = iconName ? await makeSvgIcon(iconName) : '';
    if (!this.isConnected) return;

    const icon = placeIcon(iconHtml, iconAlignment);
    const anchorAttrs = buildAnchorAttributes(newTab, isDownload);

    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="${stylesUrl}">
      <a class="${classes}" href="${escape(href)}" ${anchorAttrs}>${icon.left}<slot></slot>${icon.right}</a>
    `;
  }
}

customElements.define('au-wc-link-external', AuWcLinkExternal);
