import { z } from 'zod';

// Step 1: Basic Info
export const basicInfoSchema = z.object({
  age: z
    .number({ message: 'Age is required' })
    .min(16, 'You must be at least 16 years old')
    .max(120, 'Please enter a valid age'),
  height_cm: z
    .number({ message: 'Height is required' })
    .min(50, 'Height must be at least 50 cm')
    .max(300, 'Height must be less than 300 cm'),
  weight_kg: z
    .number({ message: 'Weight is required' })
    .min(20, 'Weight must be at least 20 kg')
    .max(500, 'Weight must be less than 500 kg'),
  gender: z.enum(['male', 'female', 'other'], {
    message: 'Please select your gender',
  }),
});

// Step 2: Dietary Preferences
export const dietaryPreferencesSchema = z.object({
  dietary_preferences: z
    .array(z.string())
    .min(1, 'Please select at least one dietary preference'),
});

// Step 3: Cuisine Preferences
export const cuisinePreferencesSchema = z.object({
  cuisine_preferences: z
    .array(z.string())
    .min(1, 'Please select at least one cuisine preference'),
});

// Step 4: Allergies
export const allergiesSchema = z.object({
  allergies: z.array(z.string()),
});

// Step 5: Goals
export const goalsSchema = z.object({
  goal: z.string().min(1, 'Please select your goal'),
  activity_level: z.enum(['sedentary', 'light', 'moderate', 'active'], {
    message: 'Please select your activity level',
  }),
});

// Complete onboarding schema
export const onboardingSchema = basicInfoSchema
  .merge(dietaryPreferencesSchema)
  .merge(cuisinePreferencesSchema)
  .merge(allergiesSchema)
  .merge(goalsSchema);

export type BasicInfoData = z.infer<typeof basicInfoSchema>;
export type DietaryPreferencesData = z.infer<typeof dietaryPreferencesSchema>;
export type CuisinePreferencesData = z.infer<typeof cuisinePreferencesSchema>;
export type AllergiesData = z.infer<typeof allergiesSchema>;
export type GoalsData = z.infer<typeof goalsSchema>;
export type OnboardingData = z.infer<typeof onboardingSchema>;

// Options for multi-select fields
export const dietaryOptions = [
  { value: 'none', label: 'No Restrictions' },
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'pescatarian', label: 'Pescatarian' },
  { value: 'keto', label: 'Keto' },
  { value: 'paleo', label: 'Paleo' },
  { value: 'mediterranean', label: 'Mediterranean' },
  { value: 'gluten_free', label: 'Gluten Free' },
  { value: 'dairy_free', label: 'Dairy Free' },
  { value: 'halal', label: 'Halal' },
  { value: 'kosher', label: 'Kosher' },
];

export const cuisineOptions = [
  { value: 'indian', label: 'Indian' },
  { value: 'chinese', label: 'Chinese' },
  { value: 'italian', label: 'Italian' },
  { value: 'mexican', label: 'Mexican' },
  { value: 'japanese', label: 'Japanese' },
  { value: 'thai', label: 'Thai' },
  { value: 'mediterranean', label: 'Mediterranean' },
  { value: 'american', label: 'American' },
  { value: 'korean', label: 'Korean' },
  { value: 'vietnamese', label: 'Vietnamese' },
  { value: 'french', label: 'French' },
  { value: 'middle_eastern', label: 'Middle Eastern' },
  { value: 'greek', label: 'Greek' },
  { value: 'spanish', label: 'Spanish' },
];

export const allergyOptions = [
  { value: 'peanuts', label: 'Peanuts' },
  { value: 'tree_nuts', label: 'Tree Nuts' },
  { value: 'milk', label: 'Milk/Dairy' },
  { value: 'eggs', label: 'Eggs' },
  { value: 'wheat', label: 'Wheat' },
  { value: 'soy', label: 'Soy' },
  { value: 'fish', label: 'Fish' },
  { value: 'shellfish', label: 'Shellfish' },
  { value: 'sesame', label: 'Sesame' },
  { value: 'gluten', label: 'Gluten' },
  { value: 'corn', label: 'Corn' },
  { value: 'sulfites', label: 'Sulfites' },
];

export const goalOptions = [
  { value: 'weight_loss', label: 'Weight Loss', description: 'Shed extra pounds and achieve a healthier weight' },
  { value: 'muscle_gain', label: 'Muscle Gain', description: 'Build lean muscle and increase strength' },
  { value: 'maintenance', label: 'Maintain Weight', description: 'Keep your current weight and stay healthy' },
  { value: 'athletic_performance', label: 'Athletic Performance', description: 'Optimize nutrition for sports and fitness' },
  { value: 'general_health', label: 'General Health', description: 'Improve overall health and well-being' },
];

export const activityLevelOptions = [
  { value: 'sedentary', label: 'Sedentary', description: 'Little to no exercise, desk job' },
  { value: 'light', label: 'Lightly Active', description: 'Light exercise 1-3 days/week' },
  { value: 'moderate', label: 'Moderately Active', description: 'Moderate exercise 3-5 days/week' },
  { value: 'active', label: 'Very Active', description: 'Hard exercise 6-7 days/week' },
];
