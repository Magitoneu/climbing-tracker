/**
 * Boulder Icon
 * Represents: Bouldering, home/dashboard, problems
 */

import React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

export const BoulderIcon: React.FC<SvgProps> = props => (
  <Svg viewBox="0 0 24 24" {...props}>
    {/* Organic boulder shape */}
    <Path
      d="M5 13C5 13 4 12 4 10C4 8 5 7 7 6C9 5 10 5 12 5C14 5 15 5 17 6C19 7 20 8 20 10C20 12 19 13 19 13"
      stroke={props.fill || 'currentColor'}
      strokeWidth={2}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M5 13C5 13 4 14 4 16C4 18 5.5 19 8 19H16C18.5 19 20 18 20 16C20 14 19 13 19 13"
      fill={props.fill || 'currentColor'}
    />
    {/* Texture dots - holds on boulder */}
    <Path
      d="M9 15C9 15.5523 8.55228 16 8 16C7.44772 16 7 15.5523 7 15C7 14.4477 7.44772 14 8 14C8.55228 14 9 14.4477 9 15Z"
      fill="white"
      opacity={0.3}
    />
    <Path
      d="M13 15C13 15.5523 12.5523 16 12 16C11.4477 16 11 15.5523 11 15C11 14.4477 11.4477 14 12 14C12.5523 14 13 14.4477 13 15Z"
      fill="white"
      opacity={0.3}
    />
    <Path
      d="M17 15C17 15.5523 16.5523 16 16 16C15.4477 16 15 15.5523 15 15C15 14.4477 15.4477 14 16 14C16.5523 14 17 14.4477 17 15Z"
      fill="white"
      opacity={0.3}
    />
  </Svg>
);
