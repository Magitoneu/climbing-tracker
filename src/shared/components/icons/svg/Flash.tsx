/**
 * Flash Icon
 * Represents: First-try success, flash indicator, quick action
 */

import React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

export const FlashIcon: React.FC<SvgProps> = props => (
  <Svg viewBox="0 0 24 24" {...props}>
    {/* Lightning bolt inside carabiner concept */}
    <Path
      d="M13 2L4 13H11L10 22L20 11H13L13 2Z"
      fill={props.fill || 'currentColor'}
      stroke={props.fill || 'currentColor'}
      strokeWidth={1}
      strokeLinejoin="round"
      strokeLinecap="round"
    />
  </Svg>
);
