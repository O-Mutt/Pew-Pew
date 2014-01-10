/**
 * Extend some logging function so we can actually filter out the crap for debugging
 */
var debug = new function() {
	this.redraw = new function(message) {
		if (Constants.REDRAW_LOGGING) {
			console.log("**REDRAW**:  [" + this.meessage + "]");
		}
	}
	this.log = new function(message) {
		if (Constants.LOGGING_LEVEL >= Logging.LOG ) {
			console.log("**LOG**:  [" + this.meessage + "]");
		}
	},
	this.debug = new function(message) {
		if (Constants.LOGGING_LEVEL >= Logging.DEBUG ) {
			console.log("**DEBUG**:  [" + meessage + "]");
		}
	},
	this.info = new function(message) {
		if (Constants.LOGGING_LEVEL >= Logging.INFO ) {
			console.log("**INFO**:  [" + meessage + "]");
		}
	},
	this.warn = new function(message) {
		if (Constants.LOGGING_LEVEL >= Logging.WARN ) {
			console.log("**WARN**:  [" + meessage + "]");
		}
	},
	this.error = new function(message) {
		if (Constants.LOGGING_LEVEL >= Logging.ERROR ) {
			console.log("**ERROR**:  [" + meessage + "]");
		}
	}
}