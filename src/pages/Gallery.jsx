import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Photo from "../components/Photo";

// Varied heights give the masonry its organic feel.
const HEIGHTS = [200, 260, 150, 180, 230, 160, 210, 190];

export default function Gallery({ birds }) {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("All birds");
  const filters = ["All birds", "With photos"];

  const totalPhotos = birds.reduce((n, b) => n + b.photos.length, 0);

  return (
    <div className="wrap">
      <div className="filterbar">
        <span style={{ fontSize: 12, color: "var(--muted)", marginRight: 4 }}>Filter</span>
        {filters.map((f) => (
          <span key={f} className={`chip ${filter === f ? "on" : ""}`} onClick={() => setFilter(f)}>
            {f}
          </span>
        ))}
        <span className="count">{totalPhotos} photos · {birds.length} species</span>
      </div>

      <div className="masonry">
        {birds.filter(b => filter !== 'With photos' || b.photos.length > 0).map((b, i) => {
          const pinned = b.photos.find((p) => p.pinned) || b.photos[0];
          return (
            <div key={b.id} className="card" onClick={() => navigate(`/species/${b.id}`)}>
              <Photo url={pinned?.url} tone={pinned?.tone} height={HEIGHTS[i % HEIGHTS.length]} />
              <div className="label">
                <div className="cn">{b.common}</div>
                <div className="sci">{b.sci}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
