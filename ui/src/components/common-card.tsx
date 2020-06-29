import React from "react";
import { CardHeader, Card, List, CardContent, Link } from "@material-ui/core";

export class CommonCard extends React.Component<{
  headerText: string;
  subHeaderText?: string;
  links?: { text: string; target: string; }[]
}> {
  render() {
    return <Card>
      <CardHeader>{this.props.headerText}</CardHeader>
      {this.props.subHeaderText ? <CardContent>{this.props.subHeaderText}</CardContent> : ''}
      <List>
        {this.props.links?.map((l: {text: string; target: string;}) => <Link key={l.text} {...l} />) ?? ''}
      </List>
      {this.props.children}
    </Card>;
  }
}