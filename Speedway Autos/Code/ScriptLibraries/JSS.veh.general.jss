function vehTieneComponentesVinculados (docIns_prm:NotesDocument) {
	var vMails:NotesView = getDbMails().getView ("v.Sys.MailsLinked");
	var docMail:NotesDocument = vMails.getDocumentByKey(docIns_prm.getItemValueString("ins_Componente_cod"));
	if (docMail == null) return false;
	return true;

}

function onChangeDialogNuevoComponente(strControlName:String, strScopeToFill:String, strFieldValueToScope:String){
	/*Utilizada en: ccDialogNuevoComponente  
	 * Parametros:
	 * strControlName: Nombre del control que ejecuta esta accion
	 * strScopeToFill: RequestScope en la que voy a asigar los valores que tomará el siguiente control
	 * strFieldValueToScope: Nombre del campo temporal que tendra los datos a pasar a RequestScope	
	 */
	
	var tempDoc:NotesDocument = database.createDocument();
	tempDoc.replaceItemValue("tempOnChange",strControlName);
	var urlUnid:String = context.getUrlParameter('documentId');
	if (urlUnid != null) getComponent("idPadre_cod").setValue(urlUnid);
	
	if (strControlName.equals('editar')){
		//getComponent("veh_sumaAsegurada_nro").setValue("AUD");
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
				// FPR Actualizo los campos en pantalla
				docDlgComp.setValue("veh_sumaAsegurada_nro", tempDoc.getItemValueString("temp_veh_sumaAsegurada_nro"));
				docDlgComp.setValue("veh_origen_opt", tempDoc.getItemValueString("temp_veh_origen_opt"));
				docDlgComp.setValue("veh_capitulo_nro", tempDoc.getItemValueString("temp_veh_capitulo_nro"));
				docDlgComp.setValue("veh_varianteRc_nro", tempDoc.getItemValueString("temp_veh_varianteRc_nro"));
				docDlgComp.setValue("veh_varianteAir_nro", tempDoc.getItemValueString("temp_veh_varianteAir_nro"));
				docDlgComp.setValue("veh_tarifaDiferencial_nro", tempDoc.getItemValueString("temp_veh_tarifaDiferencial_nro"));
				docDlgComp.setValue("idPadre_cod", context.getUrlParameter('documentId'));
				
				rptControl = getComponent("repeatComponentes");
				docDlgComp.setValue("veh_componente_nro", rptControl.getRowCount()+1);
				
				//Cargo las descripciones de los codigos
				getComponent("veh_marca_des").setValue(getLabelFromAlias (viewScope.newVeh_Dialog.get("veh_Marca"), getComponent ("veh_marca_cod").getValue()));
				docDlgComp.setValue("veh_marca_des", getLabelFromAlias (viewScope.newVeh_Dialog.get("veh_Marca"), getComponent ("veh_marca_cod").getValue()));								
				getComponent("veh_modelo_des").setValue(getLabelFromAlias (viewScope.newVeh_Dialog.get("veh_Modelo"), getComponent ("veh_modelo_cod").getValue()));
				docDlgComp.setValue("veh_modelo_des", getLabelFromAlias (viewScope.newVeh_Dialog.get("veh_Modelo"), getComponent ("veh_modelo_cod").getValue()));					
				getComponent("veh_submodelo_des").setValue(getLabelFromAlias (viewScope.newVeh_Dialog.get("veh_SubModelo"), getComponent ("veh_subModelo_cod").getValue()));
				docDlgComp.setValue("veh_submodelo_des", getLabelFromAlias (viewScope.newVeh_Dialog.get("veh_SubModelo"), getComponent ("veh_subModelo_cod").getValue()));		
				
			}
		}	
}
function actualizarBackEnd(strFieldName_array:Array){
	var docVehBack:NotesDocument = docDlgComp.getDocument();
	var strTemp:String;
	for (i=0; i<strFieldName_array.length; i++) {
		strTemp = "temp_" + strFieldName_array[i]; 
		//getComponent(strFieldName_array[i]).setValue();
		docVehBack.replaceItemValue(strFieldName_array[i], tempDoc.getItemValueString(strTemp));		
	}
}
function onChangeAnioUpdateResto(strResult:String, strConf:String) {
	var viewConf:NotesView = getDbCfg().getView ("v.Sys.ODBC")
	var docConf:NotesDocument = viewConf.getDocumentByKey(strConf);
	
	var arrComponentes:java.util.Vector = docConf.getItemValue("odbc_setComponent");
	var arrValor = strResult.split("~");
	var valConvertido:String;
	if(arrComponentes.size() == arrValor.length){
		for (i=0; i<arrComponentes.size(); i++) {
			if(arrComponentes[i] == "veh_sumaAsegurada_nro" || arrComponentes[i] == "veh_sumaAseguradaTablas_nro"){
				valConvertido = arrValor[i].split(".")[0];	
			}else{
				valConvertido =arrValor[i];
			}
			getComponent(arrComponentes[i]).setValue(valConvertido);
			docDlgComp.replaceItemValue(arrComponentes[i], valConvertido);
		}
	}
}
function escaparBarraConPipe(prmStrEvaluar:String){
	var find = '/';
	var re = new RegExp(find, 'g');
	return prmStrEvaluar.replace(re, '|');
}

