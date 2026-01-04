/**
 * Generates a UUID v4 using browser crypto.randomUUID()
 * This is the standard random UUID format
 */
export function generateUuidV4(): string {
  if (typeof crypto === 'undefined' || !crypto.randomUUID) {
    throw new Error('crypto.randomUUID() is not available in this environment')
  }
  return crypto.randomUUID()
}

/**
 * Generates a UUID v7 using browser crypto utilities
 * UUID v7 is a time-ordered UUID that includes a timestamp
 * Format per RFC 4122 draft:
 * - 48 bits: Unix timestamp in milliseconds (big-endian)
 * - 4 bits: version (7)
 * - 12 bits: random data
 * - 2 bits: variant (10)
 * - 62 bits: random data
 */
export function generateUuidV7(): string {
  if (typeof crypto === 'undefined' || !crypto.getRandomValues) {
    throw new Error('crypto.getRandomValues() is not available in this environment')
  }

  // Get current timestamp in milliseconds
  const timestamp = Date.now()

  // Convert timestamp to 48-bit hex string (12 hex characters)
  // This ensures the first part of the UUID changes slowly over time
  const timestampHex = (BigInt(timestamp) & 0xFFFFFFFFFFFFn).toString(16).padStart(12, '0')

  // Generate random values for the rest of the UUID
  const randomBytes = new Uint8Array(10) // 10 bytes = 80 bits
  crypto.getRandomValues(randomBytes)

  // Construct the UUID bytes (16 bytes total)
  const bytes = new Uint8Array(16)

  // Bytes 0-5: 48-bit Unix timestamp in milliseconds (big-endian)
  // Convert hex string back to bytes to ensure correct encoding
  for (let i = 0; i < 6; i++) {
    bytes[i] = parseInt(timestampHex.slice(i * 2, i * 2 + 2), 16)
  }

  // Byte 6: version (4 bits, value 7) + random (4 bits)
  // Version 7 = 0x7 = 0111 in binary
  const version = 0x7
  const rand0 = randomBytes[0] ?? 0
  bytes[6] = ((version << 4) | ((rand0 >>> 4) & 0x0F)) & 0xFF

  // Byte 7: random (8 bits) - uses remaining 4 bits from rand0 and 4 bits from rand1
  const rand1 = randomBytes[1] ?? 0
  bytes[7] = ((rand0 & 0x0F) << 4) | ((rand1 >>> 4) & 0x0F)

  // Byte 8: variant (2 bits, value 10) + random (6 bits)
  // Variant 10 = 0x8 = 10 in binary (upper 2 bits)
  const variant = 0x8
  bytes[8] = ((variant << 6) | (rand1 & 0x3F)) & 0xFF

  // Bytes 9-15: random (56 bits = 7 bytes)
  bytes[9] = randomBytes[2] ?? 0
  bytes[10] = randomBytes[3] ?? 0
  bytes[11] = randomBytes[4] ?? 0
  bytes[12] = randomBytes[5] ?? 0
  bytes[13] = randomBytes[6] ?? 0
  bytes[14] = randomBytes[7] ?? 0
  bytes[15] = randomBytes[8] ?? 0

  // Convert to UUID string format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
  const hex = Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')

  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20, 32)
  ].join('-')
}

/**
 * Generates multiple UUIDs of the specified version
 */
export function generateMultipleUuids(version: 'v4' | 'v7', count: number): string[] {
  const generator = version === 'v4' ? generateUuidV4 : generateUuidV7
  return Array.from({ length: count }, () => generator())
}
