import React, { useState } from 'react';
import { PageRoute } from '../types.ts';
import { Menu, X, ArrowUpRight } from 'lucide-react';

interface NavbarProps {
  currentPage: PageRoute;
  onNavigate: (page: PageRoute) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { label: string; page: PageRoute }[] = [
    { label: 'Home', page: 'home' },
    { label: 'Services', page: 'services' },
    { label: 'About', page: 'about' },
    { label: 'Contact', page: 'contact' },
  ];

  const handleNavClick = (page: PageRoute) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single element) */}
        <button
          onClick={() => handleNavClick('home')}
          className="text-base sm:text-lg font-bold tracking-tight text-neutral-950 hover:text-neutral-700 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 text-left cursor-pointer"
        >
          <span className="w-6 h-6 rounded bg-neutral-950 text-white flex items-center justify-center font-mono text-xs font-bold">
            JM
          </span>
          <span>Jatin Mehra</span>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-600">
          {navLinks.map((item) => {
            const isActive = currentPage === item.page;
            return (
              <button
                key={item.page}
                onClick={() => handleNavClick(item.page)}
                className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 ${
                  isActive
                    ? 'text-neutral-950 border-b-2 border-neutral-950 font-semibold'
                    : 'hover:text-neutral-950'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Action CTA */}
        <div className="hidden md:flex items-center gap-4 shrink-0">
          <button
            onClick={() => handleNavClick('start-project')}
            className="px-4 py-2 text-xs font-semibold text-white bg-neutral-950 rounded hover:bg-neutral-800 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <span>Start a Project</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden items-center gap-3">
          <button
            onClick={() => handleNavClick('start-project')}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-neutral-950 rounded hover:bg-neutral-800 transition-colors whitespace-nowrap cursor-pointer"
          >
            Start
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-neutral-600 hover:text-neutral-950 rounded border border-neutral-300"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-neutral-200 bg-white px-4 py-4 space-y-3">
          {navLinks.map((item) => (
            <button
              key={item.page}
              onClick={() => handleNavClick(item.page)}
              className={`block w-full text-left py-2 px-3 text-sm font-medium rounded transition-colors ${
                currentPage === item.page
                  ? 'bg-neutral-100 text-neutral-950 font-semibold'
                  : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-50'
              }`}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => handleNavClick('start-project')}
            className="block w-full text-center py-2.5 px-3 text-xs font-semibold text-white bg-neutral-950 rounded hover:bg-neutral-800 transition-colors"
          >
            Start a Project
          </button>
        </div>
      )}
    </header>
  );
};
