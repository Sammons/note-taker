import React from 'react'
import { Container } from '@material-ui/core'
import { NoteTakerTheme } from '../lib/theme'
import { MakeStateful } from '../lib/state-maker';
import { MdEditor } from './md-editor';
import { Settings } from '../components/settings'
import { About } from './about'
import { Dashboard } from './dashboard'

const MainContainerNavigationMap = {
  'dashboard': Dashboard,
  'md-editor': MdEditor,
  'about': About,
  'settings': Settings
} as const;

const {
  state: MainContainerState
} = MakeStateful(
  'main',
  {/* nav */
    target: 'dashboard' as keyof typeof MainContainerNavigationMap,
    currentNote: null as string | null
  },
  {/* storage */},
  {/* transient */},
  () => {
    const Target = MainContainerNavigationMap[MainContainerState.nav.target];
    return <Container disableGutters={true} style={{ padding: NoteTakerTheme.spacing(1) }}>
      <Target />
    </Container>
  });