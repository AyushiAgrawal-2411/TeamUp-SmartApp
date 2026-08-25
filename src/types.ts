export type Skill = {
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  verified?: boolean;
};
export type ProjectRole = 'Frontend' | 'Backend' | 'UI/UX' | 'Data Science' | 'ML' | 'Research' | 'DevOps' | 'Mobile';

export type ProjectStatus = 'Recruiting' | 'In Progress' | 'Completed';

export type Project = {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: string;
  rolesNeeded: ProjectRole[];
  skillsWanted: string[];
  status: ProjectStatus;
  ownerId: string;
  memberIds: string[];
  createdAt: string;
  vibe: string;
};

export type Invitation = {
  id: string;
  projectId: string;
  fromUserId: string;
  toUserId: string;
  role: ProjectRole;
  message: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
};

export type User = {
  id: string;
  name: string;
  avatarColor: string;
  initials: string;
  email: string;
  college: string;
  major: string;
  year: string;
  bio: string;
  skills: Skill[];
  roles: ProjectRole[];
  interests: string[];
  availability: 'Full-time' | 'Part-time' | 'Weekends only' | 'Limited';
  collegeEmailVerified: boolean;
  collaborationScore: number;
  projectsCompleted: number;
  responseRate: number;
  links: { label: string; url: string }[];
  isCurrentUser?: boolean;
};

export type Report = {
  id: string;
  reporterId: string;
  targetUserId: string;
  reason: string;
  detail: string;
  createdAt: string;
};

export type PrivacyLevel = 'public' | 'college-only' | 'private';

export type AppState = {
  currentUserId: string | null;
  users: User[];
  projects: Project[];
  invitations: Invitation[];
  reports: Report[];
  blockedUserIds: string[];
  privacy: PrivacyLevel;
};
