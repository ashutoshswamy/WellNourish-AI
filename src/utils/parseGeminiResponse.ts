/**
 * Parse and validate Gemini's response for the wellness plan
 */

import type { MealPlanData, WorkoutPlanData, ShoppingListItem } from '@/types/database.types';

export interface GeminiPlanResponse {
  summary: string;
  daily_calories: number;
  meal_plan: MealPlanData;
  workout_plan: WorkoutPlanData;
  shopping_list: ShoppingListItem[];
  warnings: string[];
  confidence_score: number;
}

export class GeminiParseError extends Error {
  constructor(
    message: string,
    public readonly rawResponse?: string
  ) {
    super(message);
    this.name = 'GeminiParseError';
  }
}

/**
 * Attempt to fix common JSON issues that Gemini might produce
 */
function tryFixJson(jsonString: string): string {
  let fixed = jsonString;

  // Remove any trailing commas before ] or }
  fixed = fixed.replace(/,(\s*[}\]])/g, '$1');

  // Fix unclosed strings by finding unbalanced quotes
  // This is a simple heuristic - count quotes and try to close if odd
  const quoteCount = (fixed.match(/(?<!\\)"/g) || []).length;
  if (quoteCount % 2 !== 0) {
    // Try to find the last unclosed string and close it
    fixed = fixed + '"';
  }

  // Try to close unclosed arrays and objects
  const openBraces = (fixed.match(/{/g) || []).length;
  const closeBraces = (fixed.match(/}/g) || []).length;
  const openBrackets = (fixed.match(/\[/g) || []).length;
  const closeBrackets = (fixed.match(/]/g) || []).length;

  // Add missing closing brackets/braces
  for (let i = 0; i < openBrackets - closeBrackets; i++) {
    fixed = fixed + ']';
  }
  for (let i = 0; i < openBraces - closeBraces; i++) {
    fixed = fixed + '}';
  }

  // Remove any control characters that might break JSON
  fixed = fixed.replace(/[\x00-\x1F\x7F]/g, (char) => {
    if (char === '\n' || char === '\r' || char === '\t') {
      return char; // Keep these
    }
    return ''; // Remove other control characters
  });

  return fixed;
}

/**
 * Extract JSON from a string that might contain markdown code blocks or other text
 */
function extractJsonFromResponse(text: string): string {
  // Remove markdown code blocks if present
  let cleaned = text.trim();

  // Check for ```json or ``` blocks
  const jsonBlockMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonBlockMatch) {
    cleaned = jsonBlockMatch[1].trim();
  }

  // Find the first { and last } to extract JSON object
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');

  if (firstBrace === -1 || lastBrace === -1 || lastBrace < firstBrace) {
    throw new GeminiParseError('No valid JSON object found in response', text);
  }

  return cleaned.slice(firstBrace, lastBrace + 1);
}

/**
 * Validate the required fields exist in the parsed response
 */
function validateResponse(data: unknown): asserts data is GeminiPlanResponse {
  if (!data || typeof data !== 'object') {
    throw new GeminiParseError('Response is not an object');
  }

  const response = data as Record<string, unknown>;

  // Required fields
  const requiredFields = [
    'summary',
    'daily_calories',
    'meal_plan',
    'workout_plan',
    'shopping_list',
    'warnings',
    'confidence_score',
  ];

  for (const field of requiredFields) {
    if (!(field in response)) {
      throw new GeminiParseError(`Missing required field: ${field}`);
    }
  }

  // Type validations
  if (typeof response.summary !== 'string') {
    throw new GeminiParseError('summary must be a string');
  }

  if (typeof response.daily_calories !== 'number' || response.daily_calories <= 0) {
    throw new GeminiParseError('daily_calories must be a positive number');
  }

  if (typeof response.confidence_score !== 'number' || response.confidence_score < 0 || response.confidence_score > 100) {
    throw new GeminiParseError('confidence_score must be a number between 0 and 100');
  }

  if (!Array.isArray(response.warnings)) {
    throw new GeminiParseError('warnings must be an array');
  }

  if (!Array.isArray(response.shopping_list)) {
    throw new GeminiParseError('shopping_list must be an array');
  }

  // Validate meal_plan structure
  if (!response.meal_plan || typeof response.meal_plan !== 'object') {
    throw new GeminiParseError('meal_plan must be an object');
  }

  const mealPlan = response.meal_plan as Record<string, unknown>;
  if (!Array.isArray(mealPlan.days)) {
    throw new GeminiParseError('meal_plan.days must be an array');
  }

  // Validate workout_plan structure
  if (!response.workout_plan || typeof response.workout_plan !== 'object') {
    throw new GeminiParseError('workout_plan must be an object');
  }

  const workoutPlan = response.workout_plan as Record<string, unknown>;
  if (!Array.isArray(workoutPlan.weeks)) {
    throw new GeminiParseError('workout_plan.weeks must be an array');
  }
}

/**
 * Sanitize and normalize the parsed response
 */
