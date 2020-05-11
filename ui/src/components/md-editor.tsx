import React, { Component, Fragment } from '/react.js';
import marked from '/marked.js'
import prism from '/prismjs.js'
import { TextField, makeStyles, createMuiTheme, ThemeProvider, Fab, Grid, Dialog, DialogContent } from '/@material-ui/core.js';
import { DateRangeOutlined, WatchOutlined, SaveOutlined, ShareOutlined, SyncOutlined } from '/@material-ui/icons.js';
import { DatePicker, DateTimePicker } from '/@material-ui/pickers.js';
import { LoadingBarState } from "../components/loading-bar.js"
import { Debounced } from '../lib/debouncer.js';
import { NotesClient } from '../clients/notes-client.js';
import { Notes } from '../clients/notes.js';
import { when } from '/mobx.js';
import { observer } from '/mobx-react.js';
import { MakeStateful } from '../lib/state-maker.js';

marked.setOptions({
  highlight: function (code, language) {
    const validLanguage = prism.languages[language] ? language : null;
    if (validLanguage == null) {
      return code;
    }
    return prism.highlight(code, prism.languages[validLanguage], validLanguage)
  },
})

const mdStyles = makeStyles({
  md: {
    fontFamily: 'Courier'
  }
})

const MdHolder = ({ id }: { id: string }) => {
  const classes = mdStyles();
  return <div className={classes.md} id={id}></div>
}

let counter = 0;
@observer
class _MdEditor extends Component<{}, {
  showDate: boolean;
  showTime: boolean;
  name: string;
  saving: boolean;
  sharemodal: boolean;
}> {
  deflector: null | NodeJS.Timeout = null;
  mdId = `md-id-${String(counter++)}`;
  cursorPos = 0;
  textInput: React.RefObject<HTMLDivElement> = React.createRef();
  pick?: string;
  constructor(props: _MdEditor extends Component<infer P> ? P : never) {
    super(props);
    this.state = {
      showDate: false,
      showTime: false,
      name: MdEditorState.nav.noteName,
      saving: false,
      sharemodal: false
    }
  }

  textChange = (event: React.ChangeEvent<HTMLTextAreaElement> | React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const el: HTMLTextAreaElement = event?.target as HTMLTextAreaElement
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
        MdEditorState.stored.content = value;
        const el = document.getElementById(this.mdId)
        if (el) {
          el.innerHTML = marked(value)
        }
      }, 25);
    }
  }

  getTextArea = () => {
    const el = this.textInput?.current
    if (el) {
      const actualAreas = el.getElementsByTagName('textarea');
      if (actualAreas && actualAreas.length > 0) {
        const textArea: HTMLTextAreaElement = actualAreas[0] as Element as HTMLTextAreaElement;
        return textArea;
      }
    }
  }

  injectTextDelayed = () => {
    const el = this.getTextArea();
    if (el) {
      setTimeout(() => {
        el.selectionStart = this.cursorPos;
        if (this.pick) {
          const cur = el.value || "";
          const pre = cur.substr(0, this.cursorPos);
          const post = cur.substr(this.cursorPos);
          console.log(pre, post, this.pick)
          el.value = pre + this.pick + post;
          this.pick = undefined;
        }
        el.selectionEnd = this.cursorPos;
        el.focus()
      }, 0)
    }
  }

  sync = () => {
    LoadingBarState.transient.enqueue(async() => {
      const value = await new NotesClient().get(MdEditorState.nav.noteName);
      if (value != null) {
        MdEditorState.stored.content = value
      }
    })
  }

  render() {
    return <Fragment>
      {this.state.showDate && <DatePicker open={true} value={null}
        style={{ transition: 'none' }}
        onChange={(e) => { this.pick = e?.toLocaleString(); }}
        onAccept={() => { this.setState({ showDate: false }); }}
        onClose={() => {
          this.setState({ showDate: false });
          this.injectTextDelayed();
        }}
      />}
      {this.state.showTime && <DateTimePicker open={true} value={null}
        style={{ transition: 'none' }}
        onChange={(e) => {
          if (!e) {
            return;
          }
          this.pick = `${e.toLocaleString()} at ${e.toJSDate().toLocaleTimeString().replace(/(\d+:\d+):\d+/, "$1")}`;
        }}
        onAccept={() => { this.setState({ showTime: false }); }}
        onClose={() => {
          this.setState({ showTime: false });
          this.injectTextDelayed();
        }}
      />}
      <Grid container direction="column" spacing={1}>
        <Grid item xs={6}>
          <TextField 
          label={"Note name"} 
          defaultValue={this.state.name} 
          onChange={e => {
            const value = e.target.value;
            Debounced('md-note-name', () => {
              this.setState({name: value})
            });
          }}
          fullWidth />
        </Grid>
        <Grid item xs={12}>
          <Grid container direction="row">
            <Grid item xs={10}>
              <ThemeProvider theme={createMuiTheme({ typography: { fontFamily: 'Courier' } })}>
                <TextField
                  ref={this.textInput as React.RefObject<HTMLDivElement>}
                  label="Markdown"
                  fullWidth
                  multiline
                  defaultValue={MdEditorState.stored.content}
                  rowsMax={30}
                  variant="filled"
                  onChange={this.textChange as React.ChangeEventHandler}
                  onClick={this.textChange as React.MouseEventHandler}
                />
              </ThemeProvider>
              <MdHolder id={this.mdId} />
            </Grid>
            <Grid item xs={2}>
              <Grid container direction="column" justify={"center"} alignItems={"center"} spacing={2}>
                <Grid item>
                  <Fab onClick={() => { this.setState({ showDate: !this.state.showDate }) }}>
                    <DateRangeOutlined />
                  </Fab>
                </Grid>
                <Grid item>
                  <Fab onClick={() => { this.setState({ showTime: !this.state.showTime }) }}>
                    <WatchOutlined />
                  </Fab>
                </Grid>
                <Grid item>
                  <Fab disabled={this.state.saving} onClick={() => {
                    LoadingBarState.transient.enqueue(async () => {
                      this.setState({saving: true})
                      await new NotesClient().save({
                        text: MdEditorState.stored.content
                      }, this.state.name).catch((e) => {
                        console.log('failed to save note', e)
                      })
                      MdEditorState.nav.noteName = this.state.name;
                      this.setState({saving: false})
                    })
                  }}>
                    <SaveOutlined />
                  </Fab>
                </Grid>
                <Grid item>
                  <Fab disabled={this.state.saving} onClick={() => {
                    this.sync();
                  }}>
                    <SyncOutlined />
                  </Fab>
                </Grid>
                <Grid item>
                  <Fab onClick={() => {
                      this.setState({sharemodal: true});
                      when(() => Boolean(Notes.genLink()), () => {
                        this.setState({sharemodal: true})
                      })
                    }}>
                    <ShareOutlined />
                  </Fab>
                </Grid>
                {this.state.sharemodal && Notes.genLink() && <Dialog open={this.state.sharemodal} onClose={() => {this.setState({sharemodal: false})}} maxWidth={"md"} fullWidth>
                  <DialogContent>
                  <TextField defaultValue={Notes.genLink()} label={"Copy the link"} fullWidth/>
                  </DialogContent>
                </Dialog>}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Fragment>
  }
}

export const {
  component: MdEditor,
  state: MdEditorState
} = MakeStateful('md-editor', {
  noteName: new Date().toLocaleDateString()
}, {
  content: ""
}, {}, () => {
  return <_MdEditor  />
})