// ...existing code...
// Removed automatic coupling to global selected grade system; session logging system is chosen per session.
import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, TextInput, Alert, TouchableOpacity, FlatList } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import type { ViewStyle, TextStyle } from 'react-native';
import { Session, Attempt, GradeSystem } from '../models/Session';
import { convertGrade } from '../../grades/models/gradeConversion';
import store from '../../../storage/simpleStore';
import { addSession } from '../services/sessionService';
import { auth } from '../../../config/firebase';
import { colors } from '../../../shared/theme';
import BoulderPill from '../components/BoulderPill';
import BoulderModal from '../components/BoulderModal';
import styles from './LogScreen.styles';
import SessionHeaderCard from '../components/log/SessionHeaderCard';
import StatCardCarousel from '../components/log/StatCardCarousel';
import GradeSystemBar from '../components/log/GradeSystemBar';
import BoulderCard from '../components/log/BoulderCard';
import { buildSessionStats } from '../utils/sessionStats';
import { showAlert } from '../../../shared/utils/alert';
import DatePickerField from '../../../shared/components/DatePickerField';

import { V_GRADES, FONT_GRADES } from '../../grades/models/grades';
import { getAllGradeSystems, getGradeSystem } from '../../grades/services/gradeSystemService';
import { loadAndRegisterAllCustomSystems } from '../../grades/services/customGradeSystemService';
import { useNavigation } from '@react-navigation/native';
import { aggregateBoulders, sortGrades, getMaxGrade, Boulder as BoulderType } from '../utils/boulderUtils';

