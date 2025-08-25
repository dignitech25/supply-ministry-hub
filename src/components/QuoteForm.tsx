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
  const [phoneNumber, setPhoneNumber] = useState("");

  const formatAustralianPhone = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Handle different Australian phone number formats
    if (digits.startsWith('61')) {
      // International format +61
      if (digits.length <= 3) return `+${digits}`;
      if (digits.length <= 4) return `+61 ${digits.slice(2)}`;
      if (digits.length <= 7) return `+61 ${digits.slice(2, 3)} ${digits.slice(3)}`;
      if (digits.length <= 11) return `+61 ${digits.slice(2, 3)} ${digits.slice(3, 7)} ${digits.slice(7)}`;
      return `+61 ${digits.slice(2, 3)} ${digits.slice(3, 7)} ${digits.slice(7, 11)}`;
    } else if (digits.startsWith('04')) {
      // Mobile format 04XX XXX XXX
      if (digits.length <= 4) return digits;
      if (digits.length <= 7) return `${digits.slice(0, 4)} ${digits.slice(4)}`;
      return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 10)}`;
    } else if (digits.startsWith('13') || digits.startsWith('18')) {
      // 13XX XXX XXX or 18XX XXX XXX
      if (digits.length <= 4) return digits;
      if (digits.length <= 7) return `${digits.slice(0, 4)} ${digits.slice(4)}`;
      return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 10)}`;
    } else if (digits.startsWith('0')) {
      // Landline format 0X XXXX XXXX
      if (digits.length <= 2) return digits;
      if (digits.length <= 6) return `${digits.slice(0, 2)} ${digits.slice(2)}`;
      return `${digits.slice(0, 2)} ${digits.slice(2, 6)} ${digits.slice(6, 10)}`;
    }
    
    return value;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatAustralianPhone(e.target.value);
    setPhoneNumber(formatted);
  };

  const isValidAustralianPhone = (phone: string) => {
    const digits = phone.replace(/\D/g, '');
    return (
      // Mobile
      /^04\d{8}$/.test(digits) ||
      // Landline
      /^0[2-8]\d{8}$/.test(digits) ||
      // Toll-free
      /^(13|18)\d{8}$/.test(digits) ||
      // International
      /^61[2-8]\d{8}$/.test(digits) ||
      /^614\d{8}$/.test(digits)
    );
  };

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
              <Input 
                id="phone" 
                type="tel" 
                value={phoneNumber}
                onChange={handlePhoneChange}
                placeholder="0412 345 678 or 02 1234 5678"
                className={phoneNumber && !isValidAustralianPhone(phoneNumber) ? "border-destructive" : ""}
              />
              {phoneNumber && !isValidAustralianPhone(phoneNumber) && (
                <p className="text-sm text-destructive">
                  Please enter a valid Australian phone number
                </p>
              )}
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