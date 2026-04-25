import { Link } from "react-router-dom";

const navLinks = [
  { label: "Products", href: "/products" },
  { label: "Suppliers", href: "/#suppliers" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

const EditorialNavigation = () => {
  return (
    <nav className="bg-cream border-b border-violet/10 h-20 sticky top-0 z-50">
      <div className="h-full px-6 md:px-12 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img
            src="/Supply_Ministry_logo_new.png"
            alt="Supply Ministry: Connects Care With Solutions"
            className="h-16 md:h-[72px] w-auto object-contain"
          />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="font-geist text-sm font-medium text-violet/70 hover:text-violet transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        <Link
          to="/quote"
          className="font-geist text-sm font-medium bg-violet text-cream px-6 py-2.5 rounded-full hover:opacity-90 transition-opacity"
        >
          Start your quote
        </Link>
      </div>
    </nav>
  );
};

export default EditorialNavigation;