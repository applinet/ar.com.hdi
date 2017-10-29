
//Funciones que están relacionados con el AS400 

function getUrlParams (docProp_prm:NotesDocument):String {
	//Construimos URL para conexión con AS400
	var strOrden:String = docProp_prm.getItemValue("orden_nro").elementAt(0).toString();
	var strDesde:String = docProp_prm.getItemValueDateTimeArray("sol_vigenciaDesdeOperacion_nro").elementAt(0).toString();
	var strHasta:String = docProp_prm.getItemValueDateTimeArray("sol_vigenciaHastaOperacion_nro").elementAt(0).toString();
	
	if (strDesde.equals("") == false) {
		var dtDesde:NotesDateTime = docProp_prm.getItemValueDateTimeArray("sol_vigenciaDesdeOperacion_nro").elementAt(0);
		strDesde = getYMD (dtDesde, "");
	}
	if (strHasta.equals("") == false) {
		var dtHasta:NotesDateTime = docProp_prm.getItemValueDateTimeArray("sol_vigenciaHastaOperacion_nro").elementAt(0);
		strHasta = getYMD (dtHasta, "");
	}
		
	var strParamProp:String = "&PROP=" + strOrden;
	var strParamArt:String = "&ARCD=" + docProp_prm.getItemValueString ("sol_articulo_cod");
	var strParamAseg:String = "&ASEN=" + docProp_prm.getItemValueString ("sol_asegurado_cod");
	var strParamProd:String = "&NIVC=" + docProp_prm.getItemValueString ("sol_productor_cod");
	var strParamDesde:String = "&FVDE=" + strDesde;
	var strParamHasta:String = "&FVHA=" + strHasta;
	
	
	var strUrlCompleta:String = (strParamProp + strParamArt + strParamAseg + strParamProd + strParamDesde + strParamHasta);
	return strUrlCompleta;
}

function getUrlBase (strCampo_prm:String):String {
	var dbCfg:NotesDatabase = getDbCfg();
	var docProfile:NotesDocument = dbCfg.getProfileDocument("f.p.ConAS400", "");
	
	var strUrlBase:String = docProfile.getItemValueString(strCampo_prm);
		
	return strUrlBase;
}

function getUrlInicioEmision (docProp_prm:NotesDocument):String {
	//var strUrlCompleta:String = (getUrlBase ("ConAS400_EmiUrlBase_des") + getUrlParams (docProp_prm));
	var strUrlCompleta:String = evaluateFormula(getFieldValueFromConfig("wf_1_InicioEmision", "odbc_select_des"), docProp_prm).elementAt(0).toString();
	if (getFieldValueFromConfig("wf_1_InicioEmision", "odbc_MsgConsole_des") == "1"){
		print("wf_1_InicioEmision=" + strUrlCompleta);	
	}else if	(getFieldValueFromConfig("wf_1_InicioEmision", "odbc_MsgConsole_des") == "2"){
		AgentLogAutos("webFacing",0,strUrlCompleta)
	}
	return strUrlCompleta;
}

function getUrlRetomarSusp (docProp_prm:NotesDocument):String {
	//var strUrlCompleta:String = (getUrlBase ("ConAS400_ReSusUrlBase_des") + getUrlParams (docProp_prm));
	var strUrlCompleta:String = evaluateFormula(getFieldValueFromConfig("wf_2_RetomarSuspendida", "odbc_select_des"), docProp_prm).elementAt(0).toString();
	if (getFieldValueFromConfig("wf_2_RetomarSuspendida", "odbc_MsgConsole_des") == "1"){
		print("wf_2_RetomarSuspendida=" + strUrlCompleta);		
	}else if	(getFieldValueFromConfig("wf_2_RetomarSuspendida", "odbc_MsgConsole_des") == "2"){
		AgentLogAutos("webFacing",0,strUrlCompleta)
	}
	return strUrlCompleta;
}

function getUrlEliminarSusp (docProp_prm:NotesDocument):String {
	//var strUrlCompleta:String = (getUrlBase ("ConAS400_EliSusUrlBase_des") + getUrlParams (docProp_prm));
	var strUrlCompleta:String = evaluateFormula(getFieldValueFromConfig("wf_3_EliminarSuspendida", "odbc_select_des"), docProp_prm).elementAt(0).toString();
	if (getFieldValueFromConfig("wf_3_EliminarSuspendida", "odbc_MsgConsole_des") == "1"){
		print("wf_3_EliminarSuspendida=" + strUrlCompleta);		
	}else if	(getFieldValueFromConfig("wf_3_EliminarSuspendida", "odbc_MsgConsole_des") == "2"){
		AgentLogAutos("webFacing",0,strUrlCompleta)
	}
	return strUrlCompleta;
}

function getUrlEliminarSuspRecup (docProp_prm:NotesDocument):String {
	//var strUrlCompleta:String = (getUrlBase ("ConAS400_EliSusReUrlBase_des") + getUrlParams (docProp_prm));
	var strUrlCompleta:String = evaluateFormula(getFieldValueFromConfig("wf_3_EliminarSuspendida", "odbc_select_des"), docProp_prm).elementAt(0).toString();
	if (getFieldValueFromConfig("wf_3_EliminarSuspendida", "odbc_MsgConsole_des") == "1"){
		print("wf_3_EliminarSuspendidaRecup=" + strUrlCompleta);		
	}else if	(getFieldValueFromConfig("wf_3_EliminarSuspendida", "odbc_MsgConsole_des") == "2"){
		AgentLogAutos("webFacing",1,strUrlCompleta)
	}
	return strUrlCompleta;
}

