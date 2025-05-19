// /* eslint-disable */
// import { readFileSync } from 'fs';

// // Reading the SWC compilation config for the spec files
// const swcJestConfig = JSON.parse(
//   readFileSync(`${__dirname}/.spec.swcrc`, 'utf-8')
// );

// // Disable .swcrc look-up by SWC core because we're passing in swcJestConfig ourselves
// swcJestConfig.swcrc = false;

// export default {
//   displayName: '@schedula-monorepo/web-api',
//   preset: '../jest.preset.js',
//   testEnvironment: 'node',
//   transform: {
//     '^.+\\.[tj]s$': ['@swc/jest', swcJestConfig]
//   },
//   moduleFileExtensions: ['ts', 'js', 'html'],
//   coverageDirectory: 'test-output/jest/coverage'
// };




/* eslint-disable */
const { readFileSync } = require('fs');
const stripJsonComments = require('strip-json-comments');

// Reading the SWC compilation config for the spec files, removing comments first
const rawConfig = readFileSync(`${__dirname}/.spec.swcrc`, 'utf-8');
const swcJestConfig = JSON.parse(stripJsonComments(rawConfig));

// Disable .swcrc look-up by SWC core because we're passing in swcJestConfig ourselves
swcJestConfig.swcrc = false;

/** @type {import('jest').Config} */
module.exports = {
  displayName: '@schedula-monorepo/web-api',
  preset: '../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['@swc/jest', swcJestConfig],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: 'test-output/jest/coverage',
};

