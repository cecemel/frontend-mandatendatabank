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
 *   flex          — boolean, row-layout header (badge + content side by side)
 *   divided       — boolean, border between header/content/footer
 *   shadow        — boolean, box-shadow instead of border
 *   standout      — boolean, light-gray background
 *   expandable    — boolean, collapsible card
 *   text-center   — boolean, centered text
 *   size          — string: "small" | "tiny" | "flush" (default: normal padding)
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

(function () {
  'use strict';

  /* ==========================================================================
     Icon loading — SVG files from icons/ directory.
     Source: ember-appuniversum/public/icons/
     ========================================================================== */

  const ICON_BASE_URL = (function () {
    const src = document.currentScript && document.currentScript.src;
    return src ? src.replace(/\/[^/]+$/, '/icons') : '/web-components/icons';
  })();

  const _iconCache = Object.create(null);

  function loadIcon(name) {
    if (!_iconCache[name]) {
      _iconCache[name] = fetch(`${ICON_BASE_URL}/${name}.svg`)
        .then(function (r) { return r.text(); })
        .then(function (text) {
          return text.replace(/<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
        });
    }
    return _iconCache[name];
  }

  function makeSvgIcon(name, large) {
    const sizeClass = large ? ' au-wc-icon--large' : '';
    return loadIcon(name).then(function (inner) {
      return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="au-wc-icon${sizeClass}" aria-hidden="true">${inner}</svg>`;
    });
  }

  /* ==========================================================================
     Badge helpers
     ========================================================================== */

  const BADGE_SKIN_CLASSES = {
    border:  'au-wc-badge--border',
    action:  'au-wc-badge--action',
    brand:   'au-wc-badge--brand',
    success: 'au-wc-badge--success',
    warning: 'au-wc-badge--warning',
    error:   'au-wc-badge--error',
  };

  function badgeSkinClass(skin) {
    return BADGE_SKIN_CLASSES[skin] || 'au-wc-badge--default';
  }

  /* ==========================================================================
     Shared utility: read a boolean attribute that accepts both:
       - presence:     <au-wc-card flex>
       - string true:  <au-wc-card flex="true">   (Ember @flex="true" style)
       - string false: <au-wc-card flex="false">
     ========================================================================== */

  function boolAttr(el, name) {
    const val = el.getAttribute(name);
    return val !== null && val !== 'false';
  }

  /* ==========================================================================
     <au-wc-card-header>

     The element itself becomes the .au-wc-card__header div.
     On connect, existing children are wrapped in a div so the badge can be
     prepended as :nth-child(1), pushing the content to :nth-child(2) — which
     matches the flex CSS that gives the content wrapper flex-grow: 2.
     ========================================================================== */

  class AuCardHeader extends HTMLElement {
    static get observedAttributes() {
      return ['badge-icon', 'badge-number', 'badge-skin', 'badge-size'];
    }

    connectedCallback() {
      this.classList.add('au-wc-card__header');
      // Badge is prepended as :nth-child(1).
      // The <div> wrapper that the template must supply becomes :nth-child(2),
      // which the flex CSS targets for flex-grow: 2.
      // We do NOT create the wrapper here because Ember renders children
      // after connectedCallback fires (the element is inserted first, then
      // children are appended), so any wrapper we create would be empty.
      this._updateBadge();
    }

    attributeChangedCallback() {
      // Only act after connectedCallback has run.
      if (this.isConnected) this._updateBadge();
    }

    async _updateBadge() {
      // Remove previous badge (if any).
      const existing = this.querySelector('.__au-badge');
      if (existing) existing.remove();

      const icon   = this.getAttribute('badge-icon');
      const number = this.getAttribute('badge-number');
      const skin   = this.getAttribute('badge-skin');
      const size   = this.getAttribute('badge-size');

      if (!icon && !number) return;

      const badge = document.createElement('span');
      badge.className = [
        'au-wc-badge',
        badgeSkinClass(skin),
        size === 'small' ? 'au-wc-badge--small' : '',
        '__au-badge',  // internal marker for re-render bookkeeping
      ].filter(Boolean).join(' ');
      badge.setAttribute('aria-hidden', 'true');

      if (icon) {
        const svgHtml = await makeSvgIcon(icon);
        badge.innerHTML = svgHtml;
      } else {
        const num = document.createElement('span');
        num.className = 'au-wc-badge__number';
        num.textContent = number;
        badge.appendChild(num);
      }

      // Prepend so badge is :nth-child(1); the template's <div> wrapper lands as :nth-child(2).
      if (this.isConnected) {
        this.insertBefore(badge, this.firstChild);
      }
    }
  }

  /* ==========================================================================
     <au-wc-card-content>

     The element itself becomes the .au-wc-card__content div.
     ========================================================================== */

  class AuCardContent extends HTMLElement {
    connectedCallback() {
      this.classList.add('au-wc-card__content');
    }
  }

  /* ==========================================================================
     <au-wc-card-footer>

     The element itself becomes the .au-wc-card__footer div.
     ========================================================================== */

  class AuCardFooter extends HTMLElement {
    connectedCallback() {
      this.classList.add('au-wc-card__footer');
    }
  }

  /* ==========================================================================
     <au-wc-card>

     The element itself becomes the <article class="au-wc-card ..."> wrapper.
     Handles:
       - CSS modifier classes from attributes
       - Expandable behaviour (toggle button + show/hide of content)
     ========================================================================== */

  class AuCard extends HTMLElement {
    static get observedAttributes() {
      return ['flex', 'divided', 'expandable', 'shadow', 'standout', 'text-center', 'size'];
    }

    connectedCallback() {
      this._updateClasses();

      if (boolAttr(this, 'expandable')) {
        this._initExpandable();
      }
    }

    attributeChangedCallback() {
      if (this.isConnected) this._updateClasses();
    }

    // ----- Class management -----

    _updateClasses() {
      const size = this.getAttribute('size');

      const auClasses = [
        'au-wc-card',
        'au-wc-card--fill',
        size === 'small' ? 'au-wc-card--padding-small'
          : size === 'tiny'  ? 'au-wc-card--padding-tiny'
          : size === 'flush' ? null
          : 'au-wc-card--padding',
        boolAttr(this, 'flex')        ? 'au-wc-card--flex'        : null,
        boolAttr(this, 'expandable')  ? 'au-wc-card--expandable'  : null,
        boolAttr(this, 'shadow')      ? 'au-wc-card--shadow'      : null,
        boolAttr(this, 'divided')     ? 'au-wc-card--divided'     : null,
        boolAttr(this, 'text-center') ? 'au-wc-card--text-center' : null,
        boolAttr(this, 'standout')    ? 'au-wc-card--standout'    : null,
      ].filter(Boolean);

      // Preserve any user-supplied classes (e.g. utility classes from the app).
      const userClasses = Array.from(this.classList)
        .filter(c => !c.startsWith('au-wc-card'));

      this.className = [...auClasses, ...userClasses].join(' ');
    }

    // ----- Expandable behaviour -----

    _initExpandable() {
      // Guard against double-init on attribute changes.
      if (this._expandableReady) return;
      this._expandableReady = true;

      this._expanded = boolAttr(this, 'is-open-initially');
      const isShadow = boolAttr(this, 'shadow');

      const header  = this.querySelector('au-wc-card-header');
      const content = this.querySelector('au-wc-card-content');

      if (!header) return;

      // Build clickable wrapper that houses the header + toggle button.
      const clickable = document.createElement('div');
      clickable.className = 'au-wc-card__clickable';
      clickable.setAttribute('role', 'button');
      clickable.setAttribute('tabindex', '0');

      // Toggle button (aria-hidden — the clickable div itself is the interactive region).
      const toggle = document.createElement('button');
      toggle.className = 'au-wc-card__toggle';
      toggle.setAttribute('aria-hidden', 'true');
      toggle.setAttribute('tabindex', '-1');
      toggle.setAttribute('aria-expanded', this._expanded ? 'true' : 'false');

      const updateToggleIcon = async () => {
        // Shadow cards: add/remove icons (left of header).
        // Regular cards: nav-up/nav-down arrows (right of header).
        const iconName = isShadow
          ? (this._expanded ? 'remove' : 'add')
          : (this._expanded ? 'nav-up' : 'nav-down');

        const svgHtml = await makeSvgIcon(iconName, true);
        toggle.innerHTML = [
          svgHtml,
          `<span class="au-wc-hidden-visually au-wc-card__toggle-false">Verberg</span>`,
          `<span class="au-wc-hidden-visually au-wc-card__toggle-true">Toon</span>`,
        ].join('');
      };

      updateToggleIcon();

      const handleToggle = () => {
        this._expanded = !this._expanded;
        toggle.setAttribute('aria-expanded', this._expanded ? 'true' : 'false');
        updateToggleIcon();
        if (content) content.hidden = !this._expanded;
        this.dispatchEvent(new CustomEvent('au-wc-card-toggle', {
          detail: { expanded: this._expanded },
          bubbles: true,
        }));
      };

      clickable.addEventListener('click', handleToggle);
      clickable.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleToggle();
        }
      });

      // Shadow: toggle left, then header.  Regular: header, then toggle right.
      if (isShadow) {
        clickable.appendChild(toggle);
        clickable.appendChild(header);
      } else {
        clickable.appendChild(header);
        clickable.appendChild(toggle);
      }

      this.insertBefore(clickable, this.firstChild);

      // Set initial content visibility.
      if (content) content.hidden = !this._expanded;
    }
  }

  /* ==========================================================================
     Register custom elements
     ========================================================================== */

  customElements.define('au-wc-card',         AuCard);
  customElements.define('au-wc-card-header',  AuCardHeader);
  customElements.define('au-wc-card-content', AuCardContent);
  customElements.define('au-wc-card-footer',  AuCardFooter);

})();
