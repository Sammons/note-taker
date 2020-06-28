import React, { Fragment } from "react"
import { Card, CardHeader, CardContent, TextField, Grid, Button } from "@material-ui/core"
import { MakeStateful } from "../lib/state-maker"
import { Debounced } from "../lib/debouncer"
import { LoadingBar, LoadingBarState } from "../components/loading-bar"

export const {
   component: Settings,
   state: SettingsState 
} = MakeStateful(
  'settings',
  {/* nav */},
  {
    linkShrinkApiKey: '',
    notesApiKey: ''
  },
  {/* transient */},
  () => {
    return <Fragment>
      <Grid container direction={"column"} spacing={1}>
        <Grid item>
          <Card>
            <CardHeader title={"Global Config"} />
            <CardContent>
              <Grid container
                direction={"row"}
                alignItems={'flex-start'}
                justify={'space-between'}
                spacing={1}
              >
                <Grid item xs={8}>
                  <TextField label={"link shrink aws api key"}
                    fullWidth={true}
                    defaultValue={SettingsState.stored.linkShrinkApiKey}
                    onChange={(e) => {
                      const val = e?.target?.value;
                      Debounced('link-shrink-aws-api-key-change', () => {
                        if (val != null) {
                          SettingsState.stored.linkShrinkApiKey = val.trim();
                        }
                      });
                    }}
                  />
                </Grid>
                <Grid item xs={8}>
                  <TextField label={"notes aws api key"}
                    fullWidth={true}
                    defaultValue={SettingsState.stored.notesApiKey}
                    onChange={(e) => {
                      const val = e?.target?.value;
                      Debounced('notes-aws-api-key-change', () => {
                        if (val != null) {
                          SettingsState.stored.notesApiKey = val.trim();
                        }
                      });
                    }}
                  />
                </Grid>
                <Grid item>
                  <Button
                    variant={"outlined"}
                    onClick={() => {
                      LoadingBarState.transient.enqueue(() => new Promise((res) => {
                        setTimeout(res, 500)
                      }))
                    }}
                  >Validate</Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item>
          <Card>
            <CardHeader title={"Grocery List Config"} />
            <CardContent>
              <TextField label={"TBD"}></TextField>
            </CardContent>
          </Card>
        </Grid>
        <Grid item>
          <Card>
            <CardHeader title={"Todo List Config"} />
            <CardContent>
              <TextField label={"TBD"}></TextField>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Fragment>
  })