function validarVehiculoConAS400 (docxProp:NotesXspDocument, docxDlgComp:NotesXspDocument):boolean {
	var dbCfg:NotesDatabase = getDbCfg();
	var docProfile:NotesDocument = dbCfg.getProfileDocument("f.p.ConAS400", "");
	var strUrlBase:String = getFieldValueFromConfig("wsvalveh", "odbc_select_des");
	viewScope.put("VehValError", "");
	strTemp:String;
	/*1*/strUrlBase += docxProp.getItemValueString ("sol_articulo_cod") + "/";	
	/*2*/strUrlBase += escaparBarraConPipe(docxDlgComp.getItemValueString ("veh_marca_cod")) + "/";
	/*3*/strUrlBase += escaparBarraConPipe(docxDlgComp.getItemValueString ("veh_modelo_cod")) + "/";
	/*4*/strUrlBase += escaparBarraConPipe(docxDlgComp.getItemValueString ("veh_submodelo_cod")) + "/";
	strTemp = (docxDlgComp.getItemValueInteger("veh_tarifaDiferencial_nro").toString() == "0")? "":docxDlgComp.getItemValueInteger("veh_tarifaDiferencial_nro").toString();  
	/*5*/strUrlBase += strTemp + "/";
	/*6*/strUrlBase += docxDlgComp.getItemValueString ("veh_anio_nro") + "/";
	/*7*/strUrlBase += docxDlgComp.getItemValueInteger ("veh_sumaAsegurada_nro").toString() + "/";
	/*8*/strUrlBase += escaparBarraConPipe(docxDlgComp.getItemValueString ("veh_motor_des")) + "/";
	/*9*/strUrlBase += escaparBarraConPipe(docxDlgComp.getItemValueString ("veh_chasis_des")) + "/";
	/*10*/strUrlBase += docxDlgComp.getItemValueString ("veh_uso_cod") + "/";
	/*11*/strUrlBase += docxDlgComp.getItemValueString ("veh_zonaRiesgo_cod") + "/";
	/*12*/strUrlBase += docxDlgComp.getItemValueString ("veh_cobertura_cod") + "/";
	/*13*/strUrlBase += docxDlgComp.getItemValueInteger ("veh_franquiciaValor_nro").toString() + "/";
	/*14*/strUrlBase += escaparBarraConPipe(docxDlgComp.getItemValueString ("veh_patenteTipo_cod")) + "/";
	//strTemp = (docxDlgComp.getItemValueString ("veh_patenteTipo_cod") == "A/D")?"A|D":docxDlgComp.getItemValueString ("veh_patenteTipo_cod");
	//*14*/strUrlBase += strTemp + "/";	
	/*15*/strUrlBase += docxDlgComp.getItemValueString ("veh_patente_des") + "/";
	/*16*/strUrlBase += checkToSiNo (docxDlgComp.getItemValueString ("veh_0km_opt")) + "/";
	/*17*/strUrlBase += docxDlgComp.getItemValueString ("veh_averias_opt") + "/";
	/*18*/strUrlBase += checkToSiNo (docxDlgComp.getItemValueString ("veh_gnc_opt")) + "/";
	/*19*/strUrlBase += docxDlgComp.getItemValueString ("veh_capitulo_nro") + "/";
	/*20*/strUrlBase += docxDlgComp.getItemValueString ("veh_tarifa_cod") + "/";
	/*21*/strUrlBase += checkToSiNo (docxDlgComp.getItemValueString ("veh_franquiciaInforma_opt"));
	if (getFieldValueFromConfig("wsvalveh", "odbc_MsgConsole_des") == "1"){
		print("wsvalveh=" + strUrlBase);
	}else if	(getFieldValueFromConfig("wsvalveh", "odbc_MsgConsole_des") == "2"){
		AgentLogAutos("wsvalveh",0,strUrlBase)
	}
	
	var parsedxml:org.w3c.dom.Document = null; 
	var domfactory:javax.xml.parsers.DocumentBuilderFactory= javax.xml.parsers.DocumentBuilderFactory.newInstance();
	var xmldocument:javax.xml.parsers.DocumentBuilder= domfactory.newDocumentBuilder();		
	var urlws:java.net.URL = new java.net.URL(strUrlBase);
	var is:org.xml.sax.InputSource  = new org.xml.sax.InputSource(urlws.openStream());
	is.setEncoding("ISO-8859-1");
	var parsedxml= xmldocument.parse(is);
	
	var dtIsValid:DOMNodeList= parsedxml.getElementsByTagName("isValid"); 
	var nnode:DOMNode= dtIsValid.item(0); 
	var nnodeChild:DOMNode= nnode.getFirstChild();
	var strIsValid:String = "";
	if (nnodeChild != null) strIsValid = nnodeChild.getNodeValue();
	
	if (strIsValid.toLowerCase().equals ("true")) return true;
	
	var dtErrInfo:DOMNodeList;
	var dtError:DOMNodeList= parsedxml.getElementsByTagName("Error");
	var strError:String = "";
	var strErrorId:String = "";
	var strErrorDes:String = "";
	var strErrorSev:String = "";
	var i:int;
	
	for (i=0;i<dtError.getLength();i++) {
		nnode = dtError.item(i);
		dtErrInfo = nnode.getChildNodes();
		
		//nnode = dtErrInfo.item(0);
		//strErrorId = nnode.getTextContent();
		nnode = dtErrInfo.item(1);
		strErrorDes = nnode.getTextContent();
		//nnode = dtErrInfo.item(2);
		//strErrorSev = nnode.getTextContent();
		if (strError.equals ("") == false) strError += "; ";
		//strError += "Id: " + strErrorId + " - Des: " + strErrorDes + " - Sev: " + strErrorSev;
		strError += strErrorDes;
	}
		
	//viewScope.put("VehValError", strError + " (" + strUrlBase + ")");
	viewScope.put("VehValError", strError);
	return false;
}

