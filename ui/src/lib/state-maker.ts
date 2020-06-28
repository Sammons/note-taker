import { observable, observe } from 'mobx'
import { observer } from 'mobx-react'
import { ReactElement, Component } from 'react'
import {Debounced} from './debouncer';

type HoC<P> = (props: P) => ReactElement

const captures = {} as { [key: string]: any; }
const captureDefaults = {} as { [key: string]: any; }

export const MakeStateful = <HashNavState, LocalStorageState, TransientState, P = {}>(
  key: string,
  defaultNavState: HashNavState,
  defaultLocalStorageState: LocalStorageState,
  defaultTransientState: TransientState,
  hoc: HoC<P & { nav: HashNavState; stored: LocalStorageState; transient: TransientState }>
) => {
  const curNavData = captures[key] ?? {};
  const curLocalData = JSON.parse(localStorage.getItem(`component-${key}`) || "{}");
  const nav = observable({ ...defaultNavState, ...curNavData } as HashNavState);
  captures[key] = nav;
  const stored = observable({ ...defaultLocalStorageState, ...curLocalData } as LocalStorageState);
  const transient = observable({ ...defaultTransientState });

  observe(stored, () => {
    Debounced(`store-${key}`, () => {
      localStorage.setItem(`component-${key}`, JSON.stringify(stored));
    })
  });
  
  observe(nav, () => {
    Debounced(`hash`, () => {
      UpdateHashWithState();
    });
  });

  const wrappedReactHoC = observer((props: P) => {
    return hoc({ ...props, nav, stored, transient })
  });

  return {
    state: { nav, stored, transient },
    component: wrappedReactHoC as (props: P) => JSX.Element
  };
}

const DeserializeCapturableState = (value: string) => {
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
      if (typeof value === 'object' && value != null) {
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

export const UpdateHashWithState = () => {
  const toCapture = {} as typeof captures;
  Object.keys(captures).forEach(k => {
    if (Object.keys(captures[k]).length > 0) {
      toCapture[k] = captures[k];
    }
  })
  window.location.hash = btoa(JSON.stringify(toCapture))
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