export default function LogScreen() {
  // State hooks
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [dateObj, setDateObj] = useState(new Date());
  const [gradeSystem, setGradeSystem] = useState<GradeSystem>('V'); // per-session logging system or custom id
  const [systems, setSystems] = useState(() => getAllGradeSystems());
  const navigation = useNavigation<any>();

  const getContrastColor = (bgColor?: string) => {
    if (!bgColor) return colors.text;
    const c = bgColor.startsWith('#') ? bgColor.substring(1) : bgColor;
    const num = parseInt(
      c.length === 3
        ? c
            .split('')
            .map(ch => ch + ch)
            .join('')
        : c,
      16
    );
    const r = (num >> 16) & 0xff,
      g = (num >> 8) & 0xff,
      b = num & 0xff;
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    return luminance > 180 ? '#111827' : '#ffffff';
  };
  // Load last used logging system (independent from display preference)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const last = await store.getItem('lastLoggingGradeSystem');
        if (!mounted) return;
        if (!last) return;
        if (last === 'V' || last === 'Font') setGradeSystem(last);
        else setGradeSystem(last as GradeSystem);
      } catch {
        // Silently fail to load last grade system - will use default 'V'
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Ensure custom systems are registered and refresh list when screen focuses
  useFocusEffect(
    React.useCallback(() => {
      let cancelled = false;
      (async () => {
        try {
          await loadAndRegisterAllCustomSystems();
        } catch {
          // Silently fail to load custom systems - will use builtin systems only
        }
        if (!cancelled) setSystems(getAllGradeSystems());
      })();
      return () => {
        cancelled = true;
      };
    }, [])
  );
  const [notes, setNotes] = useState('');
  const [duration, setDuration] = useState('');
  const [boulders, setBoulders] = useState<Attempt[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  // Modal state for adding boulders
  const [modalGrade, setModalGrade] = useState(V_GRADES[0]);
  // NOTE: Logging grade system intentionally decoupled from display system.
  // User selects the grading context relevant to the gym for this session.
  // Sync modalGrade with gradeSystem when modal is open
  React.useEffect(() => {
    if (modalVisible) {
      if (gradeSystem === 'V') setModalGrade(V_GRADES[0]);
      else if (gradeSystem === 'Font') setModalGrade(FONT_GRADES[0]);
      else {
        const sys = getGradeSystem(gradeSystem as string);
        setModalGrade(sys?.grades?.[0]?.label || '');
      }
    }
  }, [gradeSystem, modalVisible]);
  const [modalFlashed, setModalFlashed] = useState(false);
  const [modalAttempts, setModalAttempts] = useState<number>(1);
  const [saving, setSaving] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);

  // Handlers
  const handleDateChange = (selectedDate: Date) => {
    setDateObj(selectedDate);
    setDate(selectedDate.toISOString().slice(0, 10));
  };

  const openAddBoulder = () => {
    setModalGrade(gradeSystem === 'V' ? V_GRADES[0] : FONT_GRADES[0]);
    setModalFlashed(false);
    setModalAttempts(1);
    setModalVisible(true);
  };

  const addBoulder = () => {
    // If only one attempt and flash not selected, treat as flash
    const isFlash = modalAttempts === 1 ? true : modalFlashed;
    const attempt: Attempt = {
      grade: modalGrade,
      attempts: modalAttempts,
      flashed: isFlash,
    };
    setBoulders(prev => [...prev, attempt]);
    setModalVisible(false);
  };

  const removeBoulder = (index: number) => {
    setBoulders(prev => prev.filter((_, i) => i !== index));
  };

  // Aggregate boulders by grade
  const gradeSummary = aggregateBoulders(boulders);

  const normalizedSystemId = gradeSystem === 'V' ? 'vscale' : gradeSystem === 'Font' ? 'font' : (gradeSystem as string);
  const stats = buildSessionStats(boulders, gradeSystem);
  return (
    <View style={{ flex: 1, backgroundColor: '#F1F5F9' }}>
      <KeyboardAwareScrollView
        contentContainerStyle={{ paddingBottom: 32, flexGrow: 1, paddingHorizontal: 16, paddingTop: 16 }}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        extraScrollHeight={120}
      >
        <SessionHeaderCard
          date={date}
          onPressDate={() => {
            /* native date open handled by DatePickerField now */
          }}
        >
          <StatCardCarousel stats={stats} />
        </SessionHeaderCard>
        <DatePickerField date={dateObj} onChange={handleDateChange} maximumDate={new Date()} label="Date" />
        <Text style={{ fontWeight: '600', marginBottom: 4, color: '#0F172A' }}>Session Duration (minutes)</Text>
        <TextInput
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 12,
            paddingHorizontal: 14,
            paddingVertical: 12,
            fontSize: 16,
            borderWidth: 1,
            borderColor: '#E2E8F0',
            marginBottom: 16,
          }}
          value={duration}
          onChangeText={setDuration}
          placeholder="e.g. 90"
          keyboardType="numeric"
          placeholderTextColor={colors.text}
        />
        <GradeSystemBar
          systems={systems}
          activeId={normalizedSystemId}
          onChange={id => setGradeSystem(id === 'vscale' ? 'V' : id === 'font' ? 'Font' : id)}
          variant="compact"
        />

        {systems.length <= 2 && (
          <TouchableOpacity
            onPress={() => navigation.navigate('Settings')}
            style={{ alignSelf: 'flex-start', marginBottom: 8 }}
          >
            <Text style={{ color: colors.primary, fontWeight: '600' }}>Manage grade systems</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={openAddBoulder}
          style={{
            backgroundColor: '#2563EB',
            paddingVertical: 14,
            borderRadius: 14,
            alignItems: 'center',
            marginBottom: 12,
          }}
        >
          <Text style={{ color: '#FFFFFF', fontWeight: '600', fontSize: 16 }}>Add Boulder</Text>
        </TouchableOpacity>
        <View style={{ flexWrap: 'wrap', flexDirection: 'row', marginTop: 4, justifyContent: 'flex-start' }}>
          {Object.entries(gradeSummary).length === 0 ? (
            <Text style={{ color: '#888', marginVertical: 8 }}>No boulders added yet.</Text>
          ) : (
            (() => {
              const gradeOrder = gradeSystem === 'V' ? V_GRADES : FONT_GRADES;
              return Object.entries(gradeSummary)
                .sort(([a], [b]) => {
                  const idxA = gradeOrder.indexOf(
                    gradeSystem === 'V' || gradeSystem === 'Font' ? convertGrade(a, gradeSystem) : a
                  );
                  const idxB = gradeOrder.indexOf(
                    gradeSystem === 'V' || gradeSystem === 'Font' ? convertGrade(b, gradeSystem) : b
                  );
                  // If not found, sort alphabetically
                  if (idxA === -1 && idxB === -1) return a.localeCompare(b);
                  if (idxA === -1) return 1;
                  if (idxB === -1) return -1;
                  return idxA - idxB;
                })
                .map(([grade, { flashed, total }]) => (
                  <BoulderPill
                    key={grade}
                    grade={gradeSystem === 'V' || gradeSystem === 'Font' ? convertGrade(grade, gradeSystem) : grade}
                    flash={flashed}
                    total={total}
                    originalGrade={grade}
                    systemId={normalizedSystemId}
                  />
                ));
            })()
          )}
        </View>
        <Text style={{ fontWeight: '600', marginTop: 16, marginBottom: 4, color: '#0F172A' }}>Logged Boulders</Text>
        {boulders.length === 0 && (
          <Text style={{ color: '#64748B', marginBottom: 8 }}>None yet. Tap &quot;Add Boulder&quot;.</Text>
        )}
        {boulders.map((b, i) => (
          <BoulderCard key={i} attempt={b} index={i} onDelete={removeBoulder} systemId={normalizedSystemId} />
        ))}
        <Text style={{ fontWeight: '600', marginTop: 16, marginBottom: 4, color: '#0F172A' }}>Notes</Text>
        <TextInput
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 12,
            paddingHorizontal: 14,
            paddingVertical: 12,
            fontSize: 15,
            borderWidth: 1,
            borderColor: '#E2E8F0',
            height: 80,
            textAlignVertical: 'top',
          }}
          value={notes}
          onChangeText={setNotes}
          placeholder="Session notes (optional)"
          multiline
          placeholderTextColor={colors.text}
        />
        <TouchableOpacity
          style={{
            backgroundColor: '#0F172A',
            paddingVertical: 16,
            borderRadius: 16,
            alignItems: 'center',
            marginTop: 28,
            marginBottom: 12,
            opacity: saving ? 0.7 : 1,
          }}
          disabled={saving}
          onPress={async () => {
            if (saving) return;
            setLastError(null);
            if (!auth.currentUser) {
              showAlert('Not logged in', 'Please log in before saving a session.');
              return;
            }
            if (!duration || boulders.length === 0) {
              showAlert('Missing data', 'Please enter duration and add at least one boulder.');
              return;
            }
            const dur = parseInt(duration, 10);
            if (isNaN(dur)) {
              showAlert('Invalid duration', 'Please enter a numeric duration.');
              return;
            }
            const session = {
              date,
              durationMinutes: dur,
              notes: notes.trim(),
              boulders,
              gradeSystem,
              attempts: boulders.map(b => ({ grade: b.grade, attempts: b.attempts ?? 1, flashed: b.flashed })),
            };
            try {
              await store.setItem('lastLoggingGradeSystem', gradeSystem as string);
            } catch {
              // Non-critical: silently fail to persist grade system preference
            }
            setSaving(true);
            try {
              await addSession(session as any);
              showAlert('Session saved', 'Your session was saved to the cloud.');
            } catch (cloudErr: any) {
              const code = cloudErr?.code || 'unknown';
              const message = cloudErr?.message || 'Unknown error';
              console.warn('[Session] Cloud save failed', { code, message, stack: cloudErr?.stack });
              setLastError(`${code}: ${message}`);
              let offlineMsg = 'Saved locally (offline)';
              if (code === 'permission-denied') offlineMsg = 'Saved locally (permission denied)';
              if (code === 'unavailable') offlineMsg = 'Saved locally (network unavailable)';
              try {
                const prev = await store.getItem('sessions');
                const sessions = prev ? JSON.parse(prev) : [];
                sessions.push(session);
                await store.setItem('sessions', JSON.stringify(sessions));
                showAlert('Session saved locally', offlineMsg);
              } catch (localErr) {
                showAlert('Error', 'Could not save locally');
                setSaving(false);
                return;
              }
            }
            setSaving(false);
            // Clear form fields after saving
            setBoulders([]);
            setNotes('');
            setDuration('');
            // Keep previous grade system selection (do not reset) for convenience
            setDate(() => new Date().toISOString().slice(0, 10));
            setDateObj(new Date());
          }}
        >
          <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 16 }}>
            {saving ? 'Saving...' : 'Save Session'}
          </Text>
        </TouchableOpacity>
        {lastError && (
          <Text style={{ color: colors.error, fontSize: 12, marginTop: -4, marginBottom: 12 }}>
            Last cloud error: {lastError}
          </Text>
        )}
      </KeyboardAwareScrollView>
      <BoulderModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={(grade, attempts, flashed) => {
          setBoulders(prev => [...prev, { grade, attempts, flashed }]);
          setModalVisible(false);
        }}
        gradeSystem={normalizedSystemId}
      />
    </View>
  );
}
