import classNames from 'classnames';
import { FormEvent, useState } from 'react';
import CodeEditor from '../CodeEditor/CodeEditor';

interface CommentFormProps {
  onSubmit: (message: string) => Promise<void>;
  onCancel?: () => void;
  className?: string;
  autoFocus?: boolean;
  loading?: boolean;
  error?: string | null;
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
        'flex flex-col items-end justify-center gap-1'
      )}
    >
      <CodeEditor
        className="textarea min-h-24 w-full grow bg-white"
        name="message"
        inputMode="text"
        minLength={1}
        maxLength={1024}
        autoFocus={autoFocus ? true : undefined}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        required
      />
      {error && <div className="text-sm text-red-600">{error}</div>}
      <div className="flex items-center gap-1">
        {onCancel && (
          <div
            className="btn btn-custom btn-error cursor-pointer sm:w-24"
            onClick={onCancel}
          >
            Cancel
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
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
