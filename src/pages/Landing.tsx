import { useState } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  Blocks,
  Brain,
  GraduationCap,
  Handshake,
  Puzzle,
  Rocket,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
} from 'lucide-react';
import { useStore } from '@/store';
import { Avatar } from '@/components/ui';
import { matchAnalysis } from '@/lib/compatibility';
import { demoUsers } from '@/data/demo';

const sampleYou = demoUsers.find((u) => u.id === 'u_current')!;

const stats = [
  { label: 'Smart Matching', value: '5+ factors', icon: Brain },
  { label: 'Skill-gap detection', value: 'Real-time', icon: Puzzle },
  { label: 'Recommendations', value: 'Live', icon: Zap },
  { label: 'Verified community', value: 'College-only', icon: ShieldCheck },
];

const factors = [
  { icon: Puzzle, title: 'Skill-gap detection', body: 'The engine detects which skills your team is missing and surfaces teammates who fill that exact gap.' },
  { icon: Brain, title: 'Interest alignment', body: 'Shared interests predict smoother collaboration. We weigh overlap on AI, design, research, and more.' },
  { icon: Zap, title: 'Availability sync', body: 'Matching schedules matter. Full-time, part-time, and weekend-only availability factor into every score.' },
  { icon: ShieldCheck, title: 'Trust signals', body: 'Verified college emails and collaboration history boost a teammate\u2019s match confidence.' },
];

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Smart Matching',
    body: 'Find teammates based on skills, interests, availability & project requirements \u2014 not just keywords.',
  },
  {
    icon: ShieldCheck,
    title: 'Built for college trust',
    body: 'College email verification, verified badges, reporting, and blocking keep your community safe.',
  },
  {
    icon: Blocks,
    title: 'Projects, not just profiles',
    body: 'Browse real student projects and join the ones that fit your goals and availability.',
  },
  {
    icon: Handshake,
    title: 'Invitations that convert',
    body: 'Send and receive project invites with role context and a personal message.',
  },
];

const steps = [
  { icon: GraduationCap, title: 'Verify your college email', body: 'Get a verified badge so teammates know you\u2019re real.' },
  { icon: Brain, title: 'Get AI-matched', body: 'Our engine ranks teammates by compatibility across 5+ factors.' },
  { icon: Rocket, title: 'Build together', body: 'Join a project or start your own and ship something great.' },
];

