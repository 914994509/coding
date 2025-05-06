/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  // 可以在这里定义更多环境变量
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
} 