const CLIENT_ID_KEY = "CLIENT_ID";
const CLIENT_SECRET_KEY = "CLIENT_SECRET";
const AMADEUS_ENVIRONMENT_KEY = "AMADEUS_ENVIRONMENT";

const AMADEUS_API_URL_PARTS = {
  production: ["https", "://", "api", ".", "amadeus", ".com"],
  test: ["https", "://", "test", ".", "api", ".", "amadeus", ".com"],
} as const;

function buildApiUrl(parts: readonly string[]): string {
  return parts.join("");
}

export function getApiUrl(): string {
  const environment = process.env[AMADEUS_ENVIRONMENT_KEY]?.toLowerCase();

  if (environment === "production") {
    return buildApiUrl(AMADEUS_API_URL_PARTS.production);
  }

  return buildApiUrl(AMADEUS_API_URL_PARTS.test);
}

export function getClientId(): string | undefined {
  return process.env[CLIENT_ID_KEY];
}

export function getClientSecret(): string | undefined {
  return process.env[CLIENT_SECRET_KEY];
}
