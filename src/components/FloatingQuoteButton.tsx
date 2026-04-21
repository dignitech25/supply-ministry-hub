import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FloatingQuoteButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling past hero (approximately 600px)
      const heroHeight = 600;
      setIsVisible(window.scrollY > heroHeight);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = () => {
    navigate('/quote');
  };

  return (
    <Button
      onClick={handleClick}
      size="lg"
      className={`fixed bottom-6 right-6 z-50 bg-ink text-cream hover:opacity-90 shadow-lg transition-all duration-300 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'
      }`}
    >
      <MessageSquare className="mr-2 h-5 w-5" />
      Request Quote
    </Button>
  );
};

export default FloatingQuoteButton;
