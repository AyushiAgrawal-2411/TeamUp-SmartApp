import { useMemo, useState } from 'react';
import { FolderKanban, Plus, Search, Users, X } from 'lucide-react';
import { useStore } from '@/store';
import { Avatar, StatusPill } from '@/components/ui';
import type { Project, ProjectRole, ProjectStatus } from '@/types';

const allRoles: ProjectRole[] = ['Frontend', 'Backend', 'UI/UX', 'Data Science', 'ML', 'Research', 'DevOps', 'Mobile'];
const allStatuses: (ProjectStatus | 'All')[] = ['All', 'Recruiting', 'In Progress', 'Completed'];

export function Projects() {
  const { currentUser, state, getUser } = useStore();
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'All'>('All');
  const [showNew, setShowNew] = useState(false);
  const [detailId, setDetailId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return state.projects
      .filter((p) => (statusFilter === 'All' ? true : p.status === statusFilter))
      .filter((p) => {
        if (!query.trim()) return true;
        const q = query.toLowerCase();
        return p.title.toLowerCase().includes(q) || p.tagline.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
      });
  }, [state.projects, statusFilter, query]);

  if (!currentUser) return null;
  const detail = detailId ? state.projects.find((p) => p.id === detailId) : null;

  return (
    <div className="space-y-6">
      <div className="animate-fade-up flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <FolderKanban className="h-6 w-6 text-brand-600" />
            <h1 className="font-display text-3xl font-bold text-ink-900">Projects</h1>
          </div>
          <p className="mt-2 text-ink-600">Browse student projects and find one that fits your skills.</p>
        </div>
        <button onClick={() => setShowNew(true)} className="btn-primary">
          <Plus className="h-4 w-4" /> New project
        </button>
      </div>

      <div className="card animate-fade-up flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input className="input pl-9" placeholder="Search projects…" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {allStatuses.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                statusFilter === s ? 'bg-brand-600 text-white' : 'bg-ink-100 text-ink-700 hover:bg-ink-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p, i) => {
          const owner = getUser(p.ownerId);
          return (
            <button
              key={p.id}
              onClick={() => setDetailId(p.id)}
              className="card group animate-fade-up p-5 text-left transition hover:-translate-y-1 hover:shadow-lift"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="flex items-center justify-between">
                <span className="chip">{p.category}</span>
                <StatusPill status={p.status} />
              </div>
              <h3 className="mt-3 text-lg font-semibold text-ink-900">{p.title}</h3>
              <p className="mt-1 text-sm text-ink-600">{p.tagline}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {p.rolesNeeded.slice(0, 3).map((r) => (
                  <span key={r} className="chip-brand">{r}</span>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex -space-x-2">
                  {p.memberIds.slice(0, 3).map((id) => {
                    const u = getUser(id);
                    return u ? <Avatar key={id} user={u} size="xs" ring /> : null;
                  })}
                </div>
                <span className="text-xs text-ink-500">{owner?.name ?? 'Unknown'}</span>
              </div>
            </button>
          );
        })}
        {filtered.length === 0 && (
          <div className="col-span-full card p-10 text-center text-sm text-ink-500">No projects match your filters.</div>
        )}
      </div>

      {detail && <ProjectDetail project={detail} onClose={() => setDetailId(null)} />}
      {showNew && <NewProjectModal onClose={() => setShowNew(false)} />}
    </div>
  );
}

