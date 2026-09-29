# Third-party attribution and license status

Reviewed against the installed packages, emitted production modules, and package-lock.json on 2026-09-29. This is a provenance inventory, not a claim that every package in the dependency graph is shipped in the browser bundle. Versions and license expressions below are package declarations; bundled code and assets retain their own notices.

## Original project work

The Between Hands game rules, level definitions, procedural garden geometry, interaction adapter, application UI, and synthesized audio were created for this project with AI assistance. No external illustration, photograph, stock robot, banner, or prerecorded sound is used by the current game. The unused IWSDK starter robot code, welcome panel, WebXR banner/texture and chime asset were removed. The project was scaffolded with Meta's IWSDK starter; retained SDK-derived configuration and source comments retain Meta's copyright notice.

## Main runtime dependencies

| Dependency | Attribution / installed license |
| --- | --- |
| @iwsdk/core, @iwsdk/xr-input, @iwsdk/scene-composition, @iwsdk/locomotor | Meta Platforms, Inc. and affiliates; MIT. |
| three (npm alias: super-three) | three.js authors, 2010–2025; MIT. |
| @pmndrs/uikit, @pmndrs/handle, @pmndrs/pointer-events | Installed LICENSE files include Bela Bohlender and Coconut Capital notices; retain their complete texts, not only a generic MIT label. |
| @pmndrs/uikit-horizon | Installed LICENSE includes Bela Bohlender and Meta Platforms LLC notices. |
| @pmndrs/uikit-lucide | Retain the complete installed LICENSE and any icon-specific upstream notice for icons actually redistributed. |
| @pmndrs/msdfonts | Font redistribution: Roboto is Apache-2.0; Inter and other listed families use SIL Open Font License 1.1. The current build includes Inter. Inter: Copyright (c) 2016–2020 The Inter Project Authors; “Inter” is a trademark of Rasmus Andersson. |
| @babylonjs/havok | Installed package LICENSE: MIT, Copyright (c) 2023 Babylon.js. Physics is disabled in this game. Dependency presence alone does not prove its runtime is loaded. |
| @drawcall/uikitml 0.1.8 | License remains unverified; excluded from the browser build. The menu now uses programmatic UIKit components. A project-authored compatibility module disables the optional parser, and the build rejects any real UIKitML module in main or worker chunks. The dependency remains in the SDK installation graph; no redistribution permission is assumed. |

## Distribution check — 2026-09-29

The public build excludes the unlicensed UIKitML parser through an original project compatibility boundary; this is not an SDK-supported removal switch or a license grant for that package. The emitted-module audit contains 374 modules and zero real UIKitML modules. The guard was also verified by attempting an in-memory build that imported the real parser; that build failed as intended.

Every production build runs scripts/third-party-notices.ps1 after Vite. It identifies packages from the emitted main and worker modules and includes full license texts for 15 shipped packages, including Inter font terms, in public/licenses and dist/licenses. See public/THIRD-PARTY-NOTICES.txt for file paths, hashes, and provenance. Yoga 3.2.1 omits its license in npm; its full upstream v3.2.1 license is pinned under scripts/license-sources and verified by SHA256. Missing terms cause the build to fail. The installed-dependency table below is retained for transparency and includes packages that are not shipped.

## Development tools

The IWSDK CLI, reference package, and Vite development plugin declare MIT. Vite, tsx, and @types/three declare MIT; TypeScript declares Apache-2.0. @meta-quest/metavr declares “Meta Platform Technologies SDK License.” Sharp/libvips packages contain Apache-2.0/LGPL declarations. These tools are development dependencies and should not be published with a static dist deployment. Do not ship node_modules as part of the game.

## Non-development dependency declarations

Generated from the current lockfile, including transitive entries and platform variants. A missing declaration is shown explicitly. Paths distinguish duplicate installed versions.

