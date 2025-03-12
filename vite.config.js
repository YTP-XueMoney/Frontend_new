import { defineConfig } from 'vite';
import monacoEditorEsmPlugin from 'vite-plugin-monaco-editor-esm';

export default defineConfig({
  base: '/preview/',
  plugins: [monacoEditorEsmPlugin()],
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
  build: {
    minify: false, // ❌ 不壓縮，確保 `eval()` 可讀
    sourcemap: true, // ✅ 讓 `eval()` 內部錯誤顯示正確的行號
    rollupOptions: {
      treeshake: false, // ✅ 禁用 Tree Shaking，防止未使用函數被刪除
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor'; // ✅ 把依賴拆成 `vendor.js`
          }
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'worker.js') {
            return 'assets/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        }
        // ❌ 移除 `inlineDynamicImports: true`
      },
    },
    terserOptions: {
      keep_fnames: true, // ✅ 保持函數名稱
      keep_classnames: true, // ✅ 保持類名稱
      mangle: {
        properties: {
          regex: /^_/, // ✅ 避免 `_val` 這類變數被壓縮
          keep_quoted: true, // ✅ 保持帶引號的屬性不變
        },
      },
    },
  },
});
