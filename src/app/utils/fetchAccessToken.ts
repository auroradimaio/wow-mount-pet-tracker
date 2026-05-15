let cachedToken: string | null = null;
let tokenExpiry = 0;

export const fetchAccessToken = async (): Promise<string> => {
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  const response = await fetch("/api/token");
  if (!response.ok) {
    throw new Error("Failed to fetch access token");
  }

  const data = await response.json();
  if (!data.access_token) {
    throw new Error(data.error ?? "Invalid token response");
  }

  cachedToken = data.access_token;
  tokenExpiry = Date.now() + (data.expires_in - 60) * 1000;

  return data.access_token as string;
};
