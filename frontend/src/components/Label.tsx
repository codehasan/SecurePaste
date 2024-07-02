import classNames from 'classnames';
import React, { LabelHTMLAttributes, ReactNode } from 'react';

interface LabelProps {
  primaryText: string;
  topRight?: string;
  bottomLeft?: string;
  bottomRight?: string;
  required?: boolean;
  requiredFancy?: boolean;
  className?: string;
  children?: ReactNode;
}

const Label: React.FC<LabelProps & LabelHTMLAttributes<HTMLLabelElement>> = ({
  primaryText,
  topRight,
  bottomLeft,
  bottomRight,
  required,
  requiredFancy,
  className,
  children,
  ...props
}) => {
  const getPrimaryText = (className?: string) => {
    return (
      <span className={classNames('label-text text-sm', className)}>
        <span className="mr-1">{primaryText}</span>
        {requiredFancy ? (
          <span className="badge badge-info ml-1">Required</span>
        ) : (
          required && <span className="text-red-900">*</span>
        )}
      </span>
    );
  };

  const topLabel = () => {
    // Situation 1: Top right button is present
    if (topRight) {
      return (
        <div className="label">
          {getPrimaryText()}
          <span className="label-text-alt">{topRight}</span>
        </div>
      );
    }

    return getPrimaryText('py-2 px-1');
  };

  const bottomLabel = () => {
    // Situation 1: Both buttons are present
    if (bottomLeft && bottomRight) {
      return (
        <div className="label">
          <span className="label-text-alt">{bottomLeft}</span>
          <span className="label-text-alt">{bottomRight}</span>
        </div>
      );
    }
    // Situation 2: Only bottom left button is present
    if (bottomLeft) {
      return (
        <span className="label-text-alt py-2 px-1 w-full">{bottomLeft}</span>
      );
    }
    // Situation 3: Only bottom right button is present
    if (bottomRight) {
      return (
        <span className="label-text-alt py-2 px-1 w-full text-end">
          {bottomRight}
        </span>
      );
    }
    // Situation 4: No buttons are present
    return <></>;
  };

  return (
    <label className={classNames('form-control w-full', className)} {...props}>
      {topLabel()}
      {children}
      {bottomLabel()}
    </label>
  );
};

const MemoizedLabel = React.memo(Label);

export { Label, MemoizedLabel };
