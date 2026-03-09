import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, ArrowRight } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const FloatingSmartCTA = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isHomepage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      if (isHomepage) {
        setIsVisible(window.scrollY > 600);
      } else {
        setIsVisible(window.scrollY > 100);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomepage]);

  const label = isHomepage ? "Shop Now" : "Request Quote";
  const icon = isHomepage ? <ArrowRight className="mr-2 h-5 w-5" /> : <MessageSquare className="mr-2 h-5 w-5" />;
  const destination = isHomepage ? "/products" : "/quote";

  return (
    <Button
      onClick={() => navigate(destination)}
      size="lg"
      className={`fixed bottom-6 right-6 z-50 bg-orange-500 hover:bg-orange-600 text-white shadow-lg transition-all duration-300 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0 pointer-events-none"
      }`}
    >
      {icon}
      {label}
    </Button>
  );
};

export default FloatingSmartCTA;
