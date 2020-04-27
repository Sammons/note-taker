import React, { Component, Fragment, ChangeEvent, KeyboardEventHandler } from '/react.js';
import marked from '/marked.js'
import prism from '/prismjs.js'
import { TextField, makeStyles, createMuiTheme, ThemeProvider, IconButton, Fab, Container, Grid } from '/@material-ui/core.js';
import { DateRangeOutlined, TimelapseOutlined, WatchOutlined } from '/@material-ui/icons.js';
import { NoteTakerTheme } from '../lib/theme.js';
import { Clock, DatePicker, DateTimePicker } from '/@material-ui/pickers.js';

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
export class MdEditor extends Component<{}, {
  showDate: boolean;
  showTime: boolean;
}> {
  deflector: null | NodeJS.Timeout = null;
  mdId = `md-id-${String(counter++)}`;
  cursorPos = 0;
  textInput: React.RefObject<HTMLDivElement> = React.createRef();
  pick?: string;
  constructor(props: any) {
    super(props);
    this.state = {
      showDate: false,
      showTime: false
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
        }
        el.selectionEnd = this.cursorPos;
        el.focus()
      }, 0)
    }
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
        <Grid container direction="row">
          <Grid item xs={10}>
            <ThemeProvider theme={createMuiTheme({ typography: { fontFamily: 'Courier' } })}>
              <TextField
                ref={this.textInput as React.RefObject<HTMLDivElement>}
                label="Markdown"
                fullWidth
                multiline
                rowsMax={30}
                variant="filled"
                onChange={this.textChange as React.ChangeEventHandler}
                onClick={this.textChange as React.MouseEventHandler}
              />
            </ThemeProvider>
            <MdHolder id={this.mdId} />
          </Grid>
          <Grid item xs={2}>
            <Grid container direction="column" justify={"center"} alignItems={"center"}>
              <Grid item>
              <Fab onClick={() => { this.setState({ showDate: !this.state.showDate }) }}>
                <DateRangeOutlined />
              </Fab>
              </Grid>
              <Grid item>
              <Fab style={{ marginTop: NoteTakerTheme.spacing(2) }} onClick={() => { this.setState({ showTime: !this.state.showTime }) }}>
                <WatchOutlined />
              </Fab>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
    </Fragment>
  }
}