/**
 * Generates current timestamp in various formats
 */
export function getCurrentTimestamp(): number {
  return Date.now()
}

/**
 * Generates current timestamp in seconds (Unix timestamp)
 */
export function getCurrentTimestampSeconds(): number {
  return Math.floor(Date.now() / 1000)
}

/**
 * Converts timestamp to human-readable date string
 */
export function timestampToDate(timestamp: number, locale: string = 'en-US'): string {
  const date = new Date(timestamp)
  return date.toLocaleString(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })
}

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

/**
 * Gets timestamp information including all formats
 */
export function getTimestampInfo(timestamp: number, locale: string = 'en-US') {
  return {
    milliseconds: timestamp,
    unix: timestampToUnix(timestamp),
    iso: timestampToIso(timestamp),
    utc: timestampToUtc(timestamp),
    local: timestampToDate(timestamp, locale),
    relative: getRelativeTime(timestamp)
  }
}

/**
 * Gets relative time (e.g., "2 hours ago", "in 3 days")
 */
export function getRelativeTime(timestamp: number): string {
  const now = Date.now()
  const diff = timestamp - now
  const absDiff = Math.abs(diff)

  const seconds = Math.floor(absDiff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const weeks = Math.floor(days / 7)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)

  if (years > 0) {
    return diff > 0 ? `in ${years} year${years > 1 ? 's' : ''}` : `${years} year${years > 1 ? 's' : ''} ago`
  } else if (months > 0) {
    return diff > 0 ? `in ${months} month${months > 1 ? 's' : ''}` : `${months} month${months > 1 ? 's' : ''} ago`
  } else if (weeks > 0) {
    return diff > 0 ? `in ${weeks} week${weeks > 1 ? 's' : ''}` : `${weeks} week${weeks > 1 ? 's' : ''} ago`
  } else if (days > 0) {
    return diff > 0 ? `in ${days} day${days > 1 ? 's' : ''}` : `${days} day${days > 1 ? 's' : ''} ago`
  } else if (hours > 0) {
    return diff > 0 ? `in ${hours} hour${hours > 1 ? 's' : ''}` : `${hours} hour${hours > 1 ? 's' : ''} ago`
  } else if (minutes > 0) {
    return diff > 0 ? `in ${minutes} minute${minutes > 1 ? 's' : ''}` : `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  } else {
    return diff > 0 ? 'in a few seconds' : 'a few seconds ago'
  }
}

/**
 * Formats timestamp for display with timezone information
 */
export function formatTimestampWithTimezone(timestamp: number, locale: string = 'en-US'): string {
  const date = new Date(timestamp)
  return date.toLocaleString(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short'
  })
}
