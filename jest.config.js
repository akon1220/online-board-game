module.exports = {
  roots: ['<rootDir>/client', '<rootDir>/server'],
  testMatch: ['**/?(*.)+(spec|test).+(ts|tsx|js)'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/client',
    '\\.(css|less|scss|sass)$': '<rootDir>/node_modules/jest-css-modules',
  },
}
