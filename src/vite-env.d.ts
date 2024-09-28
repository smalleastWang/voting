/// <reference types="vite/client" />


interface ImportMetaEnv {
  readonly VOTING_APP_TITLE: string
  VOTING_PORT: number
  VOTING_BASE: string
  VOTING_VOTING_ADDRESS: string
  VOTING_API_DOMAIN: string
  VOTING_IMG_DOMAIN: string
  VOTING_API_KEY: string
  VOTING_API_SECRET: string
  VOTING_JWT: string
  VOTING_COS_SECRETID: string
  VOTING_COS_SECRETKEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}