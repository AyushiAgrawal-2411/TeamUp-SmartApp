import { useState } from 'react';
import { StoreProvider, useStore } from '@/store';
import { Landing } from '@/pages/Landing';
import { AppShell, type View } from '@/components/AppShell';
import { Dashboard } from '@/pages/Dashboard';
import { Discover } from '@/pages/Discover';
import { Projects } from '@/pages/Projects';
import { Profile } from '@/pages/Profile';
import { TrustSafety } from '@/pages/TrustSafety';

function Routes() {
  const { currentUser } = useStore();
  const [view, setView] = useState<View>('dashboard');

  if (!currentUser) {
    return <Landing onEnter={() => setView('dashboard')} />;
  }

  return (
    <AppShell view={view} setView={setView}>
      {view === 'dashboard' && <Dashboard setView={setView} />}
      {view === 'discover' && <Discover />}
      {view === 'projects' && <Projects />}
      {view === 'profile' && <Profile />}
      {view === 'trust' && <TrustSafety />}
    </AppShell>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <Routes />
    </StoreProvider>
  );
}
