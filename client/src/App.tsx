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

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/blog"} component={Blog} />
      <Route path={"/blog/edtech-2026-konchilos-detstvo"} component={ArticleEdtech2026} />
      <Route path={"/blog/iz-chego-sostoit-zapusk-vebinara"} component={ArticleWebinar} />
      <Route path={"/cases/:id"} component={CasePage} />
      <Route path={"/offer"} component={OfferPage} />
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
