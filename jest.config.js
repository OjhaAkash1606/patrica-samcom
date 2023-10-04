module.exports = {
  preset: 'ts-jest',
  rootDir: 'src',
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.test.tsx?$',
  moduleFileExtensions: ['tsx', 'js', 'json', 'node', 'ts'],
  clearMocks: true,
  verbose: true,
  moduleDirectories: [
    'src',
    'node_modules',
    '<rootDir>/components/',
    '<rootDir>/assets/',
  ],
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    url: 'http://localhost/',
  },
  testURL: 'http://localhost/',
  testPathIgnorePatterns: ['./node_modules/'],
  setupFiles: ['<rootDir>/__tests__/preRunScripts.jsx'],
  transformIgnorePatterns: ['/node_modules/(?!(vest|@hookform/resolvers/yup))'],
  moduleNameMapper: {
    '\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__tests__/mock.js',
    '\\.(css|less)$': '<rootDir>/__tests__/mock.js',
    '\\.(svg)$': '<rootDir>/__tests__/svgMock.tsx',
  },
  testTimeout: 20000,
};
