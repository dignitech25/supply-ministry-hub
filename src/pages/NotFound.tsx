import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import SEO from "@/components/SEO";
import EditorialNavigation from "@/components/editorial/EditorialNavigation";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-cream text-ink flex flex-col">
      <SEO 
        title="Page Not Found"
        description="The page you're looking for doesn't exist. Return to Supply Ministry's homepage to browse our assistive technology and mobility solutions."
      />
      <EditorialNavigation />
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="text-center max-w-lg">
          <p className="font-geist text-[11px] tracking-[0.18em] uppercase text-muted-body mb-4">404</p>
          <h1 className="text-4xl md:text-5xl font-instrument font-normal text-ink mb-4">
            Page not <span className="italic text-gold">found</span>
          </h1>
          <p className="text-lg text-muted-body mb-8">
            The page you're looking for has moved, been renamed, or never existed.
          </p>
          <Link
            to="/"
            className="inline-block bg-ink text-cream hover:opacity-90 transition-opacity rounded-full px-8 py-3 font-geist text-sm"
          >
            Return home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
