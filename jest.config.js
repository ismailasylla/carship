module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '\\.(css|less)$': 'identity-obj-proxy', // Mock CSS and Less modules
  },
  collectCoverage: true, // Enable coverage collection
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}', // Collect coverage from all TypeScript files in the src folder
    '!src/**/*.d.ts', // Exclude TypeScript declaration files
    '!src/**/*.test.{ts,tsx}', // Exclude test files
    '!src/**/index.{ts,tsx}', // Optionally exclude index files if needed
    '!src/interfaces/**/*', // Exclude interface files from coverage
  ],
  coverageDirectory: 'coverage', // Output directory for coverage reports
  coverageReporters: ['json', 'lcov', 'text', 'clover'], // Report formats
};
