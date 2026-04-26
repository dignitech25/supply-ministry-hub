import SEO from "@/components/SEO";
import EditorialNavigation from "@/components/editorial/EditorialNavigation";
import Footer from "@/components/Footer";

const TermsConditions = () => {
  return (
    <div className="min-h-screen bg-violet text-cream">
      <SEO 
        title="Terms & Conditions"
        description="Review Supply Ministry's terms and conditions including pricing, delivery, returns policy, and privacy information for assistive technology purchases."
      />
      <EditorialNavigation />
      
      <main id="main-content" className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto bg-cream text-ink rounded-3xl p-8 md:p-12">
          <h1 className="text-4xl md:text-5xl font-geist font-light tracking-tight leading-[1.05] text-ink mb-10">
            Terms & <span className="italic text-gold">conditions</span>
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-geist font-light tracking-tight leading-[1.05] text-ink mb-4">General Terms</h2>
              <p className="text-muted-body mb-4">
                By using Supply Ministry's services, you agree to be bound by these terms and conditions. 
                These terms apply to all products and services provided by Supply Ministry.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-geist font-light tracking-tight leading-[1.05] text-ink mb-4">Products & Services</h2>
              <p className="text-muted-body mb-4">
                Supply Ministry provides assistive technology solutions, mobility aids, and related services. 
                All products are subject to availability and specifications may change without notice.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-geist font-light tracking-tight leading-[1.05] text-ink mb-4">Pricing & Payment</h2>
              <p className="text-muted-body mb-4">
                All prices are subject to change without notice. Payment terms will be specified on individual quotes. 
                Supply Ministry reserves the right to modify pricing based on market conditions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-geist font-light tracking-tight leading-[1.05] text-ink mb-4">Delivery & Returns</h2>
              <p className="text-muted-body mb-4">
                We aim to respond to quote requests within 24 hours. Delivery times vary based on supplier, location and product availability, and will be confirmed on quote.
                Returns are accepted within 30 days of delivery for unused items in original condition.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-geist font-light tracking-tight leading-[1.05] text-ink mb-4">Privacy Policy</h2>
              <h3 className="text-xl font-medium text-ink mb-3">Information Collection</h3>
              <p className="text-muted-body mb-4">
                We collect information you provide when requesting quotes, placing orders, or contacting us. 
                This may include name, contact details, organization information, and product requirements.
              </p>
              
              <h3 className="text-xl font-medium text-ink mb-3">Use of Information</h3>
              <p className="text-muted-body mb-4">
                Your information is used to provide quotes, process orders, communicate about products and services, 
                and improve our offerings. We do not sell or share personal information with third parties without consent.
              </p>
              
              <h3 className="text-xl font-medium text-ink mb-3">Data Security</h3>
              <p className="text-muted-body mb-4">
                We implement appropriate security measures to protect your personal information against unauthorized access, 
                alteration, disclosure, or destruction.
              </p>
              
              <h3 className="text-xl font-medium text-ink mb-3">Contact for Privacy Matters</h3>
              <p className="text-muted-body mb-4">
                For privacy-related questions or to access, update, or delete your personal information, 
                please contact us using the details provided on our contact page.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-geist font-light tracking-tight leading-[1.05] text-ink mb-4">Liability</h2>
              <p className="text-muted-body mb-4">
                Supply Ministry's liability is limited to the value of products or services provided. 
                We are not liable for indirect, consequential, or special damages.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-geist font-light tracking-tight leading-[1.05] text-ink mb-4">Contact Information</h2>
              <p className="text-muted-body mb-2">
                For questions about these terms and conditions, please contact:
              </p>
              <div className="bg-cream-alt border border-cream-border p-4 rounded-lg">
                <p className="text-ink">
                  <strong>Alex:</strong> alex@supplyministry.com.au | 0452 002 450<br />
                  <strong>David:</strong> david@supplyministry.com.au | 0404 593 090
                </p>
              </div>
            </section>

            <section>
              <p className="text-sm text-muted-body">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsConditions;