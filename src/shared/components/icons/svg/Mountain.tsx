/**
 * Mountain Icon
 * Represents: Outdoor climbing, home, dashboard
 */

import React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

export const MountainIcon: React.FC<SvgProps> = props => (
  <Svg viewBox="0 0 24 24" {...props}>
    {/* Mountain peaks */}
    <Path d="M3 20L8 10L12 15L16 8L21 20H3Z" fill={props.fill || 'currentColor'} />
    {/* Snow cap on main peak */}
    <Path d="M16 8L14 12L18 12L16 8Z" fill="white" opacity={0.3} />
    {/* Secondary peak snow */}
    <Path d="M12 15L11 17L13 17L12 15Z" fill="white" opacity={0.2} />
    {/* Shadow/depth */}
    <Path d="M12 15L16 8L21 20H12V15Z" fill="black" opacity={0.1} />
  </Svg>
);
