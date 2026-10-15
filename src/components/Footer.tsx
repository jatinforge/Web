import React from 'react';
import { PageRoute } from '../types.ts';
import { Mail, Phone, MessageSquare, ArrowUpRight, ShieldCheck, FileText, Lock } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: PageRoute) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-neutral-50 border-t border-neutral-200 text-neutral-600 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Column 1: Brand & Bio */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-neutral-950 text-white flex items-center justify-center font-mono text-xs font-bold">
                JM
              </span>
              <span className="text-neutral-950 font-bold tracking-tight text-base">Jatin Mehra</span>
            </div>
            <p className="text-xs leading-relaxed text-neutral-600">
              Web development, bespoke AI assistants, and automation solutions engineered around your business requirements.
            </p>
            <div className="pt-2 text-xs text-neutral-500">
              <span>Independent Engineering Practice</span>
              <span className="block mt-1">Rajasthan, India</span>
            </div>
          </div>

          {/* Column 2: Services Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">Services</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('services')}
                  className="hover:text-neutral-950 transition-colors text-left"
                >
                  Website Design and Development
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('services')}
                  className="hover:text-neutral-950 transition-colors text-left"
                >
                  Business and Portfolio Websites
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('services')}
                  className="hover:text-neutral-950 transition-colors text-left"
                >
                  E-commerce Development
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('services')}
                  className="hover:text-neutral-950 transition-colors text-left"
                >
                  AI Chatbots and Custom Assistants
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('services')}
                  className="hover:text-neutral-950 transition-colors text-left"
                >
                  Automation and Bug Fixing
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Navigation & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">Navigation & Policies</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-neutral-950 transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-neutral-950 transition-colors"
                >
                  About Jatin Mehra
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('start-project')}
                  className="hover:text-neutral-950 transition-colors"
                >
                  Start a Project Application
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('privacy')}
                  className="hover:text-neutral-950 transition-colors flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Privacy Policy</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('terms')}
                  className="hover:text-neutral-950 transition-colors flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Terms and Conditions</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Direct Inquiries */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">Direct Contact</h4>
            <p className="text-xs text-neutral-600">
              Open to client projects, technical scoping calls, and consultations.
            </p>
            <div className="space-y-2 text-xs pt-1">
              <a
                href="mailto:userjatin2007@gmail.com"
                className="flex items-center gap-2 text-neutral-800 hover:text-neutral-950 transition-colors"
              >
                <Mail className="w-3.5 h-3.5 shrink-0 text-neutral-500" />
                <span className="truncate">userjatin2007@gmail.com</span>
              </a>
              <a
                href="tel:+919571103757"
                className="flex items-center gap-2 text-neutral-800 hover:text-neutral-950 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 shrink-0 text-neutral-500" />
                <span>+91 9571103757</span>
              </a>
              <a
                href="https://wa.me/919571103757"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-neutral-800 hover:text-neutral-950 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5 shrink-0 text-neutral-500" />
                <span>Chat on WhatsApp</span>
                <ArrowUpRight className="w-3 h-3 text-neutral-400" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright and Owner Portal */}
        <div className="pt-8 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div>
            © {new Date().getFullYear()} Jatin Mehra. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={() => onNavigate('privacy')}
              className="hover:text-neutral-800 transition-colors"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => onNavigate('terms')}
              className="hover:text-neutral-800 transition-colors"
            >
              Terms and Conditions
            </button>
            <button
              onClick={() => onNavigate('admin')}
              className="hover:text-neutral-900 transition-colors flex items-center gap-1 text-neutral-500"
              title="Restricted Owner Dashboard"
            >
              <Lock className="w-3 h-3" />
              <span>Owner Portal</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
