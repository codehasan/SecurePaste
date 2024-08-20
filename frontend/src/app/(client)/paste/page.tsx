'use server';
import CodeEditor from '@/components/CodeEditor/CodeEditor';
import { langs } from '@/components/CodeView/languages';
import { MemoizedLabel } from '@/components/Label';
import TagInput from '@/components/TagInput/TagInput';
import { createNewPaste } from '@/utils/supabase/actions/pastes';
import classNames from 'classnames';
import styles from '../client.module.css';

const NewPaste = async () => {
  return (
    <div className="size-full">
      <div className={classNames(styles.container)}>
        <div className="my-8 text-2xl font-semibold">New paste</div>

        <form className="w-full" action={createNewPaste}>
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
              minLength={4}
              maxLength={100}
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
              className="min-h-80 w-full bg-white"
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
              className="select w-full cursor-pointer select-text bg-white"
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
              className="select w-full cursor-pointer select-text bg-white"
              name="visibility"
              required
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
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

          <div className="flex w-full justify-end">
            <button className="btn btn-primary btn-wide m-6 shadow-md">
              Create new paste
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewPaste;
