import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Link } from "react-router-dom";
import EditorialNavigation from "@/components/editorial/EditorialNavigation";

const modifications = [
  {
    title: "Grab rails",
    description: "Bathroom, hallway, and entry point installations.",
  },
  {
    title: "Access ramps",
    description: "Entry and threshold ramps for step-free access.",
  },
  {
    title: "Bathroom modifications",
    description: "Hobless showers, raised toilet seats, non-slip flooring.",
  },
  {
    title: "Kitchen modifications",
    description: "Adjustable benchtops and accessible storage.",
  },
];

const HomeModifications = () => {
  return (
    <div className="min-h-screen flex flex-col bg-cream text-ink">
      <SEO
        title="Home Modifications | Supply Ministry"
        description="Grab rails, access ramps, and bathroom and kitchen modifications delivered through certified, NDIS-registered trades. One relationship, coordinated by Supply Ministry."
      />
      <EditorialNavigation />

      <main id="main-content" className="flex-1">
        {/* Hero */}
        <section className="bg-violet text-cream py-20 md:py-28">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <p className="font-geist text-[11px] tracking-[0.18em] uppercase text-cream/60 mb-5">
              Home modifications
            </p>
            <h1 className="font-geist font-light tracking-tight leading-[1.05] text-3xl md:text-5xl text-cream">
              Home modifications, coordinated through one partner.
            </h1>
            <p className="mt-6 md:mt-8 max-w-2xl text-cream/80 text-lg leading-relaxed">
              Supply Ministry delivers grab rails, access ramps, and bathroom and kitchen modifications through certified, NDIS-registered trades, all under one relationship.
            </p>
            <div className="mt-8 md:mt-10">
              <Link
                to="/quote"
                className="inline-block font-geist text-sm md:text-base font-semibold bg-cream text-violet px-7 py-3 rounded-full hover:opacity-90 transition-opacity"
              >
                Get in touch
              </Link>
            </div>
          </div>
        </section>

        {/* Modifications we deliver */}
        <section className="py-16 md:py-20 bg-cream">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <h2 className="font-geist font-light tracking-tight text-2xl md:text-3xl text-ink mb-8 md:mb-10">
              The modifications we deliver.
            </h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {modifications.map((item) => (
                <li
                  key={item.title}
                  className="border-t border-violet/15 pt-5"
                >
                  <h3 className="font-geist text-lg font-medium text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-muted-body leading-relaxed">
                    {item.description}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Certified trades */}
        <section className="py-14 md:py-16 bg-cream-alt">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <h2 className="font-geist font-light tracking-tight text-2xl md:text-3xl text-ink mb-5">
              Certified trades, NDIS registered.
            </h2>
            <p className="text-muted-body leading-relaxed">
              Every job is completed by certified, NDIS-registered trade partners, so the work meets funding standards without the provider chasing paperwork afterward.
            </p>
          </div>
        </section>

        {/* One relationship */}
        <section className="py-14 md:py-16 bg-cream">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <h2 className="font-geist font-light tracking-tight text-2xl md:text-3xl text-ink mb-5">
              One relationship, consistent supply.
            </h2>
            <p className="text-muted-body leading-relaxed">
              Instead of managing separate trades and suppliers for each modification, providers coordinate everything through Supply Ministry. One point of contact, consistent supply across products and services.
            </p>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="bg-violet text-cream py-16 md:py-20">
          <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="font-geist font-light tracking-tight text-2xl md:text-4xl text-cream mb-8">
              Talk to us about a modification.
            </h2>
            <Link
              to="/quote"
              className="inline-block font-geist text-sm md:text-base font-semibold bg-cream text-violet px-7 py-3 rounded-full hover:opacity-90 transition-opacity"
            >
              Talk to us about a modification
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomeModifications;