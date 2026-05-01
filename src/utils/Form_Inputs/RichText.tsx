/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import dynamic from 'next/dynamic';
import { joditConfig as baseConfig } from '@/config';
import { Jodit } from 'jodit-react';

const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });

interface ZRFEditorProps {
  name: string;
  label?: string;
  placeholder?: string;
  control?: any; // Add this line
}

const ZRFEditor: React.FC<ZRFEditorProps> = ({ name, label, placeholder, control }) => {
  const formContext = useFormContext();
  const editor = useRef<Jodit | null>(null);

  // Use the provided control or the one from useFormContext
  const formControl = control || formContext?.control;

  if (!formControl) {
    console.error('Form control is not available. Make sure you are using FormProvider or passing control prop.');
    return null;
  }

  const joditConfig = {
    ...baseConfig,
    placeholder: placeholder || 'Start typing here...',
    uploader: {
      ...baseConfig.uploader,
      defaultHandlerSuccess: function (data: any, resp: any) {
        const files = data.files || [];
        if (files.length) {
          const editorInstance = editor.current;
          if (editorInstance) {
            editorInstance.selection.insertImage(files[0], null, 200);
          }
        }
      },
    },
  };

  return (
    <Controller
      name={name}
      control={formControl}
      render={({ field: { onChange, onBlur, value } }) => (
        <div>
          {label && <label className="block text-sm font-medium text-gray-900 mb-2">{label}</label>}
          <JoditEditor
            ref={editor}
            value={value}
            config={joditConfig}
            onBlur={(newContent: string) => onBlur()}
            onChange={(newContent: string) => onChange(newContent)}
          />
        </div>
      )}
    />
  );
};

export default ZRFEditor;
