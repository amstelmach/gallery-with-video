/** @type {import('jest').Config} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jest-environment-jsdom',
    globals: {
      'ts-jest': {
        tsconfig: 'tsconfig.jest.json'
      }
    },
    moduleFileExtensions: ['ts', 'js', 'json'],
    testMatch: ['**/tests/**/*.test.ts', '**/tests/**/*.test.js'],
    transform: {
      '^.+\\.ts$': 'ts-jest'
    },
  };
  