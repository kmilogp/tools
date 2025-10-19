import * as yaml from 'yaml'

/**
 * Parses a YAML string and returns the parsed object
 */
export function parseYaml(yamlString: string): unknown {
  try {
    return yaml.parse(yamlString)
  } catch (error) {
    throw new Error(`Invalid YAML: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Formats a YAML string with proper indentation and structure
 */
export function formatYaml(yamlString: string): string {
  try {
    const parsed = yaml.parse(yamlString)
    return yaml.stringify(parsed, { indent: 2 })
  } catch (error) {
    throw new Error(`Invalid YAML: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Validates a YAML string and returns parsed object or throws error
 */
export function validateYaml(yamlString: string): unknown {
  try {
    return yaml.parse(yamlString)
  } catch (error) {
    throw new Error(`Invalid YAML: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Converts YAML string to JSON string
 */
export function yamlToJson(yamlString: string): string {
  try {
    const parsed = yaml.parse(yamlString)
    return JSON.stringify(parsed, null, 2)
  } catch (error) {
    throw new Error(`Invalid YAML: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Converts JSON string to YAML string
 */
export function jsonToYaml(jsonString: string): string {
  try {
    const parsed = JSON.parse(jsonString)
    return yaml.stringify(parsed, { indent: 2 })
  } catch (error) {
    throw new Error(`Invalid JSON: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Gets information about a YAML string (validity, structure, etc.)
 */
export function getYamlInfo(yamlString: string): {
  isValid: boolean
  length: number
  lines: number
  hasComments: boolean
  hasMultiLineStrings: boolean
  hasReferences: boolean
  parsedType: string
  error?: string
} {
  try {
    const parsed = yaml.parse(yamlString)
    const lines = yamlString.split('\n').length
    const hasComments = yamlString.includes('#')
    const hasMultiLineStrings = yamlString.includes('|') || yamlString.includes('>')
    const hasReferences = yamlString.includes('&') || yamlString.includes('*')

    return {
      isValid: true,
      length: yamlString.length,
      lines,
      hasComments,
      hasMultiLineStrings,
      hasReferences,
      parsedType: Array.isArray(parsed) ? 'array' : typeof parsed,
      error: undefined
    }
  } catch (error) {
    const lines = yamlString.split('\n').length
    return {
      isValid: false,
      length: yamlString.length,
      lines,
      hasComments: yamlString.includes('#'),
      hasMultiLineStrings: yamlString.includes('|') || yamlString.includes('>'),
      hasReferences: yamlString.includes('&') || yamlString.includes('*'),
      parsedType: 'unknown',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Minifies a YAML string by removing unnecessary whitespace and comments
 */
export function minifyYaml(yamlString: string): string {
  try {
    const parsed = yaml.parse(yamlString)
    return yaml.stringify(parsed, { indent: 1 })
  } catch (error) {
    throw new Error(`Invalid YAML: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
