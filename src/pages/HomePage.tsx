import React from 'react';
import { PageRoute } from '../types.ts';
import { ArrowUpRight, ArrowRight, CheckCircle2, Shield, Code2, Cpu, Wrench } from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: PageRoute) => void;
  onSelectService: (serviceKey: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onSelectService }) => {
  const serviceHighlights = [
    {
      id: 'web-design-development',
      title: 'Website Design and Development',
      category: 'Web Development',
      desc: 'Bespoke web applications built from scratch with clean TypeScript, modern frameworks, and responsive layouts.',
      icon: Code2,
    },
    {
      id: 'business-portfolio-websites',
      title: 'Business and Portfolio Sites',
      category: 'Web Development',
      desc: 'Fast, authoritative digital presence crafted to present your work and capture inbound customer inquiries.',
      icon: CheckCircle2,
    },
    {
      id: 'ecommerce-websites',
      title: 'E-commerce Solutions',
      category: 'Web Development',
      desc: 'High-converting online stores with clean catalog browsing, secure payments, and order tracking.',
      icon: ArrowUpRight,
    },
    {
      id: 'ai-chatbots',
      title: 'AI Chatbots',
      category: 'Artificial Intelligence',
      desc: 'Domain-specific conversational agents trained on your business documents to resolve user questions 24/7.',
      icon: Cpu,
    },
    {
      id: 'custom-ai-assistants',
      title: 'Custom AI Assistants',
      category: 'Artificial Intelligence',
      desc: 'Specialized reasoning tools and structured data extractors customized for your specific operational workflow.',
      icon: Cpu,
    },
    {
      id: 'automation-web-applications',
      title: 'Automation and Custom Web Apps',
      category: 'Support & Automation',
      desc: 'Full-stack internal tools and background automation pipelines that eliminate manual repetitive tasks.',
      icon: Wrench,
    },
  ];

  const processSteps = [
    {
      step: '01',
      title: 'Requirements and Scoping',
      desc: 'We define the technical specifications, user journeys, data requirements, and deliverable milestones in plain language.',
    },
    {
      step: '02',
      title: 'Architecture and Design',
      desc: 'Drafting data models, interface wireframes, and API contracts to ensure a stable foundation before coding begins.',
    },
    {
      step: '03',
      title: 'Full-Stack Engineering',
      desc: 'Writing clean, typed frontend code, secure backend routes, and database schemas with zero unnecessary dependencies.',
    },
    {
      step: '04',
      title: 'Testing and Hardening',
      desc: 'Verifying responsiveness, edge-case form validation, cross-browser compatibility, and server security.',
    },
    {
      step: '05',
      title: 'Deployment and Handover',
      desc: 'Configuring production DNS, SSL certificates, database backups, and delivering full source code ownership.',
    },
  ];

  return (
    <div className="space-y-24 pb-20 bg-white text-neutral-900">
      {/* Hero Section */}
      <section className="pt-12 sm:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-700 border border-neutral-300 px-3.5 py-1.5 rounded bg-neutral-50 font-medium">
              <span className="w-1.5 h-1.5 bg-neutral-900"></span>
              <span>Jatin Mehra · Web Development and AI Services</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-950 leading-[1.12]">
              Web Development and AI Solutions Built Around Your Business
            </h1>

            <p className="text-base sm:text-lg text-neutral-700 leading-relaxed max-w-2xl">
              Custom websites, full-stack web applications, AI chatbots, and automated workflows. Direct engineering collaboration with Jatin Mehra from initial architecture through production deployment.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onNavigate('start-project')}
                className="px-6 py-3 text-sm font-semibold text-white bg-neutral-950 rounded hover:bg-neutral-800 transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <span>Start a Project</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('services')}
                className="px-6 py-3 text-sm font-semibold text-neutral-900 bg-white border border-neutral-300 rounded hover:bg-neutral-50 transition-colors cursor-pointer"
              >
                View Services
              </button>
            </div>

            {/* Direct contact indicators */}
            <div className="pt-6 border-t border-neutral-200 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs text-neutral-600">
              <div>
                <span className="block text-neutral-900 font-semibold">Business Owner</span>
                <span>Jatin Mehra</span>
              </div>
              <div>
                <span className="block text-neutral-900 font-semibold">Direct Inquiries</span>
                <span>+91 9571103757</span>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="block text-neutral-900 font-semibold">Email</span>
                <span className="truncate block">userjatin2007@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="lg:col-span-5">
            <div className="relative border border-neutral-200 rounded-lg overflow-hidden bg-neutral-50 shadow-sm">
              <img
                src="/src/assets/images/hero_minimal_workspace_1792060923728.jpg"
                alt="Minimalist engineering workstation setup for Jatin Mehra"
                className="w-full h-auto object-cover aspect-[16/10]"
                loading="eager"
              />
              <div className="p-4 bg-white border-t border-neutral-200 flex items-center justify-between text-xs text-neutral-600">
                <span className="font-mono text-neutral-900 font-medium">Engineering Studio</span>
                <span>Custom Architecture and Clean Code</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-6 border-b border-neutral-200">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-neutral-500">Capabilities</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-950 mt-1">Core Service Offerings</h2>
          </div>
          <button
            onClick={() => onNavigate('services')}
            className="text-sm text-neutral-700 hover:text-neutral-950 flex items-center gap-1 font-semibold transition-colors cursor-pointer"
          >
            <span>Explore all 8 services in detail</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {serviceHighlights.map((svc) => (
            <div
              key={svc.id}
              className="p-6 rounded-lg bg-white border border-neutral-200 hover:border-neutral-400 transition-colors flex flex-col justify-between shadow-xs"
            >
              <div className="space-y-3">
                <div className="text-xs font-mono text-neutral-500 uppercase tracking-wider">
                  {svc.category}
                </div>
                <h3 className="text-lg font-bold text-neutral-950">{svc.title}</h3>
                <p className="text-sm text-neutral-600 leading-relaxed">{svc.desc}</p>
              </div>

              <div className="pt-6 mt-6 border-t border-neutral-100 flex items-center justify-between">
                <button
                  onClick={() => onSelectService(svc.title)}
                  className="text-xs font-semibold text-neutral-950 hover:text-neutral-700 flex items-center gap-1 cursor-pointer"
                >
                  <span>Apply for this service</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Visual Engineering Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          <div className="p-8 rounded-lg bg-neutral-50 border border-neutral-200 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-mono text-neutral-500 uppercase">Architecture and Frontend</span>
              <h3 className="text-xl font-bold text-neutral-950">Engineered For Performance and Maintainability</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Every application is engineered with explicit data types, strict server validation, and clean component modularity. We do not use fragile no-code builders that inflate page weights or lock your business into proprietary platforms.
              </p>
            </div>
            <div className="mt-6 rounded overflow-hidden border border-neutral-200 bg-white">
              <img
                src="/src/assets/images/service_web_dev_1792060924468.jpg"
                alt="Clean modern software architecture diagrams"
                className="w-full h-56 object-cover"
                loading="lazy"
              />
            </div>
          </div>

          <div className="p-8 rounded-lg bg-neutral-50 border border-neutral-200 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-mono text-neutral-500 uppercase">AI Systems and APIs</span>
              <h3 className="text-xl font-bold text-neutral-950">Domain-Grounded Intelligence and Workflows</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Connect generative models to your internal databases, customer intake pipelines, and support workflows. Structured schema outputs and strict system guardrails ensure reliable, hallucination-resistant execution.
              </p>
            </div>
            <div className="mt-6 rounded overflow-hidden border border-neutral-200 bg-white">
              <img
                src="/src/assets/images/service_ai_solutions_1792060925391.jpg"
                alt="AI model integration and data flow visualization"
                className="w-full h-56 object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* The Project Process */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <span className="text-xs font-mono uppercase tracking-wider text-neutral-500">Execution Framework</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-950 mt-1">How We Deliver Your Project</h2>
          <p className="text-sm text-neutral-600 mt-2 max-w-xl">
            A clear, predictable roadmap from initial requirement capture to production rollout.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {processSteps.map((step) => (
            <div
              key={step.step}
              className="p-5 rounded-lg bg-white border border-neutral-200 flex flex-col justify-between space-y-4 shadow-xs"
            >
              <div>
                <div className="text-2xl font-mono font-bold text-neutral-400 mb-2">
                  {step.step}
                </div>
                <h4 className="text-sm font-bold text-neutral-950 mb-2">{step.title}</h4>
                <p className="text-xs text-neutral-600 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose a Custom-Built Solution */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-xl bg-neutral-50 border border-neutral-200 space-y-8">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-neutral-500">Engineering Comparison</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-950 mt-1">Why Choose a Custom Solution?</h2>
            <p className="text-sm text-neutral-600 mt-2 max-w-2xl leading-relaxed">
              When business operations depend on a digital presence, generic templates and proprietary site builders introduce bloat, recurring fees, and strict limitations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-neutral-950 font-semibold text-sm">
                <Shield className="w-4 h-4 text-neutral-700" />
                <span>Full Source Code Ownership</span>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed">
                You receive the complete Git repository, database scripts, and configuration files. No vendor lock-in or recurring platform licensing traps.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-neutral-950 font-semibold text-sm">
                <Cpu className="w-4 h-4 text-neutral-700" />
                <span>Bespoke AI Architecture</span>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Integrate real AI endpoints directly into your existing business logic instead of paying for one-size-fits-all third-party SaaS wrappers.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-neutral-950 font-semibold text-sm">
                <Code2 className="w-4 h-4 text-neutral-700" />
                <span>Lean, High-Performance Code</span>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Clean asset loading, minimal JavaScript overhead, and fast server responses that rank better in search and convert visitors more reliably.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-xl bg-neutral-900 border border-neutral-800 text-center space-y-6 text-white">
          <h2 className="text-2xl sm:text-4xl font-bold max-w-2xl mx-auto">
            Ready to Discuss Your Web or AI Requirements?
          </h2>
          <p className="text-sm sm:text-base text-neutral-300 max-w-xl mx-auto leading-relaxed">
            Submit a project application detailing your timeline and specifications. Every submission is directly reviewed by Jatin Mehra.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onNavigate('start-project')}
              className="px-6 py-3 text-sm font-semibold text-neutral-950 bg-white rounded hover:bg-neutral-200 transition-colors cursor-pointer"
            >
              Start a Project Application
            </button>
            <a
              href="https://wa.me/919571103757"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 text-sm font-semibold text-white bg-neutral-800 border border-neutral-700 rounded hover:bg-neutral-700 transition-colors"
            >
              Chat on WhatsApp (+91 9571103757)
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
