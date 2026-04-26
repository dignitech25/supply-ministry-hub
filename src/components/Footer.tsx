import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-violet text-cream/80 pt-7 pb-5">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-7 sm:gap-14 max-w-4xl mx-auto">
          <Link to="/" aria-label="Supply Ministry home" className="shrink-0">
            <img
              src="/Supply_Ministry_inverted.svg"
              alt="Supply Ministry"
              className="h-28 md:h-32 w-auto"
            />
          </Link>
          <div className="text-center">
            <h4 className="font-semibold mb-4 text-base text-cream">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/#about" className="hover:opacity-100 transition-opacity">About Us</Link></li>
              <li><Link to="/products" className="hover:opacity-100 transition-opacity">Products</Link></li>
              <li><Link to="/sleep-choice" className="hover:opacity-100 transition-opacity">Sleep Choice</Link></li>
              <li><Link to="/support-at-home" className="hover:opacity-100 transition-opacity">Support at Home</Link></li>
            </ul>
          </div>
          <div className="text-center">
            <h4 className="font-semibold mb-4 text-base text-cream">Resources</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/resources#resource-library" className="hover:opacity-100 transition-opacity">Resource Library</Link></li>
              <li><Link to="/resources#blog" className="hover:opacity-100 transition-opacity">Supply Line Blog</Link></li>
              <li><Link to="/resources#faq" className="hover:opacity-100 transition-opacity">FAQ</Link></li>
              <li><Link to="/resources#ndis" className="hover:opacity-100 transition-opacity">NDIS Information</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-cream/15 mt-7 pt-4 text-center text-xs text-cream/60">
          <p>&copy; {currentYear} Supply Ministry. All rights reserved. | <Link to="/terms" className="hover:opacity-100 transition-opacity">Terms &amp; Conditions</Link></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
