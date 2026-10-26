export const MONEY_TIPS = [
  "Save first, spend later: put some coins in a goal before you buy treats.",
  "A need is something you must have. A want is nice to have. Cover needs first!",
  "Big goals feel smaller when you save a little every month.",
  "Wait a day before buying something. If you still want it tomorrow, it may be worth it.",
  "The same thing can cost less in a different shop. Compare prices!",
  "Doing tasks is a great way to reach your goals faster.",
  "Small amounts add up. Every coin counts!",
  "Writing down what you want and what it costs is called a budget.",
  "If you spend all your coins today, there are none left for tomorrow.",
  "Sharing and giving can feel as good as buying something new.",
] as const

/** One tip per visit. */
export function pickTip(random = Math.random) {
  return MONEY_TIPS[Math.floor(random() * MONEY_TIPS.length) % MONEY_TIPS.length]
}
