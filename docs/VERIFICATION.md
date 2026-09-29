# Verification Record

Date: **2026-09-28**. Scope: current development checkout. This record distinguishes observed results from planned acceptance gates. No real Quest test or published competition entry is claimed.

## Automated checks

- `npm run test`: eight pure puzzle tests passed in the earlier observed run. Covers authored solutions, initial/one-hand/flattened paths, shared path endpoints, between-sample collision checks, invalid positions, pause/reset/completion, and time integration.
- `npm run typecheck`: passed after the runtime lifecycle and completion-persistence fixes.
- `npm run build`: rerun after the runtime fixes on 2026-09-28; exited 0, 2,200 modules transformed, completed in 12.82 seconds. Rollup reported removable dependency annotation warnings and a large-chunk warning; the largest JavaScript chunk is about 6.59 MB (1.69 MB gzip). Loading cost and device performance remain to be measured. A build proves compilation and bundling, not headset behavior or eligibility.

## Browser observations reported by the parent agent

The following were performed through the actual browser UI on the local development app, rather than inferred from unit tests:

- Desktop sliders completed all three chapters.
- Pausing at growth value 0.1 preserved that value; resuming allowed completion.
- Reloading after completion restored the finished state.
- WebXR entry using the IWER emulator succeeded.
- IWER Hands mode reported both left and right hands tracked.
- A short simulated left-hand pinch activated the spatial Begin button; the first chapter completed with two real emulated XR hand inputs held and moved through the shared hand adapter.

A later parent-agent IWER run supplied the raw three-chapter capture and final completion screenshot listed below. The local video visually shows all three chapters using emulated hands; the ending screenshot shows the completed garden. This is emulator evidence, not proof of real Quest hand tracking, seated comfort, or performance. Individual spatial controls and recovery scenarios require their own checks.

## Membership and eligibility evidence

- The Start application success page confirmed submission on 2026-09-28. Approval remains pending.
- With explicit user authorization, an eligibility clarification was sent on 2026-09-28 to the competition organizer at `keshya@devpost.com`; the parent agent verified it in Gmail's sent folder.
- No organizer decision is recorded. Historical Developer Access under rules §2(c) remains unconfirmed. An application receipt and a sent inquiry do not resolve it.

## Gates recorded before publication — historical

- Real-device hand grabbing and progression; emulator release/regrab after tracking loss, reset, and any untested recovery scenarios. The supplied IWER three-chapter walkthrough is recorded below.
- Spatial begin/pause/resume/reset/recenter/mute/exit controls and session end/reentry.
- Headset reach, seated comfort, legibility, accessibility, and measured performance on the declared device.
- Measured first-play duration against the 6–8 minute target.
- Stable public HTTPS deployment, independently opened and checked.
- Publish and independently verify the English demonstration link. The local exported video below is under three minutes; it has not been published.
- Final asset/license review, official form requirements, eligibility resolution, Start approval, and entrant's personal final submission.

Retest changed behavior after fixes. Do not convert the remaining gates to passed merely because build, type checks, or local desktop tests succeed.



## Local demonstration video — 2026-09-29

Final file: `deliverables/Between-Hands-demo.mp4`.

- ffprobe verified **65.033333 seconds**, **1280 × 720**, **H.264**, **yuv420p**, **30 fps**, **1,951 decoded frames**, **1,160,809 bytes**. No audio track; the introduction explicitly says silent.
- The raw `demo-2026-09-28T18-26-26-044Z-9326d31f.webm` is preserved. It is VP9, 1280 × 720, 380 frames, first packet PTS 0.000 and last packet PTS 12.981 seconds; its container does not report duration metadata.
- The edit consists of an 8-second title, 8-second mechanism explanation, approximately 39 seconds of the actual recording at **one-third speed**, and a 10-second final completion still from `screenshot-2026-09-28T18-26-26-252Z-08dd4422.png`.
- Gameplay is explicitly labeled **Actual IWER gameplay - slowed for clarity (1/3 speed)**. The ending explicitly identifies itself as a still frame and states **Seated WebXR prototype. Quest hardware testing pending.** No generated gameplay or synthetic hand movement was added.
- The central source area is cropped and modestly enlarged (1.125×) while retaining visible hands, handles, garden, and spatial controls. This improves use of the video frame without replacing the captured visuals.
- `deliverables/Between-Hands-demo-QA.png` contains eight checked frames at 3, 11, 20, 28, 36, 44, 52, and 61 seconds. Visual inspection found readable captions, visible gameplay rather than black frames, no subtitle overflow, and a clear completion still. `deliverables/source-contact-sheet.png` preserves the source timing overview.

