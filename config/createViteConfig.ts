import react from '@vitejs/plugin-react';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootPath = resolve(__dirname, '..');
const commonsPath = resolve(rootPath, 'commons');

export default function createViteConfig() {
  return defineConfig({
    plugins: [
      react({
        babel: {
          plugins: [['babel-plugin-react-compiler']],
        },
      }),
    ],
    base: './',
    build: {
      outDir: 'out',
      copyPublicDir: false,
      assetsDir: 'assets',
    },
    publicDir: resolve(rootPath, 'public'),
    resolve: {
      alias: {
        '@components': resolve(commonsPath, 'components'),
        '@constants': resolve(commonsPath, 'constants'),
        '@hooks': resolve(commonsPath, 'hooks'),
        '@package': resolve(rootPath, 'package.json'),
        '@types': resolve(commonsPath, 'types'),
        '@utils': resolve(commonsPath, 'utils'),
      },
    },
  });
}
