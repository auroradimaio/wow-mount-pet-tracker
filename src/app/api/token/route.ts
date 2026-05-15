export async function GET() {
  const clientId = process.env.WOW_CLIENT_ID ?? process.env.NEXT_PUBLIC_WOW_CLIENT_ID;
  const clientSecret = process.env.WOW_CLIENT_SECRET ?? process.env.NEXT_PUBLIC_WOW_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return Response.json({ error: "Missing API credentials" }, { status: 500 });
  }

  const response = await fetch("https://us.battle.net/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
    },
    body: new URLSearchParams({ grant_type: "client_credentials" }),
  });

  if (!response.ok) {
    return Response.json({ error: "Failed to obtain access token" }, { status: 502 });
  }

  const data = await response.json();
  return Response.json({
    access_token: data.access_token,
    expires_in: data.expires_in,
  });
}
