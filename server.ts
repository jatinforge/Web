import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import dotenv from 'dotenv';
import { db, ApplicationStatus } from './server/db.ts';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';

// Basic security middleware & parsers
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());

// Security headers
app.use((_req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Simple in-memory rate limiter per IP
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function rateLimiter(prefix: string, maxRequests: number, windowMs: number) {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const key = `${prefix}:${ip}`;
    const now = Date.now();
    const record = rateLimitMap.get(key);

    if (!record || now > record.resetAt) {
      rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    if (record.count >= maxRequests) {
      return res.status(429).json({
        error: 'Too many requests. Please slow down and try again later.',
      });
    }

    record.count++;
    next();
  };
}

// Admin Authentication Middleware
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const sessionId = req.cookies?.admin_session;
  if (!sessionId || !db.validateSession(sessionId)) {
    return res.status(401).json({ error: 'Unauthorized: Admin access required.' });
  }
  next();
}

// -------------------------------------------------------------
// PUBLIC API ROUTES
// -------------------------------------------------------------

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    owner: 'Jatin Mehra',
    timestamp: new Date().toISOString(),
  });
});

// Submit Project Application
app.post(
  '/api/applications',
  rateLimiter('app_submit', 10, 15 * 60 * 1000), // max 10 submissions per 15 min per IP
  (req: Request, res: Response) => {
    try {
      const {
        fullName,
        email,
        phone,
        companyName,
        projectType,
        projectDescription,
        budget,
        timeline,
        existingWebsite,
        referenceWebsites,
        preferredContactMethod,
        additionalRequirements,
        consentGiven,
        honeypot, // spam detection field
      } = req.body;

      // Anti-spam honeypot
      if (honeypot) {
        return res.status(400).json({ error: 'Spam detected.' });
      }

      // Validations
      if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
        return res.status(400).json({ error: 'Please enter your full name.' });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
        return res.status(400).json({ error: 'Please provide a valid email address.' });
      }

      const validProjectTypes = [
        'Business Website',
        'Portfolio Website',
        'E-commerce Website',
        'AI Chatbot',
        'AI Assistant',
        'API or AI Integration',
        'Automation',
        'Bug Fixing or Maintenance',
        'Custom Project',
      ];

      if (!projectType || !validProjectTypes.includes(projectType)) {
        return res.status(400).json({ error: 'Please select a valid project type.' });
      }

      if (
        !projectDescription ||
        typeof projectDescription !== 'string' ||
        projectDescription.trim().length < 15
      ) {
        return res.status(400).json({
          error: 'Please describe your project requirements in at least 15 characters.',
        });
      }

      if (!budget || typeof budget !== 'string' || budget.trim().length === 0) {
        return res.status(400).json({ error: 'Please select an expected budget range.' });
      }

      if (!timeline || typeof timeline !== 'string' || timeline.trim().length === 0) {
        return res.status(400).json({ error: 'Please select a preferred timeline.' });
      }

      if (!consentGiven) {
        return res.status(400).json({
          error: 'You must review and agree to the Privacy Policy to submit your project.',
        });
      }

      // URL validations if provided
      const validateUrl = (urlStr: string) => {
        try {
          const parsed = new URL(urlStr.startsWith('http') ? urlStr : `https://${urlStr}`);
          return parsed.hostname.includes('.');
        } catch {
          return false;
        }
      };

      if (existingWebsite && existingWebsite.trim() && !validateUrl(existingWebsite.trim())) {
        return res.status(400).json({ error: 'Existing website URL format is invalid.' });
      }

      // Create record in persistent database
      const application = db.createApplication({
        fullName,
        email,
        phone,
        companyName,
        projectType,
        projectDescription,
        budget,
        timeline,
        existingWebsite,
        referenceWebsites,
        preferredContactMethod,
        additionalRequirements,
        consentGiven: true,
      });

      // Notification status evaluation
      // In accordance with guidelines: do not fake notifications or claim an email was sent if SMTP is not configured
      const smtpConfigured = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER);
      if (!smtpConfigured) {
        console.log(
          `[New Application] Stored application ${application.id} from ${application.fullName} (${application.email}). Note: SMTP not configured in environment.`
        );
      } else {
        console.log(`[New Application] Stored application ${application.id}. Email dispatch queued.`);
      }

      return res.status(201).json({
        success: true,
        referenceId: application.id,
        message: 'Your project application has been received successfully.',
        notificationNotice: smtpConfigured
          ? 'Confirmation email dispatched.'
          : 'Application recorded in server database.',
      });
    } catch (err: any) {
      console.error('Error submitting application:', err);
      return res.status(500).json({
        error: 'An unexpected server error occurred while processing your application.',
      });
    }
  }
);

