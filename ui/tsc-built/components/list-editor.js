"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListEditorState = exports.ListEditor = void 0;
const react_js_1 = require("/react.js");
const core_js_1 = require("/@material-ui/core.js");
const state_maker_js_1 = require("../lib/state-maker.js");
const debouncer_js_1 = require("../lib/debouncer.js");
const notes_client_js_1 = require("../clients/notes-client.js");
const loading_bar_js_1 = require("./loading-bar.js");
const icons_js_1 = require("/@material-ui/icons.js");
const mobx_react_js_1 = require("/mobx-react.js");
const notes_js_1 = require("../clients/notes.js");
const lab_js_1 = require("/@material-ui/lab.js");
const options = [
    "Almonds",
    "Apples",
    "Beef Jerkey",
    "Beer - IPA",
    "Beer - Pale Ale",
    "Beer - Stout",
    "Blackberries",
    "Blueberries",
    "Bread",
    "Buffalo Sauce",
    "Burger Buns",
    "Canned Chickpeas",
    "Cantelope",
    "Carrots",
    "Cheese Slices",
    "Chicken Breast",
    "Chicken Stock",
    "Chips Ahoy",
    "Chives",
    "Cranberries",
    "Frozen Pizza",
    "Garlic",
    "Gatorade",
    "Ginger Ale",
    "Green Onions",
    "Ground Beef",
    "Hotdog Buns",
    "Kiwi",
    "OJ",
    "Onions",
    "Oranges",
    "Oreos",
    "Outshine Bars - Berry",
    "Outshine Bars - Lime",
    "Peaches",
    "Peanut Butter Crackers",
    "Peanut Butter",
    "Peas",
    "Pork Chops",
    "Potatoes",
    "Rasberries",
    "Red Wine",
    "Rice - Basmati",
    "Ritz Crackers",
    "Root Beer",
    "Salsa - Mild",
    "Tea",
    "Tostitos",
    "V8",
    "Watermelon",
    "White Wine",
    "Yogurt - Strawberry",
];
const InputFieldComponent = (props) => {
    return react_js_1.default.createElement(core_js_1.TextField, { label: props.label, value: props.value, onChange: e => {
            const value = e.target.value;
            debouncer_js_1.Debounced('list-editor-input-field-component', () => {
                props.onChange(value);
            });
        }, fullWidth: true });
};
const loadNote = () => {
    loading_bar_js_1.LoadingBarState.transient.enqueue(async () => {
        const value = await new notes_client_js_1.NotesClient()
            .get(`list-${exports.ListEditorState.nav.noteName}`);
        if (value != null) {
            exports.ListEditorState.transient.localContent = value;
        }
    });
};
const save = () => {
    loading_bar_js_1.LoadingBarState.transient.enqueue(async () => {
        await new notes_client_js_1.NotesClient()
            .save(exports.ListEditorState.transient.localContent, `list-${exports.ListEditorState.nav.noteName}`);
    });
};
const NoteListItem = (props) => {
    return react_js_1.default.createElement(react_js_1.Fragment, null,
        react_js_1.default.createElement(core_js_1.ListItem, { dense: true },
            react_js_1.default.createElement(core_js_1.ListItemIcon, { style: { height: 26 } },
                react_js_1.default.createElement(core_js_1.Typography, null, props.idx),
                react_js_1.default.createElement(core_js_1.Checkbox, { edge: "start", disableRipple: true, tabIndex: -1, checked: props.checked, onChange: () => {
                        exports.ListEditorState.transient.localContent.elements[props.idx].checked = !props.checked;
                        save();
                    } })),
            react_js_1.default.createElement(core_js_1.ListItemText, { primary: react_js_1.default.createElement(core_js_1.Typography, { gutterBottom: false }, props.text) }),
            react_js_1.default.createElement(core_js_1.ListItemSecondaryAction, null,
                react_js_1.default.createElement(core_js_1.IconButton, { edge: "end", onClick: () => {
                        exports.ListEditorState.transient.localContent.elements.splice(props.idx, 1);
                        save();
                    } },
                    react_js_1.default.createElement(icons_js_1.Delete, null)))),
        react_js_1.default.createElement(core_js_1.Divider, { variant: "fullWidth", component: "li" }));
};
const NoteListArea = mobx_react_js_1.observer(() => {
    const items = exports.ListEditorState.transient.localContent;
    return react_js_1.default.createElement(core_js_1.Grid, { container: true, direction: "row", spacing: 2 },
        react_js_1.default.createElement(core_js_1.Grid, { item: true, xs: 10 },
            react_js_1.default.createElement(core_js_1.List, { disablePadding: true, dense: true }, exports.ListEditorState.transient.localContent.elements.map((e, i) => {
                return react_js_1.default.createElement(NoteListItem, { key: i, idx: i, checked: e.checked, text: e.text });
            }))),
        react_js_1.default.createElement(core_js_1.Grid, { item: true, xs: 1 },
            react_js_1.default.createElement(core_js_1.Grid, { container: true, spacing: 1 },
                react_js_1.default.createElement(core_js_1.Grid, { item: true },
                    react_js_1.default.createElement(core_js_1.Fab, null,
                        react_js_1.default.createElement(icons_js_1.SaveOutlined, { onClick: () => {
                                loading_bar_js_1.LoadingBarState.transient.enqueue(async () => {
                                    await new notes_client_js_1.NotesClient().save(exports.ListEditorState.transient.localContent, `list-${exports.ListEditorState.nav.noteName}`);
                                });
                            } }))),
                react_js_1.default.createElement(core_js_1.Grid, { item: true },
                    react_js_1.default.createElement(core_js_1.Fab, null,
                        react_js_1.default.createElement(icons_js_1.SyncOutlined, { onClick: () => {
                                loadNote();
                            } }))),
                react_js_1.default.createElement(core_js_1.Grid, { item: true },
                    react_js_1.default.createElement(core_js_1.Fab, { onClick: () => {
                            exports.ListEditorState.transient.shareModal = true;
                        } },
                        react_js_1.default.createElement(icons_js_1.ShareOutlined, null)),
                    exports.ListEditorState.transient.shareModal && react_js_1.default.createElement(core_js_1.Dialog, { open: exports.ListEditorState.transient.shareModal && Boolean(notes_js_1.Notes.genLink()), onClose: () => {
                            exports.ListEditorState.transient.shareModal = false;
                        }, maxWidth: "md", fullWidth: true },
                        react_js_1.default.createElement(core_js_1.DialogContent, null,
                            react_js_1.default.createElement(core_js_1.TextField, { defaultValue: notes_js_1.Notes.genLink(), label: "Copy the link", fullWidth: true })))))));
});
const pushItem = () => {
    if (exports.ListEditorState.transient.newEntryValue === "") {
        return;
    }
    exports.ListEditorState.transient.localContent.elements.unshift({
        checked: false,
        text: exports.ListEditorState.transient.newEntryValue
    });
    exports.ListEditorState.transient.newEntryValue = "";
    save();
};
_a = state_maker_js_1.MakeStateful('list-editor', { noteName: "" }, {}, {
    localContent: { elements: [] },
    shareModal: false,
    newEntryValue: ""
}, () => {
    if (!exports.ListEditorState.nav.noteName) {
        exports.ListEditorState.nav.noteName = new Date().toLocaleDateString();
    }
    else {
        react_js_1.useEffect(() => {
            loadNote();
        }, []);
    }
    return react_js_1.default.createElement(core_js_1.Container, { disableGutters: false },
        react_js_1.default.createElement(core_js_1.Grid, { container: true, direction: "column", spacing: 1 },
            react_js_1.default.createElement(core_js_1.Grid, { item: true, xs: 12 },
                react_js_1.default.createElement(InputFieldComponent, { label: "name", value: exports.ListEditorState.nav.noteName, onChange: (value) => {
                        exports.ListEditorState.nav.noteName = value;
                    } })),
            react_js_1.default.createElement(core_js_1.Grid, { item: true, xs: 12 },
                react_js_1.default.createElement(core_js_1.Grid, { container: true, direction: "row" },
                    react_js_1.default.createElement(core_js_1.Grid, { item: true, xs: 10 },
                        react_js_1.default.createElement(lab_js_1.Autocomplete, { id: "list-item-entry-input", options: options, 
                            // not per keypress, only when option picked
                            onChange: (e, value) => {
                                if (value != null) {
                                    exports.ListEditorState.transient.newEntryValue = value;
                                }
                            }, onKeyPress: (e) => {
                                var _a;
                                const value = (_a = e.target) === null || _a === void 0 ? void 0 : _a.value;
                                if (e.key === 'Enter') {
                                    exports.ListEditorState.transient.newEntryValue = value;
                                    pushItem();
                                }
                            }, renderInput: params => react_js_1.default.createElement(core_js_1.TextField, Object.assign({}, params, { placeholder: "Enter New Item", 
                                // when free-typing, not when option picked
                                onChange: (e) => {
                                    const value = e.target.value;
                                    if (value != null) {
                                        exports.ListEditorState.transient.newEntryValue = value;
                                    }
                                }, fullWidth: true })) })),
                    react_js_1.default.createElement(core_js_1.Grid, { item: true, xs: 1 },
                        react_js_1.default.createElement(core_js_1.IconButton, { onClick: pushItem },
                            react_js_1.default.createElement(icons_js_1.Add, null))))),
            react_js_1.default.createElement(core_js_1.Grid, { item: true, xs: 12, spacing: 0 },
                react_js_1.default.createElement(NoteListArea, null))));
}), exports.ListEditor = _a.component, exports.ListEditorState = _a.state;
