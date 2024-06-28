import React from 'react';

interface ChipProps {
  value: string;
  onDelete: (tag: string) => void;
  allowDelete?: boolean;
}

const Tag = ({ value, onDelete, allowDelete }: ChipProps) => {
  return (
    <span className="badge badge-accent inline-flex items-center text-sm px-2 py-4 mr-1 my-1 hover:shadow-sm hover:shadow-accent">
      {value}
      {allowDelete && (
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