function checkToSiNo (strCheck_prm:String):String {
	if (strCheck_prm.equals ("1")) return "S";
	return "N"
}

function confirmarAltaDesdeInspeccion(){
	/*Funcion para dar de alta el componente desde una inspeccion. 
	 * Se cargan los datos en la inspeccion 
	 * Cuando creo una inspeccion desde una propuesta no debería ver el boton de alta de vehiculo(ya lo tengo)*/
	if(viewScope.newVeh_Dialog.patente == "Ingresar Patente"){
		var msg=new javax.faces.application.FacesMessage();
		facesContext.addMessage("Error",msg("Por favor Ingresar Patente"));
		return false;
	}		
	var docInspeccion:NotesXspDocument = document1;	
	docInspeccion.replaceItemValue("ins_Veh_nro", 1);
	docInspeccion.replaceItemValue("ins_VehMarca_cod", getComponent("veh_marca_cod").getValue());
	docInspeccion.replaceItemValue("ins_VehMarca_des", getSelectedValueFromAlias('veh_marca_cod'));
	docInspeccion.replaceItemValue("ins_VehModelo_cod", getComponent("veh_modelo_cod").getValue());
	docInspeccion.replaceItemValue("ins_VehModelo_des", getSelectedValueFromAlias('veh_modelo_cod'));
	docInspeccion.replaceItemValue("ins_VehSubModelo_cod", getComponent("veh_submodelo_cod").getValue());
	docInspeccion.replaceItemValue("ins_VehSubModelo_des", getSelectedValueFromAlias('veh_submodelo_cod'));
	docInspeccion.replaceItemValue("ins_VehAnio_cod", getComponent("veh_anio_cod").getValue());
	docInspeccion.replaceItemValue("ins_VehPatNro_des", getComponent("btn_ValidarPatente").getValue());
	docInspeccion.replaceItemValue("ins_VehChasis_des", getComponent("veh_chasis_des").getValue());
	docInspeccion.replaceItemValue("ins_VehMotor_des", getComponent("veh_motor_des").getValue());
	docInspeccion.replaceItemValue("ins_vehCobSol_cod", getComponent("veh_cobertura_cod").getValue());
	docInspeccion.replaceItemValue("ins_vehCobSol_des", getSelectedValueFromAlias('veh_cobertura_cod'));
	getComponent('dialogComponente').hide();	
}

