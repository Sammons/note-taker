import * as React from 'react';
import {PlaidLink} from 'react-plaid-link';
import { Container } from '@material-ui/core';
import { CommonCard } from './common-card';
export class Integrations extends React.Component<{}, {
  notes: { majorText: string; minorText?: string; }[];
}> {
  constructor(props: any) {
    super(props);
    this.state = {
      notes: []
    };
  }
  render() {
    return <Container>
      {this.state.notes.map(n => <CommonCard headerText={n.majorText} subHeaderText={n.minorText}></CommonCard>)}
      <CommonCard
        headerText='Integrations'
        subHeaderText='This is where you connect bank accounts and systems' >
      </CommonCard>
      <CommonCard headerText='Connect a Bank'>
        <PlaidLink
          clientName='sammons-finance'
          env='development'
          product={['auth', 'transactions']}
          publicKey='aa5b1f4ee367a3f63cd207ec916a52'
          onSuccess={async (token: string, metadata: {institution: {name: string};}) => {
            try {
              const credentials = localStorage.getItem('credentials');
              if (credentials) {
                const response = await fetch('https://fdrufxlslj.execute-api.us-east-1.amazonaws.com/prod/items',
                  {
                    method: 'POST',
                    body: JSON.stringify({
                      token,
                      ...metadata
                    }),
                    headers: new Headers({ Authorization: JSON.parse(credentials).id_token }),
                    mode: 'cors'
                  });
                this.setState({
                  notes: this.state.notes.concat({ majorText: `Successfully added ${metadata.institution.name}` })
                });
              }
            } catch (e) {
              this.setState({
                notes: this.state.notes.concat({ majorText: `Failed to add ${metadata.institution.name}`, minorText: `${e.message}` })
              });
            }
          }}
          onExit={() => {
            console.log('exited link');
          }}>Connect</PlaidLink>
      </CommonCard>
      <CommonCard headerText={'Connected Banks'}>

      </CommonCard>
    </Container>;
  }
}