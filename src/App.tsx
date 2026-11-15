import { useState } from 'react';
import Home from './pages/Home';
import { Studio } from './pages/Studio';
import { MainLayout } from './components/layout/MainLayout';

function App() {
  const [view, setView] = useState<'home' | 'studio'>('home');

  if (view === 'home') {
    return <Home onEnterStudio={() => setView('studio')} />;
  }

  return (
    <MainLayout onNavigateHome={() => setView('home')}>
      <Studio />
    </MainLayout>
  );
}

export default App;
