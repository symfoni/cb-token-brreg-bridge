import { SDK } from "@brok/sdk";

export function initSDK() {
  const ceramicUrl = process.env.BROK_SDK_CERAMIC_URL;
  const ethereumRpc = process.env.BROK_SDK_ETHEREUM_RPC;
  const secret = process.env.BROK_SDK_SECRET;
  const theGraphUrl = process.env.BROK_SDK_THE_GRAPH_URL;
  const env = process.env.BROK_SDK_ENV;

  if (!ceramicUrl) {
    throw new Error("Missing BROK_SDK_CERAMIC_URL in .env")
  }
  if (!ethereumRpc) {
    throw new Error("Missing BROK_SDK_ETHEREUM_RPC in .env")
  }
  if (!secret) {
    throw new Error("Missing BROK_SDK_SECRET in .env")
  }
  if (!theGraphUrl) {
    throw new Error("Missing BROK_SDK_THE_GRAPH_URL in .env")
  }
  if (!env) {
    throw new Error("Missing BROK_SDK_ENV in .env")
  }

  return SDK.init({
		ceramicUrl: ceramicUrl,
		ethereumRpc: ethereumRpc,
		secret: secret,
		theGraphUrl: theGraphUrl,
		env: env,
	});
}