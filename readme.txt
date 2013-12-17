The is a phonegap project.  To run you have a few options. 
1. a) cordova build android
   b) cordova serve android
This will build and serve a cordova/phonegap webserver at localhost:8000
2. node server.js
This will serve a web server at the same address but use the www dir as the base.  This will be mostly used for local dev and testing so we don't have to worry about the file pattern stuff and domain logic.
