import type { TableColumn } from '@nuxt/ui'
import { parse as parseYaml } from 'yaml'
import { parseCsv, jsonToCsv } from './csv'
import { formatJson } from './json'
import { jsonToYaml } from './yaml'

export interface TableData {
  [key: string]: unknown
}

export interface TableGenerationOptions {
  includeIndex?: boolean
  maxColumns?: number
  columnWidth?: 'auto' | 'equal' | 'fit'
}

/**
 * Parse JSON data into TableData format
 */
function parseJsonData(jsonData: unknown): TableData[] {
  // Parse JSON if it's a string
  const parsedData = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData as unknown

  if (Array.isArray(parsedData)) {
    return parsedData
  } else if (typeof parsedData === 'object' && parsedData !== null) {
    // Convert object to array of key-value pairs
    return Object.entries(parsedData).map(([key, value]) => ({
      key,
      value: typeof value === 'object' ? JSON.stringify(value) : value
    }))
  } else {
    throw new Error('Invalid JSON data format')
  }
}

/**
 * Parse CSV data into TableData format
 */
function parseCsvData(csvData: string): TableData[] {
  const parsedData = parseCsv(csvData)

  if (parsedData.length === 0) {
    return []
  }

  return parsedData.map((row) => {
    const tableRow: TableData = {}
    Object.keys(row).forEach((header) => {
      tableRow[header] = row[header] || ''
    })
    return tableRow
  })
}

/**
 * Parse YAML data into TableData format
 */
function parseYamlData(yamlData: string): TableData[] {
  const parsedData = parseYaml(yamlData)

  if (Array.isArray(parsedData)) {
    return parsedData.map((item, _index) => {
      if (typeof item === 'object' && item !== null) {
        return item as TableData
      }
      return { value: item, index: _index }
    })
  } else if (typeof parsedData === 'object' && parsedData !== null) {
    return Object.entries(parsedData).map(([key, value]) => ({
      key,
      value: typeof value === 'object' ? JSON.stringify(value) : value
    }))
  } else {
    throw new Error('Invalid YAML data format')
  }
}

/**
 * Generate table columns and data from parsed TableData
 */
function generateTableFromData(
  data: TableData[],
  options: TableGenerationOptions = {}
): { data: TableData[], columns: TableColumn<TableData>[] } {
  const { includeIndex = false, maxColumns = 20 } = options

  if (data.length === 0) {
    return { data: [], columns: [] }
  }

  // Get headers and limit them
  const firstRow = data[0]
  if (!firstRow) {
    return { data: [], columns: [] }
  }

  const keys = Object.keys(firstRow)
  const limitedKeys = keys.slice(0, maxColumns)

  // Generate columns
  const columns: TableColumn<TableData>[] = limitedKeys.map(key => ({
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

  // Limit data to only include the selected columns
  const limitedData = data.map((row) => {
    const limitedRow: TableData = {}
    limitedKeys.forEach((key) => {
      limitedRow[key] = row[key]
    })
    return limitedRow
  })

  return { data: limitedData, columns }
}

/**
 * Generate table columns from JSON data
 */
export function generateTableFromJson(
  jsonData: unknown,
  options: TableGenerationOptions = {}
): { data: TableData[], columns: TableColumn<TableData>[] } {
  try {
    const data = parseJsonData(jsonData)
    return generateTableFromData(data, options)
  } catch (error) {
    throw new Error(`Failed to generate table from JSON: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Generate table columns from CSV data
 */
export function generateTableFromCsv(
  csvData: string,
  options: TableGenerationOptions = {}
): { data: TableData[], columns: TableColumn<TableData>[] } {
  try {
    const data = parseCsvData(csvData)
    return generateTableFromData(data, options)
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
  try {
    const data = parseYamlData(yamlData)
    return generateTableFromData(data, options)
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
  try {
    switch (format) {
      case 'json':
        return formatJson(JSON.stringify(data))

      case 'csv':
        return jsonToCsv(JSON.stringify(data))

      case 'yaml':
        return jsonToYaml(JSON.stringify(data))

      default:
        throw new Error(`Unsupported export format: ${format}`)
    }
  } catch (error) {
    throw new Error(`Failed to export data: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
