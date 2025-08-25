import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Car, Home, Shield, Bed, ArrowRight } from "lucide-react";

const categories = [
  {
    icon: Car,
    title: "Mobility Aids",
    description: "Wheelchairs, walking frames, scooters and mobility accessories to enhance independence and freedom of movement.",
    features: ["Manual & Electric Wheelchairs", "Walking Frames & Rollators", "Mobility Scooters", "Ramps & Access Equipment"]
  },
  {
    icon: Home,
    title: "Daily Living Aids",
    description: "Essential tools and equipment to make everyday tasks easier and more manageable for independent living.",
    features: ["Bathroom Safety Equipment", "Kitchen & Dining Aids", "Dressing & Grooming Tools", "Reaching & Gripping Aids"]
  },
  {
    icon: Shield,
    title: "Home Safety & Security",
    description: "Comprehensive safety solutions to create secure, accessible environments that prevent accidents and injuries.",
    features: ["Fall Prevention Systems", "Emergency Alert Devices", "Grab Rails & Handrails", "Lighting & Visibility Aids"]
  },
  {
    icon: Bed,
    title: "Bedroom & Comfort",
    description: "Specialized beds, mattresses, and comfort solutions designed for therapeutic needs and enhanced rest quality.",
    features: ["Adjustable Hospital Beds", "Pressure Relief Mattresses", "Recliners & Lift Chairs", "Positioning Aids"]
  }
];

const ProductCategories = () => {
  return (
    <section id="products" className="py-20 bg-soft-gray">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Complete Assistive Technology Solutions
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our four core product categories cover every aspect of assistive technology, 
            from mobility enhancement to home safety and comfort solutions.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <Card key={index} className="bg-card hover:shadow-lg transition-all duration-300 border-border group">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto bg-primary/10 rounded-full p-4 w-16 h-16 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <IconComponent className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl text-foreground">{category.title}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {category.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {category.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="text-sm text-muted-foreground flex items-center">
                        <div className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    View Products
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center bg-card rounded-2xl p-8 border border-border">
          <h3 className="text-2xl font-semibold text-foreground mb-4">
            Need help choosing the right solution?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Our experienced team can guide you through our complete range and help you find 
            the perfect assistive technology solution for your client's specific needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-hero hover:bg-primary-dark">
              Request a Quote
            </Button>
            <Button variant="outline" size="lg">
              Speak with Expert
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductCategories;