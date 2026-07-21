"use client";

import { cn } from "@/lib/utils";

const fieldBase =
  "w-full rounded-2xl border border-beige bg-marfil px-5 py-3.5 text-chocolate placeholder:text-cafe/50 transition-all duration-300 focus:border-dorado focus:outline-none focus:ring-2 focus:ring-dorado/20";

export function FieldLabel({
  htmlFor,
  children,
  optional,
}: {
  htmlFor?: string;
  children: React.ReactNode;
  optional?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-2 flex items-center gap-2 text-sm font-medium text-chocolate"
    >
      {children}
      {optional && (
        <span className="text-xs font-normal text-cafe/60">(opcional)</span>
      )}
    </label>
  );
}

export function TextField({
  label,
  optional,
  className,
  id,
  ...props
}: {
  label: string;
  optional?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={className}>
      <FieldLabel htmlFor={id} optional={optional}>
        {label}
      </FieldLabel>
      <input id={id} className={fieldBase} {...props} />
    </div>
  );
}

export function TextAreaField({
  label,
  optional,
  className,
  id,
  ...props
}: {
  label: string;
  optional?: boolean;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div className={className}>
      <FieldLabel htmlFor={id} optional={optional}>
        {label}
      </FieldLabel>
      <textarea id={id} className={cn(fieldBase, "resize-y")} {...props} />
    </div>
  );
}

export function SelectField({
  label,
  optional,
  className,
  id,
  options,
  placeholder,
  ...props
}: {
  label: string;
  optional?: boolean;
  options: string[];
  placeholder?: string;
} & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className={className}>
      <FieldLabel htmlFor={id} optional={optional}>
        {label}
      </FieldLabel>
      <select
        id={id}
        className={cn(fieldBase, "appearance-none bg-[length:1rem] pr-10")}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%238D7566' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 1rem center",
        }}
        {...props}
      >
        <option value="">{placeholder || "Selecciona una opción"}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
