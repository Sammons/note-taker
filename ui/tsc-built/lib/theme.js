"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoteTakerTheme = void 0;
const core_js_1 = require("/@material-ui/core.js");
const core_js_2 = require("/@material-ui/core.js");
exports.NoteTakerTheme = core_js_2.responsiveFontSizes(core_js_1.createMuiTheme({
    palette: {
        primary: core_js_2.colors.purple,
        secondary: core_js_2.colors.green,
    },
    typography: {
        fontFamily: '"Helvetica Neue", "Raleway"'
    },
    props: {
        MuiCard: {
            raised: true
        },
        MuiAppBar: {
            position: 'sticky',
        },
        MuiContainer: {
            disableGutters: true
        },
        MuiTypography: {
            gutterBottom: true
        }
    }
}));
