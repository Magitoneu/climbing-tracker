/**
 * Logbook Icon
 * Represents: Sessions, history, logs
 */

import React from 'react';
import Svg, { Rect, Path, Line, SvgProps } from 'react-native-svg';

export const LogbookIcon: React.FC<SvgProps> = props => (
  <Svg viewBox="0 0 24 24" {...props}>
    {/* Book cover */}
    <Rect x={5} y={3} width={14} height={18} rx={1} fill={props.fill || 'currentColor'} />
    {/* Pages */}
    <Rect x={6} y={4} width={12} height={16} rx={0.5} fill="white" opacity={0.9} />
    {/* Binding */}
    <Line x1={8} y1={3} x2={8} y2={21} stroke={props.fill || 'currentColor'} strokeWidth={1} opacity={0.3} />
    {/* Written entries (lines) */}
    <Line x1={10} y1={8} x2={16} y2={8} stroke={props.fill || 'currentColor'} strokeWidth={1} opacity={0.3} />
    <Line x1={10} y1={11} x2={15} y2={11} stroke={props.fill || 'currentColor'} strokeWidth={1} opacity={0.3} />
    <Line x1={10} y1={14} x2={16} y2={14} stroke={props.fill || 'currentColor'} strokeWidth={1} opacity={0.3} />
    <Line x1={10} y1={17} x2={14} y2={17} stroke={props.fill || 'currentColor'} strokeWidth={1} opacity={0.3} />
    {/* Bookmark */}
    <Path d="M17 3V10L15 8.5L13 10V3" fill={props.fill || 'currentColor'} opacity={0.6} />
  </Svg>
);
