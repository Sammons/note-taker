"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.About = void 0;
const react_js_1 = require("/react.js");
const core_js_1 = require("/@material-ui/core.js");
exports.About = () => {
    return react_js_1.default.createElement(react_js_1.Fragment, null,
        react_js_1.default.createElement(core_js_1.Card, null,
            react_js_1.default.createElement(core_js_1.CardHeader, { title: "About note-taker" }),
            react_js_1.default.createElement(core_js_1.CardContent, null,
                react_js_1.default.createElement(core_js_1.Typography, null, "This is an application built by Ben Sammons in 2020 as a proof of concept for his own use. It is not commercial grade product."),
                react_js_1.default.createElement(core_js_1.Typography, null, "Proof of concepting what exactly?"),
                react_js_1.default.createElement(core_js_1.Typography, null, "Using Snowpack, React, TypeScript, Material UI, MobX, in coordination with some newish web tech."),
                react_js_1.default.createElement(core_js_1.Typography, null, "This lets me try out neat caching techniques, neat patterns with state management, neat patterns with simple theming, and some serverless interactions with a backend with zero onboarding system via AWS api keys."))));
};
