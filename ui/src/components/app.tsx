import React from 'react'
import { Container, ThemeProvider, AppBar, Toolbar, IconButton, ListItem, ListItemIcon, ListItemText } from '@material-ui/core'
import { Menu, Edit, Home, Info } from '@material-ui/icons'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import { NoteTakerTheme } from '../lib/theme'
import { MakeStateful } from '../lib/state-maker';
import { MdEditor } from './md-editor';
import LuxonMuiAdapter from '@date-io/luxon'
import { Settings } from '../components/settings'
import { LoadingBar } from '../components/loading-bar';
import { About } from './about'
import { Dashboard } from './dashboard'
import { LeftNav, LeftNavState } from './left-nav'
import { NoteEditor } from './note-editor'
import { ListEditor } from './list-editor'

const MainContainerNavigationMap = {
  'dashboard': Dashboard,
  'md-editor': NoteEditor,
  'list-editor': ListEditor,
  'about': About,
  'settings': Settings
} as const;

const {
  component: MainContainer,
  state: MainContainerState
} = MakeStateful(
  'main',
  {
    target: 'dashboard' as keyof typeof MainContainerNavigationMap
  },
  {},
  {},
  () => {
    const Target = MainContainerNavigationMap[MainContainerState.nav.target || 'dashboard'];
    return <Container disableGutters={true} style={{ padding: NoteTakerTheme.spacing(1) }}>
      <Target />
    </Container>
  });

const navigate = (selection: keyof typeof MainContainerNavigationMap) => {
  MainContainerState.nav.target = selection || 'dashboard';
}

const navConfig = [
  {
    name: "Home",
    icon: Home,
    selection: 'dashboard'
  },
  {
    name: "About",
    icon: Info,
    selection: "about"
  },
  {
    name: "MD Editor",
    icon: Edit,
    selection: 'md-editor'
  },
  {
    name: "Checklist Editor",
    icon: Edit,
    selection: 'list-editor'
  },
] as const

const toggleNav = () => {
  LeftNavState.transient.open = !LeftNavState.transient.open;
}

export const App = () => {
  return <ThemeProvider theme={NoteTakerTheme}>
    <MuiPickersUtilsProvider utils={LuxonMuiAdapter}>
      <AppBar >
        <Toolbar>
          <IconButton onClick={toggleNav}>
            <Menu />
          </IconButton>
        </Toolbar>
      </AppBar>
      <LoadingBar />
      <LeftNav navigate={navigate as (t: string) => void} items={navConfig.map(C => (
        <ListItem key={C.name} button onClick={() => {
          navigate(C.selection)
          toggleNav()
        }}>
          <ListItemIcon>
            <C.icon />
          </ListItemIcon>
          <ListItemText primary={C.name} />
        </ListItem>
      ))} />
      <MainContainer />
    </MuiPickersUtilsProvider>
  </ThemeProvider>
};