/**
 * JWT Decoded structure
 */
export interface JwtDecoded {
  header: Record<string, unknown>
  payload: Record<string, unknown>
  signature: string
  raw: {
    header: string
    payload: string
    signature: string
  }
}

/**
 * Base64URL encode a string
 */
function base64UrlEncode(str: string): string {
  // Convert string to UTF-8 bytes, then to base64
  const utf8Bytes = new TextEncoder().encode(str)
  let binary = ''
  for (let i = 0; i < utf8Bytes.length; i++) {
    binary += String.fromCharCode(utf8Bytes[i]!)
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

/**
 * Base64URL decode a string
 */
function base64UrlDecode(str: string): string {
  // Add padding if needed
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/')
  while (base64.length % 4) {
    base64 += '='
  }
  try {
    const binary = atob(base64)
    // Convert binary string to UTF-8 string
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i)
    }
    return new TextDecoder().decode(bytes)
  } catch (error) {
    throw new Error(`Invalid base64url encoding: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Decodes a JWT string into its components
 */
export function decodeJwt(jwt: string): JwtDecoded {
  if (!jwt || typeof jwt !== 'string') {
    throw new Error('JWT must be a non-empty string')
  }

  const parts = jwt.trim().split('.')
  if (parts.length !== 3) {
    throw new Error('Invalid JWT format. Expected format: header.payload.signature')
  }

  const [headerB64, payloadB64, signatureB64] = parts

  try {
    const headerJson = base64UrlDecode(headerB64)
    const payloadJson = base64UrlDecode(payloadB64)

    const header = JSON.parse(headerJson) as Record<string, unknown>
    const payload = JSON.parse(payloadJson) as Record<string, unknown>

    return {
      header,
      payload,
      signature: signatureB64,
      raw: {
        header: headerB64,
        payload: payloadB64,
        signature: signatureB64
      }
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes('base64url')) {
      throw error
    }
    throw new Error(`Failed to decode JWT: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Encodes a JWT from header and payload objects
 * @param header - JWT header object
 * @param payload - JWT payload object
 * @param secret - Optional secret for signing (if provided, uses HS256)
 * @param algorithm - Algorithm to use (default: 'none' if no secret, 'HS256' if secret provided)
 */
export async function encodeJwt(
  header: Record<string, unknown>,
  payload: Record<string, unknown>,
  secret?: string,
  algorithm: string = 'none'
): Promise<string> {
  try {
    const headerJson = JSON.stringify(header)
    const payloadJson = JSON.stringify(payload)

    const headerB64 = base64UrlEncode(headerJson)
    const payloadB64 = base64UrlEncode(payloadJson)

    const unsignedToken = `${headerB64}.${payloadB64}`

    // If no secret provided, return unsigned JWT
    if (!secret) {
      return `${unsignedToken}.`
    }

    // Sign the token using Web Crypto API
    const encoder = new TextEncoder()
    const keyData = encoder.encode(secret)
    const messageData = encoder.encode(unsignedToken)

    // Import key for HMAC
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      {
        name: 'HMAC',
        hash: 'SHA-256'
      },
      false,
      ['sign']
    )

    // Sign the message
    const signature = await crypto.subtle.sign(
      'HMAC',
      cryptoKey,
      messageData
    )

    // Convert signature ArrayBuffer to base64url
    const signatureBytes = new Uint8Array(signature)
    let binary = ''
    for (let i = 0; i < signatureBytes.length; i++) {
      binary += String.fromCharCode(signatureBytes[i])
    }
    const signatureB64 = btoa(binary)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '')

    return `${unsignedToken}.${signatureB64}`
  } catch (error) {
    throw new Error(`Failed to encode JWT: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Formats decoded JWT as a readable JSON string
 */
export function formatDecodedJwt(decoded: JwtDecoded): string {
  return JSON.stringify(
    {
      header: decoded.header,
      payload: decoded.payload,
      signature: decoded.signature
    },
    null,
    2
  )
}

/**
 * Validates JWT format (does not verify signature)
 */
export function validateJwtFormat(jwt: string): boolean {
  try {
    decodeJwt(jwt)
    return true
  } catch {
    return false
  }
}
