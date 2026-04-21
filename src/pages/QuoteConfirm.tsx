import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SEO from '@/components/SEO';
import EditorialNavigation from '@/components/editorial/EditorialNavigation';

const QuoteConfirm: React.FC = () => {
  const [searchParams] = useSearchParams();
  const quoteRef = searchParams.get('ref');

  return (
    <div className="min-h-screen bg-cream text-ink">
      <SEO 
        title="Quote Submitted"
        description="Your quote request has been submitted successfully. Our team will respond within 24 hours with a tailored assistive technology solution."
        noindex={true}
      />
      <EditorialNavigation />
      
      <main className="container mx-auto px-6 py-16">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-cream-alt border-cream-border shadow-sm">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <CheckCircle className="w-20 h-20 text-gold" />
              </div>
              <h1 className="text-3xl md:text-4xl font-geist font-light tracking-tight leading-[1.05] text-ink">
                Quote <span className="italic text-gold">submitted</span>.
              </h1>
            </CardHeader>
            
            <CardContent className="space-y-6 text-center">
              {quoteRef && (
                <div className="bg-cream border border-cream-border p-6 rounded-lg">
                  <p className="text-sm text-muted-body mb-2">Your Reference Number</p>
                  <p className="text-3xl font-geist font-light tracking-tight leading-[1.05] text-ink">{quoteRef}</p>
                </div>
              )}
              
              <div className="space-y-3 text-left">
                <h3 className="font-geist font-light tracking-tight leading-[1.05] text-xl text-ink">What happens next?</h3>
                <ul className="space-y-2 text-muted-body">
                  <li className="flex items-start">
                    <span className="mr-2 text-gold">✓</span>
                    <span>You'll receive a confirmation email shortly</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-gold">✓</span>
                    <span>Our team will review your request and confirm pricing</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-gold">✓</span>
                    <span>We'll be in touch within 1-2 business days</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-gold">✓</span>
                    <span>For urgent requests, we'll prioritize your quote</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-cream border border-cream-border p-4 rounded-lg text-left">
                <p className="text-sm text-ink">
                  <strong className="text-ink">Note:</strong> Prices shown are indicative only. Final pricing may be affected by freight, installation requirements, and site-specific considerations.
                </p>
              </div>
              
              <div className="pt-6 space-y-3">
                <Link to="/products" className="block">
                  <Button className="w-full bg-ink text-cream hover:opacity-90 rounded-full" size="lg">
                    Browse More Products
                  </Button>
                </Link>
                <Link to="/" className="block">
                  <Button variant="outline" className="w-full rounded-full border-ink/20 text-ink hover:bg-ink hover:text-cream" size="lg">
                    Return to Home
                  </Button>
                </Link>
              </div>
              
              <div className="pt-6 border-t border-cream-border">
                <p className="text-sm text-muted-body">
                  Questions? Contact us at{' '}
                  <a href="mailto:david@supplyministry.com.au" className="text-ink underline decoration-gold underline-offset-4 hover:decoration-ink">
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
