import test from 'node:test';
import assert from 'node:assert/strict';
import { schema } from '../server/vision.js';

test('vision output schema requires every review field', () => {
  assert.deepEqual(schema.required.sort(), ['bird', 'common', 'confidence', 'multipleSpecies', 'reason', 'scientific'].sort());
  assert.equal(schema.additionalProperties, false);
});
