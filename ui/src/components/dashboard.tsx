import React from 'react'
import { Card, CardHeader, CardContent, Typography } from '@material-ui/core'


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