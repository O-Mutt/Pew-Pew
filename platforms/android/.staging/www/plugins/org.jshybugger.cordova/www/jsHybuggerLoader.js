cordova.define("org.jshybugger.cordova.jsHybuggerLoader", function(require, exports, module) {	if (typeof(JsHybugger) === 'undefined' && navigator.userAgent.indexOf("Chrome")<0) {
		console.log('Redirecting to jsHybugger content provider');
		window.location = 'content://jsHybugger.org/' + window.location;
	} else if (/^content:\/\/jsHybugger.org/.test(window.location) && navigator.userAgent.indexOf("Chrome")>0) {
		console.log('Redirecting away from jsHybugger content provider');
		window.location = window.location.toString().substr('content://jsHybugger.org/'.length);
	}
});
