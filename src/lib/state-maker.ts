import {observable, observe} from '/mobx.js'
import {observer} from '/mobx-react.js'
import { ReactElement, Component } from '/react.js'

type HoC<P> = (props: P) => ReactElement

const captures = {} as { [key: string]: any; }
const captureDefaults = {} as { [key: string]: any; }

export const MakeState = <T>(defaultState: T) => {
  const state = observable(defaultState);
  return {
    state,
    makeObserver: <P, T extends HoC<P>>(hoc: T): HoC<P> => {
      return observer(hoc) as HoC<P>
    }
  }
}

export const MakeStateful = <T, P>(defaultState: T, hoc: HoC<P>) => {
  const state = MakeState<T>(defaultState);
  const observerHoc = state.makeObserver(hoc as HoC<unknown>) as HoC<P> & { state: typeof state['state'] };
  observerHoc.state = state.state;
  return observerHoc;
}

// these will be captured when snapshot runs
export const MakeCapturablyStateful = <T, P>(captureKey: string, defaultState: T, hoc: HoC<P>) => {
  const state = MakeState<T>({ ...defaultState, ...captures[captureKey] });
  captureDefaults[captureKey] = defaultState;
  captures[captureKey] = state.state;
  const observerHoc = state.makeObserver(hoc as HoC<unknown>) as HoC<P> & { state: T };
  observerHoc.state = state.state;
  return observerHoc;
}

export const MakeLocalStorageStateful = <T, P>(captureKey: string, defaultState: T, hoc: HoC<P>) => {
  const currentLocalStorageString = localStorage.getItem(captureKey)
  const data = currentLocalStorageString ? JSON.parse(currentLocalStorageString) : {};
  const state = MakeState<T>({ ...defaultState, ...data });
  observe(state.state, () => {
    localStorage.setItem(captureKey, JSON.stringify(state.state));
  });
  const observerHoc = state.makeObserver(hoc as HoC<unknown>) as HoC<P> & { state: T };
  observerHoc.state = state.state;
  return observerHoc;
}

export const DeserializeCapturableState = (value: string) => {
  if (!value) {
    return;
  }

  const loadedState = JSON.parse(atob(value));
  const registeredStateKeys = Object.keys(loadedState);
  registeredStateKeys.forEach(registeredStateKey => {
    const capturedState = loadedState[registeredStateKey];
    const localStateKeys = Object.keys(capturedState);
    localStateKeys.forEach(localKey => {
      const value = capturedState[localKey];
      if (!captures[registeredStateKey]) { captures[registeredStateKey] = {} }
      if (typeof value === 'object') {
        Object.keys(value).forEach(k => {
          if (!captures[registeredStateKey]) { captures[registeredStateKey][localKey] = value.constructor.apply(); }
          captures[registeredStateKey][localKey][k] = value;
        })
      } else {
        captures[registeredStateKey][localKey] = value;
      }
    })
  });
  const hashKeys = new Set(registeredStateKeys);
  Object.keys(captureDefaults).forEach(captureDefaultKey => {
    if (!hashKeys.has(captureDefaultKey)) {
      Object.keys(captureDefaults[captureDefaultKey]).forEach(defaultKey => {
        if (!captures[captureDefaultKey]) { captures[captureDefaultKey] = {}; }
        captures[captureDefaultKey][defaultKey] = captureDefaults[captureDefaultKey][defaultKey];
      })
    }
  })
}

export const SnapshotCapturableState = () => {
  window.location.hash = btoa(JSON.stringify(captures))
}

// parse data from the hash
const parseHash = () => {
  const hash = window.location.hash.replace('#', '')
  if (hash.length > 0) {
    try {
      DeserializeCapturableState(hash);
    } catch (e) {
      console.log(e, 'failed to deserialize hash into state')
    }
  }
};
parseHash();
window.onhashchange = () => {
  parseHash();
}