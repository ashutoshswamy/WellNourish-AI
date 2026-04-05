"use client";

import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, Sequence } from "remotion";
import React from "react";

export interface MealPlanSchema {
  days: {
    day: number;
    breakfast: { name: string; description: string; calories: number };
    lunch: { name: string; description: string; calories: number };
    dinner: { name: string; description: string; calories: number };
    snacks: { name: string; description: string; calories: number };
  }[];
}

export const PlanVideo: React.FC<{ mealPlan: MealPlanSchema }> = ({ mealPlan }) => {
  const { fps } = useVideoConfig();
  // 1.5 seconds per day
  const framesPerDay = Math.floor(fps * 2.5);

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a", color: "white", padding: 60 }}>
      {mealPlan?.days?.map((dayPlan, index) => {
        return (
          <Sequence key={index} from={index * framesPerDay} durationInFrames={framesPerDay}>
            <DaySlide dayPlan={dayPlan} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

const DaySlide: React.FC<{ dayPlan: MealPlanSchema["days"][0] }> = ({ dayPlan }) => {
  const frame = useCurrentFrame();
  
  const opacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });
  
  const titleY = interpolate(frame, [0, 15], [-50, 0], {
    extrapolateRight: "clamp"
  });

  const contentY = interpolate(frame, [5, 20], [50, 0], {
    extrapolateRight: "clamp"
  });

  return (
    <AbsoluteFill style={{ opacity, display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <div style={{ transform: `translateY(${titleY}px)`, marginBottom: 40, textAlign: "center" }}>
        <h1 style={{ fontSize: 60, fontWeight: "bold", margin: 0, color: "#10b981" }}>Day {dayPlan.day}</h1>
      </div>
      
      <div style={{ transform: `translateY(${contentY}px)`, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 30 }}>
        <MealCard type="Breakfast" meal={dayPlan.breakfast} />
        <MealCard type="Lunch" meal={dayPlan.lunch} />
        <MealCard type="Dinner" meal={dayPlan.dinner} />
        <MealCard type="Snacks" meal={dayPlan.snacks} />
      </div>
    </AbsoluteFill>
  );
};

interface MealInfo {
  name?: string;
  description?: string;
  calories?: number;
}

const MealCard = ({ type, meal }: { type: string, meal: MealInfo }) => (
  <div style={{ padding: 25, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
    <h3 style={{ fontSize: 24, fontStyle: "italic", opacity: 0.7, margin: "0 0 10px 0" }}>{type} - {meal?.calories} kcal</h3>
    <h2 style={{ fontSize: 32, margin: "0 0 10px 0" }}>{meal?.name}</h2>
    <p style={{ fontSize: 20, margin: 0, opacity: 0.8, lineHeight: 1.4 }}>{meal?.description}</p>
  </div>
);
