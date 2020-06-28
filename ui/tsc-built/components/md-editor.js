"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MdEditorState = exports.MdEditor = void 0;
const react_js_1 = require("/react.js");
const marked_js_1 = require("/marked.js");
const prismjs_js_1 = require("/prismjs.js");
const core_js_1 = require("/@material-ui/core.js");
const icons_js_1 = require("/@material-ui/icons.js");
const pickers_js_1 = require("/@material-ui/pickers.js");
const loading_bar_js_1 = require("../components/loading-bar.js");
const debouncer_js_1 = require("../lib/debouncer.js");
const notes_client_js_1 = require("../clients/notes-client.js");
const notes_js_1 = require("../clients/notes.js");
const mobx_js_1 = require("/mobx.js");
const mobx_react_js_1 = require("/mobx-react.js");
const state_maker_js_1 = require("../lib/state-maker.js");
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
const MdHolder = ({ id }) => {
    const classes = mdStyles();
    return react_js_1.default.createElement("div", { className: classes.md, id: id });
};
let counter = 0;
let _MdEditor = class _MdEditor extends react_js_1.Component {
    constructor(props) {
        super(props);
        this.deflector = null;
        this.mdId = `md-id-${String(counter++)}`;
        this.cursorPos = 0;
        this.textInput = react_js_1.default.createRef();
        this.textChange = (event) => {
            const el = event === null || event === void 0 ? void 0 : event.target;
            if (!el) {
                return;
            }
            const value = el.value;
            if (value != null) {
                this.cursorPos = el.selectionStart;
                if (this.deflector) {
                    window.clearTimeout(this.deflector);
                }
                this.deflector = setInterval(() => {
                    exports.MdEditorState.stored.content = value;
                    const el = document.getElementById(this.mdId);
                    if (el) {
                        el.innerHTML = marked_js_1.default(value);
                    }
                }, 25);
            }
        };
        this.getTextArea = () => {
            var _a;
            const el = (_a = this.textInput) === null || _a === void 0 ? void 0 : _a.current;
            if (el) {
                const actualAreas = el.getElementsByTagName('textarea');
                if (actualAreas && actualAreas.length > 0) {
                    const textArea = actualAreas[0];
                    return textArea;
                }
            }
        };
        this.injectTextDelayed = () => {
            const el = this.getTextArea();
            if (el) {
                setTimeout(() => {
                    el.selectionStart = this.cursorPos;
                    if (this.pick) {
                        const cur = el.value || "";
                        const pre = cur.substr(0, this.cursorPos);
                        const post = cur.substr(this.cursorPos);
                        console.log(pre, post, this.pick);
                        el.value = pre + this.pick + post;
                        this.pick = undefined;
                    }
                    el.selectionEnd = this.cursorPos;
                    el.focus();
                }, 0);
            }
        };
        this.sync = () => {
            loading_bar_js_1.LoadingBarState.transient.enqueue(async () => {
                const value = await new notes_client_js_1.NotesClient().get(exports.MdEditorState.nav.noteName);
                if (value != null) {
                    exports.MdEditorState.stored.content = value;
                }
            });
        };
        this.state = {
            showDate: false,
            showTime: false,
            name: exports.MdEditorState.nav.noteName,
            saving: false,
            sharemodal: false
        };
    }
    render() {
        return react_js_1.default.createElement(react_js_1.Fragment, null,
            this.state.showDate && react_js_1.default.createElement(pickers_js_1.DatePicker, { open: true, value: null, style: { transition: 'none' }, onChange: (e) => { this.pick = e === null || e === void 0 ? void 0 : e.toLocaleString(); }, onAccept: () => { this.setState({ showDate: false }); }, onClose: () => {
                    this.setState({ showDate: false });
                    this.injectTextDelayed();
                } }),
            this.state.showTime && react_js_1.default.createElement(pickers_js_1.DateTimePicker, { open: true, value: null, style: { transition: 'none' }, onChange: (e) => {
                    if (!e) {
                        return;
                    }
                    this.pick = `${e.toLocaleString()} at ${e.toJSDate().toLocaleTimeString().replace(/(\d+:\d+):\d+/, "$1")}`;
                }, onAccept: () => { this.setState({ showTime: false }); }, onClose: () => {
                    this.setState({ showTime: false });
                    this.injectTextDelayed();
                } }),
            react_js_1.default.createElement(core_js_1.Grid, { container: true, direction: "column", spacing: 1 },
                react_js_1.default.createElement(core_js_1.Grid, { item: true, xs: 6 },
                    react_js_1.default.createElement(core_js_1.TextField, { label: "Note name", defaultValue: this.state.name, onChange: e => {
                            const value = e.target.value;
                            debouncer_js_1.Debounced('md-note-name', () => {
                                this.setState({ name: value });
                            });
                        }, fullWidth: true })),
                react_js_1.default.createElement(core_js_1.Grid, { item: true, xs: 12 },
                    react_js_1.default.createElement(core_js_1.Grid, { container: true, direction: "row" },
                        react_js_1.default.createElement(core_js_1.Grid, { item: true, xs: 10 },
                            react_js_1.default.createElement(core_js_1.ThemeProvider, { theme: core_js_1.createMuiTheme({ typography: { fontFamily: 'Courier' } }) },
                                react_js_1.default.createElement(core_js_1.TextField, { ref: this.textInput, label: "Markdown", fullWidth: true, multiline: true, defaultValue: exports.MdEditorState.stored.content, rowsMax: 30, variant: "filled", onChange: this.textChange, onClick: this.textChange })),
                            react_js_1.default.createElement(MdHolder, { id: this.mdId })),
                        react_js_1.default.createElement(core_js_1.Grid, { item: true, xs: 2 },
                            react_js_1.default.createElement(core_js_1.Grid, { container: true, direction: "column", justify: "center", alignItems: "center", spacing: 2 },
                                react_js_1.default.createElement(core_js_1.Grid, { item: true },
                                    react_js_1.default.createElement(core_js_1.Fab, { onClick: () => { this.setState({ showDate: !this.state.showDate }); } },
                                        react_js_1.default.createElement(icons_js_1.DateRangeOutlined, null))),
                                react_js_1.default.createElement(core_js_1.Grid, { item: true },
                                    react_js_1.default.createElement(core_js_1.Fab, { onClick: () => { this.setState({ showTime: !this.state.showTime }); } },
                                        react_js_1.default.createElement(icons_js_1.WatchOutlined, null))),
                                react_js_1.default.createElement(core_js_1.Grid, { item: true },
                                    react_js_1.default.createElement(core_js_1.Fab, { disabled: this.state.saving, onClick: () => {
                                            loading_bar_js_1.LoadingBarState.transient.enqueue(async () => {
                                                this.setState({ saving: true });
                                                await new notes_client_js_1.NotesClient().save({
                                                    text: exports.MdEditorState.stored.content
                                                }, this.state.name).catch((e) => {
                                                    console.log('failed to save note', e);
                                                });
                                                exports.MdEditorState.nav.noteName = this.state.name;
                                                this.setState({ saving: false });
                                            });
                                        } },
                                        react_js_1.default.createElement(icons_js_1.SaveOutlined, null))),
                                react_js_1.default.createElement(core_js_1.Grid, { item: true },
                                    react_js_1.default.createElement(core_js_1.Fab, { disabled: this.state.saving, onClick: () => {
                                            this.sync();
                                        } },
                                        react_js_1.default.createElement(icons_js_1.SyncOutlined, null))),
                                react_js_1.default.createElement(core_js_1.Grid, { item: true },
                                    react_js_1.default.createElement(core_js_1.Fab, { onClick: () => {
                                            this.setState({ sharemodal: true });
                                            mobx_js_1.when(() => Boolean(notes_js_1.Notes.genLink()), () => {
                                                this.setState({ sharemodal: true });
                                            });
                                        } },
                                        react_js_1.default.createElement(icons_js_1.ShareOutlined, null))),
                                this.state.sharemodal && notes_js_1.Notes.genLink() && react_js_1.default.createElement(core_js_1.Dialog, { open: this.state.sharemodal, onClose: () => { this.setState({ sharemodal: false }); }, maxWidth: "md", fullWidth: true },
                                    react_js_1.default.createElement(core_js_1.DialogContent, null,
                                        react_js_1.default.createElement(core_js_1.TextField, { defaultValue: notes_js_1.Notes.genLink(), label: "Copy the link", fullWidth: true })))))))));
    }
};
_MdEditor = __decorate([
    mobx_react_js_1.observer
], _MdEditor);
_a = state_maker_js_1.MakeStateful('md-editor', {
    noteName: new Date().toLocaleDateString()
}, {
    content: ""
}, {}, () => {
    return react_js_1.default.createElement(_MdEditor, null);
}), exports.MdEditor = _a.component, exports.MdEditorState = _a.state;
