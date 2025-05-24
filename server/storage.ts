import { words, type Word, type InsertWord } from "@shared/schema";

export interface IStorage {
  getWord(id: number): Promise<Word | undefined>;
  getAllWords(): Promise<Word[]>;
  createWord(word: InsertWord): Promise<Word>;
  updateWord(id: number, updates: Partial<Word>): Promise<Word | undefined>;
  deleteWord(id: number): Promise<boolean>;
  getWordsForReview(): Promise<Word[]>;
  updateWordReview(id: number, difficulty: string): Promise<Word | undefined>;
}

export class MemStorage implements IStorage {
  private words: Map<number, Word>;
  private currentId: number;

  constructor() {
    this.words = new Map();
    this.currentId = 1;
  }

  async getWord(id: number): Promise<Word | undefined> {
    return this.words.get(id);
  }

  async getAllWords(): Promise<Word[]> {
    return Array.from(this.words.values()).sort((a, b) => 
      new Date(b.addedAt!).getTime() - new Date(a.addedAt!).getTime()
    );
  }

  async createWord(insertWord: InsertWord): Promise<Word> {
    const id = this.currentId++;
    const now = new Date();
    const word: Word = { 
      ...insertWord, 
      id,
      addedAt: now,
      lastReviewed: null,
      nextReview: now, // Available for immediate review
    };
    this.words.set(id, word);
    return word;
  }

  async updateWord(id: number, updates: Partial<Word>): Promise<Word | undefined> {
    const word = this.words.get(id);
    if (!word) return undefined;
    
    const updatedWord = { ...word, ...updates };
    this.words.set(id, updatedWord);
    return updatedWord;
  }

  async deleteWord(id: number): Promise<boolean> {
    return this.words.delete(id);
  }

  async getWordsForReview(): Promise<Word[]> {
    const now = new Date();
    return Array.from(this.words.values())
      .filter(word => new Date(word.nextReview!) <= now)
      .sort((a, b) => new Date(a.nextReview!).getTime() - new Date(b.nextReview!).getTime());
  }

  async updateWordReview(id: number, difficulty: string): Promise<Word | undefined> {
    const word = this.words.get(id);
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

    const updatedWord: Word = {
      ...word,
      difficulty: difficulty === "good" || difficulty === "easy" ? 
        Math.min((word.difficulty || 0) + 1, 4) : 
        Math.max((word.difficulty || 0) - 1, 0),
      reviewCount: (word.reviewCount || 0) + 1,
      correctCount: (word.correctCount || 0) + (difficulty === "good" || difficulty === "easy" ? 1 : 0),
      lastReviewed: now,
      nextReview: nextReview,
    };

    this.words.set(id, updatedWord);
    return updatedWord;
  }
}

export const storage = new MemStorage();
