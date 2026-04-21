import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What types of assistive technology do you supply?",
    answer:
      "We supply a comprehensive range of assistive technology including mobility aids (wheelchairs, walkers, rollators), therapeutic beds and mattresses, bathroom and toileting equipment, seating and positioning solutions, home modifications, and daily living aids. Our catalogue features over 2,000 products from trusted Australian and international brands.",
  },
  {
    question: "Do you support NDIS-funded purchases?",
    answer:
      "Yes, we work extensively with NDIS participants and their support coordinators. We can provide formal quotes aligned with NDIS pricing guidelines, assist with equipment justification documentation, and coordinate directly with plan managers and support coordinators to streamline the procurement process.",
  },
  {
    question: "How quickly can you dispatch equipment?",
    answer:
      "Most in-stock items are dispatched within 48 hours of order confirmation. For urgent clinical needs, we offer priority dispatch options. Custom or made-to-order items may have longer lead times, which we communicate clearly at the quoting stage.",
  },
  {
    question: "Do you offer equipment trials before purchase?",
    answer:
      "Yes, through our Sleep Choice program we offer a risk-free 7-day trial on therapeutic beds and pressure-relieving mattresses. If the equipment isn't the right fit, we arrange free collection and help you find an alternative solution.",
  },
  {
    question: "What areas do you deliver to?",
    answer:
      "We deliver across Greater Metropolitan Melbourne and regional Victoria. For interstate orders, we can arrange shipping Australia-wide. Delivery fees vary by location and product size — contact our team for a specific quote.",
  },
  {
    question: "Can occupational therapists request quotes on behalf of clients?",
    answer:
      "Absolutely. The majority of our quotes are initiated by occupational therapists, physiotherapists, and support coordinators. Our quote request form is designed for healthcare professionals, and we provide detailed product specifications and clinical justification support to assist with funding applications.",
  },
];

// FAQ JSON-LD schema for homepage rich results
export const faqPageSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
};

const FAQSection = () => {
  return (
    <section id="faq" className="py-20 bg-cream">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="font-geist text-[11px] tracking-[0.18em] uppercase text-muted-body mb-4">FAQ</p>
            <h2 className="font-geist font-light tracking-tight leading-[1.05] text-4xl md:text-5xl text-ink mb-4">Frequently asked <span className="italic text-gold">questions</span></h2>
            <p className="text-lg text-muted-body">
              Common questions about our assistive technology products and services
            </p>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-cream-border">
                <AccordionTrigger className="text-left text-base font-geist text-ink hover:text-ink">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-body leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
