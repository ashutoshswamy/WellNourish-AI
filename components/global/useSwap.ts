"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

// Replays a short fade-up on `selector` inside `scope` whenever `dep` changes.
// Skips the first render (the page entrance already covers it).
export function useSwap(scope: React.RefObject<HTMLElement | null>, dep: unknown, selector = ".tick") {
  const prev = useRef(dep);
  useGSAP(
    () => {
      // Compare against the last value rather than a "first run" flag so StrictMode's double mount stays still
      if (prev.current === dep) return;
      prev.current = dep;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.fromTo(
        selector,
        { autoAlpha: 0, y: 10 },
        { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.04, ease: "power3.out", overwrite: true },
      );
    },
    { scope, dependencies: [dep] },
  );
}
