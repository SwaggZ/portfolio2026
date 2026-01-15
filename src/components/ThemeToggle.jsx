import { AnimatePresence, motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "../theme/ThemeContext";
import "./../styles/themeToggle.css";

const sunVariants = {
  initial: { opacity: 0, y: -10, rotate: -20, scale: 0.85 },
  animate: {
    opacity: 1,
    y: 0,
    rotate: 0,
    scale: 1,
    transition: { duration: 0.28, ease: [0.2, 0.9, 0.2, 1] },
  },
  exit: {
    opacity: 0,
    y: 14, // 👈 sun “sets”
    rotate: 20,
    scale: 0.85,
    transition: { duration: 0.22, ease: "easeInOut" },
  },
};

const moonVariants = {
  initial: { opacity: 0, y: 14, rotate: 20, scale: 0.85 }, // 👈 moon “rises”
  animate: {
    opacity: 1,
    y: 0,
    rotate: 0,
    scale: 1,
    transition: { duration: 0.28, ease: [0.2, 0.9, 0.2, 1] },
  },
  exit: {
    opacity: 0,
    y: -10,
    rotate: -20,
    scale: 0.85,
    transition: { duration: 0.22, ease: "easeInOut" },
  },
};

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <motion.button
      type="button"
      className="themeToggle"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      whileTap={{ scale: 0.96 }}
    >
      <span className="themeToggleInner">
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.span
              key="moon"
              className="themeIcon"
              variants={moonVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <FontAwesomeIcon icon={faMoon} />
            </motion.span>
          ) : (
            <motion.span
              key="sun"
              className="themeIcon"
              variants={sunVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <FontAwesomeIcon icon={faSun} />
            </motion.span>
          )}
        </AnimatePresence>
      </span>
    </motion.button>
  );
}
