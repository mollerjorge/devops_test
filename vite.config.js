import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    coverage: {
      reporter: ['text', 'json-summary', 'json'],
      reportOnFailure: true, // Generate coverage reports even if tests fail
      include: ['src/**/*.{js,jsx,ts,tsx}'],
      exclude: [
        'src/index.js',                    // Entry point
        'src/App.js',                      // Main app component
        'src/setupTests.js',               // Test setup file
        'src/reportWebVitals.js',          // React utility
        'src/**/*.test.{js,jsx,ts,tsx}',   // Test files
        'src/**/*.spec.{js,jsx,ts,tsx}',   // Spec files
        'scripts/**/*',                    // Utility scripts
        '**/*.config.{js,ts}',             // Config files
        '**/node_modules/**',              // Dependencies
        '**/*.d.ts'                        // Type definitions
      ],
      thresholds: {
        lines: 70,
        branches: 70,
        functions: 70,
        statements: 70
      }
    }
  }
}); 