export const NETWORK = import.meta.env.VITE_APP_NETWORK ?? "testnet";
export const MODULE_ADDRESS = "0xaf12ecd9cf6578db88443a384a2d028e67ecda31cf0f441072d22201da3c0072";
export const CREATOR_ADDRESS = import.meta.env.VITE_COLLECTION_CREATOR_ADDRESS;
export const COLLECTION_ADDRESS = import.meta.env.VITE_COLLECTION_ADDRESS;
export const IS_DEV = Boolean(import.meta.env.DEV);
export const IS_PROD = Boolean(import.meta.env.PROD);
