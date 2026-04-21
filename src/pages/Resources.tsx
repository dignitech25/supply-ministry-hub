import { Link } from "react-router-dom";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BookOpen, FileText, HelpCircle, Info, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import EditorialNavigation from "@/components/editorial/EditorialNavigation";

const Resources = () => {
  const resourceLibrary = [
    {
      title: "Product Catalogs",
      description: "Browse our comprehensive product catalogs by category",
      icon: BookOpen,
      items: [
        { name: "Mobility Equipment Catalog", type: "PDF", size: "2.4 MB" },
        { name: "Bedroom & Comfort Solutions", type: "PDF", size: "1.8 MB" },
        { name: "Bathroom Safety Guide", type: "PDF", size: "1.2 MB" },
      ]
    },
    {
      title: "Clinical Resources",
      description: "Evidence-based guides for healthcare professionals",
      icon: FileText,
      items: [
        { name: "Pressure Care Management Guide", type: "PDF", size: "3.1 MB" },
        { name: "Fall Prevention Strategies", type: "PDF", size: "2.2 MB" },
        { name: "Seating Assessment Checklist", type: "PDF", size: "0.9 MB" },
      ]
    },
    {
      title: "Training Materials",
      description: "Product training and best practice guides",
      icon: Info,
      items: [
        { name: "Wheelchair Setup & Maintenance", type: "Video", size: "15 min" },
        { name: "Hoist Safety Training", type: "Video", size: "12 min" },
        { name: "Bed Rail Installation Guide", type: "PDF", size: "1.5 MB" },
      ]
    }
  ];


  const faqs = [
    {
      question: "What areas do you service?",
      answer: "We service all of Greater Metropolitan Melbourne and can arrange delivery across Victoria. For regional deliveries, please contact us to discuss specific arrangements."
    },
    {
      question: "How quickly can products be delivered?",
      answer: "We pride ourselves on our 48-hour quick dispatch service for most in-stock items. Urgent deliveries may be available - please contact us to discuss your specific timeline requirements."
    },
    {
      question: "Do you offer product trials?",
      answer: "Yes! Our Sleep Choice Program offers a risk-free 7-day trial for therapeutic beds and mattresses. For other equipment, trial options may be available depending on the product - please enquire."
    },
    {
      question: "Can you help with NDIS quotes and documentation?",
      answer: "Absolutely. Our team is experienced in preparing detailed quotes that meet NDIS requirements, including all necessary product specifications and justifications."
    },
    {
      question: "Do you provide installation services?",
      answer: "Installation and setup services are available for many of our products. Our team can assess your needs and arrange professional installation where required."
    },
    {
      question: "What if a product needs repair or maintenance?",
      answer: "We work closely with manufacturers to facilitate warranty claims and repairs. Contact us if you experience any issues with products purchased through Supply Ministry."
    },
    {
      question: "Can I get a quote for multiple items?",
      answer: "Yes! We encourage bulk quotes as we can often provide better pricing for multiple items. Use our quote request form or contact us directly with your requirements."
    },
    {
      question: "Do you offer staff training on equipment use?",
      answer: "Yes, we can arrange product training for your staff, either in-person or via video consultation. Training availability varies by product - please enquire when requesting a quote."
    }
  ];

  const ndisInfo = {
    fundingCategories: [
      {
        title: "Assistive Technology (AT)",
        description: "Funding for equipment that helps with daily activities, mobility, and independence",
        examples: ["Wheelchairs", "Walking frames", "Shower chairs", "Bed rails"]
      },
      {
        title: "Home Modifications",
        description: "Modifications to make your home more accessible and safe",
        examples: ["Ramps", "Grab rails", "Accessible bathrooms", "Stair lifts"]
      },
      {
        title: "Consumables",
        description: "Items that need regular replacement",
        examples: ["Continence products", "Wound care supplies", "Disposable gloves"]
      }
    ],
    process: [
      {
        step: 1,
        title: "Assessment",
        description: "Work with your OT or healthcare professional to identify your equipment needs"
      },
      {
        step: 2,
        title: "Quote Request",
        description: "Contact us with your requirements and NDIS plan details"
      },
      {
        step: 3,
        title: "Detailed Quote",
        description: "We provide a comprehensive quote with all necessary documentation"
      },
      {
        step: 4,
        title: "NDIS Approval",
        description: "Submit the quote to NDIS or your plan manager for approval"
      },
      {
        step: 5,
        title: "Delivery & Setup",
        description: "Once approved, we arrange fast delivery and professional setup"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-cream text-ink">
      <SEO 
        title="Resources & Support"
        description="Access clinical guides, NDIS funding information, FAQs, and educational resources for assistive technology. Support for healthcare professionals and clients."
      />
      <EditorialNavigation />
      
      {/* Hero Section */}
      <section className="bg-cream py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <p className="font-geist text-[11px] tracking-[0.18em] uppercase text-muted-body mb-4">Resources</p>
            <h1 className="text-4xl lg:text-5xl font-fraunces font-light text-ink mb-6 leading-[1.1]">
              Practical <span className="italic text-gold">guidance</span>.
            </h1>
            <p className="text-xl text-muted-body">
              Everything you need to make informed decisions about assistive technology solutions
            </p>
          </div>
        </div>
      </section>

      {/* Resource Library Section */}
      <section id="resource-library" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-fraunces font-light text-ink mb-4">Resource library</h2>
            <p className="text-lg text-muted-body max-w-2xl mx-auto">
              Access our collection of product catalogs, clinical guides, and training materials
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {resourceLibrary.map((resource, index) => {
              const IconComponent = resource.icon;
              return (
                <Card key={index} className="bg-cream-alt border-cream-border">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-ink/10 rounded-lg p-2">
                        <IconComponent className="h-6 w-6 text-ink" />
                      </div>
                      <CardTitle className="text-xl font-fraunces font-light text-ink">{resource.title}</CardTitle>
                    </div>
                    <CardDescription className="text-muted-body">{resource.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {resource.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-cream rounded-lg hover:bg-cream/70 transition-colors cursor-pointer border border-cream-border">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-ink">{item.name}</p>
                            <p className="text-xs text-muted-body">{item.type} • {item.size}</p>
                          </div>
                          <Download className="h-4 w-4 text-muted-body" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="py-20 bg-cream-alt">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-fraunces font-light text-ink mb-4">Supply Line blog</h2>
            <p className="text-lg text-muted-body mb-6">
              Expert insights, industry news, and practical guidance for healthcare professionals
            </p>
            <p className="text-muted-body">
              We're preparing in-depth articles on assistive technology, NDIS funding, and clinical best practices. Check back soon for our first publications.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-fraunces font-light text-ink mb-4">Frequently asked questions</h2>
            <p className="text-lg text-muted-body max-w-2xl mx-auto">
              Quick answers to common questions about our products and services
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="bg-cream-alt border border-cream-border rounded-lg px-6">
                  <AccordionTrigger className="text-left font-medium text-ink hover:text-ink/80">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-body">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* NDIS Information Section */}
      <section id="ndis" className="py-20 bg-cream-alt">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-fraunces font-light text-ink mb-4">NDIS funding information</h2>
            <p className="text-lg text-muted-body max-w-2xl mx-auto">
              Understanding how NDIS funding works for assistive technology
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            {/* Funding Categories */}
            <div className="mb-12">
              <h3 className="text-2xl font-fraunces font-light text-ink mb-6">NDIS funding categories</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {ndisInfo.fundingCategories.map((category, index) => (
                  <Card key={index} className="bg-cream border-cream-border">
                    <CardHeader>
                      <CardTitle className="text-lg font-fraunces font-light text-ink">{category.title}</CardTitle>
                      <CardDescription className="text-muted-body">{category.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-ink">Examples:</p>
                        <ul className="space-y-1">
                          {category.examples.map((example, idx) => (
                            <li key={idx} className="text-sm text-muted-body flex items-center">
                              <span className="w-1.5 h-1.5 bg-gold rounded-full mr-2"></span>
                              {example}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* NDIS Process */}
            <div className="bg-cream rounded-xl p-8 border border-cream-border">
              <h3 className="text-2xl font-fraunces font-light text-ink mb-6 text-center">
                How to Access NDIS Funding with Supply Ministry
              </h3>
              <div className="space-y-6">
                {ndisInfo.process.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-ink text-cream rounded-full flex items-center justify-center font-medium">
                        {item.step}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-medium text-ink mb-1">{item.title}</h4>
                      <p className="text-muted-body">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 text-center">
                <Button 
                  size="lg"
                  className="bg-ink text-cream hover:opacity-90 transition-opacity rounded-full px-8"
                  asChild
                >
                  <Link to="/quote">Request an NDIS Quote</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-ink text-cream">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-fraunces font-light mb-4">Still have questions?</h2>
          <p className="text-lg mb-8 text-cream/80 max-w-2xl mx-auto">
            Our experienced team is here to help. Get in touch for personalized guidance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-cream text-ink hover:opacity-90 transition-opacity rounded-full px-8"
              asChild
            >
              <Link to="/#contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Resources;
