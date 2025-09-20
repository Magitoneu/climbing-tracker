import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, ScrollView, StyleSheet, Modal, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getCustomGradeSystems, getSelectedGradeSystem, setSelectedGradeSystem } from '../storage/customGradeSystemStore';
import { useGradeDisplaySystem } from '../hooks/useGradeDisplaySystem';
import { CustomGradeSystem } from '../models/CustomGradeSystem';
import { V_GRADES, FONT_GRADES } from '../models/grades';
import { gradeColors } from '../theme';
import { CustomGradeSystemEditor } from '../components/CustomGradeSystem/CustomGradeSystemEditor';
import { loadAndRegisterAllCustomSystems, upsertCustomSystem, removeCustomSystem } from '../services/customGradeSystemService';
import { showConfirm, showAlert } from '../utils/alert';

// Map legacy view to builtin canonical ids
const DEFAULT_SYSTEMS: CustomGradeSystem[] = [
	{ id: 'vscale', name: 'V Scale', grades: V_GRADES.map((g) => ({ name: g, color: '#2563eb' })) },
	{ id: 'font', name: 'Font Scale', grades: FONT_GRADES.map((g) => ({ name: g, color: '#16a34a' })) },
];

export default function SettingsGradeSystemScreen() {
	const { systemId, setDisplaySystem } = useGradeDisplaySystem();
	const [customSystems, setCustomSystems] = useState<CustomGradeSystem[]>([]);
	const [selectedSystemId, setSelectedSystemId] = useState<string>(systemId);
	const [showSelector, setShowSelector] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [editing, setEditing] = useState<CustomGradeSystem | null>(null);

	useEffect(() => {
		getCustomGradeSystems().then(async (systems) => {
        setCustomSystems(systems);
        // register into runtime grade system service for pickers/conversions
        await loadAndRegisterAllCustomSystems();
      });
		// legacy store still holds 'V'/'Font'; map once if found and persist new key elsewhere later if needed
		getSelectedGradeSystem().then(legacy => {
			if (legacy === 'V') setSelectedSystemId('vscale');
			else if (legacy === 'Font') setSelectedSystemId('font');
			else if (legacy) setSelectedSystemId(legacy);
		});
	}, []);

	const allSystems = [...DEFAULT_SYSTEMS, ...customSystems];
	const selectedSystem = allSystems.find((s) => s.id === selectedSystemId) || DEFAULT_SYSTEMS[0];

	const handleSelectSystem = async (id: string) => {
		setSelectedSystemId(id);
		setDisplaySystem(id); // new canonical preference
		// Keep legacy store loosely in sync for now (not required long term)
		await setSelectedGradeSystem(id === 'vscale' ? 'V' : id === 'font' ? 'Font' : id);
		setShowSelector(false);
	};

		const handleDeleteSystem = async (id: string, name: string) => {
			const message = `Are you sure you want to delete "${name}"?${selectedSystemId === id ? '\n\nIt is currently selected. We will switch you to V Scale.' : ''}`;
			const confirmed = await showConfirm('Delete grade system', message);
			if (!confirmed) return;
			await removeCustomSystem(id);
			const updated = await getCustomGradeSystems();
			setCustomSystems(updated);
			if (selectedSystemId === id) {
				setSelectedSystemId('vscale');
				setDisplaySystem('vscale');
				await setSelectedGradeSystem('V');
			}
		};

	const getGradeColor = (grade: { name: string; color: string }, sysId: string) => {
		// Built-in systems: prefer theme colors to reflect known scale palette
		if (sysId === 'vscale' || sysId === 'font') {
			return gradeColors[grade.name] || '#e0e7ff';
		}
		// Custom systems: use user-defined color, fallback to theme if label matches
		return grade.color || gradeColors[grade.name] || '#e0e7ff';
	};

	function getContrastColor(bgColor: string) {
		// Simple luminance check for contrast
		if (!bgColor) return '#22223B';
		const c = bgColor.substring(1); // strip #
		const rgb = parseInt(c, 16);
		const r = (rgb >> 16) & 0xff;
		const g = (rgb >> 8) & 0xff;
		const b = rgb & 0xff;
		// Perceived luminance
		const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
		return luminance > 180 ? '#22223B' : '#fff';
	}

	return (
		<View style={styles.container}>
			<Text style={styles.header}>Grade System</Text>

			<View style={styles.card}>
				<Text style={styles.cardTitle}>Current System</Text>
				<Text style={styles.cardName}>{selectedSystem.name}</Text>
				<ScrollView horizontal style={styles.gradeScroll} showsHorizontalScrollIndicator={false}>
								{selectedSystem.grades.map((grade, idx) => {
									const bgColor = getGradeColor(grade, selectedSystem.id);
						const textColor = getContrastColor(bgColor);
						return (
							<View key={grade.name} style={[styles.gradePill, { backgroundColor: bgColor }]}> 
								<Text style={[styles.gradeText, { color: textColor }]}>{grade.name}</Text>
							</View>
						);
					})}
				</ScrollView>
			</View>

			<TouchableOpacity style={styles.changeButton} onPress={() => setShowSelector(true)}>
				<Ionicons name="swap-horizontal" size={20} color="#fff" />
				<Text style={styles.changeButtonText}>Change Grade System</Text>
			</TouchableOpacity>

			<Text style={styles.sectionTitle}>Custom Grade Systems</Text>
			<FlatList
				data={customSystems}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => (
					<View style={styles.customRow}>
						<Text style={styles.customName}>{item.name}</Text>
						<View style={styles.customActions}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => { setEditing(item); setShowEditor(true); }}
              >
                <Ionicons name="pencil-outline" size={22} color="#6b7280" />
              </TouchableOpacity>
							<TouchableOpacity
								style={styles.iconButton}
								onPress={() => handleSelectSystem(item.id)}
							>
								<Ionicons name="checkmark-circle-outline" size={22} color="#2563eb" />
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.iconButton}
								onPress={() => handleDeleteSystem(item.id, item.name)}
							>
								<Ionicons name="trash-outline" size={22} color="#ef4444" />
							</TouchableOpacity>
						</View>
					</View>
				)}
				ListEmptyComponent={<Text style={styles.emptyText}>No custom grade systems yet.</Text>}
			/>

			<TouchableOpacity
				style={styles.addButton}
				onPress={() => { setEditing(null); setShowEditor(true); }}
			>
				<Ionicons name="add-circle-outline" size={20} color="#fff" />
				<Text style={styles.addButtonText}>Add New Custom System</Text>
			</TouchableOpacity>

			<Modal visible={showSelector} transparent animationType="fade">
				<View style={styles.modalOverlay}>
					<View style={styles.modalCard}>
						<Text style={styles.modalTitle}>Select Grade System</Text>
						<ScrollView style={{ maxHeight: 300 }}>
							{allSystems.map((system) => (
								<TouchableOpacity
									key={system.id}
									style={styles.modalOption}
									onPress={() => handleSelectSystem(system.id)}
								>
									<Text style={styles.modalOptionText}>{system.name}</Text>
								</TouchableOpacity>
							))}
						</ScrollView>
						<TouchableOpacity
							style={styles.modalCancel}
							onPress={() => setShowSelector(false)}
						>
							<Text style={styles.modalCancelText}>Cancel</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>

      {/* Editor Modal */}
      <Modal visible={showEditor} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { width: 360, maxWidth: '95%' }]}>
            <CustomGradeSystemEditor
              system={editing}
              onCancel={() => setShowEditor(false)}
              onSave={async (payload) => {
                const id = await upsertCustomSystem(payload);
                const updated = await getCustomGradeSystems();
                setCustomSystems(updated);
                setShowEditor(false);
              }}
            />
          </View>
        </View>
      </Modal>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: '#fff', padding: 16 },
	header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
	card: { marginBottom: 16, padding: 16, borderRadius: 12, backgroundColor: '#f3f4f6' },
	cardTitle: { fontSize: 16, fontWeight: '600' },
	cardName: { fontSize: 18, marginTop: 4, fontWeight: '500' },
	gradeScroll: { marginTop: 8 },
	gradePill: { paddingHorizontal: 10, paddingVertical: 6, marginRight: 8, borderRadius: 8 },
	gradeText: { color: '#2563eb', fontWeight: '600' },
	changeButton: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, padding: 12, borderRadius: 8, backgroundColor: '#2563eb' },
	changeButtonText: { marginLeft: 8, color: '#fff', fontWeight: '600' },
	sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
	customRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12, marginBottom: 8, borderRadius: 8, backgroundColor: '#f9fafb' },
	customName: { fontWeight: '500', fontSize: 15 },
	customActions: { flexDirection: 'row', alignItems: 'center' },
	iconButton: { marginLeft: 8 },
	emptyText: { color: '#9ca3af', fontStyle: 'italic', marginTop: 8 },
	addButton: { flexDirection: 'row', alignItems: 'center', marginTop: 16, padding: 12, borderRadius: 8, backgroundColor: '#16a34a' },
	addButtonText: { marginLeft: 8, color: '#fff', fontWeight: '600' },
	modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
	modalCard: { backgroundColor: '#fff', borderRadius: 12, padding: 24, width: 320, maxWidth: '90%' },
	modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
	modalOption: { padding: 12, borderRadius: 8, backgroundColor: '#f3f4f6', marginBottom: 8 },
	modalOptionText: { fontWeight: '500', fontSize: 16 },
	modalCancel: { marginTop: 16, padding: 12, borderRadius: 8, backgroundColor: '#e5e7eb' },
	modalCancelText: { textAlign: 'center', fontWeight: '600', fontSize: 16 },
});
