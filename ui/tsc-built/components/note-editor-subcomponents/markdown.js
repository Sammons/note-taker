"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Markdown = void 0;
const react_js_1 = require("/react.js");
const marked_js_1 = require("/marked.js");
const prismjs_js_1 = require("/prismjs.js");
const core_js_1 = require("/@material-ui/core.js");
marked_js_1.default.setOptions({
    highlight: function (code, language) {
        const validLanguage = prismjs_js_1.default.languages[language] ? language : null;
        if (validLanguage == null) {
            return code;
        }
        return prismjs_js_1.default.highlight(code, prismjs_js_1.default.languages[validLanguage], validLanguage);
    },
});
const mdStyles = core_js_1.makeStyles({
    md: {
        fontFamily: 'Courier'
    }
});
let counter = 0;
exports.Markdown = (props) => {
    const id = `markdown-holder-${counter++}`;
    const classes = mdStyles();
    return react_js_1.default.createElement("div", { className: classes.md, id: id, dangerouslySetInnerHTML: { __html: marked_js_1.default(props.text) } });
};
