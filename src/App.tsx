import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppNav from "@/components/AppNav";
import Index from "./pages/Index";
import DiagnosticLab from "./pages/DiagnosticLab";
import BlindSpotReport from "./pages/BlindSpotReport";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <AppNav />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/lab" element={<DiagnosticLab />} />
          <Route path="/report" element={<BlindSpotReport />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