function setPropSuspEsp (docXspProp_prm:NotesXspDocument, strAccion_prm:String) {
	
	var strEstadActual:String = getEstadoPropuesta (docXspProp_prm);
	
	//85 = Suspendida Especial
	if (strEstadActual.equals ("85")) {
		setSysLog (docXspProp_prm.getDocument(), "Se ejecutó " + strAccion_prm + " y se detectó el estado ya estaba en Suspendida Especial");
	}
	else {
		updateEstadoPropuesta (docXspProp_prm, "85");
		setSysLog (docXspProp_prm.getDocument(), "Se ejecutó " + strAccion_prm + " y se pasó el estado a 85");
	}
	
	docxProp.replaceItemValue("sol_webFacSes_des", "1");
		
	docXspProp_prm.save();
}


function isUserActiveOnAS400 ():boolean {
	var strMail:String = context.getUser().getMail();
	strMail = strMail.split ("@")[0];
	var strMailSafe:String = XSPUrl.encodeParameter (strMail);
	var strUrlBase:String = getFieldValueFromConfig("wschkusr", "odbc_select_des");
	//Create the XML Document
	var parsedxml:org.w3c.dom.Document = null; 
	//Create the Parser Factory and document builder
	var domfactory:javax.xml.parsers.DocumentBuilderFactory= 
	javax.xml.parsers.DocumentBuilderFactory.newInstance(); 
	var xmldocument:javax.xml.parsers.DocumentBuilder= domfactory.newDocumentBuilder(); 
	//Read the XML from the XAgent
	//Le agrego el @Unique para evitar cacheo.
	var parsedxml= xmldocument.parse(strUrlBase + strMailSafe + "/" + @Unique());
	
	var dtErrors:DOMNodeList= parsedxml.getElementsByTagName("ErrId"); 
	var nnode:DOMNode= dtErrors.item(0); 
	var nnodeChild:DOMNode= nnode.getFirstChild();
	var strError:String = "";
	if (nnodeChild != null) strError = nnodeChild.getNodeValue();
	
	dtErrors = parsedxml.getElementsByTagName("ErrMsg");
	nnode = dtErrors.item(0);
	nnodeChild= nnode.getFirstChild();
	var strErrorMsg:String = "";
	if (nnodeChild != null) strErrorMsg = nnodeChild.getNodeValue();
	
	switch(strError) {
		case "": return false; //No tiene Errores
		case "WSR2007":
			dtErrors = parsedxml.getElementsByTagName("Arcd");
			var arcd:String = dtErrors.item(0).getFirstChild().getNodeValue();
			dtErrors = parsedxml.getElementsByTagName("Soln");
			var soln:String = dtErrors.item(0).getFirstChild().getNodeValue();
			viewScope.put("UserErrorMessage","Debe terminar la Orden Nro.: " + soln);
			return true;
			
		default: 
			print ("isUserActiveOnAS400.El usuario " + strMailSafe + " tiene errores"); //FRPBORRAR
			viewScope.put("UserErrorMessage", getErrorMessageFromCode (strError, strErrorMsg, strMailSafe));
			return true;	
	}		
}



function getUserIdAS400 ():String {
	var strMail:String = context.getUser().getMail();
	strMail = strMail.split ("@")[0];
	//if (strMail.equals ("Diego.Liberman")) return false;
	var strMailSafe:String = XSPUrl.encodeParameter (strMail);
	var strUrlBase:String = getFieldValueFromConfig("wschkusr", "odbc_select_des");
	//Create the XML Document
	var parsedxml:org.w3c.dom.Document = null; 
	var domfactory:javax.xml.parsers.DocumentBuilderFactory= 
	javax.xml.parsers.DocumentBuilderFactory.newInstance(); 
	var xmldocument:javax.xml.parsers.DocumentBuilder= domfactory.newDocumentBuilder(); 
	var parsedxml= xmldocument.parse(strUrlBase + strMailSafe); 
		
	var dtErrors:DOMNodeList= parsedxml.getElementsByTagName("ErrId"); 
	var nnode:DOMNode= dtErrors.item(0); 
	var nnodeChild:DOMNode= nnode.getFirstChild();
	var strError:String = "";
	if (nnodeChild != null) strError = nnodeChild.getNodeValue();
	
	dtErrors = parsedxml.getElementsByTagName("ErrMsg");
	nnode = dtErrors.item(0);
	nnodeChild= nnode.getFirstChild();
	var strErrorMsg:String = "";
	if (nnodeChild != null) strErrorMsg = nnodeChild.getNodeValue();
	switch(strError) {
		case "WSR9999":
		case "WSR9998":
		case "WSR9997":
		case "WSR1000":
		case "WSR2001":
		case "WSR2002":
			viewScope.put("UserErrorMessage", getErrorMessageFromCode (strError, strErrorMsg, strMailSafe));
			return "";
		default:
			var dtUser:DOMNodeList= parsedxml.getElementsByTagName("UsrGaus"); 
			var nnode:DOMNode= dtUser.item(0); 
			var nnodeChild:DOMNode= nnode.getFirstChild();
			var strUser:String = "";
			if (nnodeChild != null) strUser = nnodeChild.getNodeValue();
		
			return strUser;			
	}				
}

