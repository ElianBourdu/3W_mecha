import React, { useState, useRef, useMemo } from 'react';
import JoditEditor from 'jodit-react';

export default function Wysiywg({ placeholder, onChange }: { placeholder: string, onChange: (value: string) => void }) {
  const editor = useRef(null);
  const [content, setContent] = useState('');

  const config = {
    readonly: false, // all options from https://xdsoft.net/jodit/docs/,
    placeholder: placeholder || 'Start typings...',
  }

  return (
    <JoditEditor
      ref={editor}
      value={content}
      config={config}
      onBlur={newContent => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
      onChange={onChange}
    />
  );
};