function sanitizeResponse(data: GeminiPlanResponse): GeminiPlanResponse {
  try {
    return {
      summary: data.summary?.trim() || '',
      daily_calories: Math.round(data.daily_calories || 0),
      meal_plan: {
        days: (data.meal_plan?.days || []).map((day, index) => ({
          day: day?.day || index + 1,
          date: day?.date,
          meals: (day?.meals || []).map((meal) => ({
            meal_type: meal?.meal_type || 'meal',
            name: meal?.name || 'Unnamed Meal',
            description: meal?.description || '',
            ingredients: (meal?.ingredients || []).map((ing) => ({
              name: ing?.name || 'Unknown',
              amount: ing?.amount || 0,
              unit: ing?.unit || 'unit',
              notes: ing?.notes,
            })),
            instructions: meal?.instructions || [],
            prep_time_minutes: meal?.prep_time_minutes || 0,
            cook_time_minutes: meal?.cook_time_minutes || 0,
            servings: meal?.servings || 1,
            nutrition: {
              calories: meal?.nutrition?.calories || 0,
              protein_g: meal?.nutrition?.protein_g || 0,
              carbs_g: meal?.nutrition?.carbs_g || 0,
              fats_g: meal?.nutrition?.fats_g || 0,
              fiber_g: meal?.nutrition?.fiber_g,
              sugar_g: meal?.nutrition?.sugar_g,
              sodium_mg: meal?.nutrition?.sodium_mg,
            },
            recipe_url: meal?.recipe_url,
            image_url: meal?.image_url,
          })),
          total_calories: day?.total_calories || 0,
          total_protein_g: day?.total_protein_g || 0,
          total_carbs_g: day?.total_carbs_g || 0,
          total_fats_g: day?.total_fats_g || 0,
        })),
        shopping_list: data.shopping_list || [],
        meal_prep_instructions: data.meal_plan?.meal_prep_instructions,
      },
      workout_plan: {
        weeks: (data.workout_plan?.weeks || []).map((week, weekIndex) => ({
          week: week?.week || weekIndex + 1,
          workouts: (week?.workouts || []).map((workout) => ({
            day: workout?.day,
            day_name: workout?.day_name || '',
            workout_type: workout?.workout_type || 'general',
            focus_area: workout?.focus_area || '',
            duration_minutes: workout?.duration_minutes || 0,
            exercises: (workout?.exercises || []).map((exercise) => ({
              name: exercise?.name || 'Unknown Exercise',
              category: exercise?.category || '',
              sets: exercise?.sets,
              reps: exercise?.reps,
              duration_seconds: exercise?.duration_seconds,
              rest_seconds: exercise?.rest_seconds,
              intensity: exercise?.intensity,
              instructions: exercise?.instructions || [],
              video_url: exercise?.video_url,
              alternative_exercises: exercise?.alternative_exercises,
            })),
            notes: workout?.notes,
          })),
        })),
        notes: data.workout_plan?.notes,
        progression_strategy: data.workout_plan?.progression_strategy,
      },
      shopping_list: (data.shopping_list || []).map((item) => ({
        ingredient: item?.ingredient || 'Unknown',
        amount: item?.amount || 0,
        unit: item?.unit || 'unit',
        category: item?.category || 'Other',
      })),
      warnings: (data.warnings || []).filter((w) => typeof w === 'string'),
      confidence_score: Math.min(100, Math.max(0, Math.round(data.confidence_score || 0))),
    };
  } catch (error) {
    throw new GeminiParseError(
      `Failed to sanitize response: ${(error as Error).message}`,
      JSON.stringify(data).slice(0, 500)
    );
  }
}

/**
 * Parse and validate Gemini's response text into a structured plan
 */
export function parseGeminiResponse(responseText: string): GeminiPlanResponse {
  if (!responseText || typeof responseText !== 'string') {
    throw new GeminiParseError('Empty or invalid response from Gemini');
  }

  try {
    // Extract JSON from the response
    let jsonString = extractJsonFromResponse(responseText);

    // Try to parse JSON, if it fails, attempt to fix common issues
    let parsed;
    try {
      parsed = JSON.parse(jsonString);
    } catch (firstError) {
      // Attempt to fix the JSON and try again
      const fixedJson = tryFixJson(jsonString);
      try {
        parsed = JSON.parse(fixedJson);
        console.warn('JSON was malformed but was auto-fixed');
      } catch {
        // If fixing didn't help, throw the original error with more context
        throw firstError;
      }
    }

    // Validate structure
    validateResponse(parsed);

    // Sanitize and return
    return sanitizeResponse(parsed);
  } catch (error) {
    if (error instanceof GeminiParseError) {
      throw error;
    }

    if (error instanceof SyntaxError) {
      throw new GeminiParseError(`Invalid JSON in response: ${error.message}`, responseText);
    }

    throw new GeminiParseError(`Failed to parse response: ${(error as Error).message}`, responseText);
  }
}
