"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dashboard = void 0;
const react_js_1 = require("/react.js");
const core_js_1 = require("/@material-ui/core.js");
exports.Dashboard = () => {
    return react_js_1.default.createElement(core_js_1.Card, null,
        react_js_1.default.createElement(core_js_1.CardHeader, { title: "Welcome" }),
        react_js_1.default.createElement(core_js_1.CardContent, null,
            react_js_1.default.createElement(core_js_1.Typography, null, "Relevant details will appear as they become available")));
};
