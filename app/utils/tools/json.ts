/**
 * Formats JSON string with proper indentation
 */
export function formatJson(json: string): string {
  try {
    const parsed = JSON.parse(json)
    return JSON.stringify(parsed, null, 2)
  } catch (error) {
    throw new Error(`Invalid JSON: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Minifies JSON string by removing unnecessary whitespace
 */
export function minifyJson(json: string): string {
  try {
    const parsed = JSON.parse(json)
    return JSON.stringify(parsed)
  } catch (error) {
    throw new Error(`Invalid JSON: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Escapes special characters in a string for JSON usage
 */
export function escapeJson(str: string): string {
  return JSON.stringify(str).slice(1, -1) // Remove outer quotes
}

/**
 * Unescapes JSON string by parsing and stringifying
 */
export function unescapeJson(str: string): string {
  try {
    return JSON.parse(`"${str}"`)
  } catch (error) {
    throw new Error(`Invalid escaped JSON: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Validates JSON string and returns parsed object or throws error
 */
export function validateJson(json: string): unknown {
  try {
    return JSON.parse(json)
  } catch (error) {
    throw new Error(`Invalid JSON: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