function getErrorMessageFromCode (strError:String, strErrorMsg:String, strMailSafe:String){
	switch(strError) {
	case "WSR9999":
	case "WSR9998":
	case "WSR9997":
	case "WSR1000":
	case "WSR2003":
	case "WSR2005":
		return "Por favor comunicarse con Sistemas.\bError:" + strError + " - " + strErrorMsg + " (" + strMailSafe + ")";	
	case "WSR1001":
	case "WSR2002":
		return "Por favor comunicarse con Operaciones.No existe su perfil.\b" + strMailSafe + " está utilizando una " + strErrorMsg + " (Error:" + strError + ")";
	case "WSR2001":
		return "Se están realizando tareas de mantenimiento. No se permite actividad.\b" + strError + " - " + strErrorMsg;
	case "WSR2004":
		return strErrorMsg + " (Error:" + strError + ")\bPor favor ingresar en Gaus y eliminarlos para poder emitir.";
	case "WSR2006":
	case "WSR2009":		
		return "para iniciar emisión debe salir de Gaus.\b" + strErrorMsg + " (Error:" + strError + ")";
	case "WSR2007":
		return "tiene trabajos activos. Y existen registros en GTI983";
	case "WSR2008":
		return "Por favor comunicarse con Operaciones y solicitar que bajen la session de webfacing.\bTiene trabajos activos pero no existen registros en GTI983";
	default:
		return "Por favor comunicarse con Sistemas.\bNo se ha encontrado el codigo de Error." + strError + " - " + strErrorMsg + " (" + strMailSafe + ")";	
	}	
}

function limpiarTrabajosActivos (docXspProp_prm:NotesXspDocument) {
	var strUser:String = getUserIdAS400 ();
	if (strUser.equals("")) return false;
	
	var rtdoQuery:java.util.ArrayList = buscarTrabajoActivoPerUser (docXspProp_prm, strUser);
	var i:int=0;
	var vProps:NotesView = getDbPropuestas().getView ("v.Sys.Prop.Cod");
	var docProp:NotesDocument;

	if (rtdoQuery == null) {
		print ("El usuario: " + strUser + " no tiene trabajos activos");
		return;
	}
	//print ("Trabajos activos: " + rtdoQuery.size().toString());
	for (i=0;i<rtdoQuery.size();i++) {
		docProp = vProps.getDocumentByKey(rtdoQuery.get(i));
		if (docxProp == null) throw new java.lang.Exception("La propuesta " + rtdoQuery.get(i) + " no fue encontrada, no se pueden eliminar trabajos en GAUS (ERROR PROP000)");
		bajarTrabajoActivo (docProp);
	}
}



