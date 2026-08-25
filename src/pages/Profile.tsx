import { useState } from 'react';
import {
  BadgeCheck,
  Check,
  Link2,
  Pencil,
  Plus,
  Save,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';

import { useStore } from '@/store';
import {
  Avatar,
  ScoreRing,
  SkillLevelPill,
  AvailabilityPill,
  StatusPill,
} from '@/components/ui';

import type { User } from '@/types';

const allSkills = [
  'React',
  'TypeScript',
  'Node.js',
  'Python',
  'Figma',
  'PyTorch',
  'SQL',
  'Django',
  'Docker',
  'Research',
  'Presentation',
  'Canva',
  'Tailwind',
  'Pandas',
  'TensorFlow',
];

type Question = {
  question: string;
  options: string[];
  answer: number;
};

const skillQuestions: Record<string, Question[]> = {
  React: [
    {
      question: 'Which hook is used to manage state in a React component?',
      options: ['useState', 'useRoute', 'useStyle', 'useData'],
      answer: 0,
    },
    {
      question: 'Which syntax is commonly used to pass data from parent to child?',
      options: ['Props', 'SQL', 'Routes', 'CSS'],
      answer: 0,
    },
    {
      question: 'What does JSX allow you to write?',
      options: [
        'HTML-like UI inside JavaScript',
        'SQL queries',
        'Java classes',
        'Database schemas',
      ],
      answer: 0,
    },
    {
      question: 'Which hook is commonly used for side effects?',
      options: ['useEffect', 'useStyle', 'usePage', 'useHTML'],
      answer: 0,
    },
    {
      question: 'What is a React component?',
      options: [
        'A reusable UI building block',
        'A database table',
        'A CSS file',
        'A server',
      ],
      answer: 0,
    },
  ],

  Python: [
    {
      question: 'Which keyword defines a function in Python?',
      options: ['def', 'func', 'function', 'method'],
      answer: 0,
    },
    {
      question: 'Which data type stores key-value pairs?',
      options: ['Dictionary', 'List', 'Tuple', 'Set'],
      answer: 0,
    },
    {
      question: 'Which symbol starts a comment in Python?',
      options: ['#', '//', '/*', '--'],
      answer: 0,
    },
    {
      question: 'Which function is commonly used to display output?',
      options: ['print()', 'display()', 'write()', 'show()'],
      answer: 0,
    },
    {
      question: 'Which of these is mutable?',
      options: ['List', 'Tuple', 'String', 'Integer'],
      answer: 0,
    },
  ],

  TypeScript: [
    {
      question: 'Which keyword is used to define a type alias?',
      options: ['type', 'define', 'interfaceOnly', 'typedef'],
      answer: 0,
    },
    {
      question: 'Which type represents text?',
      options: ['string', 'text', 'StringType', 'char'],
      answer: 0,
    },
    {
      question: 'TypeScript is a superset of which language?',
      options: ['JavaScript', 'Python', 'Java', 'C++'],
      answer: 0,
    },
    {
      question: 'Which symbol is commonly used for optional properties?',
      options: ['?', '!', '#', '@'],
      answer: 0,
    },
    {
      question: 'Which keyword defines an interface?',
      options: ['interface', 'struct', 'classType', 'contract'],
      answer: 0,
    },
  ],

  SQL: [
    {
      question: 'Which command is used to retrieve data?',
      options: ['SELECT', 'GET', 'FETCHALL', 'READ'],
      answer: 0,
    },
    {
      question: 'Which clause filters rows?',
      options: ['WHERE', 'FILTER', 'WHEN', 'CHECK'],
      answer: 0,
    },
    {
      question: 'Which command adds new rows?',
      options: ['INSERT', 'ADD', 'PUSH', 'CREATE'],
      answer: 0,
    },
    {
      question: 'Which command modifies existing data?',
      options: ['UPDATE', 'CHANGE', 'MODIFY', 'ALTERROW'],
      answer: 0,
    },
    {
      question: 'Which command removes rows?',
      options: ['DELETE', 'REMOVE', 'DROP ROW', 'CLEAR'],
      answer: 0,
    },
  ],
};

export function Profile() {
  const {
    currentUser,
    state,
    updateCurrentUser,
    getUser,
  } = useStore();

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<User | null>(null);

  const [verifySkill, setVerifySkill] = useState<string | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  if (!currentUser) return null;

  const profile = editing && draft ? draft : currentUser;

  const myProjects = state.projects.filter(
    (p) =>
      p.ownerId === currentUser.id ||
      p.memberIds.includes(currentUser.id),
  );

  const startEdit = () => {
    setDraft({
      ...currentUser,
      skills: currentUser.skills.map((skill) => ({
        ...skill,
      })),
    });

    setEditing(true);
  };

  const save = () => {
    if (draft) {
      updateCurrentUser(draft);
    }

    setEditing(false);
    setDraft(null);
  };

  const openVerification = (skillName: string) => {
    setVerifySkill(skillName);
    setQuizAnswers([]);
    setQuizSubmitted(false);
  };

  const closeVerification = () => {
    setVerifySkill(null);
    setQuizAnswers([]);
    setQuizSubmitted(false);
  };

  const submitVerification = () => {
    if (!verifySkill) return;

    const questions = skillQuestions[verifySkill];

    if (!questions) return;

    const score = questions.reduce(
      (total: number, question: Question, index: number) =>
        total +
        (quizAnswers[index] === question.answer ? 1 : 0),
      0,
    );

    setQuizSubmitted(true);

    if (score >= 4) {
      const updatedUser: User = {
        ...currentUser,
        skills: currentUser.skills.map((skill) =>
          skill.name === verifySkill
            ? {
                ...skill,
                verified: true,
              }
            : skill,
        ),
      };

      updateCurrentUser(updatedUser);
    }
  };

  const getScore = () => {
    if (!verifySkill) return 0;

    const questions = skillQuestions[verifySkill];

    if (!questions) return 0;

    return questions.reduce(
      (total: number, question: Question, index: number) =>
        total +
        (quizAnswers[index] === question.answer ? 1 : 0),
      0,
    );
  };

  return (
    <>
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
                    <h1 className="font-display text-2xl font-bold text-ink-900">
                      {profile.name}
                    </h1>

                    {profile.collegeEmailVerified && (
                      <BadgeCheck className="h-5 w-5 text-brand-500" />
                    )}
                  </div>

                  <p className="text-sm text-ink-600">
                    {profile.major} · {profile.year} · {profile.college}
                  </p>

                  <p className="text-xs text-ink-500">
                    {profile.email}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                {editing ? (
                  <>
                    <button
                      onClick={() => {
                        setEditing(false);
                        setDraft(null);
                      }}
                      className="btn-secondary"
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </button>

                    <button
                      onClick={save}
                      className="btn-primary"
                    >
                      <Save className="h-4 w-4" />
                      Save
                    </button>
                  </>
                ) : (
                  <button
                    onClick={startEdit}
                    className="btn-secondary"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit profile
                  </button>
                )}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="flex items-center gap-3 rounded-xl bg-ink-50 p-3">
                <ScoreRing
                  score={profile.collaborationScore}
                  size={48}
                />

                <div>
                  <p className="text-xs text-ink-500">
                    Collab score
                  </p>

                  <p className="text-sm font-semibold text-ink-900">
                    {profile.collaborationScore}/100
                  </p>
                </div>
              </div>

              <div className="rounded-xl bg-ink-50 p-3">
                <p className="text-lg font-bold text-ink-900">
                  {profile.projectsCompleted}
                </p>

                <p className="text-xs text-ink-500">
                  Projects completed
                </p>
              </div>

              <div className="rounded-xl bg-ink-50 p-3">
                <p className="text-lg font-bold text-ink-900">
                  {profile.responseRate}%
                </p>

                <p className="text-xs text-ink-500">
                  Response rate
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left */}
          <div className="space-y-6 lg:col-span-2">
            {/* About */}
            <section className="card animate-fade-up p-6">
              <h2 className="font-semibold text-ink-900">
                About
              </h2>

              {editing ? (
                <textarea
                  className="input mt-3 min-h-[80px]"
                  value={draft?.bio ?? ''}
                  onChange={(e) =>
                    setDraft((d) =>
                      d
                        ? {
                            ...d,
                            bio: e.target.value,
                          }
                        : d,
                    )
                  }
                />
              ) : (
                <p className="mt-2 text-sm text-ink-700">
                  {profile.bio}
                </p>
              )}

              <div className="mt-5 flex flex-wrap gap-2">
                <AvailabilityPill
                  value={profile.availability}
                />

                {profile.roles.map((role) => (
                  <span
                    key={role}
                    className="chip-brand"
                  >
                    {role}
                  </span>
                ))}
              </div>

              {/* Skills */}
              <div className="mt-5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                    Skills
                  </p>

                  {editing && (
                    <span className="text-xs text-ink-400">
                      Click a skill to add
                    </span>
                  )}
                </div>

                <div className="mt-2 flex flex-wrap gap-2">
                  {profile.skills.map((skill) => (
                    <div
                      key={skill.name}
                      className="inline-flex items-center gap-2 rounded-lg bg-ink-50 px-2.5 py-1 text-xs font-medium text-ink-700"
                    >
                      <span>{skill.name}</span>

                      <SkillLevelPill
                        level={skill.level}
                      />

                      {/* VERIFIED */}
                      {skill.verified ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-semibold text-brand-700">
                          <BadgeCheck className="h-3 w-3" />
                          Verified
                        </span>
                      ) : !editing ? (
                        <button
                          onClick={() =>
                            openVerification(skill.name)
                          }
                          className="rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-semibold text-brand-700 hover:bg-brand-100"
                        >
                          Verify
                        </button>
                      ) : null}

                      {/* DELETE */}
                      {editing && (
                        <button
                          onClick={() =>
                            setDraft((d) =>
                              d
                                ? {
                                    ...d,
                                    skills:
                                      d.skills.filter(
                                        (x) =>
                                          x.name !==
                                          skill.name,
                                      ),
                                  }
                                : d,
                            )
                          }
                          className="text-ink-400 hover:text-red-500"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  ))}

                  {/* ADD SKILLS */}
                  {editing && (
                    <div className="flex flex-wrap gap-1.5">
                      {allSkills
                        .filter(
                          (name) =>
                            !profile.skills.some(
                              (skill) =>
                                skill.name === name,
                            ),
                        )
                        .slice(0, 6)
                        .map((name) => (
                          <button
                            key={name}
                            onClick={() =>
                              setDraft((d) =>
                                d
                                  ? {
                                      ...d,
                                      skills: [
                                        ...d.skills,
                                        {
                                          name,
                                          level:
                                            'Intermediate',
                                        },
                                      ],
                                    }
                                  : d,
                              )
                            }
                            className="inline-flex items-center gap-1 rounded-full border border-dashed border-ink-300 px-2.5 py-1 text-xs text-ink-600 hover:border-brand-400 hover:text-brand-700"
                          >
                            <Plus className="h-3 w-3" />
                            {name}
                          </button>
                        ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Interests */}
              <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                  Interests
                </p>

                <div className="mt-2 flex flex-wrap gap-2">
                  {editing ? (
                    <input
                      className="input"
                      value={
                        draft?.interests.join(', ') ?? ''
                      }
                      onChange={(e) =>
                        setDraft((d) =>
                          d
                            ? {
                                ...d,
                                interests:
                                  e.target.value
                                    .split(',')
                                    .map((x) =>
                                      x.trim(),
                                    )
                                    .filter(Boolean),
                              }
                            : d,
                        )
                      }
                    />
                  ) : (
                    profile.interests.map((interest) => (
                      <span
                        key={interest}
                        className="chip"
                      >
                        {interest}
                      </span>
                    ))
                  )}
                </div>
              </div>
            </section>

            {/* My Projects */}
            <section className="card animate-fade-up p-6">
              <h2 className="font-semibold text-ink-900">
                My Projects
              </h2>

              <ul className="mt-3 divide-y divide-ink-100">
                {myProjects.map((project) => (
                  <li
                    key={project.id}
                    className="flex items-center justify-between py-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-ink-900">
                        {project.title}
                      </p>

                      <p className="text-xs text-ink-500">
                        {project.tagline}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-2">
                        {project.memberIds
                          .slice(0, 3)
                          .map((id) => {
                            const user = getUser(id);

                            return user ? (
                              <Avatar
                                key={id}
                                user={user}
                                size="xs"
                                ring
                              />
                            ) : null;
                          })}
                      </div>

                      <StatusPill
                        status={project.status}
                      />
                    </div>
                  </li>
                ))}

                {myProjects.length === 0 && (
                  <li className="py-6 text-center text-sm text-ink-500">
                    No projects yet.
                  </li>
                )}
              </ul>
            </section>
          </div>

          {/* Right */}
          <div className="space-y-6">
            {/* Verification */}
            <section className="card animate-fade-up p-6">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-brand-600" />

                <h2 className="font-semibold text-ink-900">
                  Verification
                </h2>
              </div>

              <div className="mt-3 flex items-center gap-3 rounded-xl bg-ink-50 p-3">
                <Avatar user={profile} size="sm" />

                <div className="flex-1">
                  <p className="text-sm font-semibold text-ink-900">
                    {profile.email}
                  </p>

                  <p className="text-xs text-ink-500">
                    {profile.college}
                  </p>
                </div>

                {profile.collegeEmailVerified ? (
                  <span className="chip-brand">
                    <Check className="h-3.5 w-3.5" />
                    Verified
                  </span>
                ) : (
                  <span className="badge bg-ink-100 text-ink-600">
                    Unverified
                  </span>
                )}
              </div>
            </section>

            {/* Links */}
            <section className="card animate-fade-up p-6">
              <div className="flex items-center gap-2">
                <Link2 className="h-4 w-4 text-ink-700" />

                <h2 className="font-semibold text-ink-900">
                  Links
                </h2>
              </div>

              {profile.links.length === 0 ? (
                <p className="mt-2 text-sm text-ink-500">
                  No links added yet.
                </p>
              ) : (
                <ul className="mt-3 space-y-2">
                  {profile.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-medium text-brand-700 hover:underline"
                      >
                        <Link2 className="h-4 w-4" />
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        </div>
      </div>

      {/* Skill Verification Modal */}
      {verifySkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-ink-950/50"
            onClick={closeVerification}
          />

          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-lift">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
                  Skill Verification
                </p>

                <h3 className="mt-1 text-xl font-bold text-ink-900">
                  {verifySkill}
                </h3>
              </div>

              <button
                onClick={closeVerification}
                className="btn-ghost p-2"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {!skillQuestions[verifySkill] ? (
              <div className="mt-6 rounded-xl bg-ink-50 p-4">
                <p className="text-sm text-ink-700">
                  A verification assessment for{' '}
                  <strong>{verifySkill}</strong> is coming soon.
                </p>

                <button
                  onClick={closeVerification}
                  className="btn-primary mt-4"
                >
                  Close
                </button>
              </div>
            ) : !quizSubmitted ? (
              <div className="mt-6">
                <p className="text-sm text-ink-600">
                  Answer all 5 questions. You need at least
                  4 correct answers to earn a verified badge.
                </p>

                <div className="mt-5 space-y-5">
                  {skillQuestions[verifySkill].map(
                    (question, index) => (
                      <div key={question.question}>
                        <p className="text-sm font-semibold text-ink-900">
                          {index + 1}.{' '}
                          {question.question}
                        </p>

                        <div className="mt-2 grid gap-2">
                          {question.options.map(
                            (option, optionIndex) => (
                              <button
                                key={option}
                                onClick={() =>
                                  setQuizAnswers(
                                    (previous) => {
                                      const next = [
                                        ...previous,
                                      ];

                                      next[index] =
                                        optionIndex;

                                      return next;
                                    },
                                  )
                                }
                                className={`rounded-xl border px-3 py-2 text-left text-sm transition ${
                                  quizAnswers[index] ===
                                  optionIndex
                                    ? 'border-brand-500 bg-brand-50 text-brand-700'
                                    : 'border-ink-200 bg-white text-ink-700 hover:bg-ink-50'
                                }`}
                              >
                                {option}
                              </button>
                            ),
                          )}
                        </div>
                      </div>
                    ),
                  )}
                </div>

                <button
                  className="btn-primary mt-6 w-full"
                  disabled={
                    quizAnswers.filter(
                      (answer) => answer !== undefined,
                    ).length !== 5
                  }
                  onClick={submitVerification}
                >
                  Submit Assessment
                </button>
              </div>
            ) : (
              <div className="mt-6 rounded-xl bg-ink-50 p-5">
                <p className="text-lg font-bold text-ink-900">
                  Score: {getScore()}/5
                </p>

                {getScore() >= 4 ? (
                  <>
                    <div className="mt-3 flex items-center gap-2 text-brand-700">
                      <BadgeCheck className="h-5 w-5" />

                      <p className="text-sm font-semibold">
                        Skill verified successfully!
                      </p>
                    </div>

                    <p className="mt-2 text-sm text-ink-600">
                      A verified badge has been added to your{' '}
                      {verifySkill} skill.
                    </p>
                  </>
                ) : (
                  <p className="mt-2 text-sm text-ink-600">
                    You need at least 4 correct answers to
                    verify this skill. You can try again later.
                  </p>
                )}

                <button
                  onClick={closeVerification}
                  className="btn-primary mt-5 w-full"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}