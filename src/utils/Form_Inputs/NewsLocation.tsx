/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import RadioInput from "@/utils/Form_Inputs/RadioInput";
import SelectInput from "@/utils/Form_Inputs/SelectInput";
import {
  type FieldValues,
  type Path,
  useWatch,
  type UseFormReturn,
} from "react-hook-form";
import React from "react";

interface NewsTypeProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  className?: string;
  setFirstPage?: (value: string) => void; // Make it optional
  rules?: Record<string, any>;
  initialFirstPage?: boolean;
}

const NewsLocation = <T extends FieldValues>({
  form,
  name,
  className,
  setFirstPage, // Now optional
  rules,
  initialFirstPage = false,
}: NewsTypeProps<T>) => {
  const selectedNewsType = useWatch({
    control: form.control,
    name,
  });

  const firstPageValue = useWatch({
    control: form.control,
    name: "firstPage" as Path<T>,
  });

  const firstPageBool =
    typeof firstPageValue === "boolean"
      ? firstPageValue
      : firstPageValue === "yes";

  const handleFirstPageChange = (value: boolean) => {
    if (!setFirstPage) return; // Early return if setFirstPage not provided

    const newValue = value ? "yes" : "no";
    setFirstPage(newValue);
    form.setValue("firstPage" as Path<T>, newValue as any, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  // null check for initialFirstPage
  React.useEffect(() => {
    if (typeof initialFirstPage !== "undefined" && setFirstPage) {
      handleFirstPageChange(initialFirstPage);
    }
  }, [initialFirstPage]);

  return (
    <div className={className}>
      <SelectInput
        control={form.control}
        name={name}
        placeholder="কোথায় প্রদর্শন করতে চাচ্ছেন ?"
        rules={rules}
        options={[
          { label: "Lead-1", value: "Lead-1" },
          { label: "Lead 2", value: "Lead-2" },
          { label: "Lead 3", value: "Lead-3" },
          { label: "Heading (সম্ভার)", value: "Heading" },
          { label: "Not Now", value: "Not-Now" },
        ]}
      />

      {selectedNewsType === "Lead-1" && setFirstPage ? (
        <div className="mt-2">
          <RadioInput
            title="প্রথম পৃষ্ঠায় দেখবেন ?"
            name="firstPage"
            value={firstPageBool}
            onChange={handleFirstPageChange}
          />
        </div>
      ) : null}
    </div>
  );
};

export default NewsLocation;
