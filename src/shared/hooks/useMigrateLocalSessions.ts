import { useEffect, useState } from 'react';
import { migrateLocalSessions } from '../../features/sessions/services/sessionService';
import store from '../../storage/simpleStore';
import { auth } from '../../config/firebase';
import type { Session } from '../../features/sessions/models/Session';

/**
 * React hook that migrates legacy local sessions from AsyncStorage to Firestore.
 *
 * Runs once when enabled and authenticated, reading sessions from the 'sessions'
 * AsyncStorage key and uploading them to Firestore via `migrateLocalSessions`.
 * This is typically called in App.tsx after successful authentication to ensure
 * offline-saved sessions are synced to the cloud.
 *
 * The hook is idempotent: once migration completes, it won't run again even if
 * re-enabled. Uses a cancellation token to prevent state updates after unmount.
 *
 * @param enabled - Set to true when user is authenticated and migration should run
 * @returns Hook state containing:
 * - `migrated`: True if migration has completed (even if no sessions found)
 * - `error`: Error message if migration failed, null otherwise
 * - `added`: Number of sessions successfully uploaded to Firestore
 *
 * @example
 * function App() {
 *   const user = useAuthState();
 *   const { migrated, error, added } = useMigrateLocalSessions(!!user);
 *
 *   useEffect(() => {
 *     if (migrated && added > 0) {
 *       console.log(`Migrated ${added} sessions to cloud`);
 *     }
 *     if (error) {
 *       console.error('Migration failed:', error);
 *     }
 *   }, [migrated, error, added]);
 *
 *   // ... render app
 * }
 */
export function useMigrateLocalSessions(enabled: boolean) {
  const [migrated, setMigrated] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [added, setAdded] = useState<number>(0);

  useEffect(() => {
    let cancelled = false;
    if (!enabled || migrated) return;
    const run = async () => {
      if (!auth.currentUser) return; // wait for auth
      try {
        const raw = await store.getItem('sessions');
        const local: Session[] = raw ? JSON.parse(raw) : [];
        if (local.length === 0) {
          if (!cancelled) setMigrated(true);
          return;
        }
        const count = await migrateLocalSessions(local);
        if (!cancelled) {
          setAdded(count);
          setMigrated(true);
        }
      } catch (e: any) {
        if (!cancelled) setError(e.message || 'Migration failed');
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [enabled, migrated]);

  return { migrated, error, added };
}
