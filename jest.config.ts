import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',

  rootDir: 'src',
  testMatch: ['**/tests/**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  clearMocks: true,

  // Where to put coverage reports
  coverageDirectory: '../coverage',

  // What to measure coverage on
  collectCoverageFrom: [
    '**/*.{ts,js}',   // all TS/JS in src
    '!tests/**',      // ignore test files
    '!**/*.d.ts',     // ignore type declarations
    '!generated/**',  // ignore generated prisma stuff
  ],

  // Extra ignore filters (paths)
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/generated/prisma/',
    '/generated/prisma/internal/',
    '/generated/prisma/runtime/',
  ],

  // ✅ Coverage thresholds – Jest will fail if these aren’t met
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 60,
      lines: 70,
      statements: 70,
    },
  },
};

export default config;
