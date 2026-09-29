# Between Hands — Devpost Draft

**DRAFT — NOT SUBMITTED. ELIGIBILITY NOT CONFIRMED.**

Start membership is pending. Historical Developer Access eligibility is unresolved; an authorized inquiry has been sent to the organizer. The public repository and HTTPS app are published and verified. YouTube publication has been deferred by the entrant; the final video is ready locally. Resolve these items before personally submitting the entry.

## Submission fields

**Track:** Gaming  
**Division:** New Experience  
**Suggested target launch date:** 2026-11-10 for the WebXR release, subject to hardware validation. This is a provisional planning proposal, not an entrant-approved commitment. The public prototype launched on 2026-09-29; the entrant should confirm or revise the planned release date before submitting.

These are draft field values, not a submitted entry or a confirmed launch commitment.

## Elevator pitch

Hold a small storm between your hands. Shape rain around stones and through glowing orbs to bring a miniature garden back to life.

## Inspiration

We wanted a spatial puzzle in which the player's hands make the solution visible. Water provides a continuous explanation: change the shape, see where it flows, and watch the garden respond.

## What it does

Between Hands is a seated WebXR puzzle with three chapters. A round left handle and diamond right handle shape a rain path between a cloud and a garden. The stream must avoid stones and cross every glowing rain orb. In immersive mode, both hands must hold their handles while a valid stream waters the garden for two seconds.

The first chapter introduces depth, the second adds two checkpoints, and the third asks the player to twist the stream between two stones. Pause, reset, recenter, sound controls, and a saved completion state support repeat play. A desktop rehearsal exposes the same puzzle through position sliders.

## How it is built

The project uses TypeScript, IWSDK, Three.js, and WebXR hand input. A cubic Bezier curve connects the source, two hand-controlled points, and destination. Shared sampling drives the visual path and geometry checks. Pure puzzle rules are separated from rendering and hand tracking; immutable progression tracks active watering time.

## What is verified

Nine tests (eight puzzle tests and one parser-boundary test), type checks, and the clean cloud production build have passed. Browser UI testing completed all three chapters in desktop rehearsal, checked pause/resume, and confirmed finished-state restoration after reload. IWER testing also exercised both hands through all three chapters, tracking recovery, and the spatial menu.

Real Quest hand tracking, comfort and performance, and the target first-play duration remain unverified. Desktop rehearsal is not evidence of hand-tracking quality.

## Next steps

Complete device validation and YouTube publication. A 65.03-second English silent demonstration is prepared; the actual IWER gameplay is explicitly slowed to one-third speed for clarity. Confirm Start membership and competition eligibility before submission.

**App URL:** https://zhengdaodegul.github.io/between-hands/ — verified 2026-09-29.  
**Source URL:** https://github.com/zhengdaodeguL/between-hands — verified 2026-09-29.  
**Video URL:** Deferred by the entrant; no public URL yet.  
**Submission:** the entrant must perform the final competition submission personally.
