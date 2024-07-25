import classNames from 'classnames';
import React from 'react';

interface ChipProps {
  value: string;
  onDelete?: (tag: string) => void;
  allowDelete?: boolean;
  className?: string;
}

const Tag = ({ value, onDelete, allowDelete, className }: ChipProps) => {
  return (
    <span
      style={{ borderWidth: '0.15rem' }}
      className={classNames(
        'badge badge-outline border-slate-500 text-slate-700 font-medium rounded-md px-2 py-4 cursor-auto',
        className
      )}
    >
      {value}
      {allowDelete && onDelete && (
        <span
          onClick={() => onDelete(value)}
          className="ml-2 text-xl cursor-pointer"
        >
          ×
        </span>
      )}
    </span>
  );
};

export default Tag;