function cerrarPropDeAS400 (docXspProp_prm:NotesXspDocument, booInconsistencia:boolean):boolean {
	/*
	 * 
Verifica en tablas del as400, buscando por número de propuesta.  

0- Busco en la tabla de usuarios actividad
- Si encuentra algo, devuelvo error de que primero debe cerrar en GAUSS.
1- Busco en la tabla de emitidas
- Si encuentra algo, paso el estado a Emitida.  Y grabo el número de poliza en la Propuesta.
2- Busco en la tabla de suspendidas
- Si encuentra algo, paso el estado a Suspendida.
3- Busco en la tabla de anuladas y rehabilitadas
- Si encuentra algo, paso el estado a Suspendida Especial.

- Si no lo encuentra en ninguna de las tablas anteriores, tenemos que volver al estado anterior la propuesta, para que se vuelva a mostrar el botón de inicio de emisión.

	 * */
	
	
	/*
	 * Sólo se busca trabajos activos, cuando no estamos trabajando una inconsistencia.
	 * Porque cuando quedó una inconsistencia, es un caso donde quedó un trabajo activo
	 * en gaus, y debemos eliminarlo y actualizar el estado de la propuesta.
	 * Lo eliminamos con el insert del caso de suspendida.  Ese insert dispara un trigger
	 * en el AS400 que efectua la baja del trabajo que quedó activo.
	 * */
	
	//Lo más fácil blankear estas variables y luego reSetearlas si en
	//el as400 está suspendida especial.
	var booRecuperar = false;
	docxProp.replaceItemValue("sol_webFacSes_des", "");
	viewScope.put("booWebFacingError", false)
	viewScope.put("booGeneralError", false)
	
	if (booInconsistencia == false) {
		if (buscarTrabajoActivo(docXspProp_prm) == true) return false;
	}else {
		setSysLog (docXspProp_prm.getDocument(), "Corrigiendo Inconsistencia");
	}
	var vecEstProp:java.util.Vector = getDataFromPropOnAS400 (docXspProp_prm); 
	var strEstProp:String = vecEstProp.elementAt(0);
	var strEstDescProp:String = vecEstProp.elementAt(1);
	//print("FPR cerrarPropDeAS400 - estado obtenido de ws:" + strEstDescProp + " - " + strEstProp)
	setSysLog (docXspProp_prm.getDocument(), "Se cerró la emisión y se obtuvo del Web Facing el estado: " + strEstProp + " (" + strEstDescProp + ")");
	var tipoMovimiento:String = docXspProp_prm.getItemValueString ("sol_tipoMovimiento_cod");
	var tipoOperacion:String = docXspProp_prm.getItemValueString ("sol_tipoOperacion_cod");
	
	switch (strEstProp) {
		case "9": //Emitida
			updateEstadoPropuesta (docXspProp_prm, "90");
			docXspProp_prm.replaceItemValue("sol_superpoliza_nro", vecEstProp.elementAt(2));
			docXspProp_prm.replaceItemValue("sol_superpolizaSuplemento_nro", new java.lang.Integer(vecEstProp.elementAt(3)));
			docXspProp_prm.replaceItemValue("sol_superpolizaSuplemento_des", vecEstProp.elementAt(3));
			docXspProp_prm.replaceItemValue("sol_poliza_nro", vecEstProp.elementAt(4));
			docXspProp_prm.replaceItemValue("fechaEmisionReal_nro", session.createDateTime("Today"));
			var strFemi:String = vecEstProp.elementAt(5).toString();
			var dtFemi:NotesDateTime = StringToNotesDateTime(strFemi ,"yyyyMMdd", "dd/MM/yyyy");
			docXspProp_prm.replaceItemValue("fechaEmisionGaus_nro", dtFemi);
			
			var sol_cotizacion_nro:String = docXspProp_prm.getItemValueInteger("sol_cotizacion_nro");
			if(sol_cotizacion_nro != "" && sol_cotizacion_nro != "0"){
				
				importPackage(ar.com.hdi.autos.connect);
				var jce:GetArrayFromQueryAS400 = new GetArrayFromQueryAS400();
				jce.setInsertAS("solUPD_GTI980_marcaWeb", docXspProp_prm.getDocument());
			}
			//Si Emití una Anulación por reemplazo voy a preguntar si quiere generar la nueva por reemplazo
			if(tipoMovimiento == "4" && tipoOperacion == "2"){
				/*
				 * En sessionScope.AnulacionEmitidaPorReemplazo voy a guardar estados de la anulacion.
				 * La clave del mapa es el UNID de la propuesta
				 * 0 - Estado Inicial --> Valor que le asigno en este momento
				 * 1 - Si el usuario responde que quiere generar la nueva (logica mas adelante)
				 * 2 - Si el usuario generó la nueva (logica mas adelante)
				 * 9 - Si el usuario responde que NO quiere generar la nueva (logica mas adelante)
				 * Cuando salga de Gaus si tiene 0, es donde voy a preguntar y hacer la logica mas adelante
				 * */
				sessionScope.AnulacionEmitidaPorReemplazo = (sessionScope.AnulacionEmitidaPorReemplazo || new java.util.HashMap());
				sessionScope.AnulacionEmitidaPorReemplazo.put(docXspProp_prm.getDocument().getUniversalID(), "0");
			}
			
			// Si se trata de una emisión multirrama
			if (docXspProp_prm.getItemValueString("sol_MR_ramaSecundaria_cod").equals("") == false) {
				print ("actualizarCamposGTI980");
				actualizarCamposGTI980(docXspProp_prm);
			}
			break;
		case "0": //Suspendida - TESTEADO			
			if (booInconsistencia == true) {
				if (buscarTrabajoActivo(docXspProp_prm) == true) {
					//Si quedó activo, lo bajo y actualizo las variables.
					bajarTrabajoActivo (docXspProp_prm.getDocument());
					buscarTrabajoActivo(docXspProp_prm);
				}
			}
			updateEstadoPropuesta (docXspProp_prm, "87");
			updateSpwvehABM(docXspProp_prm);
		
			break;
		case "1": //Baja (Eliminación) de Suspendida
			if (docXspProp_prm.getItemValueString("sol_webFacRec_des").equals ("1")) booRecuperar = true;
			
			setSysLog (docXspProp_prm.getDocument(), "La propuesta está Baja (eliminada) de Suspendida");
			if (booRecuperar) {
				setSysLog (docXspProp_prm.getDocument(), "recuperar:1 de 4");
				var strRecEst = docXspProp_prm.getItemValueString("sol_webFacRecEstado_des");
				if(strRecEst == "85" || strRecEst == "87"){
					setSysLog (docXspProp_prm.getDocument(), "Se forzó el cambio de estado a Stock");
					strRecEst = "98";
				}
				var strRecCom = docXspProp_prm.getItemValueString("sol_webFacRecCom_des");
				var strNroOrdenActual:String = docXspProp_prm.getItemValue("orden_nro").elementAt(0).toString();
				setSysLog (docXspProp_prm.getDocument(), "Se sobreescribirá el número de orden: " + strNroOrdenActual);
				//docXspProp_prm.replaceItemValue("log_des", "");
				setSysLog (docXspProp_prm.getDocument(), "recuperar:2 de 4. Esatdo a:" + strRecEst);
				updateEstadoPropuesta (docXspProp_prm, strRecEst);
				var itemLog:NotesItem = docXspProp_prm.getDocument().getFirstItem("log_des");
				setSysLog (docXspProp_prm.getDocument(), "recuperar:3 de 4");
				setLog (itemLog, "Eliminar de Susp y Rec.Envió a Estado: " + getStatusLabel(strRecEst) + " - " + strRecCom);
				docXspProp_prm.replaceItemValue("sol_webFacRec_des", "0");
				docXspProp_prm.replaceItemValue("sol_webFacRecEstado_des", "");
				docXspProp_prm.replaceItemValue("sol_webFacRecCom_des", "");
				docXspProp_prm.replaceItemValue("sol_statusHistorico_des", "98");
				//rollbackEstadoPropAntesDeEmision (docXspProp_prm);
				//INI - RollBack veh_spwvehABM_cod como estaba al Iniciar Emision
				
				switch (tipoMovimiento){
					case "1": //NUEVA
						//Elmino los datos de superpoliza
						docXspProp_prm.replaceItemValue("sol_superpoliza_nro", "");//Elimino el nro de superpoliza
						docXspProp_prm.replaceItemValue("sol_superpolizaSuplemento_nro", "");//Elimino el sup de superpoliza
						docXspProp_prm.replaceItemValue("sol_superpolizaSuplemento_des", "");//Elimino el sup de superpoliza
						
					case "2": //RENOVACION
						setSpwvehABM_cod("A", docXspProp_prm.getDocument().getUniversalID());	  
						break;   
					case "3": //ENDOSO
						if(tipoOperacion == "5" || tipoOperacion == "11"){ //Endoso Alta o Refacturacion ?? TODO: Confirmar si Refa funciona OK
							setSpwvehABM_cod("A", docXspProp_prm.getDocument().getUniversalID());
							break;
						}
						if(tipoOperacion == "6"){ //Endoso Baja 
							setSpwvehABM_cod("B", docXspProp_prm.getDocument().getUniversalID());
							break;
						}
						//Resto de endosos paso M total si no hay coleccion no actualiza
						setSpwvehABM_cod("M", docXspProp_prm.getDocument().getUniversalID());
					default: //ANULACION o REHABILITACION
						break;
				}
				setSysLog (docXspProp_prm.getDocument(), "recuperar:4 de 4");
				//FIN - RollBack veh_spwvehABM_cod como estaba al Iniciar Emision
			}
			else {
				//unLinkPropWithProp(docXspProp_prm.getDocument().getUniversalID());
				updateEstadoPropuesta (docXspProp_prm, "82"); //No Emitida
				docXspProp_prm.replaceItemValue("fechaNoEmitida_nro", session.createDateTime("Today"));//Cargar la fecha de No Emitida
			}
					
			break;
		case "3": //Suspendida especial - TESTEADO
			setSysLog (docXspProp_prm.getDocument(), "Se deja inalterado el estado de la propuesta ya que en el Web Facing también quedó suspendida especial");
			docxProp.replaceItemValue("sol_webFacSes_des", "1");
			viewScope.put("booWebFacingError", true)
			viewScope.put("booGeneralError", true);
			viewScope.put("strGralErrorMessage", "La propuesta está Suspendida Especial en Gaus, debe solicitar su liberación a Operaciones.");
			break;
		case "4": //Anulación
			setSysLog (docXspProp_prm.getDocument(), "Se deja inalterado el estado de la propuesta ya que en el Web Facing quedó anulada. Quedó en PAWKL1(Se cayó)");
			break;
		case "X": //No existe - TESTEADO
			setSysLog (docXspProp_prm.getDocument(), "La propuesta no existe en el AS400");
			rollbackEstadoPropAntesDeEmision (docXspProp_prm);
			var result:boolean = eliminarVehiculos (docXspProp_prm);
			break;
	}
	docXspProp_prm.save();	 
	viewScope.put("strAS400url", null)
	viewScope.put("cerrarNecesario", "0")
	if (booRecuperar) {
		session.getCurrentDatabase().getAgent("a.ObtCorr").runWithDocumentContext(docXspProp_prm.getDocument());
	}
	return true;
}


