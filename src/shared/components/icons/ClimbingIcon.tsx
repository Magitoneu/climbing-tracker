/**
 * ClimbingIcon Component
 *
 * Central icon component for all climbing-specific icons.
 * Replace generic Ionicons with authentic climbing iconography.
 *
 * Usage:
 * <ClimbingIcon name="carabiner" size={24} color={colors.primary} />
 */

import React from 'react';
import { colors } from '../../design/theme';

// Import SVG icon components
import { BoulderIcon } from './svg/Boulder';
import { CarabinerIcon } from './svg/Carabiner';
import { ChalkBagIcon } from './svg/ChalkBag';
import { FlashIcon } from './svg/Flash';
import { FireIcon } from './svg/Fire';
import { HoldIcon } from './svg/Hold';
import { RopeIcon } from './svg/Rope';
import { CrashPadIcon } from './svg/CrashPad';
import { LogbookIcon } from './svg/Logbook';
import { MountainIcon } from './svg/Mountain';
import { BetaIcon } from './svg/Beta';

// ============================================================================
// ICON MAP
// ============================================================================

export const iconMap = {
  boulder: BoulderIcon,
  carabiner: CarabinerIcon,
  chalkBag: ChalkBagIcon,
  flash: FlashIcon,
  fire: FireIcon,
  hold: HoldIcon,
  rope: RopeIcon,
  crashPad: CrashPadIcon,
  logbook: LogbookIcon,
  mountain: MountainIcon,
  beta: BetaIcon,
} as const;

export type ClimbingIconName = keyof typeof iconMap;

// ============================================================================
// ICON COMPONENT
// ============================================================================

export interface ClimbingIconProps {
  /** Icon name from climbing icon set */
  name: ClimbingIconName;
  /** Icon size in pixels (default: 24) */
  size?: number;
  /** Icon color (default: colors.text) */
  color?: string;
  /** Accessibility label */
  accessibilityLabel?: string;
  /** Test ID for testing */
  testID?: string;
}

export const ClimbingIcon: React.FC<ClimbingIconProps> = ({
  name,
  size = 24,
  color = colors.text,
  accessibilityLabel,
  testID,
}) => {
  const IconComponent = iconMap[name];

  if (!IconComponent) {
    console.warn(`ClimbingIcon: Unknown icon name "${name}"`);
    return null;
  }

  return (
    <IconComponent
      width={size}
      height={size}
      fill={color}
      accessibilityLabel={accessibilityLabel || `${name} icon`}
      testID={testID}
    />
  );
};

export default ClimbingIcon;

// ============================================================================
// ICON PRESETS - Common Use Cases
// ============================================================================

/**
 * Navigation icons with consistent sizing
 */
export const NavigationIcon: React.FC<Omit<ClimbingIconProps, 'size'>> = props => <ClimbingIcon {...props} size={28} />;

/**
 * Button icons with consistent sizing
 */
export const ButtonIcon: React.FC<Omit<ClimbingIconProps, 'size'>> = props => <ClimbingIcon {...props} size={20} />;

/**
 * Large feature icons
 */
export const FeatureIcon: React.FC<Omit<ClimbingIconProps, 'size'>> = props => <ClimbingIcon {...props} size={48} />;

/**
 * Small inline icons
 */
export const InlineIcon: React.FC<Omit<ClimbingIconProps, 'size'>> = props => <ClimbingIcon {...props} size={16} />;
