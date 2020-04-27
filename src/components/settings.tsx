import React, { Fragment } from "/react.js"
import { Card, CardHeader, CardContent, Typography, TextField, Grid, Button } from "/@material-ui/core.js"
import { MakeLocalStorageStateful } from "../lib/state-maker.js"
import { DebouncedEventHandler } from "../lib/debouncer.js"
import { LoadingBar } from "../components/loading-bar.js"

export const Settings = MakeLocalStorageStateful('settings', {
  awsApiKey: '',
  awsApiKeyValid: false
}, () => {
  return <Fragment>
    <Grid container direction={"column"} spacing={1}>
      <Grid item>
        <Card>
          <CardHeader title={"Global Config"} />
          <CardContent>
            <Grid container direction={"row"} alignItems={'flex-end'} spacing={1}>
              <Grid item>
              <TextField label={"aws api key"} 
              defaultValue={Settings.state.awsApiKey}
              onChange={(e) => {
                const val = e?.target?.value;
                DebouncedEventHandler('aws-api-key-change', () => {
                  if (val != null) {
                    Settings.state.awsApiKey = val.trim();
                  }
                });
              }}
              />
              </Grid>
              <Grid item>
                <Button 
                variant={"outlined"}
                onClick={() => {
                  LoadingBar.state.enqueue(() => new Promise((res, rej) => {
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