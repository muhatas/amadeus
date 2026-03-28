type OAuthTokenResponse = {
  access_token: string;
  expires_in: number;
  token_type?: string;
};

export const getAccessToken = async (): Promise<{
  access_token: string;
  expires_in: number;
}> => {
  const apiUrl = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;

  if (!apiUrl || !clientId || !clientSecret) {
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
    throw new Error(`Token request failed: ${req.status}`);
  }

  const data = (await req.json()) as OAuthTokenResponse;

  return {
    access_token: data.access_token,
    expires_in: data.expires_in,
  };
};
