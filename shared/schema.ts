import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const words = pgTable("words", {
  id: serial("id").primaryKey(),
  text: text("text").notNull(),
  pronunciation: text("pronunciation"),
  meaning: text("meaning").notNull(),
  example: text("example"),
  translation: text("translation"),
  difficulty: integer("difficulty").default(0), // 0-4 based on user performance
  reviewCount: integer("review_count").default(0),
  correctCount: integer("correct_count").default(0),
  nextReview: timestamp("next_review").defaultNow(),
  addedAt: timestamp("added_at").defaultNow(),
  lastReviewed: timestamp("last_reviewed"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertWordSchema = createInsertSchema(words).omit({
  id: true,
  addedAt: true,
  lastReviewed: true,
});

export const reviewResultSchema = z.object({
  wordId: z.number(),
  difficulty: z.enum(["again", "hard", "good", "easy"]),
});

export const translationRequestSchema = z.object({
  text: z.string().min(1).max(1000),
  sourceLanguage: z.string().optional(),
  targetLanguage: z.string().default("zh"),
});

export const themeGenerationSchema = z.object({
  theme: z.string().min(1).max(500),
  level: z.enum(["beginner", "intermediate", "advanced", "mixed"]).default("intermediate"),
  count: z.number().min(5).max(50).default(20),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertWord = z.infer<typeof insertWordSchema>;
export type Word = typeof words.$inferSelect;
export type ReviewResult = z.infer<typeof reviewResultSchema>;
export type TranslationRequest = z.infer<typeof translationRequestSchema>;
export type ThemeGeneration = z.infer<typeof themeGenerationSchema>;

export interface TranslationResponse {
  originalText: string;
  translatedText: string;
  extractedWords: {
    text: string;
    pronunciation?: string;
    meaning: string;
    example?: string;
    importance: number;
  }[];
}

export interface ThemeWordsResponse {
  theme: string;
  words: {
    text: string;
    pronunciation?: string;
    meaning: string;
    context: string;
    difficulty: string;
  }[];
}
