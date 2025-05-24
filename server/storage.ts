import { words, type Word, type InsertWord } from "@shared/schema";
import { db } from "./db";
import { eq, lte, sql } from "drizzle-orm";

export interface IStorage {
  getWord(id: number): Promise<Word | undefined>;
  getAllWords(): Promise<Word[]>;
  createWord(word: InsertWord): Promise<Word>;
  updateWord(id: number, updates: Partial<Word>): Promise<Word | undefined>;
  deleteWord(id: number): Promise<boolean>;
  getWordsForReview(): Promise<Word[]>;
  updateWordReview(id: number, difficulty: string): Promise<Word | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getWord(id: number): Promise<Word | undefined> {
    const [word] = await db.select().from(words).where(eq(words.id, id));
    return word || undefined;
  }

  async getAllWords(): Promise<Word[]> {
    return await db.select().from(words).orderBy(words.addedAt);
  }

  async createWord(insertWord: InsertWord): Promise<Word> {
    const [word] = await db
      .insert(words)
      .values({
        ...insertWord,
        pronunciation: insertWord.pronunciation || null,
        example: insertWord.example || null,
        translation: insertWord.translation || null,
        difficulty: insertWord.difficulty || 0,
        reviewCount: insertWord.reviewCount || 0,
        correctCount: insertWord.correctCount || 0,
        nextReview: insertWord.nextReview || new Date(),
      })
      .returning();
    return word;
  }

  async updateWord(id: number, updates: Partial<Word>): Promise<Word | undefined> {
    const [word] = await db
      .update(words)
      .set(updates)
      .where(eq(words.id, id))
      .returning();
    return word || undefined;
  }

  async deleteWord(id: number): Promise<boolean> {
    const result = await db.delete(words).where(eq(words.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getWordsForReview(): Promise<Word[]> {
    const now = new Date();
    return await db
      .select()
      .from(words)
      .where(lte(words.nextReview, now))
      .orderBy(words.nextReview);
  }

  async updateWordReview(id: number, difficulty: string): Promise<Word | undefined> {
    const word = await this.getWord(id);
    if (!word) return undefined;

    const now = new Date();
    let intervalDays = 1;

    // Spaced repetition algorithm based on difficulty
    switch (difficulty) {
      case "again":
        intervalDays = 0; // Review again in less than 1 minute (set to 0 for immediate)
        break;
      case "hard":
        intervalDays = 0.25; // 6 hours
        break;
      case "good":
        intervalDays = Math.max(1, (word.difficulty || 0) * 2.5);
        break;
      case "easy":
        intervalDays = Math.max(4, (word.difficulty || 0) * 4);
        break;
    }

    const nextReview = new Date(now.getTime() + intervalDays * 24 * 60 * 60 * 1000);

    const updates = {
      difficulty: difficulty === "good" || difficulty === "easy" ? 
        Math.min((word.difficulty || 0) + 1, 4) : 
        Math.max((word.difficulty || 0) - 1, 0),
      reviewCount: (word.reviewCount || 0) + 1,
      correctCount: (word.correctCount || 0) + (difficulty === "good" || difficulty === "easy" ? 1 : 0),
      lastReviewed: now,
      nextReview: nextReview,
    };

    return await this.updateWord(id, updates);
  }
}

export const storage = new DatabaseStorage();
