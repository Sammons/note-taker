#!/bin/sh

NAME=$1
FILE=$2

if [ -z $NAME ]
then
  echo "Missing lambda name. usage: $0 <lambda name> <zip file>"
  exit 1
fi

if [ -z $FILE ]
then
  echo "Missing zip file. usage: $0 <lambda name> <zip file>"
  exit 1
fi

REGION="us-east-1"
LAYER="arn:aws:lambda:us-east-1:122302178739:layer:note-base:3"

echo applying latest layer to $NAME
aws lambda update-function-configuration --region=$REGION --function-name $NAME --layers $LAYER

echo publishing $FILE to be the new $NAME
aws lambda update-function-code --region=$REGION --function-name $NAME --zip-file fileb://$FILE --publish