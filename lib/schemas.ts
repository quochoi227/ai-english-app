import { z } from 'zod';

// Translation API Schema
export const translateResponseSchema = z.object({
  translation: z.string().min(1, "Translation cannot be empty"),
  explanation: z.string().nullable(),
  alternatives: z.array(z.string()).max(2),
});

export type TranslateResponse = z.infer<typeof translateResponseSchema>;

// Practice Generate API Schema
export const practiceGenerateResponseSchema = z.object({
  sentences: z.array(z.string().min(1)).min(7).max(10),
  topic: z.string().min(1, "Topic cannot be empty"),
});

export type PracticeGenerateResponse = z.infer<typeof practiceGenerateResponseSchema>;

// Practice Evaluate API Schema
export const errorSchema = z.object({
  error: z.string(),
  correction: z.string(),
  explanation: z.string(),
});

export const evaluateResponseSchema = z.object({
  score: z.number().min(0).max(10),
  feedback: z.string().min(1, "Feedback cannot be empty"),
  errors: z.array(errorSchema),
  suggestedTranslation: z.string().min(1, "Suggested translation cannot be empty"),
  isCorrect: z.boolean(),
});

export type EvaluateResponse = z.infer<typeof evaluateResponseSchema>;

// Utility function to validate and sanitize AI response
export function validateResponse<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  fallback: T
): T {
  try {
    return schema.parse(data);
  } catch (error) {
    console.error("Validation error:", error);
    return fallback;
  }
}
