import 'react-native-gesture-handler';

import { DarkTheme, DefaultTheme, NavigationContainer, Theme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { GameProvider, useGame } from './src/context/GameContext';
import Home from './src/screens/Home';
import Settings from './src/screens/Settings';
import Tasks from './src/screens/Tasks';

const Tab = createBottomTabNavigator();

function AppNavigator() {
  const { resolvedTheme, theme } = useGame();

  const navigationTheme: Theme = {
    ...(resolvedTheme === 'dark' ? DarkTheme : DefaultTheme),
    colors: {
      ...(resolvedTheme === 'dark' ? DarkTheme.colors : DefaultTheme.colors),
      primary: theme.accent,
      background: theme.background,
      card: theme.panel,
      text: theme.text,
      border: theme.border,
      notification: theme.accentStrong,
    },
  };

  return (
    <NavigationContainer theme={navigationTheme}>
      <Tab.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.panel,
          },
          headerTitleStyle: {
            color: theme.text,
            fontWeight: '700',
          },
          headerTintColor: theme.text,
          tabBarStyle: {
            backgroundColor: theme.panel,
            borderTopColor: theme.border,
            height: 64,
            paddingBottom: 8,
            paddingTop: 8,
          },
          tabBarActiveTintColor: theme.accent,
          tabBarInactiveTintColor: theme.muted,
          tabBarIconStyle: {
            display: 'none',
          },
          tabBarLabelStyle: {
            fontSize: 14,
            fontWeight: '700',
          },
        }}
      >
        <Tab.Screen name="Гра" component={Home} />
        <Tab.Screen name="Завдання" component={Tasks} />
        <Tab.Screen name="Налаштування" component={Settings} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <GameProvider>
          <AppNavigator />
        </GameProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
