module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '\\.(css|less)$': 'identity-obj-proxy', // Mock CSS and Less modules
  },
  collectCoverage: process.env.COLLECT_COVERAGE === 'true', // Enable coverage collection based on env variable
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}', // Collect coverage from all TypeScript files in the src folder
    '!src/**/*.d.ts', // Exclude TypeScript declaration files
    '!src/**/*.test.{ts,tsx}', // Exclude test files
    '!src/**/index.{ts,tsx}', // Optionally exclude index files if needed
    '!src/interfaces/**/*', // Exclude interface files from coverage
  ],
  coverageDirectory: 'coverage', // Output directory for coverage reports
  coverageReporters: ['json', 'lcov', 'text', 'clover'], // Report formats
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
