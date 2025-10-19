import { describe, it, expect } from 'vitest'
import {
  parseYaml,
  formatYaml,
  validateYaml,
  yamlToJson,
  jsonToYaml,
  getYamlInfo,
  minifyYaml
} from './yaml'

describe('YAML Tools', () => {
  const sampleYaml = `name: John Doe
age: 30
address:
  street: 123 Main St
  city: New York
  country: USA
hobbies:
  - reading
  - coding
  - hiking
active: true`

  const sampleJson = `{
  "name": "John Doe",
  "age": 30,
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "country": "USA"
  },
  "hobbies": [
    "reading",
    "coding",
    "hiking"
  ],
  "active": true
}`

  describe('parseYaml', () => {
    it('should parse valid YAML string', () => {
      const result = parseYaml(sampleYaml)
      expect(result).toEqual({
        name: 'John Doe',
        age: 30,
        address: {
          street: '123 Main St',
          city: 'New York',
          country: 'USA'
        },
        hobbies: ['reading', 'coding', 'hiking'],
        active: true
      })
    })

    it('should throw error for invalid YAML', () => {
      expect(() => parseYaml('invalid: yaml: content: [')).toThrow('Invalid YAML')
    })

    it('should handle empty string', () => {
      const result = parseYaml('')
      expect(result).toBeNull()
    })

    it('should handle simple values', () => {
      expect(parseYaml('42')).toBe(42)
      expect(parseYaml('"hello"')).toBe('hello')
      expect(parseYaml('true')).toBe(true)
      expect(parseYaml('null')).toBe(null)
    })
  })

  describe('formatYaml', () => {
    it('should format YAML with proper indentation', () => {
      const unformattedYaml = 'name: John Doe\nage: 30\naddress:\n  street: 123 Main St'
      const result = formatYaml(unformattedYaml)
      expect(result).toContain('name: John Doe')
      expect(result).toContain('age: 30')
      expect(result).toContain('address:')
      expect(result).toContain('  street: 123 Main St')
    })

    it('should throw error for invalid YAML', () => {
      expect(() => formatYaml('invalid: yaml: content: [')).toThrow('Invalid YAML')
    })

    it('should handle empty string', () => {
      const result = formatYaml('')
      expect(result).toBe('null\n')
    })
  })

  describe('validateYaml', () => {
    it('should validate correct YAML', () => {
      const result = validateYaml(sampleYaml)
      expect(result).toBeDefined()
    })

    it('should throw error for invalid YAML', () => {
      expect(() => validateYaml('invalid: yaml: content: [')).toThrow('Invalid YAML')
    })

    it('should handle empty string', () => {
      const result = validateYaml('')
      expect(result).toBeNull()
    })
  })

  describe('yamlToJson', () => {
    it('should convert YAML to JSON', () => {
      const result = yamlToJson(sampleYaml)
      const parsed = JSON.parse(result)
      expect(parsed).toEqual({
        name: 'John Doe',
        age: 30,
        address: {
          street: '123 Main St',
          city: 'New York',
          country: 'USA'
        },
        hobbies: ['reading', 'coding', 'hiking'],
        active: true
      })
    })

    it('should throw error for invalid YAML', () => {
      expect(() => yamlToJson('invalid: yaml: content: [')).toThrow('Invalid YAML')
    })

    it('should handle empty YAML', () => {
      const result = yamlToJson('')
      expect(result).toBe('null')
    })
  })

  describe('jsonToYaml', () => {
    it('should convert JSON to YAML', () => {
      const result = jsonToYaml(sampleJson)
      expect(result).toContain('name: John Doe')
      expect(result).toContain('age: 30')
      expect(result).toContain('address:')
      expect(result).toContain('  street: 123 Main St')
    })

    it('should throw error for invalid JSON', () => {
      expect(() => jsonToYaml('invalid json')).toThrow('Invalid JSON')
    })

    it('should handle empty JSON', () => {
      const result = jsonToYaml('{}')
      expect(result).toBe('{}\n')
    })
  })

  describe('getYamlInfo', () => {
    it('should return correct info for valid YAML', () => {
      const result = getYamlInfo(sampleYaml)
      expect(result.isValid).toBe(true)
      expect(result.length).toBeGreaterThan(0)
      expect(result.lines).toBeGreaterThan(0)
      expect(result.parsedType).toBe('object')
      expect(result.error).toBeUndefined()
    })

    it('should return error info for invalid YAML', () => {
      const result = getYamlInfo('invalid: yaml: content: [')
      expect(result.isValid).toBe(false)
      expect(result.error).toBeDefined()
      expect(result.parsedType).toBe('unknown')
    })

    it('should detect comments', () => {
      const yamlWithComments = `# This is a comment
name: John Doe
# Another comment`
      const result = getYamlInfo(yamlWithComments)
      expect(result.hasComments).toBe(true)
    })

    it('should detect multi-line strings', () => {
      const yamlWithMultiLine = `description: |
  This is a multi-line
  string in YAML`
      const result = getYamlInfo(yamlWithMultiLine)
      expect(result.hasMultiLineStrings).toBe(true)
    })

    it('should detect references', () => {
      const yamlWithRefs = `defaults: &defaults
  timeout: 10
  retries: 3

service:
  <<: *defaults
  name: api`
      const result = getYamlInfo(yamlWithRefs)
      expect(result.hasReferences).toBe(true)
    })

    it('should handle empty string', () => {
      const result = getYamlInfo('')
      expect(result.isValid).toBe(true)
      expect(result.length).toBe(0)
      expect(result.lines).toBe(1)
    })
  })

  describe('minifyYaml', () => {
    it('should minify YAML by removing unnecessary whitespace', () => {
      const result = minifyYaml(sampleYaml)
      expect(result).toContain('name: John Doe')
      expect(result).toContain('age: 30')
    })

    it('should throw error for invalid YAML', () => {
      expect(() => minifyYaml('invalid: yaml: content: [')).toThrow('Invalid YAML')
    })

    it('should handle empty string', () => {
      const result = minifyYaml('')
      expect(result).toBe('null\n')
    })

    it('should remove comments when minifying', () => {
      const yamlWithComments = `# Comment
name: John Doe
# Another comment
age: 30`
      const result = minifyYaml(yamlWithComments)
      expect(result).not.toContain('#')
    })
  })

  describe('Edge cases', () => {
    it('should handle arrays', () => {
      const arrayYaml = '- item1\n- item2\n- item3'
      const result = parseYaml(arrayYaml)
      expect(result).toEqual(['item1', 'item2', 'item3'])
    })

    it('should handle nested arrays', () => {
      const nestedArrayYaml = `items:
  - name: item1
    value: 1
  - name: item2
    value: 2`
      const result = parseYaml(nestedArrayYaml)
      expect(result).toEqual({
        items: [
          { name: 'item1', value: 1 },
          { name: 'item2', value: 2 }
        ]
      })
    })

    it('should handle boolean values', () => {
      const boolYaml = `true_value: true
false_value: false
yes_value: yes
no_value: no`
      const result = parseYaml(boolYaml)
      expect(result).toEqual({
        true_value: true,
        false_value: false,
        yes_value: 'yes',
        no_value: 'no'
      })
    })

    it('should handle null values', () => {
      const nullYaml = `null_value: null
empty_value: ~
undefined_value:`
      const result = parseYaml(nullYaml)
      expect(result).toEqual({
        null_value: null,
        empty_value: null,
        undefined_value: null
      })
    })
  })
})
