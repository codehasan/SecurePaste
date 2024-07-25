'use client';
import React, { TextareaHTMLAttributes } from 'react';

import styles from './CodeEditor.module.css';
import classNames from 'classnames';

interface CodeEditorProps {
  className?: string;
}

const TAB = '    ';

const CodeEditor: React.FC<
  CodeEditorProps & TextareaHTMLAttributes<HTMLTextAreaElement>
> = ({ className, ...props }) => {
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Tab') {
      event.preventDefault();

      const textarea = event.currentTarget as HTMLTextAreaElement;
      const start = textarea.selectionStart ?? 0;
      const end = textarea.selectionEnd ?? 0;

      const currentValue = textarea.value;
      const newValue =
        currentValue.substring(0, start) + TAB + currentValue.substring(end);

      textarea.value = newValue;
      textarea.selectionStart = textarea.selectionEnd = start + TAB.length;
    }
  };

  return (
    <textarea
      className={classNames(
        'textarea px-2 leading-tight',
        styles.codeEditor,
        className
      )}
      autoCorrect="off"
      autoComplete="off"
      spellCheck="false"
      onKeyDown={handleKeyDown}
      {...props}
    />
  );
};

export default CodeEditor;
