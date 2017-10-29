function getConf_srv_db_view_key_campoObtengo(server, base, vista, clave, campoObtengo){
	/*30/04/2013 - FPR
	 *Obtengo en valor de un campo en un documento pasando: server, base, vista, clave y nombre de campo a obtener 
	 */		
	var db:NotesDatabase = session.getDatabase(server, base);
	if(db == null){	
		return "No local address book";
		//AgentLogAutos("SSJS_SJS.log.BE.v01_1",1,"database:"+ base + " is null")
	}else{
		var v:NotesView = db.getView(vista);
		if(v == null){AgentLogAutos("SSJS_SJS.log.BE.v01_1",1,"view:" + vista + " is null")}
		else{
			var doc:NotesDocument = v.getDocumentByKey(clave);
			if (doc == null){AgentLogAutos("SSJS_SJS.log.BE.v01_1",1,"key:" + clave + " doc is null")}
			else{
				return doc.getItemValueString(campoObtengo);
			};				
		};
	};	
};

function getDbServerPath(server, base){
	var db:NotesDatabase = session.getDatabase(server, base);
	if(db == null){	AgentLogAutos("SSJS_SJS.log.BE.v01_1",1,"database:"+ base + " is null")}
	else{
		return db.getTitle();
	};
};




