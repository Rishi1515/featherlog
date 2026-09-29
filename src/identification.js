export async function identifyPhoto(photo) {
  const response = await fetch('/api/identify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ image: photo.url }), signal: AbortSignal.timeout(250000) });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || 'Identification failed.');
  return result;
}
export function applyIdentification(data, photo, result, manual = false) {
  const history = [...(photo.history || []), { ...result, decision: manual ? 'user-accepted' : 'model-suggestion' }];
  const updated = { ...photo, identification: result, history };
  const canGroup = result.bird && !result.multipleSpecies && result.common && result.scientific && (manual || (result.confidence >= 0.85 && result.taxonomyVerified !== false));
  const unidentified = data.unidentified.filter(p => p.id !== photo.id);
  if (!canGroup) return { ...data, unidentified: [{ ...updated, note: result.bird ? `Review: ${result.common || 'uncertain species'}` : 'No bird identified' }, ...unidentified] };
  const id = result.scientific.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const existing = data.birds.find(b => b.sci.toLowerCase() === result.scientific.toLowerCase());
  const bird = existing || { id: id || crypto.randomUUID(), common: result.common, sci: result.scientific, photos: [] };
  const changed = { ...bird, common: result.common, sci: result.scientific, photos: [...bird.photos, { ...updated, pinned: bird.photos.length === 0, fav: photo.fav || false }] };
  return { birds: existing ? data.birds.map(b => b.id === bird.id ? changed : b) : [...data.birds, changed], unidentified };
}
