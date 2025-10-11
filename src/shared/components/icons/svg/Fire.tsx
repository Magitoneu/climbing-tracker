/**
 * Fire Icon
 * Represents: Streak, hot performance, send energy
 */

import React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

export const FireIcon: React.FC<SvgProps> = props => (
  <Svg viewBox="0 0 24 24" {...props}>
    {/* Flame shape */}
    <Path
      d="M12 2C12 2 9 5 9 9C9 10 9.5 11 10 11.5C10 11.5 9 11 9 9C9 7 10 5 12 3C14 5 15 7 15 9C15 11 14 11.5 14 11.5C14.5 11 15 10 15 9C15 5 12 2 12 2Z"
      fill={props.fill || 'currentColor'}
    />
    <Path
      d="M12 11C12 11 9 13 9 16C9 18.76 11.24 21 14 21C16.76 21 19 18.76 19 16C19 13 16 11 16 11C16 11 16 13 14 13C12 13 12 11 12 11Z"
      fill={props.fill || 'currentColor'}
      opacity={0.8}
    />
    {/* Inner flame */}
    <Path
      d="M12 14C12 14 11 15 11 16.5C11 17.88 12.12 19 13.5 19C14.88 19 16 17.88 16 16.5C16 15 15 14 15 14C15 14 15 15 14 15C13 15 12 14 12 14Z"
      fill="white"
      opacity={0.4}
    />
  </Svg>
);