function confirmarAltaVehiculo (booValidarConGauss:boolean) {
	//docDlgComp está como DataSource del ccDialogNuevoComponente
	var booUpdateReqAut:boolean = false;
	// Si no tiene patente la liga
	if(viewScope.newVeh_Dialog.patente == "Ingresar Patente"){
		var msg=new javax.faces.application.FacesMessage();
		facesContext.addMessage("Error",msg("Por favor Ingresar Patente"));
		return false;
	}
	// Si es endoso que modifica componente validar (accionInvocada=Modificacion)
	if(viewScope.newVeh_Dialog.accionInvocada != null){
		if(viewScope.newVeh_Dialog.accionInvocada == "Modificacion"){
			if(viewScope.newVeh_Dialog.SumaMinima != null){ // Aumentar SA
				var SaMi:float = viewScope.newVeh_Dialog.SumaMinima;
				var Sa:float = getComponent("veh_sumaAsegurada_nro").getValue();
				if(Sa <= SaMi){
					var msg=new javax.faces.application.FacesMessage();
					facesContext.addMessage("Error",msg("El tipo de movimiento exige un aumento de Suma Asegurada."));
					return false;					
				}
			}else if(viewScope.newVeh_Dialog.SumaMaxima != null){// Disminuir SA
				var SaMa:float = viewScope.newVeh_Dialog.SumaMaxima;
				var Sa:float = getComponent("veh_sumaAsegurada_nro").getValue();
				if(Sa >= SaMa){
					var msg=new javax.faces.application.FacesMessage();
					facesContext.addMessage("Error",msg("El tipo de movimiento exige una disminución de Suma Asegurada."));
					return false;					
				}
			}			
		}
	}
	var docxProp:NotesXspDocument = viewScope.get("docxProp");
	var idPadre_cod:String = docxProp.getDocument().getUniversalID();
	if (idPadre_cod.equals("")){throw new java.lang.Exception("Error al grabar componente " + viewScope.newVeh_Dialog.patente)};
	if (booValidarConGauss) {
		if (validarVehiculoConAS400 (docxProp, docDlgComp) == false) {
			//print("ERROR DE VALIDACION DE VEHICULO");
			var control = getComponent("veh_marca_cod");
			postValidationError (control, "Error de Validación del Vehiculo: " + viewScope.get("VehValError"));
			return false;
		}else {
			//Confirmado y validado, actualizo el estado
			updateEstadoVeh (docDlgComp, "10");
			booUpdateReqAut = true;
		}
	}else {
		//Confirmado sin validar, actualizo el estado
		var strLog:String = "Autorizar: " + getComponent("btn_ValidarPatente").getValue() + " -->" + viewScope.get("VehValError");
		viewScope.put("VehValError", "");
		updateEstadoVeh (docDlgComp, "20");
		//Blanqueamos el flag que indica que fue autorizado
		docxProp.replaceItemValue("sol_Autoriz_flag", "0")
		//Log en propuesta
		var itemLog:NotesItem = docxProp.getDocument().getFirstItem("log_des");
		setLog (itemLog, strLog);
		docxProp.save();
		viewScope.put("booReqAutoriz", true);
		//print ("req AUTORIZACIÓN");
		
	}
	switch (viewScope.newVeh_Dialog.accionInvocada) {
		case "Alta":
			var viewVehAsoc:NotesView = getDbPropuestas().getView ("v.UI.VehAsocPropuestas_EmbView");
			var collVeh:NotesDocumentCollection = viewVehAsoc.getAllDocumentsByKey(idPadre_cod);
			if (collVeh == null){
				docDlgComp.replaceItemValue("veh_componente_nro", 1);
			}else{
				docDlgComp.replaceItemValue("veh_componente_nro", collVeh.getCount()+1);
			}
			docDlgComp.replaceItemValue("veh_spwvehABM_cod","A");
			docDlgComp.replaceItemValue("veh_statusGaus_des","");
			break;
		case "Baja": // No se presiona Confirmar
			break;
		case "Modificacion":
			docDlgComp.replaceItemValue("veh_spwvehABM_cod","M");
			break;
		case "Editar":	
			break;
	}
	docDlgComp.replaceItemValue("idPadre_cod", idPadre_cod);
	//FPRDELETE_docDlgComp.replaceItemValue("idPropuesta_cod", idPadre_cod);
	//Convierto los alias en descripcion y guardo en campos _des
	docDlgComp.replaceItemValue("veh_marca_des", getSelectedValueFromAlias('veh_marca_cod'));
	docDlgComp.replaceItemValue("veh_modelo_des", getSelectedValueFromAlias('veh_modelo_cod'));
	docDlgComp.replaceItemValue("veh_submodelo_des", getSelectedValueFromAlias('veh_submodelo_cod'));
	if(getComponent('veh_franquiciaInforma_opt').getSubmittedValue() == "0" || getComponent('veh_franquiciaValor_nro').getValue() == 0 ){
		docDlgComp.replaceItemValue("veh_franquiciaValor_nro", 0);
	}
	if (docDlgComp.isNewNote()) {
	    var docBackEnd:NotesDocument = docDlgComp.getDocument();
		var authorItem:NotesItem = docBackEnd.replaceItemValue("autor_acl", "spwAU.N3.AUTORGRP_CRUD");
		authorItem.setAuthors(true);
		var authorAdminItem:NotesItem = docBackEnd.replaceItemValue("autorAdmin_acl", "spwAU.N3.AUTORGRP_CRUD");
		authorAdminItem.setAuthors(true);
	}
	
	docDlgComp.save();
	if (booUpdateReqAut) viewScope.put("booReqAutoriz", requiereAutorizacion(documentPropuesta));
	getComponent('dialogComponente').hide();
	viewScope.VehSelectedUNID = "";
}

