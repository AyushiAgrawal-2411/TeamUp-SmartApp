import { useState } from 'react';
import { BadgeCheck, Check, Link2, Pencil, Plus, Save, Sparkles, Trash2, X } from 'lucide-react';
import { useStore } from '@/store';
import { Avatar, ScoreRing, SkillLevelPill, AvailabilityPill, StatusPill } from '@/components/ui';
import type { Skill, User } from '@/types';

const allSkills = ['React', 'TypeScript', 'Node.js', 'Python', 'Figma', 'PyTorch', 'SQL', 'Django', 'Docker', 'Research', 'Presentation', 'Canva', 'Tailwind', 'Pandas', 'TensorFlow'];

export function Profile() {
  const { currentUser, state, updateCurrentUser, getUser } = useStore();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<User | null>(null);

  if (!currentUser) return null;
  const profile = editing && draft ? draft : currentUser;

  const myProjects = state.projects.filter(
    (p) => p.ownerId === currentUser.id || p.memberIds.includes(currentUser.id)
  );

  const startEdit = () => {
    setDraft({ ...currentUser });
    setEditing(true);
  };
  const save = () => {
    if (draft) updateCurrentUser(draft);
    setEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header card */}
      <div className="card animate-fade-up overflow-hidden">
        <div className="mesh-bg relative h-28" />
        <div className="px-6 pb-6">
          <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <Avatar user={profile} size="xl" ring />
              <div className="pb-1">
                <div className="flex items-center gap-2">
                  <h1 className="font-display text-2xl font-bold text-ink-900">{profile.name}</h1>
                  {profile.collegeEmailVerified && <BadgeCheck className="h-5 w-5 text-brand-500" />}
                </div>
                <p className="text-sm text-ink-600">{profile.major} · {profile.year} · {profile.college}</p>
                <p className="text-xs text-ink-500">{profile.email}</p>
              </div>
            </div>
            <div className="flex gap-2">
              {editing ? (
                <>
                  <button onClick={() => setEditing(false)} className="btn-secondary"><X className="h-4 w-4" /> Cancel</button>
                  <button onClick={save} className="btn-primary"><Save className="h-4 w-4" /> Save</button>
                </>
              ) : (
                <button onClick={startEdit} className="btn-secondary"><Pencil className="h-4 w-4" /> Edit profile</button>
              )}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="flex items-center gap-3 rounded-xl bg-ink-50 p-3">
              <ScoreRing score={profile.collaborationScore} size={48} />
              <div>
                <p className="text-xs text-ink-500">Collab score</p>
                <p className="text-sm font-semibold text-ink-900">{profile.collaborationScore}/100</p>
              </div>
            </div>
            <div className="rounded-xl bg-ink-50 p-3">
              <p className="text-lg font-bold text-ink-900">{profile.projectsCompleted}</p>
              <p className="text-xs text-ink-500">Projects completed</p>
            </div>
            <div className="rounded-xl bg-ink-50 p-3">
              <p className="text-lg font-bold text-ink-900">{profile.responseRate}%</p>
              <p className="text-xs text-ink-500">Response rate</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: bio + skills */}
        <div className="space-y-6 lg:col-span-2">
          <section className="card animate-fade-up p-6">
            <h2 className="font-semibold text-ink-900">About</h2>
            {editing ? (
              <textarea
                className="input mt-3 min-h-[80px]"
                value={draft?.bio ?? ''}
                onChange={(e) => setDraft((d) => (d ? { ...d, bio: e.target.value } : d))}
              />
            ) : (
              <p className="mt-2 text-sm text-ink-700">{profile.bio}</p>
            )}

            <div className="mt-5 flex flex-wrap gap-2">
              <AvailabilityPill value={profile.availability} />
              {profile.roles.map((r) => <span key={r} className="chip-brand">{r}</span>)}
            </div>

            <div className="mt-5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">Skills</p>
                {editing && <span className="text-xs text-ink-400">Click a skill to add</span>}
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {profile.skills.map((s) => (
                  <div key={s.name} className="inline-flex items-center gap-2 rounded-lg bg-ink-50 px-2.5 py-1 text-xs font-medium text-ink-700">
                    {s.name} <SkillLevelPill level={s.level} />
                    {editing && (
                      <button
                        onClick={() => setDraft((d) => d ? { ...d, skills: d.skills.filter((x) => x.name !== s.name) } : d)}
                        className="text-ink-400 hover:text-red-500"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                ))}
                {editing && (
                  <div className="flex flex-wrap gap-1.5">
                    {allSkills
                      .filter((n) => !profile.skills.some((s) => s.name === n))
                      .slice(0, 6)
                      .map((n) => (
                        <button
                          key={n}
                          onClick={() => setDraft((d) => d ? { ...d, skills: [...d.skills, { name: n, level: 'Intermediate' }] } : d)}
                          className="inline-flex items-center gap-1 rounded-full border border-dashed border-ink-300 px-2.5 py-1 text-xs text-ink-600 hover:border-brand-400 hover:text-brand-700"
                        >
                          <Plus className="h-3 w-3" /> {n}
                        </button>
                      ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">Interests</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {editing ? (
                  <input
                    className="input"
                    value={draft?.interests.join(', ') ?? ''}
                    onChange={(e) => setDraft((d) => d ? { ...d, interests: e.target.value.split(',').map((x) => x.trim()).filter(Boolean) } : d)}
                  />
                ) : (
                  profile.interests.map((i) => <span key={i} className="chip">{i}</span>)
                )}
              </div>
            </div>
          </section>

          {/* My projects */}
          <section className="card animate-fade-up p-6">
            <h2 className="font-semibold text-ink-900">My Projects</h2>
            <ul className="mt-3 divide-y divide-ink-100">
              {myProjects.map((p) => (
                <li key={p.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-semibold text-ink-900">{p.title}</p>
                    <p className="text-xs text-ink-500">{p.tagline}</p>
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
                <li className="py-6 text-center text-sm text-ink-500">No projects yet.</li>
              )}
            </ul>
          </section>
        </div>

        {/* Right: side info */}
        <div className="space-y-6">
          <section className="card animate-fade-up p-6">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-brand-600" />
              <h2 className="font-semibold text-ink-900">Verification</h2>
            </div>
            <div className="mt-3 flex items-center gap-3 rounded-xl bg-ink-50 p-3">
              <Avatar user={profile} size="sm" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-ink-900">{profile.email}</p>
                <p className="text-xs text-ink-500">{profile.college}</p>
              </div>
              {profile.collegeEmailVerified ? (
                <span className="chip-brand"><Check className="h-3.5 w-3.5" /> Verified</span>
              ) : (
                <span className="badge bg-ink-100 text-ink-600">Unverified</span>
              )}
            </div>
          </section>

          <section className="card animate-fade-up p-6">
            <div className="flex items-center gap-2">
              <Link2 className="h-4 w-4 text-ink-700" />
              <h2 className="font-semibold text-ink-900">Links</h2>
            </div>
            {profile.links.length === 0 ? (
              <p className="mt-2 text-sm text-ink-500">No links added yet.</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {profile.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-medium text-brand-700 hover:underline"
                    >
                      <Link2 className="h-4 w-4" /> {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
