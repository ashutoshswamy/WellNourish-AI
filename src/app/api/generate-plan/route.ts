import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { UserInput } from "@/types";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: NextRequest) {
  try {
    const userData: UserInput = await request.json();

    // Calculate BMI
    const heightInMeters = userData.height / 100;
    const bmi = userData.weight / (heightInMeters * heightInMeters);

    // Create a comprehensive prompt for Gemini
    const prompt = `
You are a professional nutritionist and fitness expert. Based on the following user information, create a comprehensive, personalized diet and workout plan.

User Information:
- Age: ${userData.age} years
- Gender: ${userData.gender}
- Height: ${userData.height} cm
- Weight: ${userData.weight} kg
- BMI: ${bmi.toFixed(2)}
- Activity Level: ${userData.activityLevel.replace("_", " ")}
- Diet Preference: ${userData.dietPreference.replace("_", " ")}
- Cuisine Preferences: ${userData.cuisinePreferences.join(", ")}
- Allergies: ${userData.allergies || "None"}
${userData.goals ? `- Goals: ${userData.goals}` : ""}

Please provide a detailed response in the following format:

## NUTRITION SUMMARY
Provide calculated daily caloric needs (TDEE), macronutrient breakdown (protein, carbs, fats in grams), and key nutritional considerations.

## DIET PLAN
Create a detailed 7-day meal plan with:
- Breakfast, lunch, dinner, and 2 snacks for each day
- Specific meal suggestions that align with their diet preference and cuisine preferences
- Avoid all mentioned allergies
- Include approximate calories for each meal
- Ensure meals are practical and easy to prepare

## WORKOUT PLAN
Design a comprehensive weekly workout routine:
- 5-6 days of exercise appropriate for their activity level
- Include specific exercises, sets, reps, and duration
- Mix of cardio, strength training, and flexibility work
- Progressive overload principles
- Rest and recovery days

## RECOMMENDATIONS
Provide:
- Hydration guidelines
- Sleep recommendations
- Supplement suggestions (if any)
- Tips for success and staying consistent
- When to adjust the plan

Make the plan professional, realistic, and sustainable for long-term success.
`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the response into sections
    const sections = {
      fullPlan: text,
      bmi: bmi.toFixed(2),
      bmiCategory: getBMICategory(bmi),
    };

    return NextResponse.json(sections);
  } catch (error) {
    console.error("Error generating plan:", error);
    return NextResponse.json(
      {
        error:
          "Failed to generate plan. Please check your API key and try again.",
      },
      { status: 500 }
    );
  }
}

function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal weight";
  if (bmi < 30) return "Overweight";
  return "Obese";
}
