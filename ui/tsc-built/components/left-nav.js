"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeftNavState = exports.LeftNav = void 0;
const react_js_1 = require("/react.js");
const core_js_1 = require("/@material-ui/core.js");
const icons_js_1 = require("/@material-ui/icons.js");
const state_maker_js_1 = require("../lib/state-maker.js");
const styles = core_js_1.makeStyles({
    fullList: {
        width: '210px'
    }
});
const toggleDrawer = () => {
    exports.LeftNavState.transient.open = !exports.LeftNavState.transient.open;
};
_a = state_maker_js_1.MakeStateful('left-nav', {}, {}, {
    open: false,
}, (props) => {
    const classes = styles();
    return react_js_1.default.createElement(react_js_1.Fragment, null,
        react_js_1.default.createElement(core_js_1.Drawer, { anchor: 'left', open: exports.LeftNavState.transient.open, onClose: toggleDrawer },
            react_js_1.default.createElement(core_js_1.List, { className: classes.fullList, role: "presentation" },
                react_js_1.default.createElement(core_js_1.ListItem, { button: true, onClick: () => props.navigate("settings") },
                    react_js_1.default.createElement(core_js_1.ListItemIcon, null,
                        react_js_1.default.createElement(icons_js_1.Settings, null)),
                    react_js_1.default.createElement(core_js_1.ListItemText, { primary: "Settings" }))),
            react_js_1.default.createElement(core_js_1.Divider, null),
            react_js_1.default.createElement(core_js_1.List, null, props.items)));
}), exports.LeftNav = _a.component, exports.LeftNavState = _a.state;
