import { ServiceItem } from '../types.ts';

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: 'web-design-development',
    title: 'Website Design and Development',
    category: 'Web Development',
    summary:
      'End-to-end custom website creation tailored to your specific operational needs, brand specifications, and technical standards.',
    scope: [
      'UI and UX system architecture tailored to user journeys',
      'Clean semantic frontend implementation using React and TypeScript',
      'Modular CSS architecture using Tailwind CSS',
      'Mobile-first responsive engineering across all breakpoints',
      'Search engine friendly structure, meta tags, and structured data',
    ],
    deliverables: [
      'Production-ready codebase with full ownership',
      'Component-based interface system',
      'Cross-browser and multi-device tested layout',
      'Optimized asset loading and web vitals compliance',
    ],
    useCases: [
      'Companies launching a new brand identity',
      'Existing websites needing a complete architectural rebuild',
      'Founders requiring a tailored web interface with custom logic',
    ],
    projectTypeKey: 'Business Website',
  },
  {
    id: 'business-portfolio-websites',
    title: 'Business and Portfolio Websites',
    category: 'Web Development',
    summary:
      'High-impact corporate websites and creative portfolios designed to establish credibility, showcase work, and capture qualified client inquiries.',
    scope: [
      'Targeted structure highlighting value propositions and past work',
      'Interactive project showcases, case studies, or service breakdown tables',
      'Inquiry capture forms with backend validation and lead forwarding',
      'Domain, DNS, and production server deployment configuration',
    ],
    deliverables: [
      'Complete multi-page or high-converting single-page website',
      'Lead and contact inquiry capture pipeline',
      'Optimized performance scores with minimal bundle overhead',
      'Documentation for updating text and project media',
    ],
    useCases: [
      'Independent consultants, designers, and creative directors',
      'Small and medium enterprises seeking reliable customer leads',
      'Software engineers and agency owners needing an authoritative portfolio',
    ],
    projectTypeKey: 'Portfolio Website',
  },
  {
    id: 'ecommerce-websites',
    title: 'E-commerce Websites',
    category: 'Web Development',
    summary:
      'Fast, secure online stores with structured product catalogs, smooth checkout experiences, and payment gateway integration.',
    scope: [
      'Product catalog structure with category, search, and filtering mechanisms',
      'Shopping cart and checkout flows optimized for conversion',
      'Secure payment gateway integration (Stripe, Razorpay, or PayPal)',
      'Order recording, customer confirmation emails, and inventory tracking',
    ],
    deliverables: [
      'Operational e-commerce storefront with SSL encryption',
      'Admin control panel or headless database integration for product management',
      'Secure webhook listeners for transaction status updates',
      'Customer order review interface',
    ],
    useCases: [
      'Direct-to-consumer physical product brands',
      'Digital goods, software licenses, or digital asset storefronts',
      'Businesses transitioning from manual WhatsApp orders to an automated shop',
    ],
    projectTypeKey: 'E-commerce Website',
  },
  {
    id: 'ai-chatbots',
    title: 'AI Chatbots',
    category: 'Artificial Intelligence',
    summary:
      'Intelligent conversational agents trained on your business knowledge base, documentation, or product catalogs to resolve user queries around the clock.',
    scope: [
      'System prompt engineering and guardrail design to prevent hallucinations',
      'Knowledge retrieval (RAG) or FAQ ingestion from documentation',
      'Embeddable web chat widget with custom branded styling',
      'Conversation session management and conversation history preservation',
    ],
    deliverables: [
      'Production-ready chat interface seamlessly embedded into your website',
      'Backend inference proxy using Google Gemini API or OpenAI API',
      'Lead capture trigger within the chat flow to hand off to human support',
      'Administration logs of user conversations',
    ],
    useCases: [
      'Customer support deflection for frequent product questions',
      'Interactive website guides helping visitors find relevant services',
      'Educational platforms providing interactive subject tutoring',
    ],
    projectTypeKey: 'AI Chatbot',
  },
  {
    id: 'custom-ai-assistants',
    title: 'Custom AI Assistants',
    category: 'Artificial Intelligence',
    summary:
      'Specialized AI-powered tools and autonomous workflows configured with custom business logic, structured outputs, and operational task execution.',
    scope: [
      'Architecture of multi-step AI reasoning and structured data extraction',
      'Integration with private documents, contracts, or database records',
      'Custom function calling and tool execution pipelines',
      'Role-based permissions and safety constraints',
    ],
    deliverables: [
      'Dedicated assistant interface with prompt management',
      'JSON-validated output pipelines connected to internal workflows',
      'Server-side API handlers with rate-limiting and authentication',
      'System prompt maintenance documentation',
    ],
    useCases: [
      'Internal research assistants summarizing legal or market documents',
      'Automated content drafting tools with strict organizational brand guidelines',
      'Customer onboarding assistants parsing user resumes, RFPs, or intake sheets',
    ],
    projectTypeKey: 'AI Assistant',
  },
  {
    id: 'ai-and-api-integrations',
    title: 'AI and API Integrations',
    category: 'Artificial Intelligence',
    summary:
      'Seamless connection of modern generative AI models and third-party APIs into your existing software stack and internal operations.',
    scope: [
      'REST and GraphQL API integration between legacy systems and modern endpoints',
      'Connecting LLM reasoning endpoints to existing databases or CRMs',
      'Authentication, token management, and secret rotation architecture',
      'Server-side caching and response streaming for optimal latency',
    ],
    deliverables: [
      'Clean backend integration layer with comprehensive error handling',
      'Typed client libraries and interface definitions',
      'Automated retry mechanisms with exponential backoff',
      'API specification and deployment instructions',
    ],
    useCases: [
      'Integrating payment, SMS, or WhatsApp APIs into existing portals',
      'Adding automated AI summaries into SaaS dashboards',
      'Connecting Google Workspace, Google Drive, or Notion APIs into workflows',
    ],
    projectTypeKey: 'API or AI Integration',
  },
  {
    id: 'automation-web-applications',
    title: 'Automation and Web Applications',
    category: 'Support & Automation',
    summary:
      'Custom full-stack web applications and background automation workflows that eliminate repetitive manual operational tasks.',
    scope: [
      'Database schema modeling for transactional data and audit records',
      'Scheduled background workers and webhook ingestion pipelines',
      'Interactive dashboard for monitoring process status and logs',
      'Automated report generation and data transformation',
    ],
    deliverables: [
      'Full-stack application deployed on modern cloud infrastructure',
      'Relational or document database configuration with backup guidelines',
      'Role-based authentication system for team access',
      'Complete technical maintenance documentation',
    ],
    useCases: [
      'Internal business management dashboards replacing complex spreadsheets',
      'Automated client onboarding portals with document verification',
      'Batch data transformation and scheduled invoice generation tools',
    ],
    projectTypeKey: 'Automation',
  },
  {
    id: 'maintenance-and-bug-fixing',
    title: 'Maintenance and Bug Fixing',
    category: 'Support & Automation',
    summary:
      'Rapid diagnostics, bug resolution, performance optimization, and regular security updates for existing web properties and web applications.',
    scope: [
      'Comprehensive code audit and root-cause error investigation',
      'Frontend layout, responsiveness, and cross-browser bug repair',
      'Backend endpoint debugging and database query optimization',
      'Dependency updates, security vulnerability patching, and SSL management',
    ],
    deliverables: [
      'Resolved issue pull requests with clean commit histories',
      'Detailed root-cause incident report and prevention guidelines',
      'Performance audit with Core Web Vitals before-and-after benchmarks',
      'Optional ongoing maintenance agreement',
    ],
    useCases: [
      'Websites broken after a package update or hosting migration',
      'Applications experiencing memory leaks, sluggish queries, or high latency',
      'Businesses requiring on-call engineering support for critical bug fixes',
    ],
    projectTypeKey: 'Bug Fixing or Maintenance',
  },
];
