"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateHashWithState = exports.MakeStateful = void 0;
const mobx_js_1 = require("/mobx.js");
const mobx_react_js_1 = require("/mobx-react.js");
const debouncer_js_1 = require("./debouncer.js");
const captures = {};
const captureDefaults = {};
exports.MakeStateful = (key, defaultNavState, defaultLocalStorageState, defaultTransientState, hoc) => {
    var _a;
    const curNavData = (_a = captures[key]) !== null && _a !== void 0 ? _a : {};
    const curLocalData = JSON.parse(localStorage.getItem(`component-${key}`) || "{}");
    const nav = mobx_js_1.observable(Object.assign(Object.assign({}, defaultNavState), curNavData));
    captures[key] = nav;
    const stored = mobx_js_1.observable(Object.assign(Object.assign({}, defaultLocalStorageState), curLocalData));
    const transient = mobx_js_1.observable(Object.assign({}, defaultTransientState));
    mobx_js_1.observe(stored, () => {
        debouncer_js_1.Debounced(`store-${key}`, () => {
            localStorage.setItem(`component-${key}`, JSON.stringify(stored));
        });
    });
    mobx_js_1.observe(nav, () => {
        debouncer_js_1.Debounced(`hash`, () => {
            exports.UpdateHashWithState();
        });
    });
    const wrappedReactHoC = mobx_react_js_1.observer((props) => {
        return hoc(Object.assign(Object.assign({}, props), { nav, stored, transient }));
    });
    return {
        state: { nav, stored, transient },
        component: wrappedReactHoC
    };
};
const DeserializeCapturableState = (value) => {
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
            if (!captures[registeredStateKey]) {
                captures[registeredStateKey] = {};
            }
            if (typeof value === 'object' && value != null) {
                Object.keys(value).forEach(k => {
                    if (!captures[registeredStateKey]) {
                        captures[registeredStateKey][localKey] = value.constructor.apply();
                    }
                    captures[registeredStateKey][localKey][k] = value;
                });
            }
            else {
                captures[registeredStateKey][localKey] = value;
            }
        });
    });
    const hashKeys = new Set(registeredStateKeys);
    Object.keys(captureDefaults).forEach(captureDefaultKey => {
        if (!hashKeys.has(captureDefaultKey)) {
            Object.keys(captureDefaults[captureDefaultKey]).forEach(defaultKey => {
                if (!captures[captureDefaultKey]) {
                    captures[captureDefaultKey] = {};
                }
                captures[captureDefaultKey][defaultKey] = captureDefaults[captureDefaultKey][defaultKey];
            });
        }
    });
};
exports.UpdateHashWithState = () => {
    const toCapture = {};
    Object.keys(captures).forEach(k => {
        if (Object.keys(captures[k]).length > 0) {
            toCapture[k] = captures[k];
        }
    });
    window.location.hash = btoa(JSON.stringify(toCapture));
};
// parse data from the hash
const parseHash = () => {
    const hash = window.location.hash.replace('#', '');
    if (hash.length > 0) {
        try {
            DeserializeCapturableState(hash);
        }
        catch (e) {
            console.log(e, 'failed to deserialize hash into state');
        }
    }
};
parseHash();
window.onhashchange = () => {
    parseHash();
};
