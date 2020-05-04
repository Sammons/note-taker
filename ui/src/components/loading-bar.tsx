import React, { Fragment } from '/react.js'
import {LinearProgress, Box} from '/@material-ui/core.js'
import { MakeStateful } from "../lib/state-maker.js";
import { NoteTakerTheme } from '../lib/theme.js';

export const LoadingBar = MakeStateful({
  events: 0,
  enqueue: (fun: () => Promise<any>) => {
    LoadingBar.state.events++;
    fun().finally(() => {
      LoadingBar.state.events--;
    });
  }
},() => {
  return <Fragment>
    <Box height={NoteTakerTheme.spacing(1)}/>
    {LoadingBar.state.events > 0 
    && <LinearProgress
      color={'secondary'} 
      variant={'indeterminate'}
    />
  }</Fragment>
})