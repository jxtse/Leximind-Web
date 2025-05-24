import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Search, Filter, ArrowUpDown, Download, Play, Edit, Trash } from "lucide-react";
import { vocabularyStorage, VocabularyStats } from "@/lib/vocabulary-storage";
import { SpacedRepetitionAlgorithm } from "@/lib/spaced-repetition";
import { Word } from "@shared/schema";

export function VocabularySection() {
  const [words, setWords] = useState<Word[]>([]);
  const [stats, setStats] = useState<VocabularyStats>({
    totalWords: 0,
    masteredWords: 0,
    reviewingWords: 0,
    newWords: 0,
    wordsForReview: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredWords, setFilteredWords] = useState<Word[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = words.filter(word =>
        word.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        word.meaning.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredWords(filtered);
    } else {
      setFilteredWords(words);
    }
  }, [words, searchQuery]);

  const loadData = () => {
    const allWords = vocabularyStorage.getAllWords();
    const currentStats = vocabularyStorage.getStats();
    setWords(allWords);
    setStats(currentStats);
  };

  const handleDeleteWord = (id: number) => {
    if (window.confirm("确定要删除这个单词吗？")) {
      vocabularyStorage.deleteWord(id);
      loadData();
      toast({
        title: "删除成功",
        description: "单词已从生词本中删除",
      });
    }
  };

  const handleExport = () => {
    try {
      const csvData = vocabularyStorage.exportWords();
      const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `vocabulary_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "导出成功",
        description: "生词本已导出为CSV文件",
      });
    } catch (error) {
      toast({
        title: "导出失败",
        description: "无法导出生词本",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">我的生词本</h1>
          <p className="text-muted-foreground">管理您收集的词汇，跟踪学习进度</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon">
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </div>
          <Button onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            导出
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">总词汇量</p>
                <p className="text-2xl font-bold text-foreground">{stats.totalWords}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <div className="text-blue-600 dark:text-blue-400">📚</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">已掌握</p>
                <p className="text-2xl font-bold" style={{ color: 'hsl(var(--accent))' }}>{stats.masteredWords}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <div className="text-green-600 dark:text-green-400">✅</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">复习中</p>
                <p className="text-2xl font-bold" style={{ color: 'hsl(var(--warning))' }}>{stats.reviewingWords}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                <div className="text-yellow-600 dark:text-yellow-400">🕐</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">新词汇</p>
                <p className="text-2xl font-bold" style={{ color: 'hsl(var(--secondary))' }}>{stats.newWords}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                <div className="text-purple-600 dark:text-purple-400">➕</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Word List */}
      <Card>
        <CardContent className="p-0">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">词汇列表</h2>
              <div className="flex items-center space-x-2">
                <Input
                  type="text"
                  placeholder="搜索词汇..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64"
                />
              </div>
            </div>
          </div>

          {filteredWords.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {words.length === 0 ? "还没有添加任何词汇" : "没有找到匹配的词汇"}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      词汇
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      含义
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      状态
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      下次复习
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-card divide-y divide-border">
                  {filteredWords.map((word) => (
                    <tr key={word.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-foreground">{word.text}</div>
                          {word.pronunciation && (
                            <div className="text-sm text-muted-foreground">{word.pronunciation}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-foreground">{word.meaning}</div>
                        {word.example && (
                          <div className="text-sm text-muted-foreground italic">{word.example}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          SpacedRepetitionAlgorithm.getDifficultyColor(word.difficulty || 0)
                        }`}>
                          {SpacedRepetitionAlgorithm.getDifficultyLabel(word.difficulty || 0)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {SpacedRepetitionAlgorithm.formatNextReview(new Date(word.nextReview!))}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="icon">
                            <Play className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDeleteWord(word.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {filteredWords.length > 0 && (
            <div className="px-6 py-4 border-t">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  显示 <span className="font-medium">1</span> 到{" "}
                  <span className="font-medium">{Math.min(filteredWords.length, 50)}</span> 共{" "}
                  <span className="font-medium">{filteredWords.length}</span> 条结果
                </p>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">上一页</Button>
                  <Button size="sm">1</Button>
                  <Button variant="outline" size="sm">2</Button>
                  <Button variant="outline" size="sm">3</Button>
                  <Button variant="outline" size="sm">下一页</Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
