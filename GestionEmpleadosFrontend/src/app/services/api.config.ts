const DEFAULT_HTTP_URL = 'http://localhost:5120/api';
const DEFAULT_HTTPS_URL = 'https://localhost:7061/api';
const STORAGE_KEY = 'gestionEmpleados.apiBaseUrl';

const AVAILABLE_URLS = [
  { label: 'HTTP (puerto 5120)', url: DEFAULT_HTTP_URL },
  { label: 'HTTPS (puerto 7061)', url: DEFAULT_HTTPS_URL }
];

const resolveBaseUrl = (): string => {
  if (typeof window === 'undefined') {
    return DEFAULT_HTTP_URL;
  }

  const storedValue = window.localStorage.getItem(STORAGE_KEY);
  if (storedValue) {
    return storedValue;
  }

  if (window.location.protocol === 'https:' || window.location.hostname === 'localhost') {
    return DEFAULT_HTTPS_URL;
  }

  return DEFAULT_HTTP_URL;
};

let currentBaseUrl = resolveBaseUrl();

export const getApiBaseUrl = (): string => currentBaseUrl;

export const setApiBaseUrl = (url: string): void => {
  currentBaseUrl = url;

  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORAGE_KEY, url);
  }
};

export const clearStoredApiBaseUrl = (): void => {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(STORAGE_KEY);
  }

  currentBaseUrl = resolveBaseUrl();
};

export const API_CONFIG = {
  get baseUrl(): string {
    return getApiBaseUrl();
  },
  setBaseUrl: setApiBaseUrl,
  clearStoredBaseUrl: clearStoredApiBaseUrl,
  availableUrls: AVAILABLE_URLS
};
