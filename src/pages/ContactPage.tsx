import React, { useState } from 'react';
import { Mail, Phone, MessageSquare, ArrowUpRight, Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    honeypot: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<{ id: string; message: string } | null>(null);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.fullName.trim()) {
      errs.fullName = 'Please enter your name.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errs.email = 'Please enter your email address.';
    } else if (!emailRegex.test(formData.email.trim())) {
      errs.email = 'Please provide a valid email format.';
    }

    if (!formData.subject.trim()) {
      errs.subject = 'Please enter a subject.';
    }

    if (!formData.message.trim()) {
      errs.message = 'Please enter your message.';
    } else if (formData.message.trim().length < 10) {
      errs.message = 'Message must be at least 10 characters long.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit message.');
      }

      setSuccessInfo({
        id: data.messageId || 'MSG-CONFIRMED',
        message: data.message || 'Your message has been received.',
      });
    } catch (err: any) {
      setSubmitError(err.message || 'An error occurred while sending your message.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      honeypot: '',
    });
    setSuccessInfo(null);
    setErrors({});
    setSubmitError(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16 pb-28 bg-white text-neutral-900">
      {/* Header */}
      <div className="max-w-2xl space-y-4">
        <div className="text-xs font-mono uppercase tracking-wider text-neutral-500">
          Contact and Inquiries
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-neutral-950">
          Get in Touch Directly
        </h1>
        <p className="text-base text-neutral-600 leading-relaxed">
          Have an inquiry, technical question, or partnership idea? Reach out directly via phone, WhatsApp, or through the encrypted message form below.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Direct Contact Cards */}
        <div className="lg:col-span-5 space-y-4">
          {/* Email Card */}
          <a
            href="mailto:userjatin2007@gmail.com"
            className="p-6 rounded-xl bg-white border border-neutral-200 hover:border-neutral-400 transition-colors block group shadow-xs"
          >
            <div className="flex items-center justify-between text-neutral-500 mb-3">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider">
                <Mail className="w-4 h-4 text-neutral-700" />
                <span>Primary Email</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-950 transition-colors" />
            </div>
            <div className="text-base font-semibold text-neutral-950 truncate">
              userjatin2007@gmail.com
            </div>
            <p className="text-xs text-neutral-600 mt-1">
              For project specifications, technical documentation, and formal quotes.
            </p>
          </a>

          {/* WhatsApp Card */}
          <a
            href="https://wa.me/919571103757"
            target="_blank"
            rel="noopener noreferrer"
            className="p-6 rounded-xl bg-white border border-neutral-200 hover:border-neutral-400 transition-colors block group shadow-xs"
          >
            <div className="flex items-center justify-between text-neutral-500 mb-3">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider">
                <MessageSquare className="w-4 h-4 text-neutral-700" />
                <span>Instant Messaging</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-950 transition-colors" />
            </div>
            <div className="text-base font-semibold text-neutral-950">
              WhatsApp (+91 9571103757)
            </div>
            <p className="text-xs text-neutral-600 mt-1">
              Fastest channel for quick questions, scheduling calls, and urgent maintenance.
            </p>
          </a>

          {/* Phone Call Card */}
          <a
            href="tel:+919571103757"
            className="p-6 rounded-xl bg-white border border-neutral-200 hover:border-neutral-400 transition-colors block group shadow-xs"
          >
            <div className="flex items-center justify-between text-neutral-500 mb-3">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider">
                <Phone className="w-4 h-4 text-neutral-700" />
                <span>Direct Voice Call</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-950 transition-colors" />
            </div>
            <div className="text-base font-semibold text-neutral-950">
              +91 9571103757
            </div>
            <p className="text-xs text-neutral-600 mt-1">
              Available during business hours (IST) for voice discussions.
            </p>
          </a>

          <div className="p-5 rounded-lg border border-neutral-200 bg-neutral-50 text-xs text-neutral-600 space-y-2">
            <span className="font-semibold text-neutral-950 block">Response Commitment</span>
            <p>
              I personally respond to all client inquiries within 24 to 48 business hours. For complex projects, submitting the project application form ensures comprehensive review of your requirements.
            </p>
          </div>
        </div>

        {/* Right Column: Contact Message Form */}
        <div className="lg:col-span-7">
          <div className="p-8 sm:p-10 rounded-xl bg-white border border-neutral-200 shadow-xs">
            {successInfo ? (
              <div className="space-y-6 text-center py-8">
                <CheckCircle className="w-12 h-12 text-neutral-900 mx-auto" />
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-neutral-950">Message Stored Successfully</h3>
                  <p className="text-xs text-neutral-600 max-w-md mx-auto">
                    {successInfo.message}
                  </p>
                </div>
                <div className="p-4 rounded bg-neutral-50 border border-neutral-200 inline-block text-xs font-mono text-neutral-800">
                  Message Reference: {successInfo.id}
                </div>
                <div className="pt-4">
                  <button
                    onClick={handleReset}
                    className="px-5 py-2 text-xs font-semibold text-white bg-neutral-950 rounded hover:bg-neutral-800 transition-colors cursor-pointer shadow-xs"
                  >
                    Send Another Message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-neutral-950">Send a Direct Message</h2>
                  <p className="text-xs text-neutral-500 mt-1">
                    Your inquiry is saved directly in the backend database.
                  </p>
                </div>

                {submitError && (
                  <div className="p-3 rounded bg-red-50 border border-red-200 text-red-900 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}

                {/* Honeypot trap */}
                <input
                  type="text"
                  name="website_trap"
                  value={formData.honeypot}
                  onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-800 mb-1.5">
                      Your Name <span className="text-neutral-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => {
                        setFormData({ ...formData, fullName: e.target.value });
                        if (errors.fullName) setErrors({ ...errors, fullName: '' });
                      }}
                      placeholder="Jane Doe"
                      className={`w-full px-3.5 py-2.5 bg-neutral-50 border rounded text-xs text-neutral-900 placeholder-neutral-400 focus:bg-white focus:outline-none transition-colors ${
                        errors.fullName
                          ? 'border-red-500 focus:border-red-400'
                          : 'border-neutral-300 focus:border-neutral-900'
                      }`}
                    />
                    {errors.fullName && (
                      <p className="text-[11px] text-red-600 mt-1">{errors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-800 mb-1.5">
                      Your Email <span className="text-neutral-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (errors.email) setErrors({ ...errors, email: '' });
                      }}
                      placeholder="jane@company.com"
                      className={`w-full px-3.5 py-2.5 bg-neutral-50 border rounded text-xs text-neutral-900 placeholder-neutral-400 focus:bg-white focus:outline-none transition-colors ${
                        errors.email
                          ? 'border-red-500 focus:border-red-400'
                          : 'border-neutral-300 focus:border-neutral-900'
                      }`}
                    />
                    {errors.email && (
                      <p className="text-[11px] text-red-600 mt-1">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-800 mb-1.5">
                      Phone Number <span className="text-neutral-500 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91..."
                      className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded text-xs text-neutral-900 placeholder-neutral-400 focus:bg-white focus:outline-none focus:border-neutral-900 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-800 mb-1.5">
                      Subject <span className="text-neutral-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => {
                        setFormData({ ...formData, subject: e.target.value });
                        if (errors.subject) setErrors({ ...errors, subject: '' });
                      }}
                      placeholder="e.g. Inquiry regarding AI assistant development"
                      className={`w-full px-3.5 py-2.5 bg-neutral-50 border rounded text-xs text-neutral-900 placeholder-neutral-400 focus:bg-white focus:outline-none transition-colors ${
                        errors.subject
                          ? 'border-red-500 focus:border-red-400'
                          : 'border-neutral-300 focus:border-neutral-900'
                      }`}
                    />
                    {errors.subject && (
                      <p className="text-[11px] text-red-600 mt-1">{errors.subject}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-800 mb-1.5">
                    Your Message <span className="text-neutral-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => {
                      setFormData({ ...formData, message: e.target.value });
                      if (errors.message) setErrors({ ...errors, message: '' });
                    }}
                    placeholder="Describe your inquiry, project idea, or questions..."
                    className={`w-full px-3.5 py-2.5 bg-neutral-50 border rounded text-xs text-neutral-900 placeholder-neutral-400 focus:bg-white focus:outline-none transition-colors ${
                      errors.message
                        ? 'border-red-500 focus:border-red-400'
                        : 'border-neutral-300 focus:border-neutral-900'
                    }`}
                  />
                  {errors.message && (
                    <p className="text-[11px] text-red-600 mt-1">{errors.message}</p>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-6 py-2.5 text-xs font-semibold text-white bg-neutral-950 rounded hover:bg-neutral-800 disabled:bg-neutral-400 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Sending message...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
