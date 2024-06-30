'use client';
import React, { useRef, useState } from 'react';
import Tag from './Tag';

const RateLimits = {
  tagLimit: 10,
  tagCharacterLimit: 20,
};

const TagInput: React.FC = () => {
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
    const inputValue = input.value.trim();

    switch (event.key) {
      case 'Enter':
        input.value = '';

        if (
          inputValue.length === 0 ||
          inputValue.length > RateLimits.tagCharacterLimit ||
          tags.length >= RateLimits.tagLimit ||
          tags.includes(inputValue)
        ) {
          return;
        }
        setTags((prevTags) => [...prevTags, inputValue]);
        break;
      case 'Backspace':
        if (input.value.length === 0 && tags.length > 0) {
          removeTag(tags[tags.length - 1]);
        }
        break;
    }
  };

  return (
    <>
      <div
        className="input flex items-center flex-wrap text-base h-auto min-h-12 cursor-text"
        onClick={handleDivClick}
      >
        {tags.map((tag) => (
          <Tag key={tag} value={tag} onDelete={removeTag} allowDelete />
        ))}
        {tags.length < RateLimits.tagLimit && (
          <input
            ref={inputRef}
            type="text"
            onKeyDown={handleKeyDown}
            className="grow ml-1"
            maxLength={RateLimits.tagCharacterLimit}
          />
        )}
      </div>
      {tags.length >= RateLimits.tagLimit && (
        <div className="label">
          <span className="label-text-alt">* Tags limit reached</span>
        </div>
      )}
    </>
  );
};

export default TagInput;
