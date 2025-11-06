/// <reference types="vite/client" />

// Optional: narrow the environment shape used in the app below.
// Add other VITE_ variables as needed to improve editor/type checking.
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
