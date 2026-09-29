# Development Specification — Between Hands

Status: implementation plan, not a completion report.

## Stack and boundaries

Build a browser-delivered WebXR game using IWSDK for the spatial runtime/component system. Inspect the installed/current IWSDK APIs before implementation; do not infer APIs from old examples. Keep one runtime and one component system. TypeScript is the preferred implementation language.

Planned structure (adapt to the actual SDK scaffold, preserving boundaries):

```text
src/
  main.ts                 # Runtime composition and boot
  theme/tokens.ts         # Shared design constants
  game/                   # Pure progression and puzzle rules
  levels/                 # Declarative level definitions
  input/                  # Hand/controller/desktop adapters
  systems/                # Runtime systems and lifecycle integration
  scene/                  # Reusable world and spatial UI primitives
  audio/                  # Audio lifecycle and mute support
  ui/                     # Entry, supported-device and session UI
public/                   # Licensed or original static assets
scripts/                  # Reproducible local verification/build tooling
tests/                    # Meaningful rule and lifecycle checks
docs/                     # Specifications, evidence, submission materials
```

Prefer the SDK's conventions when its scaffold differs. One shared primitive implements repeated channels, targets, instructions, and restoration feedback; level files supply parameters. Do not add infrastructure without an immediate project requirement.

## State and interactions

Model boot, ready, playing, paused, level complete, and experience complete explicitly. Two hand-controlled intermediate points define a shared cubic Bezier water path; spherical rain-orb checkpoints use the internal `rings` field. Immersive watering requires both hands to be tracked and holding their handles. Persist validated completion state so a reload preserves a restored garden; do not resume active watering automatically. Puzzle state must not depend on renderer frame rate. Input adapters produce normalized intent for pure puzzle rules. A desktop adapter must exercise the same rules, with its limitations labeled.

Pinch/release semantics, tracked joint selection, smoothing, and hand identity must follow verified WebXR/IWSDK capabilities. Make smoothing time-based. Hand loss cancels or safely suspends the relevant gesture and clears stale intent. Reacquisition must not unexpectedly complete a puzzle or move water using an old position.

Pause freezes puzzle progression and time-sensitive effects. Resume preserves solved targets and level state. Handle session visibility loss, session end/reentry, resizing, and asset-load failure without duplicate listeners, duplicated worlds, or hidden ongoing progression. Make restart/reset deterministic.

## Delivery and quality gates

1. Clean installation, type checks, production build, and documented run commands succeed from this repository.
2. Pure rule tests cover real risks: target satisfaction, level transitions, invalid input, reset, and pause behavior. Avoid tests that merely restate constants.
3. Browser smoke checks exercise boot, start, level progression, failure messaging, mute, reset, and completion.
4. XR emulator checks exercise immersive entry, hand input paths where supported, tracking loss, and session lifecycle. Record what the emulator cannot prove.
5. Real Quest testing is required before claiming actual hand-tracking quality, device comfort, or device performance. If unavailable, retain explicit gaps; do not replace them with desktop claims.
6. Measure performance on the declared environment. Record frame timing and scene workload; reduce allocations and avoid per-frame scene reconstruction. Do not claim a headset frame-rate target has passed from a desktop measurement.
7. Publish to a stable HTTPS URL with a production build; verify assets, immersive capability detection, fallback messaging, and the public link without relying on a signed-in local session.
8. Create a public English demonstration under three minutes that honestly labels device/emulator footage. Verify the exported video and link, not just the script.

## Evidence discipline

Keep the commit or build identifier, environment, command/action, outcome, and date with verification evidence. A screenshot proves only its visible state. Tests do not prove eligibility, Start approval, public video availability, or final submission. Keep incomplete items in the handoff instead of hiding them behind aggregate pass counts.

Use Git for normal rollback; no packaged backup directories and no explicit checkpoints unless requested. Never include credentials or authentication artifacts in the repository. Track third-party licenses and the provenance of generated or imported assets.

Spatial menu actions activate on pointerdown (pinch onset), so a deliberately slow pinch is not rejected by the SDK 800 ms click-duration limit. Puzzle handles still require explicit release/regrab and both hands held.
