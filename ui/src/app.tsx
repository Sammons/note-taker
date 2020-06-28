import 'prismjs/themes/prism.css'
import React, {Fragment} from 'react';
import {render} from 'react-dom';
import {App} from './components/app';
import {NoteTakerTheme} from './lib/theme';
import {ThemeProvider} from '@material-ui/core';
import {observerBatching} from 'mobx-react'
observerBatching() // https://github.com/mobxjs/mobx-react-lite/#observer-batching

const rootComponent = document.getElementById('root');
if (rootComponent) {
  render(<ThemeProvider theme={NoteTakerTheme}><App/></ThemeProvider>, rootComponent)
} else {
  console.log("Failed to find root DOM element")
}