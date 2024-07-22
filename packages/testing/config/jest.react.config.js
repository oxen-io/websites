/* eslint-disable no-undef */
/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  ...require('./jest.base.config'),
  testEnvironment: 'jsdom',
};
