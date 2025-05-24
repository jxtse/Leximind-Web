import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Wand2, Plus, Check, Lightbulb } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { ThemeWordsResponse } from "@shared/schema";
import { vocabularyStorage } from "@/lib/vocabulary-storage";

export function ThemeSection() {
  const [themeInput, setThemeInput] = useState("");
  const [level, setLevel] = useState("intermediate");
  const [count, setCount] = useState("20");
  const [result, setResult] = useState<ThemeWordsResponse | null>(null);
  const [addedWords, setAddedWords] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const generateMutation = useMutation({
    mutationFn: async (data: { theme: string; level: string; count: number }) => {
      const response = await apiRequest("POST", "/api/words/theme", data);
      return response.json() as Promise<ThemeWordsResponse>;
    },
    onSuccess: (data) => {
      setResult(data);
      toast({
        title: "生成成功",
        description: `为主题"${data.theme}"生成了 ${data.words.length} 个相关词汇`,
      });
    },
    onError: (error) => {
      toast({
        title: "生成失败",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleGenerate = () => {
    if (!themeInput.trim()) {
      toast({
        title: "请输入主题",
        description: "请描述您想要学习的场景或主题",
        variant: "destructive",
      });
      return;
    }

    generateMutation.mutate({
      theme: themeInput,
      level,
      count: parseInt(count),
    });
  };

  const handleAddWord = (word: any) => {
    try {
      vocabularyStorage.addWord({
        text: word.text,
        pronunciation: word.pronunciation,
        meaning: word.meaning,
        example: word.context,
        translation: word.meaning,
        difficulty: 0,
        reviewCount: 0,
        correctCount: 0,
        nextReview: new Date(),
      });

      setAddedWords(prev => new Set([...prev, word.text]));
      
      toast({
        title: "添加成功",
        description: `"${word.text}" 已添加到生词本`,
      });
    } catch (error) {
      toast({
        title: "添加失败",
        description: "无法添加到生词本，请重试",
        variant: "destructive",
      });
    }
  };

  const handleAddAllWords = () => {
    if (!result) return;
    
    let addedCount = 0;
    result.words.forEach(word => {
      if (!addedWords.has(word.text)) {
        handleAddWord(word);
        addedCount++;
      }
    });

    if (addedCount > 0) {
      toast({
        title: "批量添加成功",
        description: `已添加 ${addedCount} 个词汇到生词本`,
      });
    }
  };

  const commonThemes = [
    { title: "🍽️ 餐厅用餐", description: "点餐、服务、食物", theme: "在餐厅用餐，包括点餐、与服务员交流、支付账单等场景" },
    { title: "🏨 酒店住宿", description: "入住、设施、服务", theme: "在酒店办理入住、使用设施、与前台沟通等场景" },
    { title: "🛒 购物商场", description: "商品、价格、付款", theme: "在商场购物、询问价格、试穿衣服、结账付款等场景" },
    { title: "🚌 交通出行", description: "车票、路线、时间", theme: "使用公共交通工具、购买车票、询问路线和时间等场景" },
    { title: "🏥 医疗健康", description: "症状、药物、治疗", theme: "看医生、描述症状、购买药物、预约治疗等场景" },
    { title: "🎨 艺术文化", description: "博物馆、表演、展览", theme: "参观博物馆、观看艺术表演、了解文化展览等场景" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">主题词汇生成</h1>
        <p className="text-muted-foreground">根据特定主题或场景，智能生成相关词汇帮助您提前学习</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">主题输入</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    描述您的场景或主题
                  </label>
                  <Textarea
                    placeholder="例如：我将要去参观大都会博物馆，需要了解艺术相关的英语词汇"
                    value={themeInput}
                    onChange={(e) => setThemeInput(e.target.value)}
                    className="min-h-32 resize-none"
                    maxLength={500}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      词汇级别
                    </label>
                    <Select value={level} onValueChange={setLevel}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">初级 (A1-A2)</SelectItem>
                        <SelectItem value="intermediate">中级 (B1-B2)</SelectItem>
                        <SelectItem value="advanced">高级 (C1-C2)</SelectItem>
                        <SelectItem value="mixed">混合级别</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      生成数量
                    </label>
                    <Select value={count} onValueChange={setCount}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10 个词汇</SelectItem>
                        <SelectItem value="20">20 个词汇</SelectItem>
                        <SelectItem value="30">30 个词汇</SelectItem>
                        <SelectItem value="50">50 个词汇</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button 
                  onClick={handleGenerate}
                  disabled={generateMutation.isPending}
                  className="w-full"
                >
                  {generateMutation.isPending ? (
                    <>生成中...</>
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4 mr-2" />
                      生成主题词汇
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">常用主题</h2>
              <div className="grid grid-cols-1 gap-3">
                {commonThemes.map((theme, index) => (
                  <button
                    key={index}
                    onClick={() => setThemeInput(theme.theme)}
                    className="p-3 text-left border rounded-lg hover:border-primary hover:bg-muted/50 transition-colors"
                  >
                    <div className="font-medium text-foreground">{theme.title}</div>
                    <div className="text-sm text-muted-foreground">{theme.description}</div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">生成的词汇列表</h2>
              {result && (
                <Button variant="outline" size="sm" onClick={handleAddAllWords}>
                  <Plus className="h-3 w-3 mr-1" />
                  全部添加到生词本
                </Button>
              )}
            </div>

            {result ? (
              <>
                <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Lightbulb className="text-primary w-4 h-4 mr-2" />
                    <span className="font-medium text-foreground">主题：{result.theme}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    为您生成了 {result.words.length} 个相关的英语词汇
                  </p>
                </div>

                <div className="max-h-96 overflow-y-auto space-y-3">
                  {result.words.map((word, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-1">
                          <span className="font-medium text-foreground">{word.text}</span>
                          {word.pronunciation && (
                            <span className="text-sm text-muted-foreground">{word.pronunciation}</span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{word.meaning}</p>
                        {word.context && (
                          <p className="text-xs text-muted-foreground mt-1 italic">{word.context}</p>
                        )}
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleAddWord(word)}
                        disabled={addedWords.has(word.text)}
                        className={addedWords.has(word.text) ? "bg-muted text-muted-foreground" : ""}
                      >
                        {addedWords.has(word.text) ? (
                          <>
                            <Check className="h-3 w-3 mr-1" />
                            已添加
                          </>
                        ) : (
                          <>
                            <Plus className="h-3 w-3 mr-1" />
                            添加
                          </>
                        )}
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">显示 {result.words.length} / {result.words.length} 个词汇</span>
                    <span className="text-muted-foreground">级别: {level}</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <div className="text-4xl mb-4">💡</div>
                <p>输入主题并点击生成按钮开始创建词汇列表</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
