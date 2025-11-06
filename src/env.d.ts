
// Provide a local declaration for the Vite `import.meta.env` shape so the
// TypeScript server does not need to resolve `vite/client` package types.
declare module 'vite/client' {
  interface ImportMetaEnv {
    readonly VITE_FIREBASE_API_KEY?: string;
    readonly VITE_FIREBASE_AUTH_DOMAIN?: string;
    readonly VITE_FIREBASE_PROJECT_ID?: string;
    readonly VITE_FIREBASE_STORAGE_BUCKET?: string;
    readonly VITE_FIREBASE_MESSAGING_SENDER_ID?: string;
    readonly VITE_FIREBASE_APP_ID?: string;
    readonly VITE_BACKOFFICE_API_URL?: string;
    readonly VITE_API_BASE_URL?: string;
    readonly VITE_TEMPLATE_API_URL?: string;
    readonly VITE_AI_API_URL?: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}
