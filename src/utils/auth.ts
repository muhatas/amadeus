type OAuthTokenResponse = {
  access_token: string;
  expires_in: number;
  token_type?: string;
};

const { API_URL, CLIENT_ID, CLIENT_SECRET } = process.env;

if (!API_URL || !CLIENT_ID || !CLIENT_SECRET) {
  throw new Error("Missing required environment variables");
}

export const getAccessToken = async (): Promise<{
  access_token: string;
  expires_in: number;
}> => {
  const options: RequestInit = {
    method: "POST",
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    }).toString(),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };

  const req = await fetch(`${API_URL}/v1/security/oauth2/token`, options);

  if (!req.ok) {
    throw new Error(`Token request failed: ${req.status}`);
  }

  const data = (await req.json()) as OAuthTokenResponse;

  return {
    access_token: data.access_token,
    expires_in: data.expires_in,
  };
};
