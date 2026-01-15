import { useEffect, useMemo, useState } from "react";
import "./../styles/tech.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHtml5,
  faCss3Alt,
  faJs,
  faNodeJs,
  faPython,
  faJava,
  faGitAlt,
  faGithub,
  faReact,
} from "@fortawesome/free-brands-svg-icons";
import {
  faCloudMeatball,
  faCode,
  faHashtag,
  faPepperHot,
  faServer,
} from "@fortawesome/free-solid-svg-icons";

/**
 * Map string names from JSON to FA icons
 */
const iconMap = {
  faHtml5,
  faCss3Alt,
  faJs,
  faTypeScript: faCode,
  faReact,
  faNodeJs,
  faPython,
  faJava,
  faGitAlt,
  faGithub,
  faPepperHot,
  faHashtag,
  faCloudMeatball,
  faServer,
};

function pickBestCols(total, width) {
  // breakpoint defaults
  const base = width <= 680 ? 4 : width <= 980 ? 6 : 8;

  // only do "equal rows" logic on desktop/tablet-ish sizes
  // (you can allow it everywhere if you want)
  const candidates =
    width <= 680 ? [4] : width <= 980 ? [6, 5, 4] : [8, 7, 6, 5, 4];

  // Prefer perfect division (equal rows)
  const perfect = candidates.find((c) => total % c === 0);
  if (perfect) return perfect;

  // Otherwise, keep the base cols
  return base;
}

export default function TechnologiesGrid({ items = [] }) {
  const [cols, setCols] = useState(() =>
    pickBestCols(items.length, window.innerWidth)
  );

  useEffect(() => {
    const onResize = () =>
      setCols(pickBestCols(items.length, window.innerWidth));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [items.length]);

  const gridMeta = useMemo(() => {
    const total = items.length;
    const remainder = total % cols;

    // If perfectly filled, no centering needed
    if (remainder === 0) return { firstLastRowIndex: -1, startCol: 1 };

    const firstLastRowIndex = total - remainder;

    // Center last row by shifting the FIRST item in that row
    // startCol = floor((cols - remainder) / 2) + 1
    const startCol = Math.floor((cols - remainder) / 2) + 1;

    return { firstLastRowIndex, startCol };
  }, [items.length, cols]);

  return (
    <section className="techSection">
      <h2 className="techTitle">Technologies</h2>
      <p className="techSubtitle">
        Here are some tools and technologies I’ve already worked with:
      </p>

      <div className="techGrid" style={{ "--cols": cols }}>
        {items.map((t, idx) => {
          const icon = iconMap[t.fa] || faCode;

          const isFirstOfLastRow = idx === gridMeta.firstLastRowIndex;
          const style = isFirstOfLastRow
            ? { gridColumnStart: gridMeta.startCol }
            : undefined;

          return (
            <div key={t.id} className="techItem" style={style}>
              <FontAwesomeIcon
                icon={icon}
                className="techFaIcon"
                style={{ color: t.color || "#fff" }}
              />
              <div className="techTooltip">{t.name}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