function buscarVehNoValidados (docxProp_prm:NotesXspDocument):NotesDocumentCollection {
	var vVehPorEst:NotesView = getDbPropuestas().getView ("v.Sys.Veh.PropEst");
	var strUnidProp:String = docxProp_prm.getDocument().getUniversalID();
	return (vVehPorEst.getAllDocumentsByKey(strUnidProp + "20")); //20 es el estado NO VALIDADO.
}

function requiereAutorizacion (docxProp_prm:NotesXspDocument):boolean {
	var doccVeh:NotesDocumentCollection = buscarVehNoValidados (docxProp_prm);
	if (doccVeh.getCount() > 0) {
		return true;
	}
	if(docxProp.getDocument().getItemValueString("sol_Autoriz_flag") == "0"){
		return true;
	}
	return false;
}
function tieneVehiculos (docxProp_prm:NotesXspDocument):boolean {
	var vVehPorEst:NotesView = getDbPropuestas().getView ("v.UI.VehAsocPropuestas_EmbView");
	var strUnidProp:String = docxProp_prm.getDocument().getUniversalID();
	var docVeh:NotesDocument = vVehPorEst.getDocumentByKey(strUnidProp);
	if (docVeh != null) return true;
	return false;
}
function getSumaAseguradaTablas(docComponente:NotesDocument){
	importPackage(ar.com.hdi.autos.connect);
	var jce:GetArrayFromQueryAS400 = new GetArrayFromQueryAS400();
	var temp: java.util.ArrayList   = jce.getSelectAS("vehTB_SET20497_SumaAsegurada", docComponente);
	if(temp.toString() == "[]"){
		return temp.toString();
	}
	var result:String = temp.get(0);
	return result.split(".")[0];
}

function getFranquiciaWs(docxProp_prm:NotesXspDocument){
	var strUrlBase:String = evaluateFormulaXsp(getFieldValueFromConfig("wsfrqdft", "odbc_select_des"), docxProp_prm).elementAt(0).toString();
	if (getFieldValueFromConfig("wsfrqdft", "odbc_MsgConsole_des") == "1"){
		print("wsfrqdft=" + strUrlBase);		
	}
	var parsedxml:org.w3c.dom.Document = null; 
	var domfactory:javax.xml.parsers.DocumentBuilderFactory= javax.xml.parsers.DocumentBuilderFactory.newInstance(); 
	var xmldocument:javax.xml.parsers.DocumentBuilder= domfactory.newDocumentBuilder(); 
	var parsedxml= xmldocument.parse(strUrlBase);
	if(isWsWithErrors(parsedxml).equals ("")){
		var dtIfra:DOMNodeList= parsedxml.getElementsByTagName("IFRA"); 
		var nnode:DOMNode= dtIfra.item(0);
		var nnodeChild:DOMNode= nnode.getFirstChild();
		var strIfra:String = "";
		if (nnodeChild != null) strIfra = nnodeChild.getNodeValue();	
		//var temp:String = new String(strIfra).replace(".", "").replace(",", ".");
		return strIfra;
	}else{
		return "";
	}	
}

