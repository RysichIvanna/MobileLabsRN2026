import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, View, useColorScheme } from 'react-native';
import { useState } from 'react';

const lightTheme = {
  background: '#f4efe6',
  panel: '#fffaf2',
  text: '#2f241f',
  muted: '#7d685d',
  accent: '#d96c3d',
  accentDark: '#a94d27',
  glow: '#ffd8b8',
};

const darkTheme = {
  background: '#171311',
  panel: '#241d1a',
  text: '#f7eee7',
  muted: '#c2ada0',
  accent: '#ff8a5b',
  accentDark: '#c9663d',
  glow: '#5c2d1f',
};

export default function Home() {
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? darkTheme : lightTheme;
  const [score, setScore] = useState(0);
  const [tapCount, setTapCount] = useState(0);
  const [isPressed, setIsPressed] = useState(false);

  const handleTap = () => {
    setScore((current) => current + 1);
    setTapCount((current) => current + 1);
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />

      <View style={[styles.heroCard, { backgroundColor: theme.panel }]}>
        <Text style={[styles.kicker, { color: theme.muted }]}>Lab 3 Clicker // Rysich Ivanna</Text>
        <Text selectable={false} style={[styles.title, { color: theme.text }]}>
          Головний екран гри
        </Text>

        <View style={styles.scoreRow}>
          <View style={styles.scoreBlock}>
            <Text selectable={false} style={[styles.scoreLabel, { color: theme.muted }]}>
              Очки
            </Text>
            <Text selectable={false} style={[styles.scoreValue, { color: theme.text }]}>
              {score}
            </Text>
          </View>

          <View style={styles.scoreBlock}>
            <Text selectable={false} style={[styles.scoreLabel, { color: theme.muted }]}>
              Натискання
            </Text>
            <Text selectable={false} style={[styles.scoreValue, { color: theme.text }]}>
              {tapCount}
            </Text>
          </View>
        </View>

        <Text selectable={false} style={[styles.helper, { color: theme.muted }]}>
          Торкайся об&apos;єкта, щоб отримувати очки.
        </Text>
      </View>

      <View style={styles.playArea}>
        <Pressable
          onPress={handleTap}
          onPressIn={() => setIsPressed(true)}
          onPressOut={() => setIsPressed(false)}
          style={({ pressed }) => [
            styles.orbButton,
            {
              backgroundColor: theme.accent,
              borderColor: theme.accentDark,
              shadowColor: theme.glow,
              transform: [{ scale: pressed || isPressed ? 0.94 : 1 }],
            },
          ]}
        >
          <View style={[styles.innerOrb, { backgroundColor: theme.glow }]}>
            <Text selectable={false} style={[styles.orbEmoji, { color: theme.text }]}>
              +1
            </Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 72,
    paddingBottom: 32,
  },
  heroCard: {
    borderRadius: 28,
    padding: 24,
    shadowOffset: {
      width: 0,
      height: 16,
    },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 6,
  },
  kicker: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    marginBottom: 24,
  },
  scoreRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 18,
  },
  scoreBlock: {
    flex: 1,
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  scoreLabel: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '600',
  },
  scoreValue: {
    fontSize: 30,
    fontWeight: '800',
  },
  helper: {
    fontSize: 15,
    lineHeight: 22,
  },
  playArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbButton: {
    width: 220,
    height: 220,
    borderRadius: 999,
    borderWidth: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: {
      width: 0,
      height: 24,
    },
    shadowOpacity: 0.35,
    shadowRadius: 36,
    elevation: 18,
  },
  innerOrb: {
    width: 132,
    height: 132,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbEmoji: {
    fontSize: 34,
    fontWeight: '900',
  },
});
