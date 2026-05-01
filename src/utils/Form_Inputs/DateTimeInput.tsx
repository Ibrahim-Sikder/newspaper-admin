/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Control,
  FieldValues,
  Path,
  RegisterOptions,
  useController,
} from "react-hook-form";

type DateTimeInputProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  placeholder?: string;
  label?: string;
  type?: string;
  rules?: RegisterOptions<T, Path<T>>;
};

const DateTimeInput = <T extends FieldValues>({
  control,
  name,
  placeholder,
  label,
  rules,
  type = "datetime-local",
}: DateTimeInputProps<T>) => {
  const {
    fieldState: { error },
  } = useController<T>({
    control,
    name,
    rules,
  });

  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, "0");
  const formattedNow = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
    now.getDate(),
  )}T${pad(now.getHours())}:${pad(now.getMinutes())}`;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && (
            <label className="block text-sm font-medium mb-1">{label}</label>
          )}
          <FormControl className="bg-white">
            <Input
              key={field.value}
              type={type}
              placeholder={placeholder}
              {...field}
              value={field.value ?? ""}
              max={formattedNow}
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

export default DateTimeInput;
