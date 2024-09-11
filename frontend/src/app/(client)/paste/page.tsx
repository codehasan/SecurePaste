'use client';

import CodeEditor from '@/components/CodeEditor/CodeEditor';
import { langs } from '@/components/CodeView/languages';
import { MemoizedLabel } from '@/components/Label';
import TagInput from '@/components/TagInput/TagInput';
import { createNewPaste } from '@/utils/supabase/actions/pastes';
import classNames from 'classnames';
import styles from '../client.module.css';
import { FormEvent, useState } from 'react';
import { getTags } from '@/lib/ArrayHelper';
import { createNewPrivatePaste } from '@/utils/contract/paste';
import { useWeb3React } from '@web3-react/core';

const NewPaste = async () => {
  const [isPublic, setIsPublic] = useState(true);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    const data = {
      title: formData.get('title') as string,
      syntax: formData.get('syntax') as string,
      body: formData.get('body') as string,
      visibility: formData.get('visibility') as string,
      tags: getTags((formData.get('tags') as string) || ''),
    };

    if (data.visibility === 'private') {
      await createNewPrivatePaste(
        data.title,
        data.body,
        data.syntax,
        useWeb3React()
      );
    } else {
      await createNewPaste(data.title, data.body, data.syntax, data.tags);
    }
  };

  return (
    <div className="size-full">
      <div className={classNames(styles.container)}>
        <div className="my-8 text-2xl font-semibold">New paste</div>

        <form className="w-full" onSubmit={handleSubmit}>
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
              className="font-code min-h-80 w-full bg-white"
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
              onChange={(e) => setIsPublic(e.target.value === 'public')}
              value={isPublic ? 'public' : 'private'}
              required
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </MemoizedLabel>

          {isPublic && (
            <MemoizedLabel
              primaryText="Tags"
              topRight="10 tags maximum"
              className="mt-2"
              largeText
            >
              <TagInput />
            </MemoizedLabel>
          )}
          <div className="flex w-full justify-start">
            <button className="btn btn-primary btn-wide my-6 shadow-md">
              Create new paste
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewPaste;
