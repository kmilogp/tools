import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  timestampToIso,
  timestampToUtc,
  dateToTimestamp,
  unixToTimestamp,
  timestampToUnix,
  isValidTimestamp
} from './timestamp'

describe('timestamp utilities', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2023-12-21T10:30:00.000Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
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
})
