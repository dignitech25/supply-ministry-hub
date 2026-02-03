import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Navigation from '@/components/Navigation';
import SEO from '@/components/SEO';

const QuoteConfirm: React.FC = () => {
  const [searchParams] = useSearchParams();
  const quoteRef = searchParams.get('ref');

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Quote Submitted"
        description="Your quote request has been submitted successfully. Our team will respond within 24 hours with a tailored assistive technology quote."
      />
      <Navigation />
      
      <main className="container mx-auto px-6 py-16">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-white shadow-lg">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <CheckCircle className="w-20 h-20 text-green-500" />
              </div>
              <CardTitle className="text-3xl text-primary">Quote Submitted Successfully!</CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6 text-center">
              {quoteRef && (
                <div className="bg-muted/50 p-6 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Your Reference Number</p>
                  <p className="text-3xl font-bold text-[#7E5CF1]">{quoteRef}</p>
                </div>
              )}
              
              <div className="space-y-3 text-left">
                <h3 className="font-semibold text-lg text-primary">What happens next?</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>You'll receive a confirmation email shortly</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>Our team will review your request and confirm pricing</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>We'll be in touch within 1-2 business days</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>For urgent requests, we'll prioritize your quote</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-left">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Prices shown are indicative only. Final pricing may be affected by freight, installation requirements, and site-specific considerations.
                </p>
              </div>
              
              <div className="pt-6 space-y-3">
                <Link to="/products" className="block">
                  <Button className="w-full bg-[#7E5CF1] hover:bg-[#6B4CD8]" size="lg">
                    Browse More Products
                  </Button>
                </Link>
                <Link to="/" className="block">
                  <Button variant="outline" className="w-full" size="lg">
                    Return to Home
                  </Button>
                </Link>
              </div>
              
              <div className="pt-6 border-t">
                <p className="text-sm text-muted-foreground">
                  Questions? Contact us at{' '}
                  <a href="mailto:david@supplyministry.com.au" className="text-[#7E5CF1] hover:underline">
                    david@supplyministry.com.au
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default QuoteConfirm;
