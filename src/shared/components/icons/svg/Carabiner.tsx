/**
 * Carabiner Icon
 * Represents: Connection, safety, gear, profile/user
 */

import React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

export const CarabinerIcon: React.FC<SvgProps> = props => (
  <Svg viewBox="0 0 24 24" {...props}>
    <Path
      d="M12 3C9.5 3 7.5 5 7.5 7.5V16.5C7.5 19 9.5 21 12 21C14.5 21 16.5 19 16.5 16.5V7.5C16.5 5 14.5 3 12 3Z"
      stroke={props.fill || 'currentColor'}
      strokeWidth={2}
      fill="none"
      strokeLinecap="round"
    />
    <Path d="M12 3C10.5 3 9.5 4 9.5 5V6.5H14.5V5C14.5 4 13.5 3 12 3Z" fill={props.fill || 'currentColor'} />
    <Path d="M10 10H14" stroke={props.fill || 'currentColor'} strokeWidth={2.5} strokeLinecap="round" />
  </Svg>
);
