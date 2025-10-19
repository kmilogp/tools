/**
 * Parses CSV string and returns array of objects
 */
export function parseCsv(csvString: string, delimiter: string = ','): Record<string, string>[] {
  if (!csvString.trim()) {
    return []
  }

  const lines = csvString.trim().split('\n')
  if (lines.length < 2) {
    throw new Error('CSV must have at least a header row and one data row')
  }

  const headers = parseCsvLine(lines[0]!, delimiter)
  const result: Record<string, string>[] = []

  for (let i = 1; i < lines.length; i++) {
    const values = parseCsvLine(lines[i]!, delimiter)

    if (values.length !== headers.length) {
      throw new Error(`Row ${i + 1} has ${values.length} columns, expected ${headers.length}`)
    }

    const row: Record<string, string> = {}
    headers.forEach((header, index) => {
      row[header] = values[index] || ''
    })
    result.push(row)
  }

  return result
}

/**
 * Converts array of objects to CSV string
 */
export function arrayToCsv(data: Record<string, string | number | boolean>[], delimiter: string = ','): string {
  if (!data || data.length === 0) {
    return ''
  }

  const headers = Object.keys(data[0]!)
  const csvLines = [headers.map(header => escapeCsvField(header)).join(delimiter)]

  data.forEach((row) => {
    const values = headers.map(header => escapeCsvField(String(row[header] || '')))
    csvLines.push(values.join(delimiter))
  })

  return csvLines.join('\n')
}

/**
 * Validates CSV string and returns validation result
 */
export function validateCsv(csvString: string, delimiter: string = ','): {
  isValid: boolean
  errors: string[]
  rowCount: number
  columnCount: number
  headers: string[]
} {
  const errors: string[] = []
  let rowCount = 0
  let columnCount = 0
  let headers: string[] = []

  try {
    if (!csvString.trim()) {
      errors.push('CSV string is empty')
      return { isValid: false, errors, rowCount: 0, columnCount: 0, headers: [] }
    }

    const lines = csvString.trim().split('\n')
    rowCount = lines.length

    if (lines.length < 2) {
      errors.push('CSV must have at least a header row and one data row')
      return { isValid: false, errors, rowCount, columnCount: 0, headers: [] }
    }

    // Parse headers
    try {
      headers = parseCsvLine(lines[0]!, delimiter)
      columnCount = headers.length
    } catch (error) {
      errors.push(`Header row error: ${error instanceof Error ? error.message : 'Unknown error'}`)
      return { isValid: false, errors, rowCount, columnCount: 0, headers: [] }
    }

    // Validate data rows
    for (let i = 1; i < lines.length; i++) {
      try {
        const values = parseCsvLine(lines[i]!, delimiter)
        if (values.length !== columnCount) {
          errors.push(`Row ${i + 1}: Expected ${columnCount} columns, found ${values.length}`)
        }
      } catch (error) {
        errors.push(`Row ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      rowCount,
      columnCount,
      headers
    }
  } catch (error) {
    errors.push(`General error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    return { isValid: false, errors, rowCount, columnCount, headers }
  }
}

/**
 * Converts CSV to JSON string
 */
export function csvToJson(csvString: string, delimiter: string = ','): string {
  const data = parseCsv(csvString, delimiter)
  return JSON.stringify(data, null, 2)
}

/**
 * Converts JSON to CSV string
 */
export function jsonToCsv(jsonString: string, delimiter: string = ','): string {
  try {
    const data = JSON.parse(jsonString)
    if (!Array.isArray(data)) {
      throw new Error('JSON must be an array of objects')
    }
    return arrayToCsv(data, delimiter)
  } catch (error) {
    throw new Error(`Invalid JSON: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Converts CSV to YAML string
 */
export function csvToYaml(csvString: string, delimiter: string = ','): string {
  const data = parseCsv(csvString, delimiter)
  // Simple YAML conversion - in a real implementation you might want to use a YAML library
  let yaml = ''
  data.forEach((row, index) => {
    yaml += `item${index}:\n`
    Object.entries(row).forEach(([key, value]) => {
      yaml += `  ${key}: "${value}"\n`
    })
  })
  return yaml
}

/**
 * Converts YAML to CSV string
 */
export function yamlToCsv(yamlString: string, delimiter: string = ','): string {
  try {
    // Simple YAML parsing - in a real implementation you might want to use a YAML library
    const lines = yamlString.trim().split('\n')
    const data: Record<string, string | number | boolean>[] = []
    let currentItem: Record<string, string | number | boolean> = {}
    const headers: string[] = []

    for (const line of lines) {
      const trimmed = line.trim()
      if (trimmed.endsWith(':')) {
        if (Object.keys(currentItem).length > 0) {
          data.push(currentItem)
        }
        currentItem = {}
      } else if (trimmed.includes(':')) {
        const [key, value] = trimmed.split(':', 2)
        const cleanKey = key?.trim() || ''
        const cleanValue = value?.trim().replace(/^["']|["']$/g, '') || ''
        currentItem[cleanKey] = cleanValue
        if (!headers.includes(cleanKey)) {
          headers.push(cleanKey)
        }
      }
    }

    if (Object.keys(currentItem).length > 0) {
      data.push(currentItem)
    }

    return arrayToCsv(data, delimiter)
  } catch (error) {
    throw new Error(`Invalid YAML: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Formats CSV with proper alignment and spacing
 */
export function formatCsv(csvString: string, delimiter: string = ','): string {
  const data = parseCsv(csvString, delimiter)
  return arrayToCsv(data, delimiter)
}

/**
 * Gets information about CSV string
 */
export function getCsvInfo(csvString: string, delimiter: string = ','): {
  isValid: boolean
  rowCount: number
  columnCount: number
  headers: string[]
  delimiter: string
  hasQuotes: boolean
  hasEmptyCells: boolean
  errors: string[]
} {
  const validation = validateCsv(csvString, delimiter)
  const hasQuotes = csvString.includes('"')
  const hasEmptyCells = csvString.includes(delimiter + delimiter) || csvString.startsWith(delimiter) || csvString.endsWith(delimiter)

  return {
    ...validation,
    delimiter,
    hasQuotes,
    hasEmptyCells
  }
}

// Helper functions

/**
 * Parses a single CSV line handling quotes and escapes
 */
function parseCsvLine(line: string, delimiter: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false
  let i = 0

  while (i < line.length) {
    const char = line[i]
    const nextChar = line[i + 1]

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        current += '"'
        i += 2
        continue
      } else {
        // Toggle quote state
        inQuotes = !inQuotes
      }
    } else if (char === delimiter && !inQuotes) {
      // Field separator
      result.push(current.trim())
      current = ''
    } else {
      current += char
    }
    i++
  }

  // Add the last field
  result.push(current.trim())

  return result
}

/**
 * Escapes a field for CSV output
 */
function escapeCsvField(field: string): string {
  if (field.includes('"') || field.includes(',') || field.includes('\n') || field.includes('\r')) {
    return `"${field.replace(/"/g, '""')}"`
  }
  return field
}
