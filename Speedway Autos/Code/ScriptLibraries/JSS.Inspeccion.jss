var vecVehFieldsComponente:java.util.Vector = new java.util.Vector;
var vecVehFieldsIns:java.util.vecVehFieldsInsr = new java.util.Vector;

function loadInitialData (docInspec:NotesXspDocument) {
	var docCur:NotesDocument = docInspec.getDocument();

	var strPreviaMailUnid:String = context.getUrlParameter("Previa");
	var strProdMailUnid:String = context.getUrlParameter("Productor");
	var strTipo:String = "";
	
	//Determinamos el tipo de inspección.
	if (!strProdMailUnid.equals ("")) {
		strTipo = "30";
		docInspec.setValue("ins_ProdMailUnid_des", strProdMailUnid);
		docInspec.setValue("ins_iEst_cod", "30"); //Estado Inspeccionada
	}
	else {
		if (!strPreviaMailUnid.equals ("")) {
				strTipo = "20";
				docInspec.setValue("ins_PreviaMailUnid_des", strPreviaMailUnid);
		}
		else strTipo = "10";
	}
	docInspec.setValue("ins_Tipo_cod", strTipo);
	docInspec.setValue("ins_Tipo_des", getOptionLabel ("Inspeccion-Tipo", strTipo));
	
	
	//Busco el nombre de estado que le corresponde al código de estado que está asignado.
	docInspec.setValue("ins_iEst_des", getInsEstadoNom (docInspec.getValue("ins_iEst_cod")));
	
	if (strTipo.equals ("10")) getVehiculoAndPropuesta (docInspec);
	
}


function getVehiculoAndPropuesta (docInspec:NotesXspDocument) {
	
	//Seteo el código de vehiculo obteniendolo del parámetro de la URL
	var strVeh = context.getUrlParameter("veh");
	docInspec.setValue("ins_Veh_cod", strVeh);
	
	if (strVeh.equals("")) throw new java.lang.Exception("No llegó el código del vehiculo");
	
	
	//Busco los campos del vehiculo
	var vVehiculos:NotesView = getDbVeh().getView ("v.Sys.Veh");
	var docVeh:NotesDocument = vVehiculos.getDocumentByKey(strVeh);
	
	if (docVeh == null) {
		throw new java.lang.Exception("El código de vehiculo no fue encontrado: " + strVeh); 
	}
	
	
	setVehFields (docInspec, docVeh);
			
	//Busco los campos de la propuesta
	var strPropuestaUNID:String = docVeh.getItemValueString("idPadre_cod");
	var docProp:NotesDocument = getDbPropuestas().getDocumentByUNID(strPropuestaUNID);
	
	if (docProp == null) {
		throw new java.lang.Exception("El código de la propuesta no fue encontrado: -" + strPropuesta + "-"); 
	}
	
	docInspec.setValue("ins_Prop_nro", docProp.getItemValueInteger("orden_nro"));
	
	//Busco campos del asegurado y del Productor
	var strAsegCod:String = docProp.getItemValueString("sol_asegurado_cod");
	var strAsegDes:String = docProp.getItemValueString("sol_asegurado_des");
	var strProdCod:String = docProp.getItemValueString("sol_productor_cod");
	var strProdDes:String = docProp.getItemValueString("sol_productor_des");
	
	docInspec.setValue("ins_Aseg_cod", strAsegCod);
	docInspec.setValue("ins_Aseg_des", strAsegDes);
	docInspec.setValue("ins_Prod_cod", strProdCod);
	docInspec.setValue("ins_Prod_des", strProdDes);
	
	//Buscamos mail del productor.
	if (!strProdCod.equals ("")) {
		var vProductores:NotesView = getDbProductores ().getView ("v.Sys.CT.Code");
		var docProductor:NotesDocument = vProductores.getDocumentByKey(strProdCod);
		if (docProductor!=null) {
			docInspec.replaceItemValue("ins_ProdMail_des", @Unique (docProductor.getItemValue("procesoEmail")))
		}
	}
	
	
	//Tengo que escribir el doc de back end para que el agente siguiente vea el dato.
	docCur.replaceItemValue("ins_Aseg_cod", strAsegCod);
	getDbInspecciones ().getAgent("a.InspecQueryOpen").runWithDocumentContext(docInspec.getDocument());
	
	//Tenemos que hacer estas 4 lineas porque sino luego de grabar el documento, los valores se pierden
	docInspec.setValue("ins_AsegDomDir_des", docCur.getItemValueString("ins_AsegDomDir_des"));
	docInspec.setValue("ins_AsegDomLoc_des", docCur.getItemValueString("ins_AsegDomLoc_des"));
	docInspec.setValue("ins_AsegDomProv_des", docCur.getItemValueString("ins_AsegDomProv_des"));
	docInspec.setValue("ins_AsegDomProv_cod", docCur.getItemValueString("ins_AsegDomProv_cod"));
	docInspec.setValue("ins_AsegDomCodPostal_des", docCur.getItemValueString("ins_AsegDomCodPostal_des"));
}


