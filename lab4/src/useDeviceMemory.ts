import { useEffect, useState } from 'react';
import * as FileSystem from 'expo-file-system';

export type MemoryStats = {
  totalMemory: number;
  freeMemory: number;
  usedMemory: number;
};

function formatMemoryBytes(bytes: number): string {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

export function useDeviceMemory() {
  const [memoryStats, setMemoryStats] = useState<MemoryStats | null>(null);
  const [memoryError, setMemoryError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadMemoryStats = async () => {
      try {
        const info = await FileSystem.getFreeDiskStorageAsync();
        const total = await FileSystem.getTotalDiskCapacityAsync();
        
        const freeMemory = info;
        const totalMemory = total;
        const usedMemory = totalMemory - freeMemory;

        if (active) {
          setMemoryStats({
            totalMemory,
            freeMemory,
            usedMemory,
          });
        }
      } catch (error) {
        if (active) {
          const message = error instanceof Error ? error.message : 'Не вдалося отримати інформацію про пам\'ять.';
          setMemoryError(message);
        }
      }
    };

    loadMemoryStats();

    const interval = setInterval(loadMemoryStats, 5000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  return {
    memoryStats,
    memoryError,
    formatMemoryBytes,
  };
}
