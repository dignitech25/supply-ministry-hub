import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QuoteProvider } from "@/contexts/QuoteContext";
import { QuoteDrawer } from "@/components/QuoteDrawer";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import TermsConditions from "./pages/TermsConditions";
import SleepChoice from "./pages/SleepChoice";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Shop from "./pages/Shop";
import ProductDetailNew from "./pages/ProductDetailNew";
import AdminCategoryQA from "./pages/AdminCategoryQA";
import { Navigate } from "react-router-dom";
// import Category from "./pages/Category";
// import Brand from "./pages/Brand";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <QuoteProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/terms" element={<TermsConditions />} />
            <Route path="/sleep-choice" element={<SleepChoice />} />
            
            {/* New shop routes using product_catagorized table */}
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:handle" element={<ProductDetailNew />} />
            <Route path="/admin/category-qa" element={<AdminCategoryQA />} />
            
            {/* Legacy routes - redirect to new structure */}
            <Route path="/products" element={<Products />} />
            <Route path="/products/:sku" element={<ProductDetail />} />
            
            {/* Category and Brand pages temporarily disabled - need updating to new schema */}
            {/* <Route path="/category/:slug" element={<Category />} /> */}
            {/* <Route path="/brand/:slug" element={<Brand />} /> */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <QuoteDrawer />
        </BrowserRouter>
      </TooltipProvider>
    </QuoteProvider>
  </QueryClientProvider>
);

export default App;
