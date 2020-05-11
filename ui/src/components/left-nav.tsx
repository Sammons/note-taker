import React, { Fragment, ReactElement } from '/react.js'
import { Drawer, List, Divider, ListItem, ListItemIcon, ListItemText, makeStyles } from '/@material-ui/core.js'
import { Settings as SettingsIcon } from '/@material-ui/icons.js'
import { MakeStateful } from '../lib/state-maker.js';

const styles = makeStyles({
  fullList: {
    width: '210px'
  }
});

const toggleDrawer = () => {
  LeftNavState.transient.open = !LeftNavState.transient.open;
};

export const { component: LeftNav, state: LeftNavState } = MakeStateful('left-nav', {}, {}, {
  open: false,
}, (props: { navigate: (target: string) => void, items: ReactElement[] }) => {
  const classes = styles();
  return <Fragment>
    <Drawer anchor={'left'} open={LeftNavState.transient.open} onClose={toggleDrawer}>
      <List className={classes.fullList} role="presentation" >
        <ListItem button onClick={() => props.navigate("settings")}>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary={"Settings"} />
        </ListItem>
      </List>
      <Divider />
      <List>
        {props.items}
      </List>
    </Drawer>
  </Fragment>
});