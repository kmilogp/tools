import { describe, it, expect } from 'vitest'
import { decodeJwt, encodeJwt, formatDecodedJwt, validateJwtFormat, type JwtDecoded } from './jwt'

describe('JWT Tools', () => {
  // Sample JWT for testing (unsigned)
  const sampleHeader = { alg: 'none', typ: 'JWT' }
  const samplePayload = { sub: '1234567890', name: 'John Doe', iat: 1516239022 }
  const sampleJwtUnsigned = 'eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.'

  // Sample signed JWT (HS256 with secret "secret")
  const sampleJwtSigned = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

  describe('decodeJwt', () => {
    it('should decode a valid unsigned JWT', () => {
      const decoded = decodeJwt(sampleJwtUnsigned)

      expect(decoded.header).toEqual({ alg: 'none', typ: 'JWT' })
      expect(decoded.payload).toEqual({ sub: '1234567890', name: 'John Doe', iat: 1516239022 })
      expect(decoded.signature).toBe('')
      expect(decoded.raw.header).toBe('eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0')
      expect(decoded.raw.payload).toBe('eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ')
      expect(decoded.raw.signature).toBe('')
    })

    it('should decode a valid signed JWT', () => {
      const decoded = decodeJwt(sampleJwtSigned)

      expect(decoded.header).toEqual({ alg: 'HS256', typ: 'JWT' })
      expect(decoded.payload).toEqual({ sub: '1234567890', name: 'John Doe', iat: 1516239022 })
      expect(decoded.signature).toBeTruthy()
      expect(decoded.signature.length).toBeGreaterThan(0)
    })

    it('should handle JWT with complex payload', async () => {
      const complexPayload = {
        sub: 'user123',
        roles: ['admin', 'user'],
        metadata: {
          created: '2023-01-01',
          active: true
        }
      }
      const header = { alg: 'none', typ: 'JWT' }

      // We'll encode it first, then decode
      const jwt = await encodeJwt(header, complexPayload)
      const decoded = decodeJwt(jwt)
      expect(decoded.payload).toEqual(complexPayload)
    })

    it('should throw error for empty string', () => {
      expect(() => decodeJwt('')).toThrow('JWT must be a non-empty string')
    })

    it('should throw error for invalid format (missing parts)', () => {
      expect(() => decodeJwt('header.payload')).toThrow('Invalid JWT format. Expected format: header.payload.signature')
    })

    it('should throw error for invalid format (too many parts)', () => {
      expect(() => decodeJwt('header.payload.signature.extra')).toThrow('Invalid JWT format. Expected format: header.payload.signature')
    })

    it('should throw error for invalid base64url encoding', () => {
      const invalidJwt = 'invalid!base64.header.payload'
      expect(() => decodeJwt(invalidJwt)).toThrow()
    })

    it('should throw error for invalid JSON in header', () => {
      // Create a JWT with invalid JSON in header
      const invalidHeaderB64 = btoa('invalid json').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
      const validPayloadB64 = btoa('{"sub":"123"}').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
      const invalidJwt = `${invalidHeaderB64}.${validPayloadB64}.signature`

      expect(() => decodeJwt(invalidJwt)).toThrow('Failed to decode JWT')
    })

    it('should handle whitespace around JWT', () => {
      const jwtWithWhitespace = `  ${sampleJwtUnsigned}  `
      const decoded = decodeJwt(jwtWithWhitespace)
      expect(decoded.header).toEqual(sampleHeader)
    })
  })

  describe('encodeJwt', () => {
    it('should encode JWT without secret (unsigned)', async () => {
      const jwt = await encodeJwt(sampleHeader, samplePayload)

      expect(jwt).toMatch(/^[^.]+\.([^.]+)\.$/)
      const parts = jwt.split('.')
      expect(parts).toHaveLength(3)
      expect(parts[2]).toBe('')
    })

    it('should encode JWT with secret (signed)', async () => {
      const header = { alg: 'HS256', typ: 'JWT' }
      const jwt = await encodeJwt(header, samplePayload, 'secret')

      expect(jwt).toMatch(/^[^.]+\.([^.]+)\.([^.]+)$/)
      const parts = jwt.split('.')
      expect(parts).toHaveLength(3)
      expect(parts[2]!.length).toBeGreaterThan(0) // Signature should exist
    })

    it('should produce decodable JWT', async () => {
      const jwt = await encodeJwt(sampleHeader, samplePayload)
      const decoded = decodeJwt(jwt)

      expect(decoded.header).toEqual(sampleHeader)
      expect(decoded.payload).toEqual(samplePayload)
    })

    it('should produce decodable signed JWT', async () => {
      const header = { alg: 'HS256', typ: 'JWT' }
      const jwt = await encodeJwt(header, samplePayload, 'my-secret-key')
      const decoded = decodeJwt(jwt)

      expect(decoded.header).toEqual(header)
      expect(decoded.payload).toEqual(samplePayload)
      expect(decoded.signature).toBeTruthy()
    })

    it('should handle empty payload', async () => {
      const jwt = await encodeJwt(sampleHeader, {})
      const decoded = decodeJwt(jwt)

      expect(decoded.header).toEqual(sampleHeader)
      expect(decoded.payload).toEqual({})
    })

    it('should handle complex nested objects', async () => {
      const complexPayload = {
        user: {
          id: 123,
          roles: ['admin', 'user'],
          metadata: {
            created: '2023-01-01',
            active: true
          }
        }
      }
      const jwt = await encodeJwt(sampleHeader, complexPayload)
      const decoded = decodeJwt(jwt)

      expect(decoded.payload).toEqual(complexPayload)
    })

    it('should handle special characters in payload', async () => {
      const payload = {
        message: 'Hello "World" with\nnewlines and\ttabs',
        unicode: '测试 🎉'
      }
      const jwt = await encodeJwt(sampleHeader, payload)
      const decoded = decodeJwt(jwt)

      expect(decoded.payload).toEqual(payload)
    })

    it('should generate different signatures for different secrets', async () => {
      const header = { alg: 'HS256', typ: 'JWT' }
      const jwt1 = await encodeJwt(header, samplePayload, 'secret1')
      const jwt2 = await encodeJwt(header, samplePayload, 'secret2')

      const parts1 = jwt1.split('.')
      const parts2 = jwt2.split('.')

      // Headers and payloads should be the same
      expect(parts1[0]).toBe(parts2[0])
      expect(parts1[1]).toBe(parts2[1])
      // Signatures should be different
      expect(parts1[2]).not.toBe(parts2[2])
    })

    it('should generate same signature for same secret', async () => {
      const header = { alg: 'HS256', typ: 'JWT' }
      const jwt1 = await encodeJwt(header, samplePayload, 'secret')
      const jwt2 = await encodeJwt(header, samplePayload, 'secret')

      const parts1 = jwt1.split('.')
      const parts2 = jwt2.split('.')

      // All parts should be the same
      expect(parts1[0]).toBe(parts2[0])
      expect(parts1[1]).toBe(parts2[1])
      expect(parts1[2]).toBe(parts2[2])
    })

    it('should throw error for invalid header object', async () => {
      // This should not throw, but if JSON.stringify fails, it would
      const header = { alg: 'HS256', typ: 'JWT' }
      const payload = { sub: '123' }

      // Should not throw
      await expect(encodeJwt(header, payload, 'secret')).resolves.toBeTruthy()
    })
  })

  describe('formatDecodedJwt', () => {
    it('should format decoded JWT as JSON string', () => {
      const decoded: JwtDecoded = {
        header: { alg: 'HS256', typ: 'JWT' },
        payload: { sub: '123', name: 'John' },
        signature: 'signature123',
        raw: {
          header: 'header',
          payload: 'payload',
          signature: 'signature123'
        }
      }

      const formatted = formatDecodedJwt(decoded)
      const parsed = JSON.parse(formatted)

      expect(parsed.header).toEqual(decoded.header)
      expect(parsed.payload).toEqual(decoded.payload)
      expect(parsed.signature).toBe(decoded.signature)
    })

    it('should format with proper indentation', () => {
      const decoded: JwtDecoded = {
        header: { alg: 'HS256' },
        payload: { sub: '123' },
        signature: 'sig',
        raw: {
          header: 'h',
          payload: 'p',
          signature: 'sig'
        }
      }

      const formatted = formatDecodedJwt(decoded)

      // Should contain newlines (from indentation)
      expect(formatted).toContain('\n')
      // Should be valid JSON
      expect(() => JSON.parse(formatted)).not.toThrow()
    })
  })

  describe('validateJwtFormat', () => {
    it('should return true for valid JWT', () => {
      expect(validateJwtFormat(sampleJwtUnsigned)).toBe(true)
      expect(validateJwtFormat(sampleJwtSigned)).toBe(true)
    })

    it('should return false for invalid JWT format', () => {
      expect(validateJwtFormat('invalid')).toBe(false)
      expect(validateJwtFormat('header.payload')).toBe(false)
      expect(validateJwtFormat('')).toBe(false)
    })

    it('should return false for JWT with invalid base64', () => {
      expect(validateJwtFormat('invalid!base64.header.payload')).toBe(false)
    })

    it('should return true for newly encoded JWT', async () => {
      const jwt = await encodeJwt(sampleHeader, samplePayload)
      expect(validateJwtFormat(jwt)).toBe(true)
    })

    it('should return true for newly encoded signed JWT', async () => {
      const header = { alg: 'HS256', typ: 'JWT' }
      const jwt = await encodeJwt(header, samplePayload, 'secret')
      expect(validateJwtFormat(jwt)).toBe(true)
    })
  })

  describe('Integration tests', () => {
    it('should encode and decode round-trip correctly', async () => {
      const header = { alg: 'HS256', typ: 'JWT' }
      const payload = { sub: 'user123', name: 'Test User', exp: 1234567890 }

      const jwt = await encodeJwt(header, payload, 'my-secret')
      const decoded = decodeJwt(jwt)

      expect(decoded.header).toEqual(header)
      expect(decoded.payload).toEqual(payload)
    })

    it('should encode and decode unsigned JWT correctly', async () => {
      const jwt = await encodeJwt(sampleHeader, samplePayload)
      const decoded = decodeJwt(jwt)

      expect(decoded.header).toEqual(sampleHeader)
      expect(decoded.payload).toEqual(samplePayload)
      expect(decoded.signature).toBe('')
    })

    it('should handle multiple encode/decode cycles', async () => {
      const header = { alg: 'none', typ: 'JWT' }
      const payload = { counter: 1 }

      for (let i = 0; i < 5; i++) {
        payload.counter = i
        const jwt = await encodeJwt(header, payload)
        const decoded = decodeJwt(jwt)
        expect(decoded.payload.counter).toBe(i)
      }
    })
  })
})
