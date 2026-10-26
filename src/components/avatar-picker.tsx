import { AVATARS, DEFAULT_AVATAR } from "@/lib/constants"

/** Grid of emoji radio buttons. Each option is labelled "{legend} {emoji}" for screen readers. */
export function EmojiPicker({
  name,
  legend,
  options,
  defaultValue,
}: {
  name: string
  legend: string
  options: string[]
  defaultValue: string
}) {
  const all = options.includes(defaultValue) ? options : [defaultValue, ...options]
  return (
    <fieldset className="grid gap-1.5 sm:col-span-2">
      <legend className="mb-1.5 text-sm font-medium">{legend}</legend>
      <div className="grid grid-cols-8 gap-1.5">
        {all.map((emoji) => (
          <label
            key={emoji}
            className="relative flex aspect-square cursor-pointer items-center justify-center rounded-lg border text-xl transition-colors has-checked:border-primary has-checked:bg-primary/10 has-focus-visible:ring-3 has-focus-visible:ring-ring/50"
          >
            <input type="radio" name={name} value={emoji} defaultChecked={emoji === defaultValue} className="sr-only" aria-label={`${legend} ${emoji}`} />
            <span aria-hidden>{emoji}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

export function AvatarPicker({ defaultValue = DEFAULT_AVATAR }: { defaultValue?: string }) {
  return <EmojiPicker name="avatar" legend="Avatar" options={AVATARS} defaultValue={defaultValue} />
}
