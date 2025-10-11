import { useEffect, useState } from 'react';
import { migrateLocalSessions } from '../../features/sessions/services/sessionService';
import store from '../../storage/simpleStore';
import { auth } from '../../config/firebase';
import type { Session } from '../../features/sessions/models/Session';

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
