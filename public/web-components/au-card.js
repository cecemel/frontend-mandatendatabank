/**
 * au-wc-card web component
 *
 * A faithful port of ember-appuniversum's AuCard compound component.
 * Requires styles.css (in this same folder) to be loaded on the page.
 *
 * Elements registered:
 *   <au-wc-card>         — the card wrapper  (replaces <AuCard>)
 *   <au-wc-card-header>  — header section    (replaces <c.header>)
 *   <au-wc-card-content> — content section   (replaces <c.content>)
 *   <au-wc-card-footer>  — footer section    (replaces <c.footer>)
 *
 * Usage:
 *   <au-wc-card flex divided>
 *     <au-wc-card-header badge-skin="brand" badge-icon="download">
 *       <h2>Title</h2>
 *     </au-wc-card-header>
 *     <au-wc-card-content>
 *       Body text here.
 *     </au-wc-card-content>
 *   </au-wc-card>
 *
 * au-wc-card attributes:
 *   flex              — boolean, row-layout header (badge + content side by side)
 *   divided           — boolean, border between header/content/footer
 *   shadow            — boolean, box-shadow instead of border
 *   standout          — boolean, light-gray background
 *   expandable        — boolean, collapsible card
 *   text-center       — boolean, centered text
 *   size              — string: "small" | "tiny" | "flush" (default: normal padding)
 *   is-open-initially — boolean, start expanded (only meaningful with expandable)
 *
 * au-wc-card-header attributes:
 *   badge-icon    — string, icon name (e.g. "check", "download")
 *   badge-number  — string/number, shows a number inside the badge
 *   badge-skin    — string: "action" | "brand" | "success" | "warning" | "error" | "border"
 *   badge-size    — string: "small"
 *
 * Boolean attributes accept presence (flex) or explicit values (flex="true" / flex="false").
 */

import { boolAttr, makeSvgIcon, userClasses } from './utils.js';

/* ==========================================================================
   Badge helpers
   ========================================================================== */

const BADGE_SKIN_CLASSES = {
  border: 'au-wc-badge--border',
  action: 'au-wc-badge--action',
  brand: 'au-wc-badge--brand',
  success: 'au-wc-badge--success',
  warning: 'au-wc-badge--warning',
  error: 'au-wc-badge--error',
};

function badgeSkinClass(skin) {
  return BADGE_SKIN_CLASSES[skin] || 'au-wc-badge--default';
}

/* ==========================================================================
   Card helpers
   ========================================================================== */

function paddingClass(size) {
  if (size === 'small') return 'au-wc-card--padding-small';
  if (size === 'tiny') return 'au-wc-card--padding-tiny';
  if (size === 'flush') return null;
  return 'au-wc-card--padding';
}

// Returns the CSS class if the boolean attribute is set, otherwise null.
function boolClass(el, attr, cls) {
  return boolAttr(el, attr) ? cls : null;
}

function ariaExpanded(isExpanded) {
  return isExpanded ? 'true' : 'false';
}

function toggleIconName(isShadow, isExpanded) {
  if (isShadow) {
    return isExpanded ? 'remove' : 'add';
  }
  return isExpanded ? 'nav-up' : 'nav-down';
}

/* ==========================================================================
   <au-wc-card-header>
   ========================================================================== */

class AuCardHeader extends HTMLElement {
  static get observedAttributes() {
    return ['badge-icon', 'badge-number', 'badge-skin', 'badge-size'];
  }

  connectedCallback() {
    this.classList.add('au-wc-card__header');
    this._scheduleBadgeUpdate();
  }

  attributeChangedCallback() {
    if (this.isConnected) this._scheduleBadgeUpdate();
  }

  // Ember sets all badge-* attributes in the same synchronous render pass,
  // which fires attributeChangedCallback once per attribute. Deferring to
  // the next tick lets all attributes settle before we touch the DOM.
  _scheduleBadgeUpdate() {
    clearTimeout(this._badgeTimer);
    this._badgeTimer = setTimeout(() => this._updateBadge(), 0);
  }

  async _updateBadge() {
    const icon = this.getAttribute('badge-icon');
    const number = this.getAttribute('badge-number');
    const skin = this.getAttribute('badge-skin');
    const size = this.getAttribute('badge-size');

    const existing = this.querySelector('.__au-badge');
    if (existing) existing.remove();

    if (!icon && !number) return;

    const badge = this._buildBadgeElement(skin, size);

    if (icon) {
      badge.innerHTML = await makeSvgIcon(icon);
      if (!this.isConnected) return;
    } else {
      badge.appendChild(this._buildNumberSpan(number));
    }

    this.insertBefore(badge, this.firstChild);
  }

