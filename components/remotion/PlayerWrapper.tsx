"use client";

import { Player } from "@remotion/player";
import { PlanVideo, MealPlanSchema } from "./PlanVideo";

export function PlayerComponent({ mealPlan }: { mealPlan: MealPlanSchema }) {
  const fps = 30;
  // 2.5 seconds per slide/day -> day length
  const durationInFrames = Math.max(1, (mealPlan?.days?.length || 1) * Math.floor(fps * 2.5));

  return (
    <Player
      component={PlanVideo}
      inputProps={{ mealPlan }}
      durationInFrames={durationInFrames}
      compositionWidth={1920}
      compositionHeight={1080}
      fps={fps}
      style={{
        width: "100%",
        display: "block",
        aspectRatio: "16/9",
      }}
      controls
      autoPlay
      loop
    />
  );
}
