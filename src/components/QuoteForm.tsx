import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send, CheckCircle } from "lucide-react";

const QuoteForm = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  if (isSubmitted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <div className="mx-auto bg-success/10 rounded-full p-4 w-16 h-16 flex items-center justify-center mb-6">
            <CheckCircle className="h-8 w-8 text-success" />
          </div>
          <h3 className="text-2xl font-semibold text-foreground mb-4">Quote Request Received!</h3>
          <p className="text-muted-foreground mb-6">
            Thank you for your interest. Our team will review your requirements and get back to you within 24 hours.
          </p>
          <Button variant="outline" onClick={() => setIsSubmitted(false)}>
            Submit Another Quote
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Request a Quote</CardTitle>
        <p className="text-muted-foreground text-center">
          Get competitive pricing on assistive technology solutions
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name*</Label>
              <Input id="firstName" required placeholder="John" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name*</Label>
              <Input id="lastName" required placeholder="Smith" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address*</Label>
              <Input id="email" type="email" required placeholder="john@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" placeholder="1300 123 456" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="organization">Organization*</Label>
            <Input id="organization" required placeholder="Healthcare Provider, NDIS Provider, etc." />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Product Category*</Label>
            <Select required>
              <SelectTrigger>
                <SelectValue placeholder="Select a product category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mobility">Mobility Aids</SelectItem>
                <SelectItem value="daily-living">Daily Living Aids</SelectItem>
                <SelectItem value="home-safety">Home Safety & Security</SelectItem>
                <SelectItem value="bedroom">Bedroom & Comfort</SelectItem>
                <SelectItem value="multiple">Multiple Categories</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="requirements">Requirements & Details*</Label>
            <Textarea 
              id="requirements" 
              required 
              placeholder="Please describe your specific needs, preferred products, quantity requirements, and any special considerations..."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="timeline">Required Timeline</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="When do you need this?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="urgent">Urgent (Within 1 week)</SelectItem>
                <SelectItem value="soon">Soon (1-2 weeks)</SelectItem>
                <SelectItem value="month">Within a month</SelectItem>
                <SelectItem value="flexible">Flexible timing</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" size="lg" className="w-full bg-gradient-hero hover:bg-primary-dark">
            <Send className="mr-2 h-5 w-5" />
            Submit Quote Request
          </Button>

          <p className="text-sm text-muted-foreground text-center">
            We respect your privacy and will never share your information with third parties.
          </p>
        </form>
      </CardContent>
    </Card>
  );
};

export default QuoteForm;