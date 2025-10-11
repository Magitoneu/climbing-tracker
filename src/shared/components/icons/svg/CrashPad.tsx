/**
 * Crash Pad Icon
 * Represents: Safety, delete, remove
 */

import React from 'react';
import Svg, { Rect, Path, SvgProps } from 'react-native-svg';

export const CrashPadIcon: React.FC<SvgProps> = props => (
  <Svg viewBox="0 0 24 24" {...props}>
    {/* Crash pad layers */}
    <Rect x={4} y={13} width={16} height={7} rx={1} fill={props.fill || 'currentColor'} />
    <Rect x={4} y={13} width={16} height={2} fill="white" opacity={0.2} />
    <Rect x={4} y={18} width={16} height={2} fill="black" opacity={0.1} />
    {/* Handles */}
    <Path
      d="M7 13C7 13 7 11 8 11C9 11 9 13 9 13"
      stroke={props.fill || 'currentColor'}
      strokeWidth={1.5}
      fill="none"
      strokeLinecap="round"
    />
    <Path
      d="M15 13C15 13 15 11 16 11C17 11 17 13 17 13"
      stroke={props.fill || 'currentColor'}
      strokeWidth={1.5}
      fill="none"
      strokeLinecap="round"
    />
    {/* Falling figure (optional - shows purpose) */}
    <Path
      d="M12 5C12.5523 5 13 4.55228 13 4C13 3.44772 12.5523 3 12 3C11.4477 3 11 3.44772 11 4C11 4.55228 11.4477 5 12 5Z"
      fill={props.fill || 'currentColor'}
      opacity={0.5}
    />
    <Path
      d="M12 6L12 8M12 8L10 9M12 8L14 9"
      stroke={props.fill || 'currentColor'}
      strokeWidth={1}
      strokeLinecap="round"
      opacity={0.5}
    />
  </Svg>
);
