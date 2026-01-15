import { useMemo, useState } from "react";
import "./../styles/projects.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faArrowUpRightFromSquare,
  faImage,
} from "@fortawesome/free-solid-svg-icons";
import { AnimatePresence, motion } from "framer-motion";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

const swipeConfidenceThreshold = 9000;
const swipePower = (offset, velocity) => Math.abs(offset) * velocity;

export default function ProjectsCarousel({ projects = [], onViewMore }) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const total = projects.length;

  const safeIndex = useMemo(() => {
    if (total === 0) return 0;
    return Math.max(0, Math.min(index, total - 1));
  }, [index, total]);

  const current = projects[safeIndex];

  const goPrev = () => {
    if (total <= 1) return;
    setDirection(-1);
    setIndex((i) => (i - 1 + total) % total);
  };

  const goNext = () => {
    if (total <= 1) return;
    setDirection(1);
    setIndex((i) => (i + 1) % total);
  };

  const openInNewTab = (url) =>
    window.open(url, "_blank", "noopener,noreferrer");

  if (!current) return null;

  const slideFade = {
    enter: (dir) => ({
      opacity: 0,
      x: dir > 0 ? 22 : -22,
      filter: "blur(2px)",
    }),
    center: {
      opacity: 1,
      x: 0,
      filter: "blur(0px)",
      transition: { duration: 0.32, ease: [0.2, 0.9, 0.2, 1] },
    },
    exit: (dir) => ({
      opacity: 0,
      x: dir > 0 ? -22 : 22,
      filter: "blur(2px)",
      transition: { duration: 0.22, ease: "easeInOut" },
    }),
  };

  return (
    <section className="projSection">
      <motion.div
        className="projCard"
        layout
        transition={{ duration: 0.28, ease: [0.2, 0.9, 0.2, 1] }}
      >
        {/* HEADER */}
        <div className="projCardHeader">
          <div>
            <h2 className="projTitle">My Projects</h2>
            <p className="projSubtitle">
              Swipe through couple of my favorite personal projects.
            </p>
          </div>

          <button className="projViewMore" onClick={onViewMore}>
            View more <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
          </button>
        </div>

        {/* SWIPE AREA (media + meta) */}
        <motion.div
          className="projSwipeArea"
          drag={total > 1 ? "x" : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          whileTap={{ cursor: "grabbing" }}
          onDragEnd={(_, info) => {
            if (total <= 1) return;

            const swipe = Math.abs(info.offset.x) * info.velocity.x;

            if (swipe < -9000) goNext();
            else if (swipe > 9000) goPrev();
          }}
        >
          {/* MEDIA */}
          <div className="projMedia">
            <button
              className="projNav projNavLeft"
              onClick={goPrev}
              aria-label="Previous project"
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>

            <div className="projImageWrap">
              <AnimatePresence mode="wait" initial={false} custom={direction}>
                {current.image ? (
                  <motion.img
                    key={current.id}
                    className="projImage"
                    src={current.image}
                    alt={current.title}
                    loading="lazy"
                    variants={slideFade}
                    custom={direction}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    draggable={false}
                  />
                ) : (
                  <motion.div
                    key={current.id + "-placeholder"}
                    className="projPlaceholder"
                    variants={slideFade}
                    custom={direction}
                    initial="enter"
                    animate="center"
                    exit="exit"
                  >
                    <span>
                      <FontAwesomeIcon icon={faImage} />
                      <br />
                      This project has no image yet
                      <br />
                      Come back later
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              className="projNav projNavRight"
              onClick={goNext}
              aria-label="Next project"
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>

          {/* META */}
          <div className="projMeta">
            <AnimatePresence mode="wait" initial={false} custom={direction}>
              <motion.div
                key={current.id + "-meta"}
                layout
                variants={slideFade}
                custom={direction}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <h3 className="projName">{current.title}</h3>
                <p className="projDesc">{current.description}</p>

                <div className="projTags">
                  {current.tags?.map((t) => (
                    <span key={t} className="projTag">
                      {t}
                    </span>
                  ))}
                </div>

                <div className="projLinks">
                  {current.sourceUrl && (
                    <button
                      className="projLinkBtn"
                      onClick={() => openInNewTab(current.sourceUrl)}
                    >
                      <FontAwesomeIcon icon={faGithub} /> Source
                    </button>
                  )}
                  {current.liveUrl && (
                    <button
                      className="projLinkBtn"
                      onClick={() => openInNewTab(current.liveUrl)}
                    >
                      <FontAwesomeIcon icon={faArrowUpRightFromSquare} /> Live
                    </button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            {total > 1 && (
              <div className="projDots">
                {projects.map((p, i) => (
                  <button
                    key={p.id}
                    className={`projDot ${i === safeIndex ? "active" : ""}`}
                    onClick={() => {
                      setDirection(i > safeIndex ? 1 : -1);
                      setIndex(i);
                    }}
                    aria-label={`Go to ${p.title}`}
                  />
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
