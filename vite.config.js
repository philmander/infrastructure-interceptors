import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: [],
    includeSource: ['src/**/*.ts'],
    include: ['src/**/*.test.ts'],
    envDir: '../',
    outputTruncateLength: 300,
  }
})
