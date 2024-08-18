'use server';
import CodeEditor from '@/components/CodeEditor/CodeEditor';
import { langs } from '@/components/CodeView/languages';
import { MemoizedLabel } from '@/components/Label';
import TagInput from '@/components/TagInput/TagInput';
import logger from '@/lib/logging/server';
import { createNewPaste } from '@/utils/supabase/actions/pastes';
import axios from 'axios';
import classNames from 'classnames';
import styles from '../client.module.css';
import { Mode, Visibility } from '@/lib/Types';

interface PasteProps {
  searchParams?: {
    m: Mode;
    id?: string;
    title: string;
    url: string;
    syntax: string;
    v?: Visibility;
    tags?: string[];
  };
}

const NewPaste = async ({ searchParams }: PasteProps) => {
  let body: string | null = null;

  if (searchParams?.url) {
    const response = await axios.get(searchParams.url, {
      timeout: 10_000,
      responseType: 'text',
    });

    if (!response.data) {
      logger.info(`Body url: ${searchParams.url}`);
      logger.error(`Error retrieving paste body: ${response.statusText}`);
    } else {
      body = response.data;
    }
  }

  return (
    <div className="size-full">
      <div className={classNames(styles.container)}>
        <div className="my-8 text-2xl font-semibold">
          {(searchParams?.m == Mode.clone && 'Clone paste') ||
            (searchParams?.m == Mode.edit && 'Edit paste') ||
            'New paste'}
        </div>

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
              defaultValue={searchParams?.title || ''}
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
              className="min-h-80 w-full bg-white"
              name="body"
              inputMode="text"
              minLength={4}
              maxLength={524_288}
              defaultValue={body || ''}
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
              defaultValue={searchParams?.syntax || langs[0].code}
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
              className={classNames(
                'select w-full cursor-pointer select-text bg-white',
                { 'select-disabled': searchParams?.m == Mode.edit }
              )}
              disabled={searchParams?.m == Mode.edit}
              name="visibility"
              defaultValue={
                (searchParams?.v == Visibility.private && 'private') || 'public'
              }
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

          <div className="flex w-full justify-center">
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
