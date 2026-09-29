# FeatherLog

A React bird-photo organizer prototype with a credential-free, browser-local demo.

## Run

Use Node.js 22.12+ and npm. Run `npm ci`, then `npm run dev`. Run `npm run build` for the production bundle, `npm run preview` to serve it, `npm run lint` for lint checks, and `node --test` for storage regression tests.

## Demo flow

1. Open **No ID yet** and upload a JPEG, PNG, or WebP under 20 MB.
2. Click the photo to review its date, camera and GPS metadata when available.
3. Select one of the six catalog species and assign the photo.
4. Open that species from Gallery, favorite or pin the image, then refresh to check persistence.
5. Delete the image to return the species to its empty state.

Photos are compressed and stored in this browser's localStorage. No photos or metadata are sent to a cloud service by the app. Storage is limited, clearing site data removes the collection, and this demo is not archival storage. GPS metadata may be sensitive; use test photos for demonstrations. Storage failures are displayed and do not update the visible collection. Assignment is saved as a single collection write.

## Implemented

- Local photo import and compression with EXIF extraction.
- Manual assignment to a small species catalog.
- Species gallery, favorites, featured images and deletion.
- Browser-local persistence, with empty-state and save-error handling.

## Not implemented

Google Drive connection/scanning, OAuth, VLM species identification, AI confidence scores, cross-device sync, authentication, maps and bird-call playback. This project must not be described as a completed AI or Google Drive integration. The demo contains no simulated AI predictions.

## Deployment

The demo is a static Vite app. Serve `dist` after `npm run build`; hash-based routing supports page refreshes without server rewrites. No API keys or environment variables are required. For a deployment under a path prefix, build with `npm run build -- --base=/repository-name/`.

## Cloud integration diagnosis

The supplied Desktop code was a different implementation from the hosted app described in the shared September chat. It contained Firebase client configuration and direct, unauthenticated Firestore reads/writes, but no Drive OAuth routes or VLM requests. Adding a Google client secret to this frontend cannot finish that integration. The current copy removes that Firebase connection; deployed Firestore rules and the historical hosted app were not verified.

A production version needs an authenticated backend, server-side OAuth token storage, the exact redirect URI for that backend, a Drive permission strategy, and a server-side model provider adapter. Keep OAuth client secrets and model keys out of Vite client variables and browser bundles. Verify the old Firebase project's rules in its console before continuing to use it. See `AUDIT.md` for findings and résumé wording.

## Publication

This repository contains the browser-local demo described above. No open-source license has been assigned. `.env` files and credential JSON files are ignored; review the staged diff before every public push.
