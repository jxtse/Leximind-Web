import { Word } from "@shared/schema";

export interface ReviewResult {
  difficulty: "again" | "hard" | "good" | "easy";
}

export class SpacedRepetitionAlgorithm {
  /**
   * Calculate the next review date based on Ebbinghaus forgetting curve
   */
  static calculateNextReview(word: Word, difficulty: string): Date {
    const now = new Date();
    let intervalDays = 1;
    const currentDifficulty = word.difficulty || 0;

    switch (difficulty) {
      case "again":
        // Review again in 1 minute (for demo purposes, set to 1 minute from now)
        return new Date(now.getTime() + 1 * 60 * 1000);
      
      case "hard":
        // Review in 6 minutes (for demo purposes)
        return new Date(now.getTime() + 6 * 60 * 1000);
      
      case "good":
        // Gradually increase interval based on current difficulty level
        intervalDays = Math.max(1, currentDifficulty * 2.5);
        if (currentDifficulty === 0) intervalDays = 1;
        else if (currentDifficulty === 1) intervalDays = 3;
        else if (currentDifficulty === 2) intervalDays = 7;
        else intervalDays = Math.min(30, currentDifficulty * 7);
        break;
      
      case "easy":
        // Much longer interval for easy words
        intervalDays = Math.max(4, currentDifficulty * 4);
        if (currentDifficulty === 0) intervalDays = 4;
        else if (currentDifficulty === 1) intervalDays = 7;
        else if (currentDifficulty === 2) intervalDays = 14;
        else intervalDays = Math.min(90, currentDifficulty * 14);
        break;
    }

    return new Date(now.getTime() + intervalDays * 24 * 60 * 60 * 1000);
  }

  /**
   * Update word difficulty based on performance
   */
  static updateDifficulty(word: Word, reviewResult: string): number {
    const currentDifficulty = word.difficulty || 0;
    
    switch (reviewResult) {
      case "again":
        return Math.max(0, currentDifficulty - 1);
      
      case "hard":
        return currentDifficulty; // Keep same difficulty
      
      case "good":
        return Math.min(4, currentDifficulty + 1);
      
      case "easy":
        return Math.min(4, currentDifficulty + 2);
      
      default:
        return currentDifficulty;
    }
  }

  /**
   * Get difficulty label for display
   */
  static getDifficultyLabel(difficulty: number): string {
    switch (difficulty) {
      case 0: return "新词汇";
      case 1: return "学习中";
      case 2: return "复习中";
      case 3: return "熟练";
      case 4: return "已掌握";
      default: return "未知";
    }
  }

  /**
   * Get difficulty color for UI
   */
  static getDifficultyColor(difficulty: number): string {
    switch (difficulty) {
      case 0: return "bg-purple-100 text-purple-800";
      case 1: return "bg-blue-100 text-blue-800";
      case 2: return "bg-yellow-100 text-yellow-800";
      case 3: return "bg-green-100 text-green-800";
      case 4: return "bg-emerald-100 text-emerald-800";
      default: return "bg-gray-100 text-gray-800";
    }
  }

  /**
   * Format next review time for display
   */
  static formatNextReview(nextReview: Date): string {
    const now = new Date();
    const diffMs = nextReview.getTime() - now.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMs <= 0) {
      return "现在";
    } else if (diffMinutes < 60) {
      return `${diffMinutes}分钟后`;
    } else if (diffHours < 24) {
      return `${diffHours}小时后`;
    } else if (diffDays === 1) {
      return "明天";
    } else if (diffDays < 7) {
      return `${diffDays}天后`;
    } else {
      return nextReview.toLocaleDateString("zh-CN");
    }
  }
}
