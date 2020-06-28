import { Config } from "../config/client-config";
import { Settings, SettingsState } from "../components/settings";

export class NotesClient {
  async save(note: any, name: string) {
    const headers = new Headers();
    if (SettingsState.stored.notesApiKey) {
      headers.set('x-api-key', SettingsState.stored.notesApiKey);
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

  async get<T=string>(name: string): Promise<T | null> {
    const headers = new Headers();
    if (SettingsState.stored.notesApiKey) {
      headers.set('x-api-key', SettingsState.stored.notesApiKey);
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
    if (result.status >= 200 && result.status < 300) {
      const lastResult = body.value?.values.slice(-1)[0]
      if (lastResult != null) {
        return JSON.parse(lastResult.value) as T;
      }
    } 
    return null;
  }
}