export function Landing({ onEnter }: { onEnter: () => void }) {
  const { state } = useStore();
  const [showLogin, setShowLogin] = useState(false);
  const sample = state.users.filter((u) => !u.isCurrentUser).slice(0, 5);

  const handleEnter = () => {
    setShowLogin(true);
  };

  return (
    <div className="min-h-screen bg-ink-50">
      <Header onLogin={handleEnter} />

      {/* Hero */}
      <section className="mesh-bg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-950/30 to-ink-950/60" />
        <div className="relative mx-auto max-w-7xl px-6 pt-20 pb-24 lg:pt-28">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="animate-fade-up text-white">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-brand-100 ring-1 ring-white/20">
                <Sparkles className="h-3.5 w-3.5" /> AI-Powered Team Matching
              </span>
              <h1 className="font-display mt-5 text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
                Find teammates who actually <span className="text-brand-300">fit</span> your project.
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-brand-50/90">
                TeamUp Smart analyzes skills, interests, availability & project requirements to recommend the
                most compatible teammates for your next hackathon, research, or side project.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button onClick={handleEnter} className="btn bg-white text-brand-800 hover:bg-brand-50">
                  Get started <ArrowRight className="h-4 w-4" />
                </button>
                <button onClick={onEnter} className="btn bg-white/10 text-white ring-1 ring-white/30 hover:bg-white/20">
                  Explore the demo
                </button>
              </div>
              <dl className="relative mt-12 grid max-w-lg grid-cols-2 gap-5 sm:grid-cols-4">
                {stats.map((s) => (
                  <div key={s.label} className="rounded-xl bg-white/5 p-3 ring-1 ring-white/10">
                    <s.icon className="h-5 w-5 text-brand-300" />
                    <dt className="mt-2 text-lg font-bold text-white">{s.value}</dt>
                    <dd className="mt-0.5 text-[11px] text-brand-100/80">{s.label}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="relative animate-fade-up [animation-delay:120ms] lg:z-10">
              <div className="relative mx-auto max-w-md rounded-3xl bg-white/95 p-5 shadow-lift backdrop-blur">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4 text-brand-600" />
                    <p className="text-sm font-semibold text-ink-900">AI Match Recommendations</p>
                  </div>
                  <span className="chip-brand">Live</span>
                </div>
                <ul className="mt-4 space-y-3">
                  {sample.map((u) => {
                    const analysis = matchAnalysis(sampleYou, u);
                    return (
                      <li
                        key={u.id}
                        className="rounded-2xl border border-ink-100 bg-white p-3 transition hover:shadow-soft"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar user={u} />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-ink-900">
                              {u.name}{' '}
                              {u.collegeEmailVerified && <BadgeCheck className="ml-0.5 inline h-3.5 w-3.5 text-brand-500" />}
                            </p>
                            <p className="truncate text-xs text-ink-500">
                              {u.roles.join(' \u00b7 ')} · {u.college}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 rounded-full bg-brand-50 px-2 py-1 text-xs font-bold text-brand-700">
                            {analysis.score}%
                          </div>
                        </div>
                        <p className="mt-2 line-clamp-1 text-[11px] font-medium text-brand-700">
                          ✨ {analysis.headline}
                        </p>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="animate-float absolute -right-4 -top-4 hidden rounded-2xl bg-white p-3 shadow-lift sm:block">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                    <Brain className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-ink-900">AI analysis</p>
                    <p className="text-[10px] text-ink-500">5+ factors scored</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold text-ink-900 sm:text-4xl">
            Everything you need to form the right team
          </h2>
          <p className="mt-4 text-ink-600">
            From first match to shipped project, TeamUp Smart keeps the whole flow in one place.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="card p-6 transition hover:-translate-y-1 hover:shadow-lift">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-ink-900">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How the AI matches you */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 ring-1 ring-brand-200">
              <Brain className="h-3.5 w-3.5" /> How the AI matches you
            </div>
            <h2 className="font-display mt-4 text-3xl font-bold text-ink-900 sm:text-4xl">
              Five factors. One compatibility score.
            </h2>
            <p className="mt-4 text-ink-600">
              Every recommendation is powered by a transparent scoring engine — no black box.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {factors.map((f) => (
              <div key={f.title} className="rounded-2xl border border-ink-100 bg-ink-50/50 p-6 transition hover:-translate-y-1 hover:border-brand-200 hover:bg-white hover:shadow-soft">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600 text-white">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-ink-900">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">{f.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 p-6 text-white shadow-soft">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <Brain className="h-8 w-8 text-brand-200" />
                <div>
                  <p className="font-display text-lg font-bold">AI Match Analysis</p>
                  <p className="text-sm text-brand-50/90">Every teammate comes with a score and a human-readable reason.</p>
                </div>
              </div>
              <div className="rounded-xl bg-white/10 px-4 py-3 ring-1 ring-white/20">
                <p className="text-xs text-brand-100">Example reason</p>
                <p className="text-sm font-semibold text-white">✨ Fills your team's biggest skill gap in UI/UX</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-ink-50 py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center">
            <h2 className="font-display text-3xl font-bold text-ink-900 sm:text-4xl">How it works</h2>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {steps.map((s, i) => (
              <div key={s.title} className="relative text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-soft">
                  <s.icon className="h-6 w-6" />
                </div>
                <div className="mt-4 text-xs font-bold text-brand-600">Step {i + 1}</div>
                <h3 className="mt-1 text-lg font-semibold text-ink-900">{s.title}</h3>
                <p className="mt-2 text-sm text-ink-600">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mesh-bg relative overflow-hidden rounded-3xl px-8 py-14 text-center text-white shadow-lift">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-brand-900/40 to-ink-950/40" />
          <Brain className="mx-auto h-10 w-10 text-brand-200" />
          <h2 className="font-display mt-4 text-3xl font-bold sm:text-4xl">Your AI-matched team is one click away.</h2>
          <p className="mx-auto mt-3 max-w-xl text-brand-50/90">
            Jump into the live demo and see smart matching in action with a fully populated community.
          </p>
          <button onClick={handleEnter} className="btn mx-auto mt-7 bg-white text-brand-800 hover:bg-brand-50">
            Enter the demo <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      <Footer />
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} onEnter={onEnter} />}
    </div>
  );
}

function Header({ onLogin }: { onLogin: () => void }) {
  return (
    <header className="sticky top-0 z-30 border-b border-ink-100 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
            <Users className="h-5 w-5" />
          </div>
          <span className="font-display text-lg font-bold tracking-tight text-ink-900">TeamUp Smart</span>
        </div>
        <nav className="hidden items-center gap-8 text-sm font-medium text-ink-600 md:flex">
          <a href="#features" className="hover:text-ink-900">Features</a>
          <a href="#how" className="hover:text-ink-900">How it works</a>
          <a href="#trust" className="hover:text-ink-900">Trust & Safety</a>
        </nav>
        <button onClick={onLogin} className="btn-primary">
          Sign in
        </button>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-ink-100 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-ink-500 sm:flex-row">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600 text-white">
            <Users className="h-4 w-4" />
          </div>
          <span className="font-semibold text-ink-700">TeamUp Smart</span>
        </div>
        <p>Built for college communities. Demo data shown.</p>
      </div>
    </footer>
  );
}

function LoginModal({ onClose, onEnter }: { onClose: () => void; onEnter: () => void }) {
  const { state, login } = useStore();
  const pickable = state.users;
  const [email, setEmail] = useState('you@college.edu');
  const [password, setPassword] = useState('demo1234');

  const submit = () => {
    login('u_current');
    onEnter();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink-950/50 animate-fade-in" onClick={onClose} />
      <div className="relative w-full max-w-md animate-scale-in rounded-2xl bg-white p-6 shadow-lift">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
            <Users className="h-5 w-5" />
          </div>
          <span className="font-display text-lg font-bold text-ink-900">TeamUp Smart</span>
        </div>
        <h3 className="mt-5 text-xl font-bold text-ink-900">Welcome back</h3>
        <p className="mt-1 text-sm text-ink-500">Sign in with your college email to continue.</p>
        <form
          className="mt-5 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <div>
            <label className="text-xs font-semibold text-ink-700">College email</label>
            <input className="input mt-1" value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
          </div>
          <div>
            <label className="text-xs font-semibold text-ink-700">Password</label>
            <input className="input mt-1" value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
          </div>
          <button type="submit" className="btn-primary w-full">
            Sign in
          </button>
        </form>
        <div className="mt-5 rounded-xl bg-ink-50 p-3 text-xs text-ink-600">
          <p className="font-semibold text-ink-700">Quick demo sign-in</p>
          <p className="mt-1">Pick a profile to explore the app as that student:</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {pickable.slice(0, 4).map((u) => (
              <button
                key={u.id}
                onClick={() => {
                  login(u.id);
                  onEnter();
                }}
                className="chip hover:bg-brand-50 hover:text-brand-700"
              >
                {u.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
