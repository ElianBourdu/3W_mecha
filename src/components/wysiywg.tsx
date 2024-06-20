import React, { useState, useRef, useMemo } from 'react';
import JoditEditor from 'jodit-react';

export default function Wysiywg({ placeholder, onChange }: { placeholder: string, onChange: (value: string) => void }) {
  const editor = useRef(null);
  const [content, setContent] = useState('');

  // all options from https://xdsoft.net/jodit/docs/
  const config = {
    readonly: false,
    placeholder: placeholder,
    disablePlugins: "about,add-new-line,ai-assistant,backspace,class-span,clean-html,clipboard,copyformat,drag-and-drop-element,drag-and-drop,file,dtd,iframe,image,image-processor,image-properties,video,resizer,search,print,source,speech-recognize,spellcheck,stat,fullsize,symbols",
  }

  return (
    <JoditEditor
      ref={editor}
      value={content}
      config={config}
      onBlur={onChange} // preferred to use only this option to update the content for performance reasons
    />
  );
};