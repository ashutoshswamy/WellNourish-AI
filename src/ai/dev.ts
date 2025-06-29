import { config } from "dotenv";
config();

import "@/ai/flows/generate-personalized-plan.ts";
import "@/ai/flows/receive-health-tips.ts";
import "@/ai/flows/improve-plan-from-feedback.ts";
