# Between Hands

A seated, hands-first WebXR puzzle prototype built with IWSDK. Shape a stream of rain using two spatial handles, guide it around stones and through glowing rain orbs, and restore a miniature garden across three chapters.

**Publication authorized and in progress. Public links below are pending verification. The competition entry is not submitted; Start membership and historical eligibility remain unconfirmed.**

- Planned live experience: https://zhengdaodeguL.github.io/between-hands/
- Planned source repository: https://github.com/zhengdaodeguL/between-hands
- YouTube demonstration: publication in progress; no verified URL yet.

## Run locally

Use PowerShell 7 and a Node version supported by `package.json` (Node 24 is supported). From this repository:

```powershell
$ErrorActionPreference = 'Stop'
npm ci
npm run dev
```

Open http://127.0.0.1:4329/ manually. The development script disables IWSDK's automatic browser opening and uses a strict port: it reports a conflict instead of silently choosing another port. It does not stop another service. `Ctrl+C` stops this project's development process.

```powershell
$ErrorActionPreference = 'Stop'
npm run test
npm run typecheck
npm run build
```

Production files are generated in `dist/`. A public deployment needs HTTPS for WebXR. A local loopback URL is not a publicly playable competition entry.

## Play

Choose **Enter immersive VR** in a compatible browser. Begin the chapter, then pinch the round left handle with your left hand and the diamond right handle with your right hand. Move both handles to guide rain around stones and through every glowing orb. Hold both handles while the valid stream waters the garden for two seconds. Open your fingers to release; after tracking loss, release and pinch again. Use the spatial menu to pause, reset, recenter, mute, or leave VR.

**Desktop rehearsal** exposes position sliders for the same puzzle rules. It is useful for previewing and testing the levels; it is not hand-tracking evidence. Desktop play through all three chapters has been checked. All three chapters and the spatial menu were exercised with IWER hand inputs; real-headset validation remains pending.

Completion state is saved locally. Reset restarts the current chapter; the ending offers a new beginning. The 6–8 minute first-play duration is a design target, not a measured result.

## Current evidence and remaining work

See [VERIFICATION.md](docs/VERIFICATION.md) for the exact tested scope and remaining gates. IWER testing covered the three-chapter hand-input walkthrough, tracking recovery, and spatial controls. Quest hardware hand tracking, comfort, and performance remain unverified. Public deployment is authorized and in progress, with live-link verification still pending. A 65-second English, silent demonstration is available at [deliverables/Between-Hands-demo.mp4](deliverables/Between-Hands-demo.mp4); gameplay is explicitly labeled as slowed emulator footage.

The Start application was successfully submitted on 2026-09-28 and is awaiting review. A user-authorized eligibility clarification was sent to the organizer and checked in the sent folder; no decision is recorded. Neither action establishes eligibility.

## Project documentation

- [Agent guide](AGENTS.md)
- [Design](docs/DESIGN.md) and [development](docs/DEVELOPMENT.md) specifications
- [Competition requirements](docs/COMPETITION.md) and [Start status](docs/START-STATUS.md)
- [English Devpost draft](docs/DEVPOST.md)

This is a new competition project, separate from SupperShift. Third-party tools and dependencies retain their own licenses. Final competition submission must be performed personally by the entrant after eligibility and all deliverables are resolved.

## Developer emulator capture

The development build offers a local capture toolbar: **Record XR demo**, **Stop recording**, and **Capture screenshot**. It records the renderer's live canvas into a 1280×720, 30 fps WebM composition, with a baked-in **IWER emulator · actual gameplay · silent** label. Recording stops automatically at 175 seconds. It does not move hands, solve puzzles, synthesize gameplay, capture audio, or upload anything. Use it only for IWER emulator footage; the label is not a device-detection claim.

After stopping, use **Download demo.webm**; screenshots create a **Download screenshot** link. Inspect the downloaded artifacts before treating them as evidence. The toolbar is development-only and is excluded from the production build; it is not a player feature. A recording can only show gameplay actually performed while capture is active.



## License

Original Between Hands code is licensed under the [MIT License](LICENSE), copyright 2026 Liu Yida. Third-party code, dependencies, scaffold files, fonts, and assets retain their separate notices and licenses. Existing Meta copyright headers remain intact. See [third-party notices](docs/THIRD-PARTY-NOTICES.md) and [CHANGELOG.md](CHANGELOG.md) for the initial publication scope.


