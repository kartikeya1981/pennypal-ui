import { AVATARS, DEFAULT_AVATAR } from "@/lib/constants"

export function AvatarPicker({ defaultValue = DEFAULT_AVATAR }: { defaultValue?: string }) {
  const options = AVATARS.includes(defaultValue) ? AVATARS : [defaultValue, ...AVATARS]
  return (
    <fieldset className="grid gap-1.5 sm:col-span-2">
      <legend className="mb-1.5 text-sm font-medium">Avatar</legend>
      <div className="grid grid-cols-8 gap-1.5">
        {options.map((emoji) => (
          <label
            key={emoji}
            className="relative flex aspect-square cursor-pointer items-center justify-center rounded-lg border text-xl transition-colors has-checked:border-primary has-checked:bg-primary/10 has-focus-visible:ring-3 has-focus-visible:ring-ring/50"
          >
            <input type="radio" name="avatar" value={emoji} defaultChecked={emoji === defaultValue} className="sr-only" aria-label={`Avatar ${emoji}`} />
            <span aria-hidden>{emoji}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}
