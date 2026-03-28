import { getApiUrl, getClientId, getClientSecret } from "@/utils/env";

type OAuthTokenResponse = {
  access_token: string;
  expires_in: number;
  token_type?: string;
};

export const getAccessToken = async (): Promise<{
  access_token: string;
  expires_in: number;
}> => {
  const apiUrl = getApiUrl();
  const clientId = getClientId();
  const clientSecret = getClientSecret();

  if (!clientId || !clientSecret) {
    throw new Error("Missing required environment variables");
  }

  const options: RequestInit = {
    method: "POST",
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
    }).toString(),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };

  const req = await fetch(`${apiUrl}/v1/security/oauth2/token`, options);

  if (!req.ok) {
    const errorText = await req.text();
    console.error("[amadeus-auth] Token request failed", {
      apiUrl,
      status: req.status,
      body: errorText.slice(0, 500),
    });
    throw new Error(`Token request failed: ${req.status}`);
  }

  const data = (await req.json()) as OAuthTokenResponse;

  return {
    access_token: data.access_token,
    expires_in: data.expires_in,
  };
};
