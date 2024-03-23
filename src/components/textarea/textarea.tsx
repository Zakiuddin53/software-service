'use client';
import React, { useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { getColors } from '../input/styles';
import useClasses from '../use-classes';
import useScale, { withScale } from '../use-scale';
import useTheme from '../use-theme';
import { addColorAlpha } from '../utils/color';
import { NormalTypes, tuple } from '../utils/prop-types';

const resizeTypes = tuple('none', 'both', 'horizontal', 'vertical', 'initial', 'inherit');
export type TextareaResizes = (typeof resizeTypes)[number];
export type TextareaTypes = NormalTypes;
interface Props {
  value?: string;
  initialValue?: string;
  placeholder?: string;
  type?: TextareaTypes;
  disabled?: boolean;
  readOnly?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  className?: string;
  resize?: TextareaResizes;
}

type NativeAttrs = Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, keyof Props>;
export type TextareaProps = Props & NativeAttrs;

const TextareaComponent = React.forwardRef<HTMLTextAreaElement, React.PropsWithChildren<TextareaProps>>(
  (
    {
      type = 'default' as TextareaTypes,
      disabled = false,
      readOnly = false,
      onFocus,
      onBlur,
      className = '',
      initialValue = '',
      onChange,
      value,
      placeholder,
      resize = 'none' as TextareaResizes,
      ...props
    }: React.PropsWithChildren<TextareaProps>,
    ref: React.Ref<HTMLTextAreaElement | null>,
  ) => {
    const theme = useTheme();
    const { SCALES } = useScale();
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    useImperativeHandle(ref, () => textareaRef.current);
    const isControlledComponent = useMemo(() => value !== undefined, [value]);
    const [selfValue, setSelfValue] = useState<string>(initialValue);
    const [hover, setHover] = useState<boolean>(false);
    const { color, borderColor, hoverBorder } = useMemo(() => getColors(theme.palette, type), [theme.palette, type]);
    const classes = useClasses('wrapper', { hover, disabled }, className);

    const changeHandler = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (disabled || readOnly) return;
      setSelfValue(event.target.value);
      onChange && onChange(event);
    };
    const focusHandler = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setHover(true);
      onFocus && onFocus(e);
    };
    const blurHandler = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setHover(false);
      onBlur && onBlur(e);
    };

    useEffect(() => {
      if (isControlledComponent) {
        setSelfValue(value as string);
      }
    }, [value, isControlledComponent]);

    const controlledValue = isControlledComponent ? { value: selfValue } : { defaultValue: initialValue };
    const textareaProps = {
      ...props,
      ...controlledValue,
    };

    return (
      <div className={classes}>
        <textarea
          ref={textareaRef}
          disabled={disabled}
          placeholder={placeholder}
          readOnly={readOnly}
          onFocus={focusHandler}
          onBlur={blurHandler}
          onChange={changeHandler}
          {...textareaProps}
        />
        <style jsx>{`
          .wrapper {
            display: inline-flex;
            box-sizing: border-box;
            user-select: none;
            border-radius: ${SCALES.r(1, theme.style.radius)};
            border: 1px solid ${borderColor};
            color: ${color};
            transition:
              box-shadow 200ms ease 0s;
              border 0.2s ease 0s,
              color 0.2s ease 0s;
            min-width: 12.5rem;
            max-width: 95vw;
            --textarea-font-size: ${SCALES.font(0.875)};
            --textarea-height: ${SCALES.h(1, 'auto')};
            width: ${SCALES.w(1, 'initial')};
            height: var(--textarea-height);
            margin: ${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)} ${SCALES.ml(0)};
          }
          .wrapper.hover {
            border-color: ${hoverBorder};
            box-shadow: 0 0 0 4px ${addColorAlpha(hoverBorder, 0.2)};
          }
          .wrapper.disabled {
            background-color: var(--theme-color-background-800);
            border-color: var(--theme-color-border-1000);
            cursor: not-allowed;
          }
          textarea {
            background-color: transparent;
            box-shadow: none;
            display: block;
            font-family: ${theme.font.sans};
            font-size: var(--textarea-font-size);
            width: 100%;
            height: var(--textarea-height);
            border: none;
            outline: none;
            padding: ${SCALES.pt(0.5)} ${SCALES.pr(0.5)} ${SCALES.pb(0.5)} ${SCALES.pl(0.5)};
            resize: ${resize};
          }
          .disabled > textarea {
            cursor: not-allowed;
          }
          textarea:-webkit-autofill,
          textarea:-webkit-autofill:hover,
          textarea:-webkit-autofill:active,
          textarea:-webkit-autofill:focus {
            -webkit-box-shadow: 0 0 0 30px var(--theme-color-background-1000) inset !important;
          }
        `}</style>
      </div>
    );
  },
);

TextareaComponent.displayName = 'HimalayaTextarea';
const Textarea = withScale(TextareaComponent);
export default Textarea;
