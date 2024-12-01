// openaiHelper.ts
import { RequestCache } from "./cache";

type FieldPath = string;

interface OpenAIHelperParams {
  apiKey: string;
  systemPrompt: string;
  userPrompt: string;
  requiredFields: FieldPath[];
  temperature?: number;
  skipCache: boolean;
}

export async function callOpenAI<T>({
  apiKey,
  systemPrompt,
  userPrompt,
  requiredFields,
  temperature,
  skipCache = false,
}: OpenAIHelperParams): Promise<T> {
  const cache = RequestCache.getInstance();
  const cacheKey = `${systemPrompt}:${userPrompt}`;

  if (!skipCache) {
    const cachedResult = cache.get(cacheKey);
    if (cachedResult) {
      return cachedResult as T;
    }
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        response_format: { type: "json_object" },
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: userPrompt,
          },
        ],
        temperature,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `OpenAI API error: ${error.error?.message || "Unknown error"}`
      );
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Parse the JSON response
    let parsed: T;
    try {
      parsed = JSON.parse(content);
    } catch {
      console.error("Failed to parse OpenAI response:", content);
      throw new Error("Failed to parse response");
    }

    // Validate required fields
    for (const field of requiredFields) {
      const value = field
        .split(".")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .reduce((obj, key) => obj?.[key], parsed as any);
      if (!value) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    if (!skipCache) {
      cache.set(cacheKey, parsed);
    }

    return parsed;
  } catch (error) {
    console.error("Error in OpenAI call:", error);
    throw error;
  }
}