function isWsWithErrors(parsedxml:org.w3c.dom.Document){
	var dtErrors:DOMNodeList= parsedxml.getElementsByTagName("ErrId"); 
	var nnode:DOMNode= dtErrors.item(0);
	if (nnode == null){
		return "";
	}
	var nnodeChild:DOMNode= nnode.getFirstChild();
	var strError:String = "";
	if (nnodeChild != null) strError = nnodeChild.getNodeValue();

	dtErrors = parsedxml.getElementsByTagName("ErrMsg");
	nnode = dtErrors.item(0);
	nnodeChild= nnode.getFirstChild();
	var strErrorMsg:String = "";
	if (nnodeChild != null) strErrorMsg = nnodeChild.getNodeValue();
	
	if (strError.equals ("")) return "";
	else {
		return strErrorMsg;
	}
}

function getDetalleCoberturasWs(cobertura:String){
	var strUrlBase:String = getFieldValueFromConfig("wsdetcob", "odbc_select_des") + cobertura;
	if (getFieldValueFromConfig("wsdetcob", "odbc_MsgConsole_des") == "1"){
		print("wsdetcob=" + strUrlBase);
	}else if	(getFieldValueFromConfig("wsdetcob", "odbc_MsgConsole_des") == "2"){
		AgentLogAutos("wsdetcob",0,strUrlBase)
	}

	var parsedxml:org.w3c.dom.Document = null; 
	var domfactory:javax.xml.parsers.DocumentBuilderFactory= javax.xml.parsers.DocumentBuilderFactory.newInstance(); 
	var xmldocument:javax.xml.parsers.DocumentBuilder= domfactory.newDocumentBuilder(); 
	var parsedxml= xmldocument.parse(strUrlBase);
	if(isWsWithErrors(parsedxml).equals ("")){
		var nodosDetalle:DOMNodeList;
		var nodoDetalle:DOMNode;
		var nodosDeDetalle:DOMNodeList;
		var nodoHijoDeDetalle:DOMNode;
		var intNodoDetalleIndex:int=-1;
		nodosDetalle = parsedxml.getElementsByTagName("Detalle");
		var arrOpts:Array = new Array ();
		var arrResult:Array = new Array (); 
		for (var i=0; i<nodosDetalle.getLength(); i++) { //Recorro los nodos <Detalle>
			intNodoDetalleIndex = i;
			nodoDetalle = nodosDetalle.item(i);
			nodosDeDetalle = nodoDetalle.getChildNodes(); //Tomo los hijos del nodo <Detalle> y los recorro
			for (var j=0; j<nodosDeDetalle.getLength(); j++) {
				nodoHijoDeDetalle = nodosDeDetalle.item(j);
				if (nodoHijoDeDetalle.getNodeName() == "Acct"){
					viewScope.cc_ws_Acct =  nodoHijoDeDetalle.getFirstChild().getNodeValue()
				}
				if (nodoHijoDeDetalle.getNodeName() == "Accp"){
					viewScope.cc_ws_Accp =  nodoHijoDeDetalle.getFirstChild().getNodeValue()
				}
				if (nodoHijoDeDetalle.getNodeName() == "Inct"){
					viewScope.cc_ws_Inct =  nodoHijoDeDetalle.getFirstChild().getNodeValue()
				}
				if (nodoHijoDeDetalle.getNodeName() == "Incp"){
					viewScope.cc_ws_Incp =  nodoHijoDeDetalle.getFirstChild().getNodeValue()
				}
				if (nodoHijoDeDetalle.getNodeName() == "Robt"){
					viewScope.cc_ws_Robt =  nodoHijoDeDetalle.getFirstChild().getNodeValue()
				}
				if (nodoHijoDeDetalle.getNodeName() == "Robp"){
					viewScope.cc_ws_Robp =  nodoHijoDeDetalle.getFirstChild().getNodeValue()
				}
				if (nodoHijoDeDetalle.getNodeName() == "Lirc"){
					viewScope.cc_ws_Lirc =  nodoHijoDeDetalle.getFirstChild().getNodeValue()
				}
			}	
		}
		return true
	}else{
		return false;
	}	
}