function setVehFields (docInspec:NotesXspDocument, docVeh:NotesDocument) {
	
	insVehLoadFields();	
	
	for (i=0; i<vecVehFieldsComponente.size(); i++) {
		
		strFrom = vecVehFieldsComponente.elementAt(i);
		strTo = vecVehFieldsIns.elementAt(i);
		
		docInspec.setValue(strTo, docVeh.getItemValueString(strFrom));
			
	}
	//Se Busca el label de la cobertura y asignarla al campo
	var mapCoberturas:java.util.HashMap = getMapCoberturas ();
	docInspec.setValue("ins_vehCobSol_des", mapCoberturas.get(docVeh.getItemValueString("veh_cobertura_cod")));
	docInspec.setValue("ins_Veh_nro", docVeh.getItemValueInteger("veh_componente_nro"));
		
}

function sePuedeEliminar (docInspec:NotesXspDocument) {
	
	if (docInspec.isEditable() == true) return false;
	
	if (docInspec.getItemValueString("ins_iEst_cod").equals("10") == false) return false;
	
	return true;
	
}

function sePuedeEditar (docInspec:NotesXspDocument) {
	if (docInspec.isEditable() == true) return false;
	
	if (docInspec.getItemValueString("ins_Final_des").equals("1")) return false;
	
	return true;
	
}

function sePuedeEnviarInspector (docInspec:NotesXspDocument) {
	
	if (docInspec.isEditable() == false) return false;
	
	return isInsEstadoPrevio (docInspec.getItemValueString("ins_iEst_cod"), "20");
	
}

function sePuedeEnviarComercial (docInspec:NotesXspDocument) {
	
	if (docInspec.isEditable() == false) return false;

	return isInsEstadoPrevio (docInspec.getItemValueString("ins_iEst_cod"), "80");
	
}

function sePuedeFinalizar (docInspec:NotesXspDocument) {
	
	if (docInspec.isEditable() == false) return false;
		
	//Sólo se puede Finalizar si está Inspeccionada.
	if (docInspec.getItemValueString("ins_iEst_cod").equals("30")) return true;
	else return false;
	
}

function sePuedeClonar (docInspec:NotesXspDocument) {
	
	/*
	 * Devuelve FALSE si está en modo edición
	 * o si es de tipo Productor
	 * o si no se encuentra en un estado final.
	 * */
	if (docInspec.isEditable() == true) return false;
	if (docInspec.getItemValueString("ins_Tipo_cod").equals ("30")) return false;
	if (docInspec.getItemValueString("ins_Final_des").equals("1")) return true;
	
	return false;
	
}

function sePuedeEditarPropuesta (docInspec:NotesXspDocument) {
	if (docInspec.getItemValueString("ins_Tipo_cod").equals ("30")) return true;
	if (docInspec.getItemValueString("ins_Tipo_cod").equals ("20")) return true;
	return false;
}
function sePuedeEditarVehiculo (docInspec:NotesXspDocument) {
	if (docInspec.getItemValueString("ins_Tipo_cod").equals ("30")) return true;
	if (docInspec.getItemValueString("ins_Tipo_cod").equals ("20")) return true;
	return false;
}
function sePuedeEditarRelevamiento (docInspec:NotesXspDocument) {
	//Solo se puede editar en estado Borrador o en estado En Comercial
	if (docInspec.getItemValueString("ins_iEst_cod").equals ("10")) return true;
	if (docInspec.getItemValueString("ins_iEst_cod").equals ("80")) return true;
	return false;
}
function sePuedeEditarInspeccion (docInspec:NotesXspDocument) {
	//Solo se puede editar en estado Inspeccionada
	if (docInspec.getItemValueString("ins_iEst_cod").equals ("30")) return true;
	return false;
}

