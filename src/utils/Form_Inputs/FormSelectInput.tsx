"use client";

import { cn } from "@/lib/utils";
import { Controller, useFormContext } from "react-hook-form";
import Select from "react-tailwindcss-select";
import { Options } from "react-tailwindcss-select/dist/components/type";
import AddNewButton from "./AddNewButton";

type FormSelectInputProps = {
  name: string;
  options: Options;
  label: string;
  href?: string;
  labelShown?: boolean;
  toolTipText?: string;
  isMultiple?: boolean;
  labelClassName?: string;
};

export default function FormSelectInput({
  name,
  options,
  label,
  href,
  toolTipText,
  labelShown = true,
  isMultiple = false,
  labelClassName = "text-black",
}: FormSelectInputProps) {
  const { control } = useFormContext();

  return (
    <div className="">
      {labelShown && (
        <h2
          className={cn(
            "pb-2 block text-sm font-medium leading-6",
            labelClassName,
          )}
        >
          {label}
        </h2>
      )}
      <div className="">
        <Controller
          name={name}
          control={control}
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <>
              <Select
                isSearchable
                primaryColor="indigo"
                value={isMultiple ? value || null : value || null}
                onChange={(selected) => {
                  if (isMultiple) {
                    onChange(selected ? selected : null);
                  } else {
                    onChange(selected ? selected : null);
                  }
                }}
                options={options}
                placeholder={`${label}`}
                isMultiple={isMultiple}
              />
              {href && toolTipText && (
                <AddNewButton toolTipText={toolTipText} href={href} />
              )}
              {error && (
                <p className="mt-1 text-sm text-red-600">{error.message}</p>
              )}
            </>
          )}
        />
      </div>
    </div>
  );
}
