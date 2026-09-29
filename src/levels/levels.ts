import { bezierPoint, type Controls, type LevelDefinition, type Vec3 } from '../game/puzzle';
export type { Vec3, LevelDefinition } from '../game/puzzle';
const source: Vec3 = [-0.23, 0.19, 0];
const target: Vec3 = [0.23, -0.13, 0];
const initialControls: Controls = { left: [-0.10, 0.09, 0], right: [0.10, -0.04, 0] };
function ring(controls: Controls, t: number, radius: number) {
  return { center: bezierPoint(source, controls.left, controls.right, target, t), radius };
}
const first: Controls = { left: [-0.13, 0.16, 0.12], right: [0.12, -0.07, 0.12] };
const second: Controls = { left: [-0.20, 0.02, -0.16], right: [0.18, 0.16, -0.14] };
const third: Controls = { left: [-0.16, 0.21, 0.17], right: [0.18, -0.15, -0.17] };
/** Solutions are authoring/test references. Never apply them automatically during play. */
export const LEVELS: readonly LevelDefinition[] = [
  {
    id: 'wake-the-seed', title: 'Wake the Seed',
    instruction: 'Lift both rain handles toward you. Guide the stream around the stone and through the rain ring.',
    source, target, initialControls, solvedControls: first,
    rocks: [{ center: [0, 0.03, 0], radius: 0.045 }],
    rings: [ring(first, 0.5, 0.025)],
  },
  {
    id: 'share-the-rain', title: 'Share the Rain',
    instruction: 'Reach gently away. Lower your left hand and lift your right to thread both rain rings.',
    source, target, initialControls, solvedControls: second,
    rocks: [{ center: [0, 0.03, 0], radius: 0.051 }],
    rings: [ring(second, 0.30, 0.018), ring(second, 0.72, 0.018)],
  },
  {
    id: 'bring-the-garden-home', title: 'Bring the Garden Home',
    instruction: 'One hand near, one hand far. Shape a twisting rain path between the stones.',
    source, target, initialControls, solvedControls: third,
    rocks: [{ center: [-0.105, 0.105, 0], radius: 0.033 }, { center: [0.115, -0.055, 0], radius: 0.033 }],
    rings: [ring(third, 0.27, 0.017), ring(third, 0.73, 0.017)],
  },
];
