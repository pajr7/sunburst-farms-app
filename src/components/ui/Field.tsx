"use client";

import { useId } from "react";

const inputClass =
  "w-full px-3.5 rounded-lg text-[16px] outline-none transition-[border-color,box-shadow] focus:shadow-[0_0_0_3px_var(--primary-soft)]";

interface BaseProps {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  optional?: boolean;
}

export function Field({
  label,
  hint,
  error,
  required,
  optional,
  children,
  id,
}: BaseProps & { children: (id: string, describedBy?: string) => React.ReactNode; id?: string }) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  const hintId = hint ? `${fieldId}-hint` : undefined;
  const errorId = error ? `${fieldId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className="mb-4">
      <label htmlFor={fieldId} className="block text-[15px] font-semibold mb-1.5" style={{ color: "var(--text)" }}>
        {label}
        {required && <span style={{ color: "var(--danger)" }} aria-hidden> *</span>}
        {optional && (
          <span className="font-normal" style={{ color: "var(--text-3)" }}>
            {" "}(optional)
          </span>
        )}
      </label>
      {hint && (
        <p id={hintId} className="text-[14px] mb-1.5 leading-snug" style={{ color: "var(--text-2)" }}>
          {hint}
        </p>
      )}
      {children(fieldId, describedBy)}
      {error && (
        <p id={errorId} role="alert" className="text-[14px] mt-1.5 font-medium" style={{ color: "var(--danger)" }}>
          {error}
        </p>
      )}
    </div>
  );
}

export function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
  id,
  describedBy,
  invalid,
  inputMode,
  autoComplete,
  min,
  max,
  step,
  autoFocus,
  prefix,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  id?: string;
  describedBy?: string;
  invalid?: boolean;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  autoComplete?: string;
  min?: string;
  max?: string;
  step?: string;
  autoFocus?: boolean;
  prefix?: string;
}) {
  const input = (
    <input
      id={id}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      aria-describedby={describedBy}
      aria-invalid={invalid || undefined}
      inputMode={inputMode}
      autoComplete={autoComplete}
      min={min}
      max={max}
      step={step}
      autoFocus={autoFocus}
      className={`${inputClass} h-12 ${prefix ? "pl-8" : ""}`}
      style={{
        background: "var(--surface)",
        color: "var(--text)",
        border: `1px solid ${invalid ? "var(--danger)" : "var(--border-strong)"}`,
      }}
    />
  );
  if (!prefix) return input;
  return (
    <div className="relative">
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[16px] font-semibold" style={{ color: "var(--text-3)" }} aria-hidden>
        {prefix}
      </span>
      {input}
    </div>
  );
}

export function TextArea({
  value,
  onChange,
  placeholder,
  id,
  describedBy,
  rows = 4,
  invalid,
  maxLength,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  id?: string;
  describedBy?: string;
  rows?: number;
  invalid?: boolean;
  maxLength?: number;
}) {
  return (
    <textarea
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      maxLength={maxLength}
      aria-describedby={describedBy}
      aria-invalid={invalid || undefined}
      className={`${inputClass} py-3 resize-none leading-relaxed`}
      style={{
        background: "var(--surface)",
        color: "var(--text)",
        border: `1px solid ${invalid ? "var(--danger)" : "var(--border-strong)"}`,
      }}
    />
  );
}

/** Mutually exclusive choices rendered as wrapping chips with proper radio semantics. */
export function ChoiceChips<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: { value: T; label: string }[];
  value: T | null;
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.value)}
            className="px-3.5 h-11 rounded-lg text-[15px] font-semibold transition-colors"
            style={{
              background: active ? "var(--primary)" : "var(--surface)",
              color: active ? "var(--text-on-primary)" : "var(--text)",
              border: `1px solid ${active ? "var(--primary)" : "var(--border-strong)"}`,
            }}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
