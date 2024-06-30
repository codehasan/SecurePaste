'use client';
import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import classNames from 'classnames';

interface ButtonProps {
  className?: string;
  children: ReactNode;
}

const Button: React.FC<
  ButtonProps & ButtonHTMLAttributes<HTMLButtonElement>
> = ({ className, children, ...props }) => {
  return (
    <button className={classNames('btn', className)} {...props}>
      {children}
    </button>
  );
};

export default Button;
