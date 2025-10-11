import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { colors } from '../theme';

interface FlashedToggleProps {
  value: boolean;
  onToggle: () => void;
}

export default function FlashedToggle({ value, onToggle }: FlashedToggleProps) {
  return (
    <Pressable
      style={[
        styles.button,
        {
          backgroundColor: value ? colors.flash : colors.surface,
          borderColor: colors.primary,
        },
      ]}
      onPress={onToggle}
    >
      <Text
        style={[
          styles.text,
          {
            color: value ? colors.surface : colors.primary,
            textShadowColor: value ? colors.primary : colors.surface,
          },
        ]}
      >
        Flashed
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 10,
    borderWidth: 2,
    flexDirection: 'row',
    marginBottom: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 2,
  },
});
