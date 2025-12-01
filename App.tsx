import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context'; // <--- IMPORTANTE
import AppNavigator from './src/routes/AppNavigator';

export default function App() {
  return (
    // O Provider deve envolver tudo
    <SafeAreaProvider>
      <AppNavigator />
    </SafeAreaProvider>
  );
}