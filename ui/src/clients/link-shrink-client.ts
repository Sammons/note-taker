import { Config } from "../config/client-config";
import { Settings, SettingsState } from "../components/settings";

export class LinkShrinkClient {
  async shrink(destination: string) {
    const headers = new Headers();
    if (SettingsState.stored.linkShrinkApiKey) {
      headers.set('x-api-key', SettingsState.stored.linkShrinkApiKey);
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
      return 'https://link.sammons.io/s/' + (body as { value: string }).value;
    } else {
      throw new Error(`Failed to shrink link ${destination}: ${(body as {message: string}).message}`)
    }
  }
}