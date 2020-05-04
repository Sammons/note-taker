import React, { Fragment } from '/react.js'
import { Container, Paper, ThemeProvider, Card, CardHeader, AppBar, Toolbar, IconButton, Drawer, Button, List, Divider, ListItem, ListItemIcon, ListItemText, styled, makeStyles, CardContent, Typography } from '/@material-ui/core.js'
import { Menu, Note, Settings as SettingsIcon, Save, Edit, SpaceBar, Home, Info } from '/@material-ui/icons.js'
import { MuiPickersUtilsProvider } from '/@material-ui/pickers.js'
import { NoteTakerTheme } from '../lib/theme.js'
import { MakeStateful, MakeCapturablyStateful, SnapshotCapturableState } from '../lib/state-maker.js';
import { MdEditor } from './md-editor.js';
import LuxonMuiAdapter from '/@date-io/luxon.js'
import { Settings } from '../components/settings.js'
import { LoadingBar } from '../components/loading-bar.js';
import { NotesClient } from '../clients/notes.js'
import {observer} from '/mobx-react.js';

const styles = makeStyles({
  fullList: {
    width: '210px'
  }
});

const Dashboard = () => {
  return <Card>
    <CardHeader title={"Welcome"} />
    <CardContent>
      <Typography>
        Relevant details will appear as they become available
      </Typography>
    </CardContent>
  </Card>;
};

const Editor = observer(() => {
  const currentNoteName = MainContainer.state.currentNote;
  console.log(MainContainer.state.currentNote, MainContainer.state.currentNoteValue)
  if (!MainContainer.state.currentNoteValue && currentNoteName) {
    LoadingBar.state.enqueue(async () => {
      MainContainer.state.fetchingNote = true
      await new NotesClient().get(currentNoteName).then((res) => {
        console.log(res)
        if (res && MainContainer.state.currentNoteValue != res) {
          MainContainer.state.currentNoteValue = res
        }
      }).catch(e => console.log(e))
      MainContainer.state.fetchingNote = false
    })
  }
  return <Fragment>
    <MdEditor
      noteName={MainContainer.state.currentNote}
      noteValue={MainContainer.state.currentNoteValue}
      setNoteName={noteName => {
        console.log('changing current note:', noteName)
        MainContainer.state.currentNote = noteName
        SnapshotCapturableState();
      }} />
  </Fragment>
})

const About = () => {
  return <Fragment>
    <Card>
      <CardHeader title={"About note-taker"}></CardHeader>
      <CardContent>
        <Typography>
          This is an application built by Ben Sammons in 2020 as a proof of concept for his own use. It is not commercial grade product.
        </Typography>
        <Typography>
          Proof of concepting what exactly?
        </Typography>
        <Typography>
          Using Snowpack, React, TypeScript, Material UI, MobX, in coordination with some newish web tech.
        </Typography>
        <Typography>
          This lets me try out neat caching techniques, neat patterns with state management, neat patterns with simple theming, and some serverless interactions with a backend with zero onboarding system via AWS api keys.
        </Typography>
      </CardContent>
    </Card>
  </Fragment>
}

const MainContainerNavigationMap = {
  'dashboard': Dashboard,
  'md-editor': Editor,
  'about': About,
  'settings': Settings
} as const;

const MainContainer = MakeCapturablyStateful(
  'main',
  {
    target: 'dashboard' as keyof typeof MainContainerNavigationMap,
    currentNote: null as string | null,
    currentNoteValue: null as string | null,
    fetchingNote: false
  },
  () => {
    const Target = MainContainerNavigationMap[MainContainer.state.target];
    return <Container disableGutters={true} style={{ padding: NoteTakerTheme.spacing(1) }}>
      <Target />
    </Container>
  });

const leftNavSelection = (target: keyof typeof MainContainerNavigationMap) => {
  MainContainer.state.target = 'md-editor';
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
    selection: 'md-editor'
  },
] as const

const LeftNav = MakeStateful({
  open: false,
  toggleDrawer: () => {
    LeftNav.state.open = !LeftNav.state.open;
  },
  navigate: (target: keyof typeof MainContainerNavigationMap) => {
    MainContainer.state.target = target;
    LeftNav.state.toggleDrawer();
    SnapshotCapturableState();
  }
}, () => {
  const classes = styles();
  return <Fragment>
    <Drawer anchor={'left'} open={LeftNav.state.open} onClose={LeftNav.state.toggleDrawer}>
      <List className={classes.fullList} role="presentation" >
        <ListItem button onClick={() => LeftNav.state.navigate("settings")}>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary={"Settings"} />
        </ListItem>
      </List>
      <Divider />
      <List>
        {navConfig.map(C => (
          <ListItem button onClick={() => LeftNav.state.navigate(C.selection)}>
            <ListItemIcon>
              <C.icon />
            </ListItemIcon>
            <ListItemText primary={C.name} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  </Fragment>
});

export const App = () => {
  return <ThemeProvider theme={NoteTakerTheme}>
    <MuiPickersUtilsProvider utils={LuxonMuiAdapter}>
      <AppBar >
        <Toolbar>
          <IconButton onClick={LeftNav.state.toggleDrawer}>
            <Menu />
          </IconButton>
        </Toolbar>
      </AppBar>
      <LoadingBar />
      <LeftNav />
      <MainContainer />
    </MuiPickersUtilsProvider>
  </ThemeProvider>
};