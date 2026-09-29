import { useParams, useNavigate, Link } from "react-router-dom";
import Photo from "../components/Photo";

export default function Species({ birds, onPin, onFav, onDelete, onReview }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const bird = birds.find((b) => b.id === id);

  if (!bird) {
    return (
      <div className="empty">
        <div className="big">Species not found</div>
        <Link to="/" style={{ color: "var(--leaf)" }}>Back to gallery</Link>
      </div>
    );
  }

  const featured = bird.photos.find((p) => p.pinned) || bird.photos[0];


  return (
    <div className="wrap">
      <div className="crumb">
        <button
          onClick={() => navigate("/")}
          style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)", display: "flex" }}
          aria-label="Back"
        >
          ←
        </button>
        <span>Gallery</span>
        <span className="sep">/</span>
        <span className="here">{bird.common}</span>
      </div>

      {/* Featured photo + info */}
      <div className="hero">
        <div className="hero-img">
          {featured ? <Photo url={featured.url} tone={featured.tone} height={300} radius={12} /> : <div className="empty">No photos left</div>}
        </div>
        <div className="hero-info">
          <h1>{bird.common}</h1>
          <div className="sci">{bird.sci}</div>
          <div className="badge">{featured?.identification ? 'AI identification · reviewable' : 'Manually curated species'}</div>
          <div className="meta">
            <div><span className="k">Featured photo coordinates</span> · {featured?.coords || 'No GPS data'}</div>
            <div><span className="k">Photos</span> · {bird.photos.length} in this set</div>
          </div>
        </div>
      </div>

      {/* Stacked set of all photos of this bird */}
      <div className="section-head">
        <span className="t">All photos of this bird</span>
        <span className="s">{bird.photos.length} photos · scroll to see all</span>
      </div>

      <div className="setgrid">
        {bird.photos.map((p) => (
          <div key={p.id} className="pcard">
            <div className="pimg">
              <Photo url={p.url} tone={p.tone} height={130} />
              {p.pinned && <span className="pin-tag">📌 Pinned</span>}
            </div>
            <div className="actions">
              <button onClick={() => onReview(bird.id, p.id)}>Review / correct</button>
              <button
                className={`ico ${p.pinned ? "pinned" : ""}`}
                title={p.pinned ? "Pinned (shown on gallery)" : "Pin to gallery"}
                onClick={() => onPin(bird.id, p.id)}
              >
                📌
              </button>
              <button
                className={`ico ${p.fav ? "faved" : ""}`}
                title={p.fav ? "Favorited" : "Favorite"}
                onClick={() => onFav(bird.id, p.id)}
              >
                {p.fav ? "♥" : "♡"}
              </button>
              <button
                className="ico trash"
                title="Delete"
                onClick={() => onDelete(bird.id, p.id)}
              >
                🗑
              </button>
            </div>
            <div style={{ padding: 12, fontSize: 14 }}>
              <div>{p.sourceName} · {p.date}</div><div>{p.cam} · {p.lens} · {p.exp}</div>
              {p.identification?.taxonomySource && <a href={p.identification.taxonomySource} target="_blank" rel="noreferrer">Species reference · GBIF</a>}
              {p.identification && <><p>{p.identification.reason}</p><small>{p.identification.model} · {Math.round(p.identification.confidence * 100)}% model certainty (not measured accuracy)</small></>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
