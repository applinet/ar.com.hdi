function sePuedeFacturar () {
	
	if (seFiltroPorInspector () == false) return false;	
	return (hayInspeccionesSeleccionadas ());
	
}

function hayInspeccionesSeleccionadas ():boolean {
	var vecSelected:java.util.Vector = sessionScope.get("viewInsSelection");
	if (vecSelected == null) return (false);
	if (vecSelected.isEmpty()) return (false);
	if (vecSelected.elementAt(0).equals ("")) return (false);
	return true;
}

function seFiltroPorInspector ():boolean {
	
	var strFiltroInspector:String = viewScope.get("filtroInspector");
	if (strFiltroInspector == null) return (false);
	if (strFiltroInspector.equals ("##Todos##")) return (false);
	
	return true;
}

//OJO, el "fc" es por Facturacion.  No por function
function insFcLoadInitialData (docFc:NotesXspDocument) {
	if (docFc.isNewNote() == false) return true;
	
	var vecInsSelected:java.util.Vector = sessionScope.get("viewInsSelection");

	if (vecInsSelected == null) throw new java.lang.Exception("No se encontraron Inspecciones Seleccionadas");
	if (vecInsSelected.isEmpty()) throw new java.lang.Exception("No hay Inspecciones Seleccionadas");
	if (vecInsSelected.elementAt(0).equals("")) throw new java.lang.Exception("Sin Inspecciones para Facturar");
	
	docFc.replaceItemValue("InsUNIDs_FC", vecInsSelected);
	
	var strInsUnid:String = vecInsSelected.elementAt(0);
	var dbIns:NotesDatabase = getDbInspecciones();
	var docIns:NotesDocument = dbIns.getDocumentByUNID(strInsUnid);
	
	var myInspector = swInspector (docIns);
	docFc.replaceItemValue("Inspector_FC", myInspector.getNom);
	docFc.replaceItemValue("KM_Valor_FC", myInspector.getValKM);
	
	var docIns:NotesDocument;
	var intSumaIns:int = 0;
	var vecCodes:java.util.Vector = new java.util.Vector();
	var vecCons:java.util.Vector = new java.util.Vector();
	for (var i=0; i<vecInsSelected.size(); i++) {
		strInsUnid = vecInsSelected.elementAt(i);
		docIns = dbIns.getDocumentByUNID(strInsUnid);
		intSumaIns += docIns.getItemValueInteger("ins_iValor_nro");
		
		vecCodes.add(docIns.getItemValueString("ins_Componente_cod"));
		vecCons.add(docIns.getItemValueString("ins_Consecutivo_des"));
	}
	docFc.replaceItemValue("ImpSumaIns_FC", intSumaIns)
	docFc.replaceItemValue("InsCodes_FC", vecCodes)
	docFc.replaceItemValue("InsConsecutivos_FC", vecCons)
}

