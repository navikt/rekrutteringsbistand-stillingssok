import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import svgrPlugin from 'vite-plugin-svgr';

const config = defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');

    return {
        server: {
            port: 3004,
            proxy: {
                '/stillingssok-proxy': {
                    changeOrigin: true,
                    target: `${env.OPEN_SEARCH_URI}`,
                    rewrite: (path) => path.replace('/stillingssok-proxy', ''),
                    auth: `${env.OPEN_SEARCH_USERNAME}:${env.OPEN_SEARCH_PASSWORD}`,
                },
            },
        },
        build: {
            sourcemap: true,
            copyPublicDir: false,
            manifest: 'asset-manifest.json',
            chunkSizeWarningLimit: 1000,
        },
        plugins: [react(), svgrPlugin()],
    };
});

export default config;
