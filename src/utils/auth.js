const { API_URL, CLIENT_ID, CLIENT_SECRET } = process.env;

export const getAccessToken = async () => {
  const options = {
    method: "POST",
    body: `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };

  const req = await fetch(`${API_URL}/v1/security/oauth2/token`, options);
  const { access_token, expires_in } = await req.json();

  return { access_token, expires_in };
};
