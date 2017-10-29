/*
 * 
 
 	var myEstado = configEstado (docInspec_prm, strEstadoNuevo_prm);
	var strEstado:String = myEstado.getNom;
	
 * 
 */
var configEstado = function (docTarget_prm:NotesDocument, strEstado_prm:String){ 
    
	//private members
	var strKey:String = docTarget_prm.getItemValueString("Form") + strEstado_prm;
	//print ("key-" + strKey);
	var vEstados:NotesView = getDbCfg().getView ("v.Sys.Estados");
	var docEstado:NotesDocument = vEstados.getDocumentByKey(strKey);
	
	var strNombre:String = docEstado.getItemValueString("est_Nombre_des");
	var strFinal:String = docEstado.getItemValueString("est_Final_opt");
	var vecPrevios:java.util.Vector = docEstado.getItemValue("est_Previos_des");
	
	var booIsFinal = false;
	if (strFinal.equals ("1")) booIsFinal = true;
	
    return {
        //public members
        getNom: strNombre,
        isFinal: booIsFinal,
        getPrevios: vecPrevios
    };
}


function updateEstadoPropuesta (docxProp_prm:NotesXspDocument, strStatus_prm:String) {

	var strEstadoActual:String = docxProp_prm.getItemValueString("sol_status_cod");
	var vecPrevios:java.util.Vector = docxProp_prm.getItemValue("sol_statusHistorico_des");
	vecPrevios.add(strEstadoActual);
	docxProp_prm.replaceItemValue("sol_statusHistorico_des", vecPrevios);
	var myEstadoPrevio = configEstado (docxProp_prm.getDocument(), strEstadoActual);
				
	//Actualizamos el estado de la Propuesta
	var myEstado = configEstado (docxProp_prm.getDocument(), strStatus_prm);
	var strEstado:String = myEstado.getNom;
	docxProp_prm.replaceItemValue("sol_status_cod", strStatus_prm);
	docxProp_prm.replaceItemValue("sol_status_des", strEstado);
	
	setSysLog (docxProp_prm.getDocument(), "Cambiando estado: " + strEstadoActual + " (" + myEstadoPrevio.getNom + ") -> " + strStatus_prm + " (" + myEstado.getNom + ")");
	setLogBackEnd (docxProp_prm.getDocument(), "Envió a Estado: " + strEstado);
	
}

function rollbackEstadoPropuesta (docxProp_prm:NotesXspDocument) {
	//Vuelve la propuesta al estado anterior
	
	var strEstadoCodPrevio:String = docxProp_prm.getItemValue("sol_statusHistorico_des").lastElement().toString();
	updateEstadoPropuesta (docxProp_prm, strEstadoCodPrevio);
	setSysLog (docxProp_prm.getDocument(), "Se devolvió la Propuesta al estado anterior: " + strEstadoCodPrevio);
	
}

function rollbackEstadoPropAntesDeEmision (docxProp_prm:NotesXspDocument) {
	//Vuelve la propuesta al estado anterior que no haya sido "Suspendida" ni "Suspendida Especial"
	
	var vecEstadoCodPrevio:java.util.Vector = docxProp_prm.getItemValue("sol_statusHistorico_des");
	var strEstadoCodPrevio:String;
	var i:int;

	for (i=vecEstadoCodPrevio.size()-1;i>=0;i--) {
		strEstadoCodPrevio = vecEstadoCodPrevio.elementAt(i);
		if (strEstadoCodPrevio.equals ("85") == false && strEstadoCodPrevio.equals ("87") == false) {
			updateEstadoPropuesta (docxProp_prm, strEstadoCodPrevio);
			i=-10; //para que no siga iterando
		}
	}
	
	setSysLog (docxProp_prm.getDocument(), "Se devolvió la Propuesta al estado anterior (distinto de Susp. y Susp. Esp.): " + strEstadoCodPrevio);
	
}


function getEstadoPropuesta (docxProp_prm:NotesXspDocument):String {
	var strEstadoActual:String = docxProp_prm.getItemValueString("sol_status_cod");
	return strEstadoActual;
}

function updateEstadoVeh (docxVeh_prm:NotesXspDocument, strStatus_prm:String) {

	var strEstadoActual:String = docxVeh_prm.getItemValueString("veh_status_cod");
	var vecPrevios:java.util.Vector = docxVeh_prm.getItemValue("veh_statusHis_des");
	vecPrevios.add(strEstadoActual);
	docxVeh_prm.replaceItemValue("veh_statusHis_des", vecPrevios);
	var myEstadoPrevio = configEstado (docxVeh_prm.getDocument(), strEstadoActual);
				
	//Actualizamos el estado del Vehiculo
	var myEstado = configEstado (docxVeh_prm.getDocument(), strStatus_prm);
	var strEstado:String = myEstado.getNom;
	docxVeh_prm.replaceItemValue("veh_status_cod", strStatus_prm);
	docxVeh_prm.replaceItemValue("veh_status_des", strEstado);
	
	setSysLog (docxVeh_prm.getDocument(), "Cambiando estado: " + strEstadoActual + " (" + myEstadoPrevio.getNom + ") -> " + strStatus_prm + " (" + myEstado.getNom + ")");
	
}