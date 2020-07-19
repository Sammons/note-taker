import React from 'react'
import { Container, ThemeProvider, AppBar, Toolbar, IconButton, ListItem, ListItemIcon, ListItemText } from '@material-ui/core'
import { Menu, Edit, Home, Info, AccountBalanceWallet } from '@material-ui/icons'
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
import { CurrentNavigation, Navigation } from 'src/lib/navigation'

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
  {},
  {},
  {},
  () => {
    const key = (CurrentNavigation.nav.target || 'dashboard') as any as keyof typeof MainContainerNavigationMap;
    const Target = MainContainerNavigationMap[key] || MainContainerNavigationMap['dashboard'];
    return <Container disableGutters={true} style={{ padding: NoteTakerTheme.spacing(1) }}>
      <Target />
    </Container>
  });

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
    name: "Bank Dashboard",
    icon: AccountBalanceWallet,
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
      <LeftNav navigate={Navigation.navigate} items={navConfig.map(C => (
        <ListItem key={C.name} button onClick={() => {
          Navigation.navigate(C.selection)
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