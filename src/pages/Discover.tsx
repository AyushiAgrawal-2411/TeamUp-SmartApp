import { useMemo, useState } from 'react';
import { BadgeCheck, Brain, Filter, Search, Send, Sparkles } from 'lucide-react';
import { useStore } from '@/store';
import { Avatar, ScoreRing, SkillLevelPill, AvailabilityPill } from '@/components/ui';
import { compatibility, matchAnalysis } from '@/lib/compatibility';
import type { User } from '@/types';

export function Discover() {
  const { currentUser, state, getUser, inviteUser } = useStore();
  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [inviteMsg, setInviteMsg] = useState('');
  const [inviteRole, setInviteRole] = useState('');
  const [inviteProject, setInviteProject] = useState('');
  const [sentTo, setSentTo] = useState<string | null>(null);

  if (!currentUser) return null;

  const roles = ['All', 'Frontend', 'Backend', 'UI/UX', 'ML', 'Data Science', 'Research', 'DevOps', 'Mobile'];

  const results = useMemo(() => {
    const others = state.users.filter(
      (u) => u.id !== currentUser.id && !state.blockedUserIds.includes(u.id)
    );
    return others
      .filter((u) => (roleFilter === 'All' ? true : u.roles.includes(roleFilter as User['roles'][number])))
      .filter((u) => {
        if (!query.trim()) return true;
        const q = query.toLowerCase();
        return (
          u.name.toLowerCase().includes(q) ||
          u.skills.some((s) => s.name.toLowerCase().includes(q)) ||
          u.interests.some((i) => i.toLowerCase().includes(q))
        );
      })
      .map((u) => ({ user: u, score: compatibility(currentUser, u), analysis: matchAnalysis(currentUser, u) }))
      .sort((a, b) => b.score - a.score);
  }, [state.users, state.blockedUserIds, currentUser, roleFilter, query]);

  const selected = selectedId ? getUser(selectedId) : null;

  const sendInvite = () => {
    if (!selected || !inviteProject || !inviteRole) return;
    inviteUser({
      projectId: inviteProject,
      fromUserId: currentUser.id,
      toUserId: selected.id,
      role: inviteRole as User['roles'][number],
      message: inviteMsg || `Would love to work with you on a project!`,
    });
    setSentTo(selected.id);
    setTimeout(() => setSentTo(null), 2500);
    setInviteMsg('');
    setInviteRole('');
    setInviteProject('');
  };

  return (
    <div className="space-y-6">
      <div className="animate-fade-up">
        <div className="flex items-center gap-2">
          <Brain className="h-6 w-6 text-brand-600" />
          <h1 className="font-display text-3xl font-bold text-ink-900">Discover Teammates</h1>
        </div>
        <p className="mt-2 text-ink-600">AI-ranked matches based on skills, interests, availability & role complement.</p>
      </div>

      {/* AI engine banner */}
      <div className="card animate-fade-up flex flex-col items-start gap-3 bg-gradient-to-br from-brand-50 to-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-ink-900">AI Smart Matching is active</p>
            <p className="text-xs text-ink-600">Results are ranked by compatibility across 5+ factors in real time.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-brand-700">
          <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-brand-500" /> Analyzing {results.length} profiles
        </div>
      </div>

      {/* Filters */}
      <div className="card animate-fade-up flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            className="input pl-9"
            placeholder="Search by name, skill, or interest…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <Filter className="h-4 w-4 shrink-0 text-ink-400" />
          {roles.map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                roleFilter === r ? 'bg-brand-600 text-white' : 'bg-ink-100 text-ink-700 hover:bg-ink-200'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {results.map(({ user, score, analysis }, i) => (
          <button
            key={user.id}
            onClick={() => setSelectedId(user.id)}
            className="card group animate-fade-up p-5 text-left transition hover:-translate-y-1 hover:shadow-lift"
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <div className="flex items-start justify-between">
              <Avatar user={user} size="lg" />
              <ScoreRing score={score} size={52} />
            </div>
            <p className="mt-3 text-base font-semibold text-ink-900">
              {user.name}
              {user.collegeEmailVerified && <BadgeCheck className="ml-1 inline h-4 w-4 text-brand-500" />}
            </p>
            <p className="text-xs text-ink-500">{user.major} · {user.year}</p>
            <p className="mt-2 line-clamp-2 text-sm text-ink-600">{user.bio}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {user.skills.slice(0, 3).map((s) => (
                <span key={s.name} className="chip">{s.name}</span>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-ink-500">
              <AvailabilityPill value={user.availability} />
              <span>{user.college}</span>
            </div>
            {/* AI Match Analysis */}
            <div className="mt-3 rounded-xl bg-brand-50 p-3 ring-1 ring-brand-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Brain className="h-3.5 w-3.5 text-brand-600" />
                  <p className="text-[11px] font-bold uppercase tracking-wide text-brand-700">AI Match Analysis</p>
                </div>
                <span className="text-sm font-bold text-brand-700">{score}%</span>
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-brand-800">
                ✨ {analysis.headline}
              </p>
            </div>
          </button>
        ))}
        {results.length === 0 && (
          <div className="col-span-full card p-10 text-center text-sm text-ink-500">
            No teammates match your filters. Try widening your search.
          </div>
        )}
      </div>

      {/* Profile drawer */}
      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-ink-950/50 animate-fade-in" onClick={() => setSelectedId(null)} />
          <div className="relative h-full w-full max-w-md animate-fade-up overflow-y-auto bg-white shadow-lift">
            <div className="mesh-bg relative p-6 text-white">
              <button onClick={() => setSelectedId(null)} className="absolute right-4 top-4 text-white/80 hover:text-white">
                ✕
              </button>
              <Avatar user={selected} size="xl" ring />
              <h2 className="font-display mt-4 text-2xl font-bold">
                {selected.name}
                {selected.collegeEmailVerified && <BadgeCheck className="ml-2 inline h-5 w-5 text-brand-200" />}
              </h2>
              <p className="text-sm text-brand-50/90">{selected.major} · {selected.year} · {selected.college}</p>
            </div>
            <div className="space-y-5 p-6">
              <p className="text-sm text-ink-700">{selected.bio}</p>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">Skills</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selected.skills.map((s) => (
                    <span key={s.name} className="inline-flex items-center gap-2 rounded-lg bg-ink-50 px-2.5 py-1 text-xs font-medium text-ink-700">
                      {s.name} <SkillLevelPill level={s.level} />
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">Roles</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selected.roles.map((r) => (
                    <span key={r} className="chip-brand">{r}</span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">Interests</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selected.interests.map((i) => (
                    <span key={i} className="chip">{i}</span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <Stat label="Collab score" value={selected.collaborationScore} />
                <Stat label="Projects" value={selected.projectsCompleted} />
                <Stat label="Response" value={`${selected.responseRate}%`} />
              </div>

              {/* AI Match Analysis detail */}
              {(() => {
                const analysis = matchAnalysis(currentUser, selected);
                return (
                  <div className="rounded-xl border border-brand-200 bg-gradient-to-br from-brand-50 to-white p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
                          <Brain className="h-4 w-4" />
                        </div>
                        <p className="text-sm font-bold text-ink-900">AI Match Analysis</p>
                      </div>
                      <span className="text-2xl font-bold text-brand-700">{analysis.score}%</span>
                    </div>
                    <div className="mt-3 rounded-lg bg-white p-3 ring-1 ring-brand-100">
                      <p className="text-xs font-bold uppercase tracking-wide text-brand-700">Why this match</p>
                      <p className="mt-1 text-sm font-semibold text-ink-900">✨ {analysis.headline}</p>
                      <p className="mt-1 text-xs text-ink-600">{analysis.reason}</p>
                    </div>
                    <ul className="mt-3 space-y-2">
                      {analysis.factors.map((f) => (
                        <li key={f.label} className="rounded-lg bg-white/70 p-2.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-ink-800">{f.label}</span>
                            <span className="text-xs font-bold text-brand-700">{f.weight} pts</span>
                          </div>
                          <p className="mt-0.5 text-[11px] text-ink-500">{f.detail}</p>
                          <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-ink-100">
                            <div
                              className="h-full rounded-full bg-brand-500"
                              style={{ width: `${Math.min(100, (f.weight / 36) * 100)}%` }}
                            />
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })()}

              {/* Invite form */}
              <div className="rounded-xl border border-ink-100 bg-ink-50 p-4">
                <p className="text-sm font-semibold text-ink-900">Invite to a project</p>
                {sentTo === selected.id ? (
                  <div className="mt-3 rounded-lg bg-brand-50 p-3 text-sm font-semibold text-brand-700">
                    Invitation sent!
                  </div>
                ) : (
                  <div className="mt-3 space-y-3">
                    <select className="input" value={inviteProject} onChange={(e) => setInviteProject(e.target.value)}>
                      <option value="">Choose a project…</option>
                      {state.projects
                        .filter((p) => p.ownerId === currentUser.id || p.memberIds.includes(currentUser.id))
                        .map((p) => (
                          <option key={p.id} value={p.id}>{p.title}</option>
                        ))}
                    </select>
                    <select className="input" value={inviteRole} onChange={(e) => setInviteRole(e.target.value)}>
                      <option value="">Role…</option>
                      {selected.roles.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                    <textarea
                      className="input min-h-[70px]"
                      placeholder="Add a personal message…"
                      value={inviteMsg}
                      onChange={(e) => setInviteMsg(e.target.value)}
                    />
                    <button onClick={sendInvite} className="btn-primary w-full" disabled={!inviteProject || !inviteRole}>
                      <Send className="h-4 w-4" /> Send invitation
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl bg-ink-50 p-3">
      <p className="text-lg font-bold text-ink-900">{value}</p>
      <p className="text-[10px] uppercase tracking-wide text-ink-500">{label}</p>
    </div>
  );
}
