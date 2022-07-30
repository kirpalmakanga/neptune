import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import windiPlugin from 'vite-plugin-windicss';

export default defineConfig({
    server: { port: 8080 },
    plugins: [solidPlugin(), windiPlugin()]
});
