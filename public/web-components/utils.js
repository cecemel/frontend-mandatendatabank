/**
 * au-wc — shared utilities.
 *
 * Source directory is derived once from this module's own URL so every
 * component automatically resolves styles.css and icons/ correctly.
 *
 * Exports:
 *   stylesUrl              — absolute URL to styles.css
 *   iconBaseUrl            — absolute URL to the icons/ directory
 *   loadIcon(name)         — Promise<string>  raw inner SVG markup
 *   makeSvgIcon(name,large)— Promise<string>  full <svg class="au-wc-icon"> element
 *   boolAttr(el, name)     — boolean  reads presence/string boolean attribute
 *   escape(str)            — string   escapes HTML entities (attributes + text)
 *   userClasses(el,prefix) — string[] classes on el that do NOT start with prefix
 */

const _base = new URL('.', import.meta.url).href.replace(/\/$/, '');

const _iconCache = Object.create(null);

function fetchIconInnerSvg(name) {
  return fetch(`${iconBaseUrl}/${name}.svg`)
    .then((r) => r.text())
    .then((text) => text.replace(/<svg[^>]*>/, '').replace(/<\/svg>\s*$/, ''));
}

export const stylesUrl = `${_base}/styles.css`;
export const iconBaseUrl = `${_base}/icons`;

export function loadIcon(name) {
  if (!_iconCache[name]) {
    _iconCache[name] = fetchIconInnerSvg(name);
  }
  return _iconCache[name];
}

export function makeSvgIcon(name, large) {
  const classes = ['au-wc-icon'];
  if (large) classes.push('au-wc-icon--large');

  return loadIcon(name).then((inner) => {
    return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="${classes.join(' ')}" aria-hidden="true">${inner}</svg>`;
  });
}

export function boolAttr(el, name) {
  const val = el.getAttribute(name);
  return val !== null && val !== 'false';
}

export function escape(str) {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function userClasses(el, prefix) {
  return Array.from(el.classList).filter((c) => !c.startsWith(prefix));
}
