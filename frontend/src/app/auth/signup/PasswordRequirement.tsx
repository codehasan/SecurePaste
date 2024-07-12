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
        'mt-1 mr-1 px-2 pb-1 rounded-md'
      )}
    >
      <span
        className={classNames(
          {
            'text-success': condition,
          },
          'mr-1 text-xl'
        )}
      >
        ●
      </span>
      {text}
    </div>
  );
};

export const PasswordRequirement = React.memo(component);
