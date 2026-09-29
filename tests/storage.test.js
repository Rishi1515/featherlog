import test from 'node:test';
import assert from 'node:assert/strict';
import { loadCollection, saveCollection } from '../src/dataStore.js';
const memory = () => { let value = null; return { getItem: () => value, setItem: (_, next) => { value = next; } }; };
test('fresh collection has no invented photographs; empty queue stays empty after reload', () => {
  const storage = memory();
  const data = loadCollection(storage);
  assert.equal(data.unidentified.length, 0);
  assert.ok(data.birds.every(b => b.photos.length === 0));
  data.birds[0].photos.push({ id: 'photo', url: 'data:image/png;base64,test', pinned: true });
  saveCollection(data, storage);
  assert.deepEqual(loadCollection(storage), data);
});
test('failed storage writes preserve the prior saved collection', () => {
  const storage = memory();
  const data = loadCollection(storage);
  saveCollection(data, storage);
  const failure = { getItem: storage.getItem, setItem: () => { throw new Error('QuotaExceededError'); } };
  assert.throws(() => saveCollection({ ...data, unidentified: [{ id: 'new' }] }, failure));
  assert.deepEqual(loadCollection(storage), data);
});
test('corrupt data is rejected without being overwritten', () => {
  let wrote = false;
  assert.throws(() => loadCollection({ getItem: () => '{invalid', setItem: () => { wrote = true; } }));
  assert.equal(wrote, false);
});
