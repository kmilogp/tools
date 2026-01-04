<script setup lang="ts">
import { decodeJwt, encodeJwt, formatDecodedJwt } from '~/utils/tools/jwt'

useHead({
  title: 'JWT Tools - Programming Tools',
  meta: [
    {
      name: 'description',
      content: 'Decode and encode JWT tokens with support for signed and unsigned tokens.'
    }
  ]
})

const toast = useToast()

// Decode section
const jwtInput = ref('')
const decodedOutput = ref('')
const decodeError = ref('')

// Encode section
const headerInput = ref('{\n  "alg": "HS256",\n  "typ": "JWT"\n}')
const payloadInput = ref('{\n  "sub": "1234567890",\n  "name": "John Doe",\n  "iat": 1516239022\n}')
const secretInput = ref('')
const encodedOutput = ref('')
const encodeError = ref('')

// Decode JWT
function decodeJwtToken() {
  decodeError.value = ''
  decodedOutput.value = ''

  if (!jwtInput.value.trim()) {
    return
  }

  try {
    const decoded = decodeJwt(jwtInput.value)
    decodedOutput.value = formatDecodedJwt(decoded)
  } catch (error) {
    decodeError.value = error instanceof Error ? error.message : 'Unknown error occurred'
    decodedOutput.value = ''
  }
}

// Encode JWT
async function encodeJwtToken() {
  encodeError.value = ''
  encodedOutput.value = ''

  if (!headerInput.value.trim() || !payloadInput.value.trim()) {
    return
  }

  try {
    const header = JSON.parse(headerInput.value) as Record<string, unknown>
    const payload = JSON.parse(payloadInput.value) as Record<string, unknown>
    const secret = secretInput.value.trim() || undefined

    const jwt = await encodeJwt(header, payload, secret)
    encodedOutput.value = jwt
  } catch (error) {
    encodeError.value = error instanceof Error ? error.message : 'Unknown error occurred'
    encodedOutput.value = ''
  }
}

// Copy functions
function copyDecoded() {
  if (decodedOutput.value) {
    navigator.clipboard.writeText(decodedOutput.value)
    toast.add({
      title: 'Decoded JWT copied to clipboard',
      color: 'info'
    })
  }
}

function copyEncoded() {
  if (encodedOutput.value) {
    navigator.clipboard.writeText(encodedOutput.value)
    toast.add({
      title: 'Encoded JWT copied to clipboard',
      color: 'info'
    })
  }
}

// Clear functions
function clearDecode() {
  jwtInput.value = ''
  decodedOutput.value = ''
  decodeError.value = ''
}

function clearEncode() {
  headerInput.value = '{\n  "alg": "HS256",\n  "typ": "JWT"\n}'
  payloadInput.value = '{\n  "sub": "1234567890",\n  "name": "John Doe",\n  "iat": 1516239022\n}'
  secretInput.value = ''
  encodedOutput.value = ''
  encodeError.value = ''
}

// Watch for input changes
watch(jwtInput, () => {
  if (jwtInput.value.trim()) {
    decodeJwtToken()
  } else {
    decodedOutput.value = ''
    decodeError.value = ''
  }
})

watch([headerInput, payloadInput, secretInput], () => {
  if (headerInput.value.trim() && payloadInput.value.trim()) {
    encodeJwtToken()
  } else {
    encodedOutput.value = ''
    encodeError.value = ''
  }
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="container mx-auto p-4">
      <div class="mb-8">
        <div class="flex items-center gap-3 mb-4">
          <UIcon
            name="i-lucide-key"
            class="text-4xl text-blue-500"
          />
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
              JWT Tools
            </h1>
            <p class="text-gray-600 dark:text-gray-400">
              Decode and encode JWT tokens with support for signed and unsigned tokens
            </p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Decode JWT Section -->
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon
                name="i-lucide-unlock"
                class="w-5 h-5 text-primary-500"
              />
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                Decode JWT
              </h2>
            </div>
          </template>

          <div class="space-y-4">
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Paste a JWT token to decode its header, payload, and signature
            </p>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                JWT Token
              </label>
              <ClientOnly>
                <MonacoEditor
                  v-model="jwtInput"
                  lang="plaintext"
                  class="border rounded-lg"
                  :min-height="350"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
                />
              </ClientOnly>
            </div>

            <UAlert
              v-if="decodeError"
              color="error"
              variant="soft"
              :title="decodeError"
            />

            <div v-if="decodedOutput">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Decoded JWT
              </label>
              <ClientOnly>
                <MonacoEditor
                  :model-value="decodedOutput"
                  lang="json"
                  class="border rounded-lg"
                  :min-height="200"
                  :read-only="true"
                />
              </ClientOnly>
            </div>

            <div class="flex gap-2">
              <UButton
                :disabled="!jwtInput.trim()"
                color="primary"
                @click="decodeJwtToken"
              >
                <UIcon
                  name="i-lucide-play"
                  class="w-4 h-4 mr-2"
                />
                Decode
              </UButton>
              <UButton
                v-if="decodedOutput"
                color="info"
                variant="soft"
                @click="copyDecoded"
              >
                <UIcon
                  name="i-lucide-copy"
                  class="w-4 h-4 mr-2"
                />
                Copy
              </UButton>
              <UButton
                color="neutral"
                variant="soft"
                @click="clearDecode"
              >
                <UIcon
                  name="i-lucide-refresh-cw"
                  class="w-4 h-4 mr-2"
                />
                Clear
              </UButton>
            </div>
          </div>
        </UCard>

        <!-- Encode JWT Section -->
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon
                name="i-lucide-lock"
                class="w-5 h-5 text-success-500"
              />
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                Encode JWT
              </h2>
            </div>
          </template>

          <div class="space-y-4">
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Create a JWT token from header and payload objects
            </p>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Header (JSON)
              </label>
              <ClientOnly>
                <MonacoEditor
                  v-model="headerInput"
                  lang="json"
                  class="border rounded-lg"
                  :min-height="120"
                />
              </ClientOnly>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Payload (JSON)
              </label>
              <ClientOnly>
                <MonacoEditor
                  v-model="payloadInput"
                  lang="json"
                  class="border rounded-lg"
                  :min-height="300"
                />
              </ClientOnly>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Secret (Optional - for signing)
              </label>
              <UInput
                v-model="secretInput"
                type="password"
                placeholder="Leave empty for unsigned JWT"
                class="font-mono"
              />
            </div>

            <UAlert
              v-if="encodeError"
              color="error"
              variant="soft"
              :title="encodeError"
            />

            <div v-if="encodedOutput">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Encoded JWT
              </label>
              <ClientOnly>
                <MonacoEditor
                  :model-value="encodedOutput"
                  lang="plaintext"
                  class="border rounded-lg"
                  :min-height="150"
                  :read-only="true"
                />
              </ClientOnly>
            </div>

            <div class="flex gap-2">
              <UButton
                :disabled="!headerInput.trim() || !payloadInput.trim()"
                color="success"
                @click="encodeJwtToken"
              >
                <UIcon
                  name="i-lucide-play"
                  class="w-4 h-4 mr-2"
                />
                Encode
              </UButton>
              <UButton
                v-if="encodedOutput"
                color="info"
                variant="soft"
                @click="copyEncoded"
              >
                <UIcon
                  name="i-lucide-copy"
                  class="w-4 h-4 mr-2"
                />
                Copy
              </UButton>
              <UButton
                color="neutral"
                variant="soft"
                @click="clearEncode"
              >
                <UIcon
                  name="i-lucide-refresh-cw"
                  class="w-4 h-4 mr-2"
                />
                Clear
              </UButton>
            </div>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>
