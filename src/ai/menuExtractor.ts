export type ExtractedMenuItem = {
  id: string;
  name: string;
  description: string;
  ingredients: string[];
  cookingMethod: string;
};

// Mock data for development / fallback
const MOCK_DISHES: ExtractedMenuItem[] = [
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
  },
];

/**
 * Mock extraction — used as fallback when OpenAI is not available.
 */
export async function extractMenuFromImageMock(): Promise<{
  dishes: ExtractedMenuItem[];
  mode: "mock";
}> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return { dishes: MOCK_DISHES, mode: "mock" };
}

/**
 * Primary extraction function — calls the API route which decides
 * whether to use OpenAI Vision or return a mock signal.
 */
export async function extractMenuFromImage(imageBase64: string): Promise<{
  dishes: ExtractedMenuItem[];
  mode: "live" | "mock";
  model?: string;
}> {
  try {
    const res = await fetch("/api/analyze-menu", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: imageBase64 }),
    });

    if (!res.ok) {
      console.warn("API returned error, falling back to mock");
      return extractMenuFromImageMock();
    }

    const data = await res.json();

    // API signals mock mode (no OPENAI_API_KEY)
    if (data.mode === "mock") {
      return extractMenuFromImageMock();
    }

    // Live mode — validate shape
    if (data.dishes && Array.isArray(data.dishes)) {
      const dishes: ExtractedMenuItem[] = data.dishes.map(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (d: any, i: number) => ({
          id: d.id || `dish-${i + 1}`,
          name: d.name || "Unknown Dish",
          description: d.description || "",
          ingredients: Array.isArray(d.ingredients) ? d.ingredients : [],
          cookingMethod: d.cookingMethod || "unknown",
        })
      );
      return { dishes, mode: "live", model: data.model };
    }

    // Unexpected shape — fallback
    return extractMenuFromImageMock();
  } catch (err) {
    console.error("Menu extraction failed:", err);
    return extractMenuFromImageMock();
  }
}
