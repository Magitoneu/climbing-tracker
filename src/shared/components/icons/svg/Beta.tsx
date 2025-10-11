/**
 * Beta Icon
 * Represents: Route information, tips, guidance, arrow
 */

import React from 'react';
import Svg, { Path, Circle, SvgProps } from 'react-native-svg';

export const BetaIcon: React.FC<SvgProps> = props => (
  <Svg viewBox="0 0 24 24" {...props}>
    {/* Route diagram - climbing path with holds */}
    <Circle cx={7} cy={18} r={2} fill={props.fill || 'currentColor'} opacity={0.4} />
    <Path
      d="M7 16C7 16 9 14 11 12"
      stroke={props.fill || 'currentColor'}
      strokeWidth={2}
      strokeDasharray="2 2"
      fill="none"
      strokeLinecap="round"
    />
    <Circle cx={11} cy={12} r={2} fill={props.fill || 'currentColor'} opacity={0.6} />
    <Path
      d="M13 12C13 12 15 10 17 8"
      stroke={props.fill || 'currentColor'}
      strokeWidth={2}
      strokeDasharray="2 2"
      fill="none"
      strokeLinecap="round"
    />
    <Circle cx={17} cy={6} r={2} fill={props.fill || 'currentColor'} />
    {/* Arrow pointing to top hold (the crux) */}
    <Path
      d="M19 4L17 6L19 8"
      stroke={props.fill || 'currentColor'}
      strokeWidth={1.5}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
