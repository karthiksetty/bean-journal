// "Opens elsewhere" arrow, drawn as a shape because phones show the ↗ character as an emoji.
export default function Arrow() {
  return (
    <svg viewBox="0 0 12 12" width="0.62em" height="0.62em" aria-hidden="true" style={{ display: "inline-block", marginLeft: "0.28em", verticalAlign: "0.06em" }}>
      <path d="M2 10 10 2M3.6 2H10V8.4" fill="none" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}