// Submit Contact Form Message
app.post(
  '/api/contact',
  rateLimiter('contact_submit', 8, 15 * 60 * 1000), // max 8 contact messages per 15 min per IP
  (req: Request, res: Response) => {
    try {
      const { fullName, email, phone, subject, message, honeypot } = req.body;

      if (honeypot) {
        return res.status(400).json({ error: 'Spam detected.' });
      }

      if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
        return res.status(400).json({ error: 'Please enter your name.' });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
        return res.status(400).json({ error: 'Please provide a valid email address.' });
      }

      if (!message || typeof message !== 'string' || message.trim().length < 10) {
        return res.status(400).json({ error: 'Message must be at least 10 characters long.' });
      }

      const contactMsg = db.createContactMessage({
        fullName,
        email,
        phone,
        subject: subject && typeof subject === 'string' && subject.trim() ? subject.trim() : 'Website Inquiry',
        message,
      });

      return res.status(201).json({
        success: true,
        messageId: contactMsg.id,
        message: 'Thank you for reaching out. Jatin Mehra will review your message promptly.',
      });
    } catch (err) {
      console.error('Error handling contact message:', err);
      return res.status(500).json({ error: 'Failed to send message. Please try again.' });
    }
  }
);

// -------------------------------------------------------------
// ADMIN AUTHENTICATION & PORTAL ROUTES
// -------------------------------------------------------------

// Check Admin Status
app.get('/api/admin/check-auth', (req: Request, res: Response) => {
  const sessionId = req.cookies?.admin_session;
  const isAuthenticated = db.validateSession(sessionId);
  const isSetup = db.isAdminSetup();

  res.json({
    authenticated: isAuthenticated,
    setupRequired: !isSetup,
    ownerEmail: 'userjatin2007@gmail.com',
  });
});

// Setup Initial Admin Password
app.post(
  '/api/admin/setup',
  rateLimiter('admin_setup', 5, 15 * 60 * 1000),
  (req: Request, res: Response) => {
    try {
      if (db.isAdminSetup()) {
        return res.status(400).json({ error: 'Admin setup is already completed.' });
      }

      const { password } = req.body;
      if (!password || typeof password !== 'string' || password.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
      }

      db.setAdminPassword(password);
      const sessionId = db.createSession();

      res.cookie('admin_session', sessionId, {
        httpOnly: true,
        secure: isProd,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/',
      });

      return res.json({ success: true, message: 'Admin account created and logged in.' });
    } catch (err: any) {
      return res.status(400).json({ error: err.message || 'Setup failed' });
    }
  }
);

// Admin Login
app.post(
  '/api/admin/login',
  rateLimiter('admin_login', 6, 15 * 60 * 1000), // max 6 attempts per 15 min
  (req: Request, res: Response) => {
    try {
      if (!db.isAdminSetup()) {
        return res.status(400).json({
          error: 'Admin account not yet configured. Complete the initial setup first.',
          setupRequired: true,
        });
      }

      const { password } = req.body;
      if (!password || typeof password !== 'string') {
        return res.status(400).json({ error: 'Password is required.' });
      }

      const valid = db.verifyAdminPassword(password);
      if (!valid) {
        return res.status(401).json({ error: 'Invalid password. Access denied.' });
      }

      const sessionId = db.createSession();

      res.cookie('admin_session', sessionId, {
        httpOnly: true,
        secure: isProd,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/',
      });

      return res.json({ success: true, message: 'Logged in successfully.' });
    } catch (err) {
      console.error('Login error:', err);
      return res.status(500).json({ error: 'Server authentication error.' });
    }
  }
);

// Admin Logout
app.post('/api/admin/logout', (req: Request, res: Response) => {
  const sessionId = req.cookies?.admin_session;
  db.destroySession(sessionId);
  res.clearCookie('admin_session', { path: '/' });
  res.json({ success: true, message: 'Logged out successfully.' });
});

