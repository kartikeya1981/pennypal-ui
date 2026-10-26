import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Option } from "@/lib/constants"
import { cn } from "@/lib/utils"

type FieldProps = {
  label: string
  name: string
  type?: string
  defaultValue?: string | number | null
  required?: boolean
  step?: string
  min?: string | number
  max?: string | number
  placeholder?: string
  options?: Option[]
  hint?: string
  full?: boolean
}

export const selectClass =
  "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm dark:bg-input/30"

export function Field({ label, name, type = "text", defaultValue, required, step, min, max, placeholder, options, hint, full }: FieldProps) {
  const id = `f-${name}`
  const hintId = hint ? `${id}-hint` : undefined
  return (
    <div className={cn("grid gap-1.5", full && "sm:col-span-2")}>
      <Label htmlFor={id}>
        {label}
        {required && <span className="text-destructive">*</span>}
      </Label>
      {options ? (
        <select id={id} name={name} required={required} defaultValue={defaultValue ?? ""} aria-describedby={hintId} className={selectClass}>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      ) : (
        <Input
          id={id}
          name={name}
          type={type}
          required={required}
          inputMode={type === "number" ? "numeric" : undefined}
          step={step ?? (type === "number" ? "1" : undefined)}
          min={min ?? (type === "number" ? "0" : undefined)}
          max={max}
          placeholder={placeholder}
          defaultValue={defaultValue ?? ""}
          aria-describedby={hintId}
        />
      )}
      {hint && (
        <p id={hintId} className="text-xs text-muted-foreground">
          {hint}
        </p>
      )}
    </div>
  )
}
