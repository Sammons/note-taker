import React, { useEffect, Fragment } from 'react'
import { Card, CardHeader, CardContent, Typography, List, ListItem } from '@material-ui/core'
import { MakeStateful } from 'src/lib/state-maker';
import { UserInfo } from 'src/clients/cognito';
import { LoadingBarState } from './loading-bar';
import { NotesClient } from 'src/clients/notes-client';
import { NoteTakerTheme } from 'src/lib/theme';
import { LocalGroceryStore } from '@material-ui/icons';
import {Navigation} from 'src/lib/navigation';
import { ListEditorState } from './list-editor';
import { ReloadCurrentNote } from 'src/lib/reload-current-note';


export const {
  component: Dashboard,
  state: DashboardState
} = MakeStateful('dashboard', {}, {}, {
  email: "",
  recentNotes: [] as { value: { text: string; }, name: string, lastUpdatedAt: number; lastUpdatedBy: string; }[]
}, () => {
  useEffect(() => {
    console.log('effect...')
    LoadingBarState.transient.enqueue(() => UserInfo.getUserInfo().then(info => {
      DashboardState.transient.email = info.email;
      return null;
    }))
    LoadingBarState.transient.enqueue(() => new NotesClient().recents().then(recents => {
      DashboardState.transient.recentNotes = recents;
    }))
  }, [])
  console.log('re-render')
  return (<Fragment>
    <Card>
      <CardHeader title={`Welcome ${DashboardState.transient.email}`} />
      <CardContent>
        <Typography>
          Good stuff will show up here occasionally
      </Typography>
      </CardContent>
    </Card>
    <Card style={{marginTop: NoteTakerTheme.spacing(1)}}>
      <CardHeader title={
        DashboardState.transient.recentNotes.length > 0
        ? `Recent notes`
        : `No recent notes found!`
      }/>
      <CardContent>
      <List >
        {DashboardState.transient.recentNotes.map(note =>
          <ListItem 
          key={note.name}
          onClick={() => {
            ListEditorState.nav.noteName = note.name;
            ReloadCurrentNote();
            Navigation.navigate('list-editor')
          }}
          button>
            <Typography>
              <LocalGroceryStore style={{ marginRight: NoteTakerTheme.spacing(1), position: 'relative', top: NoteTakerTheme.spacing(1) / 2 }} />
              {`${note.name}`}
            </Typography>
          </ListItem>
        )}
      </List>
      </CardContent>
    </Card>
  </Fragment>);
});