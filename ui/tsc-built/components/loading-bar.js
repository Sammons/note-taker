"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadingBarState = exports.LoadingBar = void 0;
const react_js_1 = require("/react.js");
const core_js_1 = require("/@material-ui/core.js");
const state_maker_js_1 = require("../lib/state-maker.js");
const theme_js_1 = require("../lib/theme.js");
_a = state_maker_js_1.MakeStateful('loading-bar', {}, {}, {
    events: 0,
    enqueue: (fun) => {
        exports.LoadingBarState.transient.events++;
        fun().finally(() => {
            exports.LoadingBarState.transient.events--;
        });
    }
}, () => {
    return react_js_1.default.createElement(react_js_1.Fragment, null,
        react_js_1.default.createElement(core_js_1.Box, { height: theme_js_1.NoteTakerTheme.spacing(1) }),
        exports.LoadingBarState.transient.events > 0
            && react_js_1.default.createElement(core_js_1.LinearProgress, { color: 'secondary', variant: 'indeterminate' }));
}), exports.LoadingBar = _a.component, exports.LoadingBarState = _a.state;