function getInsEstadoDoc (strEstCode:String):NotesDocument {
	
	var strKey = document1.getValue("Form") + strEstCode;
	var vEstados:NotesView = getDbCfg().getView ("v.Sys.Estados");
	var docEstado:NotesDocument = vEstados.getDocumentByKey(strKey);
	
	return docEstado;
}
function getInsEstadoNom (strEstCode:String):String {
	var docEstado:NotesDocument = getInsEstadoDoc (strEstCode);
	var strEstado:String = docEstado.getItemValueString("est_Nombre_des");
	return strEstado;
}
function getInsEstadosPrevios (strEstCode:String):Vector {
	var docEstado:NotesDocument = getInsEstadoDoc (strEstCode);
	var vecEstados:String = docEstado.getItemValue("est_Previos_des");
	return vecEstados;
}
function isInsEstadoPrevio (strEstCodCurrent:String, strEstCodeNew:String):boolean {
	var vecEstados:Vector = getInsEstadosPrevios (strEstCodeNew);
	if (vecEstados.contains (strEstCodCurrent)) {
		return true;
	}
	else {
		return false;
	}
}
function isInsEstadoFinal (strEstCode:String):boolean {
	var docEstado:NotesDocument = getInsEstadoDoc (strEstCode);
	var strFinal:String = docEstado.getItemValueString("est_Final_opt");
	
	if (strFinal.equals ("1")) {
		return true;
	}
	else {
		return false;
	}
}
function verifyInsEstadoFinal (strEstCode:String) {
	if (isInsEstadoFinal (strEstCode)) {		
		currentDocument.replaceItemValue("ins_Final_des", "1");
	}
	else currentDocument.replaceItemValue("ins_Final_des", "");		
}

//Esta función determina si se muestra o no el botón Editar general de la xpage.
function allowInspeccionEdit():boolean {
	//return false;
	if (document1.isNewNote()) return true;
	if (unBlockAllowed() == false) return false;
	if (isUserSystem ()) return true;
	if (isUserAutos ()) return true;
	
	return false;
}

function setInsEstado (docInspec_prm:NotesDocument, strEstadoNuevo_prm:String, strAction_prm:String) {
	
	itemLog = docInspec_prm.getFirstItem("ins_Log_des");
	
	var myEstado = configEstado (docInspec_prm, strEstadoNuevo_prm);
	var strEstado:String = myEstado.getNom;
	var strEstadoActual:String = docInspec_prm.getItemValueString("ins_iEst_cod");
	
	
	//Por algun motivo, el campo iEst hay que setearlo con currentDocument, sino no 
	//toma la modificación cuando el documento todavìa nunca fue grabado.
	currentDocument.setValue("ins_iEst_des", strEstado)
	docInspec_prm.replaceItemValue("ins_iEst_des", strEstado);
	docInspec_prm.replaceItemValue("ins_iEst_cod", strEstadoNuevo_prm);
	docInspec_prm.replaceItemValue("ins_iEstRegreso_cod", strEstadoActual);
	
	setLog (itemLog, strAction_prm);
}


