import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createBrowserRouter, Navigate } from 'react-router-dom';
import './styles/index.css';
import { LocaleProvider } from './i18n/LocaleContext';
import { SettingsProvider } from './audio/SettingsContext';
import { PlayerSelect } from './components/PlayerSelect/PlayerSelect';
import { GameMapScreen } from './components/GameMap/GameMapScreen';
import { LevelScreen } from './components/Quiz/LevelScreen';
import { LeaderboardScreen } from './components/Leaderboard/LeaderboardScreen';

const router = createBrowserRouter([
  { path: '/', element: <PlayerSelect /> },
  { path: '/leaderboard', element: <LeaderboardScreen /> },
  { path: '/play/:profileId', element: <GameMapScreen /> },
  { path: '/play/:profileId/level/:levelId', element: <LevelScreen /> },
  { path: '*', element: <Navigate to="/" replace /> },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LocaleProvider>
      <SettingsProvider>
        <RouterProvider router={router} />
      </SettingsProvider>
    </LocaleProvider>
  </StrictMode>,
);
