import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Volume2, Trophy } from "lucide-react";
import { vocabularyStorage } from "@/lib/vocabulary-storage";
import { SpacedRepetitionAlgorithm } from "@/lib/spaced-repetition";
import { Word } from "@shared/schema";

export function ReviewSection() {
  const [reviewWords, setReviewWords] = useState<Word[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [todayStats, setTodayStats] = useState({ correct: 0, incorrect: 0 });
  const [sessionStats, setSessionStats] = useState({ reviewed: 0, correct: 0 });
  const { toast } = useToast();

  useEffect(() => {
    loadReviewWords();
  }, []);

  const loadReviewWords = () => {
    const words = vocabularyStorage.getWordsForReview();
    setReviewWords(words);
    setCurrentWordIndex(0);
    setShowAnswer(false);
  };

  const currentWord = reviewWords[currentWordIndex];
  const progress = reviewWords.length > 0 ? ((currentWordIndex + 1) / reviewWords.length) * 100 : 0;

  const handleShowAnswer = () => {
    setShowAnswer(true);
  };

  const handleDifficulty = (difficulty: "again" | "hard" | "good" | "easy") => {
    if (!currentWord) return;

    // Update word using spaced repetition algorithm
    const nextReview = SpacedRepetitionAlgorithm.calculateNextReview(currentWord, difficulty);
    const newDifficulty = SpacedRepetitionAlgorithm.updateDifficulty(currentWord, difficulty);

    const updatedWord = vocabularyStorage.updateWord(currentWord.id, {
      difficulty: newDifficulty,
      reviewCount: (currentWord.reviewCount || 0) + 1,
      correctCount: (currentWord.correctCount || 0) + (difficulty === "good" || difficulty === "easy" ? 1 : 0),
      lastReviewed: new Date(),
      nextReview: nextReview,
    });

    if (updatedWord) {
      // Update session stats
      setSessionStats(prev => ({
        reviewed: prev.reviewed + 1,
        correct: prev.correct + (difficulty === "good" || difficulty === "easy" ? 1 : 0),
      }));

      // Update today stats (simplified for demo)
      setTodayStats(prev => ({
        correct: prev.correct + (difficulty === "good" || difficulty === "easy" ? 1 : 0),
        incorrect: prev.incorrect + (difficulty === "again" || difficulty === "hard" ? 1 : 0),
      }));

      toast({
        title: "复习完成",
        description: `下次复习时间：${SpacedRepetitionAlgorithm.formatNextReview(nextReview)}`,
      });
    }

    // Move to next word
    if (currentWordIndex < reviewWords.length - 1) {
      setCurrentWordIndex(prev => prev + 1);
      setShowAnswer(false);
    } else {
      // Review session completed
      toast({
        title: "复习完成！",
        description: `本次复习了 ${sessionStats.reviewed + 1} 个单词`,
      });
      loadReviewWords(); // Reload to check for more words
    }
  };

  const playPronunciation = () => {
    // Mock pronunciation play
    toast({
      title: "发音播放",
      description: "正在播放单词发音...",
    });
  };

  if (reviewWords.length === 0) {
    return (
      <div className="space-y-6 lg:space-y-8">
        <div className="text-center lg:text-left">
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">复习记忆</h1>
          <p className="text-muted-foreground">基于艾宾浩斯遗忘曲线的智能复习系统</p>
        </div>

        <Card>
          <CardContent className="p-12 text-center">
            <div className="space-y-4">
              <div className="text-6xl">🎉</div>
              <h2 className="text-2xl font-bold text-foreground">太棒了！</h2>
              <p className="text-muted-foreground">当前没有需要复习的单词。</p>
              <p className="text-sm text-muted-foreground">
                继续添加新词汇或等待已学词汇的复习时间到来。
              </p>
              <Button onClick={loadReviewWords}>检查更新</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="text-center lg:text-left">
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">复习记忆</h1>
        <p className="text-muted-foreground">基于艾宾浩斯遗忘曲线的智能复习系统</p>
      </div>

      <div className="grid xl:grid-cols-3 gap-6 lg:gap-8">
        <div className="xl:col-span-2">
          <Card>
            <CardContent className="p-6 lg:p-8">
              <div className="text-center">
                <div className="mb-6">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 mb-4">
                    第 {currentWordIndex + 1} / {reviewWords.length} 词
                  </span>
                  <h2 className="text-4xl font-bold text-foreground mb-4">
                    {currentWord?.text}
                  </h2>
                  {currentWord?.pronunciation && (
                    <p className="text-lg text-muted-foreground mb-2">
                      {currentWord.pronunciation}
                    </p>
                  )}
                  <Button variant="ghost" onClick={playPronunciation}>
                    <Volume2 className="h-5 w-5" />
                  </Button>
                </div>

                {showAnswer && (
                  <div className="mb-8">
                    <div className="bg-muted rounded-lg p-6">
                      <p className="text-xl text-foreground mb-3">
                        {currentWord?.meaning}
                      </p>
                      {currentWord?.example && (
                        <>
                          <p className="text-muted-foreground italic mb-2">
                            "{currentWord.example}"
                          </p>
                          <p className="text-sm text-muted-foreground">
                            示例用法
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {!showAnswer ? (
                    <Button
                      onClick={handleShowAnswer}
                      className="w-full"
                      size="lg"
                    >
                      显示答案
                    </Button>
                  ) : (
                    <div className="grid grid-cols-4 gap-3">
                      <Button
                        onClick={() => handleDifficulty("again")}
                        variant="destructive"
                        size="sm"
                      >
                        <div className="text-center">
                          <div>再次</div>
                          <div className="text-xs opacity-80">&lt;1分钟</div>
                        </div>
                      </Button>
                      <Button
                        onClick={() => handleDifficulty("hard")}
                        className="bg-orange-500 hover:bg-orange-600 text-white"
                        size="sm"
                      >
                        <div className="text-center">
                          <div>困难</div>
                          <div className="text-xs opacity-80">&lt;6分钟</div>
                        </div>
                      </Button>
                      <Button
                        onClick={() => handleDifficulty("good")}
                        className="bg-green-500 hover:bg-green-600 text-white"
                        size="sm"
                      >
                        <div className="text-center">
                          <div>良好</div>
                          <div className="text-xs opacity-80">&lt;10分钟</div>
                        </div>
                      </Button>
                      <Button
                        onClick={() => handleDifficulty("easy")}
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                        size="sm"
                      >
                        <div className="text-center">
                          <div>容易</div>
                          <div className="text-xs opacity-80">4天</div>
                        </div>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">今日复习进度</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-muted-foreground mb-1">
                    <span>进度</span>
                    <span>{currentWordIndex + 1} / {reviewWords.length}</span>
                  </div>
                  <Progress value={progress} className="w-full" />
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <div className="text-2xl font-bold" style={{ color: 'hsl(var(--accent))' }}>
                      {todayStats.correct}
                    </div>
                    <div className="text-sm text-muted-foreground">正确</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-500">
                      {todayStats.incorrect}
                    </div>
                    <div className="text-sm text-muted-foreground">错误</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">学习统计</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">本次复习</span>
                  <span className="font-medium text-foreground">{sessionStats.reviewed} 词</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">正确率</span>
                  <span className="font-medium text-foreground">
                    {sessionStats.reviewed > 0 
                      ? Math.round((sessionStats.correct / sessionStats.reviewed) * 100)
                      : 0}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">总词汇量</span>
                  <span className="font-medium text-foreground">
                    {vocabularyStorage.getStats().totalWords} 词
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-primary to-secondary text-primary-foreground">
            <CardContent className="p-6">
              <div className="flex items-center mb-3">
                <Trophy className="text-yellow-300 w-5 h-5 mr-3" />
                <h3 className="text-lg font-semibold">每日目标</h3>
              </div>
              <p className="text-primary-foreground/80 mb-4">
                今天复习 {reviewWords.length} 个单词
              </p>
              <Progress 
                value={Math.min((sessionStats.reviewed / reviewWords.length) * 100, 100)} 
                className="w-full mb-2"
              />
              <p className="text-sm text-primary-foreground/60">
                还差 {Math.max(0, reviewWords.length - sessionStats.reviewed)} 个单词完成目标
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
