import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Platform, useWindowDimensions, Animated } from 'react-native';
import { colors } from '../../theme';
import { GradeSystemDefinition } from '../../models/GradeSystem';

interface Props {
  systems: GradeSystemDefinition[];
  activeId: string;
  onChange: (id: string) => void;
  variant?: 'default' | 'compact';
}

export const GradeSystemBar: React.FC<Props> = ({ systems, activeId, onChange, variant = 'default' }) => {
  const { width } = useWindowDimensions();
  // If very wide screen, constrain max visible pill width so they don't stretch visually.
  const maxPillWidth = Math.min(140, Math.max(110, width / 5));
  // Animated scale per pill keyed by id
  const scales = useRef(new Map<string, Animated.Value>()).current;
  systems.forEach(s => { if (!scales.get(s.id)) scales.set(s.id, new Animated.Value(1)); });
  useEffect(() => {
    scales.forEach((val, id) => {
      Animated.spring(val, {
        toValue: id === activeId ? 1.05 : 1,
        useNativeDriver: true,
        friction: 7,
        tension: 120,
      }).start();
    });
  }, [activeId, systems, scales]);

  const Pills = (
    <View style={[styles.inlineRow, variant === 'compact' && { marginBottom: 2 }]}> 
  {systems.map(sys => {
        const isSelected = activeId === sys.id;
        const firstColor = sys.grades.find(g => !!g.color)?.color;
        const bg = isSelected ? (firstColor || colors.primary) : '#FFFFFF';
        const borderColor = isSelected ? (firstColor || colors.primary) : '#CBD5E1';
        const textColor = isSelected ? '#fff' : '#1E293B';
        const scale = scales.get(sys.id)!;
        return (
          <Animated.View key={sys.id} style={{ transform: [{ scale }], marginRight: 8 }}>
            <TouchableOpacity
              accessibilityLabel={`Select grade system ${sys.name}`}
              onPress={() => onChange(sys.id)}
              style={[
                styles.pill,
                variant === 'compact' && styles.pillCompact,
                { backgroundColor: bg, borderColor, maxWidth: maxPillWidth }
              ]}
            >
              <Text
                style={[
                  styles.text,
                  variant === 'compact' && styles.textCompact,
                  { color: textColor }
                ]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {sys.name}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        );
      })}
    </View>
  );
  if (Platform.OS === 'web' && systems.length <= 4) {
    return Pills;
  }
  return (
    <View style={styles.wrapper}> 
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scroll}
        contentContainerStyle={[styles.container, variant === 'compact' && { paddingHorizontal: 0 }]}
      >
        <View style={styles.fadeLeft} pointerEvents="none" />
        {Pills}
        <View style={{ width: 4 }} />
        <View style={styles.fadeRight} pointerEvents="none" />
      </ScrollView>
      <View style={styles.divider} />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { position: 'relative', marginBottom: 4 },
  scroll: { marginBottom: 4 },
  container: { paddingHorizontal: 4 },
  inlineRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', marginBottom: 4 },
  pill: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 24, borderWidth: 1, marginRight: 8, flexGrow: 0, flexShrink: 0, alignSelf: 'flex-start' },
  pillCompact: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20 },
  text: { fontWeight: '600', fontSize: 14 },
  textCompact: { fontSize: 13 },
  divider: { height: 1, backgroundColor: '#E2E8F0', position: 'absolute', left: 0, right: 0, bottom: 0 },
  fadeLeft: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 12, backgroundColor: 'linear-gradient(90deg, #F1F5F9 0%, rgba(241,245,249,0) 100%)' },
  fadeRight: { position: 'absolute', right: 0, top: 0, bottom: 0, width: 12, backgroundColor: 'linear-gradient(270deg, #F1F5F9 0%, rgba(241,245,249,0) 100%)' },
});

export default GradeSystemBar;
