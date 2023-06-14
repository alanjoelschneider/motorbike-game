export const TWO_PI = Math.PI * 2;
export const TO_DEGREES = 180 / Math.PI;
export const TO_RADIANS = Math.PI / 180;

export function normalize(value: number, min: number, max: number) {
  return (value - min) / (max - min);
}

export function lerp(t: number, min: number, max: number) {
  return (max - min) * t + min;
}

export function map(value: number, sMin: number, sMax: number, dMin: number, dMax: number) {
  const t = (value - sMin) / (sMax - sMin);
  return (dMax - dMin) * t + dMin;
}

export function vectorFromAngle(angle: number, length: number) {
  return { x: Math.cos(angle) * length, y: Math.sin(angle) * length };
}

export function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(value, max));
}

export function clamp01(value: number) {
  return Math.max(0, Math.min(value, 1));
}

export function roundToPlaces(float: number, places: number) {
  const mult = Math.pow(10, places);
  return ~~(float * mult) / mult;
}

// For get float numbers set step to a float value. Example: step = 0.1
export function random(min: number, max: number, step: number = 1) {
  return ~~(Math.random() * ((max - min) / step + 1)) * step + min;
}

export function randomPick(array: any[]) {
  return array[~~(Math.random() * array.length)];
}
