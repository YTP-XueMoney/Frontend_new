import { defineConfig } from 'vite';
import monacoEditorEsmPlugin from 'vite-plugin-monaco-editor-esm';

export default defineConfig({
  plugins: [monacoEditorEsmPlugin()],
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
  build: {
    minify: false, // 不壓縮，避免函數名變更
    rollupOptions: {
      treeshake: false, // ✅ 關閉 Tree Shaking，保留所有函數
    },
    terserOptions: {
      keep_fnames: true,
      keep_classnames: true,
    }
  }
});
