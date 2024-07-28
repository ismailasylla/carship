module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '\\.(css|less)$': 'identity-obj-proxy',
  },
  collectCoverage: true, // Enable coverage collection
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}', // Collect coverage from all TypeScript files in the src folder
    '!src/**/*.d.ts', // Exclude TypeScript declaration files
    '!src/**/*.test.{ts,tsx}', // Exclude test files
  ],
  coverageDirectory: 'coverage', // Output directory for coverage reports
  coverageReporters: ['json', 'lcov', 'text', 'clover'], // Report formats
};
