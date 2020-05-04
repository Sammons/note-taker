import { Config } from "../config/client-config.js";
import { Settings } from "../components/settings.js";

export class NotesClient {
  async save(note: string, name: string) {
    const headers = new Headers();
    if (Settings.state.linkShrinkApiKey) {
      headers.set('x-api-key', Settings.state.linkShrinkApiKey);
    }
    const result = await fetch(`${Config.notesDomain}/notes`, {
      method: "POST",
      credentials: "omit",
      headers: headers
    });
    const body = await result.json() as { value: string } | { message: string };
    if (result.status == 200) {
      return;
    } else {
      throw new Error(`Failed to save note ${name}`);
    }
  }

  async get(name: string) {
    const headers = new Headers();
    if (Settings.state.linkShrinkApiKey) {
      headers.set('x-api-key', Settings.state.linkShrinkApiKey);
    }
    const result = await fetch(`${Config.notesDomain}/notes/${name}`, {
      method: "GET",
      credentials: "omit",
      headers: headers
    });
    const body = await result.json() as {
      value?: {
        values: { value: string; timestamp: string }[];
        createdAt: string;
        name: string;
      }
    }
    if (result.status == 200) {
      return body.value?.values.pop();
    } else {
      throw new Error(`Failed to save note ${name}`);
    }
  }
}