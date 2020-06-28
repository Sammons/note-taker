"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_js_1 = require("/react.js");
const react_dom_js_1 = require("/react-dom.js");
const app_js_1 = require("./components/app.js");
const theme_js_1 = require("./lib/theme.js");
const core_js_1 = require("/@material-ui/core.js");
const mobx_react_js_1 = require("/mobx-react.js");
mobx_react_js_1.observerBatching(); // https://github.com/mobxjs/mobx-react-lite/#observer-batching
const rootComponent = document.getElementById('root');
if (rootComponent) {
    react_dom_js_1.render(react_js_1.default.createElement(core_js_1.ThemeProvider, { theme: theme_js_1.NoteTakerTheme },
        react_js_1.default.createElement(app_js_1.App, null)), rootComponent);
}
else {
    console.log("Failed to find root DOM element");
}
