import { describe, it, expect } from 'vitest'
import {
  generateTableFromJson,
  generateTableFromCsv,
  generateTableFromYaml,
  analyzeTableData,
  exportTableData
} from './table'

describe('Table Utilities', () => {
  describe('generateTableFromJson', () => {
    it('should generate table from JSON array', () => {
      const jsonData = [
        { name: 'John', age: 30, city: 'New York' },
        { name: 'Jane', age: 25, city: 'Los Angeles' }
      ]

      const result = generateTableFromJson(jsonData)

      expect(result.data).toHaveLength(2)
      expect(result.columns).toHaveLength(3)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((result.columns[0] as any).accessorKey).toBe('name')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((result.columns[1] as any).accessorKey).toBe('age')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((result.columns[2] as any).accessorKey).toBe('city')
    })

    it('should generate table from JSON object', () => {
      const jsonData = {
        user1: { name: 'John', age: 30 },
        user2: { name: 'Jane', age: 25 }
      }

      const result = generateTableFromJson(jsonData)

      expect(result.data).toHaveLength(2)
      expect(result.columns).toHaveLength(2)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((result.columns[0] as any).accessorKey).toBe('key')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((result.columns[1] as any).accessorKey).toBe('value')
    })

    it('should include index column when requested', () => {
      const jsonData = [{ name: 'John' }, { name: 'Jane' }]

      const result = generateTableFromJson(jsonData, { includeIndex: true })

      expect(result.columns).toHaveLength(2)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((result.columns[0] as any).accessorKey).toBe('index')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((result.columns[0] as any).header).toBe('#')
    })

    it('should limit columns when maxColumns is specified', () => {
      const jsonData = [
        { a: 1, b: 2, c: 3, d: 4, e: 5 }
      ]

      const result = generateTableFromJson(jsonData, { maxColumns: 3 })

      expect(result.columns).toHaveLength(3)
    })

    it('should throw error for invalid JSON', () => {
      expect(() => {
        generateTableFromJson('invalid json')
      }).toThrow('Failed to generate table from JSON')
    })
  })

  describe('generateTableFromCsv', () => {
    it('should generate table from CSV data', () => {
      const csvData = `name,age,city
John,30,New York
Jane,25,Los Angeles`

      const result = generateTableFromCsv(csvData)

      expect(result.data).toHaveLength(2)
      expect(result.columns).toHaveLength(3)
      expect(result.data[0]).toEqual({ name: 'John', age: '30', city: 'New York' })
      expect(result.data[1]).toEqual({ name: 'Jane', age: '25', city: 'Los Angeles' })
    })

    it('should handle CSV with quotes and commas', () => {
      const csvData = `name,description
John,"A person, who likes coding"
Jane,"Another person"`

      const result = generateTableFromCsv(csvData)

      expect(result.data[0]?.description).toBe('A person, who likes coding')
      expect(result.data[1]?.description).toBe('Another person')
    })

    it('should include index column when requested', () => {
      const csvData = `name,age
John,30`

      const result = generateTableFromCsv(csvData, { includeIndex: true })

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((result.columns[0] as any).accessorKey).toBe('index')
    })

    it('should throw error for empty CSV', () => {
      expect(() => {
        generateTableFromCsv('')
      }).toThrow('Empty CSV data')
    })
  })

  describe('generateTableFromYaml', () => {
    it('should generate table from YAML array', () => {
      const yamlData = `- name: John
  age: 30
- name: Jane
  age: 25`

      const result = generateTableFromYaml(yamlData)

      expect(result.data).toHaveLength(2)
      expect(result.columns).toHaveLength(2)
    })

    it('should generate table from YAML object', () => {
      const yamlData = `user1:
  name: John
  age: 30
user2:
  name: Jane
  age: 25`

      const result = generateTableFromYaml(yamlData)

      expect(result.data).toHaveLength(2)
      expect(result.columns).toHaveLength(2)
    })

    it('should include index column when requested', () => {
      const yamlData = `- name: John
- name: Jane`

      const result = generateTableFromYaml(yamlData, { includeIndex: true })

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((result.columns[0] as any).accessorKey).toBe('index')
    })
  })

  describe('analyzeTableData', () => {
    it('should analyze table data correctly', () => {
      const data = [
        { name: 'John', age: 30, active: true },
        { name: 'Jane', age: 25, active: false }
      ]

      const analysis = analyzeTableData(data)

      expect(analysis.rowCount).toBe(2)
      expect(analysis.columnCount).toBe(3)
      expect(analysis.columnTypes.name).toBe('string')
      expect(analysis.columnTypes.age).toBe('number')
      expect(analysis.columnTypes.active).toBe('boolean')
      expect(analysis.sampleData).toHaveLength(2)
    })
  })

  describe('exportTableData', () => {
    const testData = [
      { name: 'John', age: 30 },
      { name: 'Jane', age: 25 }
    ]

    it('should export to JSON', () => {
      const result = exportTableData(testData, 'json')
      const parsed = JSON.parse(result)
      expect(parsed).toEqual(testData)
    })

    it('should export to CSV', () => {
      const result = exportTableData(testData, 'csv')
      const lines = result.split('\n')
      expect(lines[0]).toBe('name,age')
      expect(lines[1]).toBe('John,30')
      expect(lines[2]).toBe('Jane,25')
    })

    it('should export to YAML', () => {
      const result = exportTableData(testData, 'yaml')
      expect(result).toContain('name: John')
      expect(result).toContain('age: 30')
    })

    it('should throw error for unsupported format', () => {
      expect(() => {
        exportTableData(testData, 'xml' as 'json' | 'csv' | 'yaml')
      }).toThrow('Unsupported export format: xml')
    })
  })
})
