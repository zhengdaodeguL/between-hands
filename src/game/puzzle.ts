export type Vec3 = readonly [number, number, number];
export interface Controls { left: Vec3; right: Vec3 }
export interface Sphere { center: Vec3; radius: number }
export interface LevelDefinition {
  id: string;
  title: string;
  instruction: string;
  source: Vec3;
  target: Vec3;
  initialControls: Controls;
  solvedControls: Controls;
  rocks: readonly Sphere[];
  rings: readonly Sphere[];
}
export const CONTROL_BOUNDS = { min: [-0.28, -0.18, -0.18], max: [0.28, 0.25, 0.18] } as const;
export const WATER_RADIUS = 0.003;
export const HOLD_SECONDS = 2;
const finiteVec = (v: Vec3): boolean => v.length === 3 && v.every(Number.isFinite);
export function controlsInBounds(controls: Controls): boolean {
  return [controls.left, controls.right].every(v => finiteVec(v) && v.every((n, i) => n >= CONTROL_BOUNDS.min[i]! && n <= CONTROL_BOUNDS.max[i]!));
}
export function bezierPoint(source: Vec3, left: Vec3, right: Vec3, target: Vec3, t: number): Vec3 {
  const u = 1 - t;
  return [0, 1, 2].map(i => u ** 3 * source[i]! + 3 * u * u * t * left[i]! + 3 * u * t * t * right[i]! + t ** 3 * target[i]!) as unknown as Vec3;
}
/** Shared polyline for evaluation and scene rendering. Includes both endpoints. */
export function samplePath(level: LevelDefinition, controls: Controls, segments = 96): Vec3[] {
  if (!Number.isInteger(segments) || segments < 1 || segments > 4096) throw new RangeError('segments must be an integer from 1 to 4096');
  return Array.from({ length: segments + 1 }, (_, i) => bezierPoint(level.source, controls.left, controls.right, level.target, i / segments));
}
function segmentDistanceSquared(point: Vec3, a: Vec3, b: Vec3): number {
  const delta = b.map((n, i) => n - a[i]!);
  const lengthSquared = delta.reduce((sum, n) => sum + n * n, 0);
  const dot = delta.reduce((sum, n, i) => sum + (point[i]! - a[i]!) * n, 0);
  const t = lengthSquared === 0 ? 0 : Math.max(0, Math.min(1, dot / lengthSquared));
  return point.reduce((sum, n, i) => sum + (n - a[i]! - t * delta[i]!) ** 2, 0);
}
function touches(points: readonly Vec3[], sphere: Sphere, padding = 0): boolean {
  const radiusSquared = (sphere.radius + padding) ** 2;
  return points.slice(1).some((point, i) => segmentDistanceSquared(sphere.center, points[i]!, point) <= radiusSquared);
}
export interface PathEvaluation { valid: boolean; blocked: boolean; ringsHit: boolean[]; reason: string }
export function evaluatePath(level: LevelDefinition, controls: Controls): PathEvaluation {
  if (!controlsInBounds(controls)) return { valid: false, blocked: false, ringsHit: level.rings.map(() => false), reason: 'Bring both hands back into the garden.' };
  const points = samplePath(level, controls);
  const blocked = level.rocks.some(rock => touches(points, rock, WATER_RADIUS));
  const ringsHit = level.rings.map(ring => touches(points, ring));
  const valid = !blocked && ringsHit.every(Boolean);
  return { valid, blocked, ringsHit, ...{ reason: blocked ? 'Guide the rain around the stone.' : !ringsHit.every(Boolean) ? 'Thread the rain through every rain ring.' : 'Hold steady. The garden is drinking.' } };
}
export interface Progress { holdSeconds: number; complete: boolean }
export function createProgress(): Progress { return { holdSeconds: 0, complete: false }; }
/** dt is active elapsed seconds. Inactive (paused/untracked) frames freeze; invalid active frames reset the hold. */
export function stepProgress(progress: Progress, dt: number, valid: boolean, active: boolean): Progress {
  if (!Number.isFinite(dt) || dt < 0) throw new RangeError('dt must be finite nonnegative seconds');
  if (progress.complete || !active) return { ...progress };
  if (!valid) return createProgress();
  const holdSeconds = Math.min(HOLD_SECONDS, progress.holdSeconds + dt);
  return { holdSeconds, complete: holdSeconds >= HOLD_SECONDS - 1e-9 };
}
