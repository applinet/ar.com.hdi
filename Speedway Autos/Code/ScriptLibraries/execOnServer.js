/*
 * Programmatically Triggering an XPages Server Side Event Handler from a Client Side Script
 * by Jeremy Hodge is licensed under a Creative Commons Attribution 3.0 Unported License.
 * http://www.xpagecontrols.com/xpagesblog.nsf/programmatically-triggering-an-xpages-server-side-event-hand.xsp
 * 
 */

// Additional XSP function to trigger an eventhandler server side
// FPR - Librería utilizada en oneUI Custom Control
XSP.executeOnServer = function () {
	// must supply event handler id or we're outta here....
	if (!arguments[0])
		return false;

	// the ID of the event handler we want to execute
	var functionName = arguments[0];

	// OPTIONAL - The Client Side ID that you want to partial refresh after executing the event handler
	var refreshId = (arguments[1]) ? arguments[1] : "@none";
	var form = (arguments[1]) ? this.findForm(arguments[1]) : dojo.query('form')[0];
       
	// catch all in case dojo element has moved object outside of form...
	if (!form)
		form = dojo.query('form')[0];

	// OPTIONAL - Options object contianing onStart, onComplete and onError functions for the call to the
	// handler and subsequent partial refresh
	var options = (arguments[2]) ? arguments[2] : {};

	// OPTIONAL - Value to submit in $$xspsubmitvalue. can be retrieved using context.getSubmittedValue()
	var submitValue = (arguments[3]) ? arguments[3] : '';

	// Set the ID in $$xspsubmitid of the event handler to execute
	dojo.query('[name="$$xspsubmitid"]')[0].value = functionName;
	dojo.query('[name="$$xspsubmitvalue"]')[0].value = submitValue;
	this._partialRefresh("post", form, refreshId, options);
}	