import { postComment } from '@/utils/supabase/actions/pastes';
import classNames from 'classnames';
import CodeEditor from '../CodeEditor/CodeEditor';

interface CommentFormProps {
  showCancel?: boolean;
  onSubmit?: () => void;
  onCancel?: () => void;
  className?: string;
  parentId?: string;
  pasteId: string;
}

const CommentForm = ({
  className,
  showCancel,
  onCancel,
  onSubmit,
  parentId,
  pasteId,
}: CommentFormProps) => {
  return (
    <form
      onSubmit={onSubmit}
      className={classNames(
        className,
        'flex flex-col justify-center items-end gap-1'
      )}
    >
      <input type="text" name="parentId" value={parentId} hidden readOnly />
      <input type="text" name="pasteId" value={pasteId} hidden readOnly />
      <CodeEditor
        className="bg-white grow min-h-24 w-full textarea"
        name="message"
        inputMode="text"
        minLength={4}
        maxLength={1024}
        autoFocus
        required
      />
      <div className="flex items-center gap-1">
        {showCancel && onCancel && (
          <div
            className="btn btn-custom btn-error sm:w-24 cursor-pointer"
            onClick={onCancel}
          >
            Cancel
          </div>
        )}
        <button
          type="submit"
          className="btn btn-custom btn-primary sm:w-24"
          formAction={postComment}
        >
          Post
        </button>
      </div>
    </form>
  );
};

export default CommentForm;