function eliminarVehiculos (docXspProp_prm:NotesXspDocument) {
	var result:boolean = false;
	importPackage(ar.com.hdi.autos.connect);
	var jce:GetArrayFromQueryAS400 = new GetArrayFromQueryAS400();
	var rtdoQueryVeh:java.util.ArrayList = jce.getSelectAS("vehSEL_SPWVEH", docXspProp_prm.getDocument());
	if (rtdoQueryVeh.size() > 0) {
		rtdoQueryVeh = jce.doDeleteAS("vehDEL_SPWVEH", docXspProp_prm.getDocument());
		result = true;
	}
	
	var rtdoQueryAcc:java.util.ArrayList = jce.getSelectAS("vehAccSEL_SPWACC", docXspProp_prm.getDocument());
	if (rtdoQueryAcc.size() > 0) {
		rtdoQueryAcc = jce.doDeleteAS("vehAccDEL_SPWACC", docXspProp_prm.getDocument());
	}
	return result;
		
}



function buscarTrabajoActivo (docXspProp_prm:NotesXspDocument):boolean {
	importPackage(ar.com.hdi.autos.connect);
	var jce:GetArrayFromQueryAS400 = new GetArrayFromQueryAS400();
	var rtdoQuery:java.util.ArrayList = jce.getSelectAS("prop_TrabajosActivos", docXspProp_prm.getDocument());
		
	if (rtdoQuery.size() == 0) {
		viewScope.put("booIsJobActive", false);
		return false;
	}
	if (rtdoQuery.size() == 1) {
		viewScope.put("booIsJobActive", true);
		return true;
	}
	if (rtdoQuery.size() > 1) {
		viewScope.put("booIsJobActive", true);
		print ("CASO ANORMAL, TIENE MÁS DE 1 JOB ACTIVO");
		return true;
	}
	
}


