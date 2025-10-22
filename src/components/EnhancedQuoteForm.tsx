import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useQuote } from '@/contexts/QuoteContext';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

// Phone number utilities
const formatAustralianPhone = (value: string): string => {
  const cleaned = value.replace(/\D/g, '');
  if (cleaned.length <= 4) return cleaned;
  if (cleaned.length <= 7) return `${cleaned.slice(0, 4)} ${cleaned.slice(4)}`;
  return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7, 10)}`;
};

const isValidAustralianPhone = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, '');
  return /^0[2-9]\d{8}$/.test(cleaned) || /^04\d{8}$/.test(cleaned);
};

const enhancedQuoteFormSchema = z.object({
  requesterType: z.string().min(1, 'Please select requester type'),
  requesterName: z.string().min(2, 'Name must be at least 2 characters'),
  requesterOrganisation: z.string().optional(),
  requesterEmail: z.string().email('Please enter a valid email address'),
  requesterPhone: z.string().optional(),
  clientName: z.string().min(2, 'Client name is required'),
  clientNdisNumber: z.string().optional(),
  fundingType: z.string().min(1, 'Please select funding type'),
  deliveryAddress: z.string().min(5, 'Delivery address is required'),
  clinicalContext: z.string().optional(),
  urgency: z.string().min(1, 'Please select urgency level'),
});

type EnhancedQuoteFormData = z.infer<typeof enhancedQuoteFormSchema>;

interface EnhancedQuoteFormProps {
  onSuccess?: () => void;
}

const EnhancedQuoteForm: React.FC<EnhancedQuoteFormProps> = ({ onSuccess }) => {
  const { toast } = useToast();
  const { state, clearQuote } = useQuote();
  
  const form = useForm<EnhancedQuoteFormData>({
    resolver: zodResolver(enhancedQuoteFormSchema),
    defaultValues: {
      requesterType: '',
      requesterName: '',
      requesterOrganisation: '',
      requesterEmail: '',
      requesterPhone: '',
      clientName: '',
      clientNdisNumber: '',
      fundingType: '',
      deliveryAddress: '',
      clinicalContext: '',
      urgency: '',
    },
  });

  const onSubmit = async (data: EnhancedQuoteFormData) => {
    if (state.items.length === 0) {
      toast({
        title: 'No items in quote',
        description: 'Please add some products to your quote before submitting.',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Prepare payload for edge function
      const payload = {
        requester_type: data.requesterType,
        requester_name: data.requesterName,
        requester_organisation: data.requesterOrganisation || undefined,
        requester_email: data.requesterEmail,
        requester_phone: data.requesterPhone || undefined,
        client_name: data.clientName,
        client_ndis_number: data.clientNdisNumber || undefined,
        funding_type: data.fundingType,
        delivery_address: data.deliveryAddress,
        clinical_context: data.clinicalContext || undefined,
        urgency: data.urgency,
        items: state.items.map(item => ({
          sku: item.smSku || '',
          title: item.productName,
          size: item.variantSize || undefined,
          colour: item.variantColor || undefined,
          quantity: item.quantity,
          unit_price: item.unitPrice?.toString() || undefined,
          price_source: 'website',
        })),
      };

      // Call edge function
      const { data: result, error } = await supabase.functions.invoke(
        'submit-quote-with-email',
        { body: payload }
      );

      if (error) throw error;

      if (!result.success) {
        throw new Error(result.error || 'Failed to submit quote');
      }

      toast({
        title: 'Quote submitted!',
        description: `Reference: ${result.quoteNumber}`,
      });

      // Clear the form and quote
      form.reset();
      clearQuote();
      
      // Redirect to confirmation page
      window.location.href = `/quote-confirm?ref=${result.quoteNumber}`;

    } catch (error: any) {
      console.error('Error submitting quote:', error);
      toast({
        title: 'Error submitting quote',
        description: error.message || 'Please try again later.',
        variant: 'destructive',
      });
    }
  };

  const handlePhoneChange = (value: string, onChange: (value: string) => void) => {
    const formatted = formatAustralianPhone(value);
    onChange(formatted);
  };

  return (
    <Card className="w-full bg-white">
      <CardHeader>
        <CardTitle className="text-2xl">Request a Quote</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Requester Details Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary">Requester Details</h3>
              
              <FormField
                control={form.control}
                name="requesterType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Requester Type *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select requester type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Occupational Therapist">Occupational Therapist</SelectItem>
                        <SelectItem value="Case Manager">Case Manager</SelectItem>
                        <SelectItem value="Private Client">Private Client</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="requesterName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Your full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="requesterOrganisation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Organisation</FormLabel>
                      <FormControl>
                        <Input placeholder="Your organisation" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="requesterEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="your@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="requesterPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="0412 345 678" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Client Details Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary">Client Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="clientName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Client's full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="clientNdisNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>NDIS Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Optional" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fundingType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Funding Type *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select funding type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="NDIS">NDIS</SelectItem>
                          <SelectItem value="HCP">HCP</SelectItem>
                          <SelectItem value="CHSP">CHSP</SelectItem>
                          <SelectItem value="Self-funded">Self-funded</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="urgency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Urgency *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select urgency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Routine">Routine</SelectItem>
                          <SelectItem value="Urgent (within 7 days)">Urgent (within 7 days)</SelectItem>
                          <SelectItem value="Critical (within 48 hours)">Critical (within 48 hours)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="deliveryAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Delivery Address *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter full delivery address"
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Clinical Context Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary">Clinical Context</h3>
              
              <FormField
                control={form.control}
                name="clinicalContext"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Clinical Context / Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any clinical context or additional notes..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Basket Summary */}
            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <h4 className="font-semibold text-primary">Basket Summary</h4>
              {state.items.length === 0 ? (
                <p className="text-sm text-muted-foreground">No items in basket</p>
              ) : (
                <div className="space-y-2">
                  {state.items.map((item, index) => (
                    <div key={index} className="text-sm">
                      • {item.productName} {item.variantSize ? `[${item.variantSize}]` : ''} {item.variantColor ? `- ${item.variantColor}` : ''} x{item.quantity}
                      {item.unitPrice ? ` @ $${item.unitPrice}` : ' @ TBC'}
                    </div>
                  ))}
                  <p className="text-sm font-medium pt-2 border-t">
                    Total items: {state.items.reduce((sum, item) => sum + item.quantity, 0)}
                  </p>
                  <p className="text-xs text-muted-foreground italic">
                    Prices are indicative only and subject to final Supply Ministry review.
                  </p>
                </div>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full bg-[#7E5CF1] hover:bg-[#6B4CD8]" 
              size="lg"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting Quote...
                </>
              ) : (
                'Submit Quote'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default EnhancedQuoteForm;