'use client';
import codeStyles from '@/app/(client)/client.module.css';
import { usePaste } from '@/hooks/usePaste';
import classNames from 'classnames';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { Prism } from 'react-syntax-highlighter';
import { coy } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useReactToPrint } from 'react-to-print';

const PrintPaste = () => {
  const router = useRouter();
  const { paste } = usePaste();
  const codeViewRef = useRef<HTMLDivElement>(null);

  if (!paste) {
    router.back();
  }

  const handlePrint = useReactToPrint({
    content: () => codeViewRef.current,
    documentTitle: `${paste?.title}.pdf`,
  });

  useEffect(() => {
    if (paste && codeViewRef.current) {
      handlePrint();
    }
  });

  return paste ? (
    <div
      className={classNames(
        'absolute left-0 top-0 z-10 h-full w-full bg-white px-4 pt-2',
        codeStyles.codeMockup
      )}
      ref={codeViewRef}
    >
      <Prism
        language={paste.syntax}
        style={coy}
        customStyle={{ background: 'transparent' }}
        wrapLines
        useInlineStyles
        showLineNumbers
      >
        {paste.body}
      </Prism>
    </div>
  ) : (
    <div className="flex h-full flex-col items-center gap-1 py-10">
      <div className="text-2xl font-bold">Not Found</div>
      <span className="text-gray-700">
        This paste is no longer available. It has either been removed by its
        creator, or removed by one of the SecurePaste staff.
      </span>
    </div>
  );
};

export default PrintPaste;
