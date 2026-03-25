import { useLayoutEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { Target } from "lucide-react";

const ICON_PX = 64;

function initialMetrics() {
  if (typeof window === "undefined") {
    return { startLeft: 0, endLeft: 16, startTop: 120, endTop: 10 };
  }
  const w = window.innerWidth;
  return {
    startLeft: w / 2 - ICON_PX / 2,
    endLeft: 16,
    startTop: 120,
    endTop: 10,
  };
}

/** Scroll-driven Target mark: hero center → navbar brand slot (only on `/`). */
export function HeroFloatingTarget() {
  const location = useLocation();
  const [metrics, setMetrics] = useState(initialMetrics);
  const { scrollY } = useScroll();

  useLayoutEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      const slot = document.querySelector("[data-nav-brand-slot]");
      let endLeft = 16;
      let endTop = 10;
      if (slot) {
        const r = slot.getBoundingClientRect();
        endLeft = r.left + r.width / 2 - ICON_PX / 2;
        endTop = r.top + r.height / 2 - ICON_PX / 2;
      }
      setMetrics({
        startLeft: w / 2 - ICON_PX / 2,
        endLeft,
        startTop: 120,
        endTop,
      });
    };
    update();
    window.addEventListener("resize", update);
    const id = requestAnimationFrame(update);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("resize", update);
    };
  }, [location.pathname]);

  const top = useTransform(scrollY, (y) => {
    const p = Math.min(Math.max(y / 200, 0), 1);
    return metrics.startTop + (metrics.endTop - metrics.startTop) * p;
  });

  const left = useTransform(scrollY, (y) => {
    const p = Math.min(Math.max(y / 200, 0), 1);
    return metrics.startLeft + (metrics.endLeft - metrics.startLeft) * p;
  });

  const scale = useTransform(scrollY, (y) => {
    const p = Math.min(Math.max(y / 200, 0), 1);
    return 1 - 0.58 * p;
  });

  const opacity = useTransform(scrollY, (y) => {
    const p = Math.min(Math.max(y / 200, 0), 1);
    return 1 - 0.15 * p;
  });

  if (location.pathname !== "/") return null;

  return (
    <motion.div
      className="pointer-events-none fixed z-[60] h-16 w-16 will-change-transform"
      style={{ top, left, scale, opacity }}
    >
      <Target className="h-16 w-16 text-slate-900" strokeWidth={1} aria-hidden />
    </motion.div>
  );
}
