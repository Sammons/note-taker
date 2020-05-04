import { Config } from "../config/client-config.js";

export class NotesClient {
  constructor(private apiKey?: string) {}

  async save(note: string, name: string) {
    const result = await fetch(`${Config.notesDomain}/notes`, {
      method: "POST",
      credentials: "omit",
      headers: {
        'x-api-key': this.apiKey
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