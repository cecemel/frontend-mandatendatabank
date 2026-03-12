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
 * Requires: utils.js
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
     <au-wc-card-header>
     ========================================================================== */

  class AuCardHeader extends HTMLElement {
    static get observedAttributes() {
      return ['badge-icon', 'badge-number', 'badge-skin', 'badge-size'];
    }

    connectedCallback() {
      this.classList.add('au-wc-card__header');
      this._updateBadge();
    }

    attributeChangedCallback() {
      if (this.isConnected) this._updateBadge();
    }

    async _updateBadge() {
      const seq    = (this._badgeSeq = (this._badgeSeq || 0) + 1);
      const icon   = this.getAttribute('badge-icon');
      const number = this.getAttribute('badge-number');
      const skin   = this.getAttribute('badge-skin');
      const size   = this.getAttribute('badge-size');

      // Fetch the icon before touching the DOM so concurrent calls can race
      // and the last one wins (stale calls bail out after the await).
      let svgHtml = null;
      if (icon) {
        svgHtml = await AuWc.makeSvgIcon(icon);
        if (this._badgeSeq !== seq || !this.isConnected) return;
      }

      // Remove any badge a previous (or concurrent) call may have inserted.
      const existing = this.querySelector('.__au-badge');
      if (existing) existing.remove();

      if (!icon && !number) return;

      const badge = document.createElement('span');
      badge.className = [
        'au-wc-badge',
        badgeSkinClass(skin),
        size === 'small' ? 'au-wc-badge--small' : '',
        '__au-badge',
      ].filter(Boolean).join(' ');
      badge.setAttribute('aria-hidden', 'true');

      if (svgHtml) {
        badge.innerHTML = svgHtml;
      } else {
        const num = document.createElement('span');
        num.className = 'au-wc-badge__number';
        num.textContent = number;
        badge.appendChild(num);
      }

      this.insertBefore(badge, this.firstChild);
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
      if (AuWc.boolAttr(this, 'expandable')) this._initExpandable();
    }

    attributeChangedCallback() {
      if (this.isConnected) this._updateClasses();
    }

    _updateClasses() {
      const size = this.getAttribute('size');
      this.className = [
        'au-wc-card',
        'au-wc-card--fill',
        size === 'small' ? 'au-wc-card--padding-small'
          : size === 'tiny'  ? 'au-wc-card--padding-tiny'
          : size === 'flush' ? null
          : 'au-wc-card--padding',
        AuWc.boolAttr(this, 'flex')        ? 'au-wc-card--flex'        : null,
        AuWc.boolAttr(this, 'expandable')  ? 'au-wc-card--expandable'  : null,
        AuWc.boolAttr(this, 'shadow')      ? 'au-wc-card--shadow'      : null,
        AuWc.boolAttr(this, 'divided')     ? 'au-wc-card--divided'     : null,
        AuWc.boolAttr(this, 'text-center') ? 'au-wc-card--text-center' : null,
        AuWc.boolAttr(this, 'standout')    ? 'au-wc-card--standout'    : null,
        ...AuWc.userClasses(this, 'au-wc-card'),
      ].filter(Boolean).join(' ');
    }

    _initExpandable() {
      if (this._expandableReady) return;
      this._expandableReady = true;

      this._expanded = AuWc.boolAttr(this, 'is-open-initially');
      const isShadow = AuWc.boolAttr(this, 'shadow');

      const header  = this.querySelector('au-wc-card-header');
      const content = this.querySelector('au-wc-card-content');
      if (!header) return;

      const clickable = document.createElement('div');
      clickable.className = 'au-wc-card__clickable';
      clickable.setAttribute('role', 'button');
      clickable.setAttribute('tabindex', '0');

      const toggle = document.createElement('button');
      toggle.className = 'au-wc-card__toggle';
      toggle.setAttribute('aria-hidden', 'true');
      toggle.setAttribute('tabindex', '-1');
      toggle.setAttribute('aria-expanded', this._expanded ? 'true' : 'false');

      const updateToggleIcon = async () => {
        const iconName = isShadow
          ? (this._expanded ? 'remove' : 'add')
          : (this._expanded ? 'nav-up' : 'nav-down');
        const svgHtml = await AuWc.makeSvgIcon(iconName, true);
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
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleToggle(); }
      });

      if (isShadow) {
        clickable.appendChild(toggle);
        clickable.appendChild(header);
      } else {
        clickable.appendChild(header);
        clickable.appendChild(toggle);
      }

      this.insertBefore(clickable, this.firstChild);
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
