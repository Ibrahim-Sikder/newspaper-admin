/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    FormControl,
    FormField,
    FormItem,
    FormMessage,
  } from "@/components/ui/form";
  import { Control, FieldValues, Path, useController } from "react-hook-form";
  
  type TextAreaProps<T extends FieldValues> = {
    control: Control<T>;
    name: Path<T>;
    label?: string;
    placeholder?: string;
    defaultValue?: T[Path<T>];
    disabled?: boolean;
    rows?: number;

    rules?: Record<string, any>;
  };
  
  const TextArea = <T extends FieldValues>({
    control,
    name,
    label,
    placeholder,
    defaultValue,
    disabled = false,
    rows = 4,
    rules,
  }: TextAreaProps<T>) => {
    const {
      fieldState: { error },
    } = useController<T>({
      control,
      name,
      rules,
      defaultValue,
    });
  
    return (
      <div>
        {label && (
          <label
            htmlFor={name}
            className="block text-sm font-medium mb-1 text-gray-700"
          >
            {label}
          </label>
        )}
        <FormField
          control={control}
          name={name}
          render={({ field }) => (
            <FormItem>
              <FormControl className="bg-white">
                <textarea
                  id={name}
                  placeholder={placeholder}
                  disabled={disabled}
                  rows={rows}
                  className="w-full px-3 text-black py-2 border text-sm focus:outline-none focus:ring-1 focus:ring-black"
                  {...field}
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
      </div>
    );
  };
  
  export default TextArea;
  