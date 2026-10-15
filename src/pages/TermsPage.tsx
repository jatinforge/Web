import React from 'react';
import { AlertTriangle, FileText } from 'lucide-react';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 pb-28 text-neutral-700 bg-white">
      {/* Header */}
      <div className="space-y-4">
        <div className="text-xs font-mono uppercase tracking-wider text-neutral-500">
          Contractual Framework
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-neutral-950">
          Terms and Conditions
        </h1>
        <p className="text-xs text-neutral-500 font-mono">
          Last Updated: October 15, 2026 · Practice of Jatin Mehra
        </p>
      </div>

      {/* Owner confirmation banner */}
      <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-300 text-xs text-neutral-800 flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-neutral-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-semibold text-neutral-950 block">Notice Regarding Commercial Terms</span>
          <p>
            These Terms govern preliminary project inquiries and standard development agreements. Concrete project scopes, payment milestones, and warranty windows are formalized in individual Statement of Work (SOW) documents executed between Jatin Mehra and the client.
          </p>
        </div>
      </div>

      {/* Main Terms Sections */}
      <div className="space-y-10 text-sm leading-relaxed border-t border-neutral-200 pt-8">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-neutral-950">1. Scope of Services</h2>
          <p>
            Jatin Mehra provides professional software engineering, website design and development, custom AI chatbots, AI assistant implementation, API integration, and web application maintenance. All services are performed as an independent contractor according to specifications agreed upon in writing.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-neutral-950">2. Project Inquiries and Formal Quotes</h2>
          <p>
            Submission of a project application via this website constitutes a request for proposal and does not create a binding development contract. A formal engagement begins only after both parties agree to a written Statement of Work (SOW) detailing technical deliverables, pricing, and project milestones.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-neutral-950">3. Client Responsibilities and Asset Provision</h2>
          <p>
            Timely project delivery depends upon active client cooperation. Clients are responsible for:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs text-neutral-700">
            <li>Providing necessary text copy, brand guidelines, product media, and domain credentials in a timely manner.</li>
            <li>Reviewing milestone deliverables and providing consolidated feedback within agreed-upon review windows (typically 3 to 5 business days).</li>
            <li>Ensuring that all supplied logos, images, trademarks, and text do not infringe upon any third-party copyrights or licenses.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-neutral-950">4. Revision Policy and Scope Changes</h2>
          <p>
            Standard projects include a defined number of revision cycles (specified in the project SOW) during design and prototype phases. Additional feature requests, architectural changes, or substantial deviations from the approved specification will be evaluated as separate change requests subject to adjusted timelines and quotes.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-neutral-950">5. Third-Party APIs, Software and Hosting Services</h2>
          <p>
            Web applications and AI systems frequently depend on third-party services, including cloud hosting providers (e.g. Google Cloud, AWS), database services, SMS and payment gateways (Stripe, Razorpay), and AI inference providers (Google Gemini API, OpenAI API).
          </p>
          <p className="text-xs text-neutral-500">
            Clients maintain direct billing and accounts for such third-party services. Jatin Mehra is not liable for third-party service outages, API deprecations, rate limits, or upstream policy changes beyond our reasonable control.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-neutral-950">6. Intellectual Property and Code Ownership</h2>
          <p>
            Upon full settlement of all agreed-upon project invoices, complete ownership of the custom application source code, designs, and database schemas created specifically for the project is transferred to the client.
          </p>
          <p className="text-xs text-neutral-500">
            Standard open-source libraries, frameworks, and reusable utility modules remain licensed under their respective open-source licenses (MIT, Apache 2.0).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-neutral-950">7. Warranty, Bug Fixing and Post-Launch Support</h2>
          <p>
            Completed projects include a standard 14 to 30 day warranty period following production launch to address any reproducible bugs or functional defects violating the agreed specification, at no additional charge. Ongoing feature updates and server maintenance are covered under separate monthly retainer agreements.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-neutral-950">8. Project Cancellation and Milestone Settlements</h2>
          <p>
            Either party may terminate an engagement with written notice. In the event of cancellation, the client is invoiced strictly for verified work completed and milestones reached up to the date of notice. Completed work up to the paid milestone will be delivered to the client.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-neutral-950">9. Limitations of Liability</h2>
          <p>
            To the maximum extent permitted by applicable Indian law, Jatin Mehra shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or loss of profits, data, or business opportunities arising from the use or inability to use the developed software. The total cumulative liability under any engagement shall not exceed the total fees paid by the client for that specific project.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-neutral-950">10. Contact Information</h2>
          <p>
            For questions regarding these Terms or formal contract inquiries:
          </p>
          <div className="p-4 rounded bg-neutral-50 border border-neutral-200 text-xs font-mono text-neutral-800">
            <div>Jatin Mehra · Web Development and AI Solutions</div>
            <div>Email: userjatin2007@gmail.com</div>
            <div>Phone or WhatsApp: +91 9571103757</div>
            <div>Jurisdiction: Rajasthan, India</div>
          </div>
        </section>
      </div>
    </div>
  );
};
