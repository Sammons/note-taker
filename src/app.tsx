import React, {Fragment} from '/react.js';
import {render} from '/react-dom.js';
import {App} from './components/app.js';
import {NoteTakerTheme} from './lib/theme.js';
import {ThemeProvider} from '/@material-ui/core.js';

import {observerBatching} from '/mobx-react.js'
observerBatching() // https://github.com/mobxjs/mobx-react-lite/#observer-batching

const rootComponent = document.getElementById('root');
if (rootComponent) {
  render(<ThemeProvider theme={NoteTakerTheme}><App/></ThemeProvider>, rootComponent)
} else {
  console.log("Failed to find root DOM element")
}