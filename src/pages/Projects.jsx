import { useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import projectsData from "../data/projects.json";
import "../styles/projectsPage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpRightFromSquare,
  faCode,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { fadeUp } from "../animations/fadeUp";

import { useEffect } from "react";
import { setMeta, setOg, setCanonical } from "../utills/seo";

function openInNewTab(url) {
  window.open(url, "_blank", "noopener,noreferrer");
}

function uniqTags(projects) {
  const set = new Set();
  for (const p of projects) {
    (p.tags || []).forEach((t) => set.add(t));
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

export default function Projects() {
  useEffect(() => {
    const base = "https://avivs-portfolio.onrender.com";
    document.title = "Projects | Aviv Tenenbaum";
    setMeta(
      "description",
      "A curated list of my projects, including source code and live demos."
    );
    setOg("og:title", "Projects | Aviv Tenenbaum");
    setOg(
      "og:description",
      "A curated list of my projects, including source code and live demos."
    );
    setOg("og:url", `${base}/projects`);
    setCanonical(`${base}/projects`);
  }, []);

  const allProjects = projectsData.all ?? projectsData.featured ?? []; // supports both structures

  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("All");
  const [sort, setSort] = useState("newest"); // newest | oldest | az

  const tags = useMemo(() => ["All", ...uniqTags(allProjects)], [allProjects]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    let list = allProjects.filter((p) => {
      const matchesQuery =
        !q ||
        p.title?.toLowerCase().includes(q) ||
        p.subtitle?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        (p.tags || []).some((t) => t.toLowerCase().includes(q));

      const matchesTag = tag === "All" || (p.tags || []).includes(tag);

      return matchesQuery && matchesTag;
    });

    if (sort === "az") {
      list = list
        .slice()
        .sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    } else if (sort === "oldest") {
      list = list.slice().reverse();
    } // newest = json order

    return list;
  }, [allProjects, query, tag, sort]);

  return (
    <div className="projectsRoot">
      <Navbar active="projects" />

      <motion.main
        className="projectsMain"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        <motion.header
          className="projectsHeader"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <div>
            <h1 className="projectsTitle">Projects</h1>
            <p className="projectsSubtitle">
              A collection of projects I built — personal, academic, and
              experimental.
            </p>
          </div>

          <div className="projectsControls">
            <div className="searchWrap">
              <FontAwesomeIcon icon={faMagnifyingGlass} />
              <input
                className="searchInput"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search projects..."
              />
            </div>

            <select
              className="select"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
            >
              {tags.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            <select
              className="select"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="az">A–Z</option>
            </select>
          </div>
        </motion.header>

        <motion.section
          className="projectsGrid"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          {filtered.map((p) => (
            <motion.article
              key={p.id}
              className="pCard"
              variants={fadeUp}
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25, ease: "easeOut" }}
            >
              <div className="pMedia">
                {p.image ? (
                  <img
                    className="pImg"
                    src={p.image}
                    alt={p.title}
                    loading="lazy"
                  />
                ) : (
                  <div className="pPlaceholder">No image yet</div>
                )}
              </div>

              <div className="pBody">
                <div className="pTop">
                  <h3 className="pName">{p.title}</h3>
                  {p.subtitle ? <p className="pSub">{p.subtitle}</p> : null}
                  {p.description ? (
                    <p className="pDesc">{p.description}</p>
                  ) : null}
                </div>

                <div className="pTags">
                  {(p.tags || []).slice(0, 8).map((t) => (
                    <span key={t} className="pTag">
                      {t}
                    </span>
                  ))}
                </div>

                <div className="pLinks">
                  {p.sourceUrl ? (
                    <button
                      className="pBtn"
                      onClick={() => openInNewTab(p.sourceUrl)}
                    >
                      <FontAwesomeIcon icon={faCode} /> Source
                    </button>
                  ) : null}

                  {p.liveUrl ? (
                    <button
                      className="pBtn"
                      onClick={() => openInNewTab(p.liveUrl)}
                    >
                      <FontAwesomeIcon icon={faArrowUpRightFromSquare} /> Live
                    </button>
                  ) : null}
                </div>
              </div>
            </motion.article>
          ))}

          {filtered.length === 0 ? (
            <div className="emptyState">No projects found.</div>
          ) : null}
        </motion.section>
      </motion.main>
    </div>
  );
}
