/**
 * Encodes a string to Base64
 */
export function encodeBase64(input: string): string {
  try {
    // Handle unicode characters by encoding to UTF-8 first
    const utf8Bytes = new TextEncoder().encode(input)
    const binaryString = Array.from(utf8Bytes, byte => String.fromCharCode(byte)).join('')
    return btoa(binaryString)
  } catch (error) {
    throw new Error(`Failed to encode to Base64: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Decodes a Base64 string to original text
 */
export function decodeBase64(input: string): string {
  try {
    const binaryString = atob(input)
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }
    return new TextDecoder().decode(bytes)
  } catch (error) {
    throw new Error(`Failed to decode from Base64: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Validates if a string is valid Base64
 */
export function validateBase64(input: string): boolean {
  if (input === '') return true

  try {
    // Check if it contains only valid Base64 characters
    const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/
    if (!base64Regex.test(input)) return false

    // Check if length is multiple of 4
    if (input.length % 4 !== 0) return false

    // Add padding if needed for validation
    let paddedInput = input
    while (paddedInput.length % 4) {
      paddedInput += '='
    }

    // Try to decode it
    atob(paddedInput)
    return true
  } catch {
    return false
  }
}

/**
 * Encodes a string to Base64 with URL-safe characters
 */
export function encodeBase64Url(input: string): string {
  try {
    // Handle unicode characters by encoding to UTF-8 first
    const utf8Bytes = new TextEncoder().encode(input)
    const binaryString = Array.from(utf8Bytes, byte => String.fromCharCode(byte)).join('')
    const base64 = btoa(binaryString)
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
  } catch (error) {
    throw new Error(`Failed to encode to Base64 URL: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Decodes a Base64 URL string to original text
 */
export function decodeBase64Url(input: string): string {
  try {
    // Add padding if needed
    let base64 = input.replace(/-/g, '+').replace(/_/g, '/')
    while (base64.length % 4) {
      base64 += '='
    }
    const binaryString = atob(base64)
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }
    return new TextDecoder().decode(bytes)
  } catch (error) {
    throw new Error(`Failed to decode from Base64 URL: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Gets information about a Base64 string (length, padding, etc.)
 */
export function getBase64Info(input: string): {
  isValid: boolean
  length: number
  padding: number
  isUrlSafe: boolean
  decodedLength: number
} {
  const isValid = validateBase64(input)
  const length = input.length
  const padding = (input.match(/=/g) || []).length
  const isUrlSafe = !input.includes('+') && !input.includes('/') && !input.includes('=')

  let decodedLength = 0
  if (isValid) {
    try {
      // Add padding if needed for decoding
      let paddedInput = input
      while (paddedInput.length % 4) {
        paddedInput += '='
      }
      decodedLength = atob(paddedInput).length
    } catch {
      decodedLength = 0
    }
  }

  return {
    isValid,
    length,
    padding,
    isUrlSafe,
    decodedLength
  }
}
