import type { ExtractedMenuItem } from "./menuExtractor";
import type { OnboardingData } from "@/components/onboarding/OnboardingWizard";

export type AgentAnalysis = {
  dishId: string;
  estimatedCalories: number;
  macros: { protein: number; carbs: number; fat: number };
  nutritionistScore: number;
  fitnessScore: number;
  longevityScore: number;
  medicalScore: number;
  tags: string[];
  reasoning: string;
};

// 1. NUTRITIONIST AGENT
function analyzeNutrition(dish: ExtractedMenuItem): Partial<AgentAnalysis> {
  // Mock estimation based on keywords
  let cals = 400;
  let protein = 15;
  let carbs = 40;
  let fat = 15;
  let score = 5; // out of 10

  if (dish.name.toLowerCase().includes("salmon")) { cals = 350; protein = 35; carbs = 5; fat = 20; score = 9; }
  if (dish.name.toLowerCase().includes("burger")) { cals = 850; protein = 30; carbs = 60; fat = 45; score = 2; }
  if (dish.name.toLowerCase().includes("quinoa")) { cals = 300; protein = 10; carbs = 45; fat = 12; score = 8; }
  if (dish.name.toLowerCase().includes("chicken")) { cals = 250; protein = 45; carbs = 10; fat = 5; score = 9; }
  if (dish.cookingMethod === "deep fried") { cals += 200; fat += 25; score -= 4; }

  return { estimatedCalories: cals, macros: { protein, carbs, fat }, nutritionistScore: Math.max(0, score) };
}

// 2. FITNESS COACH AGENT
function analyzeFitness(metrics: Partial<AgentAnalysis>, userGoal: string): { fitnessScore: number, tags: string[] } {
  let score = 5;
  const tags: string[] = [];
  const protein = metrics.macros?.protein || 0;

  if (protein > 30) {
    tags.push("High Protein");
    if (userGoal === "muscle gain") score += 4;
  }
  
  if ((metrics.estimatedCalories || 0) < 400 && userGoal === "weight loss") {
    score += 4;
    tags.push("Fat Loss");
  }

  return { fitnessScore: Math.min(10, score), tags };
}

// 3. LONGEVITY EXPERT AGENT
function analyzeLongevity(dish: ExtractedMenuItem): { longevityScore: number } {
  let score = 5;
  if (dish.ingredients.includes("olive oil") || dish.ingredients.includes("salmon")) score += 3;
  if (dish.cookingMethod === "steamed" || dish.cookingMethod === "raw") score += 2;
  if (dish.cookingMethod === "deep fried" || dish.ingredients.includes("beef")) score -= 3;
  return { longevityScore: Math.max(0, score) };
}

// 4. MEDICAL DIET AGENT
function analyzeMedical(dish: ExtractedMenuItem, profile: OnboardingData): { medicalScore: number, avoid: boolean, reasoning: string } {
  let score = 10;
  let avoid = false;
  let reasoning = "Good option.";

  if (profile.diet === "vegetarian" && (dish.ingredients.includes("beef") || dish.ingredients.includes("chicken") || dish.ingredients.includes("salmon"))) {
    avoid = true;
    score = 0;
    reasoning = "Contains non-vegetarian ingredients.";
  }

  if (profile.diet === "vegan" && (dish.ingredients.includes("cheese") || dish.ingredients.includes("mayo") || dish.ingredients.includes("feta") || dish.ingredients.includes("beef"))) {
    avoid = true;
    score = 0;
    reasoning = "Contains animal products.";
  }

  if (dish.cookingMethod === "deep fried") {
    reasoning = "Deep fried foods can trigger inflammation. Keep portions small.";
  } else if (!avoid && dish.ingredients.includes("salmon")) {
    reasoning = "Rich in Omega-3s, excellent for your heart health and goals.";
  } else if (!avoid && dish.name.includes("Chicken")) {
    reasoning = "Lean protein bomb to hit your macro targets efficiently.";
  }

  if (avoid) {
    reasoning = `Strictly avoid. Does not fit your ${profile.diet} diet.`;
  }

  return { medicalScore: score, avoid, reasoning };
}

// PIPELINE EXECUTOR
export function runAgentsPipeline(dish: ExtractedMenuItem, profile: OnboardingData): AgentAnalysis {
  const nutrition = analyzeNutrition(dish);
  const fitness = analyzeFitness(nutrition, profile.goal);
  const longevity = analyzeLongevity(dish);
  const medical = analyzeMedical(dish, profile);

  // Synthesize into final reasoning or override reasoning
  const finalReasoning = medical.reasoning;

  return {
    dishId: dish.id,
    estimatedCalories: nutrition.estimatedCalories!,
    macros: nutrition.macros!,
    nutritionistScore: nutrition.nutritionistScore!,
    fitnessScore: fitness.fitnessScore,
    longevityScore: longevity.longevityScore,
    medicalScore: medical.medicalScore,
    tags: fitness.tags,
    reasoning: finalReasoning,
  };
}
