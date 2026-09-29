import { useState, useRef } from "react";
import Photo from "../components/Photo";

export default function Unidentified({ photos, birds, onAssign, onDelete, onUpload }) {
  const [openId, setOpenId] = useState(null);
  const [choice, setChoice] = useState("");
  const [busy, setBusy] = useState(false);
  const fileRef = useRef(null);

  const open = photos.find((p) => p.id === openId);

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setBusy(true);
    try {
      await onUpload(files);
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="wrap">
      <div className="section-head" style={{ borderTop: "none" }}>
        <span className="t">Awaiting identification</span>
        <span className="s">{photos.length} photos · assign a species manually</span>
      </div>

      <div style={{ padding: "0 28px 8px" }}>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          aria-label="Upload photos"
          multiple
          onChange={handleFiles}
          style={{ display: "none" }}
        />
        <button
          className="play"
          style={{ marginTop: 0, width: "auto", padding: "10px 18px", opacity: busy ? 0.6 : 1 }}
          disabled={busy}
          onClick={() => fileRef.current?.click()}
        >
          {busy ? "Processing…" : "＋ Upload photos"}
        </button>
      </div>

      {photos.length === 0 && !busy ? (
        <div className="empty">
          <div className="big">All caught up</div>
          Every photo has been identified or assigned. Upload more to test.
        </div>
      ) : (
        <div className="setgrid">
          {photos.map((p) => (
            <div key={p.id} className="pcard">
              <div className="pimg" style={{ cursor: "pointer" }} onClick={() => { setOpenId(p.id); setChoice(""); }}>
                <Photo url={p.url} tone={p.tone} height={130} />
              </div>
              <div style={{ padding: "9px 12px" }}>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>{p.note}</div>
                <div style={{ fontSize: 11, color: "var(--faint)", marginTop: 2 }}>{p.date}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {open && (
        <div style={{ background: "rgba(47,58,36,0.35)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, borderRadius: 12, margin: "0 28px 28px" }}>
          <div style={{ background: "var(--paper)", borderRadius: 12, padding: 20, width: 420, maxWidth: "100%" }}>
            <Photo url={open.url} tone={open.tone} height={160} radius={10} />
            <div style={{ marginTop: 14, fontSize: 13, color: "var(--muted)" }}>{open.note} · {open.date}</div>
            <div style={{ marginTop: 6, fontSize: 12, color: "var(--faint)" }}>{open.cam} · {open.coords}</div>
            <div style={{ marginTop: 16, fontSize: 13, color: "var(--ink)" }}>Which bird is this?</div>
            <select
              value={choice}
              onChange={(e) => setChoice(e.target.value)}
              style={{ width: "100%", marginTop: 8, padding: 10, borderRadius: 8, border: "0.5px solid var(--line)", background: "var(--white)", fontSize: 14 }}
            >
              <option value="">Select a species…</option>
              {birds.map((b) => (
                <option key={b.id} value={b.id}>{b.common}</option>
              ))}
            </select>
            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
              <button
                className="play"
                style={{ marginTop: 0, opacity: choice ? 1 : 0.5 }}
                disabled={!choice}
                onClick={() => { if (onAssign(open.id, choice)) setOpenId(null); }}
              >
                Assign to species
              </button>
              <button
                onClick={() => { if (onDelete(open.id)) setOpenId(null); }}
                style={{ background: "none", border: "0.5px solid var(--line)", borderRadius: 10, padding: "0 16px", color: "var(--coral)", cursor: "pointer" }}
              >
                Delete
              </button>
              <button
                onClick={() => setOpenId(null)}
                style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer" }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