//swInspector: SpeedWay Inspector
var swInspector = function (docIns_param:NotesXspDocument){ 
	
	var vecNom:Vector = docIns_param.getItemValue("ins_Inspect_opt");
	var vInspec:NotesView = getDbInspectores().getView ("People");
	var docInspec:NotesDocument = vInspec.getDocumentByKey(vecNom);
	var strInspectorMail:String = docInspec.getItemValueString("MailAddress");	
	var strInspectorEnviar:String = docInspec.getItemValueString("InsEnviar_CT");

	var intValorRea:Integer = docInspec.getItemValueInteger("InsValRea_CT");
	var intValorReaNo:Integer = docInspec.getItemValueInteger("InsValReaNo_CT");
	var intValorFactNo:Integer = docInspec.getItemValueInteger("InsValFactNo_CT");
	var intValorKM:Integer = docInspec.getItemValueInteger("InsValKM_CT");

    return {
        //public members
    	getNom: vecNom,
        getMail: strInspectorMail,
        getValRea: intValorRea,
        getValReaNo: intValorReaNo,
        getValFactNo: intValorFactNo,
        getValKM: intValorKM,
        getEnviar: strInspectorEnviar
    };
}

function insClonar (docIns_prm:NotesDocument) {
	
	var docNew:NotesDocument = docIns_prm.copyToDatabase(docIns_prm.getParentDatabase());
	
	docNew.replaceItemValue("ins_Log_des", "");
	docNew.replaceItemValue("ins_Componente_cod", session.evaluate("@Unique"));
	docNew.replaceItemValue("ins_Consecutivo_des", "");
	docNew.replaceItemValue("ins_Consecutivo_nro", "");
	docNew.replaceItemValue("ins_Contador_nro", "");
	docNew.replaceItemValue("ins_Final_des", "");
	docNew.replaceItemValue("ins_iEnvioFecha_dat", "");
	docNew.replaceItemValue("ins_iEstRegreso_cod", "");
	docNew.replaceItemValue("ins_iFcNro_des", "");
	docNew.replaceItemValue("ins_iValor_nro", "");
	
	setInsEstado (docNew, "10", "Clonada de " + docIns_prm.getItemValueString("ins_Consecutivo_des"))
	session.getCurrentDatabase().getAgent("a.ObtCorrSinSave").runWithDocumentContext(docIns_prm);
	
	docNew.computeWithForm(false, false);
	docNew.save();
	insPostSave (docNew);
}

function insQuerySave (docIns_prm:NotesXspDocument, booDelTempFields:boolean) {

	var docIns:NotesDocument = docIns_prm.getDocument();
	verifyInsEstadoFinal (docIns.getItemValueString("ins_iEst_cod"));

	if (booDelTempFields) {
		//Eliminamos Campos Temporales
		docIns_prm.removeItem("ins_inputComIns_des");
		docIns_prm.removeItem("ins_inputComComer_des");
		docIns_prm.removeItem("ins_inputComAutos_des");
		docIns_prm.removeItem("ins_inputComProd_des");
	}
	
	
	//Consecutivo General de Inspecciones
	var strCons:String = docIns.getItemValueInteger("ins_Consecutivo_nro").toString();
	if (strCons.equals("") || strCons.equals ("0")) {
		session.getCurrentDatabase().getAgent("a.ObtCorrSinSave").runWithDocumentContext(docIns);
	}
	
	var strTipo:String = docIns_prm.getItemValueString("ins_Tipo_cod");
	if (strTipo.equals ("10")) insQuerySaveComun (docIns);
	else insQuerySavePreProd (docIns_prm);
			
}

function insQuerySaveComun (docIns_prm:NotesXspDocument) {
	//Contador de inspecciones por vehiculo
	var strCont:String = docIns.getItemValueInteger("ins_Contador_nro").toString();
	if (strCont.equals("") || strCont.equals("0")) {

		var intInsNro:Integer;
		var strVeh:String = docIns.getItemValueString("ins_Veh_cod");
		var vVehiculos:NotesView = getDbVeh().getView ("v.Sys.Veh");
		var docVeh:NotesDocument = vVehiculos.getDocumentByKey(strVeh);

		if (docVeh == null) {
			throw new java.lang.Exception("El código de vehiculo no fue encontrado: " + strVeh + " - " + sessionScope.get("strVehDbPath")); 
		}
		else {
			if (false == docVeh.hasItem("veh_inspeccionCount_nro")) {
				intInsNro = 1;
			}
			else {
				intInsNro = docVeh.getItemValueInteger("veh_inspeccionCount_nro");
				intInsNro++;
			}
			docVeh.replaceItemValue("veh_inspeccionCount_nro", intInsNro);
			docIns.replaceItemValue("ins_Contador_nro", intInsNro);
			docVeh.save();
		}
	}
}

