import { SafeAreaProvider } from 'react-native-safe-area-context';
import FileManager from './src/FileManager';

export default function App() {
  return (
    <SafeAreaProvider>
      <FileManager />
    </SafeAreaProvider>
  );
}

