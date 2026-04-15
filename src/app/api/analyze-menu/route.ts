import { NextResponse } from "next/server";
import OpenAI from "openai";

// The model to use — easily swappable to gpt-4o for better accuracy
const VISION_MODEL = "gpt-4o-mini";

const EXTRACTION_PROMPT = `You are a nutrition analysis AI. Analyze this restaurant menu image.

Extract each visible dish/item from the menu. For each dish, provide:
- id: a unique identifier (dish-1, dish-2, etc.)
- name: the dish name exactly as shown
- description: brief description from the menu, or infer one if not visible
- ingredients: array of likely key ingredients (infer from the dish name and description)
- cookingMethod: one of "grilled", "fried", "deep fried", "steamed", "raw", "baked", "sauteed", "roasted"

Return ONLY a valid JSON array of objects. No markdown, no explanation. Example:
[{"id":"dish-1","name":"Grilled Chicken","description":"...","ingredients":["chicken","herbs"],"cookingMethod":"grilled"}]

If you cannot read the menu clearly, return your best interpretation of visible items.
If this is not a menu image, return: [{"id":"dish-1","name":"Unable to detect menu","description":"The image does not appear to be a restaurant menu","ingredients":[],"cookingMethod":"raw"}]`;

export async function POST(request: Request) {
  try {
    const { image } = await request.json();

    if (!image) {
      return NextResponse.json(
        { error: "No image provided" },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;

    // If no API key, return mock signal so client falls back
    if (!apiKey) {
      return NextResponse.json({ mode: "mock" }, { status: 200 });
    }

    const openai = new OpenAI({ apiKey });

    // Build the image content — handle both data URL and raw base64
    const imageUrl = image.startsWith("data:")
      ? image
      : `data:image/jpeg;base64,${image}`;

    const response = await openai.chat.completions.create({
      model: VISION_MODEL,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: EXTRACTION_PROMPT },
            {
              type: "image_url",
              image_url: {
                url: imageUrl,
                detail: "low", // Cost-efficient: 85 tokens instead of thousands
              },
            },
          ],
        },
      ],
      max_tokens: 2000,
      temperature: 0.1, // Low temperature for consistent structured output
    });

    const content = response.choices[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: "No response from AI" },
        { status: 500 }
      );
    }

    // Parse the JSON from the response (handle potential markdown wrapping)
    let parsed;
    try {
      const cleaned = content
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      parsed = JSON.parse(cleaned);
    } catch {
      return NextResponse.json(
        { error: "Failed to parse AI response", raw: content },
        { status: 500 }
      );
    }

    return NextResponse.json({
      mode: "live",
      dishes: parsed,
      model: VISION_MODEL,
    });
  } catch (error) {
    console.error("Menu analysis error:", error);

    // Handle rate limiting
    if (error instanceof OpenAI.RateLimitError) {
      return NextResponse.json(
        { error: "Rate limited. Please try again in a moment." },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: "Analysis failed. Please try again." },
      { status: 500 }
    );
  }
}
