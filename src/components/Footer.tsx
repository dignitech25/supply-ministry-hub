import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold mb-4">Supply Ministry</h3>
            <p className="text-sm opacity-80 mb-4">Connecting care with solutions across Australia</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li><Link to="/#about" className="hover:opacity-100">About Us</Link></li>
              <li><Link to="/products" className="hover:opacity-100">Products</Link></li>
              <li><Link to="/sleep-choice" className="hover:opacity-100">Sleep Choice</Link></li>
              <li><Link to="/support-at-home" className="hover:opacity-100">Support at Home</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li><Link to="/resources#resource-library" className="hover:opacity-100">Resource Library</Link></li>
              <li><Link to="/resources#blog" className="hover:opacity-100">Supply Line Blog</Link></li>
              <li><Link to="/resources#faq" className="hover:opacity-100">FAQ</Link></li>
              <li><Link to="/resources#ndis" className="hover:opacity-100">NDIS Information</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li><strong>Alex:</strong> alex@supplyministry.com.au</li>
              <li>Mobile: 0452 002 450</li>
              <li><strong>David:</strong> david@supplyministry.com.au</li>
              <li>Mobile: 0404 593 090</li>
              <li>Mon-Fri: 8:30 AM - 5:00 PM AEST</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm opacity-60">
          <p>&copy; {currentYear} Supply Ministry. All rights reserved. | <Link to="/terms" className="hover:opacity-100">Terms & Conditions</Link></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
