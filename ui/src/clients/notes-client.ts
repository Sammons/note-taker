import { Config } from "../config/client-config";
import { ApiToken } from "./authorization";

export class NotesClient {
  async save(note: any, name: string) {
    const headers = new Headers();
    headers.set('x-token', ApiToken());
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

  async get<T = string>(name: string): Promise<T | null> {
    const headers = new Headers();
    headers.set('x-token', ApiToken());
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

  async recents() {
    const headers = new Headers();
    headers.set('x-token', ApiToken());
    const result = await fetch(`${Config.notesDomain}/notes/recent-notes`, {
      method: "GET",
      credentials: "omit",
      headers: headers
    });
    const body = await result.json() as {
      value: {
        values: { value: string; timestamp: string }[];
        createdAt: string;
        name: string;
        lastUpdatedBy: string;
        lastUpdatedAt: number;
      }[]
    }
    if (result.status >= 200 && result.status < 300) {
      return body.value.map(el => {
        const rawName = decodeURIComponent(el.name);
        const type = rawName.startsWith('list-') ? 'list' : 'md';
        return {
          name: type === 'list' ? rawName.slice('list-'.length) : rawName.slice('md-'.length),
          type,
          lastUpdatedAt: el.lastUpdatedAt,
          lastUpdatedBy: el.lastUpdatedBy,
          value: JSON.parse(el.values[0].value),
        }
      });
    }
    console.log('failed to fetch recents');
    return [];
  }
}