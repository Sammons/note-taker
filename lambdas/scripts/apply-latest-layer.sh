#!/bin/sh
LAYER=arn:aws:lambda:us-east-1:122302178739:layer:note-base:2
REGION=us-east-1

aws lambda update-function-configuration --region=$REGION --function-name note-capture --layers $LAYER
aws lambda update-function-configuration --region=$REGION --function-name note-lookup --layers $LAYER
aws lambda update-function-configuration --region=$REGION --function-name note-recents --layers $LAYER