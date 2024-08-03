import classNames from 'classnames';
import { FormEvent, useState } from 'react';
import CodeEditor from '../CodeEditor/CodeEditor';

interface CommentFormProps {
  onSubmit: (message: string) => Promise<void>;
  onCancel?: () => void;
  className?: string;
  autoFocus?: boolean;
  loading?: boolean;
  error?: string;
  defaultValue?: string;
  submitText?: string;
}

const CommentForm = ({
  className,
  onCancel,
  onSubmit,
  autoFocus,
  loading,
  error,
  defaultValue,
  submitText,
}: CommentFormProps) => {
  const [message, setMessage] = useState(defaultValue || '');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(message).then(() => setMessage(''));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={classNames(
        className,
        'flex flex-col justify-center items-end gap-1'
      )}
    >
      <CodeEditor
        className="bg-white grow min-h-24 w-full textarea"
        name="message"
        inputMode="text"
        minLength={4}
        maxLength={1024}
        autoFocus={autoFocus}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        required
      />
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <div className="flex items-center gap-1">
        {onCancel && (
          <div
            className="btn btn-custom btn-error sm:w-24 cursor-pointer"
            onClick={onCancel}
          >
            Cancel
          </div>
        )}
        <button
          type="submit"
          className={classNames('btn btn-custom btn-primary sm:w-24', {
            'btn-disabled': loading,
          })}
        >
          {loading ? (
            <span className="loading loading-spinner loading-md"></span>
          ) : (
            <span>{submitText || 'Post'}</span>
          )}
        </button>
      </div>
    </form>
  );
};

export default CommentForm;
