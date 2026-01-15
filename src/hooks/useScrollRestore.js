import { useEffect } from "react";

const KEY = "scrollY";

export default function useScrollRestore() {
  useEffect(() => {
    // Let the browser try first, but we control it precisely
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const saved = sessionStorage.getItem(KEY);
    const y = saved ? parseInt(saved, 10) : 0;

    // Restore AFTER layout/paint (prevents "few px off")
    const restore = () => {
      window.scrollTo({ top: y, left: 0, behavior: "auto" });
    };

    // 1) next frame
    requestAnimationFrame(() => {
      restore();
      // 2) one more frame (handles fonts/images/background sizing)
      requestAnimationFrame(restore);
    });

    // Save scroll during session
    const onScroll = () => {
      sessionStorage.setItem(KEY, String(window.scrollY));
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);
}
