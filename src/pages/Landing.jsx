import { useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import SegmentToggle from "../components/SegmentToggle";
import TimelineSection from "../components/TimeLineSection";
import ProjectsCarousel from "../components/ProjectCarousel";
import TechnologiesGrid from "../components/TechnologiesGrid";
import experience from "../data/experience.json";
import "../styles/landing.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileArrowDown, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faLinkedinIn, faGithub } from "@fortawesome/free-brands-svg-icons";
import { motion } from "framer-motion";
import { fadeUp } from "../animations/fadeUp";

import projectsData from "../data/projects.json";
import techData from "../data/technologies.json";

import "../styles/projects.css";
import "../styles/tech.css";
import "../styles/footer.css";

import { useNavigate } from "react-router-dom";

import { useEffect } from "react";
import { setMeta, setOg, setCanonical } from "../utills/seo";

function getLatestTimestamp(item) {
  if (!item.positions?.length) return 0;

  // Ongoing position -> highest priority
  if (item.positions.some((p) => !p.endDate)) return Number.MAX_SAFE_INTEGER;

  // Latest end date wins
  const ends = item.positions
    .map((p) => (p.endDate ? new Date(p.endDate).getTime() : 0))
    .filter(Boolean);

  return ends.length ? Math.max(...ends) : 0;
}

function sortLatestFirst(items) {
  return items
    .slice()
    .sort((a, b) => getLatestTimestamp(b) - getLatestTimestamp(a));
}

export default function Landing() {
  useEffect(() => {
    const base = "https://avivs-portfolio.onrender.com"; // render domain or custom domain
    document.title = "Aviv Tenenbaum | Full Stack & Game Dev";
    setMeta(
      "description",
      "Full Stack & Game Dev from Israel. React projects, experience, and contact."
    );
    setOg("og:title", "Aviv Tenenbaum | Full Stack & Game Dev");
    setOg(
      "og:description",
      "Full Stack & Game Dev from Israel. React projects, experience, and contact."
    );
    setOg("og:url", `${base}/`);
    setCanonical(`${base}/`);
  }, []);

  const navigate = useNavigate();

  const [segment, setSegment] = useState("left");

  const sortedWork = useMemo(() => sortLatestFirst(experience.work ?? []), []);
  const sortedEducation = useMemo(
    () => sortLatestFirst(experience.education ?? []),
    []
  );

  const items = segment === "left" ? sortedWork : sortedEducation;

  const openInNewTab = (url) =>
    window.open(url, "_blank", "noopener,noreferrer");

  return (
    <div className="landingRoot">
      <Navbar active="home" />

      <main className="landingMain">
        {/* HERO */}
        <motion.section
          className="hero"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="heroLeft"
            initial="hidden"
            animate="visible"
            transition={{ staggerChildren: 0.12 }}
          >
            <motion.p className="heroKicker" variants={fadeUp}>
              Hey, I&apos;m Aviv
            </motion.p>
            <motion.h1 className="heroTitle" variants={fadeUp}>
              Full Stack & Game Dev from Israel
            </motion.h1>
            <motion.p className="heroSubtitle" variants={fadeUp}>
              Loves <span className="pill">Coding</span>,{" "}
              <span className="pill">Tech</span>,{" "}
              <span className="pill">Gym</span> and{" "}
              <span className="pill">Producing Music</span>.
            </motion.p>

            <motion.div className="heroActions" variants={fadeUp}>
              {/* Resume button: text + icon */}
              <motion.button
                className="btnPrimary btnWithIcon"
                onClick={() => openInNewTab("/resume.pdf")}
                variants={fadeUp}
              >
                <span>Resume </span>
                <FontAwesomeIcon icon={faFileArrowDown} />
              </motion.button>

              {/* Icon-only buttons */}
              <div className="iconRow">
                <motion.button
                  className="btnIcon"
                  onClick={() =>
                    openInNewTab(
                      "https://linkedin.com/in/aviv-tenenbaum-haddar-0321b821b"
                    )
                  }
                  variants={fadeUp}
                  aria-label="LinkedIn"
                  title="LinkedIn"
                >
                  <FontAwesomeIcon icon={faLinkedinIn} />
                </motion.button>

                <motion.button
                  className="btnIcon"
                  onClick={() => openInNewTab("https://github.com/SwaggZ")}
                  variants={fadeUp}
                  aria-label="GitHub"
                  title="GitHub"
                >
                  <FontAwesomeIcon icon={faGithub} />
                </motion.button>

                <motion.button
                  className="btnIcon"
                  onClick={() => openInNewTab("mailto:Avivdth@gmail.com")}
                  variants={fadeUp}
                  aria-label="Email"
                  title="Email"
                >
                  <FontAwesomeIcon icon={faEnvelope} />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="heroRight"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: "easeOut" }}
          >
            <div className="photoFrame">
              {/* Put your real photo in public/images/me.jpg */}
              <img className="photo" src="/images/me.jpg" alt="Aviv" />
            </div>
          </motion.div>
        </motion.section>

        {/* WORK / EDUCATION */}
        <motion.section
          className="sectionBlock"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <div className="sectionTop">
            <SegmentToggle
              leftLabel="Work"
              rightLabel="Education"
              value={segment}
              onChange={setSegment}
            />
          </div>

          <TimelineSection
            key={segment}
            title={segment === "left" ? "Work" : "Education"}
            items={items}
          />
        </motion.section>
        <motion.div variants={fadeUp} initial="hidden" animate="visible">
          <ProjectsCarousel
            projects={(projectsData.featured ?? []).slice(0, 5)}
            onViewMore={() => navigate("/projects")}
          />
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" animate="visible">
          <TechnologiesGrid items={techData.items} />
        </motion.div>
      </main>
    </div>
  );
}
