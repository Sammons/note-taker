"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoteEditorState = exports.NoteEditor = void 0;
const react_js_1 = require("/react.js");
const debouncer_js_1 = require("../lib/debouncer.js");
const core_js_1 = require("/@material-ui/core.js");
const state_maker_js_1 = require("../lib/state-maker.js");
const injectable_text_field_js_1 = require("./note-editor-subcomponents/injectable-text-field.js");
const icons_js_1 = require("/@material-ui/icons.js");
const notes_client_js_1 = require("../clients/notes-client.js");
const loading_bar_js_1 = require("./loading-bar.js");
const notes_js_1 = require("../clients/notes.js");
const mobx_react_js_1 = require("/mobx-react.js");
const markdown_js_1 = require("./note-editor-subcomponents/markdown.js");
const InputFieldComponent = (props) => {
    return react_js_1.default.createElement(core_js_1.TextField, { label: props.label, value: props.value, onChange: e => {
            const value = e.target.value;
            debouncer_js_1.Debounced('note-editor-input-field-component', () => {
                props.onChange(value);
            });
        }, fullWidth: true });
};
const ref = react_js_1.default.createRef();
const inject = (value) => {
    var _a;
    (_a = ref.current) === null || _a === void 0 ? void 0 : _a.injectTextAtCursor(value);
};
const loadNote = () => {
    loading_bar_js_1.LoadingBarState.transient.enqueue(async () => {
        const value = await new notes_client_js_1.NotesClient().get(exports.NoteEditorState.nav.noteName);
        if (value != null) {
            exports.NoteEditorState.transient.localContent = value;
        }
    });
};
const NoteTextArea = mobx_react_js_1.observer(() => {
    return react_js_1.default.createElement(core_js_1.Grid, { container: true, direction: "row", spacing: 1 },
        react_js_1.default.createElement(core_js_1.Grid, { item: true, xs: 11 },
            react_js_1.default.createElement(injectable_text_field_js_1.InjectableTextField, { ref: ref, value: exports.NoteEditorState.transient.localContent, onChange: (value) => {
                    exports.NoteEditorState.transient.localContent = value;
                } })),
        react_js_1.default.createElement(core_js_1.Grid, { item: true, xs: 1 },
            react_js_1.default.createElement(core_js_1.Grid, { container: true, spacing: 1 },
                react_js_1.default.createElement(core_js_1.Grid, { item: true },
                    react_js_1.default.createElement(core_js_1.Fab, null,
                        react_js_1.default.createElement(icons_js_1.SaveOutlined, { onClick: () => {
                                loading_bar_js_1.LoadingBarState.transient.enqueue(async () => {
                                    await new notes_client_js_1.NotesClient().save(exports.NoteEditorState.transient.localContent, exports.NoteEditorState.nav.noteName);
                                });
                            } }))),
                react_js_1.default.createElement(core_js_1.Grid, { item: true },
                    react_js_1.default.createElement(core_js_1.Fab, null,
                        react_js_1.default.createElement(icons_js_1.SyncOutlined, { onClick: () => {
                                loadNote();
                            } }))),
                react_js_1.default.createElement(core_js_1.Grid, { item: true },
                    react_js_1.default.createElement(core_js_1.Fab, { onClick: () => {
                            exports.NoteEditorState.transient.shareModal = true;
                        } },
                        react_js_1.default.createElement(icons_js_1.ShareOutlined, null)),
                    exports.NoteEditorState.transient.shareModal && react_js_1.default.createElement(core_js_1.Dialog, { open: exports.NoteEditorState.transient.shareModal && Boolean(notes_js_1.Notes.genLink()), onClose: () => {
                            exports.NoteEditorState.transient.shareModal = false;
                        }, maxWidth: "md", fullWidth: true },
                        react_js_1.default.createElement(core_js_1.DialogContent, null,
                            react_js_1.default.createElement(core_js_1.TextField, { defaultValue: notes_js_1.Notes.genLink(), label: "Copy the link", fullWidth: true })))))));
});
_a = state_maker_js_1.MakeStateful('note-editor', { noteName: "" }, {}, { localContent: "", shareModal: false }, () => {
    if (!exports.NoteEditorState.nav.noteName) {
        exports.NoteEditorState.nav.noteName = new Date().toLocaleDateString();
    }
    else {
        react_js_1.useEffect(() => {
            loadNote();
        }, []);
    }
    return react_js_1.default.createElement(core_js_1.Container, { disableGutters: false },
        react_js_1.default.createElement(core_js_1.Grid, { container: true, direction: "column", spacing: 1 },
            react_js_1.default.createElement(core_js_1.Grid, { item: true, xs: 12 },
                react_js_1.default.createElement(InputFieldComponent, { label: "name", value: exports.NoteEditorState.nav.noteName, onChange: (value) => { exports.NoteEditorState.nav.noteName = value; } })),
            react_js_1.default.createElement(core_js_1.Grid, { item: true, xs: 12 },
                react_js_1.default.createElement(NoteTextArea, null))),
        react_js_1.default.createElement(markdown_js_1.Markdown, { text: exports.NoteEditorState.transient.localContent }));
}), exports.NoteEditor = _a.component, exports.NoteEditorState = _a.state;
