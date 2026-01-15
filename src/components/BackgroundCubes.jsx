import { useEffect, useRef, useState } from "react";

export default function BackgroundCubes({
  tileFillColors = ["#0b1020", "#0b1020"],
  outlineColor = "#8a8f98",
  angleDeg = 35,
  speed = 28,

  tileSize = 44,
  fillOpacity = 0.0,
  lineWidth = 1,
  glowRadius = 180,
  glowStrength = 1.0,

  glowGradient = ["#a855f7", "#7c3aed", "#d946ef"],
  glowGradientLight = ["#7c3aed", "#a855f7", "#ec4899"],

  background = "transparent",
}) {
  const canvasRef = useRef(null);
  const mouseRef = useRef({
    targetX: -9999,
    targetY: -9999,
    x: -9999,
    y: -9999,
  });
  const rafRef = useRef(0);
  const startRef = useRef(performance.now());

  const [isLight, setIsLight] = useState(() => {
    const html = document.documentElement;
    return html.getAttribute("data-theme") === "light";
  });

  useEffect(() => {
    const html = document.documentElement;

    const update = () =>
      setIsLight(html.getAttribute("data-theme") === "light");
    update();

    const obs = new MutationObserver(update);
    obs.observe(html, { attributes: true, attributeFilter: ["data-theme"] });

    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });

    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const activeGlowGradient = isLight ? glowGradientLight : glowGradient;

    const resize = () => {
      const { innerWidth: w, innerHeight: h } = window;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onMove = (e) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
    };
    const onLeave = () => {
      mouseRef.current.targetX = -9999;
      mouseRef.current.targetY = -9999;
      mouseRef.current.x = -9999;
      mouseRef.current.y = -9999;
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseleave", onLeave);

    resize();

    const clamp01 = (t) => Math.max(0, Math.min(1, t));

    const colorToRgb = (color) => {
      const c = color.trim();

      if (c.startsWith("rgb")) {
        const m = c.match(
          /rgb\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*\)/i
        );
        if (!m) return { r: 0, g: 0, b: 0 };
        return { r: Number(m[1]), g: Number(m[2]), b: Number(m[3]) };
      }

      const h = c.replace("#", "");
      const full =
        h.length === 3
          ? h
              .split("")
              .map((ch) => ch + ch)
              .join("")
          : h;

      const n = parseInt(full, 16);
      if (Number.isNaN(n)) return { r: 0, g: 0, b: 0 };
      return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
    };

    const lerp = (a, b, t) => a + (b - a) * t;

    const lerpColor = (c1, c2, t) => {
      const a = colorToRgb(c1);
      const b = colorToRgb(c2);
      const r = Math.round(lerp(a.r, b.r, t));
      const g = Math.round(lerp(a.g, b.g, t));
      const bb = Math.round(lerp(a.b, b.b, t));
      return `rgb(${r},${g},${bb})`;
    };

    const getGlowColor = (intensity) => {
      const t = clamp01(intensity);
      if (t < 0.5)
        return lerpColor(activeGlowGradient[0], activeGlowGradient[1], t / 0.5);
      return lerpColor(
        activeGlowGradient[1],
        activeGlowGradient[2],
        (t - 0.5) / 0.5
      );
    };

    const render = (now) => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      ctx.clearRect(0, 0, w, h);
      if (background && background !== "transparent") {
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, w, h);
      }

      const t = (now - startRef.current) / 1000;
      const angle = (angleDeg * Math.PI) / 180;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;

      const ox = (((vx * t) % tileSize) + tileSize) % tileSize;
      const oy = (((vy * t) % tileSize) + tileSize) % tileSize;

      const smooth = 0.18;
      mouseRef.current.x = lerp(
        mouseRef.current.x,
        mouseRef.current.targetX,
        smooth
      );
      mouseRef.current.y = lerp(
        mouseRef.current.y,
        mouseRef.current.targetY,
        smooth
      );

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      const strokeForSegment = (ax, ay, bx, by) => {
        const midx = (ax + bx) * 0.5;
        const midy = (ay + by) * 0.5;
        const dx = midx - mx;
        const dy = midy - my;
        const dist = Math.sqrt(dx * dx + dy * dy);

        const tFalloff = 1 - dist / glowRadius;
        const smoothstep = (u) => u * u * (3 - 2 * u);

        const intensity = clamp01(smoothstep(clamp01(tFalloff)) * glowStrength);
        if (intensity <= 0.01) return outlineColor;

        return lerpColor(outlineColor, getGlowColor(intensity), intensity);
      };

      const pad = tileSize * 2;
      const cols = Math.ceil((w + pad * 2) / tileSize);
      const rows = Math.ceil((h + pad * 2) / tileSize);

      ctx.lineWidth = lineWidth;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * tileSize - ox - pad;
          const y = r * tileSize - oy - pad;

          if (fillOpacity > 0) {
            ctx.globalAlpha = fillOpacity;
            ctx.fillStyle =
              (r + c) % 2 === 0 ? tileFillColors[0] : tileFillColors[1];
            ctx.fillRect(x, y, tileSize, tileSize);
            ctx.globalAlpha = 1;
          }

          ctx.strokeStyle = strokeForSegment(x, y, x + tileSize, y);
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + tileSize, y);
          ctx.stroke();

          ctx.strokeStyle = strokeForSegment(
            x + tileSize,
            y,
            x + tileSize,
            y + tileSize
          );
          ctx.beginPath();
          ctx.moveTo(x + tileSize, y);
          ctx.lineTo(x + tileSize, y + tileSize);
          ctx.stroke();

          ctx.strokeStyle = strokeForSegment(
            x + tileSize,
            y + tileSize,
            x,
            y + tileSize
          );
          ctx.beginPath();
          ctx.moveTo(x + tileSize, y + tileSize);
          ctx.lineTo(x, y + tileSize);
          ctx.stroke();

          ctx.strokeStyle = strokeForSegment(x, y + tileSize, x, y);
          ctx.beginPath();
          ctx.moveTo(x, y + tileSize);
          ctx.lineTo(x, y);
          ctx.stroke();
        }
      }

      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, [
    isLight,
    tileFillColors,
    outlineColor,
    angleDeg,
    speed,
    tileSize,
    fillOpacity,
    lineWidth,
    glowRadius,
    glowStrength,
    glowGradient,
    glowGradientLight,
    background,
  ]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}
