import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createBrowserRouter, Navigate } from 'react-router-dom';
import './styles/index.css';
import { PlayerSelect } from './components/PlayerSelect/PlayerSelect';
import { GameMapScreen } from './components/GameMap/GameMapScreen';
import { LevelScreen } from './components/Quiz/LevelScreen';

const router = createBrowserRouter([
  { path: '/', element: <PlayerSelect /> },
  { path: '/play/:profileId', element: <GameMapScreen /> },
  { path: '/play/:profileId/level/:levelId', element: <LevelScreen /> },
  { path: '*', element: <Navigate to="/" replace /> },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
