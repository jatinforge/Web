import React, { useState, useEffect, useCallback } from 'react';
import {
  ProjectApplication,
  ContactMessage,
  ApplicationStatus,
  ProjectType,
  StatusHistoryItem,
  AuditLogItem,
  DatabaseStats,
} from '../types.ts';
import {
  Lock,
  Search,
  Download,
  LogOut,
  RefreshCw,
  MessageSquare,
  Mail,
  Phone,
  Copy,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  X,
  FileSpreadsheet,
  Check,
  ChevronRight,
  Database,
  History,
  Trash2,
  Upload,
  Sparkles,
  ShieldAlert,
  Server,
  Activity,
  Clock,
  Globe,
  CheckSquare,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [setupRequired, setSetupRequired] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);

  // Dashboard Data State
  const [activeTab, setActiveTab] = useState<'applications' | 'messages' | 'database' | 'launch'>('applications');
  const [applications, setApplications] = useState<ProjectApplication[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [dbStats, setDbStats] = useState<DatabaseStats | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');

  // Selected Application for Details Modal
  const [selectedApp, setSelectedApp] = useState<ProjectApplication | null>(null);
  const [appHistory, setAppHistory] = useState<StatusHistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [editStatus, setEditStatus] = useState<ApplicationStatus>('New');
  const [editNotes, setEditNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  const [modalFeedback, setModalFeedback] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Restore Modal State
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [restoreJsonText, setRestoreJsonText] = useState('');
  const [restoreError, setRestoreError] = useState<string | null>(null);
  const [restoreSuccess, setRestoreSuccess] = useState<string | null>(null);

  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/check-auth');
      const data = await res.json();
      setIsAuthenticated(data.authenticated);
      setSetupRequired(data.setupRequired);
    } catch (err) {
      console.error('Auth check error:', err);
      setIsAuthenticated(false);
    }
  }, []);

  const loadDashboardData = useCallback(async () => {
    setLoadingData(true);
    try {
      const [appsRes, msgsRes, statsRes, logsRes] = await Promise.all([
        fetch('/api/admin/applications'),
        fetch('/api/admin/contact-messages'),
        fetch('/api/admin/database/stats'),
        fetch('/api/admin/audit-logs'),
      ]);

      if (appsRes.ok) {
        const appsData = await appsRes.json();
        setApplications(appsData.applications || []);
      }
      if (msgsRes.ok) {
        const msgsData = await msgsRes.json();
        setMessages(msgsData.messages || []);
      }
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setDbStats(statsData.stats);
      }
      if (logsRes.ok) {
        const logsData = await logsRes.json();
        setAuditLogs(logsData.logs || []);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardData();
    }
  }, [isAuthenticated, loadDashboardData]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsLoadingAuth(true);

    try {
      const endpoint = setupRequired ? '/api/admin/setup' : '/api/admin/login';
      if (setupRequired && passwordInput !== confirmPasswordInput) {
        throw new Error('Passwords do not match.');
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      setIsAuthenticated(true);
      setSetupRequired(false);
      setPasswordInput('');
      setConfirmPasswordInput('');
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed');
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      setIsAuthenticated(false);
      setSelectedApp(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const openAppDetails = async (app: ProjectApplication) => {
    setSelectedApp(app);
    setEditStatus(app.status);
    setEditNotes(app.internalNotes || '');
    setModalFeedback(null);
    setLoadingHistory(true);

    try {
      const res = await fetch(`/api/admin/applications/${app.id}/history`);
      if (res.ok) {
        const data = await res.json();
        setAppHistory(data.history || []);
      }
    } catch (err) {
      console.error('Failed to load status history:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleSaveAppUpdates = async () => {
    if (!selectedApp) return;
    setSavingNotes(true);
    setModalFeedback(null);

    try {
      const res = await fetch(`/api/admin/applications/${selectedApp.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: editStatus,
          internalNotes: editNotes,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update application');

      setApplications((prev) =>
        prev.map((a) => (a.id === selectedApp.id ? data.application : a))
      );
      setSelectedApp(data.application);

      const histRes = await fetch(`/api/admin/applications/${selectedApp.id}/history`);
      if (histRes.ok) {
        const histData = await histRes.json();
        setAppHistory(histData.history || []);
      }

      const statsRes = await fetch('/api/admin/database/stats');
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setDbStats(statsData.stats);
      }

      setModalFeedback('Application details and private notes saved to database.');
      setTimeout(() => setModalFeedback(null), 3500);
    } catch (err: any) {
      setModalFeedback(`Error: ${err.message}`);
    } finally {
      setSavingNotes(false);
    }
  };

  const handleDeleteApplication = async (id: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete application ${id}?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/applications/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setApplications((prev) => prev.filter((a) => a.id !== id));
        setSelectedApp(null);
        loadDashboardData();
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (!window.confirm('Delete this contact message?')) return;
    try {
      const res = await fetch(`/api/admin/contact-messages/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
        loadDashboardData();
      }
    } catch (err) {
      console.error('Failed to delete message:', err);
    }
  };

  const handleSeedSamples = async () => {
    try {
      const res = await fetch('/api/admin/database/seed', { method: 'POST' });
      if (res.ok) {
        await loadDashboardData();
        alert('Realistic benchmark project applications seeded into database.');
      }
    } catch (err) {
      console.error('Seed error:', err);
    }
  };

  const handleRestoreSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRestoreError(null);
    setRestoreSuccess(null);

    try {
      const parsed = JSON.parse(restoreJsonText);
      const res = await fetch('/api/admin/database/restore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ backupData: parsed }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Restore failed');

      setRestoreSuccess('Database successfully restored from JSON snapshot.');
      await loadDashboardData();
      setTimeout(() => {
        setShowRestoreModal(false);
        setRestoreJsonText('');
        setRestoreSuccess(null);
      }, 2000);
    } catch (err: any) {
      setRestoreError(err.message || 'Invalid JSON format or database schema error.');
    }
  };

  const handleMarkMessageRead = async (id: string) => {
    try {
      await fetch(`/api/admin/contact-messages/${id}/read`, { method: 'POST' });
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, read: true } : m))
      );
    } catch (err) {
      console.error('Failed to mark message read:', err);
    }
  };

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      searchQuery === '' ||
      app.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.companyName && app.companyName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
    const matchesType = typeFilter === 'All' || app.projectType === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const allStatuses: ApplicationStatus[] = [
    'New',
    'Reviewing',
    'Need More Information',
    'Accepted',
    'In Progress',
    'Completed',
    'Declined',
  ];

  const allProjectTypes: ProjectType[] = [
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

  if (isAuthenticated === null) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-white">
        <div className="flex items-center gap-3 text-xs font-mono text-neutral-600">
          <RefreshCw className="w-4 h-4 animate-spin text-neutral-900" />
          <span>Verifying security credentials...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-white text-neutral-900">
        <div className="w-full max-w-md p-8 rounded-xl bg-white border border-neutral-300 space-y-6 shadow-sm">
          <div className="text-center space-y-2">
            <div className="w-10 h-10 rounded bg-neutral-100 border border-neutral-300 flex items-center justify-center mx-auto text-neutral-900">
              <Lock className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-neutral-950">Owner Portal Authentication</h1>
            <p className="text-xs text-neutral-600">
              {setupRequired
                ? 'Welcome Jatin Mehra. Please configure your master administrative password to initialize the secure portal.'
                : 'Restricted administrative access for Jatin Mehra.'}
            </p>
          </div>

          {authError && (
            <div className="p-3 rounded bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-800 mb-1.5">
                {setupRequired ? 'New Master Password (min 8 chars)' : 'Master Password'}
              </label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded text-sm text-neutral-900 placeholder-neutral-400 focus:bg-white focus:outline-none focus:border-neutral-900 transition-colors"
              />
            </div>

            {setupRequired && (
              <div>
                <label className="block text-xs font-semibold text-neutral-800 mb-1.5">
                  Confirm Master Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPasswordInput}
                  onChange={(e) => setConfirmPasswordInput(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded text-sm text-neutral-900 placeholder-neutral-400 focus:bg-white focus:outline-none focus:border-neutral-900 transition-colors"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isLoadingAuth}
              className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-neutral-950 rounded hover:bg-neutral-800 disabled:bg-neutral-400 transition-colors cursor-pointer shadow-xs"
            >
              {isLoadingAuth
                ? 'Authenticating...'
                : setupRequired
                ? 'Initialize Admin Credentials'
                : 'Sign In to Dashboard'}
            </button>
          </form>

          <div className="pt-4 border-t border-neutral-100 text-center text-[11px] text-neutral-500 font-mono">
            Directly authenticated via HttpOnly sessions · Jatin Mehra
          </div>
        </div>
      </div>
    );
  }

  const newAppsCount = applications.filter((a) => a.status === 'New').length;
  const inProgressCount = applications.filter((a) => a.status === 'In Progress').length;
  const unreadMessagesCount = messages.filter((m) => !m.read).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 pb-28 bg-white text-neutral-900">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded bg-neutral-900"></span>
            <span className="text-xs font-mono uppercase tracking-wider text-neutral-600 font-semibold">
              Authenticated Owner Portal
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-950 mt-1">
            Application Management Console
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadDashboardData}
            disabled={loadingData}
            className="p-2 text-xs font-semibold text-neutral-800 bg-white border border-neutral-300 rounded hover:bg-neutral-50 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            title="Refresh Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingData ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <a
            href="/api/admin/export-csv"
            download
            className="px-3.5 py-2 text-xs font-semibold text-neutral-800 bg-white border border-neutral-300 rounded hover:bg-neutral-50 transition-colors flex items-center gap-1.5 shadow-xs"
            title="Export Applications to CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </a>

          <button
            onClick={handleLogout}
            className="px-3.5 py-2 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 rounded hover:bg-red-100 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-200 shadow-xs">
          <div className="text-xs font-mono text-neutral-500 uppercase">Total Applications</div>
          <div className="text-2xl font-mono font-bold text-neutral-950 mt-1 tabular-nums">
            {applications.length}
          </div>
        </div>

        <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-200 shadow-xs">
          <div className="text-xs font-mono text-neutral-500 uppercase">New / Action Required</div>
          <div className="text-2xl font-mono font-bold text-neutral-950 mt-1 tabular-nums">
            {newAppsCount}
          </div>
        </div>

        <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-200 shadow-xs">
          <div className="text-xs font-mono text-neutral-500 uppercase">In Progress</div>
          <div className="text-2xl font-mono font-bold text-neutral-950 mt-1 tabular-nums">
            {inProgressCount}
          </div>
        </div>

        <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-200 shadow-xs">
          <div className="text-xs font-mono text-neutral-500 uppercase">Contact Messages</div>
          <div className="text-2xl font-mono font-bold text-neutral-950 mt-1 tabular-nums">
            {messages.length} {unreadMessagesCount > 0 && `(${unreadMessagesCount} unread)`}
          </div>
        </div>
      </div>

      {/* Tab Selector */}
      <div className="flex flex-wrap items-center gap-2 border-b border-neutral-200 pb-3">
        <button
          onClick={() => setActiveTab('applications')}
          className={`px-4 py-2 text-xs font-semibold rounded transition-colors cursor-pointer ${
            activeTab === 'applications'
              ? 'bg-neutral-950 text-white shadow-xs'
              : 'text-neutral-600 hover:text-neutral-950 bg-neutral-100'
          }`}
        >
          Project Applications ({applications.length})
        </button>

        <button
          onClick={() => setActiveTab('messages')}
          className={`px-4 py-2 text-xs font-semibold rounded transition-colors cursor-pointer ${
            activeTab === 'messages'
              ? 'bg-neutral-950 text-white shadow-xs'
              : 'text-neutral-600 hover:text-neutral-950 bg-neutral-100'
          }`}
        >
          Contact Inquiries ({messages.length})
        </button>

        <button
          onClick={() => setActiveTab('database')}
          className={`px-4 py-2 text-xs font-semibold rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'database'
              ? 'bg-neutral-950 text-white shadow-xs'
              : 'text-neutral-600 hover:text-neutral-950 bg-neutral-100'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>Database and Engine</span>
        </button>

        <button
          onClick={() => setActiveTab('launch')}
          className={`px-4 py-2 text-xs font-semibold rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'launch'
              ? 'bg-neutral-950 text-white shadow-xs'
              : 'text-neutral-600 hover:text-neutral-950 bg-neutral-100'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Launch and Domain Setup</span>
        </button>
      </div>

      {/* Tab 1: Project Applications */}
      {activeTab === 'applications' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-6 relative">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by client name, email, company, or ID..."
                className="w-full pl-9 pr-4 py-2 bg-neutral-50 border border-neutral-300 rounded text-xs text-neutral-900 placeholder-neutral-400 focus:bg-white focus:outline-none focus:border-neutral-900"
              />
            </div>

            <div className="sm:col-span-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded text-xs text-neutral-900 focus:bg-white focus:outline-none focus:border-neutral-900"
              >
                <option value="All">All Statuses</option>
                {allStatuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-3">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded text-xs text-neutral-900 focus:bg-white focus:outline-none focus:border-neutral-900"
              >
                <option value="All">All Services</option>
                {allProjectTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {filteredApplications.length === 0 ? (
            <div className="p-12 text-center rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-500 space-y-2">
              <p>No project applications matched your search or filters.</p>
              {(searchQuery || statusFilter !== 'All' || typeFilter !== 'All') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('All');
                    setTypeFilter('All');
                  }}
                  className="text-neutral-950 font-semibold underline cursor-pointer"
                >
                  Reset all filters
                </button>
              )}
            </div>
          ) : (
            <div className="rounded-xl border border-neutral-200 overflow-hidden bg-white shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 uppercase font-mono text-[11px]">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Ref ID</th>
                      <th className="px-4 py-3 font-semibold">Client</th>
                      <th className="px-4 py-3 font-semibold">Service</th>
                      <th className="px-4 py-3 font-semibold">Budget and Timeline</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                      <th className="px-4 py-3 font-semibold">Submitted</th>
                      <th className="px-4 py-3 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 text-neutral-800">
                    {filteredApplications.map((app) => (
                      <tr key={app.id} className="hover:bg-neutral-50/80 transition-colors">
                        <td className="px-4 py-3 font-mono font-semibold text-neutral-950 whitespace-nowrap">
                          {app.id}
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-semibold text-neutral-950">{app.fullName}</div>
                          <div className="text-[11px] text-neutral-500 truncate max-w-[160px]">
                            {app.email}
                          </div>
                          {app.companyName && (
                            <div className="text-[11px] text-neutral-500 truncate max-w-[160px]">
                              {app.companyName}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-neutral-700">
                          {app.projectType}
                        </td>
                        <td className="px-4 py-3">
                          <div className="truncate max-w-[160px] text-neutral-800">{app.budget}</div>
                          <div className="text-[11px] text-neutral-500 truncate max-w-[160px]">
                            {app.timeline}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                              app.status === 'New'
                                ? 'bg-neutral-900 text-white border-neutral-900'
                                : app.status === 'Accepted' || app.status === 'In Progress'
                                ? 'bg-neutral-100 text-neutral-950 border-neutral-300'
                                : app.status === 'Completed'
                                ? 'bg-neutral-50 text-neutral-700 border-neutral-200'
                                : 'bg-neutral-50 text-neutral-500 border-neutral-200'
                            }`}
                          >
                            {app.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono text-[11px] text-neutral-500 whitespace-nowrap tabular-nums">
                          {new Date(app.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-right whitespace-nowrap space-x-2">
                          <button
                            onClick={() => openAppDetails(app)}
                            className="px-3 py-1.5 text-xs font-semibold text-white bg-neutral-950 rounded hover:bg-neutral-800 transition-colors cursor-pointer shadow-xs"
                          >
                            Review
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Contact Messages */}
      {activeTab === 'messages' && (
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="p-12 text-center rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-500">
              No contact messages recorded yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-6 rounded-xl border transition-colors space-y-3 ${
                    msg.read
                      ? 'bg-white border-neutral-200 text-neutral-600'
                      : 'bg-neutral-50 border-neutral-300 text-neutral-900'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-neutral-200">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-neutral-950">{msg.fullName}</span>
                      <span className="text-xs text-neutral-600">{msg.email}</span>
                      {msg.phone && (
                        <span className="text-xs text-neutral-600">· {msg.phone}</span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-xs font-mono text-neutral-500">
                      <span>{new Date(msg.createdAt).toLocaleString()}</span>
                      {!msg.read && (
                        <button
                          onClick={() => handleMarkMessageRead(msg.id)}
                          className="px-2 py-0.5 text-[11px] font-semibold bg-neutral-200 text-neutral-900 rounded hover:bg-neutral-300 transition-colors cursor-pointer"
                        >
                          Mark Read
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteMessage(msg.id)}
                        className="text-neutral-400 hover:text-red-600 transition-colors cursor-pointer"
                        title="Delete message"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm text-neutral-950">{msg.subject}</h4>
                    <p className="text-xs text-neutral-700 leading-relaxed mt-1.5 whitespace-pre-line">
                      {msg.message}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <a
                      href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                      className="px-3 py-1.5 text-xs font-semibold text-neutral-900 bg-white border border-neutral-300 rounded hover:bg-neutral-50 transition-colors flex items-center gap-1.5 shadow-xs"
                    >
                      <Mail className="w-3 h-3 text-neutral-600" />
                      <span>Reply via Email</span>
                    </a>

                    {msg.phone && (
                      <a
                        href={`https://wa.me/${msg.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 text-xs font-semibold text-neutral-900 bg-white border border-neutral-300 rounded hover:bg-neutral-50 transition-colors flex items-center gap-1.5 shadow-xs"
                      >
                        <MessageSquare className="w-3 h-3 text-neutral-600" />
                        <span>Chat WhatsApp</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Database & Audit Engine */}
      {activeTab === 'database' && (
        <div className="space-y-8">
          <div className="p-6 sm:p-8 rounded-xl bg-neutral-50 border border-neutral-200 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-white border border-neutral-300 flex items-center justify-center text-neutral-900">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-neutral-950">Database Core Engine</h3>
                  <div className="text-xs text-neutral-600 font-mono">
                    Storage: File-Backed ACID Atomic Store · Status: <span className="text-neutral-950 font-semibold">HEALTHY (Active)</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href="/api/admin/database/backup"
                  download
                  className="px-3.5 py-2 text-xs font-semibold text-white bg-neutral-950 rounded hover:bg-neutral-800 transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Backup (JSON)</span>
                </a>

                <button
                  onClick={() => setShowRestoreModal(true)}
                  className="px-3.5 py-2 text-xs font-semibold text-neutral-900 bg-white border border-neutral-300 rounded hover:bg-neutral-100 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Upload className="w-3.5 h-3.5 text-neutral-700" />
                  <span>Restore Snapshot</span>
                </button>

                <button
                  onClick={handleSeedSamples}
                  className="px-3.5 py-2 text-xs font-semibold text-neutral-900 bg-white border border-neutral-300 rounded hover:bg-neutral-100 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                  title="Seed sample benchmark submissions"
                >
                  <Sparkles className="w-3.5 h-3.5 text-neutral-700" />
                  <span>Seed Benchmark Data</span>
                </button>
              </div>
            </div>

            {/* Storage Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
              <div className="p-4 rounded bg-white border border-neutral-200 shadow-xs">
                <span className="text-neutral-500 block text-[11px]">Database File Size</span>
                <span className="text-lg font-bold text-neutral-950 mt-1 block">
                  {dbStats?.fileSizeFormatted || 'Calculating...'}
                </span>
              </div>

              <div className="p-4 rounded bg-white border border-neutral-200 shadow-xs">
                <span className="text-neutral-500 block text-[11px]">Applications Registered</span>
                <span className="text-lg font-bold text-neutral-950 mt-1 block">
                  {dbStats?.totalApplications || applications.length}
                </span>
              </div>

              <div className="p-4 rounded bg-white border border-neutral-200 shadow-xs">
                <span className="text-neutral-500 block text-[11px]">Status Transitions Logged</span>
                <span className="text-lg font-bold text-neutral-950 mt-1 block">
                  {dbStats?.totalStatusTransitions || 0}
                </span>
              </div>

              <div className="p-4 rounded bg-white border border-neutral-200 shadow-xs">
                <span className="text-neutral-500 block text-[11px]">Security Audit Events</span>
                <span className="text-lg font-bold text-neutral-950 mt-1 block">
                  {dbStats?.totalAuditLogs || auditLogs.length}
                </span>
              </div>
            </div>

            {/* Status Breakdown Bar */}
            {dbStats && (
              <div className="space-y-3 pt-2">
                <span className="text-xs font-mono uppercase text-neutral-500 font-semibold">
                  Applications Distribution by Status
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-7 gap-2 text-xs text-center font-mono">
                  {Object.entries(dbStats.statusBreakdown).map(([status, count]) => (
                    <div
                      key={status}
                      className="p-2.5 rounded bg-white border border-neutral-200 shadow-xs"
                    >
                      <span className="text-neutral-500 block text-[10px] truncate">{status}</span>
                      <span className="text-sm font-bold text-neutral-950 mt-0.5 block">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Audit Logs Section */}
          <div className="p-6 sm:p-8 rounded-xl bg-white border border-neutral-200 space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-neutral-700" />
                <h3 className="text-base font-bold text-neutral-950">System Audit Trail and Security Logs</h3>
              </div>
              <span className="text-xs font-mono text-neutral-500">Last 100 Recorded Events</span>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
              {auditLogs.length === 0 ? (
                <div className="text-xs text-neutral-500 py-4">No audit events recorded yet.</div>
              ) : (
                auditLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded bg-neutral-50 border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono"
                  >
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-neutral-200 text-neutral-900 border border-neutral-300">
                        {log.action}
                      </span>
                      <span className="text-neutral-800 font-sans text-xs">{log.details}</span>
                    </div>
                    <div className="text-[11px] text-neutral-500 shrink-0">
                      {new Date(log.timestamp).toLocaleString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Launch & Custom Domain Readiness */}
      {activeTab === 'launch' && (
        <div className="space-y-8">
          <div className="p-6 sm:p-8 rounded-xl bg-neutral-50 border border-neutral-200 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-neutral-200">
              <div className="w-10 h-10 rounded bg-white border border-neutral-300 flex items-center justify-center text-neutral-900">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-neutral-950">Custom Domain and Pre-Launch Checklist</h3>
                <p className="text-xs text-neutral-600">
                  Verification guide for connecting your production domain (e.g. jatinmehra.dev or jatinmehra.in) before public release.
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs text-neutral-700">
              <div className="p-4 bg-white rounded border border-neutral-200 space-y-2">
                <span className="font-semibold text-neutral-950 block">Step 1: Domain Registrar DNS Setup</span>
                <p>
                  In your DNS provider dashboard (Cloudflare, GoDaddy, Namecheap), add the following DNS records pointing to your production server:
                </p>
                <div className="p-3 bg-neutral-50 rounded font-mono text-[11px] space-y-1 text-neutral-800">
                  <div>Type: <strong>A</strong> | Host: <strong>@</strong> | Value: [Your Production Server IP]</div>
                  <div>Type: <strong>CNAME</strong> | Host: <strong>www</strong> | Value: <strong>jatinmehra.dev</strong> (or root domain)</div>
                </div>
              </div>

              <div className="p-4 bg-white rounded border border-neutral-200 space-y-2">
                <span className="font-semibold text-neutral-950 block">Step 2: SSL Certificate and HTTPS</span>
                <p>
                  Ensure an automated Let's Encrypt SSL certificate is provisioned. The server enforces HTTPS and strict security headers (nosniff, SAMEORIGIN, strict-transport-security).
                </p>
              </div>

              <div className="p-4 bg-white rounded border border-neutral-200 space-y-2">
                <span className="font-semibold text-neutral-950 block">Step 3: Verification Checks</span>
                <ul className="space-y-1 text-neutral-600">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-neutral-900" />
                    <span>Favicon installed and confirmed (JM monoline brand SVG).</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-neutral-900" />
                    <span>"Made with AI" or external builder tags completely removed.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-neutral-900" />
                    <span>Privacy Policy and Terms and Conditions pages published.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-neutral-900" />
                    <span>Project application intake form tested and verified end-to-end.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Restore Database Modal */}
      {showRestoreModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl p-6 sm:p-8 rounded-xl bg-white border border-neutral-200 space-y-6 shadow-xl text-neutral-900">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-neutral-900" />
                <h3 className="text-base font-bold text-neutral-950">Restore Database From Backup</h3>
              </div>
              <button
                onClick={() => setShowRestoreModal(false)}
                className="text-neutral-500 hover:text-neutral-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {restoreError && (
              <div className="p-3 rounded bg-red-50 border border-red-200 text-red-800 text-xs">
                {restoreError}
              </div>
            )}
            {restoreSuccess && (
              <div className="p-3 rounded bg-neutral-100 border border-neutral-300 text-neutral-950 text-xs">
                {restoreSuccess}
              </div>
            )}

            <form onSubmit={handleRestoreSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-800 mb-1.5">
                  Paste JSON Backup Payload
                </label>
                <textarea
                  rows={8}
                  required
                  value={restoreJsonText}
                  onChange={(e) => setRestoreJsonText(e.target.value)}
                  placeholder='{"applications": [...], "messages": [...]}'
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded text-xs font-mono text-neutral-900 placeholder-neutral-400 focus:bg-white focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRestoreModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-neutral-950 rounded hover:bg-neutral-800 shadow-xs"
                >
                  Confirm and Restore Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Application Details & Status History Drawer / Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="relative w-full max-w-3xl rounded-xl bg-white border border-neutral-300 p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl text-neutral-900">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-neutral-200">
              <div>
                <span className="text-xs font-mono text-neutral-500">Application Reference</span>
                <h2 className="text-xl font-bold font-mono text-neutral-950 tracking-wider">
                  {selectedApp.id}
                </h2>
                <div className="text-xs text-neutral-500 mt-0.5">
                  Submitted {new Date(selectedApp.createdAt).toLocaleString()} · Consent verified
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleDeleteApplication(selectedApp.id)}
                  className="p-1.5 text-neutral-500 hover:text-red-600 rounded border border-neutral-300 cursor-pointer"
                  title="Delete Application"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedApp(null)}
                  className="p-1.5 text-neutral-500 hover:text-neutral-900 rounded border border-neutral-300 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Feedback Banner */}
            {modalFeedback && (
              <div className="p-3 rounded bg-neutral-50 border border-neutral-300 text-xs text-neutral-900 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-neutral-900 shrink-0" />
                <span>{modalFeedback}</span>
              </div>
            )}

            {/* Quick Contact & Action Buttons */}
            <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => copyToClipboard(selectedApp.email, 'email')}
                  className="px-3 py-1.5 bg-white border border-neutral-300 hover:bg-neutral-100 text-neutral-800 font-medium rounded flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Copy className="w-3.5 h-3.5 text-neutral-600" />
                  <span>{copiedField === 'email' ? 'Email Copied' : selectedApp.email}</span>
                </button>

                {selectedApp.phone && (
                  <button
                    onClick={() => copyToClipboard(selectedApp.phone!, 'phone')}
                    className="px-3 py-1.5 bg-white border border-neutral-300 hover:bg-neutral-100 text-neutral-800 font-medium rounded flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Copy className="w-3.5 h-3.5 text-neutral-600" />
                    <span>{copiedField === 'phone' ? 'Phone Copied' : selectedApp.phone}</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                {selectedApp.phone && (
                  <a
                    href={`https://wa.me/${selectedApp.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                      `Hello ${selectedApp.fullName}, regarding your application ${selectedApp.id} for ${selectedApp.projectType}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-neutral-950 text-white font-semibold rounded hover:bg-neutral-800 flex items-center gap-1.5 shadow-xs"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Chat on WhatsApp</span>
                  </a>
                )}
                <a
                  href={`mailto:${selectedApp.email}?subject=Project Proposal: ${selectedApp.id} (${selectedApp.projectType})`}
                  className="px-3 py-1.5 bg-white border border-neutral-300 text-neutral-800 font-semibold rounded hover:bg-neutral-100 flex items-center gap-1.5 shadow-xs"
                >
                  <Mail className="w-3.5 h-3.5 text-neutral-600" />
                  <span>Email Client</span>
                </a>
              </div>
            </div>

            {/* Application Data Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded bg-neutral-50 border border-neutral-200 space-y-1">
                <span className="text-neutral-500 block font-mono text-[11px] uppercase">Client Full Name</span>
                <span className="font-semibold text-neutral-950">{selectedApp.fullName}</span>
              </div>

              <div className="p-4 rounded bg-neutral-50 border border-neutral-200 space-y-1">
                <span className="text-neutral-500 block font-mono text-[11px] uppercase">Company Name</span>
                <span className="font-semibold text-neutral-950">{selectedApp.companyName || 'Not specified'}</span>
              </div>

              <div className="p-4 rounded bg-neutral-50 border border-neutral-200 space-y-1">
                <span className="text-neutral-500 block font-mono text-[11px] uppercase">Service Type</span>
                <span className="font-semibold text-neutral-950">{selectedApp.projectType}</span>
              </div>

              <div className="p-4 rounded bg-neutral-50 border border-neutral-200 space-y-1">
                <span className="text-neutral-500 block font-mono text-[11px] uppercase">Budget and Timeline</span>
                <span className="font-semibold text-neutral-950">
                  {selectedApp.budget} · {selectedApp.timeline}
                </span>
              </div>

              <div className="p-4 rounded bg-neutral-50 border border-neutral-200 space-y-1">
                <span className="text-neutral-500 block font-mono text-[11px] uppercase">Preferred Contact</span>
                <span className="font-semibold text-neutral-950">{selectedApp.preferredContactMethod || 'Email'}</span>
              </div>

              <div className="p-4 rounded bg-neutral-50 border border-neutral-200 space-y-1">
                <span className="text-neutral-500 block font-mono text-[11px] uppercase">Existing Website</span>
                <span className="font-semibold text-neutral-950 truncate block">
                  {selectedApp.existingWebsite ? (
                    <a
                      href={selectedApp.existingWebsite.startsWith('http') ? selectedApp.existingWebsite : `https://${selectedApp.existingWebsite}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline flex items-center gap-1"
                    >
                      <span>{selectedApp.existingWebsite}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    'None'
                  )}
                </span>
              </div>
            </div>

            {/* Reference URLs */}
            {selectedApp.referenceWebsites && (
              <div className="p-4 rounded bg-neutral-50 border border-neutral-200 text-xs space-y-1">
                <span className="text-neutral-500 block font-mono text-[11px] uppercase">Reference Links</span>
                <p className="text-neutral-900">{selectedApp.referenceWebsites}</p>
              </div>
            )}

            {/* Project Description */}
            <div className="p-4 rounded bg-neutral-50 border border-neutral-200 text-xs space-y-1.5">
              <span className="text-neutral-500 block font-mono text-[11px] uppercase">Project Description and Requirements</span>
              <p className="text-neutral-800 leading-relaxed whitespace-pre-line">
                {selectedApp.projectDescription}
              </p>
            </div>

            {selectedApp.additionalRequirements && (
              <div className="p-4 rounded bg-neutral-50 border border-neutral-200 text-xs space-y-1.5">
                <span className="text-neutral-500 block font-mono text-[11px] uppercase">Additional Requirements</span>
                <p className="text-neutral-800 leading-relaxed whitespace-pre-line">
                  {selectedApp.additionalRequirements}
                </p>
              </div>
            )}

            {/* Status Management & Internal Private Notes */}
            <div className="p-5 rounded-lg bg-neutral-50 border border-neutral-200 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div>
                  <label className="block text-xs font-semibold text-neutral-900 mb-1.5">
                    Update Application Status
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as ApplicationStatus)}
                    className="w-full px-3 py-2 bg-white border border-neutral-300 rounded text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                  >
                    {allStatuses.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:self-end">
                  <div className="text-[11px] text-neutral-500">
                    Status change is logged to the immutable audit history.
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-900 mb-1.5">
                  Private Internal Notes (Owner Only)
                </label>
                <textarea
                  rows={4}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Private technical notes, pricing calculations, call summaries, or action items (never exposed to clients)..."
                  className="w-full px-3 py-2 bg-white border border-neutral-300 rounded text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleSaveAppUpdates}
                  disabled={savingNotes}
                  className="px-5 py-2 text-xs font-semibold text-white bg-neutral-950 rounded hover:bg-neutral-800 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{savingNotes ? 'Saving...' : 'Save Status and Internal Notes'}</span>
                </button>
              </div>
            </div>

            {/* Status Transition History Trail */}
            <div className="space-y-3 pt-2 border-t border-neutral-200">
              <div className="flex items-center gap-2 text-xs font-mono text-neutral-600 uppercase font-semibold">
                <History className="w-3.5 h-3.5 text-neutral-700" />
                <span>Application Lifecycle and Status History</span>
              </div>

              {loadingHistory ? (
                <div className="text-xs text-neutral-500 font-mono">Loading history...</div>
              ) : appHistory.length === 0 ? (
                <div className="text-xs text-neutral-500">No previous status transitions recorded.</div>
              ) : (
                <div className="space-y-2">
                  {appHistory.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded bg-neutral-50 border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs"
                    >
                      <div>
                        <span className="font-semibold text-neutral-950">
                          {item.previousStatus} → {item.newStatus}
                        </span>
                        <span className="text-neutral-600 ml-2">by {item.changedBy}</span>
                        {item.note && (
                          <div className="text-[11px] text-neutral-500 mt-0.5">{item.note}</div>
                        )}
                      </div>
                      <div className="text-[11px] font-mono text-neutral-500 shrink-0">
                        {new Date(item.timestamp).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
