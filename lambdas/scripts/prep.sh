#!/bin/sh

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
cd built/note-app-config-handler 
zip handler -r . 
cd ../.. 
cd built/note-register-notification-handler
zip handler -r . 
cd ../.. 
cd built/note-notification-cred-rotator
zip handler -r . 
cd ../.. 
cd built/note-tenant-broadcaster
zip handler -r . 
cd ../.. 
cp built/note-app-config-handler/handler.zip confighandler.zip 
cp built/note-capture-handler/handler.zip writehandler.zip 
cp built/note-lookup-handler/handler.zip readhandler.zip
cp built/note-recents-handler/handler.zip recentshandler.zip
cp built/note-register-notification-handler/handler.zip notifhandler.zip
cp built/note-notification-cred-rotator/handler.zip credrotator.zip
cp built/note-tenant-broadcaster/handler.zip broadcaster.zip
