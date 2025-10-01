"use client";

import { useActionState, useRef, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { generatePlans, type PlanState } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Bot, Loader2, Plus, X } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { DatabaseService } from "@/lib/database";

const initialState: PlanState = {};

// Predefined options for dietary preferences
const dietaryPreferenceOptions = [
  "Vegetarian",
  "Vegan",
  "Keto",
  "Paleo",
  "Mediterranean",
  "Low-carb",
  "Low-fat",
  "Gluten-free",
  "Dairy-free",
  "Intermittent fasting",
];

// Predefined options for cuisines
const cuisineOptions = [
  "Italian",
  "Indian",
  "Chinese",
  "Mexican",
  "Mediterranean",
  "Japanese",
  "Thai",
  "French",
  "American",
  "Middle Eastern",
  "Korean",
  "Vietnamese",
  "Greek",
  "Spanish",
  "Lebanese",
];

// Common allergens
const allergenOptions = [
  "Nuts",
  "Peanuts",
  "Shellfish",
  "Fish",
  "Eggs",
  "Dairy/Milk",
  "Soy",
  "Wheat/Gluten",
  "Sesame",
  "Sulphites",
];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      size="lg"
      className="w-full touch-target-large text-sm xs:text-base md:text-lg font-semibold bg-gradient-to-r from-primary to-green-600 hover:from-primary/90 hover:to-green-600/90 transition-all duration-200 shadow-lg hover:shadow-xl focus-ring"
      disabled={pending}
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 md:mr-3 h-4 w-4 xs:h-5 xs:w-5 animate-spin" />
          <span className="hidden xs:inline">Generating Your Plan...</span>
          <span className="xs:hidden">Generating...</span>
        </>
      ) : (
        <>
          <Bot className="mr-2 md:mr-3 h-4 w-4 xs:h-5 xs:w-5" />
          <span className="hidden sm:inline">
            Generate My Personalized Plan
          </span>
          <span className="sm:hidden">Generate Plan</span>
        </>
      )}
    </Button>
  );
}

