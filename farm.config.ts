import { defineConfig, loadEnv } from '@farmfe/core';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

const proxyConfig = {
  [loadEnv('', process.cwd()).VITE_BASE_API]: {
    target: loadEnv('', process.cwd()).VITE_SERVER_HOST,
    changeOrigin: true,
    logLevel: 'debug',
    rewrite: (path: string) =>
      path.replace(
        new RegExp(`${loadEnv('', process.cwd()).VITE_BASE_API}`),
        ''
      ),
  },
  [loadEnv('', process.cwd()).VITE_MOCK_SERVER_HOST]: {
    target: loadEnv('', process.cwd()).VITE_MOCK_HOST,
    changeOrigin: true,
    rewrite: (path:string) => path.replace(/^\/mock/, '')
  }
};

export default defineConfig({
  vitePlugins: [
    vue(),
  ],
  server: {
    proxy: {
      ...proxyConfig
    },
  },
  compilation: {
    output:{
      path: 'dist',
      filename: 'assets/[name].[hash].[ext]',
      assetsFilename: 'static/[resourceName].[ext]'
    },
    define: {
      'process.env': {...process.env},
      BUILD_TOOLS: "'VITE'"
    },
    resolve: {
      alias: {
        '@/': resolve(__dirname, './src'),
        'assets': resolve(__dirname, './src/asstes'),
        'vue-i18n': 'vue-i18n/dist/vue-i18n.esm-bundler.js',
        'vue': 'vue/dist/vue.esm-bundler.js'
      },
      extensions: ['.ts', '.js']
    },
    css: {
      _viteCssOptions: {
        preprocessorOptions: {
          less: {
            modifyVars: {
              hack: `true; @import (reference) "${resolve(
                'src/assets/style/breakpoint.less'
              )}";`,
            },
            javascriptEnabled: true,
          },
        },
      }
    },
  },
  plugins: [
    {
      name: 'unmini',
      priority: 0,
      transform: {
        filters: {
          resolvedPaths: ['']
        },
        executor(params) {
          if(params.moduleId.endsWith('css') && params.moduleId.includes('@opentiny')) {
            return {
              content: params.content.replace(/(.*?[^;])\s*}/gm, '$1;'),
            }
          }
          return {
            ...params
          }
        },
      }
    }
  ]
});
