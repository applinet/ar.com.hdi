function simplegetSequentialNumber(){
	var jsLog: NotesLog = session.createLog("simplegetSequentialNumber");
	jsLog.openNotesLog(session.getServerName(), getDbLog.getFilePath())
	//jsLog.openNotesLog("SRVDESA/axin", "Speedway/AgentLogAutos.nsf");
	jsLog.logAction("1");
    synchronized(applicationScope){
    	jsLog.logAction("2");
        var newSeqNum:Int = 0;
    	jsLog.logAction("3");
        if (applicationScope.containsKey("seqNumber")){
        	jsLog.logAction("4");
            newSeqNum = applicationScope.get("seqNumber") + 1;
            jsLog.logAction("5");
            applicationScope.put("seqNumber",  newSeqNum);
            jsLog.logAction("6");
            var seqView:NotesView = database.getView("vw_SequentialNumberStore");
            jsLog.logAction("7");
            var seqNumberDoc:NotesDocument = seqView.getFirstDocument();
            jsLog.logAction("8");
            seqNumberDoc.replaceItemValue("seqNumber",applicationScope.get("seqNumber"));
            jsLog.logAction("9");
            seqNumberDoc.save(true,true);
            jsLog.logAction("10");
        } else {
            var seqView:NotesView = database.getView("vw_SequentialNumberStore");
            try {
                var seqNumberDoc:NotesDocument = seqView.getFirstDocument();
                applicationScope.put("seqNumber",seqNumberDoc.getItemValueInteger("seqNumber") + 1);
                seqNumberDoc.replaceItemValue("seqNumber",applicationScope.get("seqNumber"));
                seqNumberDoc.save(true,true);
                newSeqNum = applicationScope.get("seqNumber");
            } catch(e) {
                var seqNumberDoc:NotesDocument = database.createDocument();
                seqNumberDoc.replaceItemValue("Form","cPanel");
                seqNumberDoc.replaceItemValue("seqNumber",1);
                applicationScope.put("seqNumber", 1);
                seqNumberDoc.save(true,true);
                newSeqNum = 1;
            }
        }
    }
    var seqNNNN:String = ("0000" + newSeqNum.toString()).slice(-4);
    return seqNNNN;
};

function GetParameterViewClave2(vista, clave){
	var jsLog: NotesLog = session.createLog("GetParameter");
	jsLog.openNotesLog(session.getServerName(), getDbLog.getFilePath())
	//jsLog.openNotesLog("SRVDESA/axin", "Speedway/AgentLogAutos.nsf");
	jsLog.logAction("1");
	
	var bycat:NotesView = database.getView(vista);
	var entry:NotesViewEntry = bycat.getEntryByKey(clave);
	if (entry == null || entry.getDocument() == null) {
		requestScope.status = "Invalid entry";
		return;
	}
	return entry.getColumnValues()[2];   
	
	
};
function GetParameterViewClave(vista, clave, obtengoCampo){

	var v:NotesView = database.getView(vista);
	var doc:NotesDocument = v.getDocumentByKey(clave);
	if (doc == null) {
		requestScope.status = "No subject starting with that query";
		return;
	}
	return doc.getItemValueString(obtengoCampo);
};

function GetParameterViewClave1(){
	var db:NotesDatabase = session.getDatabase("SRVDESA//axin", "Speedway\\Configuracion.nsf");
	if(db != null){

		var v:NotesView = db.getView("Automoviles\\Articulos");
					
		var doc:NotesDocument = v.getDocumentByKey("N");
		if (doc == null) {
			requestScope.status = "No subject starting with that query";
			return;
		}
		return doc.getItemValueString("form");

		//return db.getTitle();
	}

	/*		
	var db:NotesDatabase = session.getDatabase("", "names.nsf", false);
	return db.getTitle()
	
*/	
};