function MultiSelectCheckbox({
  options,
  name,
  label,
  description,
}: {
  options: string[];
  name: string;
  label: string;
  description?: string;
}) {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleCheckboxChange = (item: string, checked: boolean) => {
    if (checked) {
      setSelectedItems((prev) => [...prev, item]);
    } else {
      setSelectedItems((prev) => prev.filter((i) => i !== item));
    }
  };

  return (
    <div className="space-y-3 xs:space-y-4">
      <div>
        <Label className="text-sm xs:text-base md:text-lg font-semibold text-foreground">
          {label}
        </Label>
        {description && (
          <p className="text-xs xs:text-sm md:text-base text-muted-foreground mt-1 xs:mt-2">
            {description}
          </p>
        )}
      </div>
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 xs:gap-3 md:gap-4">
        {options.map((option) => (
          <div
            key={option}
            className="flex items-center space-x-2 xs:space-x-3 p-2 xs:p-3 rounded-lg hover:bg-muted/30 transition-colors"
          >
            <Checkbox
              id={`${name}-${option}`}
              name={name}
              value={option}
              checked={selectedItems.includes(option)}
              onCheckedChange={(checked) =>
                handleCheckboxChange(option, checked as boolean)
              }
              className="touch-target-large"
            />
            <label
              htmlFor={`${name}-${option}`}
              className="text-xs xs:text-sm md:text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer touch-target flex-1"
            >
              {option}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

function CustomInput({
  items,
  setItems,
  placeholder,
  label,
  name,
}: {
  items: string[];
  setItems: (items: string[]) => void;
  placeholder: string;
  label: string;
  name: string;
}) {
  const [inputValue, setInputValue] = useState("");

  const addItem = () => {
    if (inputValue.trim() && !items.includes(inputValue.trim())) {
      setItems([...items, inputValue.trim()]);
      setInputValue("");
    }
  };

  const removeItem = (item: string) => {
    setItems(items.filter((i) => i !== item));
  };

  return (
    <div className="space-y-3 xs:space-y-4">
      <Label className="text-sm xs:text-base md:text-lg font-semibold text-foreground">
        {label}
      </Label>
      <div className="flex flex-col xs:flex-row gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={placeholder}
          onKeyPress={(e) =>
            e.key === "Enter" && (e.preventDefault(), addItem())
          }
          className="flex-1 text-base md:text-sm touch-target focus-ring"
        />
        <Button
          type="button"
          onClick={addItem}
          size="sm"
          className="xs:w-auto w-full touch-target focus-ring"
        >
          <Plus className="h-4 w-4 mr-0 xs:mr-2" />
          <span className="xs:hidden">Add</span>
        </Button>
      </div>
      {items.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {items.map((item) => (
            <div
              key={item}
              className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-2 rounded-md text-sm touch-target"
            >
              <span className="text-xs md:text-sm">{item}</span>
              <button
                type="button"
                onClick={() => removeItem(item)}
                className="hover:bg-primary/20 rounded p-1 touch-target focus-ring ml-1"
                aria-label={`Remove ${item}`}
              >
                <X className="h-3 w-3 md:h-4 md:w-4" />
              </button>
              {/* Hidden input for form submission */}
              <input type="hidden" name={name} value={item} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function EnhancedProfileForm({
  onPlanGenerated,
}: {
  onPlanGenerated: (plans: PlanState) => void;
}) {
  const [state, formAction] = useActionState(generatePlans, initialState);
  const { toast } = useToast();
  const { user } = useAuth();
  const formRef = useRef<HTMLFormElement>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  // Height conversion states
  const [heightCm, setHeightCm] = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightInches, setHeightInches] = useState("");

  // Weight conversion states
  const [weightKg, setWeightKg] = useState("");
  const [weightLbs, setWeightLbs] = useState("");

  // Custom inputs for dietary preferences, cuisines, and allergies
  const [customDietaryPrefs, setCustomDietaryPrefs] = useState<string[]>([]);
  const [customCuisines, setCustomCuisines] = useState<string[]>([]);
  const [customAllergies, setCustomAllergies] = useState<string[]>([]);

  // Height conversion functions
  const cmToFeetInches = (cm: number) => {
    const totalInches = cm / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return { feet, inches };
  };

  const feetInchesToCm = (feet: number, inches: number) => {
    return Math.round((feet * 12 + inches) * 2.54);
  };

  // Weight conversion functions
  const kgToLbs = (kg: number) => Math.round(kg * 2.20462);
  const lbsToKg = (lbs: number) => Math.round((lbs / 2.20462) * 100) / 100;

  // Handle height conversions
  const handleHeightCmChange = (value: string) => {
    setHeightCm(value);
    if (value) {
      const cm = parseInt(value);
      if (!isNaN(cm)) {
        const { feet, inches } = cmToFeetInches(cm);
        setHeightFt(feet.toString());
        setHeightInches(inches.toString());
      }
    }
  };

  const handleHeightFeetInchesChange = (feet: string, inches: string) => {
    setHeightFt(feet);
    setHeightInches(inches);
    if (feet && inches) {
      const f = parseInt(feet);
      const i = parseInt(inches);
      if (!isNaN(f) && !isNaN(i)) {
        const cm = feetInchesToCm(f, i);
        setHeightCm(cm.toString());
      }
    }
  };

  // Handle weight conversions
  const handleWeightKgChange = (value: string) => {
    setWeightKg(value);
    if (value) {
      const kg = parseFloat(value);
      if (!isNaN(kg)) {
        setWeightLbs(kgToLbs(kg).toString());
      }
    }
  };

  const handleWeightLbsChange = (value: string) => {
    setWeightLbs(value);
    if (value) {
      const lbs = parseFloat(value);
      if (!isNaN(lbs)) {
        setWeightKg(lbsToKg(lbs).toString());
      }
    }
  };

  // Load existing profile data if user is logged in
  useEffect(() => {
    if (user) {
      loadExistingProfile();
    }
  }, [user]);

  const loadExistingProfile = async () => {
    if (!user) return;

    setLoadingProfile(true);
    try {
      const db = new DatabaseService();
      const profile = await db.getProfile(user.id);

      if (profile && formRef.current) {
        // Populate form with existing data
        const form = formRef.current;
        const ageInput = form.querySelector(
          'input[name="age"]'
        ) as HTMLInputElement;

        if (ageInput) ageInput.value = profile.age.toString();

        // Set height values
        if (profile.height_cm) {
          setHeightCm(profile.height_cm.toString());
          if (profile.height_ft && profile.height_inches !== null) {
            setHeightFt(profile.height_ft.toString());
            setHeightInches((profile.height_inches || 0).toString());
          } else {
            const { feet, inches } = cmToFeetInches(profile.height_cm);
            setHeightFt(feet.toString());
            setHeightInches(inches.toString());
          }
        }

        // Set weight values
        if (profile.weight_kg) {
          setWeightKg(profile.weight_kg.toString());
          if (profile.weight_lbs) {
            setWeightLbs(profile.weight_lbs.toString());
          } else {
            setWeightLbs(kgToLbs(profile.weight_kg).toString());
          }
        }

        // Set custom arrays
        if (profile.dietary_preferences)
          setCustomDietaryPrefs(profile.dietary_preferences);
        if (profile.preferred_cuisine)
          setCustomCuisines(profile.preferred_cuisine);
        if (profile.allergies) setCustomAllergies(profile.allergies);

        // Set goal
        if (profile.goal) {
          const goalInput = form.querySelector(
            'input[name="goal"]'
          ) as HTMLInputElement;
          if (goalInput) goalInput.value = profile.goal;
        }
      } else if (!profile) {
        console.log("No existing profile found, user will create a new one");
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      // Don't show error to user for profile loading since it's expected for new users
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    if (state.error) {
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: state.error,
      });
    } else if (state.dietPlan && state.workoutRegimen) {
      onPlanGenerated(state);
      toast({
        title: "Success!",
        description: "Your personalized plan has been generated and saved.",
      });
    }
  }, [state, onPlanGenerated, toast]);

  return (
    <div className="container-fluid py-section">
      <div className="text-center mb-section">
        <h2 className="text-heading font-bold font-headline text-foreground mb-3">
          Create Your Comprehensive Wellness Profile
        </h2>
        <p className="text-lead text-muted-foreground container-narrow">
          Help us understand your unique needs, preferences, and restrictions to
          create the perfect personalized diet and workout plan for you.
        </p>
      </div>

      <form action={formAction} className="space-y-responsive" ref={formRef}>
        {/* Basic Information */}
        <Card className="border-0 shadow-xl bg-gradient-to-br from-card to-card/80 backdrop-blur card-responsive">
          <CardHeader className="pb-6 md:pb-8">
            <CardTitle className="text-xl md:text-2xl font-headline flex items-center gap-2 md:gap-3">
              <div className="w-1.5 md:w-2 h-6 md:h-8 bg-gradient-to-b from-primary to-green-600 rounded-full"></div>
              Basic Information
            </CardTitle>
            <CardDescription className="text-sm md:text-base">
              Tell us about yourself
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-responsive">
            {/* Age and Gender */}
            <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 gap-3 xs:gap-4 md:gap-6">
              <div className="space-y-2 xs:space-y-3">
                <Label
                  htmlFor="age"
                  className="text-sm xs:text-base md:text-lg font-semibold text-foreground"
                >
                  Age
                </Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  placeholder="e.g., 30"
                  required
                  className="touch-target-large text-sm xs:text-base border-2 focus:border-primary transition-colors focus-ring"
                />
              </div>

              <div className="space-y-2 xs:space-y-3">
                <Label
                  htmlFor="gender"
                  className="text-sm xs:text-base md:text-lg font-semibold text-foreground"
                >
                  Gender
                </Label>
                <Select name="gender" required>
                  <SelectTrigger
                    id="gender"
                    className="touch-target-large text-sm xs:text-base border-2 focus:border-primary focus-ring"
                  >
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer_not_to_say">
                      Prefer not to say
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Height Section */}
            <div className="space-y-3 xs:space-y-4">
              <Label className="text-sm xs:text-base md:text-lg font-semibold text-foreground">
                Height
              </Label>
              <div className="grid grid-cols-1 xs:grid-cols-3 gap-2 xs:gap-3 md:gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="height_cm"
                    className="text-xs xs:text-sm text-muted-foreground"
                  >
                    Centimeters
                  </Label>
                  <Input
                    id="height_cm"
                    name="height_cm"
                    type="number"
                    placeholder="e.g., 175"
                    value={heightCm}
                    onChange={(e) => handleHeightCmChange(e.target.value)}
                    required
                    className="touch-target text-sm xs:text-base border-2 focus:border-primary transition-colors focus-ring"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="height_ft"
                    className="text-xs xs:text-sm text-muted-foreground"
                  >
                    Feet
                  </Label>
                  <Input
                    id="height_ft"
                    name="height_ft"
                    type="number"
                    placeholder="e.g., 5"
                    value={heightFt}
                    onChange={(e) =>
                      handleHeightFeetInchesChange(e.target.value, heightInches)
                    }
                    className="touch-target text-sm xs:text-base border-2 focus:border-primary transition-colors focus-ring"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="height_inches"
                    className="text-xs xs:text-sm text-muted-foreground"
                  >
                    Inches
                  </Label>
                  <Input
                    id="height_inches"
                    name="height_inches"
                    type="number"
                    placeholder="e.g., 9"
                    value={heightInches}
                    onChange={(e) =>
                      handleHeightFeetInchesChange(heightFt, e.target.value)
                    }
                    className="touch-target text-sm xs:text-base border-2 focus:border-primary transition-colors focus-ring"
                  />
                </div>
              </div>
            </div>

            {/* Weight Section */}
            <div className="space-y-3 xs:space-y-4">
              <Label className="text-sm xs:text-base md:text-lg font-semibold text-foreground">
                Weight
              </Label>
              <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 xs:gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="weight_kg"
                    className="text-xs xs:text-sm text-muted-foreground"
                  >
                    Kilograms
                  </Label>
                  <Input
                    id="weight_kg"
                    name="weight_kg"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 70.5"
                    value={weightKg}
                    onChange={(e) => handleWeightKgChange(e.target.value)}
                    required
                    className="touch-target text-sm xs:text-base border-2 focus:border-primary transition-colors focus-ring"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="weight_lbs"
                    className="text-xs xs:text-sm text-muted-foreground"
                  >
                    Pounds
                  </Label>
                  <Input
                    id="weight_lbs"
                    name="weight_lbs"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 155.4"
                    value={weightLbs}
                    onChange={(e) => handleWeightLbsChange(e.target.value)}
                    className="touch-target text-sm xs:text-base border-2 focus:border-primary transition-colors focus-ring"
                  />
                </div>
              </div>
            </div>

            {/* Activity Level Section */}
            <div className="space-y-6">
              <div>
                <Label className="text-sm font-semibold text-foreground mb-3 block">
                  Activity Level
                </Label>
                <p className="text-sm text-muted-foreground mb-4">
                  Choose the option that best describes your current physical
                  activity
                </p>
              </div>

              <RadioGroup
                name="activityLevel"
                defaultValue="moderatelyActive"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
              >
                <div className="relative">
                  <RadioGroupItem
                    value="sedentary"
                    id="sedentary"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="sedentary"
                    className="flex flex-col items-center justify-center rounded-xl border-2 border-muted bg-card/50 p-6 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-all duration-200 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 peer-data-[state=checked]:shadow-lg [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5"
                  >
                    <div className="text-lg font-semibold mb-1">Sedentary</div>
                    <div className="text-xs text-muted-foreground text-center">
                      Desk job, little exercise
                    </div>
                  </Label>
                </div>

                <div className="relative">
                  <RadioGroupItem
                    value="lightlyActive"
                    id="lightlyActive"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="lightlyActive"
                    className="flex flex-col items-center justify-center rounded-xl border-2 border-muted bg-card/50 p-6 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-all duration-200 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 peer-data-[state=checked]:shadow-lg [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5"
                  >
                    <div className="text-lg font-semibold mb-1">Light</div>
                    <div className="text-xs text-muted-foreground text-center">
                      1-3 days/week exercise
                    </div>
                  </Label>
                </div>

                <div className="relative">
                  <RadioGroupItem
                    value="moderatelyActive"
                    id="moderatelyActive"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="moderatelyActive"
                    className="flex flex-col items-center justify-center rounded-xl border-2 border-muted bg-card/50 p-6 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-all duration-200 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 peer-data-[state=checked]:shadow-lg [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5"
                  >
                    <div className="text-lg font-semibold mb-1">Moderate</div>
                    <div className="text-xs text-muted-foreground text-center">
                      3-5 days/week exercise
                    </div>
                  </Label>
                </div>

                <div className="relative">
                  <RadioGroupItem
                    value="veryActive"
                    id="veryActive"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="veryActive"
                    className="flex flex-col items-center justify-center rounded-xl border-2 border-muted bg-card/50 p-6 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-all duration-200 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 peer-data-[state=checked]:shadow-lg [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5"
                  >
                    <div className="text-lg font-semibold mb-1">
                      Very Active
                    </div>
                    <div className="text-xs text-muted-foreground text-center">
                      6-7 days/week exercise
                    </div>
                  </Label>
                </div>

                <div className="relative">
                  <RadioGroupItem
                    value="extraActive"
                    id="extraActive"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="extraActive"
                    className="flex flex-col items-center justify-center rounded-xl border-2 border-muted bg-card/50 p-6 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-all duration-200 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 peer-data-[state=checked]:shadow-lg [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5"
                  >
                    <div className="text-lg font-semibold mb-1">
                      Extra Active
                    </div>
                    <div className="text-xs text-muted-foreground text-center">
                      2x/day or intense training
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Goal Section */}
            <div className="space-y-4">
              <Label
                htmlFor="goal"
                className="text-sm font-semibold text-foreground"
              >
                Primary Goal
              </Label>
              <p className="text-sm text-muted-foreground mb-4">
                Describe what you'd like to achieve with your wellness plan. Be
                as specific as you'd like!
              </p>
              <Input
                id="goal"
                name="goal"
                type="text"
                placeholder="e.g., Lose 10 pounds, Build muscle mass, Improve cardiovascular health, Get stronger for hiking..."
                required
                className="h-12 text-base border-2 focus:border-primary transition-colors"
              />
              <div className="text-xs text-muted-foreground">
                <strong>Examples:</strong> Weight loss, Muscle gain, Improve
                endurance, Prepare for marathon, Tone up, Build strength,
                Increase flexibility, Better sleep, More energy, or any
                combination of goals.
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dietary Preferences and Restrictions */}
        <Card className="border-0 shadow-xl bg-gradient-to-br from-card to-card/80 backdrop-blur">
          <CardHeader className="pb-8">
            <CardTitle className="text-2xl font-headline flex items-center gap-3">
              <div className="w-2 h-8 bg-gradient-to-b from-orange-500 to-red-600 rounded-full"></div>
              Dietary Preferences & Restrictions
            </CardTitle>
            <CardDescription className="text-base">
              Tell us about your food preferences and any restrictions
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Dietary Preferences */}
            <MultiSelectCheckbox
              options={dietaryPreferenceOptions}
              name="dietary_preferences"
              label="Dietary Preferences"
              description="Select any dietary approaches you follow or prefer"
            />

            {/* Custom Dietary Preferences */}
            <CustomInput
              items={customDietaryPrefs}
              setItems={setCustomDietaryPrefs}
              placeholder="Add custom dietary preference..."
              label="Additional Dietary Preferences"
              name="dietary_preferences"
            />

            {/* Preferred Cuisines */}
            <MultiSelectCheckbox
              options={cuisineOptions}
              name="preferred_cuisine"
              label="Preferred Cuisines"
              description="Select the types of cuisine you enjoy most"
            />

            {/* Custom Cuisines */}
            <CustomInput
              items={customCuisines}
              setItems={setCustomCuisines}
              placeholder="Add custom cuisine..."
              label="Additional Preferred Cuisines"
              name="preferred_cuisine"
            />

            {/* Allergies and Intolerances */}
            <MultiSelectCheckbox
              options={allergenOptions}
              name="allergies"
              label="Allergies & Food Intolerances"
              description="Select any foods you're allergic to or cannot tolerate"
            />

            {/* Custom Allergies */}
            <CustomInput
              items={customAllergies}
              setItems={setCustomAllergies}
              placeholder="Add custom allergy or intolerance..."
              label="Additional Allergies & Intolerances"
              name="allergies"
            />
          </CardContent>
        </Card>

        {/* Submit Button */}
        <Card className="border-0 shadow-xl bg-gradient-to-br from-card to-card/80 backdrop-blur">
          <CardFooter className="pt-8">
            <div className="w-full">
              <SubmitButton />
              <p className="text-xs text-muted-foreground text-center mt-4">
                Your information is secure and used only to create your
                personalized plan. We'll respect all your dietary restrictions
                and preferences.
              </p>
            </div>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
