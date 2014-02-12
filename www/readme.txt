The is a phonegap project.  
Initial setup can be kinda a pain, you should have NPM (http://nodejs.org/) installed.  I prefer git bash (http://git-scm.com/download/) 
as my command CLI (command line interface), this also incluse a gui but that is up to you... I don't know it at all. 

Moving on to the setup:
	1) adt (http://developer.android.com/sdk/index.html) installed.  I prefer to install it to c:/adt for easy references
	2) JDK (http://www.oracle.com/technetwork/java/javase/downloads/index.html) installed. I also do c:/jdk
	3) ant (http://ant.apache.org/bindownload.cgi) installed. Again, c:/ant
	4) Setup proper path (windows)
		a) ANDROID_HOME = c:\adt\sdk
		b) ANT_HOME = c:\ant
		c) JAVA_HOME = c:\jdk
		d) PATH = (KEEP OLD PATH INFO) + %JAVA_HOME%\jre;%JAVA_HOME%;%JAVA_HOME%\bin;%JAVA_HOME%\lib;
										%ANT_HOME%\bin;%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\tools;
										%ANDROID_HOME%\platforms
			I.E. PATH = DerpDerpDerp/Derp.bat;%JAVA_HOME%\jre;%JAVA_HOME%;%JAVA_HOME%\bin;%JAVA_HOME%\lib;
										%ANT_HOME%\bin;%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\tools;
										%ANDROID_HOME%\platforms
	5) Open git bash/other CLI
		a) npm install -g phonegap
		b) npm install -g cordova
	5) ????
	6) Profit
	
OPTIONAL:
	1) Install aptana studio 3 (http://www.aptana.com/products/studio3/download) which integrates a git bash terminal
			OR
	   Install notepad++, pretty basic but has nice syntax highlighting.

That should conclude your setup and install of phonegap, java, and android so everything should work flawlessly building and 
serving for android via the next section of this readme.
	
Build and Run:
1) phonegap build android
2) phonegap serve android -p 8000 &
   		Note: '&' adds "run as service" so you can continue to recompile the app with new changes and then you don't have to continue
   		spinning up new servers each time (i.e. you can run 'phonegap build android' AFTER this command and then just refresh the page)
This will build and serve a cordova/phonegap webserver at localhost:8000

Also in testing locally (in a browser) I have found it infinately useful to use a chrome short cut with a special param:

Most likely target:
C:\Users\**INSERT USER NAME**\AppData\Local\Google\Chrome\Application\chrome.exe --allow-file-access-from-files --disable-web-security