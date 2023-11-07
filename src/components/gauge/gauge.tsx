'use client';
import React from 'react';
import useTheme from '../use-theme';
import { useProportions } from '../utils/calculations';
import { UIThemesPalette } from '../themes/presets';
import { NormalTypes } from '../utils/prop-types';
import useScale, { withScale } from '../use-scale';
import useClasses from '../use-classes';

export type GaugeColors = {
  [key: number]: string;
};
export type GaugeTypes = NormalTypes;

interface Props {
  value?: number;
  max?: number;
  colors?: GaugeColors;
  type?: GaugeTypes;
  showValue?: boolean;
  size?: 'tiny' | 'small' | 'medium' | 'large' | string;
}

type NativeAttrs = Omit<React.HTMLAttributes<any>, keyof Props>;
export type GaugeProps = Props & NativeAttrs;

const getCurrentColor = (ratio: number, palette: UIThemesPalette, type: GaugeTypes, colors: GaugeColors = {}): string => {
  const defaultColors: { [key in GaugeTypes]: string } = {
    default: palette.foreground,
    success: palette.success.value,
    secondary: palette.secondary.value,
    primary: palette.primary.value,
    tertiary: palette.tertiary.value,
    warning: palette.warning.value,
    error: palette.error.value,
  };
  const colorKeys = Object.keys(colors);
  if (colorKeys.length === 0) return defaultColors[type];

  const customColorKey = colorKeys.find(key => ratio <= +key);
  if (!customColorKey || Number.isNaN(+customColorKey)) return defaultColors[type];
  return colors[+customColorKey];
};

const GaugeComponent: React.FC<GaugeProps> = ({
  value = 0,
  max = 100,
  className = '',
  type = 'default' as GaugeTypes,
  colors,
  showValue = false,
  size,
  ...props
}: GaugeProps) => {
  const theme = useTheme();
  const { SCALES } = useScale();
  const percentValue = useProportions(value, max);
  const currentColor = getCurrentColor(percentValue, theme.palette, type, colors);
  const classes = useClasses('gauge', className);

  const radius = size === 'tiny' ? 45 : size === 'small' ? 60 : size === 'medium' ? 75 : size === 'large' ? 90 : parseFloat(size ?? '45');
  const textSizes = size === 'tiny' ? SCALES.font(1) : size === 'small' ? SCALES.font(1.5) : size === 'medium' ? SCALES.font(2) : SCALES.font(2.5);
  const fontWeight = size === 'tiny' || size === 'small' ? 500 : 600;
  const strokeWidth = radius < 45 ? 5 : 10;
  const circumference = 2 * Math.PI * (radius - strokeWidth / 2);
  const dashArray = circumference;
  const dashOffset = (1 - value / 100) * dashArray;

  return (
    <div className={classes} {...props}>
      <svg width={2 * radius} height={2 * radius} viewBox={`0 0 ${2 * radius} ${2 * radius}`}>
        <circle
          cx={radius}
          cy={radius}
          r={radius - strokeWidth / 2}
          fill="none"
          stroke={theme.palette.accents_2}
          strokeWidth={strokeWidth}
          strokeDasharray={dashArray}
        />
        <circle
          cx={radius}
          cy={radius}
          r={radius - strokeWidth / 2}
          fill="none"
          stroke={currentColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={dashArray}
          strokeDashoffset={dashOffset}
        />
      </svg>
      {showValue && <div className="gauge-content">{percentValue}</div>}
      <style jsx>{`
        svg {
          shape-rendering: crispEdges;

          > circle {
            shape-rendering: geometricprecision;
          }
        }
        .gauge {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          position: relative;

          * {
            transition: all 1s ease;
          }

          > .gauge-content {
            animation: gauge-fadein 1s ease forwards;
            animation-delay: 0s;
            display: flex;
            opacity: 0;
            position: absolute;
            font-size: ${textSizes};
            font-weight: ${fontWeight};
          }
        }

        @keyframes gauge-fadein {
          to {
            opacity: 1;
          }
        }
        @keyframes indeterminate {
          0% {
            transform: translateX(0) scaleX(0);
          }
          40% {
            transform: translateX(0) scaleX(0.4);
          }
          100% {
            transform: translateX(100%) scaleX(0.5);
          }
        }
      `}</style>
    </div>
  );
};

GaugeComponent.displayName = 'HimalayGauge';
const Gauge = withScale(GaugeComponent);
export default Gauge;