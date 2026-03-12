/**
 * au-wc — shared utilities.
 *
 * Must be loaded before all other au-wc-*.js scripts.
 * Source directory is derived once from this script's own URL so every
 * component automatically resolves styles.css and icons/ correctly.
 *
 * Exposes: window.AuWc
 *   .stylesUrl              — absolute URL to styles.css
 *   .iconBaseUrl            — absolute URL to the icons/ directory
 *   .loadIcon(name)         — Promise<string>  raw inner SVG markup
 *   .makeSvgIcon(name,large)— Promise<string>  full <svg class="au-wc-icon"> element
 *   .boolAttr(el, name)     — boolean  reads presence/string boolean attribute
 *   .escape(str)            — string   escapes HTML entities (attributes + text)
 *   .userClasses(el,prefix) — string[] classes on el that do NOT start with prefix
 */
(function () {
  'use strict';

  const _base = (function () {
    const src = document.currentScript && document.currentScript.src;
    return src ? src.replace(/\/[^/]+$/, '') : '/web-components';
  })();

  const _stylesUrl   = `${_base}/styles.css`;
  const _iconBaseUrl = `${_base}/icons`;
  const _iconCache   = Object.create(null);

  window.AuWc = {

    stylesUrl:   _stylesUrl,
    iconBaseUrl: _iconBaseUrl,

    loadIcon(name) {
      if (!_iconCache[name]) {
        _iconCache[name] = fetch(`${_iconBaseUrl}/${name}.svg`)
          .then((r) => r.text())
          .then((text) => text.replace(/<svg[^>]*>/, '').replace(/<\/svg>\s*$/, ''));
      }
      return _iconCache[name];
    },

    makeSvgIcon(name, large) {
      const cls = `au-wc-icon${large ? ' au-wc-icon--large' : ''}`;
      return this.loadIcon(name).then(
        (inner) => `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="${cls}" aria-hidden="true">${inner}</svg>`
      );
    },

    boolAttr(el, name) {
      const val = el.getAttribute(name);
      return val !== null && val !== 'false';
    },

    escape(str) {
      return (str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    },

    userClasses(el, prefix) {
      return Array.from(el.classList).filter((c) => !c.startsWith(prefix));
    },

  };
})();
