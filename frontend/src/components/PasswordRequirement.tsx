import React from 'react';
import classNames from 'classnames';

interface PasswordRequirementProps {
  condition: boolean;
  text: string;
}

const component: React.FC<PasswordRequirementProps> = ({ condition, text }) => {
  return (
    <div
      className={classNames(
        {
          'bg-success bg-opacity-10 text-gray-600': condition,
        },
        'mr-1 mt-1 rounded-md px-2 pb-1'
      )}
    >
      <span
        className={classNames(
          {
            'text-success': condition,
          },
          'mr-1 text-sm'
        )}
      >
        ●
      </span>
      {text}
    </div>
  );
};

export const PasswordRequirement = React.memo(component);
