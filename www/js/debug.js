/**
 * Copyright (c) 2014, Matthew Erickson (Matt@MattErickson.ME)
 * All rights reserved.
 * 
 * Please see copyright.txt for full license details
 **/
/**
 * Extend some logging function so we can actually filter out the crap for debugging
 */
var debug = debug || {};
debug.redraw = function(message) {
	if (Constants.REDRAW_LOGGING) {
		console.log("**REDRAW**:  [" + this.meessage + "]");
	}
};
debug.log = function(message) {
	if (Constants.LOGGING_LEVEL >= Logging.LOG ) {
		console.log("**LOG**:  [" + this.meessage + "]");
	}
};
debug.debug = function(message) {
	if (Constants.LOGGING_LEVEL >= Logging.DEBUG ) {
		console.log("**DEBUG**:  [" + meessage + "]");
	}
};
debug.info = function(message) {
	if (Constants.LOGGING_LEVEL >= Logging.INFO ) {
		console.log("**INFO**:  [" + meessage + "]");
	}
};
debug.warn = function(message) {
	if (Constants.LOGGING_LEVEL >= Logging.WARN ) {
		console.log("**WARN**:  [" + meessage + "]");
	}
};
debug.error = function(message) {
	if (Constants.LOGGING_LEVEL >= Logging.ERROR ) {
		console.log("**ERROR**:  [" + meessage + "]");
	}
};