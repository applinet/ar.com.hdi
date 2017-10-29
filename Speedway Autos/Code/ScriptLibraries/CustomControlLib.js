
 window.onload = function(){
 hijackAndPublishPartialRefresh();
hidestartloader();	  
 }

 
 function hidestartloader(){
	 dojo.query(".divstartloader1").forEach(function(node, index, arr){
		  dojo.fadeOut({
		         node:"startloader",
		         duration:600,
		         onEnd: function(){
		             dojo.style("startloader", "display", "none");
		            }
		     }).play();
		 });
   
 }

function hijackAndPublishPartialRefresh(){
 // Hijack the partial refresh
 XSP._inheritedPartialRefresh = XSP._partialRefresh;
 XSP._partialRefresh = function( method, form, refreshId, options ){  
     // Publish init
     dojo.publish( 'partialrefresh-init', [ method, form, refreshId, options ]);
     this._inheritedPartialRefresh( method, form, refreshId, options );
 }
 
 // Publish start, complete and error states 
 dojo.subscribe( 'partialrefresh-init', function( method, form, refreshId, options ){
  
  if( options ){ // Store original event handlers
   var eventOnStart = options.onStart; 
   var eventOnComplete = options.onComplete;
   var eventOnError = options.onError;
  }

  options = options || {};  
  options.onStart = function(){
   dojo.publish( 'partialrefresh-start', [ method, form, refreshId, options ]);
   if( eventOnStart ){
    if( typeof eventOnStart === 'string' ){
     eval( eventOnStart );
    } else {
     eventOnStart();
    }
   }
  };
  
  options.onComplete = function(){
   dojo.publish( 'partialrefresh-complete', [ method, form, refreshId, options ]);
   if( eventOnComplete ){
    if( typeof eventOnComplete === 'string' ){
     eval( eventOnComplete );
    } else {
     eventOnComplete();
    }
   }
  };
  
  options.onError = function(){
   dojo.publish( 'partialrefresh-error', [ method, form, refreshId, options ]);
   if( eventOnError ){
    if( typeof eventOnError === 'string' ){
     eval( eventOnError );
    } else {
     eventOnError();
    }
   }
  };
 });
 
 dojo.subscribe( 'partialrefresh-start',  function( method, form, refreshId ){
 //loading()
	 //alert('test')
	 dojo.query(".domfindmebutton5999").forEach(function(node, index, arr){
	  if(dojo.isDescendant(node.id, refreshId )) {
	    var thisDijit = dijit.byId(node.id.replace("button5999", ""));
	      thisDijit.destroyRecursive(false);
	    }
	 });
} );

}

multiselectboxcc = {
		"deletevalue" : function (thisvalue, fieldid, valuetoremove, multisep){
	
	 var objecttodelete= dojo.byId(thisvalue);
	 objecttodelete.parentNode.removeChild(objecttodelete);
	 var field1 = dojo.query("." +fieldid);
		 var array1 = field1[0].value.split(multisep);
	if (array1.constructor == Array) {
		 //array1.splice(valuetoremove, 1);
		for( y in array1){
			if(array1[y] == valuetoremove){
				array1.splice(y,1)
			}
			
		}
		 field1[0].value = array1.join(multisep);
	}else{
		field1[0].value = "";
	}
	
	
}

}


//Licensed under http://creativecommons.org/licenses/by/3.0/
//Oringinal Code from Jeremy Hodge on the XPages Blog
//http://xpagesblog.com/xpages-blog/2010/4/10/xpages-compatible-dojo-dialog-reusable-component.html

// com.ZetaOne.Widget.Dialog
dojo.provide('com.ZetaOne.widget.Dialog');
dojo.require('dijit.Dialog');
(function(){
		dojo.declare("com.ZetaOne.widget.Dialog", dijit.Dialog, {
				postCreate: function(){
					this.inherited(arguments);
					dojo.query('form', dojo.body())[0].appendChild(this.domNode);
				},
				_setup: function() {
					this.inherited(arguments);
					if (this.domNode.parentNode.nodeName.toLowerCase() == 'body')
						dojo.query('form', dojo.body())[0].appendChild(this.domNode);				
				}				
		})
}());	

