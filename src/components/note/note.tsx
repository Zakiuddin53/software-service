'use client';
import React, { useMemo } from 'react';
import useTheme from '../use-theme';
import { COLOR_TYPES, NormalTypes } from '../utils/prop-types';
import { UIThemes } from '../themes/presets';
import useScale, { withScale } from '../use-scale';
import useClasses from '../use-classes';
import { AlertCircleFill, AlertTriangle, Info, XCircleFill } from '../icons';

export type NoteTypes = COLOR_TYPES;

interface Props {
  type?: NoteTypes;
  icon?: React.ReactNode | boolean;
  filled?: boolean;
  className?: string;
}

type NativeAttrs = Omit<React.HTMLAttributes<HTMLDivElement>, keyof Props>;
export type NoteProps = Props & NativeAttrs;

const getStatusColor = (type: NoteTypes, filled: boolean, theme: UIThemes) => {
  const colors: { [key in NoteTypes]?: string } = {
    primary: theme.palette.primary.hex_1000,
    tertiary: theme.palette.tertiary.hex_1000,
    secondary: theme.palette.secondary.hex_1000,
    success: theme.palette.success.hex_1000,
    warning: theme.palette.warning.hex_1000,
    error: theme.palette.error.hex_1000,
  };
  const statusColor = colors[type];

  const borderColors: { [key in NoteTypes]?: string } = {
    primary: theme.palette.primary.hex_1200,
    tertiary: theme.palette.tertiary.hex_1200,
    secondary: theme.palette.secondary.hex_1200,
    success: theme.palette.success.hex_1200,
    warning: theme.palette.warning.hex_1200,
    error: theme.palette.error.hex_1200,
  };
  const borderColorsType = borderColors[type];

  if (!filled)
    return {
      color: statusColor || theme.palette.foreground.hex_1000,
      borderColor: borderColorsType || theme.palette.border.hex_1000,
      bgColor: theme.palette.background.hex_1000,
    };
  const filledColor = statusColor ? 'white' : theme.palette.background.hex_1000;
  return {
    color: filledColor,
    borderColor: borderColorsType || theme.palette.foreground.hex_1000,
    bgColor: statusColor || theme.palette.foreground.hex_1000,
  };
};

export const NoteComponent: React.FC<React.PropsWithChildren<NoteProps>> = ({
  children,
  type = 'default' as NoteTypes,
  icon = true,
  filled = false,
  className = '',
  ...props
}: React.PropsWithChildren<NoteProps>) => {
  const theme = useTheme();
  const { SCALES } = useScale();
  const { color, borderColor, bgColor } = useMemo(() => getStatusColor(type, filled, theme), [type, filled, theme]);

  const icons: { [key in NoteTypes]?: React.ReactNode } = {
    secondary: <Info size={SCALES.font(1)}></Info>,
    success: <AlertCircleFill size={SCALES.font(1)}></AlertCircleFill>,
    warning: <AlertTriangle size={SCALES.font(1)}></AlertTriangle>,
    error: <XCircleFill size={SCALES.font(1)}></XCircleFill>,
  };
  const statusIcon = icons[type];

  const foundIcon = icon == true ? statusIcon : icon;

  return (
    <div className={useClasses('note', className)} {...props}>
      {foundIcon && <span className="label">{foundIcon}</span>}
      <span>{children}</span>

      <style jsx>{`
        .note {
          line-height: 1.8;
          border: 1px solid ${borderColor};
          color: ${color};
          background-color: ${bgColor};
          border-radius: ${SCALES.r(1, `var(--layout-radius)`)};
          font-size: ${SCALES.font(0.875)};
          width: ${SCALES.w(1, 'auto')};
          height: ${SCALES.h(1, 'auto')};
          padding: ${SCALES.pt(0.5)} ${SCALES.pr(0.8)} ${SCALES.pb(0.5)} ${SCALES.pl(0.8)};
          margin: ${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)} ${SCALES.ml(0)};
          display: flex;
          align-items: flex-start;
        }

        span {
          line-height: normal;
        }

        .note :global(p) {
          margin: 0;
        }

        .label {
          text-transform: uppercase;
          user-select: none;
          padding-right: 0.38em;
          display: inline-flex;
          align-items: center;
        }
      `}</style>
    </div>
  );
};

NoteComponent.displayName = 'HimalayaNote';
const Note = withScale(NoteComponent);
export default Note;
