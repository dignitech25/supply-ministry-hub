import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink } from "lucide-react";

interface QAProduct {
  sku: string;
  handle: string;
  title: string;
  brand: string;
  category_path: string | null;
  category_rule: string | null;
  category_alternatives: string | null;
  category_confidence: string | null;
}

const AdminCategoryQA = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<QAProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if user is authenticated
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
          setAuthError("You must be logged in to access this page");
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        // Check if user has admin role
        const { data: hasAdminRole, error: roleError } = await supabase
          .rpc('has_role', {
            _user_id: user.id,
            _role: 'admin'
          });

        if (roleError) {
          console.error("Error checking admin role:", roleError);
          setAuthError("Error verifying permissions");
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        if (!hasAdminRole) {
          setAuthError("You do not have permission to access this page");
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        setIsAdmin(true);

        // User is authenticated and has admin role, fetch QA products
        const { data, error } = await supabase
          .from("products_categorized" as any)
          .select("sku, handle, title, brand, category_path, category_rule, category_alternatives, category_confidence")
          .in("category_confidence", ["low", "none"])
          .order("brand")
          .order("title") as { data: any[] | null; error: any };

        if (error) {
          console.error("Error fetching QA products:", error);
          setAuthError("Error loading products");
        } else {
          setProducts((data || []) as QAProduct[]);
        }
      } catch (error) {
        console.error("Unexpected error:", error);
        setAuthError("An unexpected error occurred");
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const openProduct = (handle: string) => {
    window.open(`/product/${handle}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Category QA Review</h1>
        <p className="text-muted-foreground mb-8">
          Products with low or no category confidence that need review.
        </p>

        {authError && (
          <Alert variant="destructive" className="mb-8">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {authError}
              {isAdmin === false && (
                <span className="block mt-2">
                  Please contact an administrator for access.
                </span>
              )}
            </AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : !isAdmin ? (
          <Alert className="mb-8">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Access denied. This page is restricted to administrators only.
            </AlertDescription>
          </Alert>
        ) : products.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">
            No products need review. All categories have medium or high confidence!
          </p>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SKU</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Category Path</TableHead>
                  <TableHead>Rule</TableHead>
                  <TableHead>Alternatives</TableHead>
                  <TableHead>Confidence</TableHead>
                  <TableHead className="w-20"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow
                    key={product.sku}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => openProduct(product.handle)}
                  >
                    <TableCell className="font-mono text-xs">{product.sku}</TableCell>
                    <TableCell>{product.brand}</TableCell>
                    <TableCell className="max-w-xs truncate">{product.title}</TableCell>
                    <TableCell className="text-sm">{product.category_path || "—"}</TableCell>
                    <TableCell className="text-sm">{product.category_rule || "—"}</TableCell>
                    <TableCell className="text-sm">{product.category_alternatives || "—"}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          product.category_confidence === "none"
                            ? "bg-destructive/10 text-destructive"
                            : "bg-yellow-500/10 text-yellow-700"
                        }`}
                      >
                        {product.category_confidence}
                      </span>
                    </TableCell>
                    <TableCell>
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCategoryQA;
