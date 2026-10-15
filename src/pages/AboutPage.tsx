import React from 'react';
import { PageRoute } from '../types.ts';
import { ArrowRight, Mail, Phone, MessageSquare, Terminal, CheckCircle2, Layers } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (page: PageRoute) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20 pb-28 bg-white text-neutral-900">
      {/* Bio Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6">
          <div className="text-xs font-mono uppercase tracking-wider text-neutral-500">
            About the Practice
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-neutral-950 leading-tight">
            Direct Full-Stack Engineering and AI Solutions
          </h1>
          <p className="text-base sm:text-lg text-neutral-700 leading-relaxed">
            I am Jatin Mehra, an independent full-stack developer focusing on building practical, high-performance websites, AI chatbots, and custom digital solutions for startups, businesses, and creators.
          </p>
          <p className="text-sm text-neutral-600 leading-relaxed">
            Unlike traditional digital marketing agencies that outsource development to junior subcontractors or rely on bloated website builder templates, I handle technical architecture and implementation directly. When you work with me, you collaborate directly with the developer writing your application code, configuring your database, and deploying your servers.
          </p>

          <div className="pt-2 flex flex-wrap gap-4">
            <button
              onClick={() => onNavigate('start-project')}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-neutral-950 rounded hover:bg-neutral-800 transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <span>Discuss Your Project</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="mailto:userjatin2007@gmail.com"
              className="px-5 py-2.5 text-xs font-semibold text-neutral-900 bg-white border border-neutral-300 rounded hover:bg-neutral-50 transition-colors flex items-center gap-2"
            >
              <Mail className="w-3.5 h-3.5 text-neutral-600" />
              <span>userjatin2007@gmail.com</span>
            </a>
          </div>
        </div>

        {/* Studio Image */}
        <div className="lg:col-span-5">
          <div className="rounded-xl overflow-hidden border border-neutral-200 bg-neutral-50 shadow-sm">
            <img
              src="/src/assets/images/jatin_studio_space_1792060925282.jpg"
              alt="Jatin Mehra engineering studio setup"
              className="w-full h-auto object-cover aspect-[4/3]"
              loading="lazy"
            />
            <div className="p-4 bg-white border-t border-neutral-200 text-xs text-neutral-600 flex items-center justify-between">
              <span className="font-medium text-neutral-900">Jatin Mehra Studio</span>
              <span className="font-mono text-neutral-500">Independent Software Practice</span>
            </div>
          </div>
        </div>
      </div>

      {/* Engineering Principles */}
      <div className="space-y-8">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-neutral-500">Philosophy</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-950 mt-1">Core Working Principles</h2>
          <p className="text-sm text-neutral-600 mt-2 max-w-2xl">
            A direct, honest approach to software engineering and client collaboration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-lg bg-white border border-neutral-200 space-y-3 shadow-xs">
            <div className="flex items-center gap-2 text-neutral-950 font-semibold text-sm">
              <CheckCircle2 className="w-4 h-4 text-neutral-800" />
              <span>Type-Safe, Maintainable Code</span>
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Every system is built using modern TypeScript, standard frameworks, and clean modular component boundaries. Codebases are organized so they can be easily maintained and scaled in the future.
            </p>
          </div>

          <div className="p-6 rounded-lg bg-white border border-neutral-200 space-y-3 shadow-xs">
            <div className="flex items-center gap-2 text-neutral-950 font-semibold text-sm">
              <Layers className="w-4 h-4 text-neutral-800" />
              <span>Purpose-Built AI, Not Buzzwords</span>
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed">
              AI should not just be a marketing label. I integrate LLM capabilities where they solve concrete problems: answering client questions using real business knowledge, extracting structured data, or automating repetitive administrative steps.
            </p>
          </div>

          <div className="p-6 rounded-lg bg-white border border-neutral-200 space-y-3 shadow-xs">
            <div className="flex items-center gap-2 text-neutral-950 font-semibold text-sm">
              <Terminal className="w-4 h-4 text-neutral-800" />
              <span>Transparent Delivery and Handover</span>
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Clients receive regular development updates, milestone verification builds, and complete source code repositories with comprehensive setup documentation.
            </p>
          </div>
        </div>
      </div>

      {/* Technology & Tooling */}
      <div className="p-8 sm:p-10 rounded-xl bg-neutral-50 border border-neutral-200 space-y-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-neutral-500">Technical Foundation</span>
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-950 mt-1">Primary Technology Stack</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs">
          <div>
            <h4 className="font-semibold text-neutral-950 mb-2">Frontend</h4>
            <ul className="space-y-1.5 text-neutral-600">
              <li>TypeScript</li>
              <li>React 19 / Vite</li>
              <li>Tailwind CSS</li>
              <li>Semantic HTML5 and Accessible UX</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-neutral-950 mb-2">Backend and APIs</h4>
            <ul className="space-y-1.5 text-neutral-600">
              <li>Node.js and Express</li>
              <li>RESTful Architecture</li>
              <li>Server-side Validation</li>
              <li>Webhooks and Scheduled Workers</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-neutral-950 mb-2">AI and Language Models</h4>
            <ul className="space-y-1.5 text-neutral-600">
              <li>Google Gemini API (@google/genai)</li>
              <li>OpenAI API</li>
              <li>Structured JSON Extraction</li>
              <li>RAG and Knowledge Retrieval</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-neutral-950 mb-2">Data and Deployment</h4>
            <ul className="space-y-1.5 text-neutral-600">
              <li>Persistent Databases (PostgreSQL / SQLite)</li>
              <li>Cloud Run / VPS / Vercel</li>
              <li>Domain DNS and SSL Hardening</li>
              <li>Git Version Control</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Direct Contact Banner */}
      <div className="p-8 rounded-xl bg-white border border-neutral-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-neutral-950">Have a specific question or custom requirement?</h3>
          <p className="text-xs text-neutral-600">
            Reach out via email, phone, or WhatsApp for an initial discussion.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href="tel:+919571103757"
            className="px-4 py-2 text-xs font-semibold text-neutral-900 bg-white border border-neutral-300 rounded hover:bg-neutral-50 transition-colors flex items-center gap-1.5"
          >
            <Phone className="w-3.5 h-3.5 text-neutral-600" />
            <span>+91 9571103757</span>
          </a>
          <a
            href="https://wa.me/919571103757"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 text-xs font-semibold text-white bg-neutral-950 rounded hover:bg-neutral-800 transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
};
