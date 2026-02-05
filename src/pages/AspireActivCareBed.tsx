 import { Link } from "react-router-dom";
 import Navigation from "@/components/Navigation";
 import Footer from "@/components/Footer";
 import SEO from "@/components/SEO";
 import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
 import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
 import { Badge } from "@/components/ui/badge";
 import { Button } from "@/components/ui/button";
 import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
 import { Check, Phone, Truck, Users, FileText, Clock } from "lucide-react";
 
 const AspireActivCareBed = () => {
   const keyFeatures = [
     "Hi-lo height adjustment for safe transfers and carer ergonomics",
     "4-section profiling: backrest, thigh break, knee break, and Trendelenburg/reverse Trendelenburg",
     "Central locking castors for easy repositioning and secure placement",
     "Split side rail options for safety and accessibility",
     "High weight capacity suitable for bariatric clients",
     "Easy-to-use handset controls with lockout function",
     "Battery backup for continued operation during power outages",
   ];
 
   const clinicalUseCases = [
     "Post-surgical recovery requiring frequent position changes",
     "Clients with respiratory conditions benefiting from head elevation",
     "Pressure injury prevention and management",
     "End-of-life care requiring comfortable repositioning",
     "Neurological conditions requiring postural support",
     "Clients with complex mobility needs who spend extended time in bed",
   ];
 
   const specifications = [
     { label: "Overall Length", value: "TBC" },
     { label: "Overall Width", value: "TBC" },
     { label: "Minimum Height", value: "TBC" },
     { label: "Maximum Height", value: "TBC" },
     { label: "Safe Working Load", value: "TBC" },
     { label: "Mattress Platform", value: "TBC" },
     { label: "Power Supply", value: "240V AC" },
     { label: "Warranty", value: "TBC" },
   ];
 
   const faqs = [
     {
       question: "What's included in delivery and setup?",
       answer: "Our white-glove delivery service includes professional delivery to your specified room, complete assembly of the bed frame, installation of all components including side rails, demonstration of all bed functions, and removal of all packaging materials. We ensure the bed is fully operational before we leave."
     },
     {
       question: "What accessories are compatible with this bed?",
       answer: "The Aspire ComfiMotion Activ Care Bed is compatible with a range of accessories including IV poles, trapeze bars, bed lever assists, over-bed tables, and various mattress options. Contact us for specific accessory recommendations based on your client's needs."
     },
     {
       question: "How quickly can this bed be delivered?",
       answer: "For Melbourne metropolitan areas, we typically offer same-week delivery for in-stock items. Urgent deliveries can often be arranged within 24-48 hours. Lead times may vary for custom configurations or high-demand periods—contact us for current availability."
     },
     {
       question: "What mattresses work with this bed?",
       answer: "This bed is compatible with standard single mattresses as well as therapeutic pressure care mattresses including alternating air, foam, and hybrid options. The mattress platform is designed to work with most major pressure care systems. We can recommend suitable mattress options based on your client's clinical requirements."
     },
   ];
 
   return (
     <div className="min-h-screen bg-background">
       <SEO 
         title="Aspire ComfiMotion Activ Care Bed"
         description="Professional-grade hi-lo care bed with 4-section profiling for complex care needs. Trusted by OTs across Melbourne. Same-week delivery available."
       />
       <Navigation />
       
       {/* Hero Section */}
       <section className="bg-gradient-card py-16 lg:py-20">
         <div className="container mx-auto px-4">
           <div className="max-w-4xl mx-auto">
             <Badge variant="secondary" className="mb-4">
               Aspire
             </Badge>
             <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
               Aspire ComfiMotion Activ Care Bed
             </h1>
             <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
               The Aspire ComfiMotion Activ Care Bed is designed for clients with complex mobility needs 
               who require frequent repositioning and reliable postural support. Occupational Therapists 
               choose this bed for its dependable 4-section profiling, compatibility with pressure care 
               mattresses, and intuitive controls that both carers and clients can operate with confidence.
             </p>
             <div className="flex flex-col sm:flex-row gap-4">
               <Button 
                 size="lg"
                 className="bg-orange-500 text-white hover:bg-orange-600 transition-colors"
                 asChild
               >
                 <Link to="/quote">Get a Quote</Link>
               </Button>
               <Button 
                 size="lg"
                 variant="outline"
                 asChild
               >
                 <a href="tel:0404593090">
                   <Phone className="mr-2 h-4 w-4" />
                   Call Us
                 </a>
               </Button>
             </div>
           </div>
         </div>
       </section>
 
       {/* Key Features Section */}
       <section className="py-16 lg:py-20">
         <div className="container mx-auto px-4">
           <div className="max-w-4xl mx-auto">
             <h2 className="text-3xl font-bold text-foreground mb-8">Key Features</h2>
             <ul className="space-y-4">
               {keyFeatures.map((feature, index) => (
                 <li key={index} className="flex items-start gap-3">
                   <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                   <span className="text-lg text-muted-foreground">{feature}</span>
                 </li>
               ))}
             </ul>
           </div>
         </div>
       </section>
 
       {/* Clinical Use Cases Section */}
       <section className="py-16 lg:py-20 bg-soft-gray">
         <div className="container mx-auto px-4">
           <div className="max-w-4xl mx-auto">
             <h2 className="text-3xl font-bold text-foreground mb-8">Common Clinical Use Cases</h2>
             <ul className="space-y-4">
               {clinicalUseCases.map((useCase, index) => (
                 <li key={index} className="flex items-start gap-3">
                   <span className="w-2 h-2 bg-primary rounded-full mt-2.5 flex-shrink-0"></span>
                   <span className="text-lg text-muted-foreground">{useCase}</span>
                 </li>
               ))}
             </ul>
           </div>
         </div>
       </section>
 
       {/* Specifications Section */}
       <section className="py-16 lg:py-20">
         <div className="container mx-auto px-4">
           <div className="max-w-4xl mx-auto">
             <h2 className="text-3xl font-bold text-foreground mb-8">Specifications</h2>
             <Card>
               <CardContent className="p-0">
                 <Table>
                   <TableBody>
                     {specifications.map((spec, index) => (
                       <TableRow key={index}>
                         <TableCell className="font-medium text-foreground w-1/2">
                           {spec.label}
                         </TableCell>
                         <TableCell className="text-muted-foreground">
                           {spec.value}
                         </TableCell>
                       </TableRow>
                     ))}
                   </TableBody>
                 </Table>
               </CardContent>
             </Card>
             <p className="text-sm text-muted-foreground mt-4">
               * Specifications are indicative and subject to change. Contact us for the latest product specifications.
             </p>
           </div>
         </div>
       </section>
 
       {/* Melbourne Delivery Section */}
       <section className="py-16 lg:py-20 bg-soft-gray">
         <div className="container mx-auto px-4">
           <div className="max-w-4xl mx-auto">
             <div className="flex items-center gap-3 mb-6">
               <Truck className="h-8 w-8 text-primary" />
               <h2 className="text-3xl font-bold text-foreground">Melbourne Delivery & Setup</h2>
             </div>
             <div className="prose prose-lg max-w-none text-muted-foreground">
               <p className="text-lg leading-relaxed mb-4">
                 We offer professional delivery and white-glove setup service across Melbourne and 
                 surrounding areas. Our experienced team handles everything from careful transport to 
                 complete assembly in your client's home or facility.
               </p>
               <p className="text-lg leading-relaxed mb-4">
                 We proudly service South East Melbourne including Bayside, Kingston, Casey, Monash, 
                 Glen Eira, and Frankston, as well as the broader Melbourne metropolitan area. 
                 Same-week delivery is often available for urgent requirements.
               </p>
               <p className="text-lg leading-relaxed">
                 All deliveries include professional installation by trained technicians who will 
                 demonstrate all bed functions and ensure everything is working correctly before they leave.
               </p>
             </div>
           </div>
         </div>
       </section>
 
       {/* OT Support Section */}
       <section className="py-16 lg:py-20">
         <div className="container mx-auto px-4">
           <div className="max-w-4xl mx-auto">
             <div className="flex items-center gap-3 mb-6">
               <Users className="h-8 w-8 text-primary" />
               <h2 className="text-3xl font-bold text-foreground">Support for Occupational Therapists</h2>
             </div>
             <div className="grid md:grid-cols-2 gap-6">
               <Card>
                 <CardHeader>
                   <CardTitle className="flex items-center gap-2 text-lg">
                     <FileText className="h-5 w-5 text-primary" />
                     Product Documentation
                   </CardTitle>
                 </CardHeader>
                 <CardContent>
                   <p className="text-muted-foreground">
                     Detailed product specifications, brochures, and technical documentation available 
                     on request to support your assessment and reporting requirements.
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
                   <p className="text-muted-foreground">
                     Product trials can be arranged to help you assess suitability for your client's 
                     specific needs. Contact us to discuss trial arrangements.
                   </p>
                 </CardContent>
               </Card>
             </div>
             <div className="mt-6 p-6 bg-soft-gray rounded-lg">
               <p className="text-lg text-muted-foreground mb-4">
                 Need assistance with quote preparation or have questions about this product? 
                 Our team provides direct phone support and can help prepare detailed quotes 
                 that meet your documentation requirements.
               </p>
               <div className="flex flex-col sm:flex-row gap-4">
                 <Button 
                   className="bg-orange-500 text-white hover:bg-orange-600 transition-colors"
                   asChild
                 >
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
         </div>
       </section>
 
       {/* FAQ Section */}
       <section className="py-16 lg:py-20 bg-soft-gray">
         <div className="container mx-auto px-4">
           <div className="max-w-4xl mx-auto">
             <h2 className="text-3xl font-bold text-foreground mb-8">Frequently Asked Questions</h2>
             <Accordion type="single" collapsible className="space-y-4">
               {faqs.map((faq, index) => (
                 <AccordionItem 
                   key={index} 
                   value={`item-${index}`} 
                   className="bg-card border border-border rounded-lg px-6"
                 >
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
 
       {/* CTA Section */}
       <section className="py-16 lg:py-20 bg-primary text-primary-foreground">
         <div className="container mx-auto px-4 text-center">
           <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
           <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
             Contact us today for a quote or to discuss how the Aspire ComfiMotion Activ Care Bed 
             can meet your client's needs.
           </p>
           <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <Button 
               size="lg"
               className="bg-orange-500 text-white hover:bg-orange-600 transition-colors"
               asChild
             >
               <Link to="/quote">Get a Quote</Link>
             </Button>
             <Button 
               size="lg"
               variant="outline"
               className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
               asChild
             >
               <a href="tel:0404593090">
                 <Phone className="mr-2 h-4 w-4" />
                 Call Us
               </a>
             </Button>
           </div>
         </div>
       </section>
 
       <Footer />
     </div>
   );
 };
 
 export default AspireActivCareBed;