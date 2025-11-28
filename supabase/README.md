# Supabase Schema Documentation

## Database Overview

This database schema is designed for **WellNourish AI**, a personalized nutrition and fitness planning application. It supports user profiles, preferences, and AI-generated meal and workout plans.

## Tables

### 1. profiles
Stores user profile information and basic biometric data.

**Key Fields:**
- `id` (UUID, PK): References auth.users(id)
- `email` (TEXT, UNIQUE): User email address
- `full_name` (TEXT): User's full name
- `date_of_birth` (DATE): For age calculations
- `gender` (ENUM): Gender identity
- `height_cm` (NUMERIC): Height in centimeters
- `weight_kg` (NUMERIC): Current weight in kilograms

**Features:**
- Auto-creates profile on user signup via trigger
- BMI calculation helper function
- Age calculation helper function
- Automatic timestamp updates

### 2. user_preferences
Stores detailed user preferences for personalized plan generation.

**Key Fields:**
- `user_id` (UUID, FK): References profiles(id)
- `activity_level` (ENUM): Physical activity level
- `goal` (ENUM): Fitness/health goal
- `dietary_preference` (ENUM): Diet type
- `allergies` (TEXT[]): Array of allergies
- `meals_per_day` (INT): Meal frequency preference
- `workouts_per_week` (INT): Exercise frequency
- `fitness_level` (TEXT): Beginner/Intermediate/Advanced

**Features:**
- One-to-one relationship with profiles (enforced by UNIQUE constraint)
- Support for custom macro targets
- Flexible arrays for allergies, dislikes, and cuisines

### 3. generated_plans
Stores AI-generated meal plans, workout plans, or combined plans.

**Key Fields:**
- `user_id` (UUID, FK): References profiles(id)
- `plan_type` (TEXT): 'meal', 'workout', or 'combined'
- `meal_plan` (JSONB): Structured meal plan data
- `workout_plan` (JSONB): Structured workout data
- `daily_calories` (INT): Nutritional target
- `is_active` (BOOLEAN): Currently active plan
- `is_favorite` (BOOLEAN): User-marked favorite

**Features:**
- JSONB storage for flexible plan structures
- GIN indexes for efficient JSONB queries
- Support for completion tracking
- AI metadata tracking (model, tokens, prompt)

## Custom Types (ENUMs)

```sql
activity_level: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active'
dietary_preference: 'none' | 'vegetarian' | 'vegan' | 'pescatarian' | 'keto' | 'paleo' | 'mediterranean' | 'gluten_free' | 'dairy_free'
goal_type: 'weight_loss' | 'muscle_gain' | 'maintenance' | 'athletic_performance' | 'general_health'
gender_type: 'male' | 'female' | 'other' | 'prefer_not_to_say'
```

## Indexes

### Performance Optimizations:
- Email lookup: `idx_profiles_email`
- User queries: `idx_user_preferences_user_id`, `idx_generated_plans_user_id`
- Plan filtering: `idx_generated_plans_plan_type`, `idx_generated_plans_is_active`
- JSONB searches: GIN indexes on `meal_plan` and `workout_plan`
- Favorites: Partial index on `is_favorite = true`

## Row Level Security (RLS)

All tables have RLS enabled with policies that ensure:
- Users can only view their own data
- Users can only modify their own data
- No cross-user data access

**Policy Pattern:**
```sql
-- SELECT: USING (auth.uid() = user_id)
-- INSERT: WITH CHECK (auth.uid() = user_id)
-- UPDATE: USING and WITH CHECK (auth.uid() = user_id)
-- DELETE: USING (auth.uid() = user_id)
```

## Helper Functions

### 1. `handle_new_user()`
- Trigger function that auto-creates a profile when a new user signs up
- Pulls email and full_name from auth.users metadata

### 2. `calculate_bmi(height_cm, weight_kg)`
- Returns BMI calculation
- Formula: weight_kg / (height_cm/100)²

### 3. `calculate_age(date_of_birth)`
- Returns current age in years
- Uses PostgreSQL AGE function

### 4. `update_updated_at_column()`
- Trigger function that automatically updates `updated_at` timestamp
- Applied to all tables

## JSONB Structure Examples

### Meal Plan Structure:
```typescript
{
  days: [
    {
      day: 1,
      date: "2023-11-28",
      meals: [
        {
          meal_type: "breakfast",
          name: "Protein Oatmeal",
          ingredients: [...],
          instructions: [...],
          nutrition: {
            calories: 450,
            protein_g: 25,
            carbs_g: 55,
            fats_g: 12
          }
        }
      ],
      total_calories: 2000,
      total_protein_g: 150,
      total_carbs_g: 200,
      total_fats_g: 60
    }
  ],
  shopping_list: [...],
  meal_prep_instructions: [...]
}
```

### Workout Plan Structure:
```typescript
{
  weeks: [
    {
      week: 1,
      workouts: [
        {
          day: 1,
          workout_type: "strength",
          focus_area: "Upper Body",
          exercises: [
            {
              name: "Bench Press",
              sets: 3,
              reps: "8-10",
              rest_seconds: 90,
              instructions: [...]
            }
          ]
        }
      ]
    }
  ],
  progression_strategy: "Linear progression"
}
```

## Relationships

```
auth.users (Supabase Auth)
    ↓ (1:1)
profiles
    ↓ (1:1)
user_preferences

profiles
    ↓ (1:many)
generated_plans
```

## Data Constraints

- Heights: 0-300 cm
- Weights: 0-500 kg
- Calories: 0-10,000 per day
- Meals: 1-8 per day
- Workouts: 0-14 per week (allows twice-a-day training)
- Plan duration: 1-365 days

## Query Examples

### Get user profile with preferences:
```sql
SELECT p.*, up.*
FROM profiles p
LEFT JOIN user_preferences up ON up.user_id = p.id
WHERE p.id = auth.uid();
```

### Get active plan:
```sql
SELECT *
FROM generated_plans
WHERE user_id = auth.uid()
AND is_active = true
ORDER BY created_at DESC
LIMIT 1;
```

### Search meal plans by ingredient (JSONB):
```sql
SELECT *
FROM generated_plans
WHERE user_id = auth.uid()
AND meal_plan @> '{"days": [{"meals": [{"ingredients": [{"name": "chicken"}]}]}]}';
```

## Migration Files

- `20231128000001_initial_schema.sql` - Complete initial schema setup

## TypeScript Integration

Import types from `src/types/database.types.ts`:

```typescript
import { Database, Profile, GeneratedPlan } from '@/types/database.types';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient<Database>(url, key);

// Fully typed queries
const { data } = await supabase
  .from('profiles')
  .select('*')
  .single();
```

## Maintenance

### Regular Tasks:
1. Monitor index usage and query performance
2. Vacuum and analyze tables periodically
3. Review and optimize slow queries
4. Archive old generated plans if needed
5. Monitor JSONB column sizes

### Scaling Considerations:
- Consider partitioning `generated_plans` by user_id or created_at
- Archive plans older than 1 year
- Add materialized views for analytics
- Consider separate tables for meal/workout history tracking
