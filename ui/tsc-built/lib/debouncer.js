"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Debounced = void 0;
const bouncers = {};
exports.Debounced = (key, fun) => {
    const contingentError = new Error(`Failed to run debounced method: ${key}`);
    let val = bouncers[key];
    if (val) {
        window.clearTimeout(val);
    }
    bouncers[key] = setTimeout(async () => {
        try {
            await fun(event);
        }
        catch (e) {
            console.log('unexpected asynchronous failure', e, contingentError);
        }
    }, 0);
};
