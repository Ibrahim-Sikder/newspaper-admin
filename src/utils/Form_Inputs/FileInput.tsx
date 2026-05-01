/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import React from "react";
import { useController } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { type Control, type FieldValues, type Path } from "react-hook-form";
import { CircleX, Upload } from "lucide-react";
import Image from "next/image";

type FileWithPreview = {
  file: File;
  preview: string;
};

type FileInputProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
};

const FileInput = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder = "Drag & drop files or click to browse",
  disabled = false,
  accept,
  multiple = false,
  maxFiles,
}: FileInputProps<T>) => {
  const [dragActive, setDragActive] = React.useState(false);
  const [selectedFiles, setSelectedFiles] = React.useState<FileWithPreview[]>(
    []
  );
  const inputRef = React.useRef<HTMLInputElement>(null);

  const {
    field,
    fieldState: { error },
  } = useController<T>({
    name,
    control,
    rules: {
      validate: (files) => {
        if (!multiple && files?.length > 1) return "Only one file allowed";
        if (maxFiles && files?.length > maxFiles)
          return `Maximum ${maxFiles} files allowed`;
        return true;
      },
    },
  });

  const handleFileChange = (files: FileList | null) => {
    if (!files) return;

    const newFiles = Array.from(files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    const updatedFiles = multiple
      ? [...(field.value || []), ...newFiles]
      : newFiles;
    field.onChange(updatedFiles);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files) {
      handleFileChange(e.dataTransfer.files);
    }
  };

  React.useEffect(() => {
    return () => {
      selectedFiles.forEach((file) => URL.revokeObjectURL(file.preview));
    };
  }, [selectedFiles]);

  const handleRemove = (index: number) => {
    const updatedFiles = [...field.value];
    updatedFiles.splice(index, 1);
    field.onChange(updatedFiles);
  };

  return (
    <FormField
      control={control}
      name={name}
      render={() => (
        <FormItem>
          {label && (
            <label className="block text-sm  mb-2 font-bold">{label}</label>
          )}

          <div className="space-y-4">
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors
                ${
                  dragActive
                    ? "border-primary bg-primary/10"
                    : "border-muted-foreground/30"
                }
                ${
                  disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                }`}
              onClick={() => !disabled && inputRef.current?.click()}
            >
              <div className="flex flex-col items-center gap-2">
                <Upload className="w-6 h-6 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">{placeholder}</p>
                <p className="text-xs text-muted-foreground/70">
                  {accept ? `Accepted formats: ${accept}` : "Any file type"}
                </p>
               
              </div>
            </div>

            <FormControl>
              <Input
                name={name}
                type="file"
                ref={inputRef}
                accept={accept}
                multiple={multiple}
                disabled={disabled}
                className="hidden"
                onChange={(e) => handleFileChange(e.target.files)}
              />
            </FormControl>

            {field.value?.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {field.value.map((file: FileWithPreview, index: number) => (
                  <div
                    key={index}
                    className="relative group aspect-square rounded-md border overflow-hidden"
                  >
                    <Image
                      src={file.preview}
                      alt={file.file.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 80px, 100px"
                    />

                    <button
                      type="button"
                      className="absolute top-0 right-0  text-red-500 opacity-0 group-hover:opacity-100 transition"
                      onClick={() => handleRemove(index)}
                    >
                      <CircleX className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
};

export default FileInput;
