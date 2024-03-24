import { PropsWithChildren } from 'react';
import useClasses from '../use-classes';
import useScale, { withScale } from '../use-scale';
import useTheme from '../use-theme';
import { MenuItemPropsNative } from './index';

function MenuItemComponent({ children, icon, ...other }: PropsWithChildren<MenuItemPropsNative>) {
  const theme = useTheme();
  const { SCALES } = useScale();
  return (
    <div {...other} className={useClasses({ 'context-menu-item': true, 'has-icon': icon !== undefined })}>
      {icon && <span className="context-menu-icon">{icon}</span>}
      {children}
      <style jsx>{`
        .context-menu-icon {
        }
        .context-menu-item {
          display: flex;
          gap: 8px;
          justify-content: flex-start;
          align-items: center;
          font-size: ${SCALES.font(0.9)};
          padding: ${SCALES.pt(0.5)} ${SCALES.pr(0.5)} ${SCALES.pb(0.5)} ${SCALES.pl(0.5)};
          border-radius: ${SCALES.r(1, `var(--layout-radius)`)};

          &:hover {
            background: var(--color-background-900);
          }
        }
      `}</style>
    </div>
  );
}

MenuItemComponent.displayName = 'HimalayaMenuItem';
const MenuItem = withScale(MenuItemComponent);

export default MenuItem;
