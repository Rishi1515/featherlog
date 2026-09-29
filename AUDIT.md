# FeatherLog audit — 29 September 2026

This repository contains the revised local demo. Original source was preserved separately.

The original lint and production build passed. This establishes compilation, not cloud functionality. The original app had manual assignment, image compression, EXIF parsing and Firestore calls. No Drive OAuth or VLM implementation was found. The shared chat described a separate hosted site and acknowledged unverified Google, AI and cross-device behavior. Its hosting source/configuration was not present in the supplied folder.

Findings addressed in this demo:

- Species gallery dereferenced missing featured photos after deleting the last photo.
- Assignment separately saved a species and deleted the queue item, risking loss or duplication on partial failure.
- Failed writes still changed visible state and errors appeared only in the console.
- Empty Firestore collections were seeded on every load, reintroducing deleted sample records.
- Sample confidence scores appeared as AI predictions, while audio/maps/filter controls were placeholders.
- GPS values of zero were treated as missing; compression failure could store the full-size original.
- Firebase project configuration was embedded in source. Firebase web API configuration is not equivalent to an OAuth secret; access control depends on deployed rules, which were not audited. The configuration was removed from this working copy.

Updated identification implementation: local Ollama Qwen2.5-VL 7B analyzes compressed images and returns validated structured species suggestions. Suggestions with model certainty at least 0.85, an exact GBIF bird-species match, and no deep-shadow quality flag are grouped automatically; uncertain, non-bird and mixed-species results remain in review. Groups can be created beyond the starter catalog. Model/source, timestamp, reasoning and user decisions are retained. Source-byte fingerprints prevent duplicate new imports. The smaller 3B model was rejected after it produced unreliable names on the user's photos; its earlier outputs remain only as reviewable history.

Remaining limits: browser storage capacity, no multi-tab synchronization, no cloud sync or Drive integration, no archival original storage, no bird calls. Local inference requires Ollama and the downloaded model. Self-reported confidence is not calibrated accuracy. The existing Desktop original and its generated build still contain their original Firebase configuration; removal here does not revoke or change it.

## Résumé wording supported by this source

Verification of the revised demo: production build and lint passed; three Node storage tests passed (round-trip persistence, failed-write preservation, corrupt-data rejection). Production gallery and review routes rendered in the in-app browser. The browser's file chooser timed out, so the complete photo-import/assignment/refresh flow has not been verified interactively. CI is configured to run lint, tests and a production build. A public application deployment has not been verified.

- Built a React bird-photo organizer prototype with client-side image compression, EXIF metadata extraction, and manual species categorization.
- Implemented browser-local collection persistence, featured-photo and favorite controls, and visible save-error handling for a credential-free demo.
- Integrated a local vision-language model for image-based species suggestions, automatic grouping, and reviewable identification history.

Do not claim VLM accuracy, automated Drive scanning, production OAuth deployment, user counts or performance improvements without separate measured evidence. Describe this as freelance/client work only if that engagement description is accurate.
