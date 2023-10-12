export function dropPrefix(colorStr) {
  return colorStr.replace('#', '');
}

export function toNum3(colorStr) {
  colorStr = dropPrefix(colorStr);
  if (colorStr.length === 3) {
    colorStr =
      colorStr[0] +
      colorStr[0] +
      colorStr[1] +
      colorStr[1] +
      colorStr[2] +
      colorStr[2];
  }
  const r = parseInt(colorStr.slice(0, 2), 16);
  const g = parseInt(colorStr.slice(2, 4), 16);
  const b = parseInt(colorStr.slice(4, 6), 16);
  return [r, g, b];
}

export function pad2(num) {
  let t = num.toString(16);
  if (t.length === 1) t = `0${t}`;
  return t;
}

export function mix(color1, color2, weight1, alpha1, alpha2) {
  color1 = dropPrefix(color1);
  color2 = dropPrefix(color2);
  if (weight1 === undefined) weight1 = 0.5;
  if (alpha1 === undefined) alpha1 = 1;
  if (alpha2 === undefined) alpha2 = 1;

  const w = 2 * weight1 - 1;
  const alphaDelta = alpha1 - alpha2;
  const w1 =
    ((w * alphaDelta === -1 ? w : (w + alphaDelta) / (1 + w * alphaDelta)) +
      1) /
    2;
  const w2 = 1 - w1;

  const rgb1 = toNum3(color1);
  const rgb2 = toNum3(color2);
  const r = Math.round(w1 * rgb1[0] + w2 * rgb2[0]);
  const g = Math.round(w1 * rgb1[1] + w2 * rgb2[1]);
  const b = Math.round(w1 * rgb1[2] + w2 * rgb2[2]);
  return `#${pad2(r)}${pad2(g)}${pad2(b)}`;
}

export function lighten(colorStr, weight) {
  return mix('fff', colorStr, weight);
}

export function darken(colorStr, weight) {
  return mix('000', colorStr, weight);
}

export function rgbaToRgb(colorStr, alpha, bgColorStr) {
  return mix(colorStr, bgColorStr || 'fff', 0.5, alpha, 1 - alpha);
}

export function rgbToHsl(r, g, b) {
  const rR = r / 255;
  const rG = g / 255;
  const rB = b / 255;

  const max = Math.max(rR, rG, rB);
  const min = Math.min(rR, rG, rB);
  const delta = max - min;
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (Math.abs(delta) > 0.00001) {
    if (l <= 0.5) s = delta / (max + min);
    else s = delta / (2 - max - min);
    const rDist = (max - rR) / delta;
    const gDist = (max - rG) / delta;
    const bDist = (max - rB) / delta;
    if (rR === max) {
      h = bDist - gDist;
    } else if (rG === max) {
      h = 2 + rDist - bDist;
    } else {
      h = 4 + gDist - rDist;
    }
    h *= 60;
    if (h < 0) h += 360;
  }
  return [h, s, l];
}

export function rrggbbToHsl(rrggbb) {
  const rgb = toNum3(rrggbb);
  const hsl = rgbToHsl.apply(0, rgb);
  return [
    hsl[0].toFixed(0),
    `${(hsl[1] * 100).toFixed(3)}%`,
    `${(hsl[2] * 100).toFixed(3)}%`,
  ].join(',');
}