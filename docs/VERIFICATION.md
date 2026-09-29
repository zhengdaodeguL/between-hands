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

## Remaining gates

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

