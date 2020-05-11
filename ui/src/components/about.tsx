import React, { Fragment } from '/react.js';
import { Card, CardHeader, CardContent, Typography } from '/@material-ui/core.js'

export const About = () => {
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