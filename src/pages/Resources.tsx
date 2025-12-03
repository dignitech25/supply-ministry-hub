import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BookOpen, FileText, HelpCircle, Info, ExternalLink, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

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

  const blogPosts = [
    {
      title: "5 Essential Mobility Aids for Aging in Place",
      date: "December 2024",
      excerpt: "Discover the top mobility solutions that help seniors maintain independence and safety in their own homes.",
      category: "Mobility"
    },
    {
      title: "Understanding NDIS Funding for Assistive Technology",
      date: "November 2024",
      excerpt: "A comprehensive guide to navigating NDIS funding categories and maximizing support for your clients.",
      category: "NDIS"
    },
    {
      title: "The Importance of Proper Seating Assessments",
      date: "November 2024",
      excerpt: "Why professional seating assessments are crucial for comfort, health, and long-term wellbeing.",
      category: "Clinical"
    },
    {
      title: "Pressure Care: Prevention is Better Than Cure",
      date: "October 2024",
      excerpt: "Expert insights on preventing pressure injuries through proper equipment selection and care protocols.",
      category: "Healthcare"
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
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-card py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Resources & Support
            </h1>
            <p className="text-xl text-muted-foreground">
              Everything you need to make informed decisions about assistive technology solutions
            </p>
          </div>
        </div>
      </section>

      {/* Resource Library Section */}
      <section id="resource-library" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Resource Library</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Access our collection of product catalogs, clinical guides, and training materials
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {resourceLibrary.map((resource, index) => {
              const IconComponent = resource.icon;
              return (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-primary/10 rounded-lg p-2">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{resource.title}</CardTitle>
                    </div>
                    <CardDescription>{resource.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {resource.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-soft-gray rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-foreground">{item.name}</p>
                            <p className="text-xs text-muted-foreground">{item.type} • {item.size}</p>
                          </div>
                          <Download className="h-4 w-4 text-muted-foreground" />
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
      <section id="blog" className="py-20 bg-soft-gray">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Supply Line Blog</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Expert insights, industry news, and practical guidance for healthcare professionals
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {blogPosts.map((post, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded">
                      {post.category}
                    </span>
                    <span className="text-xs text-muted-foreground">{post.date}</span>
                  </div>
                  <CardTitle className="text-xl hover:text-primary transition-colors">
                    {post.title}
                  </CardTitle>
                  <CardDescription>{post.excerpt}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="link" className="px-0 text-primary">
                    Read more <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Quick answers to common questions about our products and services
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="bg-card border border-border rounded-lg px-6">
                  <AccordionTrigger className="text-left font-semibold hover:text-primary">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* NDIS Information Section */}
      <section id="ndis" className="py-20 bg-soft-gray">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">NDIS Funding Information</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Understanding how NDIS funding works for assistive technology
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            {/* Funding Categories */}
            <div className="mb-12">
              <h3 className="text-2xl font-semibold text-foreground mb-6">NDIS Funding Categories</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {ndisInfo.fundingCategories.map((category, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-lg">{category.title}</CardTitle>
                      <CardDescription>{category.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-foreground">Examples:</p>
                        <ul className="space-y-1">
                          {category.examples.map((example, idx) => (
                            <li key={idx} className="text-sm text-muted-foreground flex items-center">
                              <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span>
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
            <div className="bg-card rounded-xl p-8 border border-border">
              <h3 className="text-2xl font-semibold text-foreground mb-6 text-center">
                How to Access NDIS Funding with Supply Ministry
              </h3>
              <div className="space-y-6">
                {ndisInfo.process.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                        {item.step}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-foreground mb-1">{item.title}</h4>
                      <p className="text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 text-center">
                <Button 
                  size="lg"
                  className="bg-orange-500 text-white hover:bg-orange-600 transition-colors"
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
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Still Have Questions?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Our experienced team is here to help. Get in touch for personalized guidance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-orange-500 text-white hover:bg-orange-600 transition-colors"
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
