import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useGame } from '../context/GameContext';

function progressLabel(current: number, target: number) {
  return `${Math.min(current, target)}/${target}`;
}

export default function Tasks() {
  const {
    bonusPoints,
    doubleTapCount,
    dragCount,
    longPressCount,
    pinchCount,
    score,
    swipeLeftCount,
    swipeRightCount,
    tapCount,
    theme,
  } = useGame();

  const tasks = [
    {
      title: 'Зробити 10 кліків',
      progress: progressLabel(tapCount, 10),
      done: tapCount >= 10,
    },
    {
      title: 'Зробити подвійний клік 5 разів',
      progress: progressLabel(doubleTapCount, 5),
      done: doubleTapCount >= 5,
    },
    {
      title: 'Утримувати обʼєкт 3 секунди',
      progress: progressLabel(longPressCount, 1),
      done: longPressCount >= 1,
    },
    {
      title: 'Перетягнути обʼєкт',
      progress: progressLabel(dragCount, 1),
      done: dragCount >= 1,
    },
    {
      title: 'Зробити свайп вправо',
      progress: progressLabel(swipeRightCount, 1),
      done: swipeRightCount >= 1,
    },
    {
      title: 'Зробити свайп вліво',
      progress: progressLabel(swipeLeftCount, 1),
      done: swipeLeftCount >= 1,
    },
    {
      title: 'Змінити розмір обʼєкта',
      progress: progressLabel(pinchCount, 1),
      done: pinchCount >= 1,
    },
    {
      title: 'Отримати 100 очок',
      progress: progressLabel(score, 100),
      done: score >= 100,
    },
    {
      title: 'Отримати 20 бонусних очок жестами',
      progress: progressLabel(bonusPoints, 20),
      done: bonusPoints >= 20,
    },
  ];

  const completedCount = tasks.filter((task) => task.done).length;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.headerCard, { backgroundColor: theme.panel, borderColor: theme.border }]}>
          <Text selectable={false} style={[styles.kicker, { color: theme.muted }]}>
            Прогрес лабораторної
          </Text>
          <Text selectable={false} style={[styles.title, { color: theme.text }]}>
            Сторінка завдань
          </Text>
          <Text selectable={false} style={[styles.summary, { color: theme.text }]}>
            Виконано {completedCount} з {tasks.length}
          </Text>
        </View>

        {tasks.map((task) => (
          <View
            key={task.title}
            style={[
              styles.taskCard,
              {
                backgroundColor: theme.panel,
                borderColor: task.done ? theme.success : theme.border,
              },
            ]}
          >
            <View style={styles.taskTopRow}>
              <Text selectable={false} style={[styles.taskTitle, { color: theme.text }]}>
                {task.title}
              </Text>
              <View
                style={[
                  styles.badge,
                  { backgroundColor: task.done ? theme.success : theme.panelAlt },
                ]}
              >
                <Text
                  selectable={false}
                  style={[styles.badgeText, { color: task.done ? '#ffffff' : theme.text }]}
                >
                  {task.done ? 'Готово' : 'В процесі'}
                </Text>
              </View>
            </View>

            <Text selectable={false} style={[styles.progressText, { color: theme.muted }]}>
              Прогрес: {task.progress}
            </Text>
          </View>
        ))}
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
  headerCard: {
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
  },
  kicker: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
  },
  summary: {
    fontSize: 16,
    fontWeight: '600',
  },
  taskCard: {
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    gap: 10,
  },
  taskTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    alignItems: 'flex-start',
  },
  taskTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 22,
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
