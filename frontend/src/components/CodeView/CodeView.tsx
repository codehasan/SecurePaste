'use client';
import React from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/mode/javascript/javascript';

const CodeView = () => {
  const [code, setCode] = React.useState('// Start typing...');

  return (
    <CodeMirror
      value={code}
      options={{
        mode: 'javascript',
        theme: 'material',
        lineNumbers: true,
      }}
      onBeforeChange={(editor, data, value) => {
        setCode(value);
      }}
      onChange={(editor, data, value) => {
        console.log('Controlled:', { value });
      }}
    />
  );
};

export default CodeView;
