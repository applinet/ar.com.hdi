

//This SSJS script library consolidates all the validation in one place
//The postValidationError() function flags a control as invalid and provides an error message
//so that the XPages ErrorMessage control is used to display the error on the page.


function validateEmptyField (strFldId:String, strErrorMsg:String):boolean {
	var control = getComponent(strFldId);
	var val = control.getValue();
	var valid = true;
	
	if (isEmpty(val)){
	 	valid = false;
	 	if (!strErrorMsg.equals("")) postValidationError(control,strErrorMsg);
	}
	return valid;
}
  

// *** ----------------------------------------------------------------   ***


/*
 * El código a continuación no debería haber necesidad de modificarlo.
 * */
function postValidationError(control, msg) {
	
if ((typeof msg) != "string")
         return;
 var msgObj = new javax.faces.application.FacesMessage(javax.faces.application.FacesMessage.SEVERITY_ERROR, msg, msg);
 facesContext.addMessage(control.getClientId(facesContext), msgObj);
 control.setValid(false);
}

function isEmpty(o){
	return (@Trim (o).equals ("")) ? true : false;
	//return (o.equals ("##NULL##") || o == null || @Trim($A(o)[0]) == "" ) ? true : false;
}

function $A( object ){
try {
 if( typeof object === 'undefined' || object === null ){ return []; }
 if( typeof object === 'string' ){ return [ object ]; }
 if( typeof object.toArray !== 'undefined' ){return object.toArray();}
 if( object.constructor === Array ){ return object; } 
 return [ object ];
} catch( e ) { Debug.exceptionToPage( e ); }
}
