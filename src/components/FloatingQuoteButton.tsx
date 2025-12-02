import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

const FloatingQuoteButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling past hero (approximately 600px)
      const heroHeight = 600;
      const scrolled = window.scrollY > heroHeight;
      
      // Hide button when near the quote form section
      const quoteForm = document.getElementById('quote-form');
      if (quoteForm) {
        const quoteRect = quoteForm.getBoundingClientRect();
        const nearQuoteForm = quoteRect.top < window.innerHeight && quoteRect.bottom > 0;
        setIsVisible(scrolled && !nearQuoteForm);
      } else {
        setIsVisible(scrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = () => {
    document.getElementById('quote-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Button
      onClick={handleClick}
      size="lg"
      className={`fixed bottom-6 right-6 z-50 bg-orange-500 hover:bg-orange-600 text-white shadow-lg transition-all duration-300 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'
      }`}
    >
      <MessageSquare className="mr-2 h-5 w-5" />
      Request Quote
    </Button>
  );
};

export default FloatingQuoteButton;
