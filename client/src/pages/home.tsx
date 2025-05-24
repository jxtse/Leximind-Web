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
    <div className="min-h-screen bg-background">
      <Navigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        totalWords={totalWords}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderSection()}
      </main>
    </div>
  );
}
