var setFrameHref = function(tfKey, tfHref) {
	var t = dijit.byId(tfKey);
	t.attr("onDownloadEnd", function() {
		dojo.parser.parse();
	});
	t.attr("href", tfHref);
}