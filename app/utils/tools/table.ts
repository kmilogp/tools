import type { TableColumn } from '@nuxt/ui'
import { parse as parseYaml } from 'yaml'

export interface TableData {
  [key: string]: unknown
}

export interface TableGenerationOptions {
  includeIndex?: boolean
  maxColumns?: number
  columnWidth?: 'auto' | 'equal' | 'fit'
}

/**
 * Generate table columns from JSON data
 */
export function generateTableFromJson(
  jsonData: unknown,
  options: TableGenerationOptions = {}
): { data: TableData[], columns: TableColumn<TableData>[] } {
  const { includeIndex = false, maxColumns = 20 } = options

  let data: TableData[] = []
  let columns: TableColumn<TableData>[] = []

  try {
    // Parse JSON if it's a string
    const parsedData = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData as unknown

    if (Array.isArray(parsedData)) {
      data = parsedData
    } else if (typeof parsedData === 'object' && parsedData !== null) {
      // Convert object to array of key-value pairs
      data = Object.entries(parsedData).map(([key, value]) => ({
        key,
        value: typeof value === 'object' ? JSON.stringify(value) : value
      }))
    } else {
      throw new Error('Invalid JSON data format')
    }

    // Generate columns from the first row
    if (data.length > 0) {
      const firstRow = data[0]
      if (firstRow) {
        const keys = Object.keys(firstRow)
        const limitedKeys = keys.slice(0, maxColumns)

        columns = limitedKeys.map(key => ({
          accessorKey: key,
          header: key.charAt(0).toUpperCase() + key.slice(1),
          cell: ({ row }: { row: { getValue: (key: string) => unknown, index: number } }) => {
            const value = row.getValue(key)
            if (value === null || value === undefined) {
              return '-'
            }
            if (typeof value === 'object') {
              return JSON.stringify(value)
            }
            return String(value)
          }
        }))

        // Add index column if requested
        if (includeIndex) {
          columns.unshift({
            accessorKey: 'index',
            header: '#',
            cell: ({ row }: { row: { index: number } }) => row.index + 1
          })
        }
      }
    }
  } catch (error) {
    throw new Error(`Failed to generate table from JSON: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }

  return { data, columns }
}

/**
 * Generate table columns from CSV data
 */
export function generateTableFromCsv(
  csvData: string,
  options: TableGenerationOptions = {}
): { data: TableData[], columns: TableColumn<TableData>[] } {
  const { includeIndex = false, maxColumns = 20 } = options

  try {
    const lines = csvData.trim().split('\n').filter(line => line.length > 0)
    if (lines.length === 0) {
      throw new Error('Empty CSV data')
    }

    // Parse CSV (simple implementation)
    const parseCsvLine = (line: string): string[] => {
      const result: string[] = []
      let current = ''
      let inQuotes = false

      for (let i = 0; i < line.length; i++) {
        const char = line[i]
        if (char === '"') {
          inQuotes = !inQuotes
        } else if (char === ',' && !inQuotes) {
          result.push(current.trim())
          current = ''
        } else {
          current += char
        }
      }
      result.push(current.trim())
      return result
    }

    const headers = parseCsvLine(lines[0] || '')
    const limitedHeaders = headers.slice(0, maxColumns)

    const data: TableData[] = lines.slice(1).map((line) => {
      const values = parseCsvLine(line)
      const row: TableData = {}
      limitedHeaders.forEach((header, i) => {
        row[header] = values[i] || ''
      })
      return row
    })

    const columns: TableColumn<TableData>[] = limitedHeaders.map(header => ({
      accessorKey: header,
      header: header.charAt(0).toUpperCase() + header.slice(1),
      cell: ({ row }: { row: { getValue: (key: string) => unknown } }) => {
        const value = row.getValue(header)
        return value || '-'
      }
    }))

    // Add index column if requested
    if (includeIndex) {
      columns.unshift({
        accessorKey: 'index',
        header: '#',
        cell: ({ row }: { row: { index: number } }) => row.index + 1
      })
    }

    return { data, columns }
  } catch (error) {
    throw new Error(`Failed to generate table from CSV: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Generate table columns from YAML data
 */
export function generateTableFromYaml(
  yamlData: string,
  options: TableGenerationOptions = {}
): { data: TableData[], columns: TableColumn<TableData>[] } {
  const { includeIndex = false, maxColumns = 20 } = options

  try {
    const parsedData = parseYaml(yamlData)
    let data: TableData[] = []

    if (Array.isArray(parsedData)) {
      data = parsedData.map((item, _index) => {
        if (typeof item === 'object' && item !== null) {
          return item as TableData
        }
        return { value: item, index: _index }
      })
    } else if (typeof parsedData === 'object' && parsedData !== null) {
      data = Object.entries(parsedData).map(([key, value]) => ({
        key,
        value: typeof value === 'object' ? JSON.stringify(value) : value
      }))
    } else {
      throw new Error('Invalid YAML data format')
    }

    // Generate columns
    const columns: TableColumn<TableData>[] = []
    if (data.length > 0) {
      const firstRow = data[0]
      if (firstRow) {
        const keys = Object.keys(firstRow)
        const limitedKeys = keys.slice(0, maxColumns)

        limitedKeys.forEach((key) => {
          columns.push({
            accessorKey: key,
            header: key.charAt(0).toUpperCase() + key.slice(1),
            cell: ({ row }: { row: { getValue: (key: string) => unknown } }) => {
              const value = row.getValue(key)
              if (value === null || value === undefined) {
                return '-'
              }
              if (typeof value === 'object') {
                return JSON.stringify(value)
              }
              return String(value)
            }
          })
        })

        // Add index column if requested
        if (includeIndex) {
          columns.unshift({
            accessorKey: 'index',
            header: '#',
            cell: ({ row }: { row: { index: number } }) => row.index + 1
          })
        }
      }
    }

    return { data, columns }
  } catch (error) {
    throw new Error(`Failed to generate table from YAML: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Analyze table data and return statistics
 */
export function analyzeTableData(data: TableData[]): {
  rowCount: number
  columnCount: number
  columnTypes: Record<string, string>
  sampleData: TableData[]
} {
  const rowCount = data.length
  const columnCount = data.length > 0 && data[0] ? Object.keys(data[0]).length : 0
  const sampleData = data.slice(0, 5) // First 5 rows as sample

  const columnTypes: Record<string, string> = {}
  if (data.length > 0) {
    const firstRow = data[0]
    if (firstRow) {
      Object.keys(firstRow).forEach((key) => {
        const values = data.map(row => row[key]).filter(val => val !== null && val !== undefined)
        if (values.length === 0) {
          columnTypes[key] = 'empty'
        } else if (values.every(val => typeof val === 'number')) {
          columnTypes[key] = 'number'
        } else if (values.every(val => typeof val === 'boolean')) {
          columnTypes[key] = 'boolean'
        } else if (values.every(val => typeof val === 'string' && !isNaN(Date.parse(val)))) {
          columnTypes[key] = 'date'
        } else {
          columnTypes[key] = 'string'
        }
      })
    }
  }

  return {
    rowCount,
    columnCount,
    columnTypes,
    sampleData
  }
}

/**
 * Export table data to different formats
 */
export function exportTableData(
  data: TableData[],
  format: 'json' | 'csv' | 'yaml'
): string {
  switch (format) {
    case 'json':
      return JSON.stringify(data, null, 2)

    case 'csv': {
      if (data.length === 0) return ''
      const firstRow = data[0]
      if (!firstRow) return ''
      const headers = Object.keys(firstRow)
      const csvRows = [
        headers.join(','),
        ...data.map(row =>
          headers.map((header) => {
            const value = row[header]
            if (value === null || value === undefined) return ''
            const stringValue = String(value)
            return stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')
              ? `"${stringValue.replace(/"/g, '""')}"`
              : stringValue
          }).join(',')
        )
      ]
      return csvRows.join('\n')
    }

    case 'yaml':
      return data.map((row, _index) => {
        const entries = Object.entries(row)
        if (entries.length === 0) return `- {}`
        return `- ${entries.map(([key, value]) => `${key}: ${value}`).join(', ')}`
      }).join('\n')

    default:
      throw new Error(`Unsupported export format: ${format}`)
  }
}
