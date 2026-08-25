import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { AppState, Invitation, PrivacyLevel, Project, Report, User } from '@/types';
import { initialState } from '@/data/demo';

type StoreContextType = {
  state: AppState;
  currentUser: User | null;
  login: (userId: string) => void;
  logout: () => void;
  setCurrentUserVerified: (verified: boolean) => void;
  updateCurrentUser: (patch: Partial<User>) => void;
  setPrivacy: (level: PrivacyLevel) => void;
  blockUser: (userId: string) => void;
  unblockUser: (userId: string) => void;
  reportUser: (report: Omit<Report, 'id' | 'createdAt'>) => void;
  respondInvitation: (id: string, status: 'accepted' | 'declined') => void;
  inviteUser: (invitation: Omit<Invitation, 'id' | 'createdAt' | 'status'>) => void;
  addProject: (project: Omit<Project, 'id' | 'createdAt'> & { id?: string; createdAt?: string }) => void;
  getUser: (id: string) => User | undefined;
  getProject: (id: string) => AppState['projects'][number] | undefined;
};

const StoreContext = createContext<StoreContextType | null>(null);

let idCounter = 1000;
const nextId = () => `gen_${idCounter++}`;

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(initialState);

  const value = useMemo<StoreContextType>(() => {
    const currentUser = state.currentUserId ? state.users.find((u) => u.id === state.currentUserId) ?? null : null;

    const patchUser = (userId: string, patch: Partial<User>) =>
      setState((s) => ({
        ...s,
        users: s.users.map((u) => (u.id === userId ? { ...u, ...patch } : u)),
      }));

    return {
      state,
      currentUser,
      login: (userId) => setState((s) => ({ ...s, currentUserId: userId })),
      logout: () => setState((s) => ({ ...s, currentUserId: null })),
      setCurrentUserVerified: (verified) => {
        if (!state.currentUserId) return;
        patchUser(state.currentUserId, { collegeEmailVerified: verified });
      },
      updateCurrentUser: (patch) => {
        if (!state.currentUserId) return;
        patchUser(state.currentUserId, patch);
      },
      setPrivacy: (level) => setState((s) => ({ ...s, privacy: level })),
      blockUser: (userId) =>
        setState((s) => ({
          ...s,
          blockedUserIds: s.blockedUserIds.includes(userId)
            ? s.blockedUserIds
            : [...s.blockedUserIds, userId],
        })),
      unblockUser: (userId) =>
        setState((s) => ({ ...s, blockedUserIds: s.blockedUserIds.filter((id) => id !== userId) })),
      reportUser: (report) =>
        setState((s) => ({
          ...s,
          reports: [...s.reports, { ...report, id: nextId(), createdAt: new Date().toISOString() }],
        })),
      respondInvitation: (id, status) =>
        setState((s) => ({
          ...s,
          invitations: s.invitations.map((inv) => (inv.id === id ? { ...inv, status } : inv)),
        })),
      inviteUser: (invitation) =>
        setState((s) => ({
          ...s,
          invitations: [
            ...s.invitations,
            { ...invitation, id: nextId(), status: 'pending', createdAt: new Date().toISOString() },
          ],
        })),
      addProject: (project) =>
        setState((s) => ({
          ...s,
          projects: [
            {
              id: project.id ?? `p_${Date.now()}`,
              createdAt: project.createdAt ?? new Date().toISOString().slice(0, 10),
              ...project,
            } as Project,
            ...s.projects,
          ],
        })),
      getUser: (id) => state.users.find((u) => u.id === id),
      getProject: (id) => state.projects.find((p) => p.id === id),
    };
  }, [state]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
