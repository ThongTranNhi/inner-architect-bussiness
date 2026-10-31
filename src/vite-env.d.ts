/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL Zalo chung đã được chủ thương hiệu duyệt (https://zalo.me/...). */
  readonly VITE_CONTACT_ZALO_URL?: string
  /** URL Facebook/Messenger chung đã được duyệt (https://facebook.com/... hoặc https://m.me/...). */
  readonly VITE_CONTACT_FACEBOOK_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
