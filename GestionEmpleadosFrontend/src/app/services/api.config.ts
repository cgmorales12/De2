const DEFAULT_HTTP_URL = 'http://localhost:5120/api';
const DEFAULT_HTTPS_URL = 'https://localhost:7061/api';

const resolveBaseUrl = (): string => {
  if (typeof window === 'undefined') {
    return DEFAULT_HTTP_URL;
  }

  return window.location.protocol === 'https:' ? DEFAULT_HTTPS_URL : DEFAULT_HTTP_URL;
};

export const API_CONFIG = {
  baseUrl: resolveBaseUrl()
};
