import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Award, Clock, Heart } from "lucide-react";

const founders = [
  {
    name: "Alex Hampel",
    role: "Co-Founder & Director",
    experience: "15+ years in assistive technology",
    specialization: "Mobility solutions and NDIS compliance",
    description: "Alex brings extensive experience in mobility equipment and has helped thousands of clients achieve greater independence through the right assistive technology solutions."
  },
  {
    name: "David Hyman", 
    role: "Co-Founder & Director",
    experience: "12+ years in healthcare supply",
    specialization: "Home modifications and safety equipment",
    description: "David's expertise in home safety and modification solutions has made countless homes more accessible and secure for people with disabilities and elderly clients."
  }
];

const values = [
  {
    icon: Heart,
    title: "Care-Centered Approach",
    description: "Every decision we make is guided by what's best for the people who will use our products."
  },
  {
    icon: Award,
    title: "Quality Excellence",
    description: "We partner only with trusted manufacturers who share our commitment to quality and reliability."
  },
  {
    icon: Clock,
    title: "Rapid Response", 
    description: "When independence is at stake, timing matters. That's why we prioritize fast dispatch and delivery."
  },
  {
    icon: Users,
    title: "Expert Guidance",
    description: "Our team's combined decades of experience means you get knowledgeable advice, not just products."
  }
];

const AboutSection = () => {
  return (
    <section id="about" className="py-20">
      <div className="container mx-auto px-4">
        {/* Mission Statement */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-6">
            Connecting Care With Solutions
          </h2>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Founded by Alex Hampel and David Hyman, Supply Ministry combines decades of experience 
            in mobility and assistive technology to simplify the process of choosing and supplying 
            the right equipment for your clients across Australia.
          </p>
        </div>

        {/* Our Values */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {values.map((value, index) => {
            const IconComponent = value.icon;
            return (
              <div key={index} className="text-center">
                <div className="mx-auto bg-primary/10 rounded-full p-4 w-16 h-16 flex items-center justify-center mb-4">
                  <IconComponent className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{value.title}</h3>
                <p className="text-muted-foreground text-sm">{value.description}</p>
              </div>
            );
          })}
        </div>

        {/* Meet the Founders */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center text-foreground mb-12">Meet the Founders</h3>
          <div className="grid lg:grid-cols-2 gap-8">
            {founders.map((founder, index) => (
              <Card key={index} className="border-border">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary/10 rounded-full p-3 flex-shrink-0">
                      <Users className="h-8 w-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-semibold text-foreground mb-1">{founder.name}</h4>
                      <p className="text-primary font-medium mb-2">{founder.role}</p>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium text-foreground">Experience:</p>
                          <p className="text-sm text-muted-foreground">{founder.experience}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">Specialization:</p>
                          <p className="text-sm text-muted-foreground">{founder.specialization}</p>
                        </div>
                        <p className="text-muted-foreground">{founder.description}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Our Story */}
        <div className="bg-soft-gray rounded-2xl p-8 lg:p-12">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-foreground mb-6">Our Story</h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Supply Ministry was born from a simple observation: healthcare professionals and support 
              coordinators were spending too much time navigating complex supplier relationships and 
              not enough time focusing on what matters most - their clients' wellbeing and independence.
            </p>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              By building strong relationships with Australia's most trusted assistive technology 
              manufacturers and maintaining our commitment to exceptional service, we've created 
              a streamlined experience that puts care providers back in control of their time 
              while ensuring their clients get the best possible outcomes.
            </p>
            <Button 
              size="lg" 
              className="bg-orange-500 text-white hover:bg-orange-600 transition-colors"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Get in Touch
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;