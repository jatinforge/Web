import React, { useState, useEffect } from 'react';
import { PageRoute, ProjectType } from './types.ts';
import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { HomePage } from './pages/HomePage.tsx';
import { ServicesPage } from './pages/ServicesPage.tsx';
import { StartProjectPage } from './pages/StartProjectPage.tsx';
import { AboutPage } from './pages/AboutPage.tsx';
import { ContactPage } from './pages/ContactPage.tsx';
import { PrivacyPage } from './pages/PrivacyPage.tsx';
import { TermsPage } from './pages/TermsPage.tsx';
import { AdminDashboard } from './pages/AdminDashboard.tsx';

function getRouteFromPath(pathname: string): PageRoute {
  const clean = pathname.replace(/^\/+/, '').split('/')[0] || '';
  switch (clean) {
    case 'services':
      return 'services';
    case 'start-project':
    case 'apply':
      return 'start-project';
    case 'about':
      return 'about';
    case 'contact':
      return 'contact';
    case 'privacy':
    case 'privacy-policy':
      return 'privacy';
    case 'terms':
    case 'terms-and-conditions':
      return 'terms';
    case 'admin':
    case 'dashboard':
      return 'admin';
    default:
      return 'home';
  }
}

function getPathFromRoute(route: PageRoute): string {
  switch (route) {
    case 'services':
      return '/services';
    case 'start-project':
      return '/start-project';
    case 'about':
      return '/about';
    case 'contact':
      return '/contact';
    case 'privacy':
      return '/privacy-policy';
    case 'terms':
      return '/terms';
    case 'admin':
      return '/admin';
    default:
      return '/';
  }
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageRoute>(() => {
    return getRouteFromPath(window.location.pathname);
  });

  const [selectedServiceForApply, setSelectedServiceForApply] = useState<ProjectType | undefined>(
    undefined
  );

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPage(getRouteFromPath(window.location.pathname));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (page: PageRoute) => {
    setCurrentPage(page);
    const targetPath = getPathFromRoute(page);
    if (window.location.pathname !== targetPath) {
      window.history.pushState({}, '', targetPath);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleApplyForService = (projectType: ProjectType) => {
    setSelectedServiceForApply(projectType);
    navigateTo('start-project');
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col font-sans selection:bg-neutral-200 selection:text-neutral-900">
      <Navbar currentPage={currentPage} onNavigate={navigateTo} />

      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            onNavigate={navigateTo}
            onSelectService={(serviceTitle) => handleApplyForService(serviceTitle as ProjectType)}
          />
        )}

        {currentPage === 'services' && (
          <ServicesPage onApplyForService={handleApplyForService} />
        )}

        {currentPage === 'start-project' && (
          <StartProjectPage
            initialProjectType={selectedServiceForApply}
            onNavigate={navigateTo}
          />
        )}

        {currentPage === 'about' && <AboutPage onNavigate={navigateTo} />}

        {currentPage === 'contact' && <ContactPage />}

        {currentPage === 'privacy' && <PrivacyPage />}

        {currentPage === 'terms' && <TermsPage />}

        {currentPage === 'admin' && <AdminDashboard />}
      </main>

      <Footer onNavigate={navigateTo} />
    </div>
  );
}
