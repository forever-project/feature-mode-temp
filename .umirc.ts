import { defineConfig } from '@umijs/max';

import routes from './src/routes';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: 'feature-mode-temp',
  },
  routes,
  npmClient: 'pnpm',
});
