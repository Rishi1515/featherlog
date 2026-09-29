# FeatherLog

A React bird-photo organizer with local vision-model identification through Ollama.

## Run

Use Node.js 22.12+ and npm. Install Ollama from its official site, run `ollama pull qwen2.5vl:7b` (approximately 6 GB), and keep Ollama running. Run `npm ci`, then `npm run dev`. Run `npm run build` for the production bundle, `npm run preview -- --host 127.0.0.1 --port 4173` to serve it with the local identification endpoint, `npm run lint` for lint checks, and `node --test` for regression tests. Set the server-side `FEATHERLOG_MODEL` variable to use another installed vision model. On Windows, `Start-FeatherLog.cmd` installs missing project dependencies, builds, and starts the local app; keep its window open.

## Demo flow

1. Open **No ID yet** and upload a JPEG, PNG, or WebP under 20 MB.
   Confirm the status near the top says **AI ready · qwen2.5vl:7b** before importing.
2. Wait for image analysis. Clear model suggestions create species groups automatically, including species outside the starter catalog.
3. Uncertain, multiple-species or non-bird images remain in the review queue. Click to inspect the suggestion and explanation; accept or assign manually. For existing uploads, use **Identify queued photos**.
4. Open that species from Gallery, favorite or pin the image, then refresh to check persistence.
5. Delete the image to return the species to its empty state.

Photos are compressed and stored in this browser's localStorage. Compressed images are sent to Ollama on the same laptop, without EXIF location data in the model prompt. No cloud model service receives them. Only proposed scientific names are sent to GBIF's public taxonomy API; image bytes and metadata are not sent to GBIF. Unverified names remain in review. GBIF validates a taxon's existence, not whether the image actually depicts it. Storage is limited, clearing site data removes the collection, and this is not archival storage. Keep original files backed up. Storage failures are displayed and do not update the visible collection. Assignment is saved as a single collection write. New imports are deduplicated by SHA-256 of source bytes. **Download collection backup** exports photo viewing copies, metadata and identification history as JSON.

## Implemented

- Local photo import and compression with EXIF extraction.
- Automatic species suggestions and grouping using a real local vision model.
- Review/correction with model identity, timestamps and decision history.
- Manual assignment and acceptance of uncertain suggestions.
- Species gallery, favorites, featured images and deletion.
- Browser-local persistence, with empty-state and save-error handling.

## Not implemented

Google Drive connection/scanning, OAuth, cross-device sync, authentication, archival original storage, maps and bird-call playback are not implemented. Model certainty is self-reported and uncalibrated, not measured accuracy. Automatic grouping requires at least 85% model certainty, an exact bird-species taxonomy match, and an image that is not predominantly in deep shadow. This quality heuristic can also flag valid dark-plumaged birds. Inspect results and correct mistakes. This general vision model is not a validated bird classifier.

## Deployment

The working identification configuration is local: Vite serves the interface and a loopback-only endpoint proxies requests to local Ollama. A static host alone cannot run identification. Do not expose the development/preview server publicly. A public service needs an authenticated backend, model hosting, rate limits, durable storage and deployment hardening. Hash routing supports local page refreshes without rewrites.

## Cloud integration diagnosis

The supplied Desktop code was a different implementation from the hosted app described in the shared September chat. It contained Firebase client configuration and direct, unauthenticated Firestore reads/writes, but no Drive OAuth routes or VLM requests. Adding a Google client secret to this frontend cannot finish that integration. The current copy removes that Firebase connection; deployed Firestore rules and the historical hosted app were not verified.

A production version needs an authenticated backend, server-side OAuth token storage, the exact redirect URI for that backend, a Drive permission strategy, and a server-side model provider adapter. Keep OAuth client secrets and model keys out of Vite client variables and browser bundles. Verify the old Firebase project's rules in its console before continuing to use it. See `AUDIT.md` for findings and résumé wording.

## Publication

This repository contains the browser-local demo described above. No open-source license has been assigned. `.env` files and credential JSON files are ignored; review the staged diff before every public push.
