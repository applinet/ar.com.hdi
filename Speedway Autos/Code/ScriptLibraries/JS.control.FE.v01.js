// Code snippet from Jeremy Hodge
// http://xpagesblog.com/xpages-blog/2009/8/22/checking-for-idle-session-timeout-client-side-and-redirectin.html
// Prevents users returning to a page where they have been logged out which causes error messages due
// to incorrect partial updates etc..
// The function is called on a recurring basis by a timer and on page load
// Just add this script library as a resource to the required xpages
function checkLogin() {
   dojo.xhrGet({
     url : window.location.href.split('.nsf')[0] + ".nsf?opendatabase&login=1",
     handleAs : 'text',
     preventCache : true,
     load : function(response, ioArgs) {
       if (response.indexOf('action="/names.nsf?Login"')!=-1){
         clearInterval();
         window.location.href = window.location.href.split('.nsf')[0] + ".nsf?Login&RedirectTo=" + window.location.href
       }
     },
     error : function(response, ioArgs) {
        // Do any custom error handling here that you want to.
     }
  })
};

///// This code calls it on a recurring basis
dojo.addOnLoad(function(){
    setInterval("checkLogin()", 960000);
}); 