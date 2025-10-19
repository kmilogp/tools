import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  getCurrentTimestamp,
  getCurrentTimestampSeconds,
  timestampToDate,
  timestampToIso,
  timestampToUtc,
  dateToTimestamp,
  unixToTimestamp,
  timestampToUnix,
  isValidTimestamp,
  getTimestampInfo,
  getRelativeTime,
  formatTimestampWithTimezone
} from './timestamp'

describe('timestamp utilities', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2023-12-21T10:30:00.000Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('getCurrentTimestamp', () => {
    it('should return current timestamp in milliseconds', () => {
      const timestamp = getCurrentTimestamp()
      expect(timestamp).toBe(1703155800000) // 2023-12-21T10:30:00.000Z
      expect(typeof timestamp).toBe('number')
    })
  })

  describe('getCurrentTimestampSeconds', () => {
    it('should return current timestamp in seconds', () => {
      const timestamp = getCurrentTimestampSeconds()
      expect(timestamp).toBe(1703155800) // 2023-12-21T10:30:00.000Z in seconds
      expect(typeof timestamp).toBe('number')
    })
  })

  describe('timestampToDate', () => {
    it('should convert timestamp to local date string', () => {
      const timestamp = 1703155800000 // 2023-12-21T10:30:00.000Z
      const dateString = timestampToDate(timestamp)
      expect(dateString).toMatch(/\d{2}\/\d{2}\/\d{4}, \d{2}:\d{2}:\d{2}/)
    })

    it('should convert timestamp to date string with custom locale', () => {
      const timestamp = 1703155800000
      const dateString = timestampToDate(timestamp, 'es-ES')
      expect(dateString).toMatch(/\d{2}\/\d{2}\/\d{4}, \d{2}:\d{2}:\d{2}/)
    })
  })

  describe('timestampToIso', () => {
    it('should convert timestamp to ISO string', () => {
      const timestamp = 1703155800000
      const isoString = timestampToIso(timestamp)
      expect(isoString).toBe('2023-12-21T10:30:00.000Z')
    })
  })

  describe('timestampToUtc', () => {
    it('should convert timestamp to UTC string', () => {
      const timestamp = 1703155800000
      const utcString = timestampToUtc(timestamp)
      expect(utcString).toBe('Thu, 21 Dec 2023 10:30:00 GMT')
    })
  })

  describe('dateToTimestamp', () => {
    it('should convert ISO date string to timestamp', () => {
      const dateString = '2023-12-21T10:30:00.000Z'
      const timestamp = dateToTimestamp(dateString)
      expect(timestamp).toBe(1703155800000)
    })

    it('should convert local date string to timestamp', () => {
      const dateString = '2023-12-21T10:30:00'
      const timestamp = dateToTimestamp(dateString)
      expect(timestamp).toBe(1703155800000)
    })

    it('should throw error for invalid date string', () => {
      expect(() => dateToTimestamp('invalid-date')).toThrow('Invalid date format')
    })
  })

  describe('unixToTimestamp', () => {
    it('should convert Unix timestamp to milliseconds', () => {
      const unixTimestamp = 1703155800
      const timestamp = unixToTimestamp(unixTimestamp)
      expect(timestamp).toBe(1703155800000)
    })
  })

  describe('timestampToUnix', () => {
    it('should convert milliseconds timestamp to Unix timestamp', () => {
      const timestamp = 1703155800000
      const unixTimestamp = timestampToUnix(timestamp)
      expect(unixTimestamp).toBe(1703155800)
    })
  })

  describe('isValidTimestamp', () => {
    it('should return true for valid numeric timestamp', () => {
      expect(isValidTimestamp('1703155800000')).toBe(true)
      expect(isValidTimestamp('1703155800')).toBe(true)
    })

    it('should return false for invalid timestamp', () => {
      expect(isValidTimestamp('invalid')).toBe(false)
      expect(isValidTimestamp('0')).toBe(false)
      expect(isValidTimestamp('-1')).toBe(false)
      expect(isValidTimestamp('')).toBe(false)
    })
  })

  describe('getTimestampInfo', () => {
    it('should return comprehensive timestamp information', () => {
      const timestamp = 1703155800000
      const info = getTimestampInfo(timestamp)

      expect(info.milliseconds).toBe(1703155800000)
      expect(info.unix).toBe(1703155800)
      expect(info.iso).toBe('2023-12-21T10:30:00.000Z')
      expect(info.utc).toBe('Thu, 21 Dec 2023 10:30:00 GMT')
      expect(info.local).toMatch(/\d{2}\/\d{2}\/\d{4}, \d{2}:\d{2}:\d{2}/)
      expect(info.relative).toBe('a few seconds ago')
    })
  })

  describe('getRelativeTime', () => {
    it('should return "a few seconds ago" for recent timestamp', () => {
      const now = Date.now()
      const recent = now - 1000 // 1 second ago
      expect(getRelativeTime(recent)).toBe('a few seconds ago')
    })

    it('should return "in a few seconds" for future timestamp', () => {
      const now = Date.now()
      const future = now + 1000 // 1 second from now
      expect(getRelativeTime(future)).toBe('in a few seconds')
    })

    it('should return minutes ago for older timestamp', () => {
      const now = Date.now()
      const older = now - 120000 // 2 minutes ago
      expect(getRelativeTime(older)).toBe('2 minutes ago')
    })

    it('should return hours ago for much older timestamp', () => {
      const now = Date.now()
      const muchOlder = now - 7200000 // 2 hours ago
      expect(getRelativeTime(muchOlder)).toBe('2 hours ago')
    })

    it('should return days ago for very old timestamp', () => {
      const now = Date.now()
      const veryOld = now - 172800000 // 2 days ago
      expect(getRelativeTime(veryOld)).toBe('2 days ago')
    })
  })

  describe('formatTimestampWithTimezone', () => {
    it('should format timestamp with timezone information', () => {
      const timestamp = 1703155800000
      const formatted = formatTimestampWithTimezone(timestamp)
      expect(formatted).toMatch(/\d{2}\/\d{2}\/\d{4}, \d{2}:\d{2}:\d{2}/)
      expect(formatted).toMatch(/[A-Z]{3,4}/) // Should contain timezone abbreviation
    })

    it('should format timestamp with custom locale', () => {
      const timestamp = 1703155800000
      const formatted = formatTimestampWithTimezone(timestamp, 'es-ES')
      expect(formatted).toMatch(/\d{2}\/\d{2}\/\d{4}, \d{2}:\d{2}:\d{2}/)
    })
  })
})
