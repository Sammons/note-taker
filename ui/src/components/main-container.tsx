import React from '/react.js'
import { Container } from '/@material-ui/core.js'
import { NoteTakerTheme } from '../lib/theme.js'
import { MakeStateful } from '../lib/state-maker.js';
import { MdEditor } from './md-editor.js';
import { Settings } from '../components/settings.js'
import { About } from './about.js'
import { Dashboard } from './dashboard.js'

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