import React, {  } from '/react.js';
import marked from '/marked.js'
import prism from '/prismjs.js'
import { makeStyles } from '/@material-ui/core.js';

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


let counter = 0;
export const Markdown = (props: {text: string}) => {
  const id = `markdown-holder-${counter++}`
  const classes = mdStyles();
  return <div className={classes.md} id={id} dangerouslySetInnerHTML={{ __html: marked(props.text) }} />
}