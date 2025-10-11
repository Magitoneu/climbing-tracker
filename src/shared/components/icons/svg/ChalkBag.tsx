/**
 * Chalk Bag Icon
 * Represents: Logging, adding entries, preparation
 */

import React from 'react';
import Svg, { Path, Rect, SvgProps } from 'react-native-svg';

export const ChalkBagIcon: React.FC<SvgProps> = props => (
  <Svg viewBox="0 0 24 24" {...props}>
    {/* Drawstring */}
    <Path d="M8 6L8 8" stroke={props.fill || 'currentColor'} strokeWidth={1.5} strokeLinecap="round" />
    <Path d="M16 6L16 8" stroke={props.fill || 'currentColor'} strokeWidth={1.5} strokeLinecap="round" />
    {/* Bag opening */}
    <Rect x={7} y={8} width={10} height={2} rx={1} fill={props.fill || 'currentColor'} />
    {/* Bag body */}
    <Path
      d="M7 10C7 10 6 11 6 13V17C6 19 7 20 9 20H15C17 20 18 19 18 17V13C18 11 17 10 17 10"
      stroke={props.fill || 'currentColor'}
      strokeWidth={2}
      fill="none"
      strokeLinecap="round"
    />
    {/* Belt loop */}
    <Path d="M10 20L10 22M14 20L14 22" stroke={props.fill || 'currentColor'} strokeWidth={1.5} strokeLinecap="round" />
  </Svg>
);
