# The project

This is a website full of tools for daily usage in programming world. Such tools are useful for several tasks such as:

**JSON**
- [x] JSON formatting
- [x] JSON escaping
- [x] JSON unescaping
- [x] JSON minification

**Base64**
- [x] Base64 encoding
- [x] Base64 decoding
- [x] Base64 URL encoding
- [x] Base64 URL decoding
- [x] Base64 validation and analysis

**YAML**
- [x] YAML parsing
- [x] YAML formatting
- [x] YAML validation
- [x] YAML to JSON conversion
- [x] JSON to YAML conversion

**CSV**
- [x] CSV validation
- [x] CSV to JSON conversion
- [x] JSON to CSV conversion
- [x] CSV to YAML conversion
- [x] YAML to CSV conversion
- [x] CSV formatting
- [x] CSV analysis

**Timestamp**
- [x] Timestamp generation
- [x] Timestamp conversion
- [x] Timestamp translation

**Table**
- [x] Table generation from JSON
- [x] Table generation from CSV
- [x] Table generation from YAML

**JWT**
- [x] JWT decoding
- [x] JWT encoding

## Tools of the repository
- Repository is mainly based on Nuxt 4, TypeScript and Vue 3. Most of the tools will be written in TypeScript.
- For running the project you will use Bun.

## How to develop a new tool
- All the tools will be grouped by a category such as JSON, Base64, Timestamp, YAML, CSV, Table.
- Each category will have it's own page in the website.
- Every time a tool is developed, it needs to be tested. For testing we will use Nuxt Test Utils.
- When the development of a tool is finished it needs to be marked as completed in the AGENTS.md file.
- Nuxt ui already has tailwindcss installed, so you do not need to install it again.
- The tools functionality is located in the app/utils/tools folder. There is a file for each tool category.

## How to check if the website is functional
- Use the browser mcp to check if the website is functional.
- If there is not any other dev server running, use it and do not start a new one.
- For checking if the website is functional, always check against the project development url usually it is http://localhost:3000.

## Website layout
- The website will have a sidebar with the categories of the tools.
- Each category will use a Link component from Nuxt UI, and it will be used to navigate to the category page.

## Code rules
- Do not use error negation comments like // @ts-ignore or // @ts-expect-error unless you are allowed to do so.
- Always try to use the components from the Nuxt UI library.
- You must avoid to install any other library unless it is absolutely necessary. You will always ask for permission before installing any library.
- For colors use the colors from the Nuxt UI library (primary, secondary, success, warning, error, info).
