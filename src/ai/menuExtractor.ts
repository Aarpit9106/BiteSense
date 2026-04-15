export type ExtractedMenuItem = {
  id: string;
  name: string;
  description: string;
  ingredients: string[];
  cookingMethod: string;
};

// Mock function that will eventually use OpenAI Vision
export async function extractMenuFromImage(imageBase64: string): Promise<ExtractedMenuItem[]> {
  console.log("Mock extraction from image...", imageBase64.substring(0, 20) + "...");
  
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  return [
    {
      id: "dish-1",
      name: "Grilled Salmon Asparagus",
      description: "Wild caught salmon pan-seared with olive oil, served with garlic roasted asparagus.",
      ingredients: ["salmon", "olive oil", "asparagus", "garlic", "lemon"],
      cookingMethod: "grilled",
    },
    {
      id: "dish-2",
      name: "Classic Cheeseburger",
      description: "Beef patty with cheddar cheese, lettuce, tomato, and mayo on a brioche bun.",
      ingredients: ["beef", "cheese", "lettuce", "tomato", "mayo", "bread"],
      cookingMethod: "fried",
    },
    {
      id: "dish-3",
      name: "Quinoa Salad Bowl",
      description: "Mixed greens, quinoa, cherry tomatoes, cucumbers, feta cheese, and balsamic vinaigrette.",
      ingredients: ["quinoa", "greens", "tomato", "cucumber", "feta", "balsamic"],
      cookingMethod: "raw",
    },
    {
      id: "dish-4",
      name: "Sweet Potato Fries",
      description: "Deep fried sweet potato strips seasoned with salt.",
      ingredients: ["sweet potato", "oil", "salt"],
      cookingMethod: "deep fried",
    },
    {
      id: "dish-5",
      name: "Chicken Breast Platter",
      description: "Steamed chicken breast with a side of broccoli.",
      ingredients: ["chicken", "broccoli"],
      cookingMethod: "steamed",
    }
  ];
}
