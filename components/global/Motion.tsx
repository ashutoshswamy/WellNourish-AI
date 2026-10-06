"use client";

import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);
gsap.defaults({ ease: "power3.out", duration: 0.8 });
// Stops address-bar show/hide on mobile from re-measuring every trigger mid-scroll.
ScrollTrigger.config({ ignoreMobileResize: true });

/*
  Site-wide motion, re-run on every route:
  .rise    page entrance, staggered in DOM order (hidden by CSS until this runs)
  .reveal  fades up once when scrolled into view
  .hl      highlighter swipe across a word
  [data-print] nutrition-label rules draw in like a printed panel
  Everything sits inside matchMedia, so reduced-motion users get static content.
*/
export function Motion() {
  const pathname = usePathname();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline();
        tl.fromTo(".rise", { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, stagger: 0.08 });
        if (document.querySelector(".hl")) {
          tl.fromTo(".hl", { "--hl": "0%" }, { "--hl": "100%", duration: 0.6, ease: "power2.inOut" }, 0.35);
        }
        if (document.querySelector("[data-print]")) {
          tl.from("[data-print] .rule-xl, [data-print] .rule-md, [data-print] .rule-hair", {
            scaleX: 0,
            transformOrigin: "left center",
            duration: 0.6,
            stagger: 0.05,
            ease: "power2.out",
          }, 0.3);
        }

        gsap.set(".reveal", { autoAlpha: 0, y: 32 });
        ScrollTrigger.batch(".reveal", {
          start: "top 88%",
          once: true,
          onEnter: (batch) => gsap.to(batch, { autoAlpha: 1, y: 0, stagger: 0.1, overwrite: true }),
        });
      });
      return () => mm.revert();
    },
    { dependencies: [pathname], revertOnUpdate: true },
  );

  return null;
}
