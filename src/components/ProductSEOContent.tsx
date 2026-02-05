 import { Link } from "react-router-dom";
 import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
 import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
 import { Button } from "@/components/ui/button";
 import { Check, Phone, Truck, Users, FileText, Clock } from "lucide-react";
 
 interface ProductSEOContentProps {
   productSlug: string;
 }
 
 // SEO content configuration for specific products
 const productSEOData: Record<string, {
   intro: string;
   features: string[];
   clinicalUseCases: string[];
   deliveryContent: { title: string; paragraphs: string[] };
   otSupport: { description: string };
   faqs: Array<{ question: string; answer: string }>;
 }> = {
   "aspire_aspire_comfimotion_activ_care_adjustable_bed": {
     intro: "The Aspire ComfiMotion Activ Care Bed is designed for clients with complex mobility needs who require frequent repositioning and reliable postural support. Occupational Therapists choose this bed for its dependable 4-section profiling, compatibility with pressure care mattresses, and intuitive controls that both carers and clients can operate with confidence.",
     features: [
       "Hi-lo height adjustment for safe transfers and carer ergonomics",
       "4-section profiling: backrest, thigh break, knee break, and Trendelenburg/reverse Trendelenburg",
       "Central locking castors for easy repositioning and secure placement",
       "Split side rail options for safety and accessibility",
       "High weight capacity suitable for bariatric clients",
       "Easy-to-use handset controls with lockout function",
       "Battery backup for continued operation during power outages",
     ],
     clinicalUseCases: [
       "Post-surgical recovery requiring frequent position changes",
       "Clients with respiratory conditions benefiting from head elevation",
       "Pressure injury prevention and management",
       "End-of-life care requiring comfortable repositioning",
       "Neurological conditions requiring postural support",
       "Clients with complex mobility needs who spend extended time in bed",
     ],
     deliveryContent: {
       title: "Melbourne Delivery & Setup",
       paragraphs: [
         "We offer professional delivery and white-glove setup service across Melbourne and surrounding areas. Our experienced team handles everything from careful transport to complete assembly in your client's home or facility.",
          "We proudly service South East Melbourne and the broader Melbourne metropolitan area. Same-week delivery is often available for urgent requirements.",
         "All deliveries include professional installation by trained technicians who will demonstrate all bed functions and ensure everything is working correctly before they leave.",
       ],
     },
     otSupport: {
       description: "Need assistance with quote preparation or have questions about this product? Our team provides direct phone support and can help prepare detailed quotes that meet your documentation requirements.",
     },
     faqs: [
       {
         question: "What's included in delivery and setup?",
         answer: "Our white-glove delivery service includes professional delivery to your specified room, complete assembly of the bed frame, installation of all components including side rails, demonstration of all bed functions, and removal of all packaging materials.",
       },
       {
         question: "What accessories are compatible with this bed?",
         answer: "The Aspire ComfiMotion Activ Care Bed is compatible with a range of accessories including IV poles, trapeze bars, bed lever assists, over-bed tables, and various mattress options. Contact us for specific accessory recommendations.",
       },
       {
         question: "How quickly can this bed be delivered?",
         answer: "For Melbourne metropolitan areas, we typically offer same-week delivery for in-stock items. Urgent deliveries can often be arranged within 24-48 hours. Lead times may vary for custom configurations.",
       },
       {
         question: "What mattresses work with this bed?",
         answer: "This bed is compatible with standard mattresses as well as therapeutic pressure care mattresses including alternating air, foam, and hybrid options. The mattress platform is designed to work with most major pressure care systems.",
       },
     ],
   },
 };
 
 export default function ProductSEOContent({ productSlug }: ProductSEOContentProps) {
   const data = productSEOData[productSlug];
   
   if (!data) return null;
 
   return (
     <div className="mt-12 space-y-0">
       {/* Intro Section */}
       <section className="py-12 bg-soft-gray">
         <div className="container mx-auto px-4 max-w-4xl">
           <h2 className="text-2xl font-bold text-foreground mb-4">About This Product</h2>
           <p className="text-lg text-muted-foreground leading-relaxed">{data.intro}</p>
         </div>
       </section>
 
       {/* Key Features Section */}
       <section className="py-12">
         <div className="container mx-auto px-4 max-w-4xl">
           <h2 className="text-2xl font-bold text-foreground mb-6">Key Features</h2>
           <ul className="space-y-3">
             {data.features.map((feature, index) => (
               <li key={index} className="flex items-start gap-3">
                 <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                 <span className="text-muted-foreground">{feature}</span>
               </li>
             ))}
           </ul>
         </div>
       </section>
 
       {/* Clinical Use Cases Section */}
       <section className="py-12 bg-soft-gray">
         <div className="container mx-auto px-4 max-w-4xl">
           <h2 className="text-2xl font-bold text-foreground mb-6">Common Clinical Use Cases</h2>
           <ul className="space-y-3">
             {data.clinicalUseCases.map((useCase, index) => (
               <li key={index} className="flex items-start gap-3">
                 <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                 <span className="text-muted-foreground">{useCase}</span>
               </li>
             ))}
           </ul>
         </div>
       </section>
 
       {/* Melbourne Delivery Section */}
       <section className="py-12">
         <div className="container mx-auto px-4 max-w-4xl">
           <div className="flex items-center gap-3 mb-6">
             <Truck className="h-7 w-7 text-primary" />
             <h2 className="text-2xl font-bold text-foreground">{data.deliveryContent.title}</h2>
           </div>
           <div className="space-y-4">
             {data.deliveryContent.paragraphs.map((paragraph, index) => (
               <p key={index} className="text-muted-foreground leading-relaxed">{paragraph}</p>
             ))}
           </div>
         </div>
       </section>
 
       {/* OT Support Section */}
       <section className="py-12 bg-soft-gray">
         <div className="container mx-auto px-4 max-w-4xl">
           <div className="flex items-center gap-3 mb-6">
             <Users className="h-7 w-7 text-primary" />
             <h2 className="text-2xl font-bold text-foreground">Support for Occupational Therapists</h2>
           </div>
           <div className="grid md:grid-cols-2 gap-6 mb-6">
             <Card>
               <CardHeader>
                 <CardTitle className="flex items-center gap-2 text-lg">
                   <FileText className="h-5 w-5 text-primary" />
                   Product Documentation
                 </CardTitle>
               </CardHeader>
               <CardContent>
                 <p className="text-muted-foreground text-sm">
                   Detailed product specifications, brochures, and technical documentation available on request.
                 </p>
               </CardContent>
             </Card>
             <Card>
               <CardHeader>
                 <CardTitle className="flex items-center gap-2 text-lg">
                   <Clock className="h-5 w-5 text-primary" />
                   Product Trials
                 </CardTitle>
               </CardHeader>
               <CardContent>
                 <p className="text-muted-foreground text-sm">
                   Product trials can be arranged to assess suitability for your client's specific needs.
                 </p>
               </CardContent>
             </Card>
           </div>
           <div className="p-6 bg-background rounded-lg border">
             <p className="text-muted-foreground mb-4">{data.otSupport.description}</p>
             <div className="flex flex-col sm:flex-row gap-3">
               <Button className="bg-orange-500 text-white hover:bg-orange-600" asChild>
                 <Link to="/quote">Request a Quote</Link>
               </Button>
               <Button variant="outline" asChild>
                 <a href="tel:0404593090">
                   <Phone className="mr-2 h-4 w-4" />
                   Call: 0404 593 090
                 </a>
               </Button>
             </div>
           </div>
         </div>
       </section>
 
       {/* FAQ Section */}
       <section className="py-12">
         <div className="container mx-auto px-4 max-w-4xl">
           <h2 className="text-2xl font-bold text-foreground mb-6">Frequently Asked Questions</h2>
           <Accordion type="single" collapsible className="space-y-3">
             {data.faqs.map((faq, index) => (
               <AccordionItem
                 key={index}
                 value={`faq-${index}`}
                 className="bg-card border border-border rounded-lg px-6"
               >
                 <AccordionTrigger className="text-left font-medium hover:text-primary">
                   {faq.question}
                 </AccordionTrigger>
                 <AccordionContent className="text-muted-foreground">
                   {faq.answer}
                 </AccordionContent>
               </AccordionItem>
             ))}
           </Accordion>
         </div>
       </section>
     </div>
   );
 }
 
 // Export function to check if SEO content exists for a product
 export function hasProductSEOContent(productSlug: string): boolean {
   return !!productSEOData[productSlug];
 }
 
 // Export FAQs for JSON-LD schema generation
 export function getProductFAQs(productSlug: string) {
   return productSEOData[productSlug]?.faqs || [];
 }