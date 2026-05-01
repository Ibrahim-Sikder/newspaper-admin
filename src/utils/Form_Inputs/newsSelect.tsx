/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect } from "react";
import {
  useForm,
  Controller,
  FormProvider,
  useFormContext,
} from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Custom SelectField Component
export const SelectField = ({
  name,
  label,
  placeholder = "Select an option",
  required,
  options,
  defaultValue = "",
}: {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  options: { label: string; value: string }[];
  defaultValue?: string;
}) => {
  const { control, formState } = useFormContext();
  const isError = formState.errors[name] !== undefined;

  return (
    <div>
      {label && (
        <label className="block mb-2 text-sm font-medium">{label}</label>
      )}
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue} // Pass defaultValue here directly
        rules={{
          required: required ? `${label || name} is required` : undefined,
        }}
        render={({ field }) => (
          <>
            <Select
              value={field.value || ""}
              onValueChange={(value) => {
                field.onChange(value);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{label}</SelectLabel>
                  {options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {isError && (
              <p className="text-red-500 text-sm">
                {formState.errors[name]?.message as string}
              </p>
            )}
          </>
        )}
      />
    </div>
  );
};