This is a local deliverable only, not a public video URL or submitted entry. Its edited duration, slowed motion, and MediaRecorder timestamps do not measure normal gameplay duration, first-play timing, real-time performance, or headset frame rate.

## Additional direct browser verification (2026-09-29)

The root agent completed all three chapters using actual IWER hand inputs via the visible emulator controls, not by assigning game state. Both hands were tracked and held; control positions flowed through the XR joint-pose adapter. Disconnecting a hand cleared grabs; after reconnect, open/re-pinch restored grabbing. The spatial menu was tested for new beginning/start, pause, resume, mute, current-level reset, recenter, and exit to nonimmersive mode. Recenter moved the panel world y from 1.745 to 1.645 for the adjusted simulated seated height.

The published-intent local video file has not been uploaded. Raw source clip and final MP4 are saved in deliverables; final video QA was independently viewed by the root agent. It does not establish natural first-play duration, real device performance, or eligibility.

Final root validation: npm run test (8 passing), npm run typecheck, npm run build (exit 0). Full mobile responsive QA and public-site verification remain uncompleted. The native browser's pointer-lock feature was unavailable, so no pointer-lock support claim is made.

Production preview on 127.0.0.1:4330 loaded without browser console errors. No developer capture toolbar or emulator was present. Browser viewport override did not produce the requested narrow CSS viewport (DOM remained 1280 px), so mobile verification remains unclaimed. Publication was authorized by the user on 2026-09-29; see the later publication verification below.


## Release validation — 2026-09-29

- Initial public source commit: e58a63f. GitHub's clean Ubuntu / Node 24 build passed npm ci, all 9 tests (8 puzzle rules and the parser boundary), type checks, production compilation, and full-license collection.
- Programmatic UIKit replaces the optional markup parser. Main JavaScript decreased from approximately 6.59 MB to 2.08 MB (561 KB gzip). The emitted manifest has 374 modules and no real @drawcall/uikitml modules. An intentional in-memory import of the real parser was rejected by the build guard.
- Fifteen shipped npm packages have complete license texts copied into the static site, including Inter OFL. Yoga's pinned upstream license and its SHA256 are retained for reproducible offline license collection.
- Local production preview was exercised in Chrome using the visible desktop controls for all three chapters. Setting the six range controls dispatched their ordinary input events; no internal game state was assigned. The completed garden survived reload.
- A real 390 × 844 CSS viewport was verified: document width 390, no horizontal overflow, loading complete. The full-page image was visually inspected for readable text and controls. This is responsive browser evidence, not Quest performance or hand-tracking evidence.
- Production Chrome console contained zero errors. Unsupported desktop VR was disabled with a compatible-browser message, and developer capture/emulator controls were absent.
- The user deferred YouTube publication until later. The 65.03-second final MP4 and English publishing text remain available in deliverables; no public YouTube URL is claimed.

### Public deployment and menu regression

The public app at https://zhengdaodegul.github.io/between-hands/ returned HTTP 200. In an independent Chrome automation session, all three chapters completed using the public desktop controls and the completed state survived reload. The main JavaScript, CSS, root license, complete third-party index, and Inter license returned HTTP 200. Public desktop screenshot was visually checked; public browser console had zero errors.

Workflow https://github.com/zhengdaodeguL/between-hands/actions/runs/36527985723 succeeded on attempt 2. The initial clean build passed; deployment initially failed because the newly created GitHub Pages environment allowed only main. The environment was narrowed to the actual codex/between-hands publishing branch and the failed deployment job was rerun successfully.

