import assert from 'node:assert/strict';
import test from 'node:test';
import { createProgress, stepProgress, evaluatePath, samplePath, controlsInBounds, type LevelDefinition } from '../src/game/puzzle';
import { LEVELS } from '../src/levels/levels';
for (const level of LEVELS) {
  test(`${level.id}: authored solution works; initial and one-hand-only positions do not`, () => {
    assert.equal(controlsInBounds(level.solvedControls), true);
    assert.equal(evaluatePath(level, level.solvedControls).valid, true);
    assert.equal(evaluatePath(level, level.initialControls).valid, false);
    assert.equal(evaluatePath(level, { left: level.solvedControls.left, right: level.initialControls.right }).valid, false);
    assert.equal(evaluatePath(level, { left: level.initialControls.left, right: level.solvedControls.right }).valid, false);
    const flat = { left: [level.solvedControls.left[0], level.solvedControls.left[1], 0] as const, right: [level.solvedControls.right[0], level.solvedControls.right[1], 0] as const };
    assert.equal(evaluatePath(level, flat).valid, false, 'depth must matter');
  });
}
test('shared path includes exact source/target and rejects broken sampling requests', () => {
  const level = LEVELS[0]!;
  const path = samplePath(level, level.solvedControls);
  assert.equal(path.length, 97);
  assert.deepEqual(path[0], level.source);
  assert.deepEqual(path.at(-1), level.target);
  assert.throws(() => samplePath(level, level.solvedControls, 0), RangeError);
});
test('collision checks line segments between samples, including water thickness', () => {
  const level: LevelDefinition = { ...LEVELS[0]!, source: [-0.2, 0, 0], target: [0.2, 0, 0], rings: [], rocks: [{ center: [0.002, 0.002, 0], radius: 0.0001 }] };
  assert.equal(evaluatePath(level, { left: [-0.1, 0, 0], right: [0.1, 0, 0] }).blocked, true);
});
test('out-of-range and nonfinite hand input never counts as a valid path', () => {
  const level = LEVELS[0]!;
  for (const x of [0.281, -0.281, NaN, Infinity]) {
    assert.equal(evaluatePath(level, { left: [x, 0, 0], right: level.solvedControls.right }).valid, false);
  }
});
test('completion needs two valid active seconds; interruptions do not accumulate time', () => {
  const initial = createProgress();
  let progress = stepProgress(initial, 0.9, true, true);
  assert.deepEqual(initial, { holdSeconds: 0, complete: false });
  assert.deepEqual(stepProgress(progress, 100, false, false), progress, 'pause/tracking loss freezes');
  progress = stepProgress(progress, 0.1, false, true);
  assert.deepEqual(progress, createProgress(), 'invalid geometry resets continuous hold');
  for (let i = 0; i < 119; i++) progress = stepProgress(progress, 1 / 60, true, true);
  assert.equal(progress.complete, false);
  progress = stepProgress(progress, 1 / 60, true, true);
  assert.equal(progress.complete, true);
  assert.deepEqual(stepProgress(progress, 1, false, true), progress, 'completed garden remains restored');
  assert.deepEqual(createProgress(), initial, 'reset is deterministic');
});
test('time integration is frame-rate independent and rejects invalid time', () => {
  let thirty = createProgress();
  let ninety = createProgress();
  for (let i = 0; i < 30; i++) thirty = stepProgress(thirty, 1 / 30, true, true);
  for (let i = 0; i < 90; i++) ninety = stepProgress(ninety, 1 / 90, true, true);
  assert.ok(Math.abs(thirty.holdSeconds - ninety.holdSeconds) < 1e-9);
  for (const dt of [-1, NaN, Infinity]) assert.throws(() => stepProgress(createProgress(), dt, true, true), RangeError);
});