function insFcValidarDatos (docFc:NotesXspDocument):boolean {
	var booIsValid:boolean = true;

	viewScope.put("datosValidados", "0");

	//Validamos los datos ingresados
	if (!validateEmptyField ("numero_FC1", "Ingrese el Número de Factura")) {
		booIsValid = false;
	}
	if (!validateEmptyField ("kM_Count_FC1", "Ingrese la Cantidad de Kilometros")) {
		booIsValid = false;
	}
	if (!validateEmptyField ("impAdicional_FC1", "Ingrese el Importe Adicional")) {
		booIsValid = false;
	}
	if (!validateEmptyField ("impTotalSinIVA_FC1", "Ingrese el Importe Total sin IVA")) {
		booIsValid = false;
	}
	
	if (booIsValid == false) return false;
	
	//Validamos la coherencia en las sumas
	var intKmCount = getComponent ("kM_Count_FC1").getValue();
	var intKmVal = docFc.getItemValueInteger ("KM_Valor_FC");
	var intKmImporte = intKmCount*intKmVal;
	docFc.replaceItemValue ("ImpKM_FC", intKmImporte);
	
	var intSumaIns = docFc.getItemValueInteger ("ImpSumaIns_FC");
	var intImpAdicional = getComponent ("impAdicional_FC1").getValue();
	var intSumaTotal = intImpAdicional + intSumaIns + intKmImporte;
	docFc.replaceItemValue ("ImpSumaTotal_FC", intSumaTotal);
	
	var impTotalIngresado = getComponent ("impTotalSinIVA_FC1");
	var intImpTotalIngresado = impTotalIngresado.getValue();
	if (intImpTotalIngresado != intSumaTotal) {
		postValidationError (impTotalIngresado, "El Importe Total sin IVA no coincide con la Suma de Importes")
		return false;
	}
	
	//Validamos que las inspecciones sigan sin factura
	//Ya que podría ocurrir que al mismo tiempo, otra persona asoció las inspecciones
	//Con una factura.
	var dbInspecciones:NotesDatabase = getDbInspecciones();
	var vecInsUnids:java.util.Vector = docFc.getItemValue("InsUNIDs_FC");
	var strInsUnid:String = "";
	var docIns:NotesDocument;
	var strFcNro:String = "";
	var strInsCons:String = "";
	
	for (var i=0; i<vecInsUnids.size(); i++) {
		strInsUnid = vecInsUnids.elementAt(i);
		docIns = dbInspecciones.getDocumentByUNID(strInsUnid);	
		
		strInsCons = docIns.getItemValueString ("ins_Consecutivo_des");
		strFcNro = docIns.getItemValueString ("ins_iFcNro_des");
		if (!strFcNro.equals ("")) {
			postValidationError (impTotalIngresado, "La inspección " + strInsCons + " fue asociada a una factura mientras se confeccionaba esta.  Se debe reiniciar el proceso.");
			return false;
		}

	}
	
	
	viewScope.put("datosValidados", "1");
	return true;
}

function insFcIngresar (docFc:NotesXspDocument) {
	var dbInspecciones:NotesDatabase = getDbInspecciones();
	var vecInsUnids:java.util.Vector = docFc.getItemValue("InsUNIDs_FC");
	var strInsUnid:String = "";
	var docIns:NotesDocument;

	var strFcCode:String = docFc.getItemValueString("Code_FC");
	var strFcNro = getComponent ("numero_FC1").getValue();
	
	for (var i=0; i<vecInsUnids.size(); i++) {
		strInsUnid = vecInsUnids.elementAt(i);
		docIns = dbInspecciones.getDocumentByUNID(strInsUnid);	
		
		docIns.replaceItemValue ("ins_iFcCode_des", strFcCode);
		docIns.replaceItemValue ("ins_iFcNro_des", strFcNro);
		insLogBackEnd (docIns, "Facturación realizada: " + strFcNro + " - " + strFcCode);
		docIns.save (false, false);
		
	}
}

function insFcEliminar (docFc:NotesXspDocument) {
	var dbInspecciones:NotesDatabase = getDbInspecciones();
	var vecInsUnids:java.util.Vector = docFc.getItemValue("InsUNIDs_FC");
	var strInsUnid:String = "";
	var docIns:NotesDocument;
	var docFcBackEnd:NotesDocument = docFc.getDocument();
	
	var strFcCode:String = docFc.getItemValueString("Code_FC");
	var strFcNro:String = docFc.getItemValueString("Numero_FC");
		
	for (var i=0; i<vecInsUnids.size(); i++) {
		strInsUnid = vecInsUnids.elementAt(i);
		docIns = dbInspecciones.getDocumentByUNID(strInsUnid);	
		
		docIns.replaceItemValue ("ins_iFcCode_des", "");
		docIns.replaceItemValue ("ins_iFcNro_des", "");
		insLogBackEnd (docIns, "Facturación Cancelada: " + strFcNro + " - " + strFcCode);
		docIns.save (false, false);
		
	}
	
	var dtHoy:NotesDateTime = session.createDateTime(@Text(@Now()))
	docFcBackEnd.replaceItemValue("FormOriginal", docFc.getItemValueString("Form"));
	docFcBackEnd.replaceItemValue("Form", "f.Trash");
	docFcBackEnd.replaceItemValue("DeletedDate", dtHoy);
	docFcBackEnd.replaceItemValue("DeletedBy", @UserName());
	docFcBackEnd.save(false, false);
}