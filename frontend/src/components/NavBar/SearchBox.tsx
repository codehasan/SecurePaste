'use client';

import { useRouter } from 'next/navigation';
import { ChangeEvent, KeyboardEvent, useState } from 'react';
import { IoSearch } from 'react-icons/io5';

const SearchBox = () => {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const search = (event: KeyboardEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    const query = target.value;

    if (event.key === 'Enter') {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      target.value = '';
    }
  };

  const handleQuery = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    if (value.length <= 100) {
      setQuery(value);
    }
  };

  return (
    <div className="relative w-full max-w-lg lg:max-w-80">
      <div className="pointer-events-none absolute bottom-0 left-0 top-0 flex items-center pl-3">
        <IoSearch className="size-5 fill-gray-500" />
      </div>
      <input
        id="search"
        name="search"
        type="search"
        className="focus:ring-primary w-full rounded-md bg-transparent py-1.5 pl-10 pr-3 text-gray-900 placeholder-gray-500 ring-1 ring-gray-400 focus:ring-2 sm:text-sm sm:leading-6"
        placeholder="Search"
        onKeyDown={search}
        onChange={handleQuery}
        value={query}
        minLength={4}
        maxLength={100}
      />
    </div>
  );
};

export default SearchBox;
