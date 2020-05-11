import React, { Component, Fragment, RefObject, useEffect } from '/react.js';
import { Debounced } from '../lib/debouncer.js';
import { TextField, Grid, Container, Fab, Dialog, DialogContent } from '/@material-ui/core.js';
import { MakeStateful } from '../lib/state-maker.js';
import { InjectableTextField } from './note-editor-subcomponents/injectable-text-field.js';
import { SaveOutlined, SyncOutlined, ShareOutlined } from '/@material-ui/icons.js';
import { NotesClient } from '../clients/notes-client.js';
import { LoadingBarState } from './loading-bar.js';
import { Notes } from '../clients/notes.js';
import { observer } from '/mobx-react.js';
import { Markdown } from './note-editor-subcomponents/markdown.js';

const InputFieldComponent = (props: {
  label: string;
  value: string;
  onChange: (value: string) => void
}) => {
  return <TextField
    label={props.label}
    value={props.value}
    onChange={e => {
      const value = e.target.value;
      Debounced('note-editor-input-field-component', () => {
        props.onChange(value);
      });
    }}
    fullWidth />
}

const ref: RefObject<InjectableTextField> = React.createRef();
const inject = (value: string) => {
  ref.current?.injectTextAtCursor(value);
}
const loadNote = () => {
  LoadingBarState.transient.enqueue(async () => {
    const value = await new NotesClient().get(NoteEditorState.nav.noteName)
    if (value != null) {
      NoteEditorState.transient.localContent = value;
    }
  })
}

const NoteTextArea = observer(() => {
  return <Grid container direction="row" spacing={1}>
    <Grid item xs={11}>
      <InjectableTextField
        ref={ref}
        value={NoteEditorState.transient.localContent}
        onChange={(value) => {
          NoteEditorState.transient.localContent = value
        }} />
    </Grid>
    <Grid item xs={1}>
      <Grid container spacing={1}>
        <Grid item>
          <Fab><SaveOutlined onClick={() => {
            LoadingBarState.transient.enqueue(async () => {
              await new NotesClient().save(NoteEditorState.transient.localContent, NoteEditorState.nav.noteName)
            })
          }} /></Fab>
        </Grid>
        <Grid item>
          <Fab><SyncOutlined onClick={() => {
            loadNote();
          }} /></Fab>
        </Grid>
        <Grid item>
          <Fab onClick={() => {
            NoteEditorState.transient.shareModal = true;
          }}>
            <ShareOutlined />
          </Fab>
          {NoteEditorState.transient.shareModal && <Dialog
            open={NoteEditorState.transient.shareModal && Boolean(Notes.genLink())}
            onClose={() => {
              NoteEditorState.transient.shareModal = false;
            }}
            maxWidth={"md"}
            fullWidth>
            <DialogContent>
              <TextField
                defaultValue={Notes.genLink()}
                label={"Copy the link"}
                fullWidth />
            </DialogContent>
          </Dialog>}
        </Grid>
      </Grid>
    </Grid>
  </Grid>
})


export const { component: NoteEditor, state: NoteEditorState } = MakeStateful(
  'note-editor',
  { noteName: "" },
  {},
  { localContent: "", shareModal: false },
  () => {
    if (!NoteEditorState.nav.noteName) {
      NoteEditorState.nav.noteName = new Date().toLocaleDateString()
    } else {
      useEffect(() => {
        loadNote();
      }, []);
    }
    return <Container disableGutters={false}>
      {/* Name field */}
      <Grid
        container
        direction="column"
        spacing={1}
      >
        <Grid item xs={12}>
          <InputFieldComponent
            label="name"
            value={NoteEditorState.nav.noteName}
            onChange={(value) => { NoteEditorState.nav.noteName = value }}
          />
        </Grid>
        {/* actual note textfield, and right action bar */}
        <Grid item xs={12}>
          <NoteTextArea />
        </Grid>
      </Grid>
      <Markdown text={NoteEditorState.transient.localContent} />
    </Container>
  })

