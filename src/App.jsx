import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Nav from './components/Nav';
import Gallery from './pages/Gallery';
import Species from './pages/Species';
import Unidentified from './pages/Unidentified';
import { loadCollection, saveCollection } from './dataStore';
import { processPhoto } from './photoUtils';
import './styles/theme.css';

export default function App() {
  const [initial] = useState(() => {
    try { return { data: loadCollection() }; }
    catch (error) { return { error: error.message }; }
  });
  const [data, setData] = useState(initial.data);
  const [error, setError] = useState(initial.error || '');
  function commit(next) {
    try { saveCollection(next); setData(next); setError(''); return true; }
    catch { setError('Could not save. Browser storage may be full or disabled. Your collection has not changed.'); return false; }
  }
  function changeBird(id, transform) {
    return commit({ ...data, birds: data.birds.map(b => b.id === id ? transform(b) : b) });
  }
  async function upload(files) {
    let next = data;
    for (const file of files) {
      try {
        const photo = await processPhoto(file);
        const candidate = { ...next, unidentified: [photo, ...next.unidentified] };
        if (!commit(candidate)) break;
        next = candidate;
      } catch (e) { setError(`${file.name}: ${e.message}`); break; }
    }
  }
  function assign(photoId, birdId) {
    const photo = data.unidentified.find(p => p.id === photoId);
    if (!photo || !data.birds.some(b => b.id === birdId)) return false;
    return commit({ birds: data.birds.map(b => b.id === birdId ? { ...b, photos: [...b.photos, { ...photo, pinned: b.photos.length === 0, fav: false }] } : b), unidentified: data.unidentified.filter(p => p.id !== photoId) });
  }
  return <>
    <Nav />
    <p style={{ padding: '0 28px' }}>Local demo · Photos stay in this browser. Species are assigned manually; Google Drive and AI identification are not connected. Clearing browser data removes this collection.</p>
    {error && <p role="alert" style={{ padding: '12px 28px', color: '#a12b20' }}>{error}</p>}
    {data && <Routes>
      <Route path="/" element={<Gallery birds={data.birds} />} />
      <Route path="/species/:id" element={<Species birds={data.birds}
        onPin={(id, pid) => changeBird(id, b => ({ ...b, photos: b.photos.map(p => ({ ...p, pinned: p.id === pid })) }))}
        onFav={(id, pid) => changeBird(id, b => ({ ...b, photos: b.photos.map(p => p.id === pid ? { ...p, fav: !p.fav } : p) }))}
        onDelete={(id, pid) => changeBird(id, b => { const photos = b.photos.filter(p => p.id !== pid); if (photos.length && !photos.some(p => p.pinned)) photos[0] = { ...photos[0], pinned: true }; return { ...b, photos }; })} />} />
      <Route path="/unidentified" element={<Unidentified photos={data.unidentified} birds={data.birds} onUpload={upload} onAssign={assign} onDelete={pid => commit({ ...data, unidentified: data.unidentified.filter(p => p.id !== pid) })} />} />
    </Routes>}
  </>;
}
