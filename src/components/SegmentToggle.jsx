import "./../styles/toggle.css";

export default function SegmentToggle({ leftLabel, rightLabel, value, onChange }) {
  const isRight = value === "right";

  return (
    <div
      className="segWrap"
      role="tablist"
      aria-label="Section toggle"
      style={{ ["--seg-x"]: isRight ? "1" : "0" }}
    >
      <div className="segIndicator" aria-hidden="true" />

      <button
        type="button"
        className={`segBtn ${value === "left" ? "selected" : ""}`}
        onClick={() => onChange("left")}
        role="tab"
        aria-selected={value === "left"}
      >
        {leftLabel}
      </button>

      <button
        type="button"
        className={`segBtn ${value === "right" ? "selected" : ""}`}
        onClick={() => onChange("right")}
        role="tab"
        aria-selected={value === "right"}
      >
        {rightLabel}
      </button>
    </div>
  );
}
