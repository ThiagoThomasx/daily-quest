import { Switch, Route, Link, useLocation } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Home, List, BarChart2, BookOpen, Settings } from "lucide-react";
import { useEffect } from "react";

import TodayPage from "./pages/TodayPage";
import HistoryPage from "./pages/HistoryPage";
import StatsPage from "./pages/StatsPage";
import LibraryPage from "./pages/LibraryPage";
import SettingsPage from "./pages/SettingsPage";

function Navigation() {
  const [location] = useLocation();
  
  const navItems = [
    { href: "/", icon: Home, label: "Today" },
    { href: "/history", icon: List, label: "History" },
    { href: "/stats", icon: BarChart2, label: "Stats" },
    { href: "/library", icon: BookOpen, label: "Library" },
    { href: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-t border-border"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="max-w-[428px] mx-auto flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = location === item.href;
          const Icon = item.icon;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex flex-col items-center justify-center w-16 h-full transition-colors relative ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
            >
              {isActive && (
                <div className="absolute top-0 w-8 h-1 bg-primary rounded-b-full shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
              )}
              <Icon className={`w-6 h-6 mb-1 ${isActive ? 'drop-shadow-[0_0_5px_rgba(var(--primary),0.5)]' : ''}`} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function App() {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <TooltipProvider>
      <div className="min-h-[100dvh] w-full bg-background text-foreground flex justify-center">
        <div className="w-full max-w-[428px] relative pb-20">
          <Switch>
            <Route path="/" component={TodayPage} />
            <Route path="/history" component={HistoryPage} />
            <Route path="/stats" component={StatsPage} />
            <Route path="/library" component={LibraryPage} />
            <Route path="/settings" component={SettingsPage} />
            <Route component={TodayPage} />
          </Switch>
          <Navigation />
        </div>
      </div>
      <Toaster />
    </TooltipProvider>
  );
}

export default App;