function getTarifasWs(){
	var strUrlBase:String = getFieldValueFromConfig("wsTarifasVigentes", "odbc_select_des");
	consoleLog("wsTarifasVigentes", strUrlBase);
	//Create the XML Document
	var parsedxml:org.w3c.dom.Document = null; 
	//Create the Parser Factory and document builder
	var domfactory:javax.xml.parsers.DocumentBuilderFactory= javax.xml.parsers.DocumentBuilderFactory.newInstance(); 
	var xmldocument:javax.xml.parsers.DocumentBuilder= domfactory.newDocumentBuilder(); 
	//Read the XML from the XAgent
	var parsedxml= xmldocument.parse(strUrlBase);
	var nodosTarifa:DOMNodeList;
	var nodoTarifa:DOMNode;
	var nodosDeTarifa:DOMNodeList;
	var nodoHijoDeTarifa:DOMNode;
	var intNodoTarifaIndex:int=-1;
	nodosTarifa = parsedxml.getElementsByTagName("Tarifa");
	var arrOpts:Array = new Array ();
	var arrResult:Array = new Array ();
	var strTarifaCod:String = ""; 
	for (var i=0; i<nodosTarifa.getLength(); i++) { //Recorro los nodos <Tarifa>
			intNodoTarifaIndex = i;
			nodoTarifa = nodosTarifa.item(i);
			nodosDeTarifa = nodoTarifa.getChildNodes(); //Tomo los hijos del nodo <Tarifa> y los recorro
			for (var j=0; j<nodosDeTarifa.getLength(); j++) {
				nodoHijoDeTarifa = nodosDeTarifa.item(j);
				if (nodoHijoDeTarifa.getNodeName() == "TarifaCod"){
					strTarifaCod =  nodoHijoDeTarifa.getFirstChild().getNodeValue();
					consoleLog("wsTarifasVigentes", strTarifaCod);
				}
				if (nodoHijoDeTarifa.getNodeName() == "TarifaDes"){
					dtToday = session.createDateTime("Today");
					dt = StringToNotesDateTime(nodoHijoDeTarifa.getFirstChild().getNodeValue() ,"yyyyMMdd", "dd/MM/yyyy hh:mm");
					consoleLog("wsTarifasVigentes", dt.getDateOnly());
					if (dt.timeDifference(dtToday)/86400 > 0){
						strTarifaCod = "";
					}					
				}
				if (nodoHijoDeTarifa.getNodeName() == "TarifaDft"){
					if(nodoHijoDeTarifa.getFirstChild().getNodeValue() == "S"){
						arrResult.push(strTarifaCod);	
						strTarifaCod = "";						
					}		
				}			
			}	
			if (strTarifaCod != ""){
				arrOpts.push(strTarifaCod);
			}
	}
	return arrResult.concat(arrOpts);	
}

function btnEditarVehiculo(){
	viewScope.newVeh_Dialog.accionInvocada = "Editar";
	viewScope.newVeh_Dialog.showInputComponente = "true";
	viewScope.PNL_DialogCabeceraDatosVehiculosRead = true;
	viewScope.newVeh_Dialog.buttonValidarVehiculoVisible = true;
	viewScope.newVeh_Dialog.dialogComponenteTitle = "Vehiculo";
	viewScope.newVeh_Dialog.patente = getComponent("veh_patenteTipo_cod").getValue() + " " + getComponent("veh_patente_des").getValue();
	viewScope.PNL_CargaDatosVehiculos = true;
	viewScope.put("PNL_Veh_modelo_cod",true);
	viewScope.put("PNL_Veh_submodelo_cod",true);
	viewScope.put("PNL_Veh_anio_cod",true);

	getComponent('dialogComponente').show();
}

function btnEditarVehiculoModCompo(){
	viewScope.newVeh_Dialog.accionInvocada = "Modificacion";
	viewScope.newVeh_Dialog.showInputComponente = "true";
	viewScope.PNL_DialogCabeceraDatosVehiculosRead = true;
	viewScope.newVeh_Dialog.buttonValidarVehiculoVisible = true;
	viewScope.newVeh_Dialog.dialogComponenteTitle = "Vehiculo";
	viewScope.newVeh_Dialog.patente = getComponent("veh_patenteTipo_cod").getValue() + " " + getComponent("veh_patente_des").getValue();
	viewScope.PNL_CargaDatosVehiculos = true;
	viewScope.put("PNL_Veh_modelo_cod",true);
	viewScope.put("PNL_Veh_submodelo_cod",true);
	viewScope.put("PNL_Veh_anio_cod",true);
	
	viewScope.newVeh_Dialog.enableFields = getVectorEndoso(); 
	getComponent('dialogComponente').show();
}