function buscarTrabajoActivoPerUser (docXspProp_prm:NotesXspDocument, strUser_prm:String):java.util.ArrayList {
	if (strUser_prm == "") return;
	/*
	 * Voy a generar un documento temporal porque no quiero
	 * escribir un campo en la propuesta (por el dato del nombre de usuario en gaus)
	 * */
	importPackage(ar.com.hdi.autos.connect);
	var jce:GetArrayFromQueryAS400 = new GetArrayFromQueryAS400();
	var docTemp:NotesDocument = session.getCurrentDatabase().createDocument();
	docTemp.replaceItemValue("User_AS400", strUser_prm);
	docTemp.replaceItemValue("sol_articulo_cod", docXspProp_prm.getItemValueString ("sol_articulo_cod"));
	var rtdoQuery:java.util.ArrayList = jce.getSelectAS("prop_TrabajosActivosPorUsuario", docTemp);
	docTemp.recycle();
	return rtdoQuery;
}




function bajarTrabajoActivo (docProp_prm:NotesDocument):boolean {
	print ("Vamos a bajar un trabajo de la propuesta: " + docProp_prm.getItemValue("orden_nro").elementAt(0).toString()); //PRINT
	
	if (docProp_prm == null) throw new java.lang.Exception("La propuesta no fue encontrada, no se pueden eliminar trabajos en GAUS (ERROR PROP000) - bajarTrabajoActivo(docProp_prm)");
	importPackage(ar.com.hdi.autos.connect);
	var jce:GetArrayFromQueryAS400 = new GetArrayFromQueryAS400();
	jce.setInsertAS("prop_BajarTrabajosActivos", docProp_prm);
	setSysLog (docProp_prm, "Se Bajaron trabajos activos.");
	//Comento esta linea porque se estaban generando conflictos de replica.
	//docProp_prm.save();
}


function getDataFromPropOnAS400 (docXspProp_prm:NotesXspDocument):java.util.Vector {
	
	/*
	 * DEVUELVE UN VECTOR CON ESTAS POSICIONES
	 * 
	 * 0 - Código de estado
	 * 1 - Descripción de Estado
	 * 2 - Número de super poliza
	 * 3 - Número de suplemento de super poliza
	 * 4 - Número de poliza
	 * 		Devuelve "-1" si no encuentra la RAMA 3
	 * 		Devuelve "-2" si no encuentra el nodo <POLI> dentro del nodo <Poliza> que tiene como <RAMA> = 3
	 * 5 - Fecha de Emsion, viene con formato aaaaMMdd
	 *
	 * */
	
	/*
	 * Posibles estados:

0 = Suspendida Normal		ok -> suspendida
1 = Baja de Suspendida		ok -> vuelve al estado anterior
3 = Suspendida Especial		ok -> no hace nada, qda en susp esp
4 = Anulación bloqueada		ok -> no hace nada, qda en susp esp
9 = Emitida					ok -> Emitida
X = Solicitud no existe		ok -> vuelve al anterior

	 * 
	 * */
	
	var dbCfg:NotesDatabase = getDbCfg();
	var docProfile:NotesDocument = dbCfg.getProfileDocument("f.p.ConAS400", "");
	var strUrlBase:String = getFieldValueFromConfig("wsstsoln", "odbc_select_des");

	var strArticulo:String = docXspProp_prm.getItemValue("sol_articulo_cod").elementAt(0);
	var strNroSol:String = docXspProp_prm.getItemValue("orden_nro").elementAt(0).toString();
	var vecEstado:java.util.Vector = new java.util.Vector ();
	
	//Create the XML Document
	var parsedxml:org.w3c.dom.Document = null; 
	//Create the Parser Factory and document builder
	var domfactory:javax.xml.parsers.DocumentBuilderFactory= 
	javax.xml.parsers.DocumentBuilderFactory.newInstance(); 
	var xmldocument:javax.xml.parsers.DocumentBuilder= domfactory.newDocumentBuilder(); 
	//Read the XML from the XAgent
	
	var parsedxml= xmldocument.parse(strUrlBase + strArticulo + "/" + strNroSol);
	if (getFieldValueFromConfig("wsstsoln", "odbc_MsgConsole_des") == "1"){
		print("wsstsoln=" + strUrlBase + strArticulo + "/" + strNroSol);		
	}
	var strSimularRta:String = viewScope.get("strSimularRta");
	if (strSimularRta != null) {
		if (strSimularRta.equals ("1")) {
			parsedxml= xmldocument.parse("http://srvdesa/speedway/configuracion.nsf/testXML?ReadForm");
		}
	}

		
	//Obtenemos el estado
	var dtNodo:DOMNodeList= parsedxml.getElementsByTagName("MARP"); 
	var nnode:DOMNode= dtNodo.item(0); 
	var strEstado:String = nnode.getFirstChild().getNodeValue();
	vecEstado.add(strEstado);
	if (getFieldValueFromConfig("wsstsoln", "odbc_MsgConsole_des") == "1"){
		print ("estado en GAUS: " + strEstado);		
	}
	
	//Obtenemos la descripción del estado
	dtNodo = parsedxml.getElementsByTagName("STAT"); 
	nnode= dtNodo.item(0); 
	var strEstadoDesc:String = nnode.getFirstChild().getNodeValue();
	vecEstado.add(strEstadoDesc);

	//Solo busco los datos de la poliza si el estado es emitida
	if (strEstado.equals("9") == false) {
		vecEstado.add(new java.lang.Integer (0)); //Superpoliza
		vecEstado.add(new java.lang.Integer (0)); //Suplemento superpoliza
		vecEstado.add(new java.lang.Integer (0)); //Poliza
		return (vecEstado);
	}
	
	//Obtenemos el número de super poliza
	dtNodo = parsedxml.getElementsByTagName("SPOL"); 
	nnode= dtNodo.item(0); 
	var strNroSupPol:String = nnode.getFirstChild().getNodeValue();
	vecEstado.add(new java.lang.Integer(strNroSupPol));
	
	//Obtenemos el número de suplemento super poliza
	dtNodo = parsedxml.getElementsByTagName("SSPO"); 
	nnode= dtNodo.item(0); 
	var strNroSupSupPol:String = nnode.getFirstChild().getNodeValue();
	vecEstado.add(strNroSupSupPol);
	
	
	//Todo lo siguiente para obtener el número de poliza
	//Loopeamos el nodo <POLIZAS>
	var nodosPoliza:DOMNodeList;
	var nodoPoliza:DOMNode;
	var nodosDePoliza:DOMNodeList;
	var nodoHijoDePoliza:DOMNode;
	var intNodoPolizaIndex:int=-1;
	var strRama:String;
	
	nodosPoliza = parsedxml.getElementsByTagName("Poliza");
	for (var i=0; i<nodosPoliza.getLength(); i++) { //Recorro los nodos <Poliza>
		intNodoPolizaIndex = i;
		nodoPoliza = nodosPoliza.item(i);
		nodosDePoliza = nodoPoliza.getChildNodes(); //Tomo los hijos del nodo <Poliza> y los recorro
		for (var j=0; j<nodosDePoliza.getLength(); j++) {
			nodoHijoDePoliza = nodosDePoliza.item(j);
			//print (nodoHijoDePoliza.getNodeName());
			if (nodoHijoDePoliza.getNodeName().equals ("RAMA")) {
				strRama = nodoHijoDePoliza.getFirstChild().getNodeValue();
				
				// Reemplazar "3" por la rama que corresponde. Usar docXspProp_prm
				if (strRama.equals("3") == true || strRama.equals("03") == true) { //Encontre el nodo <Poliza> cuya rama es 3
					//intNodoPolizaIndex va a quedar en el i donde lo encontre
					i = nodosPoliza.getLength() + 3; //Para que salga del for
					j = nodosDePoliza.getLength() + 3; //Para que salga del for
				}
			}
		}
	}
	
	
	if (intNodoPolizaIndex==-1) {
		vecEstado.add(new java.lang.Integer("-1"));
		return (vecEstado);
	}
	
	//Ahora trabajo con el nodo <POLIZA> que tiene la <RAMA> 3
	var strNroPoliza:String = "-2";
	nodoPoliza = nodosPoliza.item(intNodoPolizaIndex);
	nodosDePoliza = nodoPoliza.getChildNodes(); //Tomo los hijos del nodo <Poliza> y los recorro
	for (var j=0; j<nodosDePoliza.getLength(); j++) {
		nodoHijoDePoliza = nodosDePoliza.item(j);
		if (nodoHijoDePoliza.getNodeName().equals ("POLI")) {
			strNroPoliza = nodoHijoDePoliza.getFirstChild().getNodeValue();
		}
	}	
	vecEstado.add(new java.lang.Integer(strNroPoliza));

	//Obtenemos la fecha de emision
	dtNodo = parsedxml.getElementsByTagName("FEMI"); 
	nnode= dtNodo.item(0); 
	var strFechaEmision:String = nnode.getFirstChild().getNodeValue();
	vecEstado.add(strFechaEmision);
	//print ("fechaEmision en GAUSS: " + strFechaEmision);
	
	return (vecEstado);

}

