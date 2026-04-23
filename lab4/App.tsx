import { StatusBar } from 'expo-status-bar';
import * as FileSystem from 'expo-file-system';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type Entry = {
  name: string;
  uri: string;
  isDirectory: boolean;
  size?: number;
  modified?: number;
};

const ROOT_URI = `${FileSystem.documentDirectory ?? ''}file-manager-root/`;

function joinUri(base: string, name: string) {
  return `${base}${name}`;
}

function parentUri(uri: string) {
  const normalized = uri.endsWith('/') ? uri.slice(0, -1) : uri;
  const parts = normalized.split('/');

  if (parts.length <= 4) {
    return ROOT_URI;
  }

  return `${parts.slice(0, -1).join('/')}/`;
}

function formatPath(uri: string) {
  if (uri === ROOT_URI) {
    return 'root';
  }

  return uri
    .replace(ROOT_URI, '')
    .split('/')
    .filter(Boolean)
    .join(' / ');
}

function formatBytes(value?: number) {
  if (value == null) {
    return 'невідомо';
  }

  if (value < 1024) {
    return `${value} B`;
  }

  if (value < 1024 * 1024) {
    return `${(value / 1024).toFixed(1)} KB`;
  }

  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(timestamp?: number) {
  if (!timestamp) {
    return 'невідомо';
  }

  return new Date(timestamp).toLocaleString('uk-UA');
}

export default function App() {
  const [currentUri, setCurrentUri] = useState(ROOT_URI);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const canGoUp = currentUri !== ROOT_URI;

  useEffect(() => {
    let active = true;

    const bootstrap = async () => {
      try {
        await ensureDemoStructure();
        if (active) {
          await loadDirectory(ROOT_URI);
        }
      } catch (bootstrapError) {
        if (active) {
          const message =
            bootstrapError instanceof Error ? bootstrapError.message : 'Не вдалося підготувати файлову систему.';
          setError(message);
          setLoading(false);
        }
      }
    };

    bootstrap();

    return () => {
      active = false;
    };
  }, []);

  const stats = useMemo(() => {
    const folders = entries.filter((entry) => entry.isDirectory).length;
    const files = entries.length - folders;

    return { folders, files };
  }, [entries]);

  async function ensureDemoStructure() {
    const rootInfo = await FileSystem.getInfoAsync(ROOT_URI);

    if (!rootInfo.exists) {
      await FileSystem.makeDirectoryAsync(ROOT_URI, { intermediates: true });
      await FileSystem.makeDirectoryAsync(joinUri(ROOT_URI, 'documents/'), { intermediates: true });
      await FileSystem.makeDirectoryAsync(joinUri(ROOT_URI, 'images/'), { intermediates: true });
      await FileSystem.makeDirectoryAsync(joinUri(ROOT_URI, 'documents/reports/'), { intermediates: true });
      await FileSystem.writeAsStringAsync(joinUri(ROOT_URI, 'readme.txt'), 'Лабораторна робота №4: файловий менеджер.');
      await FileSystem.writeAsStringAsync(
        joinUri(ROOT_URI, 'documents/notes.txt'),
        'Це демонстраційний файл у папці documents.',
      );
      await FileSystem.writeAsStringAsync(
        joinUri(ROOT_URI, 'documents/reports/week-1.txt'),
        'Тут можна зберігати звіти або довільні текстові файли.',
      );
    }
  }

  async function loadDirectory(uri: string) {
    setLoading(true);
    setError(null);

    try {
      const names = await FileSystem.readDirectoryAsync(uri);
      const collected = await Promise.all(
        names.map(async (name) => {
          const itemUri = joinUri(uri, name);
          const info = await FileSystem.getInfoAsync(itemUri);

          return {
            name,
            uri: itemUri,
            isDirectory: info.isDirectory ?? false,
            size: info.exists ? info.size : undefined,
            modified: info.exists && info.modificationTime ? info.modificationTime * 1000 : undefined,
          } satisfies Entry;
        }),
      );

      collected.sort((left, right) => {
        if (left.isDirectory !== right.isDirectory) {
          return left.isDirectory ? -1 : 1;
        }

        return left.name.localeCompare(right.name, 'uk-UA');
      });

      setEntries(collected);
      setCurrentUri(uri);
    } catch (directoryError) {
      const message =
        directoryError instanceof Error ? directoryError.message : 'Не вдалося відкрити директорію.';
      setError(message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  async function refresh() {
    setRefreshing(true);
    await loadDirectory(currentUri);
  }

  async function createFolder() {
    const trimmed = folderName.trim();

    if (!trimmed) {
      Alert.alert('Потрібна назва', 'Введіть назву нової папки.');
      return;
    }

    const uri = joinUri(currentUri, `${trimmed}/`);

    try {
      await FileSystem.makeDirectoryAsync(uri, { intermediates: false });
      setFolderName('');
      await loadDirectory(currentUri);
    } catch (createError) {
      const message = createError instanceof Error ? createError.message : 'Не вдалося створити папку.';
      Alert.alert('Помилка', message);
    }
  }

  async function createFile() {
    const trimmed = fileName.trim();

    if (!trimmed) {
      Alert.alert('Потрібна назва', 'Введіть назву нового файлу.');
      return;
    }

    const uri = joinUri(currentUri, trimmed);

    try {
      await FileSystem.writeAsStringAsync(uri, `Створено: ${new Date().toLocaleString('uk-UA')}`);
      setFileName('');
      await loadDirectory(currentUri);
    } catch (createError) {
      const message = createError instanceof Error ? createError.message : 'Не вдалося створити файл.';
      Alert.alert('Помилка', message);
    }
  }

  async function deleteEntry(entry: Entry) {
    Alert.alert(
      'Видалити елемент?',
      `Будуть видалені ${entry.isDirectory ? 'папка' : 'файл'} "${entry.name}".`,
      [
        { text: 'Скасувати', style: 'cancel' },
        {
          text: 'Видалити',
          style: 'destructive',
          onPress: async () => {
            try {
              await FileSystem.deleteAsync(entry.uri, { idempotent: true });
              await loadDirectory(currentUri);
            } catch (deleteError) {
              const message =
                deleteError instanceof Error ? deleteError.message : 'Не вдалося видалити елемент.';
              Alert.alert('Помилка', message);
            }
          },
        },
      ],
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <Text style={styles.title}>Файловий менеджер</Text>
        <Text style={styles.subtitle}>Навігація по локальній файловій системі через expo-file-system</Text>

        <View style={styles.pathCard}>
          <Text style={styles.pathLabel}>Поточний шлях</Text>
          <Text style={styles.pathValue}>{formatPath(currentUri)}</Text>
          <Text style={styles.pathUri}>{currentUri}</Text>
        </View>

        <View style={styles.toolbar}>
          <Pressable
            onPress={() => loadDirectory(parentUri(currentUri))}
            disabled={!canGoUp || loading}
            style={[styles.actionButton, (!canGoUp || loading) && styles.actionButtonDisabled]}
          >
            <Text style={styles.actionButtonText}>Вгору</Text>
          </Pressable>
          <Pressable onPress={refresh} disabled={loading} style={[styles.actionButton, loading && styles.actionButtonDisabled]}>
            <Text style={styles.actionButtonText}>Оновити</Text>
          </Pressable>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.folders}</Text>
            <Text style={styles.statLabel}>папок</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.files}</Text>
            <Text style={styles.statLabel}>файлів</Text>
          </View>
        </View>

        <View style={styles.createSection}>
          <TextInput
            placeholder="Нова папка"
            placeholderTextColor="#8a94a6"
            value={folderName}
            onChangeText={setFolderName}
            style={styles.input}
          />
          <Pressable onPress={createFolder} style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Створити папку</Text>
          </Pressable>
        </View>

        <View style={styles.createSection}>
          <TextInput
            placeholder="Новий файл.txt"
            placeholderTextColor="#8a94a6"
            value={fileName}
            onChangeText={setFileName}
            style={styles.input}
          />
          <Pressable onPress={createFile} style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Створити файл</Text>
          </Pressable>
        </View>

        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color="#2563eb" />
            <Text style={styles.loadingText}>Завантаження директорії...</Text>
          </View>
        ) : error ? (
          <View style={styles.centered}>
            <Text style={styles.errorTitle}>Помилка доступу до директорії</Text>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : (
          <ScrollView
            style={styles.list}
            contentContainerStyle={styles.listContent}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
          >
            {entries.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyTitle}>Директорія порожня</Text>
                <Text style={styles.emptyText}>Створіть папку або файл, щоб побачити їх у списку.</Text>
              </View>
            ) : (
              entries.map((entry) => (
                <Pressable
                  key={entry.uri}
                  onPress={() => (entry.isDirectory ? loadDirectory(entry.uri.endsWith('/') ? entry.uri : `${entry.uri}/`) : undefined)}
                  style={styles.entryCard}
                >
                  <View style={styles.entryHeader}>
                    <View>
                      <Text style={styles.entryType}>{entry.isDirectory ? 'Папка' : 'Файл'}</Text>
                      <Text style={styles.entryName}>{entry.name}</Text>
                    </View>
                    {!entry.isDirectory ? <Text style={styles.entrySize}>{formatBytes(entry.size)}</Text> : null}
                  </View>

                  <Text style={styles.entryMeta}>Змінено: {formatDate(entry.modified)}</Text>

                  <View style={styles.entryActions}>
                    {entry.isDirectory ? (
                      <Text style={styles.openHint}>Натисніть, щоб відкрити</Text>
                    ) : (
                      <Text style={styles.openHint}>Текстовий файл у sandbox-директорії</Text>
                    )}
                    <Pressable onPress={() => deleteEntry(entry)} style={styles.deleteButton}>
                      <Text style={styles.deleteButtonText}>Видалити</Text>
                    </Pressable>
                  </View>
                </Pressable>
              ))
            )}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f3f6fb',
  },
  container: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#14213d',
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    color: '#52607a',
  },
  pathCard: {
    marginTop: 18,
    padding: 16,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d9e1ee',
  },
  pathLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    color: '#6b7280',
  },
  pathValue: {
    marginTop: 8,
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
  },
  pathUri: {
    marginTop: 8,
    fontSize: 12,
    lineHeight: 18,
    color: '#667085',
  },
  toolbar: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    backgroundColor: '#dde8ff',
  },
  actionButtonDisabled: {
    opacity: 0.45,
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1d4ed8',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  statCard: {
    flex: 1,
    padding: 14,
    borderRadius: 18,
    backgroundColor: '#14213d',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#ffffff',
  },
  statLabel: {
    marginTop: 4,
    fontSize: 13,
    color: '#d4def2',
  },
  createSection: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  input: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d9e1ee',
    color: '#0f172a',
  },
  primaryButton: {
    justifyContent: 'center',
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: '#f97316',
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: '#52607a',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#991b1b',
  },
  errorText: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    color: '#7f1d1d',
  },
  list: {
    flex: 1,
    marginTop: 16,
  },
  listContent: {
    paddingBottom: 18,
    gap: 12,
  },
  emptyState: {
    padding: 24,
    borderRadius: 18,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d9e1ee',
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  emptyText: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    color: '#52607a',
  },
  entryCard: {
    padding: 16,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d9e1ee',
  },
  entryHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  entryType: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    color: '#64748b',
  },
  entryName: {
    marginTop: 4,
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  entrySize: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563eb',
  },
  entryMeta: {
    marginTop: 10,
    fontSize: 13,
    color: '#52607a',
  },
  entryActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 14,
  },
  openHint: {
    flex: 1,
    fontSize: 13,
    color: '#475569',
  },
  deleteButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#fee2e2',
  },
  deleteButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#b91c1c',
  },
});