//Inspección - Query Save - Tipo Previa o Tipo Productor
function insQuerySavePreProd (docIns_prm:NotesXspDocument) {
	if (docIns_prm.isNewNote() == false) return;
	
	var strTipo = docIns_prm.getItemValueString("ins_Tipo_cod");
	var strMailUnid:String = "";
	var strAction:String = "Vinculación por inspección ";
	
	if (strTipo.equals ("20")) {
		strMailUnid = docIns_prm.getItemValueString ("ins_PreviaMailUnid_des");
		strAction += "Previa";
	}
	else {
		strMailUnid = docIns_prm.getItemValueString ("ins_ProdMailUnid_des");
		strAction += "Productor";
	}
	
	var dbMails:NotesDatabase = getDbMails ();
	var docMail:NotesDocument = dbMails.getDocumentByUNID(strMailUnid);
	
	docMail.replaceItemValue("MyMailAction", strAction);
	linkMailWithDoc (docMail, docIns_prm.getItemValueString("ins_Componente_cod"), true, false, true);
	
}


function insPostSave (docIns_prm:NotesDocument) {
	/*
	 * Este método no sólo se llama en el query save de la inspección, sino
	 * en la función insClonar.
	 * */
	
	//Redirect
	
	context.redirectToPage("viewIns_Todas.xsp?OpenXPage?OpenXPage", true);
	return;
	
	
	
	/* CÓDIGO DE ABAJO CANCELADO, REDIRIJO SIEMPRE A TODAS.*/
	
	var strTipo:String = docIns_prm.getItemValueString("ins_Tipo_cod");
	
	//Si no es comun, redirije y termina la función
	if (!strTipo.equals("10")) {
		context.redirectToPage("viewIns_Todas.xsp?OpenXPage?OpenXPage", true);
		return;
	}
	
	var strVeh:String = context.getUrlParameter("veh");
	if (strVeh.equals ("")) {
		strVeh = docIns_prm.getItemValueString("ins_Veh_cod");
	}

	context.redirectToPage("viewInsVeh?OpenXPage&veh=" + strVeh, true);
}

function insTieneMailsVinculados (docIns_prm:NotesDocument) {
	var vMails:NotesView = getDbMails().getView ("v.Sys.MailsLinked");
	var docMail:NotesDocument = vMails.getDocumentByKey(docIns_prm.getItemValueString("ins_Componente_cod"));
	if (docMail == null) return false;
	return true;

}

function eliminarInspeccion (docIns_prm:NotesXspDocument) {
	var docIns:NotesDocument = docIns_prm.getDocument();
	var dtHoy:NotesDateTime = session.createDateTime(@Text(@Now()))

	removeMailLinks (docIns.getItemValueString("ins_Componente_cod"));
	docIns.replaceItemValue("FormOriginal", docIns.getItemValueString("Form"));
	docIns.replaceItemValue("Form", "f.Trash");
	docIns.replaceItemValue("DeletedDate", dtHoy);
	docIns.replaceItemValue("DeletedBy", @UserName());
	insLog (docIns_prm, "Documento eliminado");
	docIns.save(false, false);
	context.redirectToPage("viewIns_Todas.xsp?OpenXPage?OpenXPage", true);
}

function insLog (docIns_prm:NotesXspDocument, strLog_prm:String) {
	var itemLog:NotesItem = docIns_prm.getDocument().getFirstItem("ins_Log_des");
	setLog (itemLog, strLog_prm);
}
function insLogBackEnd (docIns_prm:NotesDocument, strLog_prm:String) {
	var itemLog:NotesItem = docIns_prm.getFirstItem("ins_Log_des");
	setLog (itemLog, strLog_prm);
}


/*
 * Diego Liberman - 2013/09/24
 * 
 * Carga 2 vectores que contienen los nombres de los campos del Vehiculo y sus correspondientes
 * en la inspección.
 * 
 * */
