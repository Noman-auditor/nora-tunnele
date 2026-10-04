import { StoreProvider, useStore } from './store';
import { BottomNav } from './components';
import { HomeScreen } from './screens/HomeScreen';
import { ProfilesScreen } from './screens/ProfilesScreen';
import { RoutingScreen } from './screens/RoutingScreen';
import { LabScreen } from './screens/LabScreen';
import { StatisticsScreen } from './screens/StatisticsScreen';
import { LogsScreen } from './screens/LogsScreen';
import { SecurityScreen } from './screens/SecurityScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import type { Screen } from './types';

function ScreenRouter({ screen }: { screen: Screen }) {
  switch (screen) {
    case 'home': return <HomeScreen />;
    case 'profiles': return <ProfilesScreen />;
    case 'routing': return <RoutingScreen />;
    case 'lab': return <LabScreen />;
    case 'statistics': return <StatisticsScreen />;
    case 'logs': return <LogsScreen />;
    case 'security': return <SecurityScreen />;
    case 'settings': return <SettingsScreen />;
    default: return <HomeScreen />;
  }
}

function AppContent() {
  const { state, navigate } = useStore();

  return (
    <div className="min-h-screen gradient-mesh">
      {/* Main Content */}
      <main className="max-w-lg mx-auto px-4 pt-4 pb-24">
        <ScreenRouter screen={state.screen} />
      </main>

      {/* Bottom Navigation */}
      <BottomNav current={state.screen} onNavigate={navigate} />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
