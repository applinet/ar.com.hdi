/**Funcion utilizada para crear vehiculos con REST
 */
function restDoc(arrayOfObjects){
	print("Comienza la funcion");
	var jsLog: NotesLog = session.createLog("RESTObjectFunctions Post - Function:restDoc");
	jsLog.openNotesLog("SRVDESA/axin", "AgentLogAutos.nsf");
	jsLog.logAction("SSJS restDoc comenzo. Lenght=" + arrayOfObjects.length);
	var rtnString: String = "["
	for (var i=0; i < arrayOfObjects.length; i++){
		var object = arrayOfObjects[i];
		jsLog.logAction("i restDoc comenzo" + i);
		if (object.unid != undefined){
			jsLog.logAction('unid: ' + object.unid);
			var unidString = object.unid;
			if (object.unid != ''){
				jsLog.logAction('unid2: ' + unidString);
				try{
					var databaseDoc: NotesDocument = database.getDocumentByUNID(unidString);
					jsLog.logAction('Este documento ya se encuentra en la dB');
					//Necesitamos grabar el unid y el veh_Marca para la respuesta
					rtnString = rtnString + "{\"unid\":\"" + object.unid + "\",";
					rtnString = rtnString + "\"veh_Marca\":\"" + object.veh_Marca + "\"},"
					
					if (object.veh_Nro == undefined || object.veh_Nro == null) {
						databaseDoc.replaceItemValue('veh_Nro', 'Nada encontrado');
					} else {
						databaseDoc.replaceItemValue('veh_Nro', object.veh_Nro); //
					}
					
					if (object.veh_Marca == undefined || object.veh_Marca == null) {
						databaseDoc.replaceItemValue('veh_Marca', 'Nada encontrado');
					} else {
						databaseDoc.replaceItemValue('veh_Marca', object.veh_Marca); //
					}
					
					if (object.veh_Modelo == undefined || object.veh_Modelo == null) {
						databaseDoc.replaceItemValue('veh_Modelo', 'Nada encontrado');
					} else {
						databaseDoc.replaceItemValue('veh_Modelo', object.veh_Modelo); //
					}
					
					if (object.veh_SubModelo == undefined || object.veh_SubModelo == null) {
						databaseDoc.replaceItemValue('veh_SubModelo', 'Nada encontrado');
					} else {
						databaseDoc.replaceItemValue('veh_SubModelo', object.veh_SubModelo);
					}
					
					//Multivalues
					if (object.requests == undefined || object.requests == null) {
						databaseDoc.replaceItemValue('requestedItems', 'Nada encontrado');
					} else {
						databaseDoc.replaceItemValue('requestedItems', object.requests); 
					}
					
					databaseDoc.save(true);
					
					
				} catch (e) {
					jsLog.logAction("No se encuentra, enviar para crear > " + rtnString);
					createNewDoc(object);;
				}
			} else{
				jsLog.logAction("No se encuentra, enviar para crear2 > " + rtnString);
				createNewDoc(object);;
			}
		}
	}
	
	rtnString = @LeftBack(rtnString, ','); //me deshago de la ultima coma
	rtnString = rtnString + "]"; // cierro el response del array
	return rtnString;
}

function createNewDoc(object){
	var jsLog: NotesLog = session.createLog("RESTObjectFunctions Post - Function:createNewDoc");
	jsLog.openNotesLog("SRVDESA/axin","AgentLog.nsf");
	jsLog.logAction("SSJS createDoc comenzo" + rtnString);
	// necesitamos crear este documento
	databaseDoc = database.createDocument();
	databaseDoc.replaceItemValue('form','RESTDoc');
	
	if (object.veh_Nro == undefined || object.veh_Nro == null) {
		databaseDoc.replaceItemValue('veh_Nro', 'Nada encontrado');
	} else {
		databaseDoc.replaceItemValue('veh_Nro', object.veh_Nro); //
	}
	
	if (object.veh_Marca == undefined || object.veh_Marca == null) {
		databaseDoc.replaceItemValue('veh_Marca', 'Nada encontrado');
	} else {
		databaseDoc.replaceItemValue('veh_Marca', object.veh_Marca); //
	}
	
	if (object.veh_Modelo == undefined || object.veh_Modelo == null) {
		databaseDoc.replaceItemValue('veh_Modelo', 'Nada encontrado');
	} else {
		databaseDoc.replaceItemValue('veh_Modelo', object.veh_Modelo); //
	}
	
	if (object.veh_SubModelo == undefined || object.veh_SubModelo == null) {
		databaseDoc.replaceItemValue('veh_SubModelo', 'Nada encontrado');
	} else {
		databaseDoc.replaceItemValue('veh_SubModelo', object.veh_SubModelo);
	}
	
	//Multivalues
	if (object.requests == undefined || object.requests == null) {
		databaseDoc.replaceItemValue('requestedItems', 'Nada encontrado');
	} else {
		databaseDoc.replaceItemValue('requestedItems', object.requests); 
	}
	databaseDoc.save(true); //necesitamos grabar el unid para individualrequests docs
	// necesitamos grabar el unid y el coreDataID
	jsLog.logAction("Creado: " + databaseDoc.getUniversalID() + " " + rtnString);
	rtnString = rtnString + "{\"unid\":\"" + databaseDoc.getUniversalID() + "\",";
	rtnString = rtnString + "\"veh_Marca\":\"" + object.veh_Marca + "\"},"
	return rtnString;
}