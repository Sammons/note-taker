//aws lambda update-function-code --region=us-east-1 --function-name note-lookup --zip-file fileb://readhandler.zip --publish
module.exports = {
  lambdas: {
    "note-lookup": {
      dir: "note-lookup-handler"
    },
    "note-capture": {
      dir: "note-capture-handler"
    },
    "plaid-account-sync": {
      dir: "plaid-sync-accounts"
    },
    "plaid-create-items": {}
  }
}