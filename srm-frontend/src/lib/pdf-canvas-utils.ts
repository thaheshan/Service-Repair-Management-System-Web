/**
 * Sanitizes a cloned document so html2canvas can render it correctly.
 *
 * Root cause: Tailwind v4 uses oklch() / oklab() / color-mix() color values.
 * html2canvas has its own CSS parser that doesn't support these modern color
 * functions and throws errors when it encounters them.
 *
 * Strategy:
 *  1. Use a hidden <canvas> to let the BROWSER convert oklch → sRGB hex.
 *     (Canvas fillStyle setter accepts any CSS color; getter returns hex.)
 *  2. Apply those resolved hex values as inline styles on each cloned element
 *     so html2canvas uses them instead of the stylesheet values.
 *  3. Re-read every stylesheet via cssRules, replace any remaining oklch
 *     patterns with safe hex fallbacks, and inject as <style> tags into the
 *     cloned head — replacing the original <link> elements that pointed to
 *     files containing oklch.
 */
export function sanitizeCloneForPDF(clonedDoc: Document): void {
  /* ------------------------------------------------------------------ */
  /* 1.  Canvas for browser-native oklch → hex conversion                */
  /* ------------------------------------------------------------------ */
  const cvs = document.createElement('canvas');
  cvs.width = 1;
  cvs.height = 1;
  const ctx = cvs.getContext('2d');

  const resolveColor = (val: string, fallback: string): string => {
    if (ctx) {
      try {
        ctx.fillStyle = '#000000'; // reset
        ctx.fillStyle = val;       // browser parses oklch
        return ctx.fillStyle;      // returns sRGB hex
      } catch {
        // Browser rejected the value – use fallback
      }
    }
    return fallback;
  };

  const isBadColor = (v: string): boolean =>
    !!(v && (v.includes('oklch') || v.includes('oklab') || v.includes('color-mix') || v.includes('lab(')));

  /* ------------------------------------------------------------------ */
  /* 2.  Apply resolved inline styles on cloned elements                 */
  /* ------------------------------------------------------------------ */
  const origEls = document.body.getElementsByTagName('*');
  const cloneEls = clonedDoc.body.getElementsByTagName('*');
  const len = Math.min(origEls.length, cloneEls.length);

  for (let i = 0; i < len; i++) {
    const origEl = origEls[i] as HTMLElement;
    const cloneEl = cloneEls[i] as HTMLElement;
    if (origEl.tagName !== cloneEl.tagName) continue;

    const cs = window.getComputedStyle(origEl);

    // Background
    const bg = cs.backgroundColor;
    if (isBadColor(bg)) cloneEl.style.backgroundColor = resolveColor(bg, '#ffffff');

    // Text color
    const color = cs.color;
    if (isBadColor(color)) cloneEl.style.color = resolveColor(color, '#000000');

    // Border colors
    (['borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor'] as const).forEach((prop) => {
      const val = (cs as any)[prop] as string;
      if (isBadColor(val)) (cloneEl.style as any)[prop] = resolveColor(val, '#e5e7eb');
    });

    // SVG / misc
    (['fill', 'stroke', 'outlineColor'] as const).forEach((prop) => {
      const val = (cs as any)[prop] as string;
      if (isBadColor(val)) (cloneEl.style as any)[prop] = resolveColor(val, '#000000');
    });

    // Box shadow
    if (isBadColor(cs.boxShadow)) cloneEl.style.boxShadow = 'none';

    // Background image (gradients)
    if (isBadColor(cs.backgroundImage)) cloneEl.style.backgroundImage = 'none';
  }

  /* ------------------------------------------------------------------ */
  /* 3.  Sanitize CSS stylesheets (cssRules read synchronously)          */
  /* ------------------------------------------------------------------ */
  const safeStyleEls: HTMLStyleElement[] = [];

  try {
    for (let i = 0; i < document.styleSheets.length; i++) {
      const sheet = document.styleSheets[i];
      const ownerNode = sheet.ownerNode as HTMLElement | null;
      let cssText = '';

      if (ownerNode && ownerNode.tagName?.toLowerCase() === 'style') {
        cssText = ownerNode.innerHTML;
      } else {
        try {
          for (let j = 0; j < sheet.cssRules.length; j++) {
            cssText += sheet.cssRules[j].cssText + '\n';
          }
        } catch {
          // Cross-origin sheet — skip
          continue;
        }
      }

      // Replace oklch/oklab FIRST so color-mix no longer has nested parens,
      // then replace color-mix.  Use paren-free hex values to keep the regex
      // simple (no nested parens to worry about after step 1).
      cssText = cssText
        .replace(/oklch\([^)]+\)/g, '#000')
        .replace(/oklab\([^)]+\)/g, '#000')
        .replace(/color-mix\([^)]+\)/g, '#000')
        .replace(/lab\([^)]+\)/g, '#000');

      const styleEl = clonedDoc.createElement('style');
      styleEl.innerHTML = cssText;
      safeStyleEls.push(styleEl);
    }
  } catch {
    // Ignore any unexpected error reading stylesheets
  }

  /* ------------------------------------------------------------------ */
  /* 4.  Replace <link rel="stylesheet"> and <style> in clone <head>    */
  /* ------------------------------------------------------------------ */
  const heads = clonedDoc.getElementsByTagName('head');
  if (heads.length > 0) {
    const head = heads[0];

    // Remove same-origin stylesheet links from the clone
    Array.from(head.getElementsByTagName('link')).forEach((l) => {
      if (l.rel === 'stylesheet') {
        try {
          const url = new URL(l.href, window.location.href);
          if (url.origin === window.location.origin) l.remove();
        } catch {
          // Ignore invalid hrefs
        }
      }
    });

    // Remove existing <style> elements (they may contain unsanitized oklch)
    Array.from(head.getElementsByTagName('style')).forEach((s) => s.remove());

    // Inject sanitized stylesheets
    safeStyleEls.forEach((s) => head.appendChild(s));
  }
}
