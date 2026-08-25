import type { User } from '@/types';

export function skillOverlap(a: User, b: User): number {
  const setA = new Set(a.skills.map((s) => s.name.toLowerCase()));
  const setB = new Set(b.skills.map((s) => s.name.toLowerCase()));
  let shared = 0;
  setA.forEach((s) => {
    if (setB.has(s)) shared += 1;
  });
  return shared;
}

export function interestOverlap(a: User, b: User): number {
  const setA = new Set(a.interests.map((i) => i.toLowerCase()));
  const setB = new Set(b.interests.map((i) => i.toLowerCase()));
  let shared = 0;
  setA.forEach((i) => {
    if (setB.has(i)) shared += 1;
  });
  return shared;
}

export function roleComplement(a: User, b: User): number {
  const setA = new Set(a.roles);
  const setB = new Set(b.roles);
  let complement = 0;
  setB.forEach((r) => {
    if (!setA.has(r)) complement += 1;
  });
  return complement;
}

export function complementaryRoles(a: User, b: User): string[] {
  const setA = new Set(a.roles);
  return b.roles.filter((r) => !setA.has(r));
}

export function sharedInterests(a: User, b: User): string[] {
  const setA = new Set(a.interests.map((i) => i.toLowerCase()));
  return b.interests.filter((i) => setA.has(i.toLowerCase()));
}

export function sharedSkills(a: User, b: User): string[] {
  const setA = new Set(a.skills.map((s) => s.name.toLowerCase()));
  return b.skills.filter((s) => setA.has(s.name.toLowerCase())).map((s) => s.name);
}

export function compatibility(a: User, b: User): number {
  const skillScore = Math.min(skillOverlap(a, b) * 12, 36);
  const interestScore = Math.min(interestOverlap(a, b) * 14, 28);
  const roleScore = Math.min(roleComplement(a, b) * 14, 28);
  const availabilityBonus =
    a.availability === b.availability ? 4 : a.availability === 'Full-time' ? 2 : 0;
  const verifiedBonus = b.collegeEmailVerified ? 4 : 0;
  const total = skillScore + interestScore + roleScore + availabilityBonus + verifiedBonus;
  return Math.min(100, Math.round(total));
}

export type MatchFactor = {
  label: string;
  weight: number;
  detail: string;
};

export type MatchAnalysis = {
  score: number;
  headline: string;
  reason: string;
  factors: MatchFactor[];
};

export function matchAnalysis(a: User, b: User): MatchAnalysis {
  const score = compatibility(a, b);
  const roles = complementaryRoles(a, b);
  const interests = sharedInterests(a, b);
  const skills = sharedSkills(a, b);

  const factors: MatchFactor[] = [
    {
      label: 'Skill complement',
      weight: Math.min(skillOverlap(a, b) * 12, 36),
      detail:
        skills.length > 0
          ? `Shares ${skills.length} skill${skills.length > 1 ? 's' : ''}: ${skills.slice(0, 3).join(', ')}`
          : 'No overlapping skills — brings fresh expertise',
    },
    {
      label: 'Role gap fill',
      weight: Math.min(roleComplement(a, b) * 14, 28),
      detail:
        roles.length > 0
          ? `Fills your team's gap in: ${roles.slice(0, 2).join(' & ')}`
          : 'Overlapping roles with your profile',
    },
    {
      label: 'Interest alignment',
      weight: Math.min(interestOverlap(a, b) * 14, 28),
      detail:
        interests.length > 0
          ? `Shared interests: ${interests.slice(0, 2).join(', ')}`
          : 'Different focus area — broadens scope',
    },
    {
      label: 'Availability sync',
      weight: a.availability === b.availability ? 4 : a.availability === 'Full-time' ? 2 : 0,
      detail:
        a.availability === b.availability
          ? `Matching availability: ${b.availability}`
          : `Their availability: ${b.availability}`,
    },
    {
      label: 'Trust signal',
      weight: b.collegeEmailVerified ? 4 : 0,
      detail: b.collegeEmailVerified ? 'College email verified' : 'Not yet verified',
    },
  ];

  let headline: string;
  let reason: string;
  if (roles.length > 0 && score >= 80) {
    headline = `Fills your team's biggest skill gap`;
    reason = `Their ${roles[0]} expertise complements your ${a.roles.join(' & ')} focus${
      interests.length > 0 ? `, and you share an interest in ${interests[0]}` : ''
    }.`;
  } else if (skills.length >= 2 && score >= 75) {
    headline = `Strong skill overlap with complementary roles`;
    reason = `You both know ${skills.slice(0, 2).join(' & ')}, and their ${b.roles[0]} role extends your capabilities.`;
  } else if (interests.length > 0 && score >= 70) {
    headline = `High interest alignment`;
    reason = `You both care about ${interests.slice(0, 2).join(' & ')}, making collaboration smoother.`;
  } else if (roles.length > 0) {
    headline = `Role complement for your projects`;
    reason = `They bring ${roles.slice(0, 2).join(' & ')} skills your current profile lacks.`;
  } else {
    headline = `Balanced compatibility profile`;
    reason = `A mix of shared skills and complementary availability makes them a solid teammate.`;
  }

  return { score, headline, reason, factors };
}

export function topMatches(user: User, others: User[], limit = 5): { user: User; score: number }[] {
  return others
    .filter((u) => u.id !== user.id)
    .map((u) => ({ user: u, score: compatibility(user, u) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
