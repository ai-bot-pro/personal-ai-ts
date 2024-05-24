export const testEnvironment = 'miniflare';
export const testMatch = ['**/test/**/*.+(ts|tsx|js)', '**/src/**/(*.)+(spec|test).+(ts|tsx|js)'];
export const transform = {
  '^.+\\.(ts|tsx|js)$': 'esbuild-jest',
};
