import { useEffect, useState } from 'react';

const useTheme = () => {
  const [theme, setTheme] = useState('');

  useEffect(() => {
    const htmlElement = document.documentElement;
    const currentTheme = htmlElement.getAttribute('data-theme');
    setTheme(currentTheme || '');

    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'data-theme'
        ) {
          setTheme(htmlElement.getAttribute('data-theme') || '');
        }
      }
    });

    observer.observe(htmlElement, { attributes: true });

    return () => {
      observer.disconnect();
    };
  }, []);

  return theme;
};

export default useTheme;
