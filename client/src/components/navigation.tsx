import { Brain, Book, Clock, Lightbulb, Trophy, Menu, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  totalWords: number;
}

export function Navigation({ activeTab, onTabChange, totalWords }: NavigationProps) {
  const tabs = [
    { id: "translate", label: "智能翻译", icon: Brain },
    { id: "vocabulary", label: "生词本", icon: Book },
    { id: "review", label: "复习记忆", icon: Clock },
    { id: "theme", label: "主题词汇", icon: Lightbulb },
  ];

  const NavItems = () => (
    <>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center px-3 py-2 text-sm font-medium transition-colors border-b-2 ${
              activeTab === tab.id
                ? "text-primary border-primary"
                : "text-muted-foreground hover:text-foreground border-transparent"
            }`}
          >
            <Icon className="w-4 h-4 mr-2" />
            {tab.label}
          </button>
        );
      })}
    </>
  );

  return (
    <nav className="bg-card shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <Brain className="text-primary-foreground w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-foreground">LexiMind</span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <NavItems />
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center bg-muted rounded-full px-3 py-1">
              <Trophy className="text-warning w-4 h-4 mr-2" />
              <span className="text-sm text-muted-foreground">{totalWords} 词汇</span>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => window.open('https://github.com/jxtse/Leximind-Web', '_blank')}
              title="查看GitHub项目"
            >
              <Github className="h-5 w-5" />
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-4 mt-8">
                  <div className="flex items-center bg-muted rounded-full px-3 py-2 mb-4">
                    <Trophy className="text-warning w-4 h-4 mr-2" />
                    <span className="text-sm text-muted-foreground">{totalWords} 词汇</span>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <NavItems />
                  </div>
                  <div className="pt-4 border-t">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start"
                      onClick={() => window.open('https://github.com/jxtse/Leximind-Web', '_blank')}
                    >
                      <Github className="h-4 w-4 mr-2" />
                      GitHub项目
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
