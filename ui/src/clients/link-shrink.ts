import { Config } from "../config/client-config.js";
import { Settings } from "../components/settings.js";

export class LinkShrinkClient {
  async shrink(destination: string) {
    const headers = new Headers();
    if (Settings.state.linkShrinkApiKey) {
      headers.set('x-api-key', Settings.state.linkShrinkApiKey);
    }
    const result = await fetch(`${Config.linkShrinkDomain}`, {
      method: "POST",
      credentials: "omit",
      headers: headers,
      body: JSON.stringify({
        value: encodeURIComponent(destination)
      })
    });
    const body = await result.json() as { value: string } | { message: string };
    if (result.status == 200) {
      return 'https://sammons.io/s/' + (body as { value: string }).value;
    } else {
      throw new Error(`Failed to shrink link ${destination}: ${(body as {message: string}).message}`)
    }
  }
}