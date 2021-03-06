import {observable, set, action, computed} from 'mobx';
import { NotesClient } from './notes-client';
import { LoadingBar, LoadingBarState } from '../components/loading-bar';
import { LinkShrinkClient } from './link-shrink-client';


class _Notes {
  private client = new NotesClient();
  private links = new LinkShrinkClient();
  private inProgress = {} as { [key: string]: boolean};
  private state = observable<{[key: string]: {timestamp: number, value: any}}>({})
  
  @action
  private start(key: string, deferable: () => Promise<any>): void {
    if (!this.inProgress[key]) {
      this.inProgress[key] = true;
      LoadingBarState.transient.enqueue(async() => {
        await deferable()
        .then(v => {
          this.state[key] = { timestamp: Date.now(), value: v };
        }).catch(e => {
          console.log('Failed to process', key);
        }).finally(() => {
          this.inProgress[key] = false
        })
      })
    }
  }
  private getIfRecentOrLoad<T = {}>(key: string, howRecent: number|null, deferable: () => Promise<any>) {
    if (this.state[key] === undefined) {
      set(this.state, {[key]: null})
    }
    if (this.state[key] && (howRecent == null || ((Date.now() - this.state[key].timestamp) < howRecent))) {
      return this.state[key].value as T;
    }
    this.start(key, deferable);
  }


  getNote(note?: string|null) {
    if (!note) {
      return null;
    }
    return this.getIfRecentOrLoad<string>(note, 500, () => this.client.get(note));
  }

  genLink() {
    const currentLink = window.location.href;
    return this.getIfRecentOrLoad<string>(currentLink, null, () => this.links.shrink(currentLink));
  }
}

export const Notes = new _Notes();