function insVehLoadFields () {
	
	if (vecVehFieldsComponente.size() > 0) return;
	
	vecVehFieldsComponente.add("veh_marca_cod");
	vecVehFieldsIns.add("ins_VehMarca_cod");
	vecVehFieldsComponente.add("veh_marca_des");
	vecVehFieldsIns.add("ins_VehMarca_des");

	vecVehFieldsComponente.add("veh_modelo_cod");
	vecVehFieldsIns.add("ins_VehModelo_cod");
	vecVehFieldsComponente.add("veh_modelo_des");
	vecVehFieldsIns.add("ins_VehModelo_des");

	vecVehFieldsComponente.add("veh_subModelo_cod");
	vecVehFieldsIns.add("ins_VehSubModelo_cod");
	vecVehFieldsComponente.add("veh_submodelo_des");
	vecVehFieldsIns.add("ins_VehSubModelo_des");
	
	vecVehFieldsComponente.add("veh_anio_nro");
	vecVehFieldsIns.add("ins_VehAnio_cod");
	
	//vecVehFieldsComponente.add("veh_patenteTipo_cod");
	//vecVehFieldsIns.add("ins_VehPatTipo_cod");

	vecVehFieldsComponente.add("veh_patente_des");
	vecVehFieldsIns.add("ins_VehPatNro_des");

	vecVehFieldsComponente.add("veh_chasis_des");
	vecVehFieldsIns.add("ins_VehChasis_des");

	vecVehFieldsComponente.add("veh_motor_des");
	vecVehFieldsIns.add("ins_VehMotor_des");
	
	vecVehFieldsComponente.add("veh_cobertura_cod");
	vecVehFieldsIns.add("ins_vehCobSol_cod");
	vecVehFieldsComponente.add("veh_cobertura_des");
	vecVehFieldsIns.add("ins_vehCobSol_des");
	
	//vecVehFieldsComponente.add("veh_cobertura_cod");
	//vecVehFieldsIns.add("ins_iCobAprob_cod");
	//vecVehFieldsComponente.add("veh_cobertura_des");
	//vecVehFieldsIns.add("ins_iCobAprob_des");
	
}

/*
 * Diego Liberman - 2013/09/24
 * 
 * Actualiza los campos del vehiculo desde la Inspección al Dialog o viceversa, según el 
 * orden en que recibió por parámetro los vectores.
 * 
 * Los campos en la Inspección y en el Dialog, pueden estar ocultos.
 * Por eso, se precisa también recibir por parámetro los Documentos.
 * La función intenta trabajar con los componentes, pero si es null, lo busca en el Documento.
 * 
 * */
function insVehSyncFields (vecFrom:java.util.Vector, vecTo:java.util.Vector, docFrom:NotesXspDocument, docTo:NotesXspDocument) {
	
	var strFrom:String, strTo:String, strValue:String;
	
	//PRECARGA DE VALORES QUE EXISTÍAN EN LA INSPECCIÓN
	insVehLoadFields();
	
	for (i=0; i<vecFrom.size(); i++) {
		
		strFrom = vecFrom.elementAt(i);
		strTo = vecTo.elementAt(i);
		
		comFrom = getComponent (strFrom);
		if (comFrom != null) strValue = comFrom.getValue(); //Puede ser Null si el campo está oculto
		else strValue = docFrom.getItemValueString(strFrom);
		
		comTo = getComponent (strTo);
		if (comTo != null) comTo.setValue (strValue);
		else docTo.replaceItemValue (strTo, strValue);
			
	}
	
}

/*
 * Diego Liberman - 2013/09/24
 * 
 * Llama al dialog para agregar un vehiculo.
 * Luego de abrir el dialog, precarga los valores que existían en la Inspección.
 * Luego ejecuta los eventos OnChange del Dialog
 * 
 * */
