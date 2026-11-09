"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/*
  Landing-page choreography, scoped to `scope`. Every effect has one job:
  [data-split]    headline words rise out of a mask (hierarchy: the promise lands first)
  [data-slap]     the sample packet is tipped out onto the hero (state: this is a real, finished thing)
  [data-receipt]  grocery receipt settles into place (storytelling: the list "prints")
  [data-closer]   closing packet opens from an inset, its lines follow (arrival)
  Reduced-motion visitors get none of it.
*/
export function useLandingMotion(scope: React.RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const q = gsap.utils.selector(scope);

        const words = q("[data-split] .w");
        if (words.length) {
          gsap.fromTo(
            words,
            { autoAlpha: 0, yPercent: 110 },
            { autoAlpha: 1, yPercent: 0, duration: 1, stagger: 0.07, ease: "expo.out", delay: 0.1 },
          );
        }

        // Sticker lands after the headline: drops, overshoots, settles at its resting tilt
        q("[data-slap]").forEach((el) => {
          gsap.fromTo(
            el,
            { autoAlpha: 0, y: 64, rotate: 8, scale: 0.94 },
            { autoAlpha: 1, y: 0, rotate: 2, scale: 1, duration: 0.8, ease: "back.out(1.5)", delay: 0.5 },
          );
        });

        q("[data-receipt]").forEach((el) => {
          gsap.fromTo(
            el,
            { yPercent: 28, rotate: 7 },
            {
              yPercent: 0,
              rotate: -2,
              ease: "none",
              scrollTrigger: { trigger: el, start: "top 100%", end: "top 55%", scrub: 0.8 },
            },
          );
        });

        q("[data-closer]").forEach((el) => {
          gsap.fromTo(
            el,
            { clipPath: "inset(8% 4% round 32px)" },
            {
              clipPath: "inset(0% 0% round 18px)",
              ease: "none",
              scrollTrigger: { trigger: el, start: "top 100%", end: "top 40%", scrub: 0.6 },
            },
          );
          gsap.from(el.querySelectorAll("[data-closer-item]"), {
            autoAlpha: 0,
            y: 28,
            stagger: 0.1,
            scrollTrigger: { trigger: el, start: "top 65%", once: true },
          });
        });
      });
      return () => mm.revert();
    },
    { scope },
  );
}
