import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import glslify from 'rollup-plugin-glslify'
// import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), glslify()],
    root: 'src/',
    publicDir: '../public/',
    base: './',
    server: {
        host: true,
    },
    build: {
        outDir: '../dist',
        emptyOutDir: true,
        sourcemap: true,
    },
})
