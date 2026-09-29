import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Nav from './components/Nav';
import Gallery from './pages/Gallery';
import Species from './pages/Species';
import Unidentified from './pages/Unidentified';
import { loadCollection, saveCollection } from './dataStore';
import { processPhoto } from './photoUtils';
import { identifyPhoto, applyIdentification } from './identification';
import './styles/theme.css';

export default function App() {
  const [initial] = useState(() => {
    try { return { data: loadCollection() }; }
    catch (error) { return { error: error.message }; }
  });
  const [data, setData] = useState(initial.data);
  const [error, setError] = useState(initial.error || '');
  const [progress, setProgress] = useState('');
  const [engine, setEngine] = useState({ checking: true });
  useEffect(() => {
    fetch('/api/health').then(async response => ({ response, body: await response.json() }))
      .then(({ response, body }) => setEngine({ ...body, ready: response.ok && body.ready, checking: false }))
      .catch(() => setEngine({ ready: false, checking: false, error: 'Local AI service is not available.' }));
  }, []);
  async function analyze(next, photo) {
    try {
      const result = await identifyPhoto(photo);
      const candidate = applyIdentification(next, photo, result);
      return commit(candidate) ? candidate : next;
    } catch (e) {
      const candidate = { ...next, unidentified: next.unidentified.map(p => p.id === photo.id ? { ...p, note: `Identification failed: ${e.message}` } : p) };
      const saved = commit(candidate); setError(e.message); return saved ? candidate : next;
    }
  }
  async function identifyQueue(all = false) {
    let next = data;
    const photos = all ? [...data.unidentified, ...data.birds.flatMap(b => b.photos)] : data.unidentified;
    if (all) {
      next = { birds: data.birds.map(b => ({ ...b, photos: [] })), unidentified: photos };
      if (!commit(next)) return;
    }
    try {
      for (const [index, photo] of photos.entries()) {
        if (!photo.url) continue;
        setProgress(`Identifying ${index + 1} of ${photos.length} — ${photo.sourceName || 'photo'}…`);
        next = await analyze(next, photo);
      }
    } finally { setProgress(''); }
  }
  function commit(next) {
    try { saveCollection(next); setData(next); setError(''); return true; }
    catch { setError('Could not save. Browser storage may be full or disabled. Your collection has not changed.'); return false; }
  }
  function changeBird(id, transform) {
    return commit({ ...data, birds: data.birds.map(b => b.id === id ? transform(b) : b) });
  }
  async function upload(files) {
    let next = data;
    try { for (const [index, file] of files.entries()) {
      try {
        setProgress(`Importing ${index + 1} of ${files.length} — ${file.name}…`);
        const photo = await processPhoto(file);
        if ([...next.unidentified, ...next.birds.flatMap(b => b.photos)].some(p => p.fingerprint === photo.fingerprint)) continue;
        const candidate = { ...next, unidentified: [photo, ...next.unidentified] };
        if (!commit(candidate)) break;
        next = candidate;
        setProgress(`Identifying ${index + 1} of ${files.length} — ${file.name}… The first image may take a few minutes.`);
        next = await analyze(next, photo);
      } catch (e) { setError(`${file.name}: ${e.message}`); break; }
    } } finally { setProgress(''); }
  }
  function assign(photoId, birdId) {
    const photo = data.unidentified.find(p => p.id === photoId);
    if (!photo || !data.birds.some(b => b.id === birdId)) return false;
    return commit({ birds: data.birds.map(b => b.id === birdId ? { ...b, photos: [...b.photos, { ...photo, pinned: b.photos.length === 0, fav: false, history: [...(photo.history || []), { decision: 'manual', common: b.common, scientific: b.sci, identifiedAt: new Date().toISOString() }] }] } : b), unidentified: data.unidentified.filter(p => p.id !== photoId) });
  }
  function exportCollection() {
    const url = URL.createObjectURL(new Blob([JSON.stringify(data)], { type: 'application/json' }));
    const a = document.createElement('a'); a.href = url; a.download = 'featherlog-collection.json'; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return <>
    <Nav />
    <p style={{ padding: '0 28px' }}>Photos are analyzed by Ollama on this laptop. Species names are checked with GBIF; photos are never sent there. Clear suggestions are grouped automatically; uncertain images stay for review. AI can make mistakes.</p>
    <div className={`engine ${engine.ready ? 'ready' : 'offline'}`} role="status">
      <span aria-hidden="true">●</span> {engine.checking ? 'Checking local AI…' : engine.ready ? `AI ready · ${engine.model}` : `AI unavailable · ${engine.error}`}
    </div>
    {progress && <p role="status" style={{ padding: '0 28px' }}>{progress}</p>}
    {error && <p role="alert" style={{ padding: '12px 28px', color: '#a12b20' }}>{error}</p>}
    <fieldset disabled={!!progress || !engine.ready} style={{ border: 0, padding: 0, margin: 0 }}>
    {data && <div style={{ padding: '0 28px', display: 'flex', gap: 12 }}><button onClick={() => identifyQueue(true)}>Recheck all photos</button><button onClick={exportCollection}>Download collection backup</button></div>}
    {data && <Routes>
      <Route path="/" element={<Gallery birds={data.birds} />} />
      <Route path="/species/:id" element={<Species birds={data.birds}
        onPin={(id, pid) => changeBird(id, b => ({ ...b, photos: b.photos.map(p => ({ ...p, pinned: p.id === pid })) }))}
        onFav={(id, pid) => changeBird(id, b => ({ ...b, photos: b.photos.map(p => p.id === pid ? { ...p, fav: !p.fav } : p) }))}
        onReview={(id, pid) => { const photo = data.birds.find(b => b.id === id)?.photos.find(p => p.id === pid); if (photo) commit({ birds: data.birds.map(b => { if (b.id !== id) return b; const photos = b.photos.filter(p => p.id !== pid); if (photos.length && !photos.some(p => p.pinned)) photos[0] = { ...photos[0], pinned: true }; return { ...b, photos }; }), unidentified: [{ ...photo, note: 'Review requested' }, ...data.unidentified] }); }}
        onDelete={(id, pid) => changeBird(id, b => { const photos = b.photos.filter(p => p.id !== pid); if (photos.length && !photos.some(p => p.pinned)) photos[0] = { ...photos[0], pinned: true }; return { ...b, photos }; })} />} />
      <Route path="/unidentified" element={<Unidentified photos={data.unidentified} birds={data.birds} onUpload={upload} onAssign={assign} onIdentify={() => identifyQueue()} onAccept={pid => { const photo = data.unidentified.find(p => p.id === pid); return photo?.identification && commit(applyIdentification(data, photo, photo.identification, true)); }} onDelete={pid => commit({ ...data, unidentified: data.unidentified.filter(p => p.id !== pid) })} />} />
    </Routes>}
    </fieldset>
  </>;
}
