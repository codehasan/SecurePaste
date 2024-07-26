import CodeEditor from '@/components/CodeEditor/CodeEditor';
import { MemoizedLabel } from '@/components/Label';
import TagInput from '@/components/TagInput/TagInput';
import { newComment } from '@/utils/supabase/actions/pastes';
import classNames from 'classnames';
import styles from '../client.module.css';
import { langs } from '@/components/CodeView/languages';

const NewPaste = () => {
  return (
    <div className="size-full">
      <div className={classNames(styles.container)}>
        <div className="text-2xl font-semibold my-8">New paste</div>

        <form className="w-full" action={newComment}>
          <MemoizedLabel
            primaryText="Paste Name"
            topRight="4 character minimum"
            largeText
            required
          >
            <input
              className="input w-full"
              type="text"
              name="title"
              inputMode="text"
              placeholder="Untitled"
              min={4}
              max={100}
              required
            />
          </MemoizedLabel>

          <MemoizedLabel
            primaryText="Paste Body"
            topRight="4 character minimum"
            className="mt-3"
            largeText
            required
          >
            <CodeEditor
              className="bg-white w-full min-h-80"
              name="body"
              inputMode="text"
              minLength={4}
              maxLength={524_288}
              required
            />
          </MemoizedLabel>

          <MemoizedLabel
            primaryText="Syntax Highlight"
            className="mt-3"
            largeText
          >
            <select
              className="select select-text cursor-pointer bg-white w-full"
              name="syntax"
              required
            >
              {langs.map((language) => (
                <option key={language.code} value={language.code}>
                  {language.name}
                </option>
              ))}
            </select>
          </MemoizedLabel>

          <MemoizedLabel
            primaryText="Visibility"
            bottomLeft="* Private pastes are stored in the blockchain and requires a gas fee to create, edit or delete."
            className="mt-3"
            largeText
          >
            <select
              className="select select-text cursor-pointer bg-white w-full"
              name="visibility"
              required
            >
              <option>Public</option>
              <option>Private</option>
            </select>
          </MemoizedLabel>

          <MemoizedLabel
            primaryText="Tags"
            topRight="10 tags maximum"
            className="mt-2"
            largeText
          >
            <TagInput />
          </MemoizedLabel>

          <div className="w-full flex justify-center">
            <button className="btn btn-primary btn-wide shadow-md m-6">
              Create new paste
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewPaste;
