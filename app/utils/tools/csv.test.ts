import { describe, it, expect } from 'vitest'
import {
  parseCsv,
  arrayToCsv,
  validateCsv,
  csvToJson,
  jsonToCsv,
  csvToYaml,
  yamlToCsv,
  formatCsv,
  getCsvInfo
} from './csv'

describe('CSV Tools', () => {
  const sampleCsv = `name,age,city
John,25,New York
Jane,30,Los Angeles
Bob,35,Chicago`

  const sampleJson = `[
  {
    "name": "John",
    "age": "25",
    "city": "New York"
  },
  {
    "name": "Jane",
    "age": "30",
    "city": "Los Angeles"
  },
  {
    "name": "Bob",
    "age": "35",
    "city": "Chicago"
  }
]`

  describe('parseCsv', () => {
    it('should parse simple CSV correctly', () => {
      const result = parseCsv(sampleCsv)
      expect(result).toHaveLength(3)
      expect(result[0]).toEqual({ name: 'John', age: '25', city: 'New York' })
      expect(result[1]).toEqual({ name: 'Jane', age: '30', city: 'Los Angeles' })
      expect(result[2]).toEqual({ name: 'Bob', age: '35', city: 'Chicago' })
    })

    it('should handle empty CSV', () => {
      const result = parseCsv('')
      expect(result).toEqual([])
    })

    it('should handle CSV with quotes', () => {
      const csvWithQuotes = `name,description
John,"A person with, comma"
Jane,"Another person with ""quotes"""`
      const result = parseCsv(csvWithQuotes)
      expect(result).toHaveLength(2)
      expect(result[0]).toEqual({ name: 'John', description: 'A person with, comma' })
      expect(result[1]).toEqual({ name: 'Jane', description: 'Another person with "quotes"' })
    })

    it('should throw error for invalid CSV', () => {
      expect(() => parseCsv('name,age\nJohn')).toThrow('Row 2 has 1 columns, expected 2')
    })
  })

  describe('arrayToCsv', () => {
    it('should convert array to CSV correctly', () => {
      const data = [
        { name: 'John', age: '25', city: 'New York' },
        { name: 'Jane', age: '30', city: 'Los Angeles' }
      ]
      const result = arrayToCsv(data)
      expect(result).toContain('name,age,city')
      expect(result).toContain('John,25,New York')
      expect(result).toContain('Jane,30,Los Angeles')
    })

    it('should handle empty array', () => {
      const result = arrayToCsv([])
      expect(result).toBe('')
    })

    it('should escape fields with special characters', () => {
      const data = [
        { name: 'John, Jr.', description: 'A person with "quotes"' }
      ]
      const result = arrayToCsv(data)
      expect(result).toContain('"John, Jr."')
      expect(result).toContain('"A person with ""quotes"""')
    })
  })

  describe('validateCsv', () => {
    it('should validate correct CSV', () => {
      const result = validateCsv(sampleCsv)
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
      expect(result.rowCount).toBe(4)
      expect(result.columnCount).toBe(3)
      expect(result.headers).toEqual(['name', 'age', 'city'])
    })

    it('should detect invalid CSV', () => {
      const result = validateCsv('name,age\nJohn')
      expect(result.isValid).toBe(false)
      expect(result.errors).toHaveLength(1)
      expect(result.errors[0]).toContain('Expected 2 columns, found 1')
    })

    it('should handle empty CSV', () => {
      const result = validateCsv('')
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('CSV string is empty')
    })
  })

  describe('csvToJson', () => {
    it('should convert CSV to JSON correctly', () => {
      const result = csvToJson(sampleCsv)
      const parsed = JSON.parse(result)
      expect(parsed).toHaveLength(3)
      expect(parsed[0]).toEqual({ name: 'John', age: '25', city: 'New York' })
    })

    it('should handle empty CSV', () => {
      const result = csvToJson('')
      expect(result).toBe('[]')
    })
  })

  describe('jsonToCsv', () => {
    it('should convert JSON to CSV correctly', () => {
      const result = jsonToCsv(sampleJson)
      expect(result).toContain('name,age,city')
      expect(result).toContain('John,25,New York')
    })

    it('should throw error for invalid JSON', () => {
      expect(() => jsonToCsv('invalid json')).toThrow('Invalid JSON')
    })

    it('should throw error for non-array JSON', () => {
      expect(() => jsonToCsv('{"name": "John"}')).toThrow('JSON must be an array of objects')
    })
  })

  describe('csvToYaml', () => {
    it('should convert CSV to YAML', () => {
      const result = csvToYaml(sampleCsv)
      expect(result).toContain('item0:')
      expect(result).toContain('name: "John"')
      expect(result).toContain('age: "25"')
    })
  })

  describe('yamlToCsv', () => {
    it('should convert YAML to CSV', () => {
      const yaml = `item0:
  name: "John"
  age: "25"
  city: "New York"
item1:
  name: "Jane"
  age: "30"
  city: "Los Angeles"`
      const result = yamlToCsv(yaml)
      expect(result).toContain('name,age,city')
      expect(result).toContain('John,25,New York')
    })
  })

  describe('formatCsv', () => {
    it('should format CSV correctly', () => {
      const result = formatCsv(sampleCsv)
      expect(result).toContain('name,age,city')
      expect(result).toContain('John,25,New York')
    })
  })

  describe('getCsvInfo', () => {
    it('should return correct CSV information', () => {
      const result = getCsvInfo(sampleCsv)
      expect(result.isValid).toBe(true)
      expect(result.rowCount).toBe(4)
      expect(result.columnCount).toBe(3)
      expect(result.headers).toEqual(['name', 'age', 'city'])
      expect(result.delimiter).toBe(',')
      expect(result.hasQuotes).toBe(false)
      expect(result.hasEmptyCells).toBe(false)
      expect(result.errors).toHaveLength(0)
    })

    it('should detect quotes and empty cells', () => {
      const csvWithQuotes = 'name,age,city\n"John",25,"New York"\nJane,,Chicago'
      const result = getCsvInfo(csvWithQuotes)
      expect(result.hasQuotes).toBe(true)
      expect(result.hasEmptyCells).toBe(true)
    })
  })
})
