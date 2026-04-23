import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, RefreshControl, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFileManager } from './useFileManager';
import { useDeviceMemory } from './useDeviceMemory';
import { styles } from './fileManagerStyles';

export default function FileManager() {
  const {
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
  } = useFileManager();

  const { memoryStats, formatMemoryBytes } = useDeviceMemory();

  return (
    <KeyboardAvoidingView
      style={styles.safeArea}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="dark" />
        <ScrollView
          style={styles.list}
          contentContainerStyle={[styles.listContent, { flexGrow: 1 }]}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
          keyboardShouldPersistTaps="always"
          keyboardDismissMode="on-drag"
        >
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.title}>Файлменеджер</Text>
            </View>

            <View style={styles.pathSection}>
              <Text style={styles.pathLabel}>Поточна папка</Text>
              <Text style={styles.pathValue} numberOfLines={2}>
                {formatPath(currentUri)}
              </Text>
            </View>

            <View style={styles.toolbar}>
              <Pressable
                onPress={() => loadDirectory(parentUri(currentUri))}
                disabled={!canGoUp || loading}
                style={[styles.actionButton, (!canGoUp || loading) && styles.actionButtonDisabled]}
              >
                <Text style={styles.actionButtonText}>↑ Вверх</Text>
              </Pressable>
              <Pressable
                onPress={refresh}
                disabled={loading}
                style={[styles.actionButton, loading && styles.actionButtonDisabled]}
              >
                <Text style={styles.actionButtonText}>↻ Оновити</Text>
              </Pressable>
            </View>

            <View style={styles.statsContainer}>
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

              {memoryStats && memoryStats.totalMemory > 0 ? (
                <View style={styles.memorySection}>
                  <Text style={styles.memorySectionTitle}>Зберігання</Text>
                  <View style={styles.memoryItem}>
                    <Text style={styles.memoryLabel}>Всього:</Text>
                    <Text style={styles.memoryValue}>{formatMemoryBytes(memoryStats.totalMemory)}</Text>
                  </View>
                  <View style={styles.memoryItem}>
                    <Text style={styles.memoryLabel}>Вільно:</Text>
                    <Text style={styles.memoryValue}>{formatMemoryBytes(memoryStats.freeMemory)}</Text>
                  </View>
                  <View style={styles.memoryItem}>
                    <Text style={styles.memoryLabel}>Зайнято:</Text>
                    <Text style={styles.memoryValue}>{formatMemoryBytes(memoryStats.usedMemory)}</Text>
                  </View>
                  <View style={styles.memoryBar}>
                    <View
                      style={[
                        styles.memoryBarFill,
                        { width: `${(memoryStats.usedMemory / memoryStats.totalMemory) * 100}%` },
                      ]}
                    />
                  </View>
                  <Text style={[styles.memoryLabel, { marginTop: 6, textAlign: 'center' }]}>
                    {((memoryStats.usedMemory / memoryStats.totalMemory) * 100).toFixed(1)}%
                  </Text>
                </View>
              ) : null}
            </View>

            {selectedFile ? (
              <View style={styles.detailCard}>
                <Text style={styles.sectionTitle}>Редагування файлу</Text>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Назва:</Text>
                  <Text style={styles.infoValue}>{selectedFile.name}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Розмір:</Text>
                  <Text style={styles.infoValue}>{formatBytes(selectedFile.size)}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Змінено:</Text>
                  <Text style={styles.infoValue}>{formatDate(selectedFile.modified)}</Text>
                </View>
                <TextInput
                  value={fileContent}
                  onChangeText={setFileContent}
                  multiline
                  style={styles.fileContentInput}
                  placeholder="Вміст файлу"
                  placeholderTextColor="#cbd5e1"
                />
                {fileError ? <Text style={styles.errorText}>{fileError}</Text> : null}
                <View style={styles.fileActionRow}>
                  <Pressable
                    onPress={saveFileContent}
                    style={[styles.primaryButton, saving && styles.actionButtonDisabled]}
                    disabled={saving}
                  >
                    <Text style={styles.primaryButtonText}>{saving ? 'Збереження...' : 'Зберегти'}</Text>
                  </Pressable>
                  <Pressable onPress={closeFileViewer} style={styles.secondaryButton}>
                    <Text style={styles.secondaryButtonText}>Закрити</Text>
                  </Pressable>
                </View>
              </View>
            ) : (
              <>
                <View style={styles.createSection}>
                  <TextInput
                    placeholder="Нова папка"
                    placeholderTextColor="#cbd5e1"
                    value={folderName}
                    onChangeText={setFolderName}
                    style={styles.input}
                  />
                  <Pressable onPress={createFolder} style={styles.primaryButton}>
                    <Text style={styles.primaryButtonText}>+ Папка</Text>
                  </Pressable>
                </View>

                <View style={styles.createSection}>
                  <TextInput
                    placeholder="Новий файл.txt"
                    placeholderTextColor="#cbd5e1"
                    value={fileName}
                    onChangeText={setFileName}
                    style={styles.input}
                  />
                  <Pressable onPress={createFile} style={styles.primaryButton}>
                    <Text style={styles.primaryButtonText}>+ Файл</Text>
                  </Pressable>
                </View>
              </>
            )}

            {loading ? (
              <View style={styles.centered}>
                <ActivityIndicator size="large" color="#4338ca" />
                <Text style={styles.loadingText}>Завантаження...</Text>
              </View>
            ) : error ? (
              <View style={styles.centered}>
                <Text style={styles.errorTitle}>Помилка</Text>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : entries.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyTitle}>Папка порожня</Text>
                <Text style={styles.emptyText}>Створіть папку або файл для початку роботи</Text>
              </View>
            ) : (
              entries.map((entry) => (
                <Pressable
                  key={entry.uri}
                  onPress={() =>
                    entry.isDirectory
                      ? loadDirectory(entry.uri.endsWith('/') ? entry.uri : `${entry.uri}/`)
                      : openFile(entry)
                  }
                  style={styles.entryCard}
                >
                  <View style={styles.entryHeader}>
                    <View>
                      <Text style={styles.entryType}>{entry.isDirectory ? '📁 Папка' : '📄 Файл'}</Text>
                      <Text style={styles.entryName}>{entry.name}</Text>
                    </View>
                    {!entry.isDirectory ? <Text style={styles.entrySize}>{formatBytes(entry.size)}</Text> : null}
                  </View>

                  <Text style={styles.entryMeta}>{formatDate(entry.modified)}</Text>

                  <View style={styles.entryActions}>
                    {entry.isDirectory ? (
                      <Text style={styles.openHint}>Натисніть щоб відкрити</Text>
                    ) : (
                      <Text style={styles.openHint}>Натисніть щоб редагувати</Text>
                    )}
                    <Pressable onPress={() => deleteEntry(entry)} style={styles.deleteButton}>
                      <Text style={styles.deleteButtonText}>Видалити</Text>
                    </Pressable>
                  </View>
                </Pressable>
              ))
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
