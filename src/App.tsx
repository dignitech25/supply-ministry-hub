import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { QuoteProvider } from "@/contexts/QuoteContext";
import { QuoteDrawer } from "@/components/QuoteDrawer";
import ErrorBoundary from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Lazy-loaded routes
const TermsConditions = lazy(() => import("./pages/TermsConditions"));
const SleepChoice = lazy(() => import("./pages/SleepChoice"));
const Products = lazy(() => import("./pages/Products"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const AdminCategoryQA = lazy(() => import("./pages/AdminCategoryQA"));
const QuoteConfirm = lazy(() => import("./pages/QuoteConfirm"));
const Resources = lazy(() => import("./pages/Resources"));
const Quote = lazy(() => import("./pages/Quote"));
const SupportAtHome = lazy(() => import("./pages/SupportAtHome"));
const RentToBuy = lazy(() => import("./pages/RentToBuy"));

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="animate-pulse text-muted-foreground">Loading...</div>
  </div>
);

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <QuoteProvider>
        <TooltipProvider>
          <ErrorBoundary>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/terms" element={<TermsConditions />} />
                  <Route path="/sleep-choice" element={<SleepChoice />} />
                  <Route path="/quote-confirm" element={<QuoteConfirm />} />
                  <Route path="/quote" element={<Quote />} />
                  <Route path="/resources" element={<Resources />} />
                  <Route path="/support-at-home" element={<SupportAtHome />} />
                  
                  <Route path="/products" element={<Products />} />
                  <Route path="/products/:sku" element={<ProductDetail />} />
                  <Route path="/product/:handle" element={<ProductDetail />} />
                  
                  <Route path="/admin/category-qa" element={<AdminCategoryQA />} />
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
              <QuoteDrawer />
            </BrowserRouter>
          </ErrorBoundary>
        </TooltipProvider>
      </QuoteProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
