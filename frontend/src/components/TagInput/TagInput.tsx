'use client';
import React, {
  ChangeEvent,
  InputHTMLAttributes,
  useMemo,
  useRef,
  useState,
} from 'react';
import Tag from './Tag';
import classNames from 'classnames';

const RateLimits = {
  tagLimit: 10,
  tagCharacterLimit: 15,
};

const TagInput: React.FC<InputHTMLAttributes<HTMLInputElement>> = ({
  required,
  ...props
}) => {
  const [tags, setTags] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const removeTag = (tagToRemove: string) => {
    setTags((prevTags) => prevTags.filter((tag) => tag !== tagToRemove));
  };

  const handleDivClick = () => {
    inputRef.current?.focus();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/\s/g, '');

    switch (event.key) {
      case 'Enter':
        input.value = '';

        if (
          value.length === 0 ||
          value.length > RateLimits.tagCharacterLimit ||
          tags.length >= RateLimits.tagLimit ||
          tags.includes(value)
        ) {
          return;
        }
        return setTags((prevTags) => [...prevTags, value]);
      case 'Backspace':
        if (value.length === 0 && tags.length > 0) {
          removeTag(tags[tags.length - 1]);
        }
    }
  };

  const memoizedTags = useMemo(() => {
    return tags.map((tag, index) => (
      <Tag
        className={classNames('my-1', {
          'ml-1': index > 0,
        })}
        key={tag}
        value={tag}
        onDelete={removeTag}
        allowDelete
      />
    ));
  }, [tags]);

  return (
    <>
      <input
        type="text"
        name="tags"
        required={required}
        value={tags}
        readOnly
        hidden
      />
      <div
        className="input flex items-center flex-wrap text-base h-auto min-h-12 cursor-text"
        onClick={handleDivClick}
      >
        {memoizedTags}
        {tags.length < RateLimits.tagLimit && (
          <input
            className="grow ml-1"
            ref={inputRef}
            type="text"
            inputMode="text"
            onKeyDown={handleKeyDown}
            maxLength={RateLimits.tagCharacterLimit}
            {...props}
          />
        )}
      </div>
      {tags.length >= RateLimits.tagLimit && (
        <div className="label">
          <span className="text-sm text-red-800">* Tags limit reached</span>
        </div>
      )}
    </>
  );
};

export default TagInput;
