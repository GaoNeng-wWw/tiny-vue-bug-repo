import { defineConfig } from '@farmfe/core';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  vitePlugins: [
    vue(),
  ],
  compilation: {
    define: {
      'process.env': {...process.env}
    }
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
          if(params.moduleId.endsWith('css')) {
            return {
              content: params.content.replace(/(.[^;])\}/gm, '$1;}'),
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
