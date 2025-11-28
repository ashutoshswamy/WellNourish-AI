/**
 * Build a prompt for Gemini 2.0 to generate a personalized wellness plan
 */

export interface UserData {
  // Basic info
  age: number;
  height_cm: number;
  weight_kg: number;
  gender: string;

  // Preferences
  dietary_preferences: string[];
  cuisine_preferences: string[];
  allergies: string[];

  // Goals
  goal: string;
  activity_level: string;

  // Optional preferences
  target_weight_kg?: number;
  meals_per_day?: number;
  snacks_per_day?: number;
  workouts_per_week?: number;
  workout_duration_minutes?: number;
  fitness_level?: string;
  cooking_time_preference?: string;
  budget_level?: string;
}

export function buildPrompt(userData: UserData): string {
  const {
    age,
    height_cm,
    weight_kg,
    gender,
    dietary_preferences,
    cuisine_preferences,
    allergies,
    goal,
    activity_level,
    target_weight_kg,
    meals_per_day = 3,
    snacks_per_day = 1,
    workouts_per_week = 3,
    workout_duration_minutes = 45,
    fitness_level = 'beginner',
    cooking_time_preference = 'moderate',
    budget_level = 'moderate',
  } = userData;

  // Calculate BMI for context
  const heightM = height_cm / 100;
  const bmi = (weight_kg / (heightM * heightM)).toFixed(1);

  const prompt = `You are an expert nutritionist and fitness coach. Generate a comprehensive, personalized 7-day wellness plan based on the following user profile.

## User Profile

**Demographics:**
- Age: ${age} years old
- Gender: ${gender}
- Height: ${height_cm} cm
- Current Weight: ${weight_kg} kg
- BMI: ${bmi}
${target_weight_kg ? `- Target Weight: ${target_weight_kg} kg` : ''}

**Goals & Activity:**
- Primary Goal: ${formatGoal(goal)}
- Activity Level: ${formatActivityLevel(activity_level)}
- Fitness Level: ${formatFitnessLevel(fitness_level)}

**Dietary Requirements:**
- Dietary Preferences: ${dietary_preferences.length > 0 ? dietary_preferences.map(formatDietaryPreference).join(', ') : 'None'}
- Allergies/Intolerances: ${allergies.length > 0 ? allergies.join(', ') : 'None'}
- Preferred Cuisines: ${cuisine_preferences.length > 0 ? cuisine_preferences.join(', ') : 'Any'}

**Lifestyle Preferences:**
- Meals per Day: ${meals_per_day}
- Snacks per Day: ${snacks_per_day}
- Workouts per Week: ${workouts_per_week}
- Workout Duration: ${workout_duration_minutes} minutes
- Cooking Time Preference: ${formatCookingPreference(cooking_time_preference)}
- Budget Level: ${formatBudgetLevel(budget_level)}

## Instructions

Generate a detailed, actionable 7-day wellness plan that includes:

1. **Summary**: A brief overview of the plan tailored to the user's goals
2. **Daily Calories**: Recommended daily calorie intake based on their goals and activity level
3. **Meal Plan**: 7 days of meals with recipes, ingredients, nutrition info, and prep instructions
4. **Workout Plan**: Weekly workout schedule appropriate for their fitness level
5. **Shopping List**: Consolidated grocery list for the week
6. **Warnings**: Any health considerations or warnings based on their profile
7. **Confidence Score**: Your confidence level (0-100) in this plan being suitable for the user

## Response Format

You MUST respond with valid JSON only, no markdown formatting. Use this exact structure:

{
  "summary": "Brief personalized overview of the plan (2-3 sentences)",
  "daily_calories": 2000,
  "meal_plan": {
    "days": [
      {
        "day": 1,
        "meals": [
          {
            "meal_type": "breakfast",
            "name": "Meal Name",
            "description": "Brief description",
            "ingredients": [
              { "name": "Ingredient", "amount": 100, "unit": "g" }
            ],
            "instructions": ["Step 1", "Step 2"],
            "prep_time_minutes": 10,
            "cook_time_minutes": 15,
            "servings": 1,
            "nutrition": {
              "calories": 400,
              "protein_g": 20,
              "carbs_g": 50,
              "fats_g": 15
            }
          }
        ],
        "total_calories": 2000,
        "total_protein_g": 100,
        "total_carbs_g": 200,
        "total_fats_g": 70
      }
    ]
  },
  "workout_plan": {
    "weeks": [
      {
        "week": 1,
        "workouts": [
          {
            "day": 1,
            "day_name": "Monday",
            "workout_type": "strength",
            "focus_area": "Full Body",
            "duration_minutes": 45,
            "exercises": [
              {
                "name": "Exercise Name",
                "category": "Category",
                "sets": 3,
                "reps": 12,
                "rest_seconds": 60,
                "instructions": ["Proper form instruction"]
              }
            ]
          }
        ]
      }
    ]
  },
  "shopping_list": [
    { "ingredient": "Item name", "amount": 500, "unit": "g", "category": "Produce" }
  ],
  "warnings": ["Any health warnings or considerations"],
  "confidence_score": 85
}

Important:
- All meals MUST respect the dietary preferences and avoid ALL listed allergies
- Recipes should match the preferred cuisines when possible
- Workouts should be appropriate for the fitness level
- Keep cooking times within the stated preference
- Ensure nutritional values are realistic and accurate
- Include variety across the 7 days
- ONLY return valid JSON, no additional text or markdown`;

  return prompt;
}

