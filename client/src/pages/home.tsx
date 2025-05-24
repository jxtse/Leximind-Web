import { useState, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { TranslateSection } from "@/components/translate-section";
import { VocabularySection } from "@/components/vocabulary-section";
import { ReviewSection } from "@/components/review-section";
import { ThemeSection } from "@/components/theme-section";
import { vocabularyStorage } from "@/lib/vocabulary-storage";

export default function Home() {
  const [activeTab, setActiveTab] = useState("translate");
  const [totalWords, setTotalWords] = useState(0);

  useEffect(() => {
    const updateWordCount = () => {
      const stats = vocabularyStorage.getStats();
      setTotalWords(stats.totalWords);
    };

    updateWordCount();
    
    // Update word count when storage changes (simplified approach)
    const interval = setInterval(updateWordCount, 1000);
    return () => clearInterval(interval);
  }, [activeTab]);

  const renderSection = () => {
    switch (activeTab) {
      case "translate":
        return <TranslateSection />;
      case "vocabulary":
        return <VocabularySection />;
      case "review":
        return <ReviewSection />;
      case "theme":
        return <ThemeSection />;
      default:
        return <TranslateSection />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        totalWords={totalWords}
      />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderSection()}
      </main>
      <footer className="bg-muted/30 border-t py-6 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center space-y-2">
            <p className="text-sm text-muted-foreground">
              LexiMind - 开源智能单词学习网站
            </p>
            <div className="flex items-center space-x-4 text-sm">
              <a
                href="https://github.com/jxtse/Leximind-Web"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 transition-colors flex items-center space-x-1"
              >
                <span>🌟 在GitHub上给我们点赞</span>
              </a>
              <span className="text-muted-foreground">|</span>
              <a
                href="https://github.com/jxtse/Leximind-Web/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                反馈建议
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
