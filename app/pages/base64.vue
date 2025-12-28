<script setup lang="ts">
import {
  encodeBase64,
  decodeBase64,
  encodeBase64Url,
  decodeBase64Url,
  getBase64Info
} from '~/utils/tools/base64'

useHead({
  title: 'Base64 Tools - Programming Tools',
  meta: [
    {
      name: 'description',
      content: 'Base64 encoding, decoding, validation, and URL-safe conversion tools for developers.'
    }
  ]
})

const tools = [
  {
    id: 'encoder',
    name: 'Base64 Encoder',
    description: 'Encode text to Base64 format with proper padding.',
    icon: 'i-lucide-lock',
    color: 'primary' as const,
    function: encodeBase64
  },
  {
    id: 'decoder',
    name: 'Base64 Decoder',
    description: 'Decode Base64 strings back to original text.',
    icon: 'i-lucide-unlock',
    color: 'success' as const,
    function: decodeBase64
  },
  {
    id: 'encoder-url',
    name: 'Base64 URL Encoder',
    description: 'Encode text to URL-safe Base64 format.',
    icon: 'i-lucide-link',
    color: 'warning' as const,
    function: encodeBase64Url
  },
  {
    id: 'decoder-url',
    name: 'Base64 URL Decoder',
    description: 'Decode URL-safe Base64 strings to original text.',
    icon: 'i-lucide-external-link',
    color: 'info' as const,
    function: decodeBase64Url
  },
  {
    id: 'validator',
    name: 'Base64 Validator',
    description: 'Validate and analyze Base64 strings with detailed information.',
    icon: 'i-lucide-shield-check',
    color: 'primary' as const,
    function: (input: string) => {
      const info = getBase64Info(input)
      return JSON.stringify({
        isValid: info.isValid,
        length: info.length,
        padding: info.padding,
        isUrlSafe: info.isUrlSafe,
        decodedLength: info.decodedLength,
        message: info.isValid ? 'Valid Base64 string' : 'Invalid Base64 string'
      }, null, 2)
    }
  }
]
</script>

<template>
  <ToolPageBase
    title="Base64 Tools"
    description="Encode, decode, validate, and convert data using Base64 encoding with our comprehensive set of tools."
    icon="i-lucide-shield"
    icon-color="text-green-500"
    :tools="tools"
    default-tool="encoder"
    input-language="plaintext"
    output-language="plaintext"
    input-placeholder="Enter text to encode/decode..."
    output-placeholder="Output will appear here..."
  />
</template>
