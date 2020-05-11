import React, { useEffect, Fragment } from '/react.js';
import { Grid, Container, TextField, Fab, Dialog, DialogContent, ListItem, List, IconButton, ListItemIcon, Checkbox, ListItemText, ListItemSecondaryAction, Divider, Typography } from '/@material-ui/core.js';
import { MakeStateful } from '../lib/state-maker.js';
import { Debounced } from '../lib/debouncer.js';
import { NotesClient } from '../clients/notes-client.js';
import { LoadingBarState } from './loading-bar.js';
import { SaveOutlined, SyncOutlined, ShareOutlined, Add, Delete } from '/@material-ui/icons.js';
import { observer } from '/mobx-react.js';
import { Notes } from '../clients/notes.js';
import { Autocomplete } from '/@material-ui/lab.js'

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
]

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
      Debounced('list-editor-input-field-component', () => {
        props.onChange(value);
      });
    }}
    fullWidth />
}

const loadNote = () => {
  LoadingBarState.transient.enqueue(async () => {
    const value = await new NotesClient()
      .get<typeof ListEditorState.transient['localContent']>(
        `list-${ListEditorState.nav.noteName}`
      )
    if (value != null) {
      ListEditorState.transient.localContent = value
    }
  })
}

const save = () => {
  LoadingBarState.transient.enqueue(async () => {
    await new NotesClient()
      .save(
        ListEditorState.transient.localContent,
        `list-${ListEditorState.nav.noteName}`
      )
  })
}

const NoteListItem = (props: { idx: number; text: string; checked: boolean; }) => {
  return <Fragment>
    <ListItem dense>
      <ListItemIcon style={{height: 26}}>
        <Typography>{props.idx}</Typography>
        <Checkbox edge="start"
          disableRipple
          tabIndex={-1}
          checked={props.checked}
          onChange={() => {
            ListEditorState.transient.localContent.elements[props.idx].checked = !props.checked
            save()
          }}
        />
      </ListItemIcon>
      <ListItemText primary={<Typography gutterBottom={false}>{props.text}</Typography>} />
      <ListItemSecondaryAction>
        <IconButton edge="end" onClick={() => {
          ListEditorState.transient.localContent.elements.splice(props.idx, 1)
          save();
        }}>
          <Delete />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
    <Divider variant="fullWidth" component="li" />
  </Fragment>
}

const NoteListArea = observer(() => {
  const items = ListEditorState.transient.localContent;

  return <Grid container direction="row" spacing={2}>

    <Grid item xs={10}>
      <List disablePadding dense>
        {ListEditorState.transient.localContent.elements.map((e, i) => {
          return <NoteListItem key={i} idx={i} checked={e.checked} text={e.text} />
        })}
      </List>
    </Grid>
    <Grid item xs={1}>
      <Grid container spacing={1}>
        <Grid item>
          <Fab><SaveOutlined onClick={() => {
            LoadingBarState.transient.enqueue(async () => {
              await new NotesClient().save(
                ListEditorState.transient.localContent,
                `list-${ListEditorState.nav.noteName}`
              )
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
            ListEditorState.transient.shareModal = true;
          }}>
            <ShareOutlined />
          </Fab>
          {ListEditorState.transient.shareModal && <Dialog
            open={ListEditorState.transient.shareModal && Boolean(Notes.genLink())}
            onClose={() => {
              ListEditorState.transient.shareModal = false;
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

const pushItem = () => {
  if (ListEditorState.transient.newEntryValue === "") {
    return;
  }
  ListEditorState.transient.localContent.elements.unshift({
    checked: false,
    text: ListEditorState.transient.newEntryValue
  })
  ListEditorState.transient.newEntryValue = "";
  save()
}

export const {
  component: ListEditor,
  state: ListEditorState
} = MakeStateful('list-editor',
  { noteName: "" },
  {},
  {
    localContent: { elements: [] as { text: string; checked: boolean; }[] },
    shareModal: false,
    newEntryValue: ""
  },
  () => {
    if (!ListEditorState.nav.noteName) {
      ListEditorState.nav.noteName = new Date().toLocaleDateString()
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
            value={ListEditorState.nav.noteName}
            onChange={(value) => {
              ListEditorState.nav.noteName = value 
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Grid container direction="row">
            <Grid item xs={10}>
              <Autocomplete
                id="list-item-entry-input"
                options={options}
                // not per keypress, only when option picked
                onChange={(e: any, value: any) => {
                  if (value != null) {
                    ListEditorState.transient.newEntryValue = value;
                  }
                }}
                onKeyPress={(e) => {
                  const value = (e.target as any)?.value;
                  if (e.key === 'Enter') {
                    ListEditorState.transient.newEntryValue = value;
                    pushItem();
                  }
                }}
                renderInput={params => <TextField
                  {...params}
                  placeholder={"Enter New Item"}
                  // when free-typing, not when option picked
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value != null) {
                      ListEditorState.transient.newEntryValue = value;
                    }
                  }}
                  fullWidth
                />}
              />
            </Grid>
            <Grid item xs={1}>
              <IconButton onClick={pushItem}>
                <Add />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
        {/* actual note textfield, and right action bar */}
        <Grid item xs={12} spacing={0}>
          <NoteListArea />
        </Grid>
      </Grid>
    </Container>
  })