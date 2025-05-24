import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export async function translateAndExtractWords(
  text: string,
  sourceLanguage: string = "auto",
  targetLanguage: string = "zh"
): Promise<{
  originalText: string;
  translatedText: string;
  extractedWords: Array<{
    text: string;
    pronunciation?: string;
    meaning: string;
    example?: string;
    importance: number;
  }>;
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a language learning assistant. Your task is to:
1. Translate the given text from ${sourceLanguage} to ${targetLanguage}
2. Extract important vocabulary words from the original text
3. Provide pronunciation, meaning, and example sentences for each word
4. Rate importance from 1-10 based on usefulness for language learners

Respond with JSON in this exact format:
{
  "originalText": "string",
  "translatedText": "string", 
  "extractedWords": [
    {
      "text": "string",
      "pronunciation": "string (IPA format)",
      "meaning": "string (in target language)",
      "example": "string (simple example sentence)",
      "importance": number
    }
  ]
}`
        },
        {
          role: "user",
          content: text
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result;
  } catch (error) {
    throw new Error("Translation failed: " + (error as Error).message);
  }
}

export async function generateThemeWords(
  theme: string,
  level: string = "intermediate",
  count: number = 20
): Promise<{
  theme: string;
  words: Array<{
    text: string;
    pronunciation?: string;
    meaning: string;
    context: string;
    difficulty: string;
  }>;
}> {
  try {
    const levelPrompts = {
      beginner: "A1-A2 level (basic everyday words)",
      intermediate: "B1-B2 level (common useful words)",
      advanced: "C1-C2 level (sophisticated vocabulary)",
      mixed: "mixed difficulty levels"
    };

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a vocabulary generator for language learners. Generate ${count} English words related to the given theme at ${levelPrompts[level as keyof typeof levelPrompts]} difficulty.

Each word should be:
- Relevant to the specified theme/scenario
- Appropriate for the difficulty level
- Useful for practical communication
- Include pronunciation in IPA format
- Include Chinese translation
- Include a contextual example sentence related to the theme

Respond with JSON in this exact format:
{
  "theme": "string",
  "words": [
    {
      "text": "string",
      "pronunciation": "string (IPA format)",
      "meaning": "string (Chinese translation)",
      "context": "string (example sentence in context)",
      "difficulty": "string (beginner/intermediate/advanced)"
    }
  ]
}`
        },
        {
          role: "user",
          content: `Theme/Scenario: ${theme}`
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result;
  } catch (error) {
    throw new Error("Theme word generation failed: " + (error as Error).message);
  }
}
