import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppNav from "@/components/AppNav";
import ProtectedRoute from "@/components/ProtectedRoute";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { HeroFloatingTarget } from "@/components/HeroFloatingTarget";
import Index from "./pages/Index";
import DiagnosticLab from "./pages/DiagnosticLab";
import BlindSpotReport from "./pages/BlindSpotReport";
import Pricing from "./pages/Pricing";
import Login from "./pages/Login";
import Welcome from "./pages/Welcome";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <HeroFloatingTarget />
        <AppNav />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route
            path="/lab"
            element={
              <ProtectedRoute>
                <ErrorBoundary>
                  <DiagnosticLab />
                </ErrorBoundary>
              </ProtectedRoute>
            }
          />
          <Route path="/report" element={<BlindSpotReport />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
