const config = {
  compilationOptions: {
    preferredConfigPath: './tsconfig.json',
  },
  entries: [
    {
      filePath: './src/plugin-v7/index.ts',
      outFile: './dist/plugin-v7.d.ts',
    },
    {
      filePath: './src/plugin-v2/index.ts',
      outFile: './dist/plugin-v2.d.ts',
    },
    {
      filePath: './src/shared/index.ts',
      outFile: './dist/shared.d.ts',
    },
  ],

};

module.exports = config;
