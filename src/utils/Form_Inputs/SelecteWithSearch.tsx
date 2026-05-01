import React from "react";
import Select from "react-tailwindcss-select";
import { Options, Option } from "react-tailwindcss-select/dist/components/type";
import { Controller, useFormContext } from "react-hook-form";

type SelecteWithSearchProps = {
  name: string;
  options: Options;
  label: string;
  labelShown?: boolean;
  onChange?: (value: string) => void;
  value?: string;
};

export default function SelecteWithSearch({
  name,
  options,
  label,
  labelShown = false,
  onChange,
  value: externalValue,
}: SelecteWithSearchProps) {
  const { control } = useFormContext();

  const flattenOptions = (options: Options): Option[] => {
    return options.reduce((acc: Option[], option) => {
      if ("options" in option) {
        return [...acc, ...option.options];
      }
      return [...acc, option];
    }, []);
  };

  const flatOptions = flattenOptions(options);

  return (
    <div className="space-y-2">
      {labelShown && (
        <label className="block text-sm font-medium text-gray-900">
          {label}
        </label>
      )}
      <div>
        <Controller
          name={name}
          control={control}
          render={({ field, fieldState: { error } }) => {
            const currentValue =
              externalValue !== undefined ? externalValue : field.value;

            const selectedOption =
              flatOptions.find((option) => option.value === currentValue) ||
              null;

            return (
              <>
                {/* ✅ key forces remount when value changes after form.reset() */}
                <Select
                  key={currentValue ?? "empty"}
                  isSearchable
                  primaryColor=""
                  value={selectedOption}
                  onChange={(selected: Option | Option[] | null) => {
                    let newValue: string | null = null;
                    if (selected === null) {
                      newValue = null;
                    } else if (Array.isArray(selected)) {
                      newValue = selected[0]?.value || null;
                    } else {
                      newValue = (selected as Option).value;
                    }

                    field.onChange(newValue);

                    if (onChange && newValue) {
                      onChange(newValue);
                    }
                  }}
                  options={flatOptions}
                  placeholder={label}
                  classNames={{
                    searchIcon:
                      "absolute top-1/2 transform -translate-y-1/2 text-gray-400 h-5 pl-2",
                  }}
                />
                {error && (
                  <p className="mt-1 text-sm text-red-600">{error.message}</p>
                )}
              </>
            );
          }}
        />
      </div>
    </div>
  );
}
