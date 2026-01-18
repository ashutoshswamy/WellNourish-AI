import { GoogleGenerativeAI } from "@google/generative-ai"
import { NextResponse } from "next/server"
import { onboardingSchema } from "@/app/onboarding/schema"
import { createClient } from "@/utils/supabase/server"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    // Validate input
    const validation = onboardingSchema.safeParse(body)
    
    if (!validation.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 })
    }

    const data = validation.data



      const prompt = `
      You are an expert nutritionist and fitness coach. 
      Generate a ${data.planDuration}-day diet and workout plan for a user with the following profile:
      - Age: ${data.age}
      - Gender: ${data.gender}
      - Height: ${data.height}cm
      - Weight: ${data.weight}kg
      - Activity Level: ${data.activityLevel}
      - Goals: ${data.goals.join(", ")}
      - Dietary Preferences: ${data.dietaryPreferences.join(", ") || "None"}
      - Cuisines: ${data.cuisinePreferences.join(", ")}
      - Allergies: ${data.allergies.join(", ") || "None"}
      - Medical Conditions: ${data.medicalConditions.join(", ") || "None"}

      The output MUST be valid JSON with the following structure:
      {
        "nutrition_summary": {
           "daily_calories": number,
           "macros": { "protein": "string", "carbs": "string", "fats": "string" },
           "hydration_goal": "string"
        },
        "daily_plan": [
          {
            "day": number,
            "meals": {
              "breakfast": { 
                  "name": "string", 
                  "calories": number, 
                  "description": "string",
                  "ingredients": ["string", "string"],
                  "preparation": "string"
              },
              "lunch": { 
                  "name": "string", 
                  "calories": number, 
                  "description": "string",
                  "ingredients": ["string", "string"],
                  "preparation": "string"
              },
              "dinner": { 
                  "name": "string", 
                  "calories": number, 
                  "description": "string",
                  "ingredients": ["string", "string"],
                  "preparation": "string"
              },
              "snack": { 
                  "name": "string", 
                  "calories": number, 
                  "description": "string",
                  "ingredients": ["string", "string"]
              }
            },
            "workout": {
              "type": "string",
              "duration": "string",
              "warmup": "string",
              "exercises": [
                  {
                      "name": "string",
                      "sets": "string",
                      "reps": "string",
                      "notes": "string"
                  }
              ],
              "cooldown": "string"
            }
          }
          // ... repeat for 7 days
        ],
        "tips": ["string", "string", "string"],
        "shopping_list": [
          {
            "category": "string",
            "items": ["string", "string"]
          }
        ]
      }
      
      IMPORTANT: Return ONLY the JSON. No markdown formatting.
    `

    let text = ""
    
    // First try with the requested model
    try {
        const model = genAI.getGenerativeModel({ 
            model: "gemini-3-flash-preview", 
            generationConfig: { responseMimeType: "application/json" } 
        })
        const result = await model.generateContent(prompt)
        const response = await result.response
        text = response.text()
    } catch (modelError) {
        console.warn("Gemini 3 Flash failed, falling back to 2.5 Flash", modelError)
        // Fallback to stable preview
        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash", 
            generationConfig: { responseMimeType: "application/json" } 
        })
        const result = await model.generateContent(prompt)
        const response = await result.response
        text = response.text()
    }
    
    console.log("AI Response Text:", text) // Debugging log

    // Clean up markdown if present
    const cleanedText = text.replace(/```json/gi, "").replace(/```/g, "").trim()
    
    let plan;
    try {
        plan = JSON.parse(cleanedText)
    } catch {
        console.error("Failed to parse JSON:", cleanedText)
        throw new Error("Invalid JSON response from AI")
    }

    return NextResponse.json(plan)

  } catch (error) {
    console.error("AI Generation Error:", error)
    return NextResponse.json({ error: "Failed to generate plan" }, { status: 500 })
  }
}
