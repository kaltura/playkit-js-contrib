const config = {
  compilationOptions: {
    preferredConfigPath: './tsconfig.json',
  },
  entries: [
    {
      filePath: './src/pluginV7/index.ts',
      outFile: './dist/pluginV7.d.ts',
    },
    {
      filePath: './src/pluginV2/index.ts',
      outFile: './dist/pluginV2.d.ts',
    },
    {
      filePath: './src/shared/index.ts',
      outFile: './dist/shared.d.ts',
    },
  ],

};

module.exports = config;
