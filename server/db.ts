import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

export type ApplicationStatus =
  | 'New'
  | 'Reviewing'
  | 'Need More Information'
  | 'Accepted'
  | 'In Progress'
  | 'Completed'
  | 'Declined';

export interface ProjectApplication {
  id: string; // e.g. JM-2026-A1B2
  fullName: string;
  email: string;
  phone?: string;
  companyName?: string;
  projectType: string;
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

export interface StatusHistoryItem {
  id: string;
  applicationId: string;
  previousStatus: ApplicationStatus;
  newStatus: ApplicationStatus;
  changedBy: string;
  note?: string;
  timestamp: string;
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

export interface AuditLogItem {
  id: string;
  action: string;
  details: string;
  ipAddress?: string;
  timestamp: string;
}

interface AdminSession {
  sessionId: string;
  createdAt: number;
  expiresAt: number;
}

interface AdminAuth {
  setupCompleted: boolean;
  passwordHash?: string;
  salt?: string;
  updatedAt?: string;
}

interface DatabaseSchema {
  applications: ProjectApplication[];
  statusHistory: StatusHistoryItem[];
  messages: ContactMessage[];
  auditLogs: AuditLogItem[];
  admin: AdminAuth;
  sessions: Record<string, AdminSession>;
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

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'agency_database.json');

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.ensureDirectory();
    this.data = this.loadDatabase();
    this.bootstrapAdminFromEnv();
    this.ensureSeedDataIfEmpty();
  }

