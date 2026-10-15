import React from 'react';
import { SERVICES_DATA } from '../data/servicesData.ts';
import { ProjectType } from '../types.ts';
import { ArrowUpRight, Check, Layers, Target, Box } from 'lucide-react';

interface ServicesPageProps {
  onApplyForService: (projectType: ProjectType) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ onApplyForService }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20 pb-28 bg-white text-neutral-900">
      {/* Page Header */}
      <div className="max-w-3xl space-y-4">
        <div className="text-xs font-mono uppercase tracking-wider text-neutral-600 font-semibold">
          Capabilities and Scopes
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-neutral-950">
          Web Development and AI Services
        </h1>
        <p className="text-base sm:text-lg text-neutral-700 leading-relaxed">
          Comprehensive technical scopes for custom web applications, AI chatbots, automated assistants, and continuous maintenance. Pricing and timelines depend on project requirements and architectural complexity.
        </p>
        <div className="p-3.5 bg-neutral-50 border border-neutral-200 rounded text-xs text-neutral-700">
          <span className="font-semibold text-neutral-950">Transparent Pricing Notice: </span>
          I do not offer artificial fixed packages. Each project receives a tailored quote based on documented technical specifications.
        </div>
      </div>

      {/* Services List */}
      <div className="space-y-12">
        {SERVICES_DATA.map((service, index) => (
          <div
            key={service.id}
            id={service.id}
            className="p-8 sm:p-10 rounded-xl bg-white border border-neutral-200 hover:border-neutral-400 transition-all space-y-8 shadow-xs"
          >
            {/* Top row: Number, Category, Title, Apply CTA */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-neutral-100">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-neutral-400 font-semibold">
                    {String(index + 1).padStart(2, '0')}.
                  </span>
                  <span className="text-xs font-mono uppercase tracking-wider text-neutral-500">
                    {service.category}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-neutral-950 tracking-tight">
                  {service.title}
                </h2>
                <p className="text-sm text-neutral-600 max-w-2xl leading-relaxed">
                  {service.summary}
                </p>
              </div>

              <div className="shrink-0 flex items-center">
                <button
                  onClick={() => onApplyForService(service.projectTypeKey)}
                  className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-white bg-neutral-950 rounded hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <span>Apply for This Service</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Service Details Grid: Scope, Deliverables, Use Cases */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-xs">
              {/* Scope */}
              <div className="space-y-3">
                <div className="flex items-center gap-1.5 font-semibold text-neutral-950">
                  <Layers className="w-4 h-4 text-neutral-600" />
                  <span>Engineering Scope</span>
                </div>
                <ul className="space-y-2 text-neutral-600 leading-relaxed">
                  {service.scope.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-neutral-400 mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Deliverables */}
              <div className="space-y-3">
                <div className="flex items-center gap-1.5 font-semibold text-neutral-950">
                  <Box className="w-4 h-4 text-neutral-600" />
                  <span>Key Deliverables</span>
                </div>
                <ul className="space-y-2 text-neutral-600 leading-relaxed">
                  {service.deliverables.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-neutral-800 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Suitable Use Cases */}
              <div className="space-y-3">
                <div className="flex items-center gap-1.5 font-semibold text-neutral-950">
                  <Target className="w-4 h-4 text-neutral-600" />
                  <span>Suitable Use Cases</span>
                </div>
                <ul className="space-y-2 text-neutral-600 leading-relaxed">
                  {service.useCases.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-neutral-400 mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="p-8 rounded-xl bg-neutral-50 border border-neutral-200 text-center space-y-4">
        <h3 className="text-xl font-bold text-neutral-950">Have a Unique or Custom Project Specification?</h3>
        <p className="text-sm text-neutral-600 max-w-xl mx-auto">
          If your project combines multiple disciplines or involves custom APIs, fill out the project application form with your specific needs.
        </p>
        <div className="pt-2">
          <button
            onClick={() => onApplyForService('Custom Project')}
            className="px-6 py-2.5 text-xs font-semibold text-white bg-neutral-950 rounded hover:bg-neutral-800 transition-colors cursor-pointer shadow-xs"
          >
            Submit Custom Project Application
          </button>
        </div>
      </div>
    </div>
  );
};
