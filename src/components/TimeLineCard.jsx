import "./../styles/timeline.css";

function formatMonthYear(isoDate) {
  if (!isoDate) return "";
  const d = new Date(isoDate);
  const month = d.toLocaleString("en-US", { month: "short" });
  const year = d.getFullYear();
  return `${month} ${year}`;
}

function sortPositionsLatestFirst(positions = []) {
  return positions.slice().sort((a, b) => {
    // ongoing first
    if (!a.endDate && !b.endDate) return 0;
    if (!a.endDate) return -1;
    if (!b.endDate) return 1;

    // latest end date first
    return new Date(b.endDate) - new Date(a.endDate);
  });
}

function getGroupRange(positions) {
  const starts = positions
    .map((p) => new Date(p.startDate).getTime())
    .filter(Boolean);
  const ends = positions
    .map((p) => (p.endDate ? new Date(p.endDate).getTime() : null))
    .filter((v) => v !== null);

  const minStart = starts.length ? new Date(Math.min(...starts)) : null;
  const maxEnd = ends.length ? new Date(Math.max(...ends)) : null;

  const startLabel = minStart ? formatMonthYear(minStart.toISOString()) : "";
  const endLabel = positions.some((p) => !p.endDate)
    ? "Present"
    : maxEnd
    ? formatMonthYear(maxEnd.toISOString())
    : "";

  if (!startLabel) return "";
  return `${startLabel} — ${endLabel || "Present"}`;
}

export default function TimelineCard({ item }) {
  const positions = item.positions || [];
  const hasMultiplePositions = positions.length > 1;
  const groupDates = hasMultiplePositions ? getGroupRange(positions) : "";

  return (
    <article className="tCard">
      <div className="tLogoWrap">
        <img className="tLogo" src={item.image} alt={item.org} loading="lazy" />
      </div>

      <div className="tContent">
        <div className="tHeaderRow">
          <h3 className="tOrg">{item.org}</h3>
          {groupDates ? <div className="tDates">{groupDates}</div> : null}
        </div>

        <div className="tPositions">
          {sortPositionsLatestFirst(positions).map((p) => {
            const start = formatMonthYear(p.startDate);
            const end = p.endDate ? formatMonthYear(p.endDate) : "Present";

            return (
              <div key={p.id} className="tPos">
                <div className="tPosTop">
                  <div className="tRole">{p.role}</div>
                  <div className="tPosDates">
                    {start} — {end}
                  </div>
                </div>

                {p.description ? (
                  <p className="tDesc">{p.description}</p>
                ) : null}

                {p.bullets?.length ? (
                  <ul className="tBullets">
                    {p.bullets.map((b, idx) => (
                      <li key={idx}>{b}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </article>
  );
}
