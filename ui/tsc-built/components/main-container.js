"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_js_1 = require("/react.js");
const core_js_1 = require("/@material-ui/core.js");
const theme_js_1 = require("../lib/theme.js");
const state_maker_js_1 = require("../lib/state-maker.js");
const md_editor_js_1 = require("./md-editor.js");
const settings_js_1 = require("../components/settings.js");
const about_js_1 = require("./about.js");
const dashboard_js_1 = require("./dashboard.js");
const MainContainerNavigationMap = {
    'dashboard': dashboard_js_1.Dashboard,
    'md-editor': md_editor_js_1.MdEditor,
    'about': about_js_1.About,
    'settings': settings_js_1.Settings
};
const { state: MainContainerState } = state_maker_js_1.MakeStateful('main', {
    target: 'dashboard',
    currentNote: null
}, { /* storage */}, { /* transient */}, () => {
    const Target = MainContainerNavigationMap[MainContainerState.nav.target];
    return react_js_1.default.createElement(core_js_1.Container, { disableGutters: true, style: { padding: theme_js_1.NoteTakerTheme.spacing(1) } },
        react_js_1.default.createElement(Target, null));
});
