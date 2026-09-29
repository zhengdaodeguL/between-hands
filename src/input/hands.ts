import type { World } from '@iwsdk/core';
import { Group, Vector3 } from 'three';
import { CONTROL_BOUNDS, type Controls, type Vec3 } from '../game/puzzle';

type Side = 'left' | 'right';
type HandDiagnostic = Readonly<{ position: Vec3 | null; distance: number; armed: boolean }>;
type GestureEvent = { source: XRInputSource; down: boolean };
const SIDES: readonly Side[] = ['left', 'right'];
const GRAB_DISTANCE = 0.07;
const OPEN_DISTANCE = 0.035;
const SMOOTHING_SECONDS = 0.045;

/** Raw hand adapter: geometry changes occur only inside IWSDK's live XR-frame callback.
 * Spatial UI sits outside CONTROL_BOUNDS; grab proximity and bounds exclude UI pinches.
 */
export function createHandInput(
  world: World,
  root: Group,
  getControls: () => Controls,
  onChange: (side: Side, point: Vec3) => void,
): { tracked: Record<Side, boolean>; held: Record<Side, boolean>; readonly diagnostics: Readonly<Record<Side, HandDiagnostic>>; dispose(): void; reset(): void } {
  const tracked = { left: false, right: false };
  const held = { left: false, right: false };
  const armed = { left: false, right: false };
  const diagnostics: Record<Side, HandDiagnostic> = {
    left: Object.freeze({ position: null, distance: -1, armed: false }),
    right: Object.freeze({ position: null, distance: -1, armed: false }),
  };
  const sources: Partial<Record<Side, XRInputSource>> = {};
  const positions = { left: new Vector3(), right: new Vector3() };
  const smooth = { left: new Vector3(), right: new Vector3() };
  const offsets = { left: new Vector3(), right: new Vector3() };
  const events: GestureEvent[] = [];
  let session: XRSession | null = null;
  let disposed = false;

  function reset(): void {
    events.length = 0;
    for (const side of SIDES) {
      diagnostics[side] = Object.freeze({ position: null, distance: -1, armed: false });
      tracked[side] = false;
      held[side] = false;
      armed[side] = false;
      delete sources[side];
    }
  }
  function enqueue(event: XRInputSourceEvent): void {
    if (!event.inputSource.hand || event.defaultPrevented) return;
    events.push({ source: event.inputSource, down: event.type === 'selectstart' });
  }
  function bindSession(next: XRSession | null): void {
    if (session === next) return;
    session?.removeEventListener('selectstart', enqueue);
    session?.removeEventListener('selectend', enqueue);
    session?.removeEventListener('inputsourceschange', reset);
    reset();
    session = next;
    session?.addEventListener('selectstart', enqueue);
    session?.addEventListener('selectend', enqueue);
    session?.addEventListener('inputsourceschange', reset);
  }
  function sessionStarted(): void { bindSession(world.renderer.xr.getSession()); }
  function sessionEnded(): void { bindSession(null); }
  world.renderer.xr.addEventListener('sessionstart', sessionStarted);
  world.renderer.xr.addEventListener('sessionend', sessionEnded);
  bindSession(world.renderer.xr.getSession());

  const stopFrame = world.onXRFrame((frame, delta) => {
    if (disposed) return;
    if (session !== frame.session) bindSession(frame.session);
    const referenceSpace = world.xrReferenceSpace;
    for (const side of SIDES) tracked[side] = false;
    if (!referenceSpace || !frame.getJointPose || frame.session.visibilityState !== 'visible') {
      reset();
      return;
    }
    root.updateWorldMatrix(true, false);
    world.player.updateWorldMatrix(true, false);
    for (const source of frame.session.inputSources) {
      const side = source.handedness;
      if ((side !== 'left' && side !== 'right') || !source.hand) continue;
      const indexSpace = source.hand.get('index-finger-tip');
      const thumbSpace = source.hand.get('thumb-tip');
      if (!indexSpace || !thumbSpace) continue;
      const index = frame.getJointPose(indexSpace, referenceSpace);
      const thumb = frame.getJointPose(thumbSpace, referenceSpace);
      if (!index || !thumb) continue;
      const a = index.transform.position;
      const b = thumb.transform.position;
      if (![a.x, a.y, a.z, b.x, b.y, b.z].every(Number.isFinite)) continue;
      if (sources[side] !== source) { held[side] = false; armed[side] = false; sources[side] = source; }
      tracked[side] = true;
      positions[side].set((a.x + b.x) / 2, (a.y + b.y) / 2, (a.z + b.z) / 2);
      world.player.localToWorld(positions[side]);
      root.worldToLocal(positions[side]);
      // An observed open hand is a physical release, including after tracking recovery.
      if (Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z) > OPEN_DISTANCE) {
        held[side] = false;
        armed[side] = true;
      }
    }
    for (const side of SIDES) {
      if (!tracked[side]) { held[side] = false; armed[side] = false; delete sources[side]; }
    }
    for (const event of events.splice(0)) {
      const side = event.source.handedness;
      if ((side !== 'left' && side !== 'right') || sources[side] !== event.source || !tracked[side]) continue;
      if (!event.down) { held[side] = false; armed[side] = true; continue; }
      const canStart = armed[side];
      armed[side] = false;
      if (!canStart) continue;
      const position = positions[side];
      const inBounds = position.toArray().every((value, axis) => value >= CONTROL_BOUNDS.min[axis]! && value <= CONTROL_BOUNDS.max[axis]!);
      smooth[side].fromArray(getControls()[side]);
      if (!inBounds || position.distanceTo(smooth[side]) >= GRAB_DISTANCE) continue;
      offsets[side].copy(smooth[side]).sub(position);
      held[side] = true;
    }
    for (const side of SIDES) {
      const p = positions[side];
      const control = getControls()[side];
      const position: Vec3 | null = tracked[side] ? Object.freeze([p.x, p.y, p.z] as const) : null;
      diagnostics[side] = Object.freeze({
        position,
        distance: position ? Math.hypot(p.x-control[0], p.y-control[1], p.z-control[2]) : -1,
        armed: armed[side],
      });
    }
    const safeDelta = Number.isFinite(delta) ? Math.max(0, Math.min(delta, 0.05)) : 0;
    const alpha = 1 - Math.exp(-safeDelta / SMOOTHING_SECONDS);
    for (const side of SIDES) {
      if (!tracked[side] || !held[side]) continue;
      const target = positions[side].add(offsets[side]);
      target.set(
        Math.max(CONTROL_BOUNDS.min[0], Math.min(CONTROL_BOUNDS.max[0], target.x)),
        Math.max(CONTROL_BOUNDS.min[1], Math.min(CONTROL_BOUNDS.max[1], target.y)),
        Math.max(CONTROL_BOUNDS.min[2], Math.min(CONTROL_BOUNDS.max[2], target.z)),
      );
      smooth[side].lerp(target, alpha);
      onChange(side, [smooth[side].x, smooth[side].y, smooth[side].z]);
    }
  });
  return {
    tracked, held, reset, get diagnostics() { return Object.freeze({ ...diagnostics }); },
    dispose(): void {
      if (disposed) return;
      disposed = true;
      stopFrame();
      world.renderer.xr.removeEventListener('sessionstart', sessionStarted);
      world.renderer.xr.removeEventListener('sessionend', sessionEnded);
      bindSession(null);
      reset();
    },
  };
}


