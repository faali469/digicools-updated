// Converts a hex color to the "H S% L%" triple our CSS variables expect
// (consumed as hsl(var(--primary)) etc. in globals.css).
export function hexToHslTriple(hex: string): string | null {
  const match = /^#?([a-f\d]{6})$/i.exec(hex.trim());
  if (!match) return null;

  const int = parseInt(match[1], 16);
  const r = ((int >> 16) & 255) / 255;
  const g = ((int >> 8) & 255) / 255;
  const b = (int & 255) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;

  if (max === min) return `0 0% ${Math.round(l * 100)}%`;

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h: number;
  switch (max) {
    case r:
      h = (g - b) / d + (g < b ? 6 : 0);
      break;
    case g:
      h = (b - r) / d + 2;
      break;
    default:
      h = (r - g) / d + 4;
  }
  h *= 60;

  return `${Math.round(h)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

// Derives the small set of CSS custom properties that carry a org's brand
// color through buttons, focus rings, the sidebar active state, and the
// gradient/glow effects used across the app shell. Returns null for an
// invalid hex so callers can fall back to the default theme untouched.
export function getBrandCssVars(hex: string): Record<string, string> | null {
  const triple = hexToHslTriple(hex);
  if (!triple) return null;

  const [h, sRaw, lRaw] = triple.split(" ");
  const s = sRaw.replace("%", "");
  const l = lRaw.replace("%", "");
  const lighter = `${h} ${s}% ${Math.min(100, Number(l) + 10)}%`;

  return {
    "--primary": triple,
    "--ring": triple,
    "--sidebar-primary": triple,
    "--sidebar-ring": triple,
    "--gradient-primary": `linear-gradient(135deg, hsl(${triple}), hsl(${lighter}))`,
    "--shadow-glow": `0 0 40px hsl(${triple} / 0.35)`,
  };
}
