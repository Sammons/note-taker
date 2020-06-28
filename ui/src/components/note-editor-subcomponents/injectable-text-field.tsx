import React, { } from 'react'
import { TextField } from '@material-ui/core'
import { Debounced } from '../../lib/debouncer';

type PropType = {
  value: string;
  onChange: (value: string) => void
}

export class InjectableTextField extends React.Component<PropType> {
  private ref: React.RefObject<any> | null = null
  private cursorPosition: number = 0;

  constructor(props: PropType) {
    super(props);
    this.ref = React.createRef();
  }
  
  private getTextArea = () => {
    const el = this.ref?.current
    if (el) {
      const actualAreas = el.getElementsByTagName('textarea');
      if (actualAreas && actualAreas.length > 0) {
        const textArea: HTMLTextAreaElement = actualAreas[0] as Element as HTMLTextAreaElement;
        return textArea;
      }
    }
  }

  injectTextAtCursor = (inject: string) => {
    const el = this.getTextArea();
    if (el) {
      setTimeout(() => {
        el.selectionStart = this.cursorPosition;
        const cur = el.value || "";
        const pre = cur.substr(0, this.cursorPosition);
        const post = cur.substr(this.cursorPosition);
        el.value = pre + inject + post;
        el.selectionEnd = this.cursorPosition;
        el.focus()
      }, 0)
    }
  }

  render() {
    return <TextField
      ref={this.ref}
      placeholder={"Markdown"}
      fullWidth
      multiline
      value={this.props.value}
      rowsMax={30}
      variant="filled"
      onChange={(e) => {
        const value = e.target.value;
        if (value != null) {
          this.props.onChange(value);
        }
      }}
    />
  }
}