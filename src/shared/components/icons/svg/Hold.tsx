/**
 * Hold Icon
 * Represents: Climbing hold, difficulty, grade
 */

import React from 'react';
import Svg, { Path, Ellipse, SvgProps } from 'react-native-svg';

export const HoldIcon: React.FC<SvgProps> = props => (
  <Svg viewBox="0 0 24 24" {...props}>
    {/* Organic hold shape (jug) */}
    <Path
      d="M12 4C8 4 5 6 4 8C3 10 3 12 4 14C5 16 7 18 10 19C11 19.5 13 19.5 14 19C17 18 19 16 20 14C21 12 21 10 20 8C19 6 16 4 12 4Z"
      fill={props.fill || 'currentColor'}
    />
    {/* Bolt holes */}
    <Ellipse cx={9} cy={10} rx={1.5} ry={1.5} fill="white" opacity={0.3} />
    <Ellipse cx={15} cy={10} rx={1.5} ry={1.5} fill="white" opacity={0.3} />
    {/* Texture */}
    <Path
      d="M12 14C13 14 14 13.5 14 13C14 12.5 13 12 12 12C11 12 10 12.5 10 13C10 13.5 11 14 12 14Z"
      fill="white"
      opacity={0.2}
    />
  </Svg>
);
