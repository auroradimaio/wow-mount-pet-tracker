// utils/fetchAccessToken.ts
export const fetchAccessToken = async () => {
  const clientId = process.env.NEXT_PUBLIC_WOW_CLIENT_ID;
  const clientSecret = process.env.NEXT_PUBLIC_WOW_CLIENT_SECRET;

  const response = await fetch("https://us.battle.net/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(
        `${clientId}:${clientSecret}`
      ).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
    }),
  });

  const data = await response.json();
  return data.access_token;
};
