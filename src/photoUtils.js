// Turns an uploaded File into a compact browser-local record:
// a shrunk base64 image + whatever EXIF/geo data the photo carries.
import imageCompression from "browser-image-compression";
import exifr from "exifr";

// Keep individual photos small; browser storage capacity is still limited.
const COMPRESS_OPTS = {
  maxSizeMB: 0.4,
  maxWidthOrHeight: 1400,
  useWebWorker: true,
};

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function fmtDate(d) {
  if (!d) return "Unknown date";
  try {
    if (!Number.isFinite(new Date(d).getTime())) return 'Unknown date';
    return new Date(d).toLocaleDateString("en-GB", {
      day: "2-digit", month: "short", year: "numeric",
    });
  } catch {
    return "Unknown date";
  }
}

export async function processPhoto(file) {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) throw new Error('Choose a JPEG, PNG, or WebP image.');
  if (file.size > 20 * 1024 * 1024) throw new Error('Choose an image under 20 MB.');
  // Read EXIF from the ORIGINAL file (compression strips it).
  let exif = {};
  try {
    exif = (await exifr.parse(file, { gps: true })) || {};
  } catch {
    exif = {};
  }

  // Compress, then convert to a base64 data URL for storage.
  let dataUrl;
  try {
    const compressed = await imageCompression(file, COMPRESS_OPTS);
    dataUrl = await fileToDataUrl(compressed);
  } catch {
    throw new Error('Image could not be compressed. Try a different image.');
  }

  const lat = exif.latitude;
  const lng = exif.longitude;
  const coords = Number.isFinite(lat) && Number.isFinite(lng) ? `${lat.toFixed(2)}°, ${lng.toFixed(2)}°` : "No GPS data";

  const cam = [exif.Make, exif.Model].filter(Boolean).join(" ").trim() || "Unknown camera";
  const lens = exif.LensModel || exif.LensInfo || "—";

  const parts = [];
  if (exif.ExposureTime) parts.push(`1/${Math.round(1 / exif.ExposureTime)}`);
  if (exif.FNumber) parts.push(`f/${exif.FNumber}`);
  if (exif.ISO) parts.push(`ISO ${exif.ISO}`);
  const exp = parts.join(" · ") || "—";

  return {
    sourceName: file.name,
    sourcePath: file.webkitRelativePath || file.name,
    fingerprint: Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', await file.arrayBuffer()))).map(b => b.toString(16).padStart(2, '0')).join(''),
    id: `up_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    url: dataUrl,               // real image, shown via <img>
    date: fmtDate(exif.DateTimeOriginal || exif.CreateDate),
    cam,
    lens,
    exp,
    coords,
    note: "Uploaded — awaiting ID",
  };
}
