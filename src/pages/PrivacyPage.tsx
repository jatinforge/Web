import React from 'react';
import { ShieldCheck, Mail, AlertTriangle } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 pb-28 text-neutral-700 bg-white">
      {/* Header */}
      <div className="space-y-4">
        <div className="text-xs font-mono uppercase tracking-wider text-neutral-500">
          Legal and Compliance
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-neutral-950">
          Privacy Policy
        </h1>
        <p className="text-xs text-neutral-500 font-mono">
          Effective Date: October 15, 2026 · Practice of Jatin Mehra
        </p>
      </div>

      {/* Pre-launch owner review callout */}
      <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-300 text-xs text-neutral-800 flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-neutral-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-semibold text-neutral-950 block">Pre-Launch Notice for Owner</span>
          <p>
            This policy outlines personal data handling for web development and AI services operated by Jatin Mehra. Please review and confirm your exact hosting regions, domain registrars, and any third-party analytics before deploying publicly.
          </p>
        </div>
      </div>

      {/* Policy Content */}
      <div className="space-y-10 text-sm leading-relaxed border-t border-neutral-200 pt-8">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-neutral-950">1. Scope and Controller</h2>
          <p>
            This Privacy Policy applies to personal data collected through this website, project application forms, and related technical communications operated by <strong>Jatin Mehra</strong> (referred to as "I", "me", or "the practice"), located in Rajasthan, India.
          </p>
          <p>
            For any privacy inquiries or requests to exercise data rights, the direct data controller contact is:
          </p>
          <div className="p-4 rounded bg-neutral-50 border border-neutral-200 text-xs font-mono text-neutral-800">
            <div>Data Controller: Jatin Mehra</div>
            <div>Email: userjatin2007@gmail.com</div>
            <div>Phone: +91 9571103757</div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-neutral-950">2. Information Collected Through Forms</h2>
          <p>
            I collect information directly from you when you submit a project application or contact message:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs text-neutral-700">
            <li><strong>Identity and Contact Details:</strong> Full name, email address, and optional phone or WhatsApp number.</li>
            <li><strong>Business and Project Information:</strong> Company name, project type, project description, budget expectations, target timelines, reference websites, and operational requirements.</li>
            <li><strong>Consent Record:</strong> Cryptographic timestamp recording your acknowledgment of this policy upon form submission.</li>
            <li><strong>Technical Telemetry:</strong> Standard server access logs (IP address, user-agent) strictly for security rate-limiting and anti-spam verification.</li>
          </ul>
          <p className="text-xs text-neutral-500">
            I do not collect passwords, payment card details, national identification numbers, or unnecessary sensitive personal categories.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-neutral-950">3. Why Information Is Collected (Purpose of Processing)</h2>
          <p>
            Your information is processed strictly for legitimate contractual and pre-contractual purposes:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs text-neutral-700">
            <li>To evaluate your project requirements and prepare a detailed scoping document or proposal.</li>
            <li>To communicate with you via your preferred channel (Email, WhatsApp, or Phone).</li>
            <li>To prevent automated spam, abuse, and brute-force submission attempts against the server infrastructure.</li>
            <li>To maintain internal project history and ongoing technical support records if we enter into an engineering agreement.</li>
          </ul>
          <p className="font-semibold text-neutral-950 text-xs">
            I do not sell, rent, monetize, or lease your personal information to third-party data brokers or advertising networks.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-neutral-950">4. Data Storage, Security and Access Controls</h2>
          <p>
            Form submissions are stored in an encrypted server database with atomic write guarantees. Administrative access is restricted solely to Jatin Mehra using salted cryptographic password hashing, secure session tokens, and strict HTTP-only cookies.
          </p>
          <p>
            Internal project notes created by the owner are strictly private and never exposed to the public or other clients.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-neutral-950">5. Third-Party Infrastructure and AI Providers</h2>
          <p>
            Depending on deployment configurations, certain infrastructure providers may process server requests:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs text-neutral-700">
            <li><strong>Hosting:</strong> Secure cloud server instances (e.g. Google Cloud Platform / VPS) with SSL encryption.</li>
            <li><strong>AI Inference:</strong> When testing or deploying client AI solutions, prompts and system instructions may be processed by official API endpoints (such as the Google Gemini API or OpenAI API) subject to their enterprise data privacy policies (which do not train public models on paid API data).</li>
            <li><strong>External Messaging:</strong> If you choose to contact me via WhatsApp or standard telephony, communications are subject to the privacy terms of WhatsApp LLC and your telecom carrier.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-neutral-950">6. Data Retention and Deletion Requests</h2>
          <p>
            Inquiry data is retained for the duration necessary to review and execute projects, typically up to 24 months for business correspondence and tax accounting purposes.
          </p>
          <p>
            You have the right to request access to your submitted information, correction of inaccuracies, or complete deletion of your records from the database. To submit a deletion request, email <strong>userjatin2007@gmail.com</strong> with your Application Reference ID.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-neutral-950">7. Applicable Indian Privacy Framework</h2>
          <p>
            This practice operates in India and strives to adhere to the core principles of data minimization, lawful processing, and purpose limitation established under the Digital Personal Data Protection Act, 2023 (DPDP Act) and the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-neutral-950">8. Updates to this Policy</h2>
          <p>
            This policy may be amended periodically to reflect updates in service offerings, operational infrastructure, or statutory requirements. Any revisions will be reflected on this page with an updated effective date.
          </p>
        </section>

        <div className="pt-8 border-t border-neutral-200 text-xs text-neutral-500">
          Questions or data inquiries: <a href="mailto:userjatin2007@gmail.com" className="text-neutral-950 font-semibold underline">userjatin2007@gmail.com</a> · +91 9571103757
        </div>
      </div>
    </div>
  );
};
