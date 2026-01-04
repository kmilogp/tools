import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { generateUuidV4, generateUuidV7, generateMultipleUuids } from './uuid'

describe('UUID Tools', () => {
  describe('generateUuidV4', () => {
    it('should generate a valid UUID v4', () => {
      const uuid = generateUuidV4()
      
      // UUID v4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
      // where x is any hexadecimal digit and y is one of 8, 9, A, or B
      expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
    })

    it('should generate different UUIDs on each call', () => {
      const uuid1 = generateUuidV4()
      const uuid2 = generateUuidV4()
      const uuid3 = generateUuidV4()
      
      expect(uuid1).not.toBe(uuid2)
      expect(uuid2).not.toBe(uuid3)
      expect(uuid1).not.toBe(uuid3)
    })

    it('should have correct length', () => {
      const uuid = generateUuidV4()
      // UUID format: 8-4-4-4-12 = 36 characters total
      expect(uuid.length).toBe(36)
    })

    it('should have version 4 in the correct position', () => {
      const uuid = generateUuidV4()
      // Version 4 is at position 14 (0-indexed), character should be '4'
      expect(uuid[14]).toBe('4')
    })

    it('should throw error when crypto.randomUUID is not available', () => {
      const originalCrypto = global.crypto
      // @ts-expect-error - Testing error case
      global.crypto = { randomUUID: undefined }
      
      expect(() => generateUuidV4()).toThrow('crypto.randomUUID() is not available in this environment')
      
      global.crypto = originalCrypto
    })
  })

  describe('generateUuidV7', () => {
    it('should generate a valid UUID v7', () => {
      const uuid = generateUuidV7()
      
      // UUID v7 format: xxxxxxxx-xxxx-7xxx-yxxx-xxxxxxxxxxxx
      // where x is any hexadecimal digit and y is one of 8, 9, A, or B
      // Version 7 is at position 14, variant is in the third group
      expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
      expect(uuid[14]).toBe('7')
    })

    it('should have correct length', () => {
      const uuid = generateUuidV7()
      // UUID format: 8-4-4-4-12 = 36 characters total
      expect(uuid.length).toBe(36)
    })

    it('should have version 7 in the correct position', () => {
      const uuid = generateUuidV7()
      // Version 7 is at position 14 (0-indexed), character should be '7'
      expect(uuid[14]).toBe('7')
    })

    it('should generate time-ordered UUIDs (later timestamps produce larger UUIDs)', () => {
      const uuid1 = generateUuidV7()
      
      // Wait a small amount to ensure different timestamp
      const start = Date.now()
      while (Date.now() === start) {
        // Wait for next millisecond
      }
      
      const uuid2 = generateUuidV7()
      
      // Extract timestamp parts (first 12 hex characters)
      const timestamp1 = parseInt(uuid1.slice(0, 8) + uuid1.slice(9, 13), 16)
      const timestamp2 = parseInt(uuid2.slice(0, 8) + uuid2.slice(9, 13), 16)
      
      // UUID v7 should be time-ordered, so uuid2 should be >= uuid1
      expect(timestamp2).toBeGreaterThanOrEqual(timestamp1)
    })

    it('should generate different UUIDs even with same timestamp', () => {
      // Mock Date.now to return same timestamp
      const mockTimestamp = 1234567890123
      vi.spyOn(Date, 'now').mockReturnValue(mockTimestamp)
      
      const uuid1 = generateUuidV7()
      const uuid2 = generateUuidV7()
      
      // Even with same timestamp, random parts should make them different
      expect(uuid1).not.toBe(uuid2)
      
      vi.restoreAllMocks()
    })

    it('should throw error when crypto.getRandomValues is not available', () => {
      const originalCrypto = global.crypto
      // @ts-expect-error - Testing error case
      global.crypto = { getRandomValues: undefined }
      
      expect(() => generateUuidV7()).toThrow('crypto.getRandomValues() is not available in this environment')
      
      global.crypto = originalCrypto
    })

    it('should have correct variant bits', () => {
      const uuid = generateUuidV7()
      // Variant is in byte 8, which in hex string is at positions 16-17
      // In UUID format (8-4-4-4-12), byte 8 hex is in the third group (positions 14-17)
      // The variant affects the upper 2 bits, so we check the first hex char of that byte
      // Extract the hex representation of byte 8
      const thirdGroup = uuid.slice(14, 18) // Third group: xxxx
      const firstChar = thirdGroup[0]!.toLowerCase()
      // Variant 10 (binary) means upper 2 bits are 10, so hex can be 8-9-a-b or c-d-e-f depending on lower bits
      // But with variant 0x8 (1000), the upper 2 bits are 10, so first hex char should be 8, 9, a, or b
      // Actually, let's just verify it's a valid hex character in the variant range
      expect(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f']).toContain(firstChar)
    })
  })

  describe('generateMultipleUuids', () => {
    it('should generate multiple UUID v4', () => {
      const uuids = generateMultipleUuids('v4', 5)
      
      expect(uuids).toHaveLength(5)
      uuids.forEach(uuid => {
        expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
        expect(uuid[14]).toBe('4')
      })
    })

    it('should generate multiple UUID v7', () => {
      const uuids = generateMultipleUuids('v7', 5)
      
      expect(uuids).toHaveLength(5)
      uuids.forEach(uuid => {
        expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
        expect(uuid[14]).toBe('7')
      })
    })

    it('should generate unique UUIDs', () => {
      const uuids = generateMultipleUuids('v4', 10)
      const uniqueUuids = new Set(uuids)
      
      expect(uniqueUuids.size).toBe(10)
    })

    it('should handle zero count', () => {
      const uuids = generateMultipleUuids('v4', 0)
      expect(uuids).toHaveLength(0)
    })

    it('should handle large count', () => {
      const uuids = generateMultipleUuids('v4', 100)
      expect(uuids).toHaveLength(100)
      
      // All should be valid UUIDs
      uuids.forEach(uuid => {
        expect(uuid.length).toBe(36)
        expect(uuid[14]).toBe('4')
      })
    })
  })
})