function isPropuestaSuspendida ():boolean {
	var docxProp:NotesXspDocument = viewScope.get("docxProp");
	var strEstadActual:String = getEstadoPropuesta (docxProp);

	if (strEstadActual.equals ("87")) {
		return true;
	}
	else {
		return false;
	}
}

function isPropuestaSuspendidaEsp ():boolean {
	var docxProp:NotesXspDocument = viewScope.get("docxProp");
	var strEstadActual:String = getEstadoPropuesta (docxProp);

	if (strEstadActual.equals ("85")) {
		return true;
	}
	else {
		return false;
	}
}
function validacionesPreEmision(){
	/*
	 * - Validar que el codigo de asegurado no sea cero ni vacio
	 * - Validar que el codigo de productor no sea cero ni vacio
	 * - Que al menos exista 1 vehiculo
	 * - Los vehiculos tienen que estar validos o aprobados
	*/
}

function beforePageLoadAS400 () {	
	var docxProp:NotesXspDocument = viewScope.get("docxProp");	
	var collProp:DocumentCollection = getDuplicidadPropuesta(docxProp);
	var informationMessage:String = "";
	var vecPatentesPropActual:java.util.Vector = geArrayFromVehiculosDeUnaPropuesta("veh_patente_des", docxProp.getDocument().getUniversalID());
	if(collProp.getCount() > 0){
		var doc:NotesDocument = collProp.getFirstDocument();
		while (doc != null) {
			//validar todas menos el documento actual
			if(docxProp.getItemValueInteger("orden_nro") != doc.getItemValueInteger("orden_nro")){
				informationMessage = "Posible duplicidad, con la orden Nº: " + doc.getItemValueInteger("orden_nro") + " (" + doc.getItemValueString("sol_status_des") + ").";
				//Por cada Propuesta que puede ser duplicada comparo las patentes con los vehiculos de la propuesta actual
				var vecPatentes:java.util.Vector = geArrayFromVehiculosDeUnaPropuesta("veh_patente_des", doc.getUniversalID());
				for (i=0; i<vecPatentesPropActual.size(); i++) {
					if(vecPatentes.contains(vecPatentesPropActual.elementAt(i))){
						informationMessage = "Posible duplicidad, con la orden Nº: " + doc.getItemValueInteger("orden_nro") + " (" + doc.getItemValueString("sol_status_des") + "). Patente " + vecPatentesPropActual.elementAt(i) + " duplicada.";					
					}
				}
								
			}
			var tmpdoc = collProp.getNextDocument();
			doc.recycle();
			doc = tmpdoc;
		}	
	}	
	if (informationMessage != ""){
		setInformationMessage(informationMessage);
	}
	
	limpiarTrabajosActivos (docxProp);
	viewScope.put("booIsUserActive", isUserActiveOnAS400());
	viewScope.put("cerrarNecesario", "0");  //no uso un boolean porque el valor luego se pone en el campo input hidden
	viewScope.put("booGeneralError", false);
	viewScope.put("strGralErrorMessage", "");
	viewScope.put("booIsAS400", true); //Esta variable es para que otros CC sepan que se llamaron desde el AS400
	
	var booIsFirstLoad:boolean = viewScope.get("booIsPageFirstLoad");
	if (booIsFirstLoad == false) {
		return;
	}
	viewScope.put("booWebFacingError", false);
	viewScope.put("booIsPageFirstLoad", false);
	var strWebFacing:String = docxProp.getItemValueString("sol_webFacSes_des");
	if (strWebFacing.equals ("1")) {
		//Si entró aca es porque al dividir pantalla, se detectó que ya habían
		//Comenzado la sesión con webfacing y finalizón anormalmente.
		viewScope.put("booWebFacingError", true);
	}	
}

