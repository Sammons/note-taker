import * as doc from 'aws-sdk';
const dynamo = new doc.DynamoDB();
import { DynamoSlim, LambdaHandler } from 'lambda-toolkit-utilities';
import * as plaid from 'plaid';

const plaidClient = new plaid.Client(
  process.env.PLAID_CLIENT_ID as string,
  process.env.PLAID_SECRET as string,
  process.env.PUBLIC_KEY as string,
  plaid.environments[process.env.PLAID_ENV || 'sandbox'],
  { version: '2019-05-29' }
);

module.exports.handler = new LambdaHandler({
  method: 'post',
  project: 'personal-finance',
  url: '/items',
  version: '1.0',
  gen: true
})
  .allowOrigins([200, 500, 404], '*')
  .acceptsJsonObject(b => b
    .withString('public_token')
    .withArray('accounts', a => a
      .withItemType('object', i => i
        .withString('id')
        .withString('account_id')
        .withString('name')
        .withString('type')
        .withString('subtype')
        .withString('mask')
        .withObject('balances', o => o
          .withString('currency'))))
    .withObject('institution',
      i => i.withString('name').withString('institution_id')))
  .respondsWithJsonObject(200, b => b.withBoolean('success'))
  .respondsWithJsonObject(500, b => b.withBoolean('success'))
  .respondsWithJsonObject(404, b => b.withBoolean('success'))
  .processesEventWith(async (e, _) => {
    try {
      const username = (e.requestContext as {[key: string]: any}).authorizer.claims.username;
      const tenant = await new DynamoSlim('tenants', dynamo).get({username});
      if (!tenant) {
        return {
          body: {success: false},
          statusCode: 404
        }
      }
      const body = e.body;
      const token = body.public_token;
      const plaidResponse = await plaidClient.exchangePublicToken(token);
      const accessToken = plaidResponse.access_token;
      const itemId = plaidResponse.item_id;
      const entries = body.accounts.map(a => {
        return {
          tenantId: tenant.tenantId,
          environment: process.env.PLAID_ENV,
          bankId: body.institution.institution_id,
          bankName: body.institution.name,
          accountId: a.account_id || a.id,
          accountName: a.name,
          accountType: a.type || 'unknown',
          accountSubType: a.subtype || 'unknown',
          accountMask: a.mask || 'unknown',
          accountCurrency: a.balances ? a.balances.currency : 'USD',
          createdAt: new Date().getTime(),
          accessToken: accessToken,
          plaidItemId: itemId
        };
      });
      await new DynamoSlim('plaid-account-items', dynamo).save(entries);
      return {
        body: { success: true },
        statusCode: 200
      } as const;
    } catch (e) {
      return {
        body: { success: false },
        statusCode: 500
      } as const;
    }
  });