import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Link } from "react-router-dom";
import EditorialNavigation from "@/components/editorial/EditorialNavigation";

const SupportAtHome = () => {
  return (
    <div className="min-h-screen flex flex-col bg-violet text-cream">
      <SEO
        title="Support at Home Equipment Solutions"
        description="Supply Ministry works with OTs, case managers and coordinators to identify available funding, optimise equipment decisions and move cases forward while SAH approvals are in progress."
      />
      <EditorialNavigation />

      <main id="main-content" className="flex-1">
        {/* Heading area */}
        <section className="bg-violet text-cream py-16 md:py-20">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <p className="font-geist text-[11px] tracking-[0.18em] uppercase text-cream/60 mb-4">
              Support at home
            </p>
            <h1 className="text-3xl md:text-5xl font-geist font-light tracking-tight leading-[1.05] text-cream leading-[1.1]">
              Support at <span className="italic text-gold">home</span>. Equipment can't wait for approvals to catch up.
            </h1>
          </div>
        </section>

        {/* Body content */}
        <section className="py-12 md:py-16 bg-cream text-ink">
          <div className="max-w-3xl mx-auto px-6 lg:px-8 space-y-6">
            <p className="text-muted-body leading-relaxed">
              The Support at Home program was meant to simplify how older Australians access the equipment they need. In practice, it has stretched the gap between a clinical recommendation and anything actually arriving. Cases sit in assessment queues, approvals move through layers of review, and the person waiting for a pressure care mattress or a mobility aid is still waiting.
            </p>

            <p className="text-muted-body leading-relaxed">
              For OTs, case managers, and community care coordinators, the delay creates real pressure. You know what your client needs, the clinical reasoning is sound, but the system hasn't caught up. Meanwhile the risk sits with the client, and the paperwork sits with you.
            </p>

            <p className="text-muted-body leading-relaxed">
              That gap is where Supply Ministry works. We sit down with whoever is managing the case, whether that's an OT, a coordinator, or a provider, and look at what funding the client already has access to right now. From there we help map how that funding applies to the equipment that's needed, and we move things forward rather than waiting for the SAH process to run its course.
            </p>

            <p className="text-muted-body leading-relaxed">
              This isn't about replacing the formal approval pathway. It's about making sure clients aren't left without equipment while that pathway takes its time. If there is existing funding that can be directed toward the right solution today, we help make that happen cleanly and with proper documentation.
            </p>

            {/* Sleep Choice connection */}
            <p className="text-muted-body leading-relaxed">
              Where the clinical decision is still open, particularly around sleep systems and pressure care, a 7‑night in‑home trial through{" "}
              <a
                href="https://sleepchoice.com.au"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink underline decoration-gold underline-offset-4 hover:decoration-ink transition-colors"
              >
                Sleep Choice
              </a>{" "}
              confirms the right setup before any supply commitment is made. That keeps the recommendation evidence‑based and the funding conversation straightforward. You can also read more about how the program works on our{" "}
              <Link
                to="/sleep-choice"
                className="text-ink underline decoration-gold underline-offset-4 hover:decoration-ink transition-colors"
              >
                Sleep Choice page
              </Link>.
            </p>
          </div>
        </section>

        {/* Contact prompt */}
        <section className="bg-cream-alt py-10 md:py-12">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <p className="text-muted-body leading-relaxed">
              If you have a case where the equipment need is clear but the funding pathway is slow, get in touch. We're happy to look at what's possible.{" "}
              <a
                href="mailto:david@supplyministry.com.au"
                className="text-ink underline decoration-gold underline-offset-4 hover:decoration-ink transition-colors"
              >
                david@supplyministry.com.au
              </a>
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default SupportAtHome;
