import test from 'node:test';
import assert from 'node:assert/strict';
import { applyIdentification } from '../src/identification.js';
import { validateIdentification } from '../server/vision.js';
const photo = { id: 'p1', url: 'data:image/png;base64,x' };
const data = () => ({ birds: [], unidentified: [photo] });
const result = { bird: true, multipleSpecies: false, common: 'House Sparrow', scientific: 'Passer domesticus', confidence: 0.94, reason: 'Visible plumage', model: 'test' };
test('clear identification creates species, pins image, and removes queue item', () => {
  const next = applyIdentification(data(), photo, result);
  assert.equal(next.birds[0].sci, 'Passer domesticus');
  assert.equal(next.birds[0].photos[0].pinned, true);
  assert.equal(next.unidentified.length, 0);
  assert.equal(next.birds[0].photos[0].history[0].decision, 'model-suggestion');
});
test('uncertain, non-bird and multi-species images remain in review', () => {
  for (const change of [{ confidence: 0.5 }, { bird: false }, { multipleSpecies: true }, { taxonomyVerified: false }]) {
    const next = applyIdentification(data(), photo, { ...result, ...change });
    assert.equal(next.birds.length, 0); assert.equal(next.unidentified.length, 1);
  }
});
test('review acceptance preserves model output and appends user decision', () => {
  const uncertain = { ...result, confidence: 0.6 };
  const queued = applyIdentification(data(), photo, uncertain);
  const next = applyIdentification(queued, queued.unidentified[0], uncertain, true);
  assert.equal(next.birds[0].photos[0].history.length, 2);
  assert.equal(next.birds[0].photos[0].history[1].decision, 'user-accepted');
});
test('invalid model output is rejected', () => {
  assert.throws(() => validateIdentification({ ...result, confidence: 4 }));
  assert.throws(() => validateIdentification({ ...result, bird: 'yes' }));
});
