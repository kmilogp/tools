import { describe, it, expect } from 'vitest'
import { formatJson, minifyJson, escapeJson, unescapeJson, validateJson } from './json'

describe('JSON Tools', () => {
  describe('formatJson', () => {
    it('should format valid JSON with proper indentation', () => {
      const input = '{"name":"John","age":30,"city":"New York"}'
      const expected = `{
  "name": "John",
  "age": 30,
  "city": "New York"
}`
      expect(formatJson(input)).toBe(expected)
    })

    it('should handle nested objects', () => {
      const input = '{"user":{"name":"John","details":{"age":30,"city":"NY"}}}'
      const expected = `{
  "user": {
    "name": "John",
    "details": {
      "age": 30,
      "city": "NY"
    }
  }
}`
      expect(formatJson(input)).toBe(expected)
    })

    it('should throw error for invalid JSON', () => {
      const input = '{"name":"John","age":30,}'
      expect(() => formatJson(input)).toThrow('Invalid JSON')
    })

    it('should handle empty object', () => {
      const input = '{}'
      const expected = '{}'
      expect(formatJson(input)).toBe(expected)
    })
  })

  describe('minifyJson', () => {
    it('should minify formatted JSON', () => {
      const input = `{
  "name": "John",
  "age": 30,
  "city": "New York"
}`
      const expected = '{"name":"John","age":30,"city":"New York"}'
      expect(minifyJson(input)).toBe(expected)
    })

    it('should handle already minified JSON', () => {
      const input = '{"name":"John","age":30}'
      expect(minifyJson(input)).toBe(input)
    })

    it('should throw error for invalid JSON', () => {
      const input = '{"name":"John","age":30,}'
      expect(() => minifyJson(input)).toThrow('Invalid JSON')
    })
  })

  describe('escapeJson', () => {
    it('should escape special characters', () => {
      const input = 'Hello "World" with\nnewlines and\ttabs'
      const expected = 'Hello \\"World\\" with\\nnewlines and\\ttabs'
      expect(escapeJson(input)).toBe(expected)
    })

    it('should handle backslashes', () => {
      const input = 'Path: C:\\Users\\John'
      const expected = 'Path: C:\\\\Users\\\\John'
      expect(escapeJson(input)).toBe(expected)
    })

    it('should handle empty string', () => {
      const input = ''
      const expected = ''
      expect(escapeJson(input)).toBe(expected)
    })
  })

  describe('unescapeJson', () => {
    it('should unescape special characters', () => {
      const input = 'Hello \\"World\\" with\\nnewlines and\\ttabs'
      const expected = 'Hello "World" with\nnewlines and\ttabs'
      expect(unescapeJson(input)).toBe(expected)
    })

    it('should handle backslashes', () => {
      const input = 'Path: C:\\\\Users\\\\John'
      const expected = 'Path: C:\\Users\\John'
      expect(unescapeJson(input)).toBe(expected)
    })

    it('should throw error for invalid escaped JSON', () => {
      const input = 'Invalid \\x escape'
      expect(() => unescapeJson(input)).toThrow('Invalid escaped JSON')
    })
  })

  describe('validateJson', () => {
    it('should return parsed object for valid JSON', () => {
      const input = '{"name":"John","age":30}'
      const expected = { name: 'John', age: 30 }
      expect(validateJson(input)).toEqual(expected)
    })

    it('should handle arrays', () => {
      const input = '[1,2,3,"test"]'
      const expected = [1, 2, 3, 'test']
      expect(validateJson(input)).toEqual(expected)
    })

    it('should throw error for invalid JSON', () => {
      const input = '{"name":"John","age":30,}'
      expect(() => validateJson(input)).toThrow('Invalid JSON')
    })

    it('should handle null and boolean values', () => {
      const input = '{"isActive":true,"value":null}'
      const expected = { isActive: true, value: null }
      expect(validateJson(input)).toEqual(expected)
    })
  })
})
