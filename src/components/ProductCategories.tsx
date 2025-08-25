import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Car, Home, Shield, Bed, ArrowRight } from "lucide-react";

const categories = [
  {
    icon: Car,
    title: "Mobility Aids",
    description: "Comprehensive mobility solutions including manual and electric wheelchairs, walking frames and rollators, mobility scooters, plus ramps and access equipment to enhance independence and freedom of movement.",
  },
  {
    icon: Home,
    title: "Daily Living Aids", 
    description: "Essential tools for independent living including bathroom safety equipment, kitchen and dining aids, dressing and grooming tools, plus reaching and gripping aids to make everyday tasks easier and more manageable.",
  },
  {
    icon: Shield,
    title: "Home Safety & Security",
    description: "Complete safety solutions featuring fall prevention systems, emergency alert devices, grab rails and handrails, plus lighting and visibility aids to create secure, accessible environments that prevent accidents.",
  },
  {
    icon: Bed,
    title: "Bedroom & Comfort",
    description: "Specialized comfort solutions including adjustable hospital beds, pressure relief mattresses, recliners and lift chairs, plus positioning aids designed for therapeutic needs and enhanced rest quality.",
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
                  <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    View Products
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Contact Expert Section - Single CTA */}
        <div className="text-center bg-card rounded-2xl p-8 border border-border">
          <h3 className="text-2xl font-semibold text-foreground mb-4">
            Need expert guidance choosing the right solution?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Our experienced team can guide you through our complete range and help you find 
            the perfect assistive technology solution for your client's specific needs.
          </p>
          <Button variant="outline" size="lg">
            Speak with Expert
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProductCategories;