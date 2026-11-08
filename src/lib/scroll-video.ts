/** Clamp scroll position before translating it to a seekable video timestamp. */
export function scrollVideoTime(progress: number, duration: number) {
  if (!Number.isFinite(duration) || duration <= 0) return 0;
  return Math.max(0, Math.min(1, progress)) * Math.max(0, duration - 0.04);
}