import React, { useState, useEffect } from 'react';
import { ProjectType, PageRoute } from '../types.ts';
import {
  Send,
  Loader2,
  CheckCircle,
  Copy,
  ExternalLink,
  MessageSquare,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';

interface StartProjectPageProps {
  initialProjectType?: ProjectType;
  onNavigate: (page: PageRoute) => void;
}

interface FormState {
  fullName: string;
  email: string;
  phone: string;
  companyName: string;
  projectType: ProjectType;
  projectDescription: string;
  budget: string;
  timeline: string;
  existingWebsite: string;
  referenceWebsites: string;
  preferredContactMethod: 'Email' | 'WhatsApp' | 'Phone';
  additionalRequirements: string;
  consentGiven: boolean;
  honeypot: string; // spam trap
}

export const StartProjectPage: React.FC<StartProjectPageProps> = ({
  initialProjectType,
  onNavigate,
}) => {
  const [formData, setFormData] = useState<FormState>({
    fullName: '',
    email: '',
    phone: '',
    companyName: '',
    projectType: initialProjectType || 'Business Website',
    projectDescription: '',
    budget: '',
    timeline: '',
    existingWebsite: '',
    referenceWebsites: '',
    preferredContactMethod: 'Email',
    additionalRequirements: '',
    consentGiven: false,
    honeypot: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submissionSuccess, setSubmissionSuccess] = useState<{
    referenceId: string;
    message: string;
    notice: string;
  } | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  useEffect(() => {
    if (initialProjectType) {
      setFormData((prev) => ({ ...prev, projectType: initialProjectType }));
    }
  }, [initialProjectType]);

  const projectTypes: ProjectType[] = [
    'Business Website',
    'Portfolio Website',
    'E-commerce Website',
    'AI Chatbot',
    'AI Assistant',
    'API or AI Integration',
    'Automation',
    'Bug Fixing or Maintenance',
    'Custom Project',
  ];

  const budgetRanges = [
    'Under ₹25,000 / < $300 (Micro / Bug Fixing)',
    '₹25,000 - ₹50,000 / $300 - $600 (Landing / Portfolio / Basic Web)',
    '₹50,000 - ₹1,00,000 / $600 - $1,200 (Custom Web App / E-commerce / AI Chatbot)',
    '₹1,00,000 - ₹2,50,000 / $1,200 - $3,000 (Full-Scale AI Assistant / Custom Platform)',
    '₹2,50,000+ / $3,000+ (Enterprise / Ongoing Technical Partnership)',
    'Flexible / Undecided',
  ];

  const timelines = [
    'Urgent (Within 1-2 weeks)',
    'Standard (2-4 weeks)',
    '1 to 2 months',
    'Flexible / Open planning',
  ];

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      errs.fullName = 'Full name is required.';
    } else if (formData.fullName.trim().length < 2) {
      errs.fullName = 'Please enter a valid full name.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!emailRegex.test(formData.email.trim())) {
      errs.email = 'Please provide a valid email address.';
    }

    if (!formData.projectType) {
      errs.projectType = 'Please select a project type.';
    }

    if (!formData.projectDescription.trim()) {
      errs.projectDescription = 'Please describe your project requirements.';
    } else if (formData.projectDescription.trim().length < 15) {
      errs.projectDescription = 'Please provide at least 15 characters describing what you need built.';
    }

    if (!formData.budget) {
      errs.budget = 'Please select an expected budget range.';
    }

    if (!formData.timeline) {
      errs.timeline = 'Please select your preferred delivery timeline.';
    }

    if (formData.existingWebsite.trim()) {
      try {
        const url = formData.existingWebsite.startsWith('http')
          ? formData.existingWebsite
          : `https://${formData.existingWebsite}`;
        const parsed = new URL(url);
        if (!parsed.hostname.includes('.')) {
          errs.existingWebsite = 'Please enter a valid domain or website URL.';
        }
      } catch {
        errs.existingWebsite = 'Please enter a valid website URL.';
      }
    }

    if (!formData.consentGiven) {
      errs.consentGiven = 'Consent to the Privacy Policy is required to submit.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validate()) {
      const firstError = document.querySelector('[data-error="true"]');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone || undefined,
          companyName: formData.companyName || undefined,
          projectType: formData.projectType,
          projectDescription: formData.projectDescription,
          budget: formData.budget,
          timeline: formData.timeline,
          existingWebsite: formData.existingWebsite || undefined,
          referenceWebsites: formData.referenceWebsites || undefined,
          preferredContactMethod: formData.preferredContactMethod,
          additionalRequirements: formData.additionalRequirements || undefined,
          consentGiven: formData.consentGiven,
          honeypot: formData.honeypot,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit project application.');
      }

      setSubmissionSuccess({
        referenceId: result.referenceId,
        message: result.message || 'Your application has been recorded.',
        notice: result.notificationNotice || 'Recorded in database.',
      });
    } catch (err: any) {
      setSubmitError(err.message || 'Network error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyReferenceId = () => {
    if (submissionSuccess?.referenceId) {
      navigator.clipboard.writeText(submissionSuccess.referenceId);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2500);
    }
  };

  const handleResetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      companyName: '',
      projectType: 'Business Website',
      projectDescription: '',
      budget: '',
      timeline: '',
      existingWebsite: '',
      referenceWebsites: '',
      preferredContactMethod: 'Email',
      additionalRequirements: '',
      consentGiven: false,
      honeypot: '',
    });
    setSubmissionSuccess(null);
    setErrors({});
    setSubmitError(null);
  };

  if (submissionSuccess) {
    const waUrl = `https://wa.me/919571103757?text=${encodeURIComponent(
      `Hello Jatin, I have submitted project application ${submissionSuccess.referenceId} (${formData.projectType}) for ${formData.fullName}.`
    )}`;

    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-white text-neutral-900">
        <div className="p-8 sm:p-12 rounded-xl bg-white border border-neutral-200 space-y-8 shadow-sm">
          <div className="flex items-center gap-3 text-neutral-950">
            <CheckCircle className="w-8 h-8 text-neutral-900 shrink-0" />
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-neutral-950">
                Application Received Successfully
              </h1>
              <p className="text-xs text-neutral-600 mt-1">
                Your project requirements have been validated and saved to the backend database.
              </p>
            </div>
          </div>

          {/* Reference ID Banner */}
          <div className="p-5 rounded-lg bg-neutral-50 border border-neutral-200 space-y-2">
            <span className="text-xs font-mono text-neutral-500 uppercase tracking-wider block">
              Official Application Reference ID
            </span>
            <div className="flex items-center justify-between gap-4">
              <span className="text-xl sm:text-2xl font-mono font-bold text-neutral-950 tracking-wider">
                {submissionSuccess.referenceId}
              </span>
              <button
                onClick={copyReferenceId}
                className="px-3.5 py-1.5 text-xs font-semibold text-neutral-900 bg-white border border-neutral-300 rounded hover:bg-neutral-50 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedId ? 'Copied' : 'Copy ID'}</span>
              </button>
            </div>
          </div>

          {/* Application Summary */}
          <div className="space-y-4 text-xs text-neutral-700 border-t border-b border-neutral-200 py-6">
            <h3 className="font-semibold text-neutral-950 uppercase tracking-wider font-mono text-xs">
              Application Summary
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-neutral-500 block">Applicant:</span>
                <span className="font-semibold text-neutral-900">{formData.fullName}</span>
              </div>
              <div>
                <span className="text-neutral-500 block">Email Address:</span>
                <span className="font-semibold text-neutral-900">{formData.email}</span>
              </div>
              <div>
                <span className="text-neutral-500 block">Service Selected:</span>
                <span className="font-semibold text-neutral-900">{formData.projectType}</span>
              </div>
              <div>
                <span className="text-neutral-500 block">Expected Budget:</span>
                <span className="font-semibold text-neutral-900">{formData.budget}</span>
              </div>
              <div>
                <span className="text-neutral-500 block">Preferred Timeline:</span>
                <span className="font-semibold text-neutral-900">{formData.timeline}</span>
              </div>
              <div>
                <span className="text-neutral-500 block">Contact Method:</span>
                <span className="font-semibold text-neutral-900">{formData.preferredContactMethod}</span>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="space-y-3 text-xs leading-relaxed text-neutral-700">
            <h3 className="font-semibold text-neutral-950 uppercase tracking-wider font-mono text-xs">
              What Happens Next?
            </h3>
            <p>
              1. <strong>Direct Review:</strong> Jatin Mehra will review the technical architecture and specifications of your project.
            </p>
            <p>
              2. <strong>Scoping Response:</strong> You will receive a direct follow-up within <strong>24 to 48 business hours</strong> via {formData.preferredContactMethod} ({formData.preferredContactMethod === 'Email' ? formData.email : formData.phone || formData.email}) with initial architectural questions, feasibility feedback, and a tailored timeline estimate.
            </p>
            <p>
              3. <strong>Urgent Inquiries:</strong> If your project has an immediate deadline, you can reference your ID <strong>{submissionSuccess.referenceId}</strong> via direct WhatsApp message.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-white bg-neutral-950 rounded hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Connect on WhatsApp with Reference ID</span>
            </a>

            <button
              onClick={handleResetForm}
              className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-neutral-800 bg-white border border-neutral-300 rounded hover:bg-neutral-50 transition-colors cursor-pointer"
            >
              Submit Another Application
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 pb-24 bg-white text-neutral-900">
      {/* Header */}
      <div className="space-y-4">
        <div className="text-xs font-mono uppercase tracking-wider text-neutral-500">
          Project Intake
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-neutral-950">
          Start a Project Application
        </h1>
        <p className="text-base text-neutral-600 leading-relaxed max-w-2xl">
          Provide your project requirements, technical constraints, and goals. Every application is reviewed directly by Jatin Mehra.
        </p>
      </div>

      {/* Global Error Banner */}
      {submitError && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-900 text-xs flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold block">Submission Error</span>
            <span>{submitError}</span>
          </div>
        </div>
      )}

      {/* Multi-Section Application Form */}
      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Anti-spam hidden honeypot */}
        <input
          type="text"
          name="website_trap"
          value={formData.honeypot}
          onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
        />

        {/* Section 1: Client Information */}
        <div className="p-8 rounded-xl bg-white border border-neutral-200 space-y-6 shadow-xs">
          <div className="border-b border-neutral-100 pb-4">
            <h2 className="text-lg font-bold text-neutral-950">1. Contact and Identity</h2>
            <p className="text-xs text-neutral-500 mt-1">
              Who will be managing this project on the client side?
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Full Name */}
            <div data-error={Boolean(errors.fullName)}>
              <label className="block text-xs font-semibold text-neutral-800 mb-2">
                Full Name <span className="text-neutral-500">*</span>
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => {
                  setFormData({ ...formData, fullName: e.target.value });
                  if (errors.fullName) setErrors({ ...errors, fullName: '' });
                }}
                placeholder="e.g. Alex Morgan"
                className={`w-full px-4 py-2.5 bg-neutral-50 border rounded text-sm text-neutral-900 placeholder-neutral-400 focus:bg-white focus:outline-none transition-colors ${
                  errors.fullName
                    ? 'border-red-500 focus:border-red-400'
                    : 'border-neutral-300 focus:border-neutral-900'
                }`}
              />
              {errors.fullName && (
                <p className="text-xs text-red-600 mt-1.5">{errors.fullName}</p>
              )}
            </div>

            {/* Email Address */}
            <div data-error={Boolean(errors.email)}>
              <label className="block text-xs font-semibold text-neutral-800 mb-2">
                Email Address <span className="text-neutral-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  if (errors.email) setErrors({ ...errors, email: '' });
                }}
                placeholder="name@company.com"
                className={`w-full px-4 py-2.5 bg-neutral-50 border rounded text-sm text-neutral-900 placeholder-neutral-400 focus:bg-white focus:outline-none transition-colors ${
                  errors.email
                    ? 'border-red-500 focus:border-red-400'
                    : 'border-neutral-300 focus:border-neutral-900'
                }`}
              />
              {errors.email && (
                <p className="text-xs text-red-600 mt-1.5">{errors.email}</p>
              )}
            </div>

            {/* Phone or WhatsApp */}
            <div>
              <label className="block text-xs font-semibold text-neutral-800 mb-2">
                Phone or WhatsApp Number <span className="text-neutral-500 font-normal">(Optional)</span>
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded text-sm text-neutral-900 placeholder-neutral-400 focus:bg-white focus:outline-none focus:border-neutral-900 transition-colors"
              />
              <span className="text-[11px] text-neutral-500 mt-1 block">
                Include country code for international communication.
              </span>
            </div>

            {/* Company or Business Name */}
            <div>
              <label className="block text-xs font-semibold text-neutral-800 mb-2">
                Business or Company Name <span className="text-neutral-500 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                placeholder="e.g. Acme Studio LLC"
                className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded text-sm text-neutral-900 placeholder-neutral-400 focus:bg-white focus:outline-none focus:border-neutral-900 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Project Specifications */}
        <div className="p-8 rounded-xl bg-white border border-neutral-200 space-y-6 shadow-xs">
          <div className="border-b border-neutral-100 pb-4">
            <h2 className="text-lg font-bold text-neutral-950">2. Project Scope and Requirements</h2>
            <p className="text-xs text-neutral-500 mt-1">
              What do you need built and what are your constraints?
            </p>
          </div>

          <div className="space-y-6">
            {/* Project Type */}
            <div data-error={Boolean(errors.projectType)}>
              <label className="block text-xs font-semibold text-neutral-800 mb-2">
                Project Type <span className="text-neutral-500">*</span>
              </label>
              <select
                value={formData.projectType}
                onChange={(e) => {
                  setFormData({ ...formData, projectType: e.target.value as ProjectType });
                  if (errors.projectType) setErrors({ ...errors, projectType: '' });
                }}
                className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded text-sm text-neutral-900 focus:bg-white focus:outline-none focus:border-neutral-900 transition-colors"
              >
                {projectTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Project Description */}
            <div data-error={Boolean(errors.projectDescription)}>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-neutral-800">
                  Project Description and Core Features <span className="text-neutral-500">*</span>
                </label>
                <span className="text-[11px] text-neutral-500 font-mono">
                  {formData.projectDescription.length} chars
                </span>
              </div>
              <textarea
                rows={5}
                value={formData.projectDescription}
                onChange={(e) => {
                  setFormData({ ...formData, projectDescription: e.target.value });
                  if (errors.projectDescription) setErrors({ ...errors, projectDescription: '' });
                }}
                placeholder="Explain what the website or AI system should accomplish. Mention specific features, target users, desired integrations, or any existing architecture."
                className={`w-full px-4 py-3 bg-neutral-50 border rounded text-sm text-neutral-900 placeholder-neutral-400 focus:bg-white focus:outline-none transition-colors ${
                  errors.projectDescription
                    ? 'border-red-500 focus:border-red-400'
                    : 'border-neutral-300 focus:border-neutral-900'
                }`}
              />
              {errors.projectDescription && (
                <p className="text-xs text-red-600 mt-1.5">{errors.projectDescription}</p>
              )}
            </div>

            {/* Budget & Timeline Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Budget Range */}
              <div data-error={Boolean(errors.budget)}>
                <label className="block text-xs font-semibold text-neutral-800 mb-2">
                  Expected Budget Range <span className="text-neutral-500">*</span>
                </label>
                <select
                  value={formData.budget}
                  onChange={(e) => {
                    setFormData({ ...formData, budget: e.target.value });
                    if (errors.budget) setErrors({ ...errors, budget: '' });
                  }}
                  className={`w-full px-4 py-2.5 bg-neutral-50 border rounded text-sm text-neutral-900 focus:bg-white focus:outline-none transition-colors ${
                    errors.budget
                      ? 'border-red-500 focus:border-red-400'
                      : 'border-neutral-300 focus:border-neutral-900'
                  }`}
                >
                  <option value="" disabled>
                    Select an expected range...
                  </option>
                  {budgetRanges.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
                {errors.budget && (
                  <p className="text-xs text-red-600 mt-1.5">{errors.budget}</p>
                )}
              </div>

              {/* Timeline */}
              <div data-error={Boolean(errors.timeline)}>
                <label className="block text-xs font-semibold text-neutral-800 mb-2">
                  Preferred Timeline <span className="text-neutral-500">*</span>
                </label>
                <select
                  value={formData.timeline}
                  onChange={(e) => {
                    setFormData({ ...formData, timeline: e.target.value });
                    if (errors.timeline) setErrors({ ...errors, timeline: '' });
                  }}
                  className={`w-full px-4 py-2.5 bg-neutral-50 border rounded text-sm text-neutral-900 focus:bg-white focus:outline-none transition-colors ${
                    errors.timeline
                      ? 'border-red-500 focus:border-red-400'
                      : 'border-neutral-300 focus:border-neutral-900'
                  }`}
                >
                  <option value="" disabled>
                    Select target completion timeframe...
                  </option>
                  {timelines.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                {errors.timeline && (
                  <p className="text-xs text-red-600 mt-1.5">{errors.timeline}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: References & Specifications */}
        <div className="p-8 rounded-xl bg-white border border-neutral-200 space-y-6 shadow-xs">
          <div className="border-b border-neutral-100 pb-4">
            <h2 className="text-lg font-bold text-neutral-950">3. Context, URLs and Preferences</h2>
            <p className="text-xs text-neutral-500 mt-1">
              Helpful context to prepare an accurate estimate and scoping document.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Existing Website URL */}
            <div data-error={Boolean(errors.existingWebsite)}>
              <label className="block text-xs font-semibold text-neutral-800 mb-2">
                Existing Website URL <span className="text-neutral-500 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={formData.existingWebsite}
                onChange={(e) => {
                  setFormData({ ...formData, existingWebsite: e.target.value });
                  if (errors.existingWebsite) setErrors({ ...errors, existingWebsite: '' });
                }}
                placeholder="https://example.com"
                className={`w-full px-4 py-2.5 bg-neutral-50 border rounded text-sm text-neutral-900 placeholder-neutral-400 focus:bg-white focus:outline-none transition-colors ${
                  errors.existingWebsite
                    ? 'border-red-500 focus:border-red-400'
                    : 'border-neutral-300 focus:border-neutral-900'
                }`}
              />
              {errors.existingWebsite && (
                <p className="text-xs text-red-600 mt-1.5">{errors.existingWebsite}</p>
              )}
            </div>

            {/* Reference Websites */}
            <div>
              <label className="block text-xs font-semibold text-neutral-800 mb-2">
                Reference Websites or Benchmark Apps <span className="text-neutral-500 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={formData.referenceWebsites}
                onChange={(e) => setFormData({ ...formData, referenceWebsites: e.target.value })}
                placeholder="e.g. stripe.com/billing, linear.app"
                className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded text-sm text-neutral-900 placeholder-neutral-400 focus:bg-white focus:outline-none focus:border-neutral-900 transition-colors"
              />
            </div>

            {/* Preferred Contact Method */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-neutral-800 mb-2">
                Preferred Contact Method for Scoping Follow-up
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['Email', 'WhatsApp', 'Phone'] as const).map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setFormData({ ...formData, preferredContactMethod: method })}
                    className={`py-2 px-3 text-xs font-semibold rounded border transition-colors cursor-pointer ${
                      formData.preferredContactMethod === method
                        ? 'bg-neutral-950 text-white border-neutral-950 shadow-xs'
                        : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            {/* Additional Requirements */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-neutral-800 mb-2">
                Additional Requirements or Constraints <span className="text-neutral-500 font-normal">(Optional)</span>
              </label>
              <textarea
                rows={3}
                value={formData.additionalRequirements}
                onChange={(e) => setFormData({ ...formData, additionalRequirements: e.target.value })}
                placeholder="Specific hosting requirements, third-party APIs (Stripe, Twilio, Gemini, Supabase), deadline milestones, or compliance needs."
                className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded text-sm text-neutral-900 placeholder-neutral-400 focus:bg-white focus:outline-none focus:border-neutral-900 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Consent & Submission */}
        <div className="p-8 rounded-xl bg-white border border-neutral-200 space-y-6 shadow-xs">
          <div data-error={Boolean(errors.consentGiven)}>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.consentGiven}
                onChange={(e) => {
                  setFormData({ ...formData, consentGiven: e.target.checked });
                  if (errors.consentGiven) setErrors({ ...errors, consentGiven: '' });
                }}
                className="mt-1 w-4 h-4 rounded bg-white border-neutral-400 text-neutral-950 focus:ring-0 cursor-pointer"
              />
              <span className="text-xs text-neutral-700 leading-relaxed">
                I agree to the processing of the provided information for the purpose of receiving a project proposal and technical scoping response. I have reviewed the{' '}
                <button
                  type="button"
                  onClick={() => onNavigate('privacy')}
                  className="underline text-neutral-950 font-semibold hover:text-neutral-700"
                >
                  Privacy Policy
                </button>
                . Your information is never sold or shared with advertisers.
              </span>
            </label>
            {errors.consentGiven && (
              <p className="text-xs text-red-600 mt-2">{errors.consentGiven}</p>
            )}
          </div>

          <div className="pt-4 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-neutral-500 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-neutral-700" />
              <span>Direct review by Jatin Mehra: Secure database storage</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-3 text-xs font-semibold text-white bg-neutral-950 rounded hover:bg-neutral-800 disabled:bg-neutral-400 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Validating and Recording...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Project Application</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
