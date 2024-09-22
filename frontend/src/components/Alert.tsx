import classNames from 'classnames';
import React from 'react';
import { IoCheckmarkCircleOutline } from 'react-icons/io5';
import {
  MdInfoOutline,
  MdOutlineErrorOutline,
  MdOutlineWarningAmber,
} from 'react-icons/md';

export enum Type {
  INFO,
  ERROR,
  WARNING,
  SUCCESS,
}

interface AlertProps {
  title?: string;
  message: string;
  className?: string;
  type: Type;
  closeText?: string;
  onClose?: () => void;
  acceptText?: string;
  onAccept?: () => void;
}

export const getIconFromType = (type: Type) => {
  const classes = 'h-6 w-6 shrink-0 hidden sm:block';

  if (type === Type.ERROR) {
    return (
      <MdOutlineErrorOutline
        className={classNames(classes, 'fill-error-content')}
      />
    );
  }
  if (type === Type.INFO) {
    return (
      <MdInfoOutline className={classNames(classes, 'fill-info-content')} />
    );
  }
  if (type === Type.WARNING) {
    return (
      <MdOutlineWarningAmber
        className={classNames(classes, 'fill-warning-content')}
      />
    );
  }
  return (
    <IoCheckmarkCircleOutline
      className={classNames(classes, 'fill-positive-content')}
    />
  );
};

export const getAlertClassNameFromType = (type: Type) => {
  const classes = 'alert';

  if (type === Type.ERROR) {
    return classNames(classes, 'alert-error');
  }
  if (type === Type.INFO) {
    return classNames(classes, 'alert-info');
  }
  if (type === Type.WARNING) {
    return classNames(classes, 'alert-warning');
  }
  return classNames(classes, 'alert-success');
};

const Alert: React.FC<AlertProps> = ({ ...props }) => {
  return (
    <div
      role="alert"
      className={classNames(
        getAlertClassNameFromType(props.type),
        props.className,
        'gap !gap-x-2 !gap-y-1 !rounded-lg !p-2'
      )}
    >
      {getIconFromType(props.type)}
      <div>
        {props.title && <h3 className="font-bold">{props.title}</h3>}
        <div className={classNames({ 'text-xs': props.title })}>
          {props.message}
        </div>
      </div>
      <div>
        {props.closeText && (
          <button className="btn btn-custom" onClick={props.onClose}>
            {props.closeText}
          </button>
        )}
        {props.acceptText && (
          <button
            className="btn btn-custom btn-primary"
            onClick={props.onAccept}
          >
            {props.acceptText}
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;