| Package path | Version | Declared license |
| --- | --- | --- |
| node_modules/@babylonjs/havok | 1.3.14 | MIT |
| node_modules/@dimforge/rapier3d-compat | 0.12.0 | Apache-2.0 |
| node_modules/@drawcall/uikitml | 0.1.8 | UNDECLARED — requires verification |
| node_modules/@iwsdk/core | 1.0.0-rc.2 | MIT |
| node_modules/@iwsdk/locomotor | 1.0.0-rc.2 | MIT |
| node_modules/@iwsdk/scene-composition | 1.0.0-rc.2 | MIT |
| node_modules/@iwsdk/xr-input | 1.0.0-rc.2 | MIT |
| node_modules/@opentelemetry/api | 1.9.1 | Apache-2.0 |
| node_modules/@opentelemetry/api-logs | 0.220.0 | Apache-2.0 |
| node_modules/@opentelemetry/core | 2.11.0 | Apache-2.0 |
| node_modules/@opentelemetry/instrumentation | 0.220.0 | Apache-2.0 |
| node_modules/@opentelemetry/resources | 2.11.0 | Apache-2.0 |
| node_modules/@opentelemetry/sdk-trace | 2.11.0 | Apache-2.0 |
| node_modules/@opentelemetry/sdk-trace-base | 2.11.0 | Apache-2.0 |
| node_modules/@opentelemetry/semantic-conventions | 1.43.0 | Apache-2.0 |
| node_modules/@pmndrs/handle | 6.6.30 | SEE LICENSE IN LICENSE |
| node_modules/@pmndrs/handle/node_modules/zustand | 4.5.7 | MIT |
| node_modules/@pmndrs/msdfonts | 1.0.76 | SEE LICENSE IN LICENSE |
| node_modules/@pmndrs/pointer-events | 6.6.30 | SEE LICENSE IN LICENSE |
| node_modules/@pmndrs/uikit | 1.0.76 | SEE LICENSE IN LICENSE |
| node_modules/@pmndrs/uikit-horizon | 1.0.76 | SEE LICENSE IN LICENSE |
| node_modules/@pmndrs/uikit-lucide | 1.0.76 | SEE LICENSE IN LICENSE |
| node_modules/@pmndrs/uikit-pub-sub | 1.0.76 | MIT |
| node_modules/@preact/signals-core | 1.14.4 | MIT |
| node_modules/@sentry/conventions | 0.16.0 | MIT |
| node_modules/@sentry/core | 10.75.3 | MIT |
| node_modules/@sentry/node | 10.75.3 | MIT |
| node_modules/@sentry/node-core | 10.75.3 | MIT |
| node_modules/@sentry/opentelemetry | 10.75.3 | MIT |
| node_modules/@sentry/server-utils | 10.75.3 | MIT |
| node_modules/@tweenjs/tween.js | 23.1.3 | MIT |
| node_modules/@types/emscripten | 1.41.6 | MIT |
| node_modules/@types/stats.js | 0.17.4 | MIT |
| node_modules/@types/three | 0.181.0 | MIT |
| node_modules/@types/webxr | 0.5.24 | MIT |
| node_modules/@webgpu/types | 0.1.74 | BSD-3-Clause |
| node_modules/@zappar/msdf-generator | 1.2.4 | MIT |
| node_modules/cjs-module-lexer | 2.2.1 | MIT |
| node_modules/comlink | 4.4.2 | Apache-2.0 |
| node_modules/commander | 14.0.3 | MIT |
| node_modules/debug | 4.4.3 | MIT |
| node_modules/discontinuous-range | 1.0.0 | MIT |
| node_modules/elics | 3.4.2 | MIT |
| node_modules/entities | 6.0.1 | BSD-2-Clause |
| node_modules/es-module-lexer | 3.0.2 | MIT |
| node_modules/fflate | 0.8.3 | MIT |
| node_modules/import-in-the-middle | 3.5.1 | Apache-2.0 |
| node_modules/meshoptimizer | 0.22.0 | MIT |
| node_modules/module-details-from-path | 1.0.4 | MIT |
| node_modules/moo | 0.5.3 | BSD-3-Clause |
| node_modules/ms | 2.1.3 | MIT |
| node_modules/nearley | 2.20.1 | MIT |
| node_modules/nearley/node_modules/commander | 2.20.3 | MIT |
| node_modules/playwright | 1.63.0 | Apache-2.0 |
| node_modules/playwright-core | 1.63.0 | Apache-2.0 |
| node_modules/railroad-diagrams | 1.0.0 | CC0-1.0 |
| node_modules/randexp | 0.4.6 | MIT |
| node_modules/react | 19.3.0 | MIT |
| node_modules/require-in-the-middle | 8.0.1 | MIT |
| node_modules/ret | 0.1.15 | MIT |
| node_modules/three | 0.181.0 | MIT |
| node_modules/three-mesh-bvh | 0.9.15 | MIT |
| node_modules/use-sync-external-store | 1.7.0 | MIT |
| node_modules/yoga-layout | 3.2.1 | MIT |
| node_modules/zod | 4.6.5 | MIT |

