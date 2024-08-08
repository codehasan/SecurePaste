import React, { ReactNode, SVGAttributes } from 'react';

interface IconProps {
  className?: string;
}

const HorizontalMenu: React.FC<IconProps & SVGAttributes<SVGElement>> = ({
  className,
  ...props
}) => {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      role="img"
      viewBox="0 0 16 16"
      width="16"
      height="16"
      fill="currentColor"
      style={{
        display: 'inline-block',
        userSelect: 'none',
        verticalAlign: 'text-bottom',
        overflow: 'visible',
      }}
      className={className}
      {...props}
    >
      <path d="M8 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM1.5 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm13 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"></path>
    </svg>
  );
};

export default HorizontalMenu;
