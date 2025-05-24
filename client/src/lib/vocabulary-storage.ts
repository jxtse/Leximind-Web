import { Word } from "@shared/schema";

const STORAGE_KEY = "lexmind_vocabulary";

export interface VocabularyStats {
  totalWords: number;
  masteredWords: number;
  reviewingWords: number;
  newWords: number;
  wordsForReview: number;
}

export class VocabularyStorage {
  private words: Map<number, Word> = new Map();
  private nextId: number = 1;

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        this.words = new Map(data.words || []);
        this.nextId = data.nextId || 1;
      }
    } catch (error) {
      console.error("Failed to load vocabulary from storage:", error);
    }
  }

  private saveToStorage(): void {
    try {
      const data = {
        words: Array.from(this.words.entries()),
        nextId: this.nextId,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("Failed to save vocabulary to storage:", error);
    }
  }

  addWord(word: Omit<Word, "id" | "addedAt" | "lastReviewed">): Word {
    const id = this.nextId++;
    const now = new Date();
    const newWord: Word = {
      ...word,
      id,
      addedAt: now,
      lastReviewed: null,
      nextReview: now,
    };
    
    this.words.set(id, newWord);
    this.saveToStorage();
    return newWord;
  }

  getAllWords(): Word[] {
    return Array.from(this.words.values()).sort((a, b) => 
      new Date(b.addedAt!).getTime() - new Date(a.addedAt!).getTime()
    );
  }

  getWord(id: number): Word | undefined {
    return this.words.get(id);
  }

  updateWord(id: number, updates: Partial<Word>): Word | undefined {
    const word = this.words.get(id);
    if (!word) return undefined;
    
    const updatedWord = { ...word, ...updates };
    this.words.set(id, updatedWord);
    this.saveToStorage();
    return updatedWord;
  }

  deleteWord(id: number): boolean {
    const deleted = this.words.delete(id);
    if (deleted) {
      this.saveToStorage();
    }
    return deleted;
  }

  getWordsForReview(): Word[] {
    const now = new Date();
    return Array.from(this.words.values())
      .filter(word => new Date(word.nextReview!) <= now)
      .sort((a, b) => new Date(a.nextReview!).getTime() - new Date(b.nextReview!).getTime());
  }

  getStats(): VocabularyStats {
    const allWords = this.getAllWords();
    const now = new Date();
    
    return {
      totalWords: allWords.length,
      masteredWords: allWords.filter(w => (w.difficulty || 0) >= 3).length,
      reviewingWords: allWords.filter(w => 
        (w.difficulty || 0) < 3 && (w.reviewCount || 0) > 0
      ).length,
      newWords: allWords.filter(w => (w.reviewCount || 0) === 0).length,
      wordsForReview: allWords.filter(w => 
        new Date(w.nextReview!) <= now
      ).length,
    };
  }

  exportWords(): string {
    const words = this.getAllWords();
    const csvHeader = "Text,Pronunciation,Meaning,Example,Difficulty,Review Count,Correct Count,Added Date\n";
    const csvRows = words.map(word => 
      `"${word.text}","${word.pronunciation || ''}","${word.meaning}","${word.example || ''}",${word.difficulty || 0},${word.reviewCount || 0},${word.correctCount || 0},"${word.addedAt}"`
    ).join("\n");
    
    return csvHeader + csvRows;
  }

  clearAll(): void {
    this.words.clear();
    this.nextId = 1;
    this.saveToStorage();
  }
}

export const vocabularyStorage = new VocabularyStorage();
