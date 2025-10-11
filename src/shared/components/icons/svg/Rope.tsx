/**
 * Rope Icon
 * Represents: Connection, safety, route
 */

import React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

export const RopeIcon: React.FC<SvgProps> = props => (
  <Svg viewBox="0 0 24 24" {...props}>
    {/* Rope weave pattern */}
    <Path
      d="M8 3C8 3 10 4 10 6C10 8 8 9 8 9"
      stroke={props.fill || 'currentColor'}
      strokeWidth={2}
      fill="none"
      strokeLinecap="round"
    />
    <Path
      d="M10 6C10 6 12 7 12 9C12 11 10 12 10 12"
      stroke={props.fill || 'currentColor'}
      strokeWidth={2}
      fill="none"
      strokeLinecap="round"
    />
    <Path
      d="M12 9C12 9 14 10 14 12C14 14 12 15 12 15"
      stroke={props.fill || 'currentColor'}
      strokeWidth={2}
      fill="none"
      strokeLinecap="round"
    />
    <Path
      d="M14 12C14 12 16 13 16 15C16 17 14 18 14 18"
      stroke={props.fill || 'currentColor'}
      strokeWidth={2}
      fill="none"
      strokeLinecap="round"
    />
    <Path
      d="M16 15C16 15 18 16 18 18C18 20 16 21 16 21"
      stroke={props.fill || 'currentColor'}
      strokeWidth={2}
      fill="none"
      strokeLinecap="round"
    />
  </Svg>
);
