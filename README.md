# vigilant-tribble

This repository does **not** support building tools for fraud, impersonation, deepfakes-for-deception, phishing, stalking, or financial exploitation.

## Run the app

```bash
npm install
npm start
```

Then open `http://localhost:3000`.

## Safe project direction

Build a **longform content creation platform** that helps users publish polished 10–30 minute pieces from one prompt plus source materials.

## Product outcome (v1)

- Primary outcome: publish-ready longform content with minimal manual rewriting
- Input bundle: one prompt + optional transcript, docs, URL, and source notes
- Output bundle: finalized longform asset with attribution and export formatting

## Core workflows (v1 only)

1. **Script drafting**
   - Generate a complete first draft from prompt and project context
2. **Section expansion**
   - Expand selected sections while preserving voice, references, and continuity
3. **Final assembly/export**
   - Assemble chapters into a unified final draft and export in target format

## High-level safe architecture

- **Frontend:** chapter-first editor UI with:
  - left panel for outline and chapter ordering
  - center panel for section cards and expand actions
  - right panel for full assembled draft preview
- **Backend:** Node.js + Express APIs for project context, generation jobs, and exports
- **Realtime:** Socket.io for generation status updates and quality-pass completion
- **Storage:** project memory store for brief, style guide, banned claims, and source notes
- **Safety controls:** consented inputs, attribution enforcement, abuse-prevention checks, and audit logs

## Context memory controls

- Persistent project brief reused across all chapters
- Persistent style guide for tone, structure, and vocabulary
- Banned-claims list to prevent unsupported assertions
- Source-notes repository with reusable citations across sections

## One-click quality passes

- Structure pass (logical flow and chapter coherence)
- Repetition cleanup (deduplicate recurring points and phrases)
- Factual consistency check (cross-section claim alignment)
- Tone unification (consistent voice across the full piece)

## Supported longform outputs

- Article
- Newsletter series
- Podcast script
- Video script with timestamps

## Low-friction onboarding

- Template library for common longform goals
- Start-from import paths: transcript, docs, or URL
- Guided first-project wizard focused on reaching first publishable draft quickly

## Trust, safety, and compliance

- Clear source attribution in generated outputs
- Consent verification for uploaded/imported material
- Anti-deception guardrails aligned with repository safety scope
- Full audit logging for generation and editing actions

## Beta validation loop

Track and review:

- time-to-first-draft
- edits per 1k words
- publish-ready rate

Use these metrics to remove friction in weak steps before widening scope.
