import { Config } from "../config/client-config.js";
import { Settings } from "../components/settings.js";

export class NotesClient {
  async save(note: any, name: string) {
    const headers = new Headers();
    if (Settings.state.notesApiKey) {
      headers.set('x-api-key', Settings.state.notesApiKey);
    }
    const result = await fetch(`${Config.notesDomain}/notes`, {
      method: "POST",
      credentials: "omit",
      headers: headers,
      body: JSON.stringify({
        name: encodeURIComponent(name), note
      })
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
    if (Settings.state.notesApiKey) {
      headers.set('x-api-key', Settings.state.notesApiKey);
    }
    const result = await fetch(`${Config.notesDomain}/notes/${encodeURIComponent(name)}`, {
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
      const lastResult = body.value?.values.pop()
      if (lastResult) {
        return JSON.parse(lastResult.value)?.text
      }
    } 
    return null;
  }
}