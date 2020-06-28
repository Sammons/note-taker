import { Config } from "../config/client-config";
import { ApiToken } from "./authorization";

export class LinkShrinkClient {
  async shrink(destination: string) {
    const headers = new Headers();
    headers.set('x-token', ApiToken());
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