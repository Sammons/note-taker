import { Config } from "../config/client-config.js";
import { Settings } from "../components/settings.js";

export class LinkShrinkClient {
  async shrink(destination: string) {
    const result = await fetch(`${Config.linkShrinkDomain}/${destination}`, {
      method: "POST",
      credentials: "omit",
      headers: {
        'x-api-key': Settings.state.linkShrinkApiKey
      }
    });
    const body = await result.json() as { value: string } | { message: string };
    if (result.status == 200) {
      return 'https://sammons.io/s/' + (body as { value: string }).value;
    } else {
      throw new Error(`Failed to shrink link ${destination}: ${(body as {message: string}).message}`)
    }
  }
}