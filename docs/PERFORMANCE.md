# Desktop production performance observation — 2026-09-29

Public build: https://zhengdaodegul.github.io/between-hands/
Commit: 184daa2e8392864e6b5df7aa41445098dd5e67ed. Loaded script: assets/index-DW9o2UDV.js.

Fresh Playwright CLI 0.1.22 session `between-hands-desktop-perf`, default headless Chrome 153.0.8010.53, Windows, 1280 × 900 viewport and WebGL drawing buffer, DPR 1. WebGL 2 through ANGLE / Intel(R) Arc(TM) Graphics / Direct3D11. Reduced motion disabled. The session reported visible throughout, used no XR session, and was closed after sampling. Browser console contained zero errors.

Method: normal desktop-rehearsal and Begin controls, 5 seconds of condition-specific warmup, followed by 30 seconds of requestAnimationFrame timestamp intervals. Percentiles use the nearest-rank method. Values below are milliseconds; no cold-load timing, GPU completion timing, or headset frame rate was measured.

| Condition | Intervals | p50 | p95 | Maximum | Intervals >50 ms |
| --- | ---: | ---: | ---: | ---: | ---: |
| Chapter 1 playing, controls stationary | 1,800 | 16.70 | 16.80 | 17.40 | 0 |
| Chapter 1 playing, continuously changing six sliders | 1,800 | 16.70 | 16.80 | 19.10 | 0 |
| Chapter 3 finished, restored garden visible | 1,800 | 16.70 | 16.80 | 19.10 | 0 |

The continuous-input condition dispatched one real `input` event on each of the six HTML range controls per animation frame: 10,800 events during the measured interval. Values followed small sinusoidal changes around the initial path, quantized to the controls' 0.005 step; the path stayed invalid and the game remained playing. This is a defined input stress workload, not a recording of human mouse or hand movement.

To reach the final condition, the authored solutions were entered using the six real range controls, with normal Begin/Next buttons and the actual two-second rule transition. All three chapters visibly reached completion; no internal game state was assigned. This assisted traversal does not measure natural first-play duration.

No long frame intervals appeared in these three observations. This is one headless desktop run per condition and cannot establish a general desktop performance guarantee, Quest 60 fps, real hand-tracking quality, or seated comfort. No optimization was made as a result.

Raw samples (including all interval values), environment, and completion evidence are retained locally under the Git-ignored output/playwright directory:
- `desktop-perf-environment.json`
- `desktop-perf-stationary.json`
- `desktop-perf-moving.json`
- `desktop-perf-finished.json`
- `desktop-perf-completion.json`
- `desktop-perf-summary.json`
- `desktop-perf-console.txt`

Reproducible CLI run-code inputs are retained beside the evidence as `desktop-perf-*.js`. No source code or deployment was modified by this measurement.

## Scene workload inventory

A source-only construction of the chapter-three garden counted 29 mesh objects / 249 mesh instances before completion and 31 / 330 after completion. The corresponding geometry triangle upper bounds were 42,156 and 55,764, plus two line objects in each state. These counts exclude the SDK menu, tracked-hand models, and camera culling. They describe authored workload, not measured draw calls or GPU time. Repeated foliage, beads, droplets, and sprouts use instanced geometry.
