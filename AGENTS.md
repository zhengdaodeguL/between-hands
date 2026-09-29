# Between Hands — Agent Guide

This repository is a new entry for the 2026 Meta Start Developer Competition. It is not a continuation of SupperShift; do not reuse that project's implementation, branding, or deliverables.

## Read before implementation

- [Design specification](docs/DESIGN.md): experience, visual direction, spatial interaction, tokens, accessibility.
- [Development specification](docs/DEVELOPMENT.md): architecture, reuse, lifecycle, implementation and verification gates.
- [Competition requirements](docs/COMPETITION.md): deliverables, eligibility uncertainty, evidence and submission boundary.
- [Start application status](docs/START-STATUS.md): application submitted, approval pending.

Specifications describe intended behavior, not implemented features. Keep implementation evidence separate from acceptance targets. Never claim real-device validation from simulator or desktop results.

## Working rules

- Use this independent Git repository for rollback. Do not make packaged backups or explicit rollback checkpoints unless requested.
- Use PowerShell 7 (`pwsh`) for CLI operations; every script begins with `$ErrorActionPreference = 'Stop'`. Read and write text as UTF-8.
- Keep design tokens centralized. Use one spatial component system: IWSDK. Avoid introducing a second UI/component library.
- Keep pure puzzle rules independent of renderer, hand input, audio, and persistence. Reuse shared interaction and level primitives rather than copying them per level.
- Follow the directory boundaries in DEVELOPMENT.md; document justified changes there.
- Do not store account identifiers, cookies, tokens, private provider endpoints, or authentication data in source, evidence, logs, or docs.
- Do not modify or interrupt sub2api, grok2api, or ccswitch services. This project does not require changes to them.
- Third-party tools and public source may be used only under their licenses. Track attribution and asset provenance; create this entry during the competition period.
- Keep player-facing text and competition deliverables in English. Discuss work with the user in Chinese by default.
- A successful Start application is not membership approval. Competition eligibility remains unresolved until supported by authoritative evidence.
- The entrant must personally perform final competition submission; do not automate it or submit on their behalf.

