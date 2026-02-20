import { configureReact } from '@bn-digital/vite';
import visualizer from 'rollup-plugin-visualizer';

function manualChunkFn(id: string): string | null {
  if (id.includes('lodash')) {
    return 'lodash';
  }
  return null;
}

export default configureReact(
  {
    server: { hmr: { overlay: true } },
    build: {
      rollupOptions: {
        output: {
          manualChunks: manualChunkFn,
        },
      },
    },
    plugins: [visualizer({ open: true }) as any],
  },
  {
    openGraph: { enabled: false },
    pwa: { enabled: false },
    buildInfo: { enabled: false },
    react: { svg: { enabled: true } },
    lint: { enabled: true, stylelint: false, enableBuild: true },
    analytics: { enableDev: true },
    fonts: {
      google: {
        preconnect: true,
        families: [
          {
            name: 'Inter',
            styles: 'wght@400;500;600;700;800;900',
            defer: true,
          },
          {
            name: 'Jost',
            styles: 'wght@400;500;600;700;800;900',
            defer: true,
          },
        ],
        display: 'auto',
      },
    },
  },
);