function isInspeccionesDePropuestaOK(prm_strNroProp:String){
	var vInspPorEst:NotesView = getDbInspecciones().getView("vLK_InspPorNroPropEstado");
	var collInsp:NotesDocumentCollection = vInspPorEst.getAllDocumentsByKey(prm_strNroProp + "-20"); //20 es el estado de insp. Enviada.
	if (collInsp.getCount() > 0) {
		vInspPorEst.recycle();
		collInsp.recycle();
		return false;
	}
	collInsp = vInspPorEst.getAllDocumentsByKey(prm_strNroProp + "-30"); //30 es el estado de insp. Inspeccionada.
	if (collInsp.getCount() > 0) {
		vInspPorEst.recycle();
		collInsp.recycle();
		return false;
	}
	if(vInspPorEst != null){
		vInspPorEst.recycle();
	}
	if(collInsp != null){
		collInsp.recycle();
	}		
	return true;
}



function actualizarCamposGTI980(docXspProp_prm:NotesXspDocument){
/* Busca en GTI980 por Empresa, Sucursal, Artículo, Nro. de Superpóliza, Suplemento y Nro. de Solicitud.
 * En el caso de pólizas multirrama, debería haber 2 o más resultados:
 * 	- A la póliza actual (Autos) le actualiza G0MAR9=1
 * 	- Al resto de las pólizas les actualizo G0SOLN=0 y G0MAR9=5
 * 
 * Cambiar el nro de solicitud (SOLN) a 0 hará que el proceso de ingreso de pólizas de los otros
 * Speedway tomen y renumeren esas pólizas.
 */
	
	importPackage(ar.com.hdi.autos.connect);
	var jce:GetArrayFromQueryAS400 = new GetArrayFromQueryAS400();
	var doc:NotesDocument = database.createDocument();
	
	//Empresa, Sucursal, Artículo, Nro. de Superpóliza, Suplemento y Nro. de Solicitud.
	doc.replaceItemValue("sol_empresa_cod", "A");
	doc.replaceItemValue("sol_sucursal_cod", "CA");
	doc.replaceItemValue("sol_articulo_cod", docXspProp_prm.getItemValue("sol_articulo_cod"));
	doc.replaceItemValue("sol_rama_cod", docXspProp_prm.getItemValue("sol_rama_cod"));
	doc.replaceItemValue("sol_superpoliza_nro", docXspProp_prm.getValue("sol_superpoliza_nro"));
	doc.replaceItemValue("sol_superpolizaSuplemento_nro", docXspProp_prm.getValue("sol_superpolizaSuplemento_nro"));
	doc.replaceItemValue("orden_nro", docXspProp_prm.getItemValue("orden_nro"));
	
	// Actualiza póliza principal
	jce.getSelectAS("solUPD_GTI980_MRPrincipal", doc);
	
	var strRamaSecArray:Array = new Array();
	
	print("sol_MR_ramaSecundaria_cod: " + docXspProp_prm.getItemValue("sol_MR_ramaSecundaria_cod"));

	strRamaSecArray = docXspProp_prm.getItemValue("sol_MR_ramaSecundaria_cod");
	
	// Actualiza las pólizas secundarias,
	// buscando cada una con la clave anterior, más la rama que le corresponde
	for (i = 0; i < strRamaSecArray.length; i++) {
		//print("Rama Secundaria ARRAY ELEMENT: " + strRamaSecArray[i]);
		doc.replaceItemValue("sol_rama_cod", strRamaSecArray[i]);
		jce.getSelectAS("solUPD_GTI980_MRSecundarios", doc);
	}

	doc.recycle();
}