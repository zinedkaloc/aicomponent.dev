import { createClient } from "altogic";

const clientKey = process.env.NEXT_PUBLIC_ALTOGIC_CLIENT_KEY;
const apiBaseURL = process.env.NEXT_PUBLIC_ALTOGIC_API_BASE_URL;

if (!clientKey || !apiBaseURL) {
  throw new Error(
    "Please define the NEXT_PUBLIC_ALTOGIC_CLIENT_KEY and NEXT_PUBLIC_ALTOGIC_API_BASE_URL environment variables inside .env file",
  );
}

const altogic = createClient(apiBaseURL, clientKey, {
  signInRedirect: "/",
});

const realTimeToken = process.env.NEXT_PUBLIC_REALTIME_TOKEN;

if (!realTimeToken) {
  throw new Error(
    "Please define the NEXT_PUBLIC_REALTIME_TOKEN environment variable inside .env file",
  );
}

const altogicClient = createClient(apiBaseURL, realTimeToken);

export const realtime = altogicClient.realtime;

export default altogic;
