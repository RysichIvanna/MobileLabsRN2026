import { useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import type { Entry } from './types';

const ROOT_URI = FileSystem.documentDirectory ?? '';

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

export function useFileManager() {
  const [currentUri, setCurrentUri] = useState(ROOT_URI);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [fileName, setFileName] = useState('');
  const [selectedFile, setSelectedFile] = useState<Entry | null>(null);
  const [fileContent, setFileContent] = useState('');
  const [fileError, setFileError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
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
            bootstrapError instanceof Error
              ? bootstrapError.message
              : 'Не вдалося підготувати файлову систему.';
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
    try {
      const rootInfo = await FileSystem.getInfoAsync(ROOT_URI);
      if (!rootInfo.exists) {
        await FileSystem.makeDirectoryAsync(ROOT_URI, { intermediates: true });
      }
    } catch (error) {
      console.log('Document directory already exists');
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
      setSelectedFile(null);
      setFileContent('');
      setFileError(null);
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

  function isTextFile(entry: Entry) {
    return entry.name.toLowerCase().endsWith('.txt');
  }

  async function openFile(entry: Entry) {
    if (entry.isDirectory) {
      return;
    }

    if (!isTextFile(entry)) {
      Alert.alert('Підтримується тільки .txt', 'Відкрийте текстовий файл для перегляду та редагування.');
      return;
    }

    setLoading(true);
    setFileError(null);

    try {
      const content = await FileSystem.readAsStringAsync(entry.uri);
      setSelectedFile(entry);
      setFileContent(content);
    } catch (readError) {
      const message = readError instanceof Error ? readError.message : 'Не вдалося відкрити файл.';
      setFileError(message);
    } finally {
      setLoading(false);
    }
  }

  async function saveFileContent() {
    if (!selectedFile) {
      return;
    }

    setSaving(true);
    setFileError(null);

    try {
      await FileSystem.writeAsStringAsync(selectedFile.uri, fileContent);
      await loadDirectory(currentUri);
    } catch (saveError) {
      const message = saveError instanceof Error ? saveError.message : 'Не вдалося зберегти файл.';
      setFileError(message);
    } finally {
      setSaving(false);
    }
  }

  function closeFileViewer() {
    setSelectedFile(null);
    setFileContent('');
    setFileError(null);
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

  return {
    currentUri,
    entries,
    loading,
    refreshing,
    folderName,
    setFolderName,
    fileName,
    setFileName,
    selectedFile,
    fileContent,
    setFileContent,
    fileError,
    saving,
    error,
    canGoUp,
    stats,
    loadDirectory,
    refresh,
    createFolder,
    createFile,
    deleteEntry,
    openFile,
    saveFileContent,
    closeFileViewer,
    parentUri,
    formatPath,
    formatBytes,
    formatDate,
  };
}
