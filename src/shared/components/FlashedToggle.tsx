import React from 'react';
import { Pressable, Text } from 'react-native';
import { colors } from '../theme';

interface FlashedToggleProps {
  value: boolean;
  onToggle: () => void;
}

export default function FlashedToggle({ value, onToggle }: FlashedToggleProps) {
  return (
    <Pressable
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderRadius: 10,
        backgroundColor: value ? colors.flash : colors.surface,
        borderWidth: 2,
        borderColor: colors.primary,
        marginBottom: 8,
      }}
      onPress={onToggle}
    >
      <Text
        style={{
          color: value ? colors.surface : colors.primary,
          fontWeight: '700',
          textAlign: 'center',
          textShadowColor: value ? colors.primary : colors.surface,
          textShadowOffset: { width: 0, height: 0 },
          textShadowRadius: 2,
          fontSize: 16,
        }}
      >
        Flashed
      </Text>
    </Pressable>
  );
}
