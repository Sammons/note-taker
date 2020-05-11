import React, { Fragment } from '/react.js'
import { LinearProgress, Box } from '/@material-ui/core.js'
import { MakeStateful } from "../lib/state-maker.js";
import { NoteTakerTheme } from '../lib/theme.js';

export const {
  component: LoadingBar,
  state: LoadingBarState
} = MakeStateful('loading-bar', {}, {}, {
  events: 0,
  enqueue: (fun: () => Promise<any>) => {
    LoadingBarState.transient.events++;
    fun().finally(() => {
      LoadingBarState.transient.events--;
    });
  }
}, () => {
  return <Fragment>
    <Box height={NoteTakerTheme.spacing(1)} />
    {LoadingBarState.transient.events > 0
      && <LinearProgress
        color={'secondary'}
        variant={'indeterminate'}
      />
    }</Fragment>
})