function insVehAdd (docXspIns:NotesXspDocument) {
	
	viewScope.newVeh_Dialog.accionInvocada = "Alta";
	viewScope.newVeh_Dialog.patente = "Ingresar Patente";
	viewScope.newVeh_Dialog.showInputComponente = "false";
	viewScope.newVeh_Dialog.buttonValidarVehiculoVisible = false;
	viewScope.newVeh_Dialog.dialogComponenteTitle = "Vehículo";
	viewScope.PNL_CargaDatosVehiculos = false;
	viewScope.VehSelectedUNID = "";


	viewScope.put("PNL_Veh_modelo_cod",false);
	viewScope.put("PNL_Veh_submodelo_cod",false);
	viewScope.put("PNL_Veh_anio_cod",false);
	viewScope.PNL_DialogCabeceraDatosVehiculosRead = false;
	getComponent('dialogComponente').show();
	getComponent("veh_marca_cod").setValue("- Seleccionar -");
	getComponent("veh_modelo_cod").setValue("- Seleccionar -");
	getComponent("veh_submodelo_cod").setValue("- Seleccionar -");
	getComponent("veh_anio_cod").setValue("- Seleccionar -");
	
	//Sincronizar campos del vehiculo - Desde la Inspección hacia el Dialog
	//insVehSyncFields (vecVehFieldsIns, vecVehFieldsComponente, docXspIns);
	
	
	return;
	
	//LLAMAMOS AL DIALOG
	viewScope.newVeh_Dialog.put("accionInvocada", "Alta");
	// Funcion en JSS.veh.general
	DIEGO_onChangeDialogNuevoComponente("inicial", "veh_Marca", "temp_veh_marca_cod");
	
	//Sincronizar campos del vehiculo - Desde la Inspección hacia el Dialog
	insVehSyncFields (vecVehFieldsIns, vecVehFieldsComponente, docXspIns);
	
	//ONCHANGEs del DIALOG
//F	onChangeDialogNuevoComponente('veh_marca_cod', 'veh_Modelo', 'temp_veh_modelo_cod')
//F	onChangeDialogNuevoComponente('veh_modelo_cod', 'veh_SubModelo', 'temp_veh_subModelo_cod');
//F	onChangeDialogNuevoComponente('veh_subModelo_cod', 'veh_Anio', 'temp_veh_anio_cod');
	viewScope.newVeh_Dialog.put("showInputComponente", "true");
//F	onChangeDialogNuevoComponente('veh_anio_cod', '', '');
	
}


/*
 * Diego Liberman - 2013/09/24
 * 
 * No hay mucha ciencia, actualiza los campos.
 * 
 * */
function insVehOK (docXspIns:NotesXspDocument) {
	
	insVehSyncFields (vecVehFieldsComponente, vecVehFieldsIns, docXspIns);
	
}

/*
 * Diego Liberman - 2013/09/24
 * 
 * Función temporal para testing.
 * 
 * */
