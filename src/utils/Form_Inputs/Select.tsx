import * as React from "react";
import { Controller, useFormContext } from "react-hook-form";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SelectDemoProps = {
  name: string;
  label?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
};

export function NEWSSelect({
  name,
  label = "Select an option",
  options,
  placeholder = "Select an option",
}: SelectDemoProps) {
  const { control } = useFormContext();

  return (
    <div className="space-y-2">
      {label && <p className="text-sm font-medium">{label}</p>}
      <Controller
        name={name}
        control={control}
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <>
            <Select value={value} onValueChange={onChange}>
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
            {error && <p className="text-sm text-red-600">{error.message}</p>}
          </>
        )}
      />
    </div>
  );
}
