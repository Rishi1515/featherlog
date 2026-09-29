// Renders a real image when `url` is present; otherwise falls back to the
// gradient "tone" placeholder used by the sample data.
export default function Photo({ url, tone, height = 200, radius = 0 }) {
  if (url) {
    return (
      <img
        src={url}
        alt=""
        style={{
          width: "100%",
          height: `${height}px`,
          objectFit: "cover",
          display: "block",
          borderRadius: `${radius}px`,
        }}
      />
    );
  }
  return (
    <div
      style={{
        width: "100%",
        height: `${height}px`,
        background: tone,
        borderRadius: `${radius}px`,
      }}
    />
  );
}
