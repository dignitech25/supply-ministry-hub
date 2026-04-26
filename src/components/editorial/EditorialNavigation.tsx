import { Link } from "react-router-dom";

const navLinks = [
  { label: "Products", href: "/products" },
  { label: "Suppliers", href: "/#suppliers" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

const EditorialNavigation = () => {
  return (
    <nav className="bg-cream border-b border-violet/10 h-16 md:h-20 sticky top-0 z-50">
      <div className="h-full px-4 md:px-12 flex items-center justify-between gap-3">
        <Link to="/" className="flex items-center shrink-0 min-w-0">
          <img
            src="/Supply_Ministry_logo_new_cropped.png"
            alt="Supply Ministry: Connects Care With Solutions"
            className="h-7 sm:h-9 md:h-12 w-auto"
          />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="font-geist text-base font-medium text-violet/70 hover:text-violet transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        <Link
          to="/quote"
          className="font-geist text-sm md:text-base font-semibold bg-violet text-cream px-4 py-2 md:px-7 md:py-3 rounded-full hover:opacity-90 transition-opacity whitespace-nowrap shrink-0"
        >
          <span className="md:hidden">Get quote</span>
          <span className="hidden md:inline">Start your quote</span>
        </Link>
      </div>
    </nav>
  );
};

export default EditorialNavigation;