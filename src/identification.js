export async function identifyPhoto(photo) {
  const image = new Image(); image.src = photo.url; await image.decode();
  const canvas = document.createElement('canvas'); canvas.width = 64; canvas.height = 64;
  const context = canvas.getContext('2d', { willReadFrequently: true }); context.drawImage(image, 0, 0, 64, 64);
  const pixels = context.getImageData(0, 0, 64, 64).data;
  let dark = 0;
  for (let i = 0; i < pixels.length; i += 4) if (0.2126 * pixels[i] + 0.7152 * pixels[i + 1] + 0.0722 * pixels[i + 2] < 55) dark++;
  const underexposed = dark / (pixels.length / 4) > 0.5;
  const response = await fetch('/api/identify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ image: photo.url }), signal: AbortSignal.timeout(250000) });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || 'Identification failed.');
  return underexposed ? { ...result, reviewRequired: true, reason: `${result.reason} Much of this image is in deep shadow; please verify the suggestion.` } : result;
}
export function applyIdentification(data, photo, result, manual = false) {
  const history = [...(photo.history || []), { ...result, decision: manual ? 'user-accepted' : 'model-suggestion' }];
  const updated = { ...photo, identification: result, history };
  const canGroup = result.bird && !result.multipleSpecies && result.common && result.scientific && (manual || (result.confidence >= 0.85 && result.taxonomyVerified !== false && !result.reviewRequired));
  const unidentified = data.unidentified.filter(p => p.id !== photo.id);
  if (!canGroup) return { ...data, unidentified: [{ ...updated, note: result.bird ? `Review: ${result.common || 'uncertain species'}` : 'No bird identified' }, ...unidentified] };
  const id = result.scientific.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const existing = data.birds.find(b => b.sci.toLowerCase() === result.scientific.toLowerCase());
  const bird = existing || { id: id || crypto.randomUUID(), common: result.common, sci: result.scientific, photos: [] };
  const changed = { ...bird, common: result.common, sci: result.scientific, photos: [...bird.photos, { ...updated, pinned: bird.photos.length === 0, fav: photo.fav || false }] };
  return { birds: existing ? data.birds.map(b => b.id === bird.id ? changed : b) : [...data.birds, changed], unidentified };
}
