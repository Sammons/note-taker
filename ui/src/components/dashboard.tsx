import React from '/react.js'
import { Card, CardHeader, CardContent, Typography } from '/@material-ui/core.js'


export const Dashboard = () => {
  return <Card>
    <CardHeader title={"Welcome"} />
    <CardContent>
      <Typography>
        Relevant details will appear as they become available
      </Typography>
    </CardContent>
  </Card>;
};