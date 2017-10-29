dojo.require("dijit.ProgressBar");

var xProgress= {
		
	updateInterval : 750, 		//update interval in ms
		
	progressXAgentPath : window.location.href.substring(0, window.location.href.indexOf(".nsf")+4) + "/getProgress.xsp",
	
	timerId : null,
	
	targetNode : null,
	targetNodeId : null,
	progressBar : null,
	
	start : function() {
	
		this.targetNode = dojo.byId(this.targetNodeId);
		
		if (this.targetNode==0) {
			alert("Invalid target node specified for xProgress progress bar");
		}
		
		//setup the dijit progressbar
		if (this.progressBar == null) {
			this.progressBar = new dijit.ProgressBar({id: "myProgressBar", maximum: 100}, this.targetNode);
		} else {
			this.progressBar.update({
				maximum: 100,
				progress: 0
			});
			
		}
			
		this.timerId = setInterval( dojo.hitch(xProgress, "update"), this.updateInterval);
	
	},
	
	stop : function() {
		
		if (this.timerId != null) {
			clearInterval(this.timerId);
			this.timerId = null;
		}
			
		this.progressBar.update({
			progress: 100
		});	
		
	},
	
	update : function() {
		dojo.xhrGet({
			url: this.progressXAgentPath,
			handleAs: "json",
			load: dojo.hitch(xProgress, "dataLoadSuccess"),
			error: dojo.hitch(xProgress, "dataLoadError")
		});
	},
	
	dataLoadSuccess : function(data) {
		this.progressBar.update({
			progress: data.progress
		});	
		
	},
	
	dataLoadError : function(error) {
		this.targetNode.innerHTML = "An unexpected error occurred: " + error;
	}
	
}