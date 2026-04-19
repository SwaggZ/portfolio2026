import { useCallback, useEffect, useRef, useState } from "react";
import {
  getResumeData,
  RESUME_DEFAULTS,
} from "../resume/getResumeData";

/* =======================
   A4 page constants
======================= */
const PAGE_MARGIN_MM = 12; // must match @page { margin }
const USABLE_W_MM = 210 - PAGE_MARGIN_MM * 2;
const USABLE_H_MM = 297 - PAGE_MARGIN_MM * 2;

/* Convert mm → px using the browser */
function mmToPx(mm) {
  const d = document.createElement("div");
  d.style.cssText = `position:fixed;visibility:hidden;height:${mm}mm;width:${mm}mm`;
  document.body.appendChild(d);
  const px = { w: d.offsetWidth, h: d.offsetHeight };
  document.body.removeChild(d);
  return px;
}

/* =======================
   Reduction sequence:
   Cut work positions first (3 → 2 → 1 → 0),
   then projects (3 → 2 → 1).
   Each step is a delta from RESUME_DEFAULTS.
======================= */
function buildSteps() {
  const { maxWork, maxPositionsPerOrg, maxProjects } = RESUME_DEFAULTS;

  const steps = [];

  // Start with full defaults
  let curWork = maxWork;
  let curPos = maxPositionsPerOrg;
  let curProj = maxProjects;

  steps.push({ maxWork: curWork, maxPositionsPerOrg: curPos, maxProjects: curProj });

  // Phase 1: reduce positions-per-org down to 1
  while (curPos > 1) {
    curPos--;
    steps.push({ maxWork: curWork, maxPositionsPerOrg: curPos, maxProjects: curProj });
  }

  // Phase 2: reduce work orgs down to 1
  while (curWork > 1) {
    curWork--;
    // reset positions back to default when dropping an org
    curPos = maxPositionsPerOrg;
    steps.push({ maxWork: curWork, maxPositionsPerOrg: curPos, maxProjects: curProj });
    while (curPos > 1) {
      curPos--;
      steps.push({ maxWork: curWork, maxPositionsPerOrg: curPos, maxProjects: curProj });
    }
  }

  // Phase 3: reduce projects
  while (curProj > 1) {
    curProj--;
    steps.push({ maxWork: curWork, maxPositionsPerOrg: curPos, maxProjects: curProj });
  }

  return steps;
}

const STEPS = buildSteps();

/* =======================
   Hook
======================= */
export default function useAutoFitResume() {
  const [stepIdx, setStepIdx] = useState(0);
  const pageRef = useRef(null);

  const data = getResumeData(STEPS[stepIdx]);

  /* ---- Measure after each render and decide if we need to shrink ---- */
  const measure = useCallback(() => {
    const el = pageRef.current;
    if (!el) return;

    const pageW = mmToPx(USABLE_W_MM).w;
    const maxH = mmToPx(USABLE_H_MM).h;

    // Constrain width for accurate height
    const prevW = el.style.width;
    const prevMaxW = el.style.maxWidth;
    el.style.width = `${pageW}px`;
    el.style.maxWidth = `${pageW}px`;
    el.style.zoom = "1";

    void el.offsetHeight; // force reflow
    const contentH = el.scrollHeight;

    el.style.width = prevW;
    el.style.maxWidth = prevMaxW;

    if (contentH > maxH) {
      if (stepIdx < STEPS.length - 1) {
        // Still have reduction steps — try next
        setStepIdx((i) => i + 1);
      } else {
        // Last resort: CSS zoom
        el.style.zoom = (maxH / contentH).toFixed(4);
      }
    } else {
      el.style.zoom = "";
    }
  }, [stepIdx]);

  // Measure after DOM updates
  useEffect(() => {
    // Use requestAnimationFrame to ensure paint is done
    const id = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(id);
  }, [measure]);

  // Also measure on beforeprint (user might resize window then print)
  useEffect(() => {
    const el = pageRef.current;
    if (!el) return;

    function onBeforePrint() {
      const pageW = mmToPx(USABLE_W_MM).w;
      const maxH = mmToPx(USABLE_H_MM).h;

      el.style.width = `${pageW}px`;
      el.style.maxWidth = `${pageW}px`;
      el.style.zoom = "1";
      void el.offsetHeight;

      const contentH = el.scrollHeight;
      el.style.width = "";
      el.style.maxWidth = "";

      if (contentH > maxH) {
        el.style.zoom = (maxH / contentH).toFixed(4);
      }
    }

    function onAfterPrint() {
      el.style.zoom = "";
    }

    window.addEventListener("beforeprint", onBeforePrint);
    window.addEventListener("afterprint", onAfterPrint);
    return () => {
      window.removeEventListener("beforeprint", onBeforePrint);
      window.removeEventListener("afterprint", onAfterPrint);
    };
  }, []);

  return { pageRef, data };
}
