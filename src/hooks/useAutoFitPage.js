import { useEffect, useRef } from "react";
import { getResumeData } from "../resume/getResumeData";

/* =======================
   A4 page constants
======================= */
const PAGE_MARGIN_MM = 12; // must match @page { margin }
const USABLE_H_MM = 297 - PAGE_MARGIN_MM * 2;

/* Convert mm → px using the browser */
function mmToPx(mm) {
  const d = document.createElement("div");
  d.style.cssText = `position:fixed;visibility:hidden;height:${mm}mm`;
  document.body.appendChild(d);
  const h = d.offsetHeight;
  document.body.removeChild(d);
  return h;
}

/* =======================
   Hook – renders max content, auto-zooms on print
======================= */
export default function useAutoFitResume() {
  const pageRef = useRef(null);
  const data = getResumeData(); // full defaults

  useEffect(() => {
    const el = pageRef.current;
    if (!el) return;

    function onBeforePrint() {
      const maxH = mmToPx(USABLE_H_MM);

      // Reset so measurement is clean
      el.style.zoom = "1";
      void el.offsetHeight;

      const contentH = el.scrollHeight;

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