function DIEGO_onChangeDialogNuevoComponente(strControlName:String, strScopeToFill:String, strFieldValueToScope:String){
	/*Utilizada en: ccDialogNuevoComponente  
	 * Parametros:
	 * strControlName: Nombre del control que ejecuta esta accion
	 * strScopeToFill: RequestScope en la que voy a asigar los valores que tomará el siguiente control
	 * strFieldValueToScope: Nombre del campo temporal que tendra los datos a pasar a RequestScope
	 */
	var tempDoc:NotesDocument = database.createDocument();
	tempDoc.replaceItemValue("tempOnChange",strControlName);
	//getComponent("idPadre_cod").setValue(context.getUrlParameter('documentId'));
	if (strControlName.equals('editar')){
		//getComponent("veh_marca_cod").setValue("AUD");
		//getComponent("veh_modelo_cod").setValue("A3");
		//getComponent("veh_subModelo_cod").setValue("ACK");
		//getComponent("veh_anio_cod").setValue("2005");
	}
	if (!strControlName.equals('inicial') ){
		tempDoc.replaceItemValue("temp_veh_marca_cod",getComponent('veh_marca_cod').getValue());
		tempDoc.replaceItemValue("temp_veh_modelo_cod",getComponent('veh_modelo_cod').getValue());
		tempDoc.replaceItemValue("temp_veh_subModelo_cod",getComponent('veh_subModelo_cod').getValue());
		tempDoc.replaceItemValue("temp_veh_anio_cod",getComponent('veh_anio_cod').getValue());
	}
		var agent:NotesAgent = database.getAgent("a.DialogNewCompBusqVehAS400");
		if(agent!=null){
			agent.runWithDocumentContext(tempDoc);
			// Aca estoy haciendo la actualizacion de la Variable Scope
			if (strControlName.equals('inicial')){
				getComponent("veh_marca_cod").setValue("");
				viewScope.newVeh_Dialog.put("veh_Marca", "");
				viewScope.newVeh_Dialog.put("veh_Modelo", "");
				viewScope.newVeh_Dialog.put("veh_SubModelo", "");
				viewScope.newVeh_Dialog.put("veh_Anio", "");
				viewScope.newVeh_Dialog.put(strScopeToFill,tempDoc.getItemValueString(strFieldValueToScope).split(";"));
			}else if(strControlName.equals('editar')){
				viewScope.newVeh_Dialog.put("veh_Marca",tempDoc.getItemValueString("temp_veh_marca_cod").split(";"));
				viewScope.newVeh_Dialog.put("veh_Modelo",tempDoc.getItemValueString("temp_veh_modelo_cod").split(";"));
				viewScope.newVeh_Dialog.put("veh_SubModelo",tempDoc.getItemValueString("temp_veh_subModelo_cod").split(";"));
				viewScope.newVeh_Dialog.put("veh_Anio",tempDoc.getItemValueString("temp_veh_anio_cod").split(";"));	
			}else if (strControlName.equals('veh_marca_cod')){
				viewScope.newVeh_Dialog.put(strScopeToFill,tempDoc.getItemValueString(strFieldValueToScope).split(";"));
				viewScope.newVeh_Dialog.put("veh_SubModelo", null);
				viewScope.newVeh_Dialog.put("veh_Anio", null)
			}else if(strControlName.equals('veh_modelo_cod')){
				viewScope.newVeh_Dialog.put(strScopeToFill,tempDoc.getItemValueString(strFieldValueToScope).split(";"));
				viewScope.newVeh_Dialog.put("veh_Anio", null)
			}else if(strControlName.equals('veh_subModelo_cod')){
				viewScope.newVeh_Dialog.put(strScopeToFill,tempDoc.getItemValueString(strFieldValueToScope).split(";"));
			}else if(strControlName.equals('veh_anio_cod')){
				getComponent("veh_sumaAsegurada_nro").setValue(tempDoc.getItemValueString("temp_veh_sumaAsegurada_nro"));
				getComponent("veh_origen_opt").setValue(tempDoc.getItemValueString("temp_veh_origen_opt"));
				getComponent("veh_capitulo_nro").setValue(tempDoc.getItemValueString("temp_veh_capitulo_nro"));
				getComponent("veh_varianteRc_nro").setValue(tempDoc.getItemValueString("temp_veh_varianteRc_nro"));
				getComponent("veh_varianteAir_nro").setValue(tempDoc.getItemValueString("temp_veh_varianteAir_nro"));
				getComponent("veh_varianteRc_nro").setValue(tempDoc.getItemValueString("temp_veh_varianteRc_nro"));
				getComponent("veh_tarifaDiferencial_nro").setValue(tempDoc.getItemValueString("temp_veh_tarifaDiferencial_nro"));
				
			}
		}	
}
function tieneVehiculo (docInspec:NotesXspDocument) {
	var strVeh:String = docInspec.getItemValueString("ins_Veh_cod");

	if (strVeh.equals ("")) return false;
	
	var vVehiculos:NotesView = getDbVeh().getView ("v.Sys.Veh");
	var docVeh:NotesDocument = vVehiculos.getDocumentByKey(strVeh);
	if (docVeh == null) return false;

	return true;
}

function getMapCoberturas ():java.util.HashMap{	
	importPackage(ar.com.hdi.autos.connect);
	var jce:GetArrayFromQueryAS400 = new GetArrayFromQueryAS400();
	var arr = jce.getSelectAS("vehTB_SET22599");
	if(arr.length > 0) {
		var mapResult:java.util.HashMap = new java.util.HashMap ();
		for(var i=0; i<arr.length; i++) {		
			mapResult.put(arr[i].toString().split('|')[1], arr[i].toString().split('|')[0]);
		}
	}
	return mapResult;
}