import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Package, Truck, CreditCard, CheckCircle } from "lucide-react";
import EditorialNavigation from "@/components/editorial/EditorialNavigation";

const steps = [
  {
    icon: Package,
    title: "Rent with remaining HCP funds",
    description:
      "Your client uses whatever Home Care Package funding they have left to rent the equipment they need: mattress, pressure relief, mobility aids, whatever the clinical picture requires.",
  },
  {
    icon: Truck,
    title: "Equipment delivered immediately",
    description:
      "We deliver and set up the equipment in the client's home. No waiting for Support at Home approval. No delays.",
  },
  {
    icon: CreditCard,
    title: "Rental converts to purchase credit",
    description:
      "When Support at Home funding is approved, every dollar your client paid in rental is deducted from the purchase price. Nothing wasted.",
  },
  {
    icon: CheckCircle,
    title: "Client keeps the equipment",
    description:
      "No penalty. No double-handling. The equipment stays in the home, the funding catches up, and the case is closed cleanly.",
  },
];

const faqs = [
  {
    q: "What happens if Support at Home doesn't approve?",
    a: "You're only committed to the rental period. Return the equipment or continue renting month-to-month. No lock-in, no penalty.",
  },
  {
    q: "Can I use NDIS funding for rent-to-buy?",
    a: "Yes. The same structure applies. Rental payments convert to purchase credit when the plan is confirmed.",
  },
  {
    q: "Is there a minimum rental period?",
    a: "No. Month-to-month rental with no lock-in contract.",
  },
  {
    q: "Does this work for all equipment types?",
    a: "Most assistive technology we supply qualifies. Contact us to confirm for specific items.",
  },
];

const RentToBuy = () => {
  return (
    <div className="min-h-screen flex flex-col bg-violet text-cream">
      <SEO
        title="Rent-to-Buy Equipment | Supply Ministry"
        description="Get assistive technology to clients now using remaining HCP funds. Rental payments convert to purchase credit when Support at Home funding approves."
      />
      <EditorialNavigation />

      <main id="main-content" className="flex-1">
        {/* Hero */}
        <section className="bg-violet text-cream py-16 md:py-24">
          <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
            <p className="font-geist text-[11px] tracking-[0.18em] uppercase text-cream/60 mb-4">Rent to buy</p>
            <h1 className="text-3xl md:text-5xl font-geist font-light tracking-tight leading-[1.05] leading-[1.1] mb-5 text-cream">
              Try before you <span className="italic text-gold">commit</span>.
            </h1>
            <p className="text-lg md:text-xl text-cream/75 mb-8 max-w-2xl mx-auto leading-relaxed">
              Use remaining HCP funds to rent. Every dollar converts to purchase credit when funding comes through.
            </p>
            <Button
              size="lg"
              className="bg-cream text-violet hover:opacity-90 transition-opacity rounded-full text-base px-8 py-6"
              asChild
            >
              <a href="mailto:david@supplyministry.com.au?subject=Rent-to-buy enquiry">
                Ask about rent-to-buy
              </a>
            </Button>
          </div>
        </section>

        {/* The Problem */}
        <section className="py-14 md:py-20 bg-cream text-ink">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-geist font-light tracking-tight leading-[1.05] text-ink mb-6">
              The funding gap is real
            </h2>
            <div className="space-y-4">
              <p className="text-muted-body leading-relaxed">
                Support at Home applications are taking months. Clients need equipment now, not when the approval finally lands. Meanwhile, grandfathered Home Care Package funds are running out, with a hard cutoff on <strong className="text-ink">July&nbsp;1,&nbsp;2026</strong>.
              </p>
              <p className="text-muted-body leading-relaxed">
                There's often not enough funding left in a package to justify a full purchase before SaH approval comes through. But there is enough to start a rental, and that's where rent-to-buy closes the gap.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-14 md:py-20 bg-cream-alt">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-geist font-light tracking-tight leading-[1.05] text-ink mb-10 text-center">
              How it works
            </h2>
            <div className="space-y-8">
              {steps.map((step, i) => (
                <div key={i} className="flex gap-5 items-start">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-ink text-cream flex items-center justify-center font-medium text-lg">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-ink mb-1">{step.title}</h3>
                    <p className="text-muted-body leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What Qualifies */}
        <section className="py-14 md:py-20 bg-cream text-ink">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-geist font-light tracking-tight leading-[1.05] text-ink mb-6">
              What equipment qualifies
            </h2>
            <ul className="space-y-3 text-muted-body mb-6">
              {[
                "Pressure relief mattresses and overlays",
                "Adjustable beds",
                "Mobility equipment: walkers, wheelchairs, commodes",
                "Pressure relief cushions",
                "Daily living aids",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-gold mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-sm text-muted-body italic">
              Most assistive technology we supply qualifies. Ask if you're unsure.
            </p>
          </div>
        </section>

        {/* Example Scenario */}
        <section className="py-14 md:py-20 bg-cream-alt">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-geist font-light tracking-tight leading-[1.05] text-ink mb-6">
              Real-world example
            </h2>
            <div className="bg-cream rounded-xl border border-cream-border p-6 md:p-8 space-y-4">
              <p className="text-muted-body leading-relaxed">
                A client needs a pressure relief mattress. Purchase price: <strong className="text-ink">$4,190</strong>.
              </p>
              <p className="text-muted-body leading-relaxed">
                They have <strong className="text-ink">$800</strong> remaining in HCP funds before the July&nbsp;1 cutoff. Not enough to buy outright, but enough to start a rental at $200/month, four months of use, fully funded.
              </p>
              <p className="text-muted-body leading-relaxed">
                Support at Home is approved in October. Final purchase price: <strong className="text-ink">$4,190 − $800 rental = $3,390</strong>, paid via SaH funding. The client had the mattress in their home for four months while waiting. No gap in care.
              </p>
              <p className="text-ink font-medium">
                Equipment in the home now. Payment when funding approves. Simple.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-14 md:py-20 bg-cream text-ink">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-geist font-light tracking-tight leading-[1.05] text-ink mb-8">
              Common questions
            </h2>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`}>
                  <AccordionTrigger className="text-left text-ink">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-body">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-16 md:py-24 bg-violet text-cream border-t border-white/10">
          <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-geist font-light tracking-tight leading-[1.05] mb-4">
              Got a client who needs equipment now?
            </h2>
            <p className="text-lg text-cream/80 mb-8 max-w-xl mx-auto">
              Don't let broken timelines leave people waiting. Reach out and we'll walk you through the options.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
              <Button
                size="lg"
                className="bg-cream text-violet hover:opacity-90 transition-opacity rounded-full text-base px-8 py-6"
                asChild
              >
                <a href="mailto:david@supplyministry.com.au?subject=Rent-to-buy enquiry">
                  Ask about rent-to-buy
                </a>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-cream/30 text-cream hover:bg-cream/10 rounded-full text-base px-8 py-6"
                asChild
              >
                <a href="tel:+61422461062">
                  Call 0422 461 062
                </a>
              </Button>
            </div>
            <div className="text-center">
              <p className="font-medium text-xl mb-1">David</p>
              <a
                href="mailto:david@supplyministry.com.au"
                className="text-sm text-cream/80 hover:text-cream transition-opacity"
              >
                david@supplyministry.com.au
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default RentToBuy;