function formatGoal(goal: string): string {
  const goalMap: Record<string, string> = {
    weight_loss: 'Weight Loss',
    muscle_gain: 'Muscle Gain',
    maintenance: 'Weight Maintenance',
    athletic_performance: 'Athletic Performance',
    general_health: 'General Health & Wellness',
  };
  return goalMap[goal] || goal;
}

function formatActivityLevel(level: string): string {
  const levelMap: Record<string, string> = {
    sedentary: 'Sedentary (little to no exercise)',
    light: 'Lightly Active (light exercise 1-3 days/week)',
    lightly_active: 'Lightly Active (light exercise 1-3 days/week)',
    moderate: 'Moderately Active (moderate exercise 3-5 days/week)',
    moderately_active: 'Moderately Active (moderate exercise 3-5 days/week)',
    active: 'Very Active (hard exercise 6-7 days/week)',
    very_active: 'Very Active (hard exercise 6-7 days/week)',
    extremely_active: 'Extremely Active (very hard exercise, physical job)',
  };
  return levelMap[level] || level;
}

function formatFitnessLevel(level: string): string {
  const levelMap: Record<string, string> = {
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
  };
  return levelMap[level] || level;
}

function formatDietaryPreference(pref: string): string {
  const prefMap: Record<string, string> = {
    none: 'No Restrictions',
    vegetarian: 'Vegetarian',
    vegan: 'Vegan',
    pescatarian: 'Pescatarian',
    keto: 'Keto',
    paleo: 'Paleo',
    mediterranean: 'Mediterranean',
    gluten_free: 'Gluten-Free',
    dairy_free: 'Dairy-Free',
    halal: 'Halal',
    kosher: 'Kosher',
  };
  return prefMap[pref] || pref;
}

function formatCookingPreference(pref: string): string {
  const prefMap: Record<string, string> = {
    quick: 'Quick (under 30 minutes)',
    moderate: 'Moderate (30-60 minutes)',
    elaborate: 'Elaborate (60+ minutes, complex recipes)',
  };
  return prefMap[pref] || pref;
}

function formatBudgetLevel(level: string): string {
  const levelMap: Record<string, string> = {
    budget: 'Budget-Friendly',
    moderate: 'Moderate',
    premium: 'Premium (no budget constraints)',
  };
  return levelMap[level] || level;
}
