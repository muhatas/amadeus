const CLIENT_ID_KEY = "CLIENT_ID";
const CLIENT_SECRET_KEY = "CLIENT_SECRET";
const AMADEUS_ENVIRONMENT_KEY = "AMADEUS_ENVIRONMENT";

const AMADEUS_API_URLS = {
  production: "https://api.amadeus.com",
  test: "https://test.api.amadeus.com",
} as const;

export function getApiUrl(): string {
  const environment = process.env[AMADEUS_ENVIRONMENT_KEY]?.toLowerCase();

  if (environment === "production") {
    return AMADEUS_API_URLS.production;
  }

  return AMADEUS_API_URLS.test;
}

export function getClientId(): string | undefined {
  return process.env[CLIENT_ID_KEY];
}

export function getClientSecret(): string | undefined {
  return process.env[CLIENT_SECRET_KEY];
}
