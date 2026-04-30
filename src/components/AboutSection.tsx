import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Award, Clock, Heart } from "lucide-react";

const founders = [
  {
    name: "Alex Hampel",
    role: "Co-Founder",
    description: "Alex has over 45 years in assistive technology, retail, and customer experience. He knows what good service feels like from the other side of the counter, and that is how he runs every interaction at Supply Ministry. If an OT sends through a recommendation, Alex is usually the person who reads it first."
  },
  {
    name: "David Hyman", 
    role: "Co-Founder",
    description: "David has over 20 years across technology and health. He is focused on finding better ways to work so that vulnerable people and the families supporting them get what they need without unnecessary delays. If something is not working, David is the one who fixes the process."
  }
];

const values = [
  {
    icon: Heart,
    title: "The way we work",
    description: "We are working in someone's bedroom on what is often a hard day. We never forget that."
  },
  {
    icon: Award,
    title: "What goes into the home",
    description: "We send equipment we would put in our own parents' homes. The brands we work with know that is the test."
  },
  {
    icon: Clock,
    title: "Why we move fast",
    description: "When someone cannot get out of bed safely, the days matter. We answer quickly because the people waiting for us cannot wait."
  },
  {
    icon: Users,
    title: "After fifteen years",
    description: "We have seen most of the situations that come up. When something is unfamiliar we say so, and we find out."
  }
];

const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-violet text-cream">
      <div className="container mx-auto px-4">
        {/* Mission Statement */}
        <div className="text-center mb-16">
          <p className="font-geist text-[11px] tracking-[0.18em] uppercase text-cream/60 mb-4">About us</p>
          <h2 className="font-geist font-light tracking-tight leading-[1.05] text-5xl md:text-6xl text-cream mb-6">
            We exist to support people at their most vulnerable, and the families who care for them
          </h2>
          <p className="text-lg text-cream/75 max-w-4xl mx-auto leading-relaxed mb-6">
            We bring assistive technology into the homes of people who need it, with the care and consideration that should already be standard.
          </p>
          <p className="text-lg text-cream/75 max-w-4xl mx-auto leading-relaxed">
            Bringing equipment into someone's home is a moment, not a transaction. After fifteen years in this sector, we know what it feels like when it is handled badly. We started Supply Ministry to do it differently.
          </p>
        </div>

        {/* Our Values */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {values.map((value, index) => {
            const IconComponent = value.icon;
            return (
              <div key={index} className="text-center">
                <div className="mx-auto bg-cream/10 rounded-full p-4 w-16 h-16 flex items-center justify-center mb-4">
                  <IconComponent className="h-8 w-8 text-cream" />
                </div>
                <h3 className="font-geist text-lg text-cream mb-2">{value.title}</h3>
                <p className="text-cream/70 text-sm">{value.description}</p>
              </div>
            );
          })}
        </div>

        {/* Meet the Founders */}
        <div className="mb-16">
          <h3 className="font-geist font-light tracking-tight leading-[1.05] text-3xl md:text-4xl text-center text-cream mb-12">Meet the <span className="italic text-gold">founders</span></h3>
          <div className="grid lg:grid-cols-2 gap-8">
            {founders.map((founder, index) => (
              <Card key={index} className="bg-cream border-cream-border">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <div className="bg-ink/5 rounded-full p-3 flex-shrink-0">
                      <Users className="h-8 w-8 text-ink" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-geist text-xl text-ink mb-1">{founder.name}</h4>
                      <p className="text-violet font-medium mb-2">{founder.role}</p>
                      <div className="space-y-3">
                        <p className="text-muted-body">{founder.description}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Our Story */}
        <div className="bg-cream border border-cream-border rounded-2xl p-8 lg:p-12">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="font-geist font-light tracking-tight leading-[1.05] text-3xl text-ink mb-6">Our <span className="italic text-gold">story</span></h3>
            <p className="text-muted-body mb-6 leading-relaxed">
              Supply Ministry started because Alex and David had both spent years watching how equipment gets into people's homes, and too often it was not handled well. Late deliveries, wrong specs, families left confused, OTs spending their time resolving problems they did not create.
            </p>
            <p className="text-muted-body mb-8 leading-relaxed">
              So they built something simple. One supplier that reads the recommendation carefully, sources the right equipment, delivers it into the home, and picks up the phone when something is not right. That is still the whole idea.
            </p>
            <Button 
              size="lg" 
              className="bg-violet text-cream hover:opacity-90 rounded-full"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Talk to us
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;