/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control, FieldValues, Path } from "react-hook-form";

type TextInputProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  placeholder?: string;
  label?: string;
  rules?: any;
  className?: string;
  disabled?: boolean;
  type?: string;
  [key: string]: any;
};

const TextInput = <T extends FieldValues>({
  control,
  name,
  label,
  type = "text",
  placeholder,
  disabled = false,
  rules,
  className,
  ...props
}: TextInputProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <FormItem className={className}>
          {label && (
            <label
              htmlFor={name}
              className="block text-sm font-medium mb-1 text-gray-700"
            >
              {label}
            </label>
          )}
          <FormControl>
            <Input
              id={name}
              type={type}
              placeholder={placeholder}
              disabled={disabled}
              {...field}
              value={field.value || ""}
              {...props}
            />
          </FormControl>
          {error && (
            <FormMessage className="text-red-500 mt-1">
              {error.message}
            </FormMessage>
          )}
        </FormItem>
      )}
    />
  );
};

export default TextInput;
