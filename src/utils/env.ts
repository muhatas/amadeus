const API_URL_KEY = "API_URL";
const PUBLIC_API_URL_KEY = "NEXT_PUBLIC_API_URL";
const CLIENT_ID_KEY = "CLIENT_ID";
const CLIENT_SECRET_KEY = "CLIENT_SECRET";

export function getApiUrl(): string | undefined {
  return process.env[API_URL_KEY] ?? process.env[PUBLIC_API_URL_KEY];
}

export function getClientId(): string | undefined {
  return process.env[CLIENT_ID_KEY];
}

export function getClientSecret(): string | undefined {
  return process.env[CLIENT_SECRET_KEY];
}
