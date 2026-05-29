import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Blog from "./pages/Blog";
import ArticleEdtech2026 from "./pages/ArticleEdtech2026";
import ArticleWebinar from "./pages/ArticleWebinar";
import CasePage from "./pages/CasePage";
import OfferPage from "./pages/OfferPage";
import MarketosPage from "./pages/MarketosPage";
import MarketosAdmin from "./pages/MarketosAdmin";
import GamePage from "@/pages/GamePage";
import CoursePage from "@/pages/CoursePage";
import LearnPage from "@/pages/LearnPage";
import LearnLessonPage from "@/pages/LearnLessonPage";
import LearnPayPage from "@/pages/LearnPayPage";
import MarketingPage from "@/pages/MarketingPage";
function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/blog"} component={Blog} />
      <Route path={"/blog/edtech-2026-konchilos-detstvo"} component={ArticleEdtech2026} />
      <Route path={"/blog/iz-chego-sostoit-zapusk-vebinara"} component={ArticleWebinar} />
      <Route path={"/cases/:id"} component={CasePage} />
      <Route path={"/offer"} component={OfferPage} />
      <Route path={"/marketos"} component={MarketosPage} />
      <Route path={"/marketos-admin"} component={MarketosAdmin} />
      <Route path={"/game"} component={GamePage} />
      <Route path={"/course"} component={CoursePage} />
      <Route path={"/learn"} component={LearnPage} />
      <Route path={"/learn/lesson/:id"} component={LearnLessonPage} />
      <Route path={"/learn/pay"} component={LearnPayPage} />
      <Route path={"/marketing"} component={MarketingPage} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
