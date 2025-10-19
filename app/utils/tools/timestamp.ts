/**
 * Converts timestamp to ISO string
 */
export function timestampToIso(timestamp: number): string {
  return new Date(timestamp).toISOString()
}

/**
 * Converts timestamp to UTC string
 */
export function timestampToUtc(timestamp: number): string {
  return new Date(timestamp).toUTCString()
}

/**
 * Converts human-readable date string to timestamp
 */
export function dateToTimestamp(dateString: string): number {
  const date = new Date(dateString)
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date format')
  }
  return date.getTime()
}

/**
 * Converts Unix timestamp (seconds) to milliseconds timestamp
 */
export function unixToTimestamp(unixTimestamp: number): number {
  return unixTimestamp * 1000
}

/**
 * Converts milliseconds timestamp to Unix timestamp (seconds)
 */
export function timestampToUnix(timestamp: number): number {
  return Math.floor(timestamp / 1000)
}

/**
 * Validates if a string is a valid timestamp
 */
export function isValidTimestamp(timestamp: string): boolean {
  const num = Number(timestamp)
  return !isNaN(num) && isFinite(num) && num > 0
}
