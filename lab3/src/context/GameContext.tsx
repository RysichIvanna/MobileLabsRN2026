import { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';

export type ThemeMode = 'system' | 'light' | 'dark';
type ResolvedTheme = 'light' | 'dark';
type SwipeDirection = 'left' | 'right';

type ThemePalette = {
  background: string;
  panel: string;
  panelAlt: string;
  text: string;
  muted: string;
  accent: string;
  accentStrong: string;
  glow: string;
  success: string;
  border: string;
  danger: string;
};

type GameContextValue = {
  score: number;
  tapCount: number;
  doubleTapCount: number;
  longPressCount: number;
  dragCount: number;
  swipeLeftCount: number;
  swipeRightCount: number;
  pinchCount: number;
  bonusPoints: number;
  themeMode: ThemeMode;
  resolvedTheme: ResolvedTheme;
  theme: ThemePalette;
  resetVersion: number;
  addTap: () => void;
  addDoubleTap: () => void;
  addLongPressBonus: () => void;
  addSwipeBonus: (direction: SwipeDirection, points: number) => void;
  addPinchBonus: (points: number) => void;
  registerDrag: () => void;
  setThemeMode: (mode: ThemeMode) => void;
  resetGame: () => void;
};

const lightTheme: ThemePalette = {
  background: '#f4efe6',
  panel: '#fffaf2',
  panelAlt: '#f0e4d5',
  text: '#2f241f',
  muted: '#7d685d',
  accent: '#d96c3d',
  accentStrong: '#a94d27',
  glow: '#ffd8b8',
  success: '#2d8a52',
  border: '#e5d6c7',
  danger: '#bb4c47',
};

const darkTheme: ThemePalette = {
  background: '#171311',
  panel: '#241d1a',
  panelAlt: '#332924',
  text: '#f7eee7',
  muted: '#c2ada0',
  accent: '#ff8a5b',
  accentStrong: '#d86b3f',
  glow: '#5c2d1f',
  success: '#4fd084',
  border: '#4a3a33',
  danger: '#ef7d75',
};

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [score, setScore] = useState(0);
  const [tapCount, setTapCount] = useState(0);
  const [doubleTapCount, setDoubleTapCount] = useState(0);
  const [longPressCount, setLongPressCount] = useState(0);
  const [dragCount, setDragCount] = useState(0);
  const [swipeLeftCount, setSwipeLeftCount] = useState(0);
  const [swipeRightCount, setSwipeRightCount] = useState(0);
  const [pinchCount, setPinchCount] = useState(0);
  const [bonusPoints, setBonusPoints] = useState(0);
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');
  const [resetVersion, setResetVersion] = useState(0);

  const resolvedTheme: ResolvedTheme =
    themeMode === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : themeMode;
  const theme = resolvedTheme === 'dark' ? darkTheme : lightTheme;

  const value = useMemo<GameContextValue>(
    () => ({
      score,
      tapCount,
      doubleTapCount,
      longPressCount,
      dragCount,
      swipeLeftCount,
      swipeRightCount,
      pinchCount,
      bonusPoints,
      themeMode,
      resolvedTheme,
      theme,
      resetVersion,
      addTap: () => {
        setScore((current) => current + 1);
        setTapCount((current) => current + 1);
      },
      addDoubleTap: () => {
        setScore((current) => current + 2);
        setDoubleTapCount((current) => current + 1);
      },
      addLongPressBonus: () => {
        setScore((current) => current + 10);
        setLongPressCount((current) => current + 1);
        setBonusPoints((current) => current + 10);
      },
      addSwipeBonus: (direction, points) => {
        setScore((current) => current + points);
        setBonusPoints((current) => current + points);

        if (direction === 'left') {
          setSwipeLeftCount((current) => current + 1);
          return;
        }

        setSwipeRightCount((current) => current + 1);
      },
      addPinchBonus: (points) => {
        setScore((current) => current + points);
        setBonusPoints((current) => current + points);
        setPinchCount((current) => current + 1);
      },
      registerDrag: () => {
        setDragCount((current) => current + 1);
      },
      setThemeMode,
      resetGame: () => {
        setScore(0);
        setTapCount(0);
        setDoubleTapCount(0);
        setLongPressCount(0);
        setDragCount(0);
        setSwipeLeftCount(0);
        setSwipeRightCount(0);
        setPinchCount(0);
        setBonusPoints(0);
        setResetVersion((current) => current + 1);
      },
    }),
    [
      bonusPoints,
      doubleTapCount,
      dragCount,
      longPressCount,
      pinchCount,
      resetVersion,
      resolvedTheme,
      score,
      swipeLeftCount,
      swipeRightCount,
      tapCount,
      theme,
      themeMode,
    ]
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);

  if (!context) {
    throw new Error('useGame must be used inside GameProvider');
  }

  return context;
}
