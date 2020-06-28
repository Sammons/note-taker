"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const react_js_1 = require("/react.js");
const core_js_1 = require("/@material-ui/core.js");
const icons_js_1 = require("/@material-ui/icons.js");
const pickers_js_1 = require("/@material-ui/pickers.js");
const theme_js_1 = require("../lib/theme.js");
const state_maker_js_1 = require("../lib/state-maker.js");
const luxon_js_1 = require("/@date-io/luxon.js");
const settings_js_1 = require("../components/settings.js");
const loading_bar_js_1 = require("../components/loading-bar.js");
const about_js_1 = require("./about.js");
const dashboard_js_1 = require("./dashboard.js");
const left_nav_js_1 = require("./left-nav.js");
const note_editor_js_1 = require("./note-editor.js");
const list_editor_js_1 = require("./list-editor.js");
const MainContainerNavigationMap = {
    'dashboard': dashboard_js_1.Dashboard,
    'md-editor': note_editor_js_1.NoteEditor,
    'list-editor': list_editor_js_1.ListEditor,
    'about': about_js_1.About,
    'settings': settings_js_1.Settings
};
const { component: MainContainer, state: MainContainerState } = state_maker_js_1.MakeStateful('main', {
    target: 'dashboard'
}, {}, {}, () => {
    const Target = MainContainerNavigationMap[MainContainerState.nav.target || 'dashboard'];
    return react_js_1.default.createElement(core_js_1.Container, { disableGutters: true, style: { padding: theme_js_1.NoteTakerTheme.spacing(1) } },
        react_js_1.default.createElement(Target, null));
});
const navigate = (selection) => {
    MainContainerState.nav.target = selection || 'dashboard';
};
const navConfig = [
    {
        name: "Home",
        icon: icons_js_1.Home,
        selection: 'dashboard'
    },
    {
        name: "About",
        icon: icons_js_1.Info,
        selection: "about"
    },
    {
        name: "MD Editor",
        icon: icons_js_1.Edit,
        selection: 'md-editor'
    },
    {
        name: "Checklist Editor",
        icon: icons_js_1.Edit,
        selection: 'list-editor'
    },
];
const toggleNav = () => {
    left_nav_js_1.LeftNavState.transient.open = !left_nav_js_1.LeftNavState.transient.open;
};
exports.App = () => {
    return react_js_1.default.createElement(core_js_1.ThemeProvider, { theme: theme_js_1.NoteTakerTheme },
        react_js_1.default.createElement(pickers_js_1.MuiPickersUtilsProvider, { utils: luxon_js_1.default },
            react_js_1.default.createElement(core_js_1.AppBar, null,
                react_js_1.default.createElement(core_js_1.Toolbar, null,
                    react_js_1.default.createElement(core_js_1.IconButton, { onClick: toggleNav },
                        react_js_1.default.createElement(icons_js_1.Menu, null)))),
            react_js_1.default.createElement(loading_bar_js_1.LoadingBar, null),
            react_js_1.default.createElement(left_nav_js_1.LeftNav, { navigate: navigate, items: navConfig.map(C => (react_js_1.default.createElement(core_js_1.ListItem, { button: true, onClick: () => {
                        navigate(C.selection);
                        toggleNav();
                    } },
                    react_js_1.default.createElement(core_js_1.ListItemIcon, null,
                        react_js_1.default.createElement(C.icon, null)),
                    react_js_1.default.createElement(core_js_1.ListItemText, { primary: C.name })))) }),
            react_js_1.default.createElement(MainContainer, null)));
};