function getVectorEndoso(){
	// Si estoy aca es endoso tipoOperacion "1"|"2"|"3"|"7"|"10"
	var vecFields:java.util.Vector = new java.util.Vector();
	var docxProp:NotesXspDocument = viewScope.get("docxProp");
	switch(docxProp.getDocument().getItemValueString("sol_tipoOperacion_cod").toString()){
		case "1": //Aumento Suma
			vecFields.add("veh_sumaAsegurada_nro");
			viewScope.newVeh_Dialog.SumaMinima = documentComponente.getItemValueDouble("veh_sumaAsegurada_nro");
		break;
		case "2": //Rebaja Suma
			vecFields.add("veh_sumaAsegurada_nro");
			viewScope.newVeh_Dialog.SumaMaxima = documentComponente.getItemValueDouble("veh_sumaAsegurada_nro");
		break;
		case "3": //Cambio Cobertura
			vecFields.add("veh_cobertura_cod");
			vecFields.add("veh_franquicia");
			vecFields.add("veh_sumaAsegurada_nro");
		break;	
		case "7": //Cambio Vehiculo
			vecFields.add("buttonValidarVehiculo");
			vecFields.add("veh_sumaAsegurada_nro");
			vecFields.add("btn_ValidarPatente");
			vecFields.add("veh_cobertura_cod");
			vecFields.add("veh_tarifa_cod");
			vecFields.add("veh_zonaRiesgo_cod");
			vecFields.add("veh_uso_cod");
			vecFields.add("veh_okm_gnc_ave");
			vecFields.add("veh_franquicia");			
		break;
		case "10": //Aumento Suma Asegurada
			vecFields.add("veh_sumaAsegurada_nro");
			viewScope.newVeh_Dialog.SumaMinima = documentComponente.getItemValueDouble("veh_sumaAsegurada_nro");
		break;
	}
	return vecFields;
}

function eliminarVehiculosEnPropuesta(strUnidPropuesta_prm:String){
	
	var collVeh:DocumentCollection = getCollectionByKey(getDbPropuestas(), "v.UI.VehAsocPropuestas_EmbView", strUnidPropuesta_prm);
	if(collVeh.getCount() > 0){
		var docVeh:NotesDocument = collVeh.getFirstDocument();
		while (docVeh != null) {
			
			//Elimina los accesorios asociados
			eliminarDocsPorIdPadre("v.UI.AccAsocComponente_EmbView", strUnidPropuesta_prm);
			//Elimina las inspecciones asociadas
			eliminarDocsPorIdPadre("v.Sys.Ins.Veh", strUnidPropuesta_prm);
			//Elimina los rastreasores asociados
			eliminarDocsPorIdPadre("v.UI.RasAsocComponente_EmbView", strUnidPropuesta_prm);
			
			var tmpdoc = collVeh.getNextDocument();
			docVeh.removePermanently(false);
			
			docVeh.recycle();
			docVeh = tmpdoc;
		}		
	}
}

function eliminarDocsPorIdPadre(strVista_prm:String, strUnidPadre_prm:String) {
//strVista_prm = Vista donde se buscan los documentos a borrar
//strUnidPadre_prm = Clave de busqueda
	
	var collDocs:DocumentCollection = getCollectionByKey(getDbPropuestas(), strVista_prm, strUnidPadre_prm);
	if(collDocs.getCount() > 0){
		var doc:NotesDocument = collVeh.getFirstDocument();
		while (doc != null) {			

			var tmpdoc = collDocs.getNextDocument();
			doc.removePermanently(true);
			
			doc.recycle();
			doc = tmpdoc;
		}		
	}
}

function consoleLog(strClave:String, strMensaje:String) {
	if (getFieldValueFromConfig(strClave, "odbc_MsgConsole_des") == "1"){
		print(strClave + "=" + strMensaje);
	}else if	(getFieldValueFromConfig(strClave, "odbc_MsgConsole_des") == "2"){
		AgentLogAutos(strClave,0,strMensaje)
	}
}


