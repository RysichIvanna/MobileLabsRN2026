import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemeMode, useGame } from '../context/GameContext';

const themeOptions: { label: string; value: ThemeMode }[] = [
  { label: 'Системна', value: 'system' },
  { label: 'Світла', value: 'light' },
  { label: 'Темна', value: 'dark' },
];

export default function Settings() {
  const { resetGame, resolvedTheme, setThemeMode, theme, themeMode } = useGame();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.card, { backgroundColor: theme.panel, borderColor: theme.border }]}>
          <Text selectable={false} style={[styles.title, { color: theme.text }]}>
            Налаштування
          </Text>
          <Text selectable={false} style={[styles.text, { color: theme.muted }]}>
            Обери режим теми для застосунку.
          </Text>

          <View style={styles.buttonColumn}>
            {themeOptions.map((option) => {
              const selected = option.value === themeMode;

              return (
                <Pressable
                  key={option.value}
                  onPress={() => setThemeMode(option.value)}
                  style={[
                    styles.optionButton,
                    {
                      backgroundColor: selected ? theme.accent : theme.panelAlt,
                      borderColor: selected ? theme.accentStrong : theme.border,
                    },
                  ]}
                >
                  <Text
                    selectable={false}
                    style={[styles.optionText, { color: selected ? '#ffffff' : theme.text }]}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: theme.panel, borderColor: theme.border }]}>
          <Text selectable={false} style={[styles.sectionTitle, { color: theme.text }]}>
            Поточна тема
          </Text>
          <Text selectable={false} style={[styles.text, { color: theme.muted }]}>
            Зараз активна тема: {resolvedTheme === 'dark' ? 'темна' : 'світла'}.
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: theme.panel, borderColor: theme.border }]}>
          <Text selectable={false} style={[styles.sectionTitle, { color: theme.text }]}>
            Скидання прогресу
          </Text>
          <Text selectable={false} style={[styles.text, { color: theme.muted }]}>
            Якщо потрібно почати гру і завдання з нуля, натисни кнопку нижче.
          </Text>

          <Pressable
            onPress={resetGame}
            style={[styles.resetButton, { backgroundColor: theme.danger }]}
          >
            <Text selectable={false} style={styles.resetText}>
              Скинути прогрес
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 14,
  },
  card: {
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  text: {
    fontSize: 15,
    lineHeight: 22,
  },
  buttonColumn: {
    gap: 10,
    marginTop: 8,
  },
  optionButton: {
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  resetButton: {
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginTop: 4,
  },
  resetText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
  },
});
