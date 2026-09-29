import { initialBirds } from './data/birds.js';
export const STORAGE_KEY = 'featherlog-demo-v1';
export function loadCollection(storage = localStorage) {
  const saved = storage.getItem(STORAGE_KEY);
  if (saved !== null) {
    const data = JSON.parse(saved);
    if (!Array.isArray(data.birds) || !Array.isArray(data.unidentified)) throw new Error('Saved collection is invalid. Your data has not been overwritten.');
    return data;
  }
  return { birds: initialBirds.map(({ id, common, sci }) => ({ id, common, sci, photos: [] })), unidentified: [] };
}
export function saveCollection(data, storage = localStorage) {
  storage.setItem(STORAGE_KEY, JSON.stringify(data));
}
