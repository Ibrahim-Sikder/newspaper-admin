// utils/Form_Inputs/JodiEditor.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useRef, useMemo } from "react";
import { Controller, useFormContext } from "react-hook-form";
import dynamic from "next/dynamic";
import type { Jodit } from "jodit-react";
import { joditConfig } from "@/config";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

interface DailyTimesEditorProps {
  name: string;
  label?: string;
}

const DailyTimesEditor: React.FC<DailyTimesEditorProps> = ({ name, label }) => {
  const { control } = useFormContext();
  const editorRef = useRef<Jodit | null>(null);

  // Memoized per-instance config — prevents Jodit from re-initializing on every render
  const config = useMemo(() => ({ ...joditConfig }), []);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, onBlur, value } }) => (
        <div>
          {label && (
            <label className="text-sm font-medium block mb-1">{label}</label>
          )}
          <JoditEditor
            key={name}
            ref={editorRef}
            value={value || ""}
            config={config}
            onBlur={(newContent) => {
              onBlur();
              onChange(newContent);
            }}
            onChange={() => {}}
          />
        </div>
      )}
    />
  );
};

export default DailyTimesEditor;
