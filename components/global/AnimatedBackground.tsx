"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export function AnimatedBackground() {
  const orbRef1 = useRef<HTMLDivElement>(null);
  const orbRef2 = useRef<HTMLDivElement>(null);
  const orbRef3 = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Orb 1 — top right, lime
      gsap.to(orbRef1.current, {
        x: "+=60",
        y: "+=40",
        scale: 1.15,
        duration: 8,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      // Orb 2 — bottom left, emerald
      gsap.to(orbRef2.current, {
        x: "-=40",
        y: "-=50",
        scale: 1.1,
        duration: 11,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: 2,
      });

      // Orb 3 — center, subtle
      gsap.to(orbRef3.current, {
        scale: 1.2,
        opacity: 0.06,
        duration: 6,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: 1,
      });

      // Grid subtle shimmer
      if (gridRef.current) {
        gsap.to(gridRef.current, {
          opacity: 0.04,
          duration: 3,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          delay: 0.5,
        });
      }
    });
    return () => ctx.revert();
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {/* Grid overlay */}
      <div
        ref={gridRef}
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(180,245,90,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(180,245,90,0.5) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, transparent 40%, #050a05 100%)",
        }}
      />

      {/* Orb 1 — top right lime */}
      <div
        ref={orbRef1}
        className="absolute"
        style={{
          top: "-180px",
          right: "-160px",
          width: "660px",
          height: "660px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(180,245,90,0.12) 0%, rgba(163,230,53,0.06) 40%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* Orb 2 — bottom left emerald */}
      <div
        ref={orbRef2}
        className="absolute"
        style={{
          bottom: "-200px",
          left: "-180px",
          width: "700px",
          height: "700px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(52,211,153,0.09) 0%, rgba(16,185,129,0.04) 45%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      {/* Orb 3 — center accent */}
      <div
        ref={orbRef3}
        className="absolute"
        style={{
          top: "30%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(14,165,233,0.04) 0%, transparent 70%)",
          filter: "blur(90px)",
          opacity: 0.03,
        }}
      />

      {/* Top edge highlight */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(180,245,90,0.3) 30%, rgba(52,211,153,0.3) 70%, transparent)",
        }}
      />
    </div>
  );
}
