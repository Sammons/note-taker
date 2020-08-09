# /scripts/create-function.sh note-notification-cred-rotator credrotator.zip
NAME=$1
REGION="us-east-1"
RUNTIME="nodejs12.x"
# poorly named, but yes, re-use this role
ROLE="arn:aws:iam::122302178739:role/service-role/note-capture-role-ak2y8u7b"
FILE=$2

#layers not included, so just run an update immediately after create
aws lambda create-function --handler=index.handler --runtime=$RUNTIME --region=$REGION --function-name $NAME --zip-file fileb://$FILE --role=$ROLE