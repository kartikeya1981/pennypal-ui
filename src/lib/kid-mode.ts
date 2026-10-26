/** Pages a device in Kid Mode may open. Everything else redirects to /kid. */
export function kidModePathAllowed(pathname: string) {
  return pathname === "/kid" || pathname === "/login" || pathname === "/register"
}

/** API writes allowed in Kid Mode: saying "I did it" and unlocking with the PIN. */
export function kidModeApiAllowed(method: string, path: string) {
  return method === "POST" && (/^\/tasks\/[^/]+\/submit$/.test(path) || path === "/me/kid-mode/unlock")
}
