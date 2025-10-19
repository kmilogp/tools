import { describe, it, expect } from 'vitest'
import {
  encodeBase64,
  decodeBase64,
  validateBase64,
  encodeBase64Url,
  decodeBase64Url,
  getBase64Info
} from './base64'

describe('Base64 Tools', () => {
  describe('encodeBase64', () => {
    it('should encode simple text to Base64', () => {
      const input = 'Hello World'
      const expected = 'SGVsbG8gV29ybGQ='
      expect(encodeBase64(input)).toBe(expected)
    })

    it('should encode empty string', () => {
      const input = ''
      const expected = ''
      expect(encodeBase64(input)).toBe(expected)
    })

    it('should encode special characters', () => {
      const input = 'Hello "World" with\nnewlines and\ttabs!'
      const expected = 'SGVsbG8gIldvcmxkIiB3aXRoCm5ld2xpbmVzIGFuZAl0YWJzIQ=='
      expect(encodeBase64(input)).toBe(expected)
    })

    it('should encode unicode characters', () => {
      const input = 'Hello 世界 🌍'
      const expected = 'SGVsbG8g5LiW55WMIPCfjI0='
      expect(encodeBase64(input)).toBe(expected)
    })
  })

  describe('decodeBase64', () => {
    it('should decode Base64 to original text', () => {
      const input = 'SGVsbG8gV29ybGQ='
      const expected = 'Hello World'
      expect(decodeBase64(input)).toBe(expected)
    })

    it('should decode empty Base64', () => {
      const input = ''
      const expected = ''
      expect(decodeBase64(input)).toBe(expected)
    })

    it('should decode special characters', () => {
      const input = 'SGVsbG8gIldvcmxkIiB3aXRoCm5ld2xpbmVzIGFuZAl0YWJzIQ=='
      const expected = 'Hello "World" with\nnewlines and\ttabs!'
      expect(decodeBase64(input)).toBe(expected)
    })

    it('should decode unicode characters', () => {
      const input = 'SGVsbG8g5LiW55WMIPCfjI0='
      const expected = 'Hello 世界 🌍'
      expect(decodeBase64(input)).toBe(expected)
    })

    it('should throw error for invalid Base64', () => {
      const input = 'Invalid Base64!@#'
      expect(() => decodeBase64(input)).toThrow('Failed to decode from Base64')
    })

    it('should handle Base64 without padding', () => {
      const input = 'SGVsbG8gV29ybGQ'
      const expected = 'Hello World'
      expect(decodeBase64(input)).toBe(expected)
    })
  })

  describe('validateBase64', () => {
    it('should return true for valid Base64', () => {
      expect(validateBase64('SGVsbG8gV29ybGQ=')).toBe(true)
      expect(validateBase64('SGVsbG8gV29ybGQ==')).toBe(false) // Double padding invalid
      expect(validateBase64('SGVsbG8gV29ybGQ===')).toBe(false) // Triple padding invalid
      expect(validateBase64('')).toBe(true)
    })

    it('should return false for invalid Base64', () => {
      expect(validateBase64('Invalid Base64!@#')).toBe(false)
      expect(validateBase64('SGVsbG8gV29ybGQ===')).toBe(false)
      expect(validateBase64('SGVsbG8gV29ybGQ===')).toBe(false)
      expect(validateBase64('SGVsbG8gV29ybGQ===')).toBe(false)
    })

    it('should handle edge cases', () => {
      expect(validateBase64('A')).toBe(false) // Invalid length
      expect(validateBase64('AB')).toBe(false) // Invalid length
      expect(validateBase64('ABC')).toBe(false) // Invalid length (not multiple of 4)
      expect(validateBase64('ABCD')).toBe(true) // Valid
    })
  })

  describe('encodeBase64Url', () => {
    it('should encode to URL-safe Base64', () => {
      const input = 'Hello World'
      const expected = 'SGVsbG8gV29ybGQ'
      expect(encodeBase64Url(input)).toBe(expected)
    })

    it('should handle padding correctly', () => {
      const input = 'Hello'
      const expected = 'SGVsbG8'
      expect(encodeBase64Url(input)).toBe(expected)
    })

    it('should handle empty string', () => {
      const input = ''
      const expected = ''
      expect(encodeBase64Url(input)).toBe(expected)
    })

    it('should replace + with - and / with _', () => {
      const input = 'Hello+World/Test='
      const expected = 'SGVsbG8rV29ybGQvVGVzdD0'
      expect(encodeBase64Url(input)).toBe(expected)
    })
  })

  describe('decodeBase64Url', () => {
    it('should decode URL-safe Base64', () => {
      const input = 'SGVsbG8gV29ybGQ'
      const expected = 'Hello World'
      expect(decodeBase64Url(input)).toBe(expected)
    })

    it('should handle padding correctly', () => {
      const input = 'SGVsbG8'
      const expected = 'Hello'
      expect(decodeBase64Url(input)).toBe(expected)
    })

    it('should handle empty string', () => {
      const input = ''
      const expected = ''
      expect(decodeBase64Url(input)).toBe(expected)
    })

    it('should replace - with + and _ with /', () => {
      const input = 'SGVsbG8rV29ybGQvVGVzdD0'
      const expected = 'Hello+World/Test='
      expect(decodeBase64Url(input)).toBe(expected)
    })

    it('should throw error for invalid Base64 URL', () => {
      const input = 'Invalid Base64 URL!@#'
      expect(() => decodeBase64Url(input)).toThrow('Failed to decode from Base64 URL')
    })
  })

  describe('getBase64Info', () => {
    it('should return correct info for valid Base64', () => {
      const input = 'SGVsbG8gV29ybGQ='
      const info = getBase64Info(input)

      expect(info.isValid).toBe(true)
      expect(info.length).toBe(16)
      expect(info.padding).toBe(1)
      expect(info.isUrlSafe).toBe(false)
      expect(info.decodedLength).toBe(11)
    })

    it('should return correct info for URL-safe Base64', () => {
      const input = 'VGVzdDEy'
      const info = getBase64Info(input)

      expect(info.isValid).toBe(true)
      expect(info.length).toBe(8)
      expect(info.padding).toBe(0)
      expect(info.isUrlSafe).toBe(true)
      expect(info.decodedLength).toBe(6)
    })

    it('should return correct info for invalid Base64', () => {
      const input = 'Invalid Base64!@#'
      const info = getBase64Info(input)

      expect(info.isValid).toBe(false)
      expect(info.length).toBe(17)
      expect(info.padding).toBe(0)
      expect(info.isUrlSafe).toBe(true) // No +, /, or = characters
      expect(info.decodedLength).toBe(0)
    })

    it('should handle empty string', () => {
      const input = ''
      const info = getBase64Info(input)

      expect(info.isValid).toBe(true)
      expect(info.length).toBe(0)
      expect(info.padding).toBe(0)
      expect(info.isUrlSafe).toBe(true)
      expect(info.decodedLength).toBe(0)
    })
  })
})
