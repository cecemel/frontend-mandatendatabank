/**
 * au-wc-button web component
 *
 * Shadow DOM port of ember-appuniversum's AuButton.
 * Renders a native <button> with proper styling, optional icon, and loading state.
 *
 * Attributes:
 *   skin            — string: "primary" (default) | "secondary" | "naked" |
 *                              "link" | "link-secondary" | "link-bold"
 *   size            — string: "large"
 *   width           — string: "block"
 *   alert           — boolean: danger/alert styling
 *   disabled        — boolean: disables the button
 *   loading         — boolean: shows loading state (also disables)
 *   loading-message — string: accessible text during loading (default: "Aan het laden")
 *   icon            — string: icon name (e.g. "mail", "download")
 *   icon-alignment  — string: "left" (default) | "right"
 *   hide-text       — boolean: visually hides the text (icon-only button)
 *   wrap            — boolean: allow text wrapping
 *
 * Usage:
 *   <au-wc-button skin="primary" icon="mail">Send</au-wc-button>
 *   <au-wc-button skin="secondary" size="large" width="block">Choose</au-wc-button>
 *   <au-wc-button loading loading-message="Saving...">Save</au-wc-button>
 */

import { boolAttr, makeSvgIcon, stylesUrl } from './utils.js';

const SKINS = ['primary', 'secondary', 'naked', 'link', 'link-secondary', 'link-bold'];

class AuWcButton extends HTMLElement {
  static get observedAttributes() {
    return ['skin', 'size', 'width', 'alert', 'disabled', 'loading', 'loading-message', 'icon', 'icon-alignment', 'hide-text', 'wrap'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() { this._scheduleRender(); }

  attributeChangedCallback() { if (this.isConnected) this._scheduleRender(); }

  _scheduleRender() {
    clearTimeout(this._renderTimer);
    this._renderTimer = setTimeout(() => this._render(), 0);
  }

  async _render() {
    const skin = this.getAttribute('skin') || 'primary';
    const size = this.getAttribute('size');
    const width = this.getAttribute('width');
    const alert = boolAttr(this, 'alert');
    const disabled = this.hasAttribute('disabled');
    const loading = boolAttr(this, 'loading');
    const loadingMessage = this.getAttribute('loading-message') || 'Aan het laden';
    const iconName = this.getAttribute('icon');
    const iconAlignment = this.getAttribute('icon-alignment') || 'left';
    const hideText = boolAttr(this, 'hide-text');
    const wrap = boolAttr(this, 'wrap');

    const validSkin = SKINS.includes(skin) ? skin : 'primary';
    const isLink = validSkin.startsWith('link');
    const isDisabled = disabled || loading;

    const classes = [
      'au-wc-button',
      `au-wc-button--${validSkin}`,
      size === 'large' && !isLink ? 'au-wc-button--large' : '',
      width === 'block' ? 'au-wc-button--block' : '',
      alert ? 'au-wc-button--alert' : '',
      isDisabled ? 'is-disabled' : '',
      loading ? 'is-loading' : '',
      iconName && hideText ? 'au-wc-button--icon-only' : '',
      wrap ? 'au-wc-button--wrap' : '',
    ].filter(Boolean).join(' ');

    // Build icon HTML
    let leftIcon = '';
    let rightIcon = '';
    if (iconName && !loading) {
      const iconHtml = await makeSvgIcon(iconName);
      if (!this.isConnected) return;
      if (iconAlignment === 'right') {
        rightIcon = iconHtml;
      } else {
        leftIcon = iconHtml;
      }
    }

    // Build inner content
    let content;
    if (hideText) {
      if (loading) {
        content = `<span class="au-wc-hidden-visually">${loadingMessage}</span><span class="au-wc-loading-animation" aria-hidden="true"></span>`;
      } else {
        content = `<span class="au-wc-hidden-visually"><slot></slot></span>`;
      }
    } else {
      if (loading) {
        content = `${loadingMessage}<span class="au-wc-loading-animation" aria-hidden="true"></span>`;
      } else {
        content = `<slot></slot>`;
      }
    }

    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="${stylesUrl}">
      <style>:host { display: contents; }</style>
      <button class="${classes}" type="button" ${isDisabled ? 'disabled' : ''}>${leftIcon}${content}${rightIcon}</button>
    `;
  }
}

customElements.define('au-wc-button', AuWcButton);
