import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Mic, Camera, Play, Copy, Plus, Check, ArrowLeftRight } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { apiRequest } from "@/lib/queryClient";
import { TranslationResponse } from "@shared/schema";
import { vocabularyStorage } from "@/lib/vocabulary-storage";

export function TranslateSection() {
  const [inputText, setInputText] = useState("");
  const [sourceLang, setSourceLang] = useState("auto");
  const [targetLang, setTargetLang] = useState("zh");
  const [extractWords, setExtractWords] = useState(true);
  const [result, setResult] = useState<TranslationResponse | null>(null);
  const [addedWords, setAddedWords] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const translateMutation = useMutation({
    mutationFn: async (data: { text: string; sourceLanguage?: string; targetLanguage: string; extractWords: boolean }) => {
      const response = await apiRequest("POST", "/api/translate", data);
      return response.json() as Promise<TranslationResponse>;
    },
    onSuccess: (data) => {
      setResult(data);
      toast({
        title: "翻译成功",
        description: extractWords ? `提取了 ${data.extractedWords.length} 个重要词汇` : "翻译完成",
      });
    },
    onError: (error) => {
      toast({
        title: "翻译失败",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleTranslate = () => {
    if (!inputText.trim()) {
      toast({
        title: "请输入文本",
        description: "请输入要翻译的单词、词组或句子",
        variant: "destructive",
      });
      return;
    }

    translateMutation.mutate({
      text: inputText,
      sourceLanguage: sourceLang === "auto" ? undefined : sourceLang,
      targetLanguage: targetLang,
      extractWords: extractWords,
    });
  };

  const handleAddWord = (word: any) => {
    try {
      vocabularyStorage.addWord({
        text: word.text,
        pronunciation: word.pronunciation,
        meaning: word.meaning,
        example: word.example,
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

  const copyToClipboard = async () => {
    if (result?.translatedText) {
      try {
        await navigator.clipboard.writeText(result.translatedText);
        toast({
          title: "复制成功",
          description: "翻译结果已复制到剪贴板",
        });
      } catch (error) {
        toast({
          title: "复制失败",
          description: "无法复制到剪贴板",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">智能翻译与词汇提取</h1>
        <p className="text-muted-foreground">输入单词、词组或短句，获得智能翻译并提取重要词汇到生词本</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Translation Input */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">输入文本</h2>
              <div className="flex space-x-2">
                <Button variant="ghost" size="icon">
                  <Mic className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="relative mb-4">
              <Textarea
                placeholder="输入您想要翻译的单词、词组或句子..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="min-h-32 resize-none"
                maxLength={500}
              />
              <div className="absolute bottom-3 right-3 text-xs text-muted-foreground">
                {inputText.length}/500
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Select value={sourceLang} onValueChange={setSourceLang}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">自动检测</SelectItem>
                      <SelectItem value="en">英语</SelectItem>
                      <SelectItem value="zh">中文</SelectItem>
                      <SelectItem value="ja">日语</SelectItem>
                      <SelectItem value="ko">韩语</SelectItem>
                    </SelectContent>
                  </Select>
                  <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
                  <Select value={targetLang} onValueChange={setTargetLang}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="zh">中文</SelectItem>
                      <SelectItem value="en">英语</SelectItem>
                      <SelectItem value="ja">日语</SelectItem>
                      <SelectItem value="ko">韩语</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Switch 
                  id="extract-words" 
                  checked={extractWords} 
                  onCheckedChange={setExtractWords}
                />
                <Label htmlFor="extract-words" className="text-sm font-medium text-foreground">
                  提取重要词汇到生词本
                </Label>
              </div>

              <Button 
                onClick={handleTranslate}
                disabled={translateMutation.isPending}
                className="w-full"
              >
                {translateMutation.isPending ? (
                  <>正在翻译...</>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    {extractWords ? "翻译并提取词汇" : "仅翻译"}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Translation Result */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">翻译结果</h2>
              <Button variant="ghost" size="icon" onClick={copyToClipboard}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            
            {result ? (
              <>
                <div className="bg-muted rounded-lg p-4 mb-4">
                  <p className="text-foreground leading-relaxed">
                    {result.translatedText}
                  </p>
                </div>

                {result.extractedWords && result.extractedWords.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-foreground flex items-center">
                      <span className="text-warning mr-2">⭐</span>
                      重要词汇提取
                    </h3>
                    
                    <div className="space-y-2">
                      {result.extractedWords.map((word, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <span className="font-medium text-foreground">{word.text}</span>
                              {word.pronunciation && (
                                <span className="text-sm text-muted-foreground">{word.pronunciation}</span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{word.meaning}</p>
                            {word.example && (
                              <p className="text-xs text-muted-foreground mt-1 italic">{word.example}</p>
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
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                输入文本并点击翻译以查看结果
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