After the programmatic-menu change, actual IWER Hands UI actions verified Begin, Pause, Resume, Sound, Reset, Recenter, and Exit. Moving the emulated headset to x=0.10 and activating Recenter moved the panel x from 0 to 0.10000000149. Both emulated hands completed chapter one, and a menu pinch on Begin / Next entered Share the Rain. Screenshots showed no menu-label overflow. These checks did not directly assign game state. Exit returned to the desktop correctly; the console had zero errors and one Three.js warning about resizing while VR was presenting. That warning remains recorded rather than being presented as a warning-free XR run.

Local QA screenshots and interaction traces are under the ignored output/playwright directory. Quest hardware testing, first-play timing, eligibility, Start approval, the target launch date, public YouTube upload, and personal final competition submission remain incomplete.

## Loading failure recovery — 2026-09-29

The deployed version at commit 63d47da was tested with its entry JavaScript request aborted. After requests became idle, the screen still said “Growing a small world…” and provided no retry control. This reproduced the unresolved asset-load-failure requirement.

The fix keeps a small failure handler in the HTML so it remains available when the application module cannot download. Entry-module failures and runtime boot failures now show a concise connection message with a Try again button. Internal error details stay in the console. The overlay uses system fallback colors when JavaScript has not yet applied the game theme.

The local production build was tested twice: aborting the entry-module request, and aborting the lazy world-initializer asset. Both displayed the error and retry control. Removing the simulated network failure and clicking Try again reloaded the page and reached the ordinary game UI in both cases. The error screen was visually inspected. Type checking, production build, and full-license collection passed. Public deployment verification is recorded after publication.

### Deployment and session recovery follow-up

Commit 2a12f9c passed the clean GitHub Actions checks and Pages deployment in run 36533830046. The public HTML contains the independent retry fallback. On the public HTTPS URL, simulated entry-module and lazy runtime-asset failures both showed the retry control; restoring requests and clicking Try again returned to the game. The error overlay was also checked at a 390-pixel viewport without horizontal overflow.

Additional headed IWER checks verified pause with identical frame captures over time, automatic pause when entering XR from desktop play, and session exit/reentry. Exit cleared both held-hand states; reentry stayed paused and preserved control positions. Resizing during XR did not duplicate callbacks: a single pinch resumed or paused once. After exit, canvas CSS dimensions returned to 900 × 700. No application errors occurred; the already-recorded Three.js resize warning recurred.

Real tab switching in this automation environment continued to report document.hidden=false, even in headed mode. The actual visibility-loss event path remains unverified; no synthetic property override is counted as a pass. Hardware reach/comfort/frame rate, natural first-play duration, video publication, membership/eligibility decisions, the entrant's launch-date choice, and final personal submission still require external evidence or user action.

## Theme consolidation — 2026-09-29

The remaining interface alpha colors, lighting colors, and developer-capture colors now come from src/theme/tokens.ts. Vite also resolves the browser theme-color metadata from that module. The literal color values were preserved.

At a 1440 × 900 browser viewport, the published version and the refactored production preview had identical computed backgrounds, borders, text, hover color, and browser theme metadata. Full-page RGB screenshots were identical pixel for pixel. The refactored screenshot was visually inspected. Type checking, production build, and all 15 dependency-license copies passed. This verifies preserved desktop appearance; it does not add a hardware-performance claim.

## Scoped desktop performance observation — 2026-09-29

The public production build at 184daa2 was measured in a fresh headless Chrome 153.0.8010.53 session on Windows, with Intel Arc / D3D11, a 1280 × 900 viewport, and DPR 1. Three conditions (stationary play, continuous six-slider input, and the completed garden) each used a five-second warmup and 30 seconds of rAF timestamp sampling. Each produced 1,800 intervals, p50 16.70 ms, p95 16.80 ms, and zero intervals above 50 ms. The continuous-input group dispatched 10,800 ordinary DOM range-input events. Its maximum interval was 19.10 ms.

See PERFORMANCE.md for all condition results, the authored scene-workload inventory, and the retained local raw evidence. This is one headless desktop observation per condition, not a Quest, GPU-completion, or natural first-play measurement. No runtime optimization or hardware claim was inferred from it.
