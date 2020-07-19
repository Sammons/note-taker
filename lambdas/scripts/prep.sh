#!/bin/sh
cd nodejs/node12 
yarn 
cd - 
zip layer -r nodejs 
tsc -p . 
cd built/note-lookup-handler 
zip handler -r . 
cd - 
cd built/note-capture-handler 
zip handler -r . 
cd ../.. 
cd built/note-recents-handler 
zip handler -r . 
cd ../.. 
cp built/note-capture-handler/handler.zip writehandler.zip 
cp built/note-lookup-handler/handler.zip readhandler.zip
cp built/note-recents-handler/handler.zip recentshandler.zip