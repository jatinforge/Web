export type ApplicationStatus =
  | 'New'
  | 'Reviewing'
  | 'Need More Information'
  | 'Accepted'
  | 'In Progress'
  | 'Completed'
  | 'Declined';

export type ProjectType =
  | 'Business Website'
  | 'Portfolio Website'
  | 'E-commerce Website'
  | 'AI Chatbot'
  | 'AI Assistant'
  | 'API or AI Integration'
  | 'Automation'
  | 'Bug Fixing or Maintenance'
  | 'Custom Project';

export interface ProjectApplication {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  companyName?: string;
  projectType: ProjectType;
  projectDescription: string;
  budget: string;
  timeline: string;
  existingWebsite?: string;
  referenceWebsites?: string;
  preferredContactMethod?: 'Email' | 'WhatsApp' | 'Phone';
  additionalRequirements?: string;
  status: ApplicationStatus;
  internalNotes: string;
  consentGiven: boolean;
  consentTimestamp: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactMessage {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface ServiceItem {
  id: string;
  title: string;
  category: 'Web Development' | 'Artificial Intelligence' | 'Support & Automation';
  summary: string;
  scope: string[];
  deliverables: string[];
  useCases: string[];
  projectTypeKey: ProjectType;
}

export interface StatusHistoryItem {
  id: string;
  applicationId: string;
  previousStatus: ApplicationStatus;
  newStatus: ApplicationStatus;
  changedBy: string;
  note?: string;
  timestamp: string;
}

export interface AuditLogItem {
  id: string;
  action: string;
  details: string;
  ipAddress?: string;
  timestamp: string;
}

export interface DatabaseStats {
  status: 'healthy' | 'degraded';
  storagePath: string;
  fileSizeBytes: number;
  fileSizeFormatted: string;
  totalApplications: number;
  totalMessages: number;
  totalStatusTransitions: number;
  totalAuditLogs: number;
  statusBreakdown: Record<ApplicationStatus, number>;
  lastUpdated: string;
}

export type PageRoute =
  | 'home'
  | 'services'
  | 'start-project'
  | 'about'
  | 'contact'
  | 'privacy'
  | 'terms'
  | 'admin';

