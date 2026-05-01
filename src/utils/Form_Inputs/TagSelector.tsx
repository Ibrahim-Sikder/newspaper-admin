/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusIcon, Tag, X } from "lucide-react";
import { cn } from "@/lib/utils";

type TagSelectorProps = {
  name: string;
  label: string;
  href?: string;
  labelShown?: boolean;
  toolTipText?: string;
  isMultiple?: boolean;
  defaultValues?: string[];
};

export default function TagSelector({
  name,
  label,
  href,
  toolTipText,
  labelShown = true,
  isMultiple = true,
}: TagSelectorProps) {
  const { control, watch, setValue } = useFormContext();
  const tags = watch(name) || []; // This will get the current values from the form
  const [inputValue, setInputValue] = useState<string>("");

  const handleAddTag = () => {
    if (inputValue && !tags.includes(inputValue)) {
      const newTags = isMultiple ? [...tags, inputValue] : [inputValue];
      setValue(name, newTags);
      setInputValue("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const updatedTags = tags.filter((tag:any) => tag !== tagToRemove);
    setValue(name, updatedTags);
  };

  return (
    <div className="space-y-2">
      {labelShown && (
        <h2 className="text-sm font-medium leading-6 text-gray-900">
          Select {label}
        </h2>
      )}
      <div className="flex flex-wrap gap-2">
        {tags.map((tag:any) => (
          <div
            key={tag}
            className="bg-gray-100 px-3 py-1 rounded flex items-center text-sm"
          >
            <span>{tag}</span>
            <button
              type="button"
              className="ml-2 text-gray-400 hover:text-red-500 transition-colors"
              onClick={() => handleRemoveTag(tag)}
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange }, fieldState: { error } }) => (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="relative flex-grow ">
                <div className=" absolute p-2 ">
                  <Tag className="text-gray-400  " />
                </div>
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder={`Add a ${label}`}
                  className={cn(
                    "pl-10 py-2 w-full text-sm",
                    error && "focus-visible:ring-red-500"
                  )}
                />
              </div>
              <Button
                type="button"
                onClick={handleAddTag}
                className="whitespace-nowrap px-2 lg:px-4"
              >
                <PlusIcon className="w-4 h-4" /> Add Tag
              </Button>
            </div>
            {error && <p className="text-sm text-red-600">{error.message}</p>}
          </div>
        )}
      />
    </div>
  );
}
