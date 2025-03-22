import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';

export default defineConfig({
    plugins: [react()],
    server: {
        port: 4000,
        https: {
            key: fs.readFileSync(path.resolve(__dirname, '../certificates/private.key')),
            cert: fs.readFileSync(path.resolve(__dirname, '../certificates/certificate.pem')),
        },
    },
});