  private ensureDirectory() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private loadDatabase(): DatabaseSchema {
    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        // Ensure all arrays exist for backwards-compatibility migrations
        if (!Array.isArray(parsed.applications)) parsed.applications = [];
        if (!Array.isArray(parsed.statusHistory)) parsed.statusHistory = [];
        if (!Array.isArray(parsed.messages)) parsed.messages = [];
        if (!Array.isArray(parsed.auditLogs)) parsed.auditLogs = [];
        if (!parsed.admin) parsed.admin = { setupCompleted: false };
        if (!parsed.sessions || typeof parsed.sessions !== 'object') parsed.sessions = {};
        return parsed;
      } catch (err) {
        console.error('Failed to parse database file, initializing fresh:', err);
      }
    }

    const initial: DatabaseSchema = {
      applications: [],
      statusHistory: [],
      messages: [],
      auditLogs: [],
      admin: {
        setupCompleted: false,
      },
      sessions: {},
    };
    this.saveImmediate(initial);
    return initial;
  }

  private saveImmediate(dataToSave: DatabaseSchema) {
    try {
      const tempPath = `${DB_FILE}.${Date.now()}.tmp`;
      fs.writeFileSync(tempPath, JSON.stringify(dataToSave, null, 2), 'utf-8');
      fs.renameSync(tempPath, DB_FILE);
    } catch (err) {
      console.error('Failed to save database atomically:', err);
    }
  }

  private save() {
    this.saveImmediate(this.data);
  }

  private bootstrapAdminFromEnv() {
    const envPassword = process.env.ADMIN_PASSWORD;
    if (envPassword && !this.data.admin.setupCompleted) {
      this.setAdminPassword(envPassword);
      console.log('Admin password initialized from ADMIN_PASSWORD env variable.');
    }
  }

  public hashPassword(password: string, salt: string): string {
    return crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  }

  public isAdminSetup(): boolean {
    return this.data.admin.setupCompleted;
  }

  public setAdminPassword(password: string): boolean {
    if (!password || password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = this.hashPassword(password, salt);
    this.data.admin = {
      setupCompleted: true,
      passwordHash: hash,
      salt: salt,
      updatedAt: new Date().toISOString(),
    };
    this.addAuditLog('ADMIN_SECURITY', 'Master administrative password configured or updated.');
    this.save();
    return true;
  }

  public verifyAdminPassword(password: string): boolean {
    if (!this.data.admin.setupCompleted || !this.data.admin.passwordHash || !this.data.admin.salt) {
      return false;
    }
    const hash = this.hashPassword(password, this.data.admin.salt);
    return crypto.timingSafeEqual(
      Buffer.from(hash, 'utf-8'),
      Buffer.from(this.data.admin.passwordHash, 'utf-8')
    );
  }

  public createSession(): string {
    this.cleanExpiredSessions();
    const sessionId = crypto.randomBytes(32).toString('hex');
    const now = Date.now();
    const expiresAt = now + 7 * 24 * 60 * 60 * 1000; // 7 days

    this.data.sessions[sessionId] = {
      sessionId,
      createdAt: now,
      expiresAt,
    };
    this.addAuditLog('SESSION_CREATED', 'Admin session authenticated successfully.');
    this.save();
    return sessionId;
  }

  public validateSession(sessionId?: string): boolean {
    if (!sessionId || !this.data.sessions[sessionId]) {
      return false;
    }
    const session = this.data.sessions[sessionId];
    if (Date.now() > session.expiresAt) {
      delete this.data.sessions[sessionId];
      this.save();
      return false;
    }
    return true;
  }

  public destroySession(sessionId?: string) {
    if (sessionId && this.data.sessions[sessionId]) {
      delete this.data.sessions[sessionId];
      this.addAuditLog('SESSION_TERMINATED', 'Admin session logged out.');
      this.save();
    }
  }

  public cleanExpiredSessions() {
    const now = Date.now();
    let modified = false;
    for (const [id, session] of Object.entries(this.data.sessions)) {
      if (now > session.expiresAt) {
        delete this.data.sessions[id];
        modified = true;
      }
    }
    if (modified) {
      this.save();
    }
  }

  // --- Audit Logging ---

  public addAuditLog(action: string, details: string, ipAddress?: string): AuditLogItem {
    const log: AuditLogItem = {
      id: `LOG-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`,
      action,
      details,
      ipAddress,
      timestamp: new Date().toISOString(),
    };
    this.data.auditLogs.unshift(log);
    // Keep last 300 logs
    if (this.data.auditLogs.length > 300) {
      this.data.auditLogs = this.data.auditLogs.slice(0, 300);
    }
    return log;
  }

  public getAuditLogs(limit = 50): AuditLogItem[] {
    return this.data.auditLogs.slice(0, limit);
  }

  // --- Project Applications ---

  private generateApplicationId(): string {
    const year = new Date().getFullYear();
    const randomHex = crypto.randomBytes(2).toString('hex').toUpperCase(); // 4 chars e.g. A3F8
    const id = `JM-${year}-${randomHex}`;
    if (this.data.applications.some((app) => app.id === id)) {
      return this.generateApplicationId();
    }
    return id;
  }

  public createApplication(input: {
    fullName: string;
    email: string;
    phone?: string;
    companyName?: string;
    projectType: string;
    projectDescription: string;
    budget: string;
    timeline: string;
    existingWebsite?: string;
    referenceWebsites?: string;
    preferredContactMethod?: 'Email' | 'WhatsApp' | 'Phone';
    additionalRequirements?: string;
    consentGiven: boolean;
  }, ipAddress?: string): ProjectApplication {
    const now = new Date().toISOString();
    const newApplication: ProjectApplication = {
      id: this.generateApplicationId(),
      fullName: input.fullName.trim(),
      email: input.email.trim().toLowerCase(),
      phone: input.phone ? input.phone.trim() : undefined,
      companyName: input.companyName ? input.companyName.trim() : undefined,
      projectType: input.projectType,
      projectDescription: input.projectDescription.trim(),
      budget: input.budget,
      timeline: input.timeline,
      existingWebsite: input.existingWebsite ? input.existingWebsite.trim() : undefined,
      referenceWebsites: input.referenceWebsites ? input.referenceWebsites.trim() : undefined,
      preferredContactMethod: input.preferredContactMethod || 'Email',
      additionalRequirements: input.additionalRequirements ? input.additionalRequirements.trim() : undefined,
      status: 'New',
      internalNotes: '',
      consentGiven: input.consentGiven,
      consentTimestamp: now,
      createdAt: now,
      updatedAt: now,
    };

    this.data.applications.unshift(newApplication);

    // Record initial status history
    this.data.statusHistory.unshift({
      id: `HIST-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`,
      applicationId: newApplication.id,
      previousStatus: 'New',
      newStatus: 'New',
      changedBy: 'System (Client Submission)',
      note: 'Application received and registered in database.',
      timestamp: now,
    });

    // Record audit log
    this.addAuditLog(
      'APPLICATION_CREATED',
      `Application ${newApplication.id} submitted by ${newApplication.fullName} (${newApplication.email}) for ${newApplication.projectType}`,
      ipAddress
    );

    this.save();
    return newApplication;
  }

  public getApplications(filter?: {
    status?: string;
    projectType?: string;
    search?: string;
  }): ProjectApplication[] {
    let list = [...this.data.applications];

    if (filter?.status && filter.status !== 'All') {
      list = list.filter((app) => app.status === filter.status);
    }

    if (filter?.projectType && filter.projectType !== 'All') {
      list = list.filter((app) => app.projectType === filter.projectType);
    }

    if (filter?.search) {
      const q = filter.search.toLowerCase().trim();
      list = list.filter(
        (app) =>
          app.id.toLowerCase().includes(q) ||
          app.fullName.toLowerCase().includes(q) ||
          app.email.toLowerCase().includes(q) ||
          (app.companyName && app.companyName.toLowerCase().includes(q)) ||
          (app.phone && app.phone.toLowerCase().includes(q))
      );
    }

    return list;
  }

  public getApplicationById(id: string): ProjectApplication | null {
    return this.data.applications.find((app) => app.id === id) || null;
  }

  public getStatusHistory(applicationId: string): StatusHistoryItem[] {
    return this.data.statusHistory.filter((h) => h.applicationId === applicationId);
  }

  public updateApplication(
    id: string,
    updates: { status?: ApplicationStatus; internalNotes?: string },
    changedBy = 'Jatin Mehra (Admin)'
  ): ProjectApplication | null {
    const index = this.data.applications.findIndex((app) => app.id === id);
    if (index === -1) return null;

    const current = this.data.applications[index];
    const previousStatus = current.status;
    const now = new Date().toISOString();

    if (updates.status !== undefined && updates.status !== previousStatus) {
      current.status = updates.status;
      // Record status transition in statusHistory
      this.data.statusHistory.unshift({
        id: `HIST-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`,
        applicationId: id,
        previousStatus: previousStatus,
        newStatus: updates.status,
        changedBy,
        note: updates.internalNotes ? 'Status updated with notes' : 'Status updated',
        timestamp: now,
      });

      this.addAuditLog(
        'APPLICATION_STATUS_UPDATED',
        `Application ${id} status transitioned from ${previousStatus} -> ${updates.status} by ${changedBy}`
      );
    }

    if (updates.internalNotes !== undefined) {
      current.internalNotes = updates.internalNotes;
      this.addAuditLog('NOTE_UPDATED', `Private internal notes modified for application ${id}`);
    }

    current.updatedAt = now;
    this.data.applications[index] = current;
    this.save();
    return current;
  }

  public deleteApplication(id: string): boolean {
    const initialLen = this.data.applications.length;
    this.data.applications = this.data.applications.filter((a) => a.id !== id);
    if (this.data.applications.length < initialLen) {
      this.data.statusHistory = this.data.statusHistory.filter((h) => h.applicationId !== id);
      this.addAuditLog('APPLICATION_DELETED', `Application ${id} permanently deleted.`);
      this.save();
      return true;
    }
    return false;
  }

  // --- Contact Messages ---

  public createContactMessage(
    input: {
      fullName: string;
      email: string;
      phone?: string;
      subject: string;
      message: string;
    },
    ipAddress?: string
  ): ContactMessage {
    const id = `MSG-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;
    const newMessage: ContactMessage = {
      id,
      fullName: input.fullName.trim(),
      email: input.email.trim().toLowerCase(),
      phone: input.phone ? input.phone.trim() : undefined,
      subject: input.subject.trim(),
      message: input.message.trim(),
      createdAt: new Date().toISOString(),
      read: false,
    };

    this.data.messages.unshift(newMessage);
    this.addAuditLog(
      'MESSAGE_RECEIVED',
      `Contact message ${id} received from ${newMessage.fullName} (${newMessage.email})`,
      ipAddress
    );
    this.save();
    return newMessage;
  }

  public getContactMessages(): ContactMessage[] {
    return [...this.data.messages];
  }

  public markMessageRead(id: string): boolean {
    const msg = this.data.messages.find((m) => m.id === id);
    if (!msg) return false;
    msg.read = true;
    this.addAuditLog('MESSAGE_READ', `Contact message ${id} marked as read.`);
    this.save();
    return true;
  }

  public deleteContactMessage(id: string): boolean {
    const initialLen = this.data.messages.length;
    this.data.messages = this.data.messages.filter((m) => m.id !== id);
    if (this.data.messages.length < initialLen) {
      this.addAuditLog('MESSAGE_DELETED', `Contact message ${id} deleted.`);
      this.save();
      return true;
    }
    return false;
  }

  // --- Database Stats, Backup & Restore ---

  public getDatabaseStats(): DatabaseStats {
    let fileSizeBytes = 0;
    try {
      if (fs.existsSync(DB_FILE)) {
        fileSizeBytes = fs.statSync(DB_FILE).size;
      }
    } catch (e) {
      // ignore
    }

    const statusCounts: Record<ApplicationStatus, number> = {
      New: 0,
      Reviewing: 0,
      'Need More Information': 0,
      Accepted: 0,
      'In Progress': 0,
      Completed: 0,
      Declined: 0,
    };

    for (const app of this.data.applications) {
      if (statusCounts[app.status] !== undefined) {
        statusCounts[app.status]++;
      }
    }

    const kb = (fileSizeBytes / 1024).toFixed(2);

    return {
      status: 'healthy',
      storagePath: DB_FILE,
      fileSizeBytes,
      fileSizeFormatted: `${kb} KB`,
      totalApplications: this.data.applications.length,
      totalMessages: this.data.messages.length,
      totalStatusTransitions: this.data.statusHistory.length,
      totalAuditLogs: this.data.auditLogs.length,
      statusBreakdown: statusCounts,
      lastUpdated: new Date().toISOString(),
    };
  }

  public createBackup(): DatabaseSchema {
    this.addAuditLog('BACKUP_EXPORTED', 'Full database snapshot exported.');
    this.save();
    return JSON.parse(JSON.stringify(this.data));
  }

  public restoreBackup(imported: any): { success: boolean; message: string } {
    if (!imported || typeof imported !== 'object') {
      return { success: false, message: 'Invalid database backup structure.' };
    }

    if (!Array.isArray(imported.applications) || !Array.isArray(imported.messages)) {
      return {
        success: false,
        message: 'Backup must contain valid applications and messages arrays.',
      };
    }

    this.data.applications = imported.applications;
    this.data.messages = imported.messages;
    this.data.statusHistory = Array.isArray(imported.statusHistory) ? imported.statusHistory : [];
    this.data.auditLogs = Array.isArray(imported.auditLogs) ? imported.auditLogs : [];

    if (imported.admin && imported.admin.setupCompleted) {
      this.data.admin = imported.admin;
    }

    this.addAuditLog('BACKUP_RESTORED', `Database restored from imported backup file.`);
    this.save();
    return { success: true, message: 'Database restored successfully.' };
  }

  public ensureSeedDataIfEmpty() {
    if (this.data.applications.length === 0) {
      this.seedRealisticSamples();
    }
  }

  public seedRealisticSamples(): number {
    const samples: Omit<ProjectApplication, 'id' | 'createdAt' | 'updatedAt'>[] = [
      {
        fullName: 'Vikramaditya Singhania',
        email: 'vikram@singhaniatech.in',
        phone: '+91 98290 88211',
        companyName: 'Singhania Logistics & Supply',
        projectType: 'AI Chatbot',
        projectDescription:
          'We require an enterprise customer support AI chatbot that connects to our consignment tracking API and answers freight inquiries for 4,000+ drivers and shipping clients.',
        budget: '₹1,00,000 - ₹2,50,000 / $1,200 - $3,000 (Full-Scale AI Assistant / Custom Platform)',
        timeline: 'Standard (2-4 weeks)',
        existingWebsite: 'https://singhania-logistics.in',
        referenceWebsites: 'https://intercom.com, https://linear.app',
        preferredContactMethod: 'WhatsApp',
        additionalRequirements:
          'Must support Hindi and English bilingual queries with automated fallback to human dispatchers.',
        status: 'In Progress',
        internalNotes:
          'Architecture approved. RAG embeddings generated for shipping manuals. API webhook integrated with their staging fleet database.',
        consentGiven: true,
        consentTimestamp: new Date(Date.now() - 4 * 86400000).toISOString(),
      },
      {
        fullName: 'Dr. Ananya Roy',
        email: 'ananya.roy@pulsehealth.org',
        phone: '+91 97112 34509',
        companyName: 'Pulse Clinical Systems',
        projectType: 'AI Assistant',
        projectDescription:
          'Custom medical intake assistant that parses incoming PDF pathology test sheets and extracts critical biometric ranges into structured JSON format for our doctor review queue.',
        budget: '₹1,00,000 - ₹2,50,000 / $1,200 - $3,000 (Full-Scale AI Assistant / Custom Platform)',
        timeline: '1 to 2 months',
        referenceWebsites: 'https://anthropic.com, https://healthgorilla.com',
        preferredContactMethod: 'Email',
        additionalRequirements:
          'Zero data retention on public LLM endpoints; must comply with Indian health information privacy guidelines.',
        status: 'Reviewing',
        internalNotes:
          'Initial scoping call scheduled for Friday 3 PM. Testing Gemini 2.5 Flash document extraction with structured JSON schemas.',
        consentGiven: true,
        consentTimestamp: new Date(Date.now() - 2 * 86400000).toISOString(),
      },
      {
        fullName: 'Rohan Mehra',
        email: 'rohan@amberartisans.com',
        phone: '+91 94140 55902',
        companyName: 'Amber Heritage Crafts',
        projectType: 'E-commerce Website',
        projectDescription:
          'D2C online store for handcrafted leather goods and brass decor. We need fast product page load times, Razorpay payment gateway integration, and shipping weight calculation.',
        budget: '₹50,000 - ₹1,00,000 / $600 - $1,200 (Custom Web App / E-commerce / AI Chatbot)',
        timeline: 'Standard (2-4 weeks)',
        existingWebsite: 'https://amberartisans.com',
        referenceWebsites: 'https://hardgraft.com, https://lelabofragrances.com',
        preferredContactMethod: 'WhatsApp',
        additionalRequirements:
          'Mobile checkout must be frictionless; majority of our buyers come via Instagram ads.',
        status: 'Accepted',
        internalNotes:
          'Deposit received. Wireframes approved on Figma. Beginning component build in React + Tailwind with Razorpay checkout modal.',
        consentGiven: true,
        consentTimestamp: new Date(Date.now() - 1 * 86400000).toISOString(),
      },
      {
        fullName: 'Marcus Vance',
        email: 'm.vance@vancestudio.design',
        phone: '+1 415 802 9940',
        companyName: 'Vance Architecture Studio',
        projectType: 'Portfolio Website',
        projectDescription:
          'High-contrast minimalist architecture portfolio featuring full-bleed project photo galleries, project floorplan blueprints, and an inquiry contact sheet.',
        budget: '₹50,000 - ₹1,00,000 / $600 - $1,200 (Custom Web App / E-commerce / AI Chatbot)',
        timeline: 'Urgent (Within 1-2 weeks)',
        referenceWebsites: 'https://snarkitecture.com, https://davidchipperfield.com',
        preferredContactMethod: 'Email',
        additionalRequirements:
          'Must achieve 98+ Google Lighthouse Performance score with WebP optimized photography.',
        status: 'Completed',
        internalNotes:
          'Delivered and deployed on client custom domain. Lighthouse score 99. Client signed off and full invoice settled.',
        consentGiven: true,
        consentTimestamp: new Date(Date.now() - 14 * 86400000).toISOString(),
      },
    ];

    let count = 0;
    for (const sample of samples) {
      if (!this.data.applications.some((a) => a.email === sample.email)) {
        const id = this.generateApplicationId();
        const createdTime = sample.consentTimestamp;
        const appRecord: ProjectApplication = {
          ...sample,
          id,
          createdAt: createdTime,
          updatedAt: createdTime,
        };
        this.data.applications.push(appRecord);

        this.data.statusHistory.push({
          id: `HIST-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`,
          applicationId: id,
          previousStatus: 'New',
          newStatus: sample.status,
          changedBy: 'Admin (Jatin Mehra)',
          note: sample.internalNotes,
          timestamp: createdTime,
        });

        count++;
      }
    }

    if (count > 0) {
      this.addAuditLog('DATABASE_SEEDED', `Seeded ${count} realistic benchmark project applications.`);
      this.save();
    }

    return count;
  }

  // --- CSV Export ---

  public exportApplicationsCSV(): string {
    const headers = [
      'Application ID',
      'Created At',
      'Status',
      'Client Name',
      'Email',
      'Phone',
      'Company Name',
      'Project Type',
      'Budget',
      'Timeline',
      'Preferred Contact Method',
      'Existing Website',
      'Reference Websites',
      'Project Description',
      'Additional Requirements',
      'Internal Notes',
    ];

    const escapeCSV = (val: string | undefined | null) => {
      if (!val) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = this.data.applications.map((app) => [
      escapeCSV(app.id),
      escapeCSV(app.createdAt),
      escapeCSV(app.status),
      escapeCSV(app.fullName),
      escapeCSV(app.email),
      escapeCSV(app.phone),
      escapeCSV(app.companyName),
      escapeCSV(app.projectType),
      escapeCSV(app.budget),
      escapeCSV(app.timeline),
      escapeCSV(app.preferredContactMethod),
      escapeCSV(app.existingWebsite),
      escapeCSV(app.referenceWebsites),
      escapeCSV(app.projectDescription),
      escapeCSV(app.additionalRequirements),
      escapeCSV(app.internalNotes),
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }
}

export const db = new Database();
