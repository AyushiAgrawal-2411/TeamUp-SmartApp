import {
  ArrowRight,
  BadgeCheck,
  Brain,
  FolderKanban,
  Inbox,
  Target,
  TrendingUp,
  UserCheck,
} from 'lucide-react';
import { useStore } from '@/store';
import type { View } from '@/components/AppShell';
import { Avatar, ScoreRing, StatusPill } from '@/components/ui';
import { matchAnalysis, topMatches } from '@/lib/compatibility';

export function Dashboard({ setView }: { setView: (v: View) => void }) {
  const { currentUser, state, getUser, getProject, respondInvitation } = useStore();
  if (!currentUser) return null;

  const myProjects = state.projects.filter(
    (p) => p.ownerId === currentUser.id || p.memberIds.includes(currentUser.id)
  );
  const pendingInvites = state.invitations.filter(
    (i) => i.toUserId === currentUser.id && i.status === 'pending'
  );
  const others = state.users.filter((u) => !u.isCurrentUser && !state.blockedUserIds.includes(u.id));
  const recommended = topMatches(currentUser, others, 5);

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  })();

  const cards = [
    {
      icon: FolderKanban,
      label: 'My Projects',
      value: myProjects.length,
      hint: `${myProjects.filter((p) => p.status === 'Recruiting').length} recruiting`,
      color: 'bg-brand-50 text-brand-600',
      onClick: () => setView('projects'),
    },
    {
      icon: Inbox,
      label: 'Pending Invitations',
      value: pendingInvites.length,
      hint: 'Awaiting your response',
      color: 'bg-accent-50 text-accent-600',
      onClick: () => setView('dashboard'),
    },
    {
      icon: UserCheck,
      label: 'Recommended Teammates',
      value: recommended.length,
      hint: 'Highly compatible',
      color: 'bg-mint-50 text-mint-700',
      onClick: () => setView('discover'),
    },
    {
      icon: Target,
      label: 'My Skills',
      value: currentUser.skills.length,
      hint: currentUser.roles.join(', '),
      color: 'bg-mint-100 text-mint-800',
      onClick: () => setView('profile'),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="animate-fade-up">
        <p className="text-sm font-medium text-ink-500">{greeting}</p>
        <h1 className="font-display mt-1 text-3xl font-bold text-ink-900">
          Welcome back, {currentUser.name.split(' ')[0]} <span className="inline-block animate-fade-in">👋</span>
        </h1>
        <p className="mt-2 text-ink-600">
          Here's what's happening with your teams and matches today.
        </p>
      </div>

      {/* Verification nudge */}
      {!currentUser.collegeEmailVerified && (
        <div className="animate-fade-up rounded-2xl border border-accent-200 bg-accent-50 p-4 sm:p-5">
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-500 text-white">
                <BadgeCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-ink-900">Verify your college email</p>
                <p className="text-sm text-ink-600">
                  Unlock a verified badge and higher match visibility. Takes 30 seconds.
                </p>
              </div>
            </div>
            <button onClick={() => setView('trust')} className="btn-primary shrink-0">
              Verify now <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c, i) => (
          <button
            key={c.label}
            onClick={c.onClick}
            className="card group animate-fade-up p-5 text-left transition hover:-translate-y-1 hover:shadow-lift"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${c.color}`}>
              <c.icon className="h-5 w-5" />
            </div>
            <p className="mt-4 text-3xl font-bold text-ink-900">{c.value}</p>
            <p className="mt-1 text-sm font-semibold text-ink-700">{c.label}</p>
            <p className="mt-0.5 text-xs text-ink-500">{c.hint}</p>
          </button>
        ))}
      </div>

      {/* Collaboration score banner */}
      <div className="card animate-fade-up flex flex-col items-center gap-6 p-6 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-5">
          <ScoreRing score={currentUser.collaborationScore} size={72} />
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-brand-600" />
              <p className="text-sm font-semibold text-ink-900">Collaboration Score</p>
            </div>
            <p className="mt-1 max-w-md text-sm text-ink-600">
              Based on completed projects, response rate, and teammate ratings. Keep collaborating to grow it.
            </p>
            <div className="mt-3 flex gap-6 text-xs text-ink-500">
              <span><strong className="text-ink-800">{currentUser.projectsCompleted}</strong> projects</span>
              <span><strong className="text-ink-800">{currentUser.responseRate}%</strong> response rate</span>
            </div>
          </div>
        </div>
        <button onClick={() => setView('profile')} className="btn-secondary">
          View profile <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* Pending invitations */}
      <div className="card animate-fade-up overflow-hidden">
        <div className="flex items-center justify-between border-b border-ink-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <Inbox className="h-5 w-5 text-ink-700" />
            <h2 className="font-semibold text-ink-900">Pending Invitations</h2>
          </div>
          <span className="chip-brand">{pendingInvites.length} new</span>
        </div>
        {pendingInvites.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-ink-500">
            You're all caught up — no pending invitations.
          </div>
        ) : (
          <ul className="divide-y divide-ink-100">
            {pendingInvites.map((inv) => {
              const fromUser = getUser(inv.fromUserId);
              const project = getProject(inv.projectId);
              if (!fromUser || !project) return null;
              return (
                <li key={inv.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3">
                    <Avatar user={fromUser} />
                    <div>
                      <p className="text-sm font-semibold text-ink-900">
                        {fromUser.name} invited you to <span className="text-brand-700">{project.title}</span>
                      </p>
                      <p className="mt-0.5 text-xs text-ink-500">
                        Role: {inv.role} · {inv.createdAt}
                      </p>
                      <p className="mt-1 text-sm text-ink-600">"{inv.message}"</p>
                    </div>
                  </div>
                  <div className="flex gap-2 sm:shrink-0">
                    <button onClick={() => respondInvitation(inv.id, 'accepted')} className="btn-primary text-xs">Accept</button>
                    <button onClick={() => respondInvitation(inv.id, 'declined')} className="btn-secondary text-xs">Decline</button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Recommended for you */}
      <div className="animate-fade-up">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-brand-600" />
              <h2 className="font-display text-xl font-bold text-ink-900">AI Recommended For You</h2>
            </div>
            <p className="mt-1 text-sm text-ink-500">Smart-matched teammates ranked by compatibility across 5+ factors.</p>
          </div>
          <button onClick={() => setView('discover')} className="btn-ghost text-sm">
            See all <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {recommended.map(({ user, score }, i) => {
            const analysis = matchAnalysis(currentUser, user);
            return (
              <button
                key={user.id}
                onClick={() => setView('discover')}
                className="card group animate-fade-up p-4 text-left transition hover:-translate-y-1 hover:shadow-lift"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="flex items-center justify-between">
                  <Avatar user={user} size="lg" />
                  <ScoreRing score={score} size={48} />
                </div>
                <p className="mt-3 truncate text-sm font-semibold text-ink-900">
                  {user.name}
                  {user.collegeEmailVerified && <BadgeCheck className="ml-1 inline h-3.5 w-3.5 text-brand-500" />}
                </p>
                <p className="truncate text-xs text-ink-500">{user.roles.join(' · ')}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {user.skills.slice(0, 2).map((s) => (
                    <span key={s.name} className="chip">{s.name}</span>
                  ))}
                </div>
                <p className="mt-2 line-clamp-2 text-[11px] font-medium text-brand-700">
                  ✨ {analysis.headline}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* My projects preview */}
      <div className="card animate-fade-up overflow-hidden">
        <div className="flex items-center justify-between border-b border-ink-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <FolderKanban className="h-5 w-5 text-ink-700" />
            <h2 className="font-semibold text-ink-900">My Projects</h2>
          </div>
          <button onClick={() => setView('projects')} className="btn-ghost text-sm">
            View all <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        <ul className="divide-y divide-ink-100">
          {myProjects.slice(0, 3).map((p) => (
            <li key={p.id} className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="text-sm font-semibold text-ink-900">{p.title}</p>
                <p className="mt-0.5 text-xs text-ink-500">{p.tagline}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {p.memberIds.slice(0, 3).map((id) => {
                    const u = getUser(id);
                    return u ? <Avatar key={id} user={u} size="xs" ring /> : null;
                  })}
                </div>
                <StatusPill status={p.status} />
              </div>
            </li>
          ))}
          {myProjects.length === 0 && (
            <li className="px-5 py-10 text-center text-sm text-ink-500">No projects yet — start one or get invited.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
