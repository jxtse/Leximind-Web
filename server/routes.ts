import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertWordSchema, 
  reviewResultSchema, 
  translationRequestSchema, 
  themeGenerationSchema 
} from "@shared/schema";
import { translateAndExtractWords, generateThemeWords } from "./openai";

export async function registerRoutes(app: Express): Promise<Server> {
  // Translation endpoint
  app.post("/api/translate", async (req, res) => {
    try {
      const { text, sourceLanguage, targetLanguage, extractWords } = translationRequestSchema.parse(req.body);
      
      const result = await translateAndExtractWords(text, sourceLanguage, targetLanguage, extractWords);
      res.json(result);
    } catch (error) {
      console.error("Translation error:", error);
      res.status(500).json({ 
        message: "Translation failed", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Add word to vocabulary
  app.post("/api/words", async (req, res) => {
    try {
      const wordData = insertWordSchema.parse(req.body);
      const word = await storage.createWord(wordData);
      res.json(word);
    } catch (error) {
      console.error("Add word error:", error);
      res.status(400).json({ 
        message: "Failed to add word", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Get all words
  app.get("/api/words", async (req, res) => {
    try {
      const words = await storage.getAllWords();
      res.json(words);
    } catch (error) {
      console.error("Get words error:", error);
      res.status(500).json({ 
        message: "Failed to fetch words", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Get word by ID
  app.get("/api/words/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const word = await storage.getWord(id);
      if (!word) {
        return res.status(404).json({ message: "Word not found" });
      }
      res.json(word);
    } catch (error) {
      console.error("Get word error:", error);
      res.status(500).json({ 
        message: "Failed to fetch word", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Update word
  app.patch("/api/words/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const word = await storage.updateWord(id, updates);
      if (!word) {
        return res.status(404).json({ message: "Word not found" });
      }
      res.json(word);
    } catch (error) {
      console.error("Update word error:", error);
      res.status(500).json({ 
        message: "Failed to update word", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Delete word
  app.delete("/api/words/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteWord(id);
      if (!deleted) {
        return res.status(404).json({ message: "Word not found" });
      }
      res.json({ message: "Word deleted successfully" });
    } catch (error) {
      console.error("Delete word error:", error);
      res.status(500).json({ 
        message: "Failed to delete word", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Get words for review
  app.get("/api/words/review/due", async (req, res) => {
    try {
      const words = await storage.getWordsForReview();
      res.json(words);
    } catch (error) {
      console.error("Get review words error:", error);
      res.status(500).json({ 
        message: "Failed to fetch words for review", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Submit review result
  app.post("/api/words/review", async (req, res) => {
    try {
      const { wordId, difficulty } = reviewResultSchema.parse(req.body);
      const word = await storage.updateWordReview(wordId, difficulty);
      if (!word) {
        return res.status(404).json({ message: "Word not found" });
      }
      res.json(word);
    } catch (error) {
      console.error("Review word error:", error);
      res.status(400).json({ 
        message: "Failed to update word review", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Generate theme words
  app.post("/api/words/theme", async (req, res) => {
    try {
      const { theme, level, count } = themeGenerationSchema.parse(req.body);
      const result = await generateThemeWords(theme, level, count);
      res.json(result);
    } catch (error) {
      console.error("Theme generation error:", error);
      res.status(500).json({ 
        message: "Failed to generate theme words", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Get vocabulary statistics
  app.get("/api/stats", async (req, res) => {
    try {
      const allWords = await storage.getAllWords();
      const now = new Date();
      
      const stats = {
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
      
      res.json(stats);
    } catch (error) {
      console.error("Get stats error:", error);
      res.status(500).json({ 
        message: "Failed to fetch statistics", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
