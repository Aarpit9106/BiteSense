import { extractMenuFromImage } from "./menuExtractor";
import { runAgentsPipeline } from "./nutritionAgents";
import type { AgentAnalysis } from "./nutritionAgents";
import type { ExtractedMenuItem } from "./menuExtractor";
import type { OnboardingData } from "@/components/onboarding/OnboardingWizard";

export type RecommendationResult = {
  dish: ExtractedMenuItem;
  analysis: AgentAnalysis;
};

export type SynthesizedResponse = {
  best: RecommendationResult[];
  healthy: RecommendationResult[];
  avoid: RecommendationResult[];
  highProtein: RecommendationResult[];
  fatLoss: RecommendationResult[];
  longevity: RecommendationResult[];
};

export async function processMenuScanner(imageBase64: string, userProfile: OnboardingData): Promise<SynthesizedResponse> {
  const dishes = await extractMenuFromImage(imageBase64);
  
  const analyzed: RecommendationResult[] = dishes.map(dish => ({
    dish,
    analysis: runAgentsPipeline(dish, userProfile)
  }));

  const response: SynthesizedResponse = {
    best: [],
    healthy: [],
    avoid: [],
    highProtein: [],
    fatLoss: [],
    longevity: []
  };

  analyzed.forEach(item => {
    // Check if it should be avoided first
    if (item.analysis.medicalScore === 0 || item.analysis.nutritionistScore <= 3) {
      response.avoid.push(item);
      return; // Skip sorting into positive categories
    }

    // High Protein
    if (item.analysis.tags.includes("High Protein")) {
      response.highProtein.push(item);
    }
    
    // Fat Loss
    if (item.analysis.tags.includes("Fat Loss")) {
      response.fatLoss.push(item);
    }
    
    // Longevity
    if (item.analysis.longevityScore >= 7) {
      response.longevity.push(item);
    }

    // Healthy general
    if (item.analysis.nutritionistScore >= 7) {
      response.healthy.push(item);
    }

    // Best (Overall composite score based on user goal)
    const compositeScore = 
      item.analysis.nutritionistScore + 
      item.analysis.fitnessScore + 
      item.analysis.longevityScore;
    
    if (compositeScore > 21) {
      response.best.push(item);
    }
  });

  // If best is empty, pull the healthiest option into best
  if (response.best.length === 0 && response.healthy.length > 0) {
    response.best.push(response.healthy[0]);
  }

  return response;
}
