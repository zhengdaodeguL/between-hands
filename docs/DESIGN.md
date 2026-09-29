# Design Specification — Between Hands

Status: approved direction; implementation and acceptance remain to be verified.

## Experience

A seated, hands-first spatial puzzle game: guide rain with both hands to restore a miniature ecosystem sphere. Three levels form a complete 6–8 minute first-play session. The player learns through water, motion, and environmental response rather than reading a wall of instructions. A successful ending visibly transforms the sphere into a living ecosystem.

The work must be an interactive spatial game, not a collection of 2D panels. IWSDK supplies the shared spatial interaction/component system. Desktop and simulator controls are development and access fallbacks; they do not replace the primary immersive hand experience.

## Direction and tokens

The atmosphere is quiet, tactile, and botanical: dark green surroundings, terracotta structures, cyan rain, and warm cream guidance. Avoid glossy neon dashboards and dense menus.

All literal theme values belong in one token module, planned as `src/theme/tokens.ts`. Materials, spatial UI, and the desktop entry page consume its values rather than defining separate palettes.

| Token | Value | Intended use |
| --- | --- | --- |
| background | #071D18 | Deep forest environment |
| surface | #153A30 | Quiet structural surfaces |
| terracotta | #C77955 | Channels, gates, interaction anchors |
| rain | #82D5D0 | Moving water and flow feedback |
| text | #F3EBDD | Instructions and labels |
| muted | #B8C7BD | Secondary text |
| growth | #A9C878 | Restored life, paired with motion/form |

Use a consistent system sans font with readable spacing. Validate angular legibility in a headset; CSS pixel size alone is not evidence. Do not use color alone for success, errors, or actionable objects. Establish spacing, animation duration, and material roughness tokens alongside color; tune from observed use rather than inventing device performance claims.

## Spatial layout and comfort

The player remains seated and faces a tabletop-scale miniature world. All required interactions must fit within a two-foot reach envelope; treat this conservatively as no required target farther than 0.61 m from the calibrated seated interaction origin. Validate comfortable actual hand reach, including center height and left/right extremes. No walking, forced camera movement, rapid scene rotation, or mandatory standing.

Provide a deliberate recenter action, a reachable pause action, and a way to resume. Track lost hands gracefully; do not punish transient tracking loss with an irreversible failure. Player pose and interaction calibration must not drift after pause or session restoration.

## Level progression

1. **Wake the Seed** — move the round left handle and diamond right handle toward the player, curving rain around a stone through one glowing rain orb to restore the receiving garden.
2. **Share the Rain** — coordinate both handles in depth and height so the same stream crosses two glowing rain orbs before reaching the garden. The orbs are spatial path checkpoints, not two separate gardens.
3. **Bring the Garden Home** — move one handle near and the other far to twist the stream between two stones through two rain orbs, followed by a full restoration moment and replay option.

The stream is a cubic Bezier curve from a fixed cloud source to a fixed garden target; the two handles set its intermediate control points. A valid path crosses every rain orb and avoids all stones. In immersive play, both tracked hands must hold their corresponding handles for two active valid seconds to restore the garden. The public visual wording is "rain orb"; internal `rings` data denotes the same spherical proximity checkpoint.

These are design targets. Implementation may refine exact geometry and timing while preserving the two-hand mechanic, three-stage progression, and complete restoration arc. Any material mechanic change must update this specification.

## Feedback and access

Use continuous water direction and target response to explain causality. Pair audio feedback with visible cues. Keep guidance short and contextual, with a repeatable instruction cue. Support mute and reduced motion where animated feedback can be softened without hiding puzzle state. Preserve a clear path to reset the current level and restart the experience.

## Acceptance evidence

- Headset or emulator capture shows the full spatial game, clear hand interaction, three levels, pause/resume, and ending.
- A first-play timing record supports the 6–8 minute target; do not count prerecorded video length as playtime evidence.
- Screenshots and observed interaction checks show readable instructions, no clipping/occlusion, and consistent tokens.
- Reach, seated comfort, hand loss/recovery, and two-hand coordination are tested explicitly. Mark untested hardware claims as unverified.

