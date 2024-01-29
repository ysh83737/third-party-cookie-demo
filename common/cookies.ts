export const ALIVE_DAYS = 7

export function cookie(key: string, value: string, aliveDays = ALIVE_DAYS) {
  const maxAge = aliveDays * 24 * 60 * 60 * 1000
  return `${key}=${value}; Max-Age=${maxAge}; SameSite=Lax`
}