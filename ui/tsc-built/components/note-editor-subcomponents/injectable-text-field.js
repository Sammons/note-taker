"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InjectableTextField = void 0;
const react_js_1 = require("/react.js");
const core_js_1 = require("/@material-ui/core.js");
class InjectableTextField extends react_js_1.default.Component {
    constructor(props) {
        super(props);
        this.ref = null;
        this.cursorPosition = 0;
        this.getTextArea = () => {
            var _a;
            const el = (_a = this.ref) === null || _a === void 0 ? void 0 : _a.current;
            if (el) {
                const actualAreas = el.getElementsByTagName('textarea');
                if (actualAreas && actualAreas.length > 0) {
                    const textArea = actualAreas[0];
                    return textArea;
                }
            }
        };
        this.injectTextAtCursor = (inject) => {
            const el = this.getTextArea();
            if (el) {
                setTimeout(() => {
                    el.selectionStart = this.cursorPosition;
                    const cur = el.value || "";
                    const pre = cur.substr(0, this.cursorPosition);
                    const post = cur.substr(this.cursorPosition);
                    el.value = pre + inject + post;
                    el.selectionEnd = this.cursorPosition;
                    el.focus();
                }, 0);
            }
        };
        this.ref = react_js_1.default.createRef();
    }
    render() {
        return react_js_1.default.createElement(core_js_1.TextField, { ref: this.ref, placeholder: "Markdown", fullWidth: true, multiline: true, value: this.props.value, rowsMax: 30, variant: "filled", onChange: (e) => {
                const value = e.target.value;
                if (value != null) {
                    this.props.onChange(value);
                }
            } });
    }
}
exports.InjectableTextField = InjectableTextField;
