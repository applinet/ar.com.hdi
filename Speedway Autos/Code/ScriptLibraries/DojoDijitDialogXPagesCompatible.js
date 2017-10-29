/*
This will allow you to place XPages content within the a Dijit Dialog and perform partial/full 
refreshes on the data. The component itself moves the dialog back inside the HTML form so 
that the XSP object can interact with it.

Construct this just like you would a normal dijit.Dialog by either using dojoType="ar.com.hdi.widget.Dialog" or var x = new ar.com.hdi.widget.Dialog({...});
 - See more at: http://openntf.org/XSnippets.nsf/snippet.xsp?id=xpages-compatible-dojo-dijit-dialog
 */
dojo.provide('ar.com.hdi.widget.Dialog');
dojo.require('dijit.Dialog');
 
(function(){
    dojo.declare("ar.com.hdi.widget.Dialog", dijit.Dialog, {
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