import { useState } from 'react';
import {
  Ban,
  BadgeCheck,
  CheckCircle2,
  Eye,
  EyeOff,
  Flag,
  Globe,
  Lock,
  Mail,
  MailCheck,
  Shield,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { useStore } from '@/store';
import { Avatar } from '@/components/ui';
import type { PrivacyLevel, Report } from '@/types';

export function TrustSafety() {
  const { currentUser, state, setCurrentUserVerified, setPrivacy, blockUser, unblockUser, reportUser, getUser } =
    useStore();
  const [verificationFlow, setVerificationFlow] = useState<'idle' | 'sent' | 'verified'>('idle');
  const [code, setCode] = useState('');
  const [reportTarget, setReportTarget] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState('');
  const [reportDetail, setReportDetail] = useState('');
  const [showBlocked, setShowBlocked] = useState(false);

  if (!currentUser) return null;

  const others = state.users.filter((u) => u.id !== currentUser.id);
  const blocked = state.blockedUserIds.map((id) => getUser(id)).filter(Boolean) as NonNullable<ReturnType<typeof getUser>>[];

  const sendCode = () => setVerificationFlow('sent');
  const verifyCode = () => {
    if (code.trim().length >= 4) {
      setCurrentUserVerified(true);
      setVerificationFlow('verified');
    }
  };

  const submitReport = () => {
    if (!reportTarget || !reportReason) return;
    const report: Omit<Report, 'id' | 'createdAt'> = {
      reporterId: currentUser.id,
      targetUserId: reportTarget,
      reason: reportReason,
      detail: reportDetail,
    };
    reportUser(report);
    blockUser(reportTarget);
    setReportTarget(null);
    setReportReason('');
    setReportDetail('');
  };

  const privacyOptions: { value: PrivacyLevel; label: string; desc: string; icon: typeof Globe }[] = [
    { value: 'public', label: 'Public', desc: 'Anyone can find and view your profile.', icon: Globe },
    { value: 'college-only', label: 'College only', desc: 'Only students from your college can view your profile.', icon: Users },
    { value: 'private', label: 'Private', desc: 'Only people you invite can view your profile.', icon: Lock },
  ];

  return (
    <div className="space-y-8">
      <div className="animate-fade-up">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-brand-600" />
          <h1 className="font-display text-3xl font-bold text-ink-900">Trust & Safety</h1>
        </div>
        <p className="mt-2 max-w-2xl text-ink-600">
          TeamUp Smart is built for college communities. Verify your email, control your privacy, and keep your
          experience safe.
        </p>
      </div>

      {/* College email verification */}
      <section className="card animate-fade-up overflow-hidden">
        <div className="flex items-center gap-2 border-b border-ink-100 px-5 py-4">
          <MailCheck className="h-5 w-5 text-brand-600" />
          <h2 className="font-semibold text-ink-900">College Email Verification</h2>
        </div>
        <div className="p-5">
          {currentUser.collegeEmailVerified || verificationFlow === 'verified' ? (
            <div className="flex items-center gap-4 rounded-xl bg-brand-50 p-4 ring-1 ring-brand-100">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-500 text-white">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <p className="font-semibold text-ink-900">Your college email is verified</p>
                <p className="text-sm text-ink-600">{currentUser.email} · Verified badge active on your profile.</p>
              </div>
              <span className="ml-auto chip-brand">
                <BadgeCheck className="h-3.5 w-3.5" /> Verified
              </span>
            </div>
          ) : verificationFlow === 'sent' ? (
            <div className="max-w-md space-y-4">
              <p className="text-sm text-ink-700">
                We sent a 6-digit code to <strong>{currentUser.email}</strong>. Enter it below to verify.
              </p>
              <input
                className="input tracking-[0.4em]"
                placeholder="123456"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength={6}
              />
              <div className="flex gap-2">
                <button onClick={verifyCode} className="btn-primary">Verify</button>
                <button onClick={() => setVerificationFlow('idle')} className="btn-secondary">Back</button>
              </div>
              <p className="text-xs text-ink-400">Demo tip: enter any 4+ digit code to verify.</p>
            </div>
          ) : (
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-ink-100 text-ink-600">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-ink-900">Verify {currentUser.email}</p>
                  <p className="text-sm text-ink-600">
                    Get a verified badge and show teammates you're a real college student.
                  </p>
                </div>
              </div>
              <button onClick={sendCode} className="btn-primary">Send verification code</button>
            </div>
          )}
        </div>
      </section>

      {/* Profile privacy controls */}
      <section className="card animate-fade-up overflow-hidden">
        <div className="flex items-center gap-2 border-b border-ink-100 px-5 py-4">
          <Eye className="h-5 w-5 text-ink-700" />
          <h2 className="font-semibold text-ink-900">Profile Privacy</h2>
        </div>
        <div className="p-5">
          <div className="grid gap-3 sm:grid-cols-3">
            {privacyOptions.map((opt) => {
              const active = state.privacy === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => setPrivacy(opt.value)}
                  className={`rounded-xl border p-4 text-left transition ${
                    active
                      ? 'border-brand-400 bg-brand-50 ring-2 ring-brand-100'
                      : 'border-ink-200 bg-white hover:border-ink-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <opt.icon className={`h-5 w-5 ${active ? 'text-brand-600' : 'text-ink-500'}`} />
                    {active && <CheckCircle2 className="h-4 w-4 text-brand-600" />}
                  </div>
                  <p className="mt-3 text-sm font-semibold text-ink-900">{opt.label}</p>
                  <p className="mt-1 text-xs text-ink-500">{opt.desc}</p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Report & block */}
      <section className="card animate-fade-up overflow-hidden">
        <div className="flex items-center gap-2 border-b border-ink-100 px-5 py-4">
          <Flag className="h-5 w-5 text-ink-700" />
          <h2 className="font-semibold text-ink-900">Report & Block</h2>
        </div>
        <div className="p-5">
          <p className="text-sm text-ink-600">
            Report a user for misconduct, spam, or harassment. Reporting also blocks them from contacting you.
          </p>
          <ul className="mt-4 divide-y divide-ink-100 rounded-xl border border-ink-100">
            {others.map((u) => {
              const isBlocked = state.blockedUserIds.includes(u.id);
              return (
                <li key={u.id} className="flex items-center justify-between gap-3 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar user={u} size="sm" />
                    <div>
                      <p className="text-sm font-semibold text-ink-900">{u.name}</p>
                      <p className="text-xs text-ink-500">{u.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setReportTarget(u.id)}
                      className="btn-ghost text-xs text-red-600 hover:bg-red-50"
                    >
                      <Flag className="h-3.5 w-3.5" /> Report
                    </button>
                    {isBlocked ? (
                      <button onClick={() => unblockUser(u.id)} className="btn-secondary text-xs">
                        Unblock
                      </button>
                    ) : (
                      <button onClick={() => blockUser(u.id)} className="btn-ghost text-xs text-ink-600 hover:bg-ink-100">
                        <Ban className="h-3.5 w-3.5" /> Block
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>

          {blocked.length > 0 && (
            <div className="mt-5">
              <button onClick={() => setShowBlocked((s) => !s)} className="btn-ghost text-sm">
                {showBlocked ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {showBlocked ? 'Hide' : 'Show'} blocked users ({blocked.length})
              </button>
              {showBlocked && (
                <ul className="mt-3 space-y-2">
                  {blocked.map((u) => (
                    <li key={u.id} className="flex items-center justify-between rounded-lg bg-ink-50 px-3 py-2">
                      <span className="text-sm text-ink-700">{u.name}</span>
                      <button onClick={() => unblockUser(u.id)} className="btn-ghost text-xs text-brand-700">
                        Unblock
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {state.reports.length > 0 && (
            <div className="mt-5 rounded-xl bg-ink-50 p-4">
              <p className="text-xs font-semibold text-ink-700">Your submitted reports</p>
              <ul className="mt-2 space-y-1.5">
                {state.reports.map((r) => {
                  const target = getUser(r.targetUserId);
                  return (
                    <li key={r.id} className="text-xs text-ink-600">
                      <strong className="text-ink-800">{r.reason}</strong> against {target?.name ?? 'user'} ·{' '}
                      {r.detail || 'no detail'}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* Community promise */}
      <section className="animate-fade-up rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 p-6 text-white shadow-soft">
        <div className="flex items-start gap-4">
          <ShieldCheck className="h-8 w-8 shrink-0 text-brand-100" />
          <div>
            <h3 className="font-display text-lg font-bold">Our community promise</h3>
            <p className="mt-1 text-sm text-brand-50/90">
              Be kind, respect boundaries, and keep interactions academic. Reports are reviewed and repeat offenders
              lose access. Together we keep TeamUp Smart a safe place to build.
            </p>
          </div>
        </div>
      </section>

      {/* Report modal */}
      {reportTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-ink-950/50 animate-fade-in" onClick={() => setReportTarget(null)} />
          <div className="relative w-full max-w-md animate-scale-in rounded-2xl bg-white p-6 shadow-lift">
            <h3 className="text-lg font-bold text-ink-900">Report a user</h3>
            <p className="mt-1 text-sm text-ink-500">
              Reporting {getUser(reportTarget)?.name}. They won't be notified, and will be blocked from contacting you.
            </p>
            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-semibold text-ink-700">Reason</label>
                <select className="input mt-1" value={reportReason} onChange={(e) => setReportReason(e.target.value)}>
                  <option value="">Select a reason…</option>
                  <option value="Harassment">Harassment</option>
                  <option value="Spam or scam">Spam or scam</option>
                  <option value="Impersonation">Impersonation</option>
                  <option value="Inappropriate content">Inappropriate content</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-ink-700">Details (optional)</label>
                <textarea
                  className="input mt-1 min-h-[80px]"
                  value={reportDetail}
                  onChange={(e) => setReportDetail(e.target.value)}
                  placeholder="Add any context that helps us review."
                />
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setReportTarget(null)} className="btn-secondary">Cancel</button>
              <button onClick={submitReport} className="btn-danger">Submit report</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
