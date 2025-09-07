import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, ScrollView, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getCustomGradeSystems, getSelectedGradeSystem, setSelectedGradeSystem, deleteCustomGradeSystem } from '../storage/customGradeSystemStore';
import { CustomGradeSystem } from '../models/CustomGradeSystem';
import { V_GRADES, FONT_GRADES } from '../models/grades';
import { gradeColors } from '../theme';

const DEFAULT_SYSTEMS: CustomGradeSystem[] = [
	{ id: 'V', name: 'V Scale', grades: V_GRADES.map((g) => ({ name: g, color: '#2563eb' })) },
	{ id: 'Font', name: 'Font Scale', grades: FONT_GRADES.map((g) => ({ name: g, color: '#16a34a' })) },
];

export default function SettingsGradeSystemScreen() {
	const [customSystems, setCustomSystems] = useState<CustomGradeSystem[]>([]);
	const [selectedSystemId, setSelectedSystemId] = useState<string>('V');
	const [showSelector, setShowSelector] = useState(false);

	useEffect(() => {
		getCustomGradeSystems().then(setCustomSystems);
		getSelectedGradeSystem().then(setSelectedSystemId);
	}, []);

	const allSystems = [...DEFAULT_SYSTEMS, ...customSystems];
	const selectedSystem = allSystems.find((s) => s.id === selectedSystemId) || DEFAULT_SYSTEMS[0];

	const handleSelectSystem = async (id: string) => {
		await setSelectedGradeSystem(id);
		setSelectedSystemId(id);
		setShowSelector(false);
	};

	const handleDeleteSystem = async (id: string) => {
		await deleteCustomGradeSystem(id);
		const updated = await getCustomGradeSystems();
		setCustomSystems(updated);
		if (selectedSystemId === id) {
			setSelectedSystemId('V');
		}
	};

	const getGradeColor = (grade: { name: string; color: string }, systemId: string) => {
		// For default systems, use theme gradeColors
		if (systemId === 'V' || systemId === 'Font') {
			return gradeColors[grade.name] || '#e0e7ff';
		}
		// For custom, use user-defined color
		return grade.color || '#e0e7ff';
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
								onPress={() => handleSelectSystem(item.id)}
							>
								<Ionicons name="checkmark-circle-outline" size={22} color="#2563eb" />
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.iconButton}
								onPress={() => handleDeleteSystem(item.id)}
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
				onPress={() => {
					/* TODO: open add custom system modal */
				}}
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