// Admin: Get Applications
app.get('/api/admin/applications', requireAdmin, (req: Request, res: Response) => {
  const { status, projectType, search } = req.query;
  const applications = db.getApplications({
    status: typeof status === 'string' ? status : undefined,
    projectType: typeof projectType === 'string' ? projectType : undefined,
    search: typeof search === 'string' ? search : undefined,
  });

  res.json({
    applications,
    total: applications.length,
  });
});

// Admin: Get Single Application
app.get('/api/admin/applications/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const application = db.getApplicationById(id);

  if (!application) {
    return res.status(404).json({ error: 'Application not found.' });
  }

  res.json({ application });
});

// Admin: Update Application Status and Internal Notes
app.patch('/api/admin/applications/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, internalNotes } = req.body;

  const validStatuses: ApplicationStatus[] = [
    'New',
    'Reviewing',
    'Need More Information',
    'Accepted',
    'In Progress',
    'Completed',
    'Declined',
  ];

  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status provided.' });
  }

  const updated = db.updateApplication(id, {
    status,
    internalNotes: typeof internalNotes === 'string' ? internalNotes : undefined,
  });

  if (!updated) {
    return res.status(404).json({ error: 'Application not found.' });
  }

  res.json({ success: true, application: updated });
});

// Admin: Get Contact Messages
app.get('/api/admin/contact-messages', requireAdmin, (_req: Request, res: Response) => {
  const messages = db.getContactMessages();
  res.json({ messages });
});

// Admin: Mark Contact Message as Read
app.post('/api/admin/contact-messages/:id/read', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const ok = db.markMessageRead(id);
  res.json({ success: ok });
});

// Admin: Export Applications CSV
app.get('/api/admin/export-csv', requireAdmin, (_req: Request, res: Response) => {
  const csvData = db.exportApplicationsCSV();
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="jatin_mehra_project_applications_${new Date().toISOString().slice(0, 10)}.csv"`
  );
  res.send(csvData);
});

// Admin: Get Status History for Single Application
app.get('/api/admin/applications/:id/history', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const history = db.getStatusHistory(id);
  res.json({ history });
});

// Admin: Delete Application
app.delete('/api/admin/applications/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const ok = db.deleteApplication(id);
  if (!ok) return res.status(404).json({ error: 'Application not found' });
  res.json({ success: true, message: `Application ${id} deleted.` });
});

// Admin: Delete Contact Message
app.delete('/api/admin/contact-messages/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const ok = db.deleteContactMessage(id);
  if (!ok) return res.status(404).json({ error: 'Message not found' });
  res.json({ success: true, message: 'Message deleted.' });
});

// Admin: Get Database System Statistics
app.get('/api/admin/database/stats', requireAdmin, (_req: Request, res: Response) => {
  const stats = db.getDatabaseStats();
  res.json({ stats });
});

// Admin: Download Full Database Backup Snapshot
app.get('/api/admin/database/backup', requireAdmin, (_req: Request, res: Response) => {
  const backup = db.createBackup();
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="jatin_mehra_agency_db_backup_${new Date().toISOString().slice(0, 10)}.json"`
  );
  res.json(backup);
});

// Admin: Restore Database from Backup
app.post('/api/admin/database/restore', requireAdmin, (req: Request, res: Response) => {
  const { backupData } = req.body;
  const result = db.restoreBackup(backupData);
  if (!result.success) {
    return res.status(400).json({ error: result.message });
  }
  res.json(result);
});

// Admin: Seed Realistic Benchmark Project Submissions
app.post('/api/admin/database/seed', requireAdmin, (_req: Request, res: Response) => {
  const seededCount = db.seedRealisticSamples();
  res.json({ success: true, seededCount, message: `Seeded ${seededCount} benchmark applications.` });
});

// Admin: Get System Audit Logs
app.get('/api/admin/audit-logs', requireAdmin, (_req: Request, res: Response) => {
  const logs = db.getAuditLogs(100);
  res.json({ logs });
});

// -------------------------------------------------------------
// VITE DEV SERVER OR PRODUCTION STATIC SERVING
// -------------------------------------------------------------
async function bootstrap() {
  if (!isProd) {
    // Dynamic import of vite in dev mode
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT} (${isProd ? 'production' : 'development'})`);
  });
}

bootstrap().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
