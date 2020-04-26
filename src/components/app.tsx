import React, { Fragment } from '/react.js'
import { Container, Paper, ThemeProvider, Card, CardHeader, AppBar, Toolbar, IconButton, Drawer, Button, List, Divider, ListItem, ListItemIcon, ListItemText, styled, makeStyles } from '/@material-ui/core.js'
import { Menu, Note, Settings, Save, Edit, SpaceBar } from '/@material-ui/icons.js'
import { MuiPickersUtilsProvider } from '/@material-ui/pickers.js'
import { NoteTakerTheme } from '../lib/theme.js'
import { MakeStateful, MakeCapturablyStateful, SnapshotCapturableState } from '../lib/state-maker.js';
import { MdEditor } from './md-editor.js';
import LuxonMuiAdapter from '/@date-io/luxon.js'

const styles = makeStyles({
  fullList: {
    width: '210px'
  }
});

const Dashboard = () => {
  return <Card>
    <CardHeader title={"Hello World"} />
  </Card>;
};

const Editor = () => {
  return <Fragment>
      <MdEditor />
  </Fragment>
}

const MainContainerNavigationMap = {
  'dashboard': Dashboard,
  'md-editor': Editor
} as const;

const MainContainer = MakeCapturablyStateful(
  'main',
  {
     target: 'dashboard' as keyof typeof MainContainerNavigationMap,
  },
  () => {
    const Target = MainContainerNavigationMap[MainContainer.state.target];
    return <Container>
      <Target />
    </Container>
  });

const leftNavSelection = (target: keyof typeof MainContainerNavigationMap) => {
  MainContainer.state.target = 'md-editor';
}

const navConfig = [
  {
    name: "Create Note",
    icon: Edit,
    selection: 'md-editor'
  },
  {
    name: "Create Todo",
    icon: Edit,
    selection: 'md-editor'
  },
  {
    name: "Grocery List",
    icon: Edit,
    selection: 'md-editor'
  },
] as const

const LeftNav = MakeStateful({
  open: false,
  toggleDrawer: () => {
    LeftNav.state.open = !LeftNav.state.open;
  }
}, () => {
  const classes = styles();
  return <Fragment>
    <Drawer anchor={'left'} open={LeftNav.state.open} onClose={LeftNav.state.toggleDrawer}>
      <List className={classes.fullList} role="presentation" >
        <ListItem button>
          <ListItemIcon>
            <Settings />
          </ListItemIcon>
          <ListItemText primary={"Settings"} />
        </ListItem>
      </List>
      <Divider />
      <List>
        {navConfig.map(C => (
          <ListItem button onClick={() => {
            MainContainer.state.target = C.selection;
            LeftNav.state.toggleDrawer();
            SnapshotCapturableState();
          }}>
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
    <LeftNav />
    <MainContainer />
    </MuiPickersUtilsProvider>
  </ThemeProvider>
};