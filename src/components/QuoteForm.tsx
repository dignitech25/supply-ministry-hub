import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { CheckCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Phone number validation and formatting functions
const formatAustralianPhone = (value: string): string => {
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

const isValidAustralianPhone = (phone: string): boolean => {
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

// Form validation schema
const quoteFormSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string()
    .min(10, 'Phone number must be at least 10 digits')
    .refine((phone) => isValidAustralianPhone(phone), 'Please enter a valid Australian phone number'),
  organization: z.string().optional(),
  category: z.string().min(1, 'Please select a product category'),
  requirements: z.string().min(10, 'Please describe your requirements (minimum 10 characters)'),
  timeline: z.string().min(1, 'Please select a timeline'),
});

type QuoteFormData = z.infer<typeof quoteFormSchema>;

const QuoteForm = () => {
  const { toast } = useToast();
  
  const form = useForm<QuoteFormData>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      organization: '',
      category: '',
      requirements: '',
      timeline: '',
    },
  });

  const onSubmit = async (data: QuoteFormData) => {
    try {
      console.log('Submitting quote request:', data);

      // Insert quote request into Supabase
      const { data: quoteRequest, error: insertError } = await supabase
        .from('quote_requests')
        .insert({
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          phone: data.phone,
          organization: data.organization || null,
          category: data.category,
          requirements: data.requirements,
          timeline: data.timeline,
          source_url: window.location.href,
          user_agent: navigator.userAgent,
        })
        .select()
        .single();

      if (insertError) {
        throw new Error(`Failed to save quote request: ${insertError.message}`);
      }

      console.log('Quote request saved:', quoteRequest);

      // Send email notification
      const { error: emailError } = await supabase.functions.invoke('send-quote-notification', {
        body: quoteRequest,
      });

      if (emailError) {
        console.error('Email notification failed:', emailError);
        // Don't throw error here - quote is still saved even if email fails
        toast({
          title: "Quote Request Submitted",
          description: "Your quote request has been saved, but there was an issue sending the notification email. We'll still contact you soon!",
        });
      } else {
        console.log('Email notification sent successfully');
        toast({
          title: "Quote Request Submitted Successfully!",
          description: "Thank you for your interest. We'll review your requirements and get back to you within 24 hours.",
        });
      }

      // Reset form
      form.reset();
      
    } catch (error: any) {
      console.error('Error submitting quote request:', error);
      toast({
        title: "Submission Failed",
        description: error.message || "There was an error submitting your quote request. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Request a Quote</CardTitle>
        <CardDescription>
          Tell us about your project and we'll provide you with a detailed quote tailored to your needs.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your first name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your phone number" 
                        {...field}
                        onChange={(e) => field.onChange(formatAustralianPhone(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="organization"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your organization name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Category *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a product category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="mobility">Mobility Aids</SelectItem>
                      <SelectItem value="daily-living">Daily Living Aids</SelectItem>
                      <SelectItem value="home-safety">Home Safety & Security</SelectItem>
                      <SelectItem value="bedroom">Bedroom & Comfort</SelectItem>
                      <SelectItem value="multiple">Multiple Categories</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="requirements"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Requirements *</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={4}
                      placeholder="Please describe your project requirements, specifications, quantities, and any other relevant details..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="timeline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Timeline *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your preferred timeline" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="urgent">Urgent (Within 1 week)</SelectItem>
                      <SelectItem value="soon">Soon (1-2 weeks)</SelectItem>
                      <SelectItem value="month">Within a month</SelectItem>
                      <SelectItem value="flexible">Flexible timing</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Quote Request'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default QuoteForm;