function ProjectDetail({ project, onClose }: { project: Project; onClose: () => void }) {
  const { getUser } = useStore();
  const owner = getUser(project.ownerId);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink-950/50 animate-fade-in" onClick={onClose} />
      <div className="relative w-full max-w-lg animate-scale-in rounded-2xl bg-white p-6 shadow-lift">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="chip">{project.category}</span>
              <StatusPill status={project.status} />
            </div>
            <h3 className="font-display mt-2 text-2xl font-bold text-ink-900">{project.title}</h3>
            <p className="text-sm text-ink-600">{project.tagline}</p>
          </div>
          <button onClick={onClose} className="btn-ghost p-2"><X className="h-4 w-4" /></button>
        </div>
        <p className="mt-4 text-sm text-ink-700">{project.description}</p>
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">Roles needed</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {project.rolesNeeded.map((r) => <span key={r} className="chip-brand">{r}</span>)}
          </div>
        </div>
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">Skills wanted</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {project.skillsWanted.map((s) => <span key={s} className="chip">{s}</span>)}
          </div>
        </div>
        <div className="mt-5 flex items-center justify-between rounded-xl bg-ink-50 p-3">
          <div className="flex items-center gap-3">
            {owner && <Avatar user={owner} size="sm" />}
            <div>
              <p className="text-xs text-ink-500">Owner</p>
              <p className="text-sm font-semibold text-ink-900">{owner?.name}</p>
            </div>
          </div>
          <div className="flex -space-x-2">
            {project.memberIds.map((id) => {
              const u = getUser(id);
              return u ? <Avatar key={id} user={u} size="xs" ring /> : null;
            })}
          </div>
        </div>
        <p className="mt-4 text-xs text-ink-400">Vibe: {project.vibe}</p>
      </div>
    </div>
  );
}

function NewProjectModal({ onClose }: { onClose: () => void }) {
  const { currentUser, addProject } = useStore();
  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [category, setCategory] = useState('Web App');
  const [description, setDescription] = useState('');
  const [roles, setRoles] = useState<ProjectRole[]>([]);
  const [skills, setSkills] = useState('');
  const [vibe, setVibe] = useState('');
  const [created, setCreated] = useState(false);

  if (!currentUser) return null;

  const toggleRole = (r: ProjectRole) =>
    setRoles((prev) => (prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]));

  const submit = () => {
    if (!title.trim()) return;
    addProject({
      title,
      tagline: tagline || 'A new student project',
      description: description || 'No description yet.',
      category,
      rolesNeeded: roles.length ? roles : ['Frontend'],
      skillsWanted: skills.split(',').map((s) => s.trim()).filter(Boolean),
      status: 'Recruiting',
      ownerId: currentUser.id,
      memberIds: [currentUser.id],
      vibe: vibe || 'Fresh project',
    });
    setCreated(true);
  };

  if (created) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-ink-950/50" onClick={onClose} />
        <div className="relative w-full max-w-md animate-scale-in rounded-2xl bg-white p-6 text-center shadow-lift">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 text-brand-600">
            <Users className="h-7 w-7" />
          </div>
          <h3 className="mt-4 text-lg font-bold text-ink-900">Project created!</h3>
          <p className="mt-1 text-sm text-ink-600">Your project is now visible in the demo. Teammates can start joining.</p>
          <button onClick={onClose} className="btn-primary mt-5 w-full">Done</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink-950/50 animate-fade-in" onClick={onClose} />
      <div className="relative w-full max-w-lg animate-scale-in rounded-2xl bg-white p-6 shadow-lift">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-ink-900">New project</h3>
          <button onClick={onClose} className="btn-ghost p-2"><X className="h-4 w-4" /></button>
        </div>
        <div className="mt-4 space-y-3">
          <div>
            <label className="text-xs font-semibold text-ink-700">Title</label>
            <input className="input mt-1" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Campus Compass" />
          </div>
          <div>
            <label className="text-xs font-semibold text-ink-700">Tagline</label>
            <input className="input mt-1" value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="One-line description" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-ink-700">Category</label>
              <select className="input mt-1" value={category} onChange={(e) => setCategory(e.target.value)}>
                {['Web App', 'AI', 'Data Science', 'Productivity', 'Developer Tools', 'Mobile'].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-ink-700">Vibe</label>
              <input className="input mt-1" value={vibe} onChange={(e) => setVibe(e.target.value)} placeholder="e.g. Hackathon energy" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-ink-700">Description</label>
            <textarea className="input mt-1 min-h-[80px]" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-semibold text-ink-700">Roles needed</label>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {allRoles.map((r) => (
                <button
                  key={r}
                  onClick={() => toggleRole(r)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                    roles.includes(r) ? 'bg-brand-600 text-white' : 'bg-ink-100 text-ink-700 hover:bg-ink-200'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-ink-700">Skills wanted (comma separated)</label>
            <input className="input mt-1" value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="React, Python, Figma" />
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button onClick={submit} className="btn-primary" disabled={!title.trim()}>Create project</button>
        </div>
      </div>
    </div>
  );
}
