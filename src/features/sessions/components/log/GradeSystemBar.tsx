import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  useWindowDimensions,
  Animated,
} from 'react-native';
import { colors, borderRadius } from '../../../../shared/design/theme';
import { typography } from '../../../../shared/design/typography';
import { spacing } from '../../../../shared/design/spacing';
import { GradeSystemDefinition } from '../../../grades/models/GradeSystem';

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
  // Animated scale per pill keyed by id - use useState for mutable map
  const [scalesMap] = useState(() => new Map<string, Animated.Value>());

  // Initialize scales for new systems
  const scales = useMemo(() => {
    systems.forEach(s => {
      if (!scalesMap.get(s.id)) {
        scalesMap.set(s.id, new Animated.Value(1));
      }
    });
    return scalesMap;
  }, [systems, scalesMap]);

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
    <View style={[styles.inlineRow, variant === 'compact' && styles.inlineRowCompact]}>
      {systems.map(sys => {
        const isSelected = activeId === sys.id;
        const firstColor = sys.grades.find(g => !!g.color)?.color;
        const bg = isSelected ? firstColor || colors.primary : colors.surface;
        const pillBorderColor = isSelected ? firstColor || colors.primary : colors.border;
        const textColor = isSelected ? colors.textOnPrimary : colors.text;
        const scale = scales.get(sys.id)!;
        return (
          <Animated.View key={sys.id} style={[styles.animatedPill, { transform: [{ scale }] }]}>
            <TouchableOpacity
              accessibilityLabel={`Select grade system ${sys.name}`}
              onPress={() => onChange(sys.id)}
              style={[
                styles.pill,
                variant === 'compact' && styles.pillCompact,
                { backgroundColor: bg, borderColor: pillBorderColor, maxWidth: maxPillWidth },
              ]}
            >
              <Text
                style={[styles.text, variant === 'compact' && styles.textCompact, { color: textColor }]}
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
        contentContainerStyle={[styles.container, variant === 'compact' && styles.containerCompact]}
      >
        <View style={styles.fadeLeft} pointerEvents="none" />
        {Pills}
        <View style={styles.spacer} />
        <View style={styles.fadeRight} pointerEvents="none" />
      </ScrollView>
      <View style={styles.divider} />
    </View>
  );
};

const styles = StyleSheet.create({
  animatedPill: {
    marginRight: spacing.sm,
  },
  container: { paddingHorizontal: spacing.xs },
  containerCompact: {
    paddingHorizontal: 0,
  },
  divider: {
    backgroundColor: colors.divider,
    bottom: 0,
    height: 1,
    left: 0,
    position: 'absolute',
    right: 0,
  },
  fadeLeft: {
    backgroundColor: `linear-gradient(90deg, ${colors.background} 0%, transparent 100%)`,
    bottom: 0,
    left: 0,
    position: 'absolute',
    top: 0,
    width: spacing.sm,
  },
  fadeRight: {
    backgroundColor: `linear-gradient(270deg, ${colors.background} 0%, transparent 100%)`,
    bottom: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    width: spacing.sm,
  },
  inlineRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.xs,
  },
  inlineRowCompact: {
    marginBottom: spacing.xxs,
  },
  pill: {
    alignSelf: 'flex-start',
    borderRadius: borderRadius.full,
    borderWidth: 1,
    flexGrow: 0,
    flexShrink: 0,
    marginRight: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  pillCompact: {
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  scroll: { marginBottom: spacing.xs },
  spacer: {
    width: spacing.xs,
  },
  text: {
    ...typography.captionBold,
  },
  textCompact: {
    ...typography.caption,
  },
  wrapper: { marginBottom: spacing.xs, position: 'relative' },
});

export default GradeSystemBar;
