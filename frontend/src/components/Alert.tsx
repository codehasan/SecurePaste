'use client';
import classNames from 'classnames';
import React from 'react';
import { IoCheckmarkCircleOutline } from 'react-icons/io5';
import {
  MdInfoOutline,
  MdOutlineErrorOutline,
  MdOutlineWarningAmber,
} from 'react-icons/md';

export enum Icon {
  INFO,
  ERROR,
  WARNING,
  SUCCESS,
}

interface AlertProps {
  title?: string;
  message: string;
  className?: string;
  iconClassName?: string;
  icon: Icon;
  closeText?: string;
  onClose?: () => void;
  acceptText?: string;
  onAccept?: () => void;
}

const getSvgFromIcon = (icon: Icon, iconClasses?: string) => {
  const classes = classNames(iconClasses, 'h-6 w-6 shrink-0 fill-current');

  if (icon === Icon.ERROR) return <MdOutlineErrorOutline className={classes} />;

  if (icon === Icon.INFO) return <MdInfoOutline className={classes} />;

  if (icon === Icon.WARNING)
    return <MdOutlineWarningAmber className={classes} />;

  return <IoCheckmarkCircleOutline className={classes} />;
};

const Alert: React.FC<AlertProps> = ({ ...props }) => {
  return (
    <div role="alert" className={classNames('alert', props.className)}>
      {getSvgFromIcon(props.icon, props.iconClassName)}
      <div>
        {props.title && <h3 className="font-bold">{props.title}</h3>}
        <div className={classNames({ 'text-xs': props.title })}>
          {props.message}
        </div>
      </div>
      <div>
        {props.closeText && (
          <button className="btn btn-sm" onClick={props.onClose}>
            {props.closeText}
          </button>
        )}
        {props.acceptText && (
          <button className="btn btn-sm btn-primary" onClick={props.onAccept}>
            {props.acceptText}
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;
