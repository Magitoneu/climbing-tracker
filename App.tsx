import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Tabs from './src/navigation/Tabs';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AuthScreen from './src/screens/AuthScreen';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { useMigrateLocalSessions } from './src/hooks/useMigrateLocalSessions';
import { auth } from './src/config/firebase';
import { loadAndRegisterAllCustomSystems, subscribeCustomGradeSystems, pushLocalCustomGradeSystemsToCloud } from './src/services/customGradeSystemService';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeCustom: (() => void) | null = null;
    const unsubscribe = onAuthStateChanged(auth, async user => {
      setIsAuthenticated(!!user);
      setLoading(false);
      if (user) {
        try {
          // Ensure local is registered and seed cloud if needed
          await loadAndRegisterAllCustomSystems();
          await pushLocalCustomGradeSystemsToCloud();
        } catch {}
        // Live subscribe to cloud updates
        try { unsubscribeCustom = subscribeCustomGradeSystems(); } catch {}
      } else if (unsubscribeCustom) {
        unsubscribeCustom();
        unsubscribeCustom = null;
      }
    });
    return () => { if (unsubscribeCustom) unsubscribeCustom(); unsubscribe(); };
  }, []);

  // Load any saved custom grade systems into the runtime registry on startup
  useEffect(() => {
    (async () => {
      try { await loadAndRegisterAllCustomSystems(); } catch {}
    })();
  }, []);

  // Run one-time migration once authenticated
  const { migrated, added, error } = useMigrateLocalSessions(isAuthenticated);
  if (error) {
    console.warn('[Migration] Error:', error);
  } else if (migrated && added > 0) {
    console.log(`[Migration] Uploaded ${added} legacy local sessions.`);
  }

  if (loading) return null; // Optionally show a splash screen

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        {isAuthenticated ? <Tabs /> : <AuthScreen />}
        <StatusBar style="auto" />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({});