  _buildBadgeElement(skin, size) {
    const badge = document.createElement('span');
    const classes = ['au-wc-badge', badgeSkinClass(skin), '__au-badge'];
    if (size === 'small') classes.push('au-wc-badge--small');
    badge.className = classes.join(' ');
    badge.setAttribute('aria-hidden', 'true');
    return badge;
  }

  _buildNumberSpan(number) {
    const span = document.createElement('span');
    span.className = 'au-wc-badge__number';
    span.textContent = number;
    return span;
  }
}

/* ==========================================================================
   <au-wc-card-content>
   ========================================================================== */

class AuCardContent extends HTMLElement {
  connectedCallback() { this.classList.add('au-wc-card__content'); }
}

/* ==========================================================================
   <au-wc-card-footer>
   ========================================================================== */

class AuCardFooter extends HTMLElement {
  connectedCallback() { this.classList.add('au-wc-card__footer'); }
}

/* ==========================================================================
   <au-wc-card>
   ========================================================================== */

class AuCard extends HTMLElement {
  static get observedAttributes() {
    return ['flex', 'divided', 'expandable', 'shadow', 'standout', 'text-center', 'size'];
  }

  connectedCallback() {
    this._updateClasses();
    if (boolAttr(this, 'expandable')) this._initExpandable();
  }

  attributeChangedCallback() {
    if (this.isConnected) this._updateClasses();
  }

  _updateClasses() {
    this.className = [
      'au-wc-card',
      'au-wc-card--fill',
      paddingClass(this.getAttribute('size')),
      boolClass(this, 'flex', 'au-wc-card--flex'),
      boolClass(this, 'expandable', 'au-wc-card--expandable'),
      boolClass(this, 'shadow', 'au-wc-card--shadow'),
      boolClass(this, 'divided', 'au-wc-card--divided'),
      boolClass(this, 'text-center', 'au-wc-card--text-center'),
      boolClass(this, 'standout', 'au-wc-card--standout'),
      ...userClasses(this, 'au-wc-card'),
    ].filter(Boolean).join(' ');
  }

  _initExpandable() {
    if (this._expandableReady) return;
    this._expandableReady = true;

    this._expanded = boolAttr(this, 'is-open-initially');
    const isShadow = boolAttr(this, 'shadow');

    const header = this.querySelector('au-wc-card-header');
    const content = this.querySelector('au-wc-card-content');
    if (!header) return;

    const toggle = this._buildToggleButton();
    const clickable = this._buildClickableWrapper(isShadow, header, toggle);

    this._updateToggleIcon(toggle, isShadow);

    clickable.addEventListener('click', () => {
      this._handleToggle(toggle, content, isShadow);
    });

    clickable.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this._handleToggle(toggle, content, isShadow);
      }
    });

    this.insertBefore(clickable, this.firstChild);
    if (content) content.hidden = !this._expanded;
  }

  _buildToggleButton() {
    const toggle = document.createElement('button');
    toggle.className = 'au-wc-card__toggle';
    toggle.setAttribute('aria-hidden', 'true');
    toggle.setAttribute('tabindex', '-1');
    toggle.setAttribute('aria-expanded', ariaExpanded(this._expanded));
    return toggle;
  }

  _buildClickableWrapper(isShadow, header, toggle) {
    const clickable = document.createElement('div');
    clickable.className = 'au-wc-card__clickable';
    clickable.setAttribute('role', 'button');
    clickable.setAttribute('tabindex', '0');

    if (isShadow) {
      clickable.appendChild(toggle);
      clickable.appendChild(header);
    } else {
      clickable.appendChild(header);
      clickable.appendChild(toggle);
    }

    return clickable;
  }

  async _updateToggleIcon(toggle, isShadow) {
    const iconName = toggleIconName(isShadow, this._expanded);
    const svgHtml = await makeSvgIcon(iconName, true);
    toggle.innerHTML = [
      svgHtml,
      `<span class="au-wc-hidden-visually au-wc-card__toggle-false">Verberg</span>`,
      `<span class="au-wc-hidden-visually au-wc-card__toggle-true">Toon</span>`,
    ].join('');
  }

  _handleToggle(toggle, content, isShadow) {
    this._expanded = !this._expanded;
    toggle.setAttribute('aria-expanded', ariaExpanded(this._expanded));
    this._updateToggleIcon(toggle, isShadow);
    if (content) content.hidden = !this._expanded;
    this.dispatchEvent(new CustomEvent('au-wc-card-toggle', {
      detail: { expanded: this._expanded },
      bubbles: true,
    }));
  }
}

/* ==========================================================================
   Register custom elements
   ========================================================================== */

customElements.define('au-wc-card', AuCard);
customElements.define('au-wc-card-header', AuCardHeader);
customElements.define('au-wc-card-content', AuCardContent);
customElements.define('au-wc-card-footer', AuCardFooter);
