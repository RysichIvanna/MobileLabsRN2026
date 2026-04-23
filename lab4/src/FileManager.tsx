import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, Pressable, RefreshControl, SafeAreaView, ScrollView, Text, TextInput, View } from 'react-native';
import { useFileManager } from './useFileManager';
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

        {selectedFile ? (
          <View style={styles.detailCard}>
            <Text style={styles.sectionTitle}>Інформація про файл</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Назва:</Text>
              <Text style={styles.infoValue}>{selectedFile.name}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Тип:</Text>
              <Text style={styles.infoValue}>{selectedFile.name.split('.').pop() ?? '---'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Розмір:</Text>
              <Text style={styles.infoValue}>{formatBytes(selectedFile.size)}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Останнє змінення:</Text>
              <Text style={styles.infoValue}>{formatDate(selectedFile.modified)}</Text>
            </View>
            <TextInput
              value={fileContent}
              onChangeText={setFileContent}
              multiline
              style={styles.fileContentInput}
              placeholder="Вміст файлу"
              placeholderTextColor="#8a94a6"
            />
            {fileError ? <Text style={styles.errorText}>{fileError}</Text> : null}
            <View style={styles.fileActionRow}>
              <Pressable onPress={saveFileContent} style={[styles.primaryButton, saving && styles.actionButtonDisabled]} disabled={saving}>
                <Text style={styles.primaryButtonText}>{saving ? 'Збереження...' : 'Зберегти'}</Text>
              </Pressable>
              <Pressable onPress={closeFileViewer} style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>Закрити</Text>
              </Pressable>
            </View>
          </View>
        ) : null}

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
                  onPress={() =>
                    entry.isDirectory
                      ? loadDirectory(entry.uri.endsWith('/') ? entry.uri : `${entry.uri}/`)
                      : openFile(entry)
                  }
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
