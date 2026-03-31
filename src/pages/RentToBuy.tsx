import Navigation from "@/components/Navigation";
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

const steps = [
  {
    icon: Package,
    title: "Rent with remaining HCP funds",
    description:
      "Your client uses whatever Home Care Package funding they have left to rent the equipment they need — mattress, pressure relief, mobility aids, whatever the clinical picture requires.",
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
    a: "Yes. The same structure applies — rental payments convert to purchase credit when the plan is confirmed.",
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
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Rent-to-Buy Equipment | Supply Ministry"
        description="Get assistive technology to clients now using remaining HCP funds. Rental payments convert to purchase credit when Support at Home funding approves."
      />
      <Navigation />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary to-primary/85 text-primary-foreground py-16 md:py-24">
          <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
            <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-5">
              Get equipment to clients now. Pay&nbsp;for&nbsp;it when Support&nbsp;at&nbsp;Home approves.
            </h1>
            <p className="text-lg md:text-xl opacity-90 mb-8 max-w-2xl mx-auto leading-relaxed">
              Use remaining HCP funds to rent. Every dollar converts to purchase credit when funding comes through.
            </p>
            <Button
              size="lg"
              className="bg-orange-500 text-white hover:bg-orange-600 shadow-lg shadow-orange-500/25 text-base px-8 py-6"
              asChild
            >
              <a href="mailto:david@supplyministry.com.au?subject=Rent-to-buy enquiry">
                Ask about rent-to-buy
              </a>
            </Button>
          </div>
        </section>

        {/* The Problem */}
        <section className="py-14 md:py-20">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
              The funding gap is real
            </h2>
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                Support at Home applications are taking months. Clients need equipment now — not when the approval finally lands. Meanwhile, grandfathered Home Care Package funds are running out, with a hard cutoff on <strong className="text-foreground">July&nbsp;1,&nbsp;2026</strong>.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                There's often not enough funding left in a package to justify a full purchase before SaH approval comes through. But there is enough to start a rental — and that's where rent-to-buy closes the gap.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-14 md:py-20 bg-secondary/50">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-10 text-center">
              How it works
            </h2>
            <div className="space-y-8">
              {steps.map((step, i) => (
                <div key={i} className="flex gap-5 items-start">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What Qualifies */}
        <section className="py-14 md:py-20">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
              What equipment qualifies
            </h2>
            <ul className="space-y-3 text-muted-foreground mb-6">
              {[
                "Pressure relief mattresses and overlays",
                "Adjustable beds",
                "Mobility equipment — walkers, wheelchairs, commodes",
                "Pressure relief cushions",
                "Daily living aids",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-sm text-muted-foreground italic">
              Most assistive technology we supply qualifies. Ask if you're unsure.
            </p>
          </div>
        </section>

        {/* Example Scenario */}
        <section className="py-14 md:py-20 bg-secondary/50">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
              Real-world example
            </h2>
            <div className="bg-card rounded-xl border border-border p-6 md:p-8 space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                A client needs a pressure relief mattress. Purchase price: <strong className="text-foreground">$4,190</strong>.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                They have <strong className="text-foreground">$800</strong> remaining in HCP funds before the July&nbsp;1 cutoff. Not enough to buy outright, but enough to start a rental at $200/month — four months of use, fully funded.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Support at Home is approved in October. Final purchase price: <strong className="text-foreground">$4,190 − $800 rental = $3,390</strong>, paid via SaH funding. The client had the mattress in their home for four months while waiting. No gap in care.
              </p>
              <p className="text-foreground font-medium">
                Equipment in the home now. Payment when funding approves. Simple.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-14 md:py-20">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
              Common questions
            </h2>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`}>
                  <AccordionTrigger className="text-left text-foreground">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-primary to-primary/85 text-primary-foreground">
          <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Got a client who needs equipment now?
            </h2>
            <p className="text-lg opacity-80 mb-8 max-w-xl mx-auto">
              Don't let broken timelines leave people waiting. Reach out and we'll walk you through the options.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
              <Button
                size="lg"
                className="bg-orange-500 text-white hover:bg-orange-600 shadow-lg shadow-orange-500/25 text-base px-8 py-6"
                asChild
              >
                <a href="mailto:david@supplyministry.com.au?subject=Rent-to-buy enquiry">
                  Ask about rent-to-buy
                </a>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 text-base px-8 py-6"
                asChild
              >
                <a href="tel:+61422461062">
                  Call 0422 461 062
                </a>
              </Button>
            </div>
            <div className="text-center">
              <p className="font-bold text-xl mb-1">David</p>
              <a
                href="mailto:david@supplyministry.com.au"
                className="text-sm opacity-80 hover:opacity-100 transition-opacity"
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
