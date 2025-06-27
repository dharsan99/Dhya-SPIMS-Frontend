import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      // '@': path.resolve(path.dirname(new URL(import.meta.url).pathname), 'src'), // ✅ alias to match "@/..." imports
    },
  },
  build: {
    // Enable code splitting for better performance
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks for better caching
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@headlessui/react', '@heroicons/react', 'lucide-react'],
          'three-vendor': ['@react-three/fiber', '@react-three/drei', 'three'],
          'tiptap-vendor': [
            '@tiptap/react',
            '@tiptap/starter-kit',
            '@tiptap/extension-bold',
            '@tiptap/extension-italic',
            '@tiptap/extension-underline',
            '@tiptap/extension-highlight',
            '@tiptap/extension-link',
            '@tiptap/extension-image',
            '@tiptap/extension-table',
            '@tiptap/extension-table-cell',
            '@tiptap/extension-table-header',
            '@tiptap/extension-table-row',
            '@tiptap/extension-task-item',
            '@tiptap/extension-task-list',
            '@tiptap/extension-text-align',
            '@tiptap/extension-typography',
            '@tiptap/extension-subscript',
            '@tiptap/extension-superscript',
            '@tiptap/extension-placeholder'
          ],
          'utils-vendor': ['date-fns', 'uuid', 'zod', 'zustand'],
          'pdf-vendor': ['jspdf', 'jspdf-autotable', 'pdfjs-dist'],
          'chart-vendor': ['recharts', 'react-countup'],
          'form-vendor': ['react-select', 'react-quill-new'],
          'animation-vendor': ['framer-motion', 'aos'],
          'toast-vendor': ['react-hot-toast'],
        },
      },
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    // Enable source maps for debugging (disable in production)
    sourcemap: false,
    // Minify CSS
    cssMinify: true,
    // Target modern browsers for better performance
    target: 'esnext',
  },
  optimizeDeps: {
    // Pre-bundle heavy dependencies
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
      'framer-motion',
      '@react-three/fiber',
      '@react-three/drei',
      'three',
    ],
    // Exclude heavy dependencies that should be loaded on demand
    exclude: [
      'jspdf',
      'jspdf-autotable',
      'pdfjs-dist',
      'tesseract.js',
      'html2canvas',
      'react-hot-toast',
      'aos',
    ],
  },
})