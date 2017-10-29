function propQuerySave(documentPropuesta_xsp:NotesXspDocument, isNew:Boolean){
	// Aca se asigna valor a los campos ocultos de la propuesta al grabar 
	var docProp:NotesDocument = documentPropuesta_xsp.getDocument();
	if(isNew){ //Es nuevo
		if(getComponent("sol_tipoMovimiento_cod").getValue() == "1"){ //para las nuevas
			docProp.replaceItemValue("superOrden_cod", session.evaluate("@Unique"));
		}
		docProp.replaceItemValue("sol_tipoMovimiento_cod", getComponent("sol_tipoMovimiento_cod").getValue());		
		docProp.replaceItemValue("sol_tipoOperacion_cod", getComponent("sol_tipoOperacion_cod").getValue());
		docProp.replaceItemValue("sol_status_cod", getComponent("sol_status_cod").getValue());
		docProp.replaceItemValue("sol_superpoliza_nro", 0);
		setLogBackEnd (documentPropuesta.getDocument(), "Crea el documento");
		session.getCurrentDatabase().getAgent("a.ObtCorr").runWithDocumentContext(documentPropuesta.getDocument());
		if(!context.getUrlParameter("Mail").equals("")){
			var dbMails:NotesDatabase = getDbMails ();
			var docMail:NotesDocument = dbMails.getDocumentByUNID(viewScope.get("selectedEmailUNID"));
			linkMailWithDoc (docMail, documentPropuesta.getDocument().getUniversalID(),session.evaluate("@Unique"), true, false, true);
		}
	}else{
		setLogBackEnd (documentPropuesta.getDocument(), "Salvado del documento");
	}
	//Grabo las descripciones de los combos de AS400
	docProp.replaceItemValue("sol_status_des",getSelectedValueFromAlias('sol_status_cod')); 
	docProp.replaceItemValue("sol_tipoMovimiento_des",getSelectedValueFromAlias('sol_tipoMovimiento_cod'));
	docProp.replaceItemValue("sol_tipoOperacion_des",getSelectedValueFromAlias('sol_tipoOperacion_cod'));
	
	//INI - Control de duplicidad de propuestas
	var collProp:DocumentCollection = getDuplicidadPropuesta(documentPropuesta_xsp);
	if(collProp.getCount() > 0){
		var msg=new javax.faces.application.FacesMessage();
		var doc:NotesDocument = collProp.getFirstDocument();
		while (doc != null) {
			//validar todas menos el documento actual
			if(documentPropuesta_xsp.getItemValueInteger("orden_nro") != doc.getItemValueInteger("orden_nro")){
				facesContext.addMessage("Error",msg("Posible duplicidad, con la orden Nº: " + doc.getItemValueInteger("orden_nro") + " (" + doc.getItemValueString("sol_status_des") + ")."));
				setLogBackEnd (documentPropuesta.getDocument(), "Posible duplicidad, con la orden Nº: " + doc.getItemValueInteger("orden_nro"));
			}
			var tmpdoc = collProp.getNextDocument();
			doc.recycle();
			doc = tmpdoc;
		}
	}
	//FIN - Control de duplicidad de propuestas
};

function updateSpwvehABM(docXspProp_prm:NotesXspDocument){
	// Si no existen vehiculos a eliminar es que gaus los tomÃ³, va por modificacion
	if(!eliminarVehiculos (docXspProp_prm)){
		//Gaus habia tomado los vehiculos.
		//20140905 - Pedido 3684 - Se comenta la siguiente linea
		//setSpwvehABM_cod("M", docXspProp_prm.getDocument().getUniversalID());	
	}	
}

function insGTI982(newUnid:String){
	var docTemp:NotesDocument = getDbPropuestas().getDocumentByUNID(newUnid);
	importPackage(ar.com.hdi.autos.connect);
	var jce:GetArrayFromQueryAS400 = new GetArrayFromQueryAS400();
	jce.setInsertAS("solTB_GTI982_INS", docTemp);
	//Recycle
	if(!docTemp == null){
		docTemp.recycle();
	}
	return true;
}

function setSpwvehABM_cod(veh_spwvehABM_cod:String, unidPropuesta:String){
	var dbCurr:NotesDatabase = getDbPropuestas();
	var collVeh:DocumentCollection = getCollectionByKey(dbCurr, "v.Sys.GausVehAsocPropuestas", unidPropuesta);
	if(collVeh.getCount() > 0){
		var doc:NotesDocument = collVeh.getFirstDocument();
		while (doc != null) {
			doc.replaceItemValue("veh_spwvehABM_cod", veh_spwvehABM_cod);
			doc.save();
			var tmpdoc = collVeh.getNextDocument();
			doc.recycle();
			doc = tmpdoc;
		}
	}
	if (doc != null) {
		doc.recycle();
	}
	if (collVeh != null) {
		collVeh.recycle();
	}
	if (dbCurr != null) {
		dbCurr.recycle();
	}	
}

function isWsActive(prmWsName:String):boolean{
	var tipoHabilitacion:String = getFieldValueAsItemFromConfig(prmWsName, "odbc_HabilitarDesdeTipoFecha_des").toString();
	/* 0= Habilitado, se ejecuta sin validar fechas
	 * 1= Habilitado, se ejecuta si fecha del Server Notes >= fecha de parametros
	 * 2= Habilitado, se ejecuta si fecha de emision de WebService >= fecha de parametros 
	 * 9= Deshabilitado, no se ejecuta el ws 
	 */
	if (tipoHabilitacion.equals("[9]") || tipoHabilitacion.equals("[]")) return false;
	if (tipoHabilitacion.equals("[0]")) return true;
	if(!getFieldValueAsItemFromConfig(prmWsName, "odbc_HabilitarDesde_nro").toString().equals("[]")){
		var dtFechaHabilitacion:NotesDateTime = session.createDateTime(getFieldValueAsItemFromConfig(prmWsName, "odbc_HabilitarDesde_nro").elementAt(0).toString());
		if (tipoHabilitacion.equals("1")){//Fecha Server Notes
			var dtHoy:NotesDateTime = session.createDateTime(@Text(@Today()));
		}else{//Fecha de emision por WebService
			var dtHoy:NotesDateTime = getFechaEmisionWebService();
		}
		if (dtFechaHabilitacion.timeDifference(dtHoy) <= 0){
			return true;
		}
	}	
	return false;
}

function getNivelSuperiorProductor(vecNivelCodigo:java.util.Vector):java.util.Vector{
	/*	Recibo mismo vector que va como salida
	 * 	[0] Verdadero= tengo codigo / Falso= Codigo 0 o no se encuentra
	 * 	[1] Tipo Intermediario (1,3,5,6,7,9)
	 * 	[2] Codigo de Intermediario
	 * 	[3] Nombre de Intermediario
	 * */
	if(!vecNivelCodigo.elementAt(0)){
		vecResultado.add(false);
		return vecResultado;
	}
	var docTemp:NotesDocument = database.createDocument();
	docTemp.replaceItemValue("N2NIVT", vecNivelCodigo.elementAt(1));
	docTemp.replaceItemValue("N2NIVC", vecNivelCodigo.elementAt(2));
	
	var vecResultado:java.util.Vector = new java.util.Vector ();
	importPackage(ar.com.hdi.autos.connect);
	var jce:GetArrayFromQueryAS400 = new GetArrayFromQueryAS400();
	var rtdoQuery:java.util.ArrayList = jce.getSelectAS("prop_NivelSuperiorDeProductor", docTemp);
	if(rtdoQuery.size() == 0){
		vecResultado.add(false);
	}else{
		for (i=0;i<rtdoQuery.size();i++) {
			var arrValor = rtdoQuery.get(i).split("~");
			vecResultado.add((arrValor[0] == "0") ? false : true);
			vecResultado.add(arrValor[0]);
			vecResultado.add(arrValor[1]);
			vecResultado.add(arrValor[2]);
		}	
	}
	if(docTemp != null) docTemp.recycle();
	return vecResultado;
}

function isCargaPreEmision(unidPropuesta:String){
	var mapResult:java.util.HashMap = new java.util.HashMap ();
	var booSeInsertaronVehiculos:boolean = false;
	if (isMovimientoConVehiculos(unidPropuesta)){
		print("ONNN");
		importPackage(ar.com.hdi.autos.connect);
		var jce:GetArrayFromQueryAS400 = new GetArrayFromQueryAS400();
		//Obtengo la coleccion de vehiculos de la propuesta y hago el insert
		var collVeh:DocumentCollection = getCollectionByKey(getDbPropuestas(), "v.Sys.GausVehAsocPropuestas", unidPropuesta);
		if(collVeh.getCount() > 0){	
			jce.setInsertAS("vehINS_SPWVEH", collVeh);
			booSeInsertaronVehiculos = true;
		}else{
			mapResult.put("Resultado", false);
			mapResult.put("ErrMsg", "No se han encontrado componentes para realizar este tipo de operación");
			return mapResult;
		}
		collVeh.recycle();
		
		//Obtengo la coleccion de accesorios de la propuesta y hago el insert
		var collAcc:DocumentCollection = getCollectionByKey(getDbPropuestas(), "v.Sys.Acc.vLK_AsociadosEnPropuestas", unidPropuesta);
		if(collAcc.getCount() > 0){	
			jce.setInsertAS("vehAccINS_SPWACC", collAcc);
		}
		collAcc.recycle();
	};
	
	var docTemp:NotesDocument = database.getDocumentByUNID(unidPropuesta);
	if (docTemp != null){
		//*** INI *** Pedido 3854 - Validar con WebService
		if(isWsActive("wsvehint")){
			var strUrlCompleta:String = evaluateFormula(getFieldValueFromConfig("wsvehint", "odbc_select_des"), docTemp).elementAt(0).toString();
			var parsedxml:org.w3c.dom.Document = null;
			var domfactory:javax.xml.parsers.DocumentBuilderFactory=javax.xml.parsers.DocumentBuilderFactory.newInstance(); 
			var xmldocument:javax.xml.parsers.DocumentBuilder= domfactory.newDocumentBuilder();
			var url:java.net.URL = new java.net.URL(strUrlCompleta + "/" + @Unique()); //Le agrego el @Unique para evitar cacheo.
			var conn:java.net.URLConnection = url.openConnection();
				
			var uConn:java.net.HttpURLConnection = conn;
			var is:org.xml.sax.InputSource = new org.xml.sax.InputSource(uConn.getInputStream());
			is.setEncoding("ISO-8859-1");	
			var parsedxml= xmldocument.parse(is);
			if (getFieldValueFromConfig("wsvehint", "odbc_MsgConsole_des") == "1"){
				print("wsvehint=" + strUrlCompleta);		
			}else if	(getFieldValueFromConfig("wsvehint", "odbc_MsgConsole_des") == "2"){
				AgentLogAutos("wsvehint",0,strUrlCompleta)
			}
			
			var strErrMsg:String = isWsWithErrors(parsedxml); 
			if(!strErrMsg.equals ("")){
				if(getFieldValueFromConfig("wsvehint", "odbc_MsgConsole_des") == "2"){
					AgentLogAutos("wsvehint",0,strUrlCompleta + ": " + strErrMsg)
				}
				eliminarVehiculos (wrapDocument(docTemp));
				mapResult.put("Resultado", false);
				mapResult.put("ErrMsg", strErrMsg);
				if (booSeInsertaronVehiculos) eliminarVehiculos (wrapDocument(docTemp));
				docTemp.recycle();
				return mapResult;	
			}
			
			//Obtenemos si es valido o no 
			dtNodo = parsedxml.getElementsByTagName("isValid"); 
			nnode= dtNodo.item(0);
			if(getFieldValueFromConfig("wsvehint", "odbc_MsgConsole_des") == "2"){
				AgentLogAutos("wsvehint",0,strUrlCompleta + ": Dato=" + nnode.getFirstChild().getNodeValue())
			}
			if (nnode.getFirstChild().getNodeValue() == "false"){
				eliminarVehiculos (wrapDocument(docTemp));
				mapResult.put("Resultado", false);
				mapResult.put("ErrMsg", "Error en el Webservice. Comuniquese con Sistemas");
				if (booSeInsertaronVehiculos) eliminarVehiculos (wrapDocument(docTemp));
				docTemp.recycle();
				return mapResult;
			}
		}else{//El WS no se encuentra activo
			if (booSeInsertaronVehiculos) eliminarVehiculos (wrapDocument(docTemp));
			if (getFieldValueFromConfig("wsvehint", "odbc_MsgConsole_des") == "1"){
				print("wsvehint= el Ws NO se encuentra activo");		
			}else if	(getFieldValueFromConfig("wsvehint", "odbc_MsgConsole_des") == "2"){
				AgentLogAutos("wsvehint",0,"el Ws NO se encuentra activo")
			}
		}//Termina if de wsvehint
		//*** FIN *** Pedido 3854 - Validar con WebService
		
		//*** INI *** Pedido 3782 - Inhibicion de renovacion
		if(isWsActive("wspolren")){
			if(docTemp.getItemValueString("sol_tipoMovimiento_cod").equals("2")){
				var strUrlCompleta:String = evaluateFormula(getFieldValueFromConfig("wspolren", "odbc_select_des"), docTemp).elementAt(0).toString();
				var parsedxml:org.w3c.dom.Document = null;
				var domfactory:javax.xml.parsers.DocumentBuilderFactory=javax.xml.parsers.DocumentBuilderFactory.newInstance(); 
				var xmldocument:javax.xml.parsers.DocumentBuilder= domfactory.newDocumentBuilder();
				var url:java.net.URL = new java.net.URL(strUrlCompleta + "/" + @Unique()); //Le agrego el @Unique para evitar cacheo.
				var conn:java.net.URLConnection = url.openConnection();
					
				var uConn:java.net.HttpURLConnection = conn;
				var is:org.xml.sax.InputSource = new org.xml.sax.InputSource(uConn.getInputStream());
				is.setEncoding("ISO-8859-1");	
				var parsedxml= xmldocument.parse(is);
				if (getFieldValueFromConfig("wspolren", "odbc_MsgConsole_des") == "1"){
					print("wspolren=" + strUrlCompleta);		
				}else if	(getFieldValueFromConfig("wspolren", "odbc_MsgConsole_des") == "2"){
					AgentLogAutos("wspolren",0,strUrlCompleta)
				}
				
				//No tiene errores este Ws
				
				//Obtenemos si es renovable o no 
				dtNodo = parsedxml.getElementsByTagName("Renovable"); 
				nnode= dtNodo.item(0);
				if(getFieldValueFromConfig("wspolren", "odbc_MsgConsole_des") == "2"){
					AgentLogAutos("wspolren",0,strUrlCompleta + ": Dato=" + nnode.getFirstChild().getNodeValue())
				}
				if (nnode.getFirstChild().getNodeValue() == "N"){
					mapResult.put("Resultado", false);
					mapResult.put("ErrMsg", "La póliza ha sido marcada como NO Renovable.");
					if (booSeInsertaronVehiculos) eliminarVehiculos (wrapDocument(docTemp));
					docTemp.recycle();
					return mapResult;
				}
			}
		}else{//El WS no se encuentra activo	
			if (getFieldValueFromConfig("wspolren", "odbc_MsgConsole_des") == "1"){
				print("wspolren= el Ws NO se encuentra activo");		
			}else if	(getFieldValueFromConfig("wspolren", "odbc_MsgConsole_des") == "2"){
				AgentLogAutos("wspolren",0,"el Ws NO se encuentra activo")
			}
		}
		//*** FIN *** Pedido 3782 - Inhibicion de renovacion
	}else{ // DocTemp es Nulo
		if (booSeInsertaronVehiculos) eliminarVehiculos (wrapDocument(docTemp));
	}	
		
	
	if(docTemp != null) docTemp.recycle();
	mapResult.put("Resultado", true);
	return mapResult;
}

function getUltimaPropuestaEmitida(unidPropuesta:String, sol_pathHistorico_des:String):NotesDocument{
	if(sol_pathHistorico_des == ""){
		var dbCurr:NotesDatabase = getDbPropuestas();
	}else{	
		var srv = session.createName(database.getServer()).getCommon() + "/" + session.createName(database.getServer()).getOrganization();
		var dbCurr:NotesDatabase = session.getDatabase(srv, sol_pathHistorico_des, false);
	}
	var collProp:DocumentCollection = getCollectionByKey(dbCurr, "v.UI.PropAsocPropuesta_EmbView", unidPropuesta);
	if(collProp.getCount() > 0){
		var doc:NotesDocument = collProp.getFirstDocument();
		while (doc != null) {
			if(doc.getItemValueString("sol_status_cod") == "90"){
				if (collProp != null) {
					collProp.recycle();
				}
				return doc;
			}else{
				unidPropuesta = doc.getUniversalID();
				if (collProp != null) {
					collProp.recycle();
				}
				doc.recycle();
				var collProp:DocumentCollection = getCollectionByKey(dbCurr, "v.UI.PropAsocPropuesta_EmbView", unidPropuesta);
				if(collProp.getCount() > 0){
					var tmpdoc:NotesDocument = collProp.getFirstDocument();
					doc = tmpdoc;
				}				
			}	
		}		
	}	
}

function getMsgOperacionIncoherente(tipoMovimiento_cod:String, tipoOperacion_cod:String, sol_tipoMovimiento_cod:String, sol_tipoOperacion_cod:String){
	var result:String;
	switch(tipoMovimiento_cod) {
		case "2": //Renovacion(2): (1)(2)(3)(5)
			result = (sol_tipoMovimiento_cod == "4")?"No puede renovar una anulaciÃ³n!!":"";
			break;
		case "3": //Endoso(3)=(1)(2)(3)(5)			
			result = (sol_tipoMovimiento_cod == "4")?"No puede realizar un endoso a una anulaciÃ³n!!":"";
			if(sol_tipoMovimiento_cod == "3" && sol_tipoOperacion_cod == "11" && tipoOperacion_cod == "11"){ //Endoso refacturacion
				result = "No puede volver a refacturar la operaciÃ³n!!"
			}
			break;
		case "4": //Anulacion(4): (1)(2)(3)(5)
			result = (sol_tipoMovimiento_cod == "4")?"La pÃ³liza ya se encuentra anulada!!":"";
			break;
		case "5": //Rehabilitacion(5): (4)
			result = (sol_tipoMovimiento_cod != "4")?"La pÃ³liza no se encuentra anulada. No puede rehabilitarla!!":"";
			break;
		default: // PRESENTA ERROR DE APLICACION 
			//NUEVA - Nunca se daria este case 
			throw new java.lang.Error("NO SE HA PODIDO CONTINUAR CON LA OPERACION. (ERROR PROP001)");
			break;
	}
	return result;
}
function getDuplicidadPropuesta(docPropXsp_prm:NotesXspDocument):DocumentCollection{
	var vecColumns:java.util.Vector = new java.util.Vector ();
	vecColumns.add(docPropXsp_prm.getItemValueString("sol_productor_cod"));
	vecColumns.add(docPropXsp_prm.getItemValueString("sol_asegurado_des"));
	var dt:NotesDateTime =  docPropXsp_prm.getItemValueDateTime("sol_vigenciaDesdeOperacion_nro");	
	vecColumns.add(dt.getDateOnly());
	var viewDuplicadas:NotesView = getDbPropuestas().getView ("vLK_ControlDuplicidad");
	var dc:DocumentCollection = viewDuplicadas.getAllDocumentsByKey(vecColumns);
	return dc;
}

function getFechaEmisionWebService():NotesDateTime{
	
	var strUrlCompleta:String = evaluateFormula(getFieldValueFromConfig("wsgetfec", "odbc_select_des"), null).elementAt(0).toString();
	var parsedxml:org.w3c.dom.Document = null;
	var domfactory:javax.xml.parsers.DocumentBuilderFactory=javax.xml.parsers.DocumentBuilderFactory.newInstance(); 
	var xmldocument:javax.xml.parsers.DocumentBuilder= domfactory.newDocumentBuilder();
	var url:java.net.URL = new java.net.URL(strUrlCompleta + "/" + @Unique()); //Le agrego el @Unique para evitar cacheo.
	var conn:java.net.URLConnection = url.openConnection();
		
	var uConn:java.net.HttpURLConnection = conn;
	var is:org.xml.sax.InputSource = new org.xml.sax.InputSource(uConn.getInputStream());
	is.setEncoding("ISO-8859-1");	
	var parsedxml= xmldocument.parse(is);
	if (getFieldValueFromConfig("wsgetfec", "odbc_MsgConsole_des") == "1"){
		print("wsgetfec=" + strUrlCompleta);		
	}else if	(getFieldValueFromConfig("wsgetfec", "odbc_MsgConsole_des") == "2"){
		AgentLogAutos("wsgetfec",0,strUrlCompleta)
	}
		
	//Obtenemos el nÃºmero de super poliza 
	dtNodo = parsedxml.getElementsByTagName("FechaEmision"); 
	nnode= dtNodo.item(0); 
	var strFechaEmision:String = nnode.getFirstChild().getNodeValue();
	var dtHoy:NotesDateTime = StringToNotesDateTime(strFechaEmision ,"yyyyMMdd", "dd/MM/yyyy");
	return dtHoy;
}

function getVigenciasWebservice(docProp_prm:NotesDocument):java.util.map {
	var strUrlCompleta:String = evaluateFormula(getFieldValueFromConfig("wsPolizas", "odbc_select_des"), docProp_prm).elementAt(0).toString();
	var mapResult:java.util.HashMap = new java.util.HashMap ()
	var parsedxml:org.w3c.dom.Document = null;
	var domfactory:javax.xml.parsers.DocumentBuilderFactory=javax.xml.parsers.DocumentBuilderFactory.newInstance(); 
	var xmldocument:javax.xml.parsers.DocumentBuilder= domfactory.newDocumentBuilder();
	var url:java.net.URL = new java.net.URL(strUrlCompleta + "/" + @Unique()); //Le agrego el @Unique para evitar cacheo.
	var conn:java.net.URLConnection = url.openConnection();
		
	var uConn:java.net.HttpURLConnection = conn;
	try{
		var is:org.xml.sax.InputSource = new org.xml.sax.InputSource(uConn.getInputStream());	
	} catch (e){
        print("Error en WebService:" + strUrlCompleta);
    }
	is.setEncoding("ISO-8859-1");	
	var parsedxml= xmldocument.parse(is);
	if (getFieldValueFromConfig("wsPolizas", "odbc_MsgConsole_des") == "1"){
		print("wsPolizas=" + strUrlCompleta);		
	}else if	(getFieldValueFromConfig("wsPolizas", "odbc_MsgConsole_des") == "2"){
		AgentLogAutos("wsPolizas",0,strUrlCompleta)
	}
	
	var strErrMsg:String = isWsWithErrors(parsedxml); 
	if(!strErrMsg.equals ("")){
		mapResult.put("ErrMsg", strErrMsg)
		return mapResult;	
	}
		
	//Obtenemos el nÃºmero de super poliza 
	dtNodo = parsedxml.getElementsByTagName("SPOL"); 
	nnode= dtNodo.item(0); 
	var strNroSupPol:String = nnode.getFirstChild().getNodeValue();
	mapResult.put("SPOL", new java.lang.Integer(strNroSupPol))
	//Loopeamos el nodo <Suplemento>
	var nodosSuplemento:DOMNodeList;
	var nodoSuplemento:DOMNode;
	var nodosDeSuplemento:DOMNodeList;
	var nodoHijoDeSuplemento:DOMNode;
	var intNodoSuplementoIndex:int=-1;
	var strSUOP:String;
	var strTIOU:String;
	var strSTOU:String;
	var sRefaFHFA:String;
	
	var bflagSuplementoCero:boolean = false;
	
	nodosSuplemento = parsedxml.getElementsByTagName("Suplemento");
	for (var i=0; i<nodosSuplemento.getLength(); i++) { //Recorro los nodos <Suplemento>
		intNodoSuplementoIndex = i;
		nodoSuplemento = nodosSuplemento.item(i);
		nodosDeSuplemento = nodoSuplemento.getChildNodes(); //Tomo los hijos del nodo <Suplemento> y los recorro
		for (var j=0; j<nodosDeSuplemento.getLength(); j++) {
			nodoHijoDeSuplemento = nodosDeSuplemento.item(j);
			
			if (nodoHijoDeSuplemento.getNodeName().equals ("SUOP")) {
				strSUOP = nodoHijoDeSuplemento.getFirstChild().getNodeValue();				
				bflagSuplementoCero = (strSUOP.equals("000")) ? true : false;
			}
			if (nodoHijoDeSuplemento.getNodeName().equals ("FINI")) {				
				if(bflagSuplementoCero){
					mapResult.put("s0FINI", nodoHijoDeSuplemento.getFirstChild().getNodeValue()); 					
				}else{
					mapResult.put("suFINI", nodoHijoDeSuplemento.getFirstChild().getNodeValue());
				}
			}			
			if (nodoHijoDeSuplemento.getNodeName().equals ("FVTO")) {		
				if(bflagSuplementoCero){
					mapResult.put("s0FVTO", nodoHijoDeSuplemento.getFirstChild().getNodeValue()); 			
				}					 			
			}
			if (nodoHijoDeSuplemento.getNodeName().equals ("FHFA")) {
				if(bflagSuplementoCero){
					mapResult.put("s0FHFA", nodoHijoDeSuplemento.getFirstChild().getNodeValue()); 			
				}else{
					sRefaFHFA = nodoHijoDeSuplemento.getFirstChild().getNodeValue();
				}
			}			
			if (nodoHijoDeSuplemento.getNodeName().equals ("TIOU")) {
				strTIOU = nodoHijoDeSuplemento.getFirstChild().getNodeValue(); 								 			
			}
			if (nodoHijoDeSuplemento.getNodeName().equals ("STOU")) {
				strSTOU = nodoHijoDeSuplemento.getFirstChild().getNodeValue();
			}
		}
		if(strTIOU == "3" && strSTOU == "11"){ //Tengo Refacturacion
			mapResult.put("sRefaFHFA", sRefaFHFA);				
		}
	}
	//print("s0FINI:" + mapResult.get("s0FINI"))
	//print("s0FVTO:" + mapResult.get("s0FVTO"))
	//print("s0FHFA:" + mapResult.get("s0FHFA"))
	//print("sRefaFHFA:" + mapResult.get("sRefaFHFA"))
	//print("suFINI:" + mapResult.get("suFINI"))
	return mapResult;	
}


function nuevaPropuestaFromDoc(docPropuestaHija:NotesDocument, sol_status_cod:String, 
		sol_tipoMovimiento_cod:String, sol_tipoOperacion_cod:String, idMailAsociado:String){
	/* ERR001= No se ha encontrado la poliza
	 * ERR002= No existen periodos a refacturar
	 * */
	var sol_status_des:String = getStatusLabel(sol_status_cod); // Obtengo descripcion del estado	
	var autor_acl:java.util.Vector = getNextStatusAuthorField(sol_status_cod); //Obtengo el campo autor
	var tarifa:String = "0";
	var booUpdateVehiculo:boolean = false;

	var vigencias:java.util.Map = getVigenciasWebservice(docPropuestaHija);
	if (vigencias.containsKey("ErrMsg")){
		return "ERR001";
	}
	
	docPropuestaHija.replaceItemValue("sol_superpoliza_nro", vigencias.get("SPOL"));
	
	//El desde de cabecera es siempre el mismo
	var dtVigDesdeCabPropuestaNueva:NotesDateTime = StringToNotesDateTime(vigencias.get("s0FINI"), "yyyyMMdd", "dd/MM/yyyy hh:mm"); 
	//Seteo de fechas segun movimiento
	switch(sol_tipoMovimiento_cod) {
		case "2": //RENOVACION tomar hasta op anterior y cargo en desde actual. Calculo hasta actual por articulo
			dtVigDesdeCabPropuestaNueva = StringToNotesDateTime(vigencias.get("s0FVTO"), "yyyyMMdd", "dd/MM/yyyy hh:mm");
			var TempdtVigDesdeCabPropuestaNueva:NotesDateTime = StringToNotesDateTime(vigencias.get("s0FVTO"), "yyyyMMdd", "dd/MM/yyyy hh:mm");
			var dtVigHastaCabPropuestaNueva:NotesDateTime = getVigenciaHastaParam(TempdtVigDesdeCabPropuestaNueva, docPropuestaHija.getItemValueString("sol_articulo_cod"), docPropuestaHija.getItemValueString("sol_rama_cod"));
			var dtVigDesdeOpePropuestaNueva:NotesDateTime = dtVigDesdeCabPropuestaNueva;
			var dtVigHastaOpePropuestaNueva:NotesDateTime = dtVigHastaCabPropuestaNueva;
			tarifa = getTarifasWs()[0];//Funcion de tarifa
			booUpdateVehiculo = true;
			break;
		case "3": //ENDOSO
			if(sol_tipoOperacion_cod == "11"){ //Endoso refacturacion
				var dtVigHastaCabPropuestaNueva:NotesDateTime = StringToNotesDateTime(vigencias.get("s0FVTO"), "yyyyMMdd", "dd/MM/yyyy hh:mm");				
				var dtVigDesdeOpePropuestaNueva:NotesDateTime = StringToNotesDateTime(vigencias.get("s0FHFA"), "yyyyMMdd", "dd/MM/yyyy hh:mm");
				if(dtVigHastaCabPropuestaNueva.timeDifference(dtVigDesdeOpePropuestaNueva) == 0){return "ERR002"};
				tarifa = getTarifasWs()[0];//Funcion de tarifa
				booUpdateVehiculo = true;
			}else{//Resto de endosos
				if(vigencias.containsKey("sRefaFHFA")){// Si esta blanco no tuvo refa
					var dtVigHastaCabPropuestaNueva:NotesDateTime = StringToNotesDateTime(vigencias.get("sRefaFHFA"), "yyyyMMdd", "dd/MM/yyyy hh:mm");
				}else{
					var dtVigHastaCabPropuestaNueva:NotesDateTime = StringToNotesDateTime(vigencias.get("s0FHFA"), "yyyyMMdd", "dd/MM/yyyy hh:mm");
				}
				var dtVigDesdeOpePropuestaNueva:NotesDateTime = session.createDateTime("Today"); 
			}
			var dtVigHastaOpePropuestaNueva:NotesDateTime = dtVigHastaCabPropuestaNueva;
			break;
		case "4": //ANULACION
		case "5": //REHABILITACION
			if(vigencias.containsKey("sRefaFHFA")){// Si esta blanco no tuvo refa
				var dtVigHastaCabPropuestaNueva:NotesDateTime = StringToNotesDateTime(vigencias.get("sRefaFHFA"), "yyyyMMdd", "dd/MM/yyyy hh:mm");
			}else{
				var dtVigHastaCabPropuestaNueva:NotesDateTime = StringToNotesDateTime(vigencias.get("s0FHFA"), "yyyyMMdd", "dd/MM/yyyy hh:mm");
			}
			
			var dtVigDesdeOpePropuestaNueva:NotesDateTime = session.createDateTime("Today");
			var dtVigHastaOpePropuestaNueva:NotesDateTime = dtVigHastaCabPropuestaNueva;
			break;			
		case "1": //NUEVA --> Se agrega esto para Anulaciones por reemplazo
			var dtVigDesdeCabPropuestaNueva:NotesDateTime = docPropuestaHija.getItemValueDateTimeArray("sol_vigenciaDesdeOperacion_nro").elementAt(0);
			var TempdtVigDesdeCabPropuestaNueva:NotesDateTime = docPropuestaHija.getItemValueDateTimeArray("sol_vigenciaDesdeOperacion_nro").elementAt(0);
			var dtVigHastaCabPropuestaNueva:NotesDateTime = getVigenciaHastaParam(TempdtVigDesdeCabPropuestaNueva, docPropuestaHija.getItemValueString("sol_articulo_cod"), docPropuestaHija.getItemValueString("sol_rama_cod"));
			var dtVigDesdeOpePropuestaNueva:NotesDateTime = dtVigDesdeCabPropuestaNueva;
			var dtVigHastaOpePropuestaNueva:NotesDateTime = dtVigHastaCabPropuestaNueva;
			break;
		default: // PRESENTA ERROR DE APLICACION 
			throw new java.lang.Error("NO SE HA PODIDO CONTINUAR CON LA OPERACION. (ERROR PROP001)");
			break;
	}
	importPackage(ar.com.hdi.autos.propuestas);
	var jNewProp:NuevaPropuesta = new NuevaPropuesta();
	var newUnid:String = jNewProp.setMyPropuesta(docPropuestaHija, dtVigDesdeCabPropuestaNueva,
			dtVigHastaCabPropuestaNueva, dtVigDesdeOpePropuestaNueva,
			dtVigHastaOpePropuestaNueva, sol_status_cod, sol_status_des, sol_tipoMovimiento_cod,
			sol_tipoOperacion_cod, autor_acl, tarifa);
	
	var booGTI982:boolean = insGTI982(newUnid);
	// Actualizo franquicia y suma asegurada de vehiculo si es Refa o Reno
	if(booUpdateVehiculo){setUpdateVehiculoEnRefacturacionyRenovacion(newUnid)};

	//Renumero componentes si es reno, por si alguno da INACTIVO el webservice
	if(sol_tipoMovimiento_cod == "2"){renumerarVehiculosDePropuesta(newUnid)};
	
	if (idMailAsociado != ""){
		var dbMails:NotesDatabase = getDbMails ();
		var docMail:NotesDocument = dbMails.getDocumentByUNID(idMailAsociado);
		linkMailWithDoc (docMail, newUnid ,session.evaluate("@Unique"), true, false, true);
	}
	linkPropWithProp(docPropuestaHija, newUnid);
	if(!actualizarCadenaComercial(newUnid)) 
		print("No se actualizó la cadena comercial del documento: " + newUnid);	
	
	var result:String = "xfdocPropuesta.xsp?documentId=" + newUnid + "&action=openDocument";
	return result;
}


function nuevosComponentesAsociadosXML(docPropuestaNueva:NotesDocument){
	/* Si quiero importar solo componente utilizar esto.
	 * La misma funcion fue integrada en nuevaPropuestaFromDoc */ 
	importPackage(ar.com.hdi.autos.webservice);
	var jimportCompo:WsVehPol = new WsVehPol();
	jimportCompo.comenzar("wsComponentesEnPoliza", docPropuestaNueva);
}

function isEmisionAllowed (docxProp_prm:NotesXspDocument):boolean {
	//Si el usuario no pertenece al grupo de emision por estado, FALSE
	//Si la propuesta estÃ¡ en modo ediciÃ³n, FALSE print("Esta en edicion=" + docxProp_prm.isEditable());
	//Si el estado no es para emisiÃ³n, FALSE print("Tilde Emision=" + isEstadoParaEmision(docxProp_prm));
	//Si no tiene vehiculos, FALSE print("Tiene Vehiculos=" + tieneVehiculos(docxProp_prm));
	//Si requiere autorizaciÃ³n y todavÃ­a no la tiene, FALSE print("Requiere autorizacion=" + requiereAutoriz(docxProp_prm));
	if (!isStatusOperacionesPermitidas(docxProp_prm.getItemValueString("sol_status_cod"), docxProp_prm.getItemValueString("sol_tipoMovimiento_cod"))) return false;
	if (!isStatusFieldAccessGroup(docxProp_prm.getItemValueString("sol_status_cod"), "est_PermiteEmisionGrupo_des")) return false;	
	if (docxProp_prm.isEditable()) return false;
	if (isEstadoParaEmision(docxProp_prm) == false) return false;
	if (tieneVehiculos(docxProp_prm) == false) return false;
	if (requiereAutoriz(docxProp_prm) == true) return false;
	if (docxProp_prm.getItemValueString("sol_asegurado_cod").equals("0") || docxProp_prm.getItemValueString("sol_asegurado_cod").equals("")) return false;
	return true;
}

function isEstadoParaEmision (docxProp_prm:NotesXspDocument):boolean {
	//Si el estado permite emisiÃ³n --> TRUE
	var booStatusOK:boolean = isStatusCheckFlag(getComponent("sol_status_cod").getValue(), "est_PermiteEmision_opt")
	if (booStatusOK == false) return false;
	return true;
}

function isMovimientoConVehiculos(unidPropuesta:String){
	var docTemp:NotesDocument = getDbPropuestas().getDocumentByUNID(unidPropuesta);
	var tipoMovimiento_cod:String = docTemp.getItemValueString("sol_tipoMovimiento_cod");
	var tipoOperacion_cod:String = docTemp.getItemValueString("sol_tipoOperacion_cod");
	if(!docTemp == null){
		docTemp.recycle();
	}
	switch(tipoMovimiento_cod) {
		case "1": //NUEVA
		case "2": //RENOVACION
			return true;
			break;
		case "3": //ENDOSO
			if((tipoOperacion_cod == "1" || tipoOperacion_cod == "2" || tipoOperacion_cod == "3" ||
					tipoOperacion_cod == "5" || tipoOperacion_cod == "6" || tipoOperacion_cod == "7" || 
					tipoOperacion_cod == "10" || tipoOperacion_cod == "11")) {
				// TODO: FALTA TESTAR REFACTURACION
				return true;
				break;
			}else{
				return false;
				break;
			}
		case "4": //ANULACION
		case "5": //REHABILITACION
			return false;
			break;
	}
}

function requiereAutoriz (docxProp_prm:NotesXspDocument):boolean {
	var strAutorizado:String = docxProp_prm.getItemValueString ("sol_Autoriz_flag");
	//Si requiere autorizaciÃ³n y no estÃ¡ autorizado --> TRUE
	if (viewScope.get("booReqAutoriz") && strAutorizado.equals ("1") == false) return true;
	return false;
}

function linkPropWithProp(docPropuestaHija:NotesDocument, newUnid:String){
	/* 20140708 - FPR Campo Autor - Para correr desde un agente
	var tempDoc:NotesDocument = database.createDocument();
	tempDoc.replaceItemValue("idHijo",docPropuestaHija.getUniversalId());
	tempDoc.replaceItemValue("newUnid",newUnid);
	session.getCurrentDatabase().getAgent("a.linkPropWithProp").runWithDocumentContext(tempDoc);
	 */
	
	docPropuestaHija.replaceItemValue("idPadre_cod",newUnid.toString());
	docPropuestaHija.save();
	docPropuestaHija.recycle()
}

function unLinkPropWithProp(unidPropPadre:String){
	var collPropHija:DocumentCollection = getCollectionByKey(getDbPropuestas(), "vLK_PropuestasPorIdPadre_cod", unidPropPadre);
	if(collPropHija.getCount() > 0){
		var docPropuestaHija:NotesDocument = collPropHija.getFirstDocument();
		while (docPropuestaHija != null) {
			docPropuestaHija.replaceItemValue("idPadre_cod","");
			docPropuestaHija.save();
			var tmpdoc = collPropHija.getNextDocument();
			docPropuestaHija.recycle();
			docPropuestaHija = tmpdoc;
		}
	}
	if (collPropHija != null) {
		collPropHija.recycle();
	}	
	if (docPropuestaHija != null) {
		docPropuestaHija.recycle();
	}	
}

function actualizarCadenaComercial(newUnid:String):boolean{
	var docTemp:NotesDocument = getDbPropuestas().getDocumentByUNID(newUnid);
	if (docTemp == null) return false;
	var mapResult:java.util.HashMap = new java.util.HashMap ()
	var strUrlCompleta:String = evaluateFormula(getFieldValueFromConfig("wsPolizas", "odbc_select_des"), docTemp).elementAt(0).toString();
	
	var parsedxml:org.w3c.dom.Document = null;
	var domfactory:javax.xml.parsers.DocumentBuilderFactory=javax.xml.parsers.DocumentBuilderFactory.newInstance(); 
	var xmldocument:javax.xml.parsers.DocumentBuilder= domfactory.newDocumentBuilder();	
	var url:java.net.URL = new java.net.URL(strUrlCompleta + "/" + @Unique()); //Le agrego el @Unique para evitar cacheo.	
	var conn:java.net.URLConnection = url.openConnection();
	var uConn:java.net.HttpURLConnection = conn;	
	var is:org.xml.sax.InputSource = new org.xml.sax.InputSource(uConn.getInputStream());	 
	is.setEncoding("ISO-8859-1");	
	var parsedxml= xmldocument.parse(is);
	if (getFieldValueFromConfig("wsPolizas", "odbc_MsgConsole_des") == "1"){
		print("wsPolizas=" + strUrlCompleta);		
	}else if	(getFieldValueFromConfig("wsPolizas", "odbc_MsgConsole_des") == "2"){
		AgentLogAutos("wsPolizas",0,strUrlCompleta)
	}
	
	var strErrMsg:String = isWsWithErrors(parsedxml); 
	if(!strErrMsg.equals ("")){
		return false;	
	}
		
	//Obtenemos el nÃºmero de super poliza 
	dtNodo = parsedxml.getElementsByTagName("SPOL"); 
	nnode= dtNodo.item(0); 
	var strNroSupPol:String = nnode.getFirstChild().getNodeValue();
	//Loopeamos el nodo <Suplemento>
	var nodosSuplemento:DOMNodeList;
	var nodoSuplemento:DOMNode;
	var nodosDeSuplemento:DOMNodeList;
	var nodoHijoDeSuplemento:DOMNode;
	var intNodoSuplementoIndex:int=-1;
	var strNombre:String;
	var intCodigo:int;
	
	nodosSuplemento = parsedxml.getElementsByTagName("Suplemento");
	for (var i=0; i<nodosSuplemento.getLength(); i++) { //Recorro los nodos <Suplemento>
		intNodoSuplementoIndex = i;
		nodoSuplemento = nodosSuplemento.item(i);
		nodosDeSuplemento = nodoSuplemento.getChildNodes(); //Tomo los hijos del nodo <Suplemento> y los recorro
		for (var j=0; j<nodosDeSuplemento.getLength(); j++) {
			nodoHijoDeSuplemento = nodosDeSuplemento.item(j);
			
			if (nodoHijoDeSuplemento.getNodeName().equals ("NIV3")) {
				intCodigo = Number(nodoHijoDeSuplemento.getFirstChild().getNodeValue());
				mapResult.put("sol_productorN3_cod", intCodigo.equals(0) ? "" : intCodigo.toString());	
			}
			if (nodoHijoDeSuplemento.getNodeName().equals ("NPR3")) {
				strNombre = nodoHijoDeSuplemento.getFirstChild().getNodeValue();
				mapResult.put("sol_productorN3_des", strNombre.contains("*****") ? "" : strNombre);	
			}
			
			if (nodoHijoDeSuplemento.getNodeName().equals ("NIV5")) {
				intCodigo = Number(nodoHijoDeSuplemento.getFirstChild().getNodeValue());
				mapResult.put("sol_productorN5_cod", intCodigo.equals(0) ? "" : intCodigo.toString());	
			}
			if (nodoHijoDeSuplemento.getNodeName().equals ("NPR5")) {
				strNombre = nodoHijoDeSuplemento.getFirstChild().getNodeValue();
				mapResult.put("sol_productorN5_des", strNombre.contains("*****") ? "" : strNombre);	
			}			
			
			if (nodoHijoDeSuplemento.getNodeName().equals ("NIV6")) {
				intCodigo = Number(nodoHijoDeSuplemento.getFirstChild().getNodeValue());
				mapResult.put("sol_productorN6_cod", intCodigo.equals(0) ? "" : intCodigo.toString());	
			}
			if (nodoHijoDeSuplemento.getNodeName().equals ("NPR6")) {
				strNombre = nodoHijoDeSuplemento.getFirstChild().getNodeValue();
				mapResult.put("sol_productorN6_des", strNombre.contains("*****") ? "" : strNombre);	
			}			
			
		}
	}
	
	docTemp.replaceItemValue("sol_productorN3_cod", mapResult.get("sol_productorN3_cod"));
	docTemp.replaceItemValue("sol_productorN3_des", mapResult.get("sol_productorN3_des"));
	docTemp.replaceItemValue("sol_productorN5_cod", mapResult.get("sol_productorN5_cod"));
	docTemp.replaceItemValue("sol_productorN5_des", mapResult.get("sol_productorN5_des"));
	docTemp.replaceItemValue("sol_productorN6_cod", mapResult.get("sol_productorN6_cod"));
	docTemp.replaceItemValue("sol_productorN6_des", mapResult.get("sol_productorN6_des"));
	docTemp.save();
	if(docTemp != null) docTemp.recycle();
	return true;
}

function isPropuestaEmitidaEnAs400():boolean{
	// Si estÃ¡ emitida devuelve los datos para actualizar la propuesta
	var docxProp:NotesXspDocument = viewScope.get("docxProp");
	var docProp:NotesDocument = docxProp.getDocument();
	importPackage(ar.com.hdi.autos.connect);
	var jce:GetArrayFromQueryAS400 = new GetArrayFromQueryAS400();
	var rtdoQuery:java.util.ArrayList = jce.getSelectAS("prop_GTI980", docProp);
		
	if (rtdoQuery.size() == 0) {
		return false;
	}
	
	for (i=0;i<rtdoQuery.size();i++) {
		var arrValor = rtdoQuery.get(i).split("~");
		docProp.replaceItemValue("sol_poliza_nro", Number(arrValor[0]));
		docProp.replaceItemValue("sol_superpoliza_nro", Number(arrValor[1]));
		docProp.replaceItemValue("sol_superpolizaSuplemento_nro", Number(arrValor[2]));
		docProp.replaceItemValue("sol_superpolizaSuplemento_des", @Right("000" + arrValor[2], 3));
		var strFemi:String = @Right("00" + arrValor[3], 2) + @Right("00" + arrValor[4], 2) + arrValor[5]; 
		var dtFemi:NotesDateTime = StringToNotesDateTime(strFemi ,"ddMMyyyy", "dd/MM/yyyy");
		docProp.replaceItemValue("fechaEmisionGaus_nro", dtFemi);
		docProp.replaceItemValue("fechaEmisionReal_nro", dtFemi);	
		docProp.replaceItemValue("sol_status_cod", "90");
		docProp.replaceItemValue("sol_status_des", "Emitida");
		docProp.save();
		var sol_cotizacion_nro:String = docProp.getItemValueInteger("sol_cotizacion_nro");
		if(sol_cotizacion_nro != "" && sol_cotizacion_nro != "0"){
			
			importPackage(ar.com.hdi.autos.connect);
			var jce:GetArrayFromQueryAS400 = new GetArrayFromQueryAS400();
			jce.setInsertAS("solUPD_GTI980_marcaWeb", docProp);
		}		
		return true;
	}
	
}

function isPropuestaEstuvoSuspendida(vecEstadosPrevios:java.util.Vector){
	//Devuelve true si estuvo suspendida
	return vecEstadosPrevios.contains("87");
}

function visibleBtnAltaComponente(){
	// Oculto si cumple alguna de estas condiciones, sino sale por ultima linea=true
	tipoMovimiento = getComponent("sol_tipoMovimiento_cod").getValue();
	tipoOperacion = getComponent("sol_tipoOperacion_cod").getValue();	
	if(tipoMovimiento == "4"){return false};//Es anulacion
	if(tipoMovimiento == "5"){return false};//Es rehabilitacion
	if(tipoMovimiento == "3" && !(tipoOperacion == "11" || tipoOperacion == "5")) {return false};//Endoso != refa y alta
	if(!documentPropuesta.isEditable()){return false}; //No esta en edicion
	return true;
}

function visibleBtnEditarComponente(){
	// Oculto si cumple alguna de estas condiciones, sino sale por ultima linea=true
	if(viewScope.VehSelectedUNID == null){return false};
	if(viewScope.VehSelectedUNID == ""){return false};
	if(!isStatusCheckFlag(getComponent("sol_status_cod").getValue(), "est_PermiteEdicion_opt")){return false};
	if(!documentPropuesta.isEditable()){return false}; //No esta en edicion
	tipoMovimiento = getComponent("sol_tipoMovimiento_cod").getValue();
	if(tipoMovimiento == "4" || tipoMovimiento == "5"){return false};//No estÃ¡ en Anulaciones y Rehabilitaciones
	tipoOperacion = getComponent("sol_tipoOperacion_cod").getValue();
	if(tipoMovimiento == "3" && tipoOperacion != "11" ){return false};//Veo solo en endoso de Refa
	if(documentComponente.getItemValueString("veh_statusGaus_des").equals("INACTIVO")){return false}; //Oculto Vehiculos dados de baja	
	if(tipoMovimiento == "3" && tipoOperacion == "11" ){return true};	//Endoso de Refa se puede Modificar	
	if(!documentComponente.getItemValueString("veh_spwvehABM_cod").equals("A")){return false}; // Veo Solo las altas	
	
	return true
}

function visibleBtnEditarComponenteEndoso(){
	// Oculto si cumple alguna de estas condiciones, sino sale por ultima linea=true
	if(viewScope.VehSelectedUNID == null){return false};
	if(viewScope.VehSelectedUNID == ""){return false};
	if(!isStatusCheckFlag(getComponent("sol_status_cod").getValue(), "est_PermiteEdicion_opt")){return false};
	if(!documentPropuesta.isEditable()){return false}; //No esta en edicion
	if(documentComponente.getItemValueString("veh_statusGaus_des").equals("INACTIVO")){return false}; //Vehiculos dados de baja
	tipoMovimiento = getComponent("sol_tipoMovimiento_cod").getValue();
	tipoOperacion = getComponent("sol_tipoOperacion_cod").getValue();	
	if(tipoMovimiento != "3"){return false};//Oculto si no es Endoso
	if(!(tipoOperacion == "1" || tipoOperacion == "2" || tipoOperacion == "3" || tipoOperacion == "7" || tipoOperacion == "10")) {return false};//Endoso != refa y alta
	return true
}

function visibleBtnEliminarComponente(){
	// Oculto si cumple alguna de estas condiciones, sino sale por ultima linea=true
	if(!documentPropuesta.isEditable()){return false}; //No esta en edicion
	if(!documentComponente.getItemValueString("veh_spwvehABM_cod").equals("A")){return false}; //Solo las altas
	if(isPropuestaEstuvoSuspendida(documentPropuesta.getItemValue("sol_statusHistorico_des"))){return false}; //Si paso por suspendida
	if(!documentComponente.getItemValueString("veh_statusGaus_des").equals("")){//Vehiculos tomados de Gaus
		if(!documentComponente.getItemValueString("sol_tipoMovimiento_cod").equals("2")){//Si es una renovacion que pueda eliminar
			return false;
		}
	}; 
	return true;
}

function visibleBtnBajaComponente(){
	// Oculto si cumple alguna de estas condiciones, sino sale por ultima linea=true
	tipoMovimiento:String = getComponent("sol_tipoMovimiento_cod").getValue();
	tipoOperacion:String = getComponent("sol_tipoOperacion_cod").getValue();
	if(tipoMovimiento != "3") {return false};//Oculto si no es endoso
	if(tipoMovimiento == "3" && tipoOperacion != "6") {return false};//Solo Endoso Baja Componente 
	if(!documentPropuesta.isEditable()){return false}; //No esta en edicion
	if(!(documentComponente.getItemValueString("veh_spwvehABM_cod").equals("") ||documentComponente.getItemValueString("veh_spwvehABM_cod").equals("B") )){return false}; //Solo sin marca
	if(documentComponente.getItemValueString("veh_statusGaus_des").equals("INACTIVO")){return false}; //Vehiculos dados de baja
	return true;
}

function visibleBtnsAccesorios(){
	// Oculto si cumple alguna de estas condiciones, sino sale por ultima linea=true
	if(viewScope.VehSelectedUNID == null){return false};
	if(viewScope.VehSelectedUNID == ""){return false};
	if(!isStatusCheckFlag(getComponent("sol_status_cod").getValue(), "est_PermiteEdicion_opt")){return false};
	if(!documentPropuesta.isEditable()){return false}; //No esta en edicion
	if(!documentComponente.getItemValueString("veh_spwvehABM_cod").equals("A")){return false}; //Solo las altas
	
	if(documentComponente.getItemValueString("veh_spwvehABM_cod").equals("M") && (viewScope.newVeh_Dialog.SumaMinima == null)){return false}; //Solo las modificaciones de aumento de suma???
	
	if(isPropuestaEstuvoSuspendida(documentPropuesta.getItemValue("sol_statusHistorico_des"))){return false}; //Si paso por suspendida
	if(documentComponente.getItemValueString("veh_statusGaus_des").equals("INACTIVO")){return false}; //Vehiculos dados de baja
	return true
}
function visibleBtnsRastreador(){
	// Oculto si cumple alguna de estas condiciones, sino sale por ultima linea=true
	if(viewScope.VehSelectedUNID == null){return false};
	if(viewScope.VehSelectedUNID == ""){return false};
	if(!isStatusCheckFlag(getComponent("sol_status_cod").getValue(), "est_PermiteEdicion_opt")){return false};
	if(!documentPropuesta.isEditable()){return false}; //No esta en edicion
	if(!documentComponente.getItemValueString("veh_spwvehABM_cod").equals("A")){return false}; //Solo las altas
	if(isPropuestaEstuvoSuspendida(documentPropuesta.getItemValue("sol_statusHistorico_des"))){return false}; //Si paso por suspendida
	if(documentComponente.getItemValueString("veh_statusGaus_des").equals("INACTIVO")){return false}; //Vehiculos dados de baja
	return true
}
function visibleBtnsInspecciones(){
	// FPR 20140702 - Tecnicamente HDI puede solicitar una inpeccion en cualquier momento de la vida de una poliza (Carolina Albornoz)
	// Oculto si cumple alguna de estas condiciones, sino sale por ultima linea=true --> Se muestra siempre por explicacion linea anterior
	if(viewScope.VehSelectedUNID == null){return false};
	if(viewScope.VehSelectedUNID == ""){return false};
	//if(!isStatusCheckFlag(getComponent("sol_status_cod").getValue(), "est_PermiteEdicion_opt")){return false};
	//if(!documentPropuesta.isEditable()){return false}; //No esta en edicion
	//if(!documentComponente.getItemValueString("veh_spwvehABM_cod").equals("A")){return false}; //Solo las altas
	//if(isPropuestaEstuvoSuspendida(documentPropuesta.getItemValue("sol_statusHistorico_des"))){return false}; //Si paso por suspendida
	return true
}
function visibleBtnsRastreador(){
	if(viewScope.VehSelectedUNID == null){return false};
	if(viewScope.VehSelectedUNID == ""){return false};
}
function setConfirmationMessage(message) {
	viewScope.confirmMessage = message;
}

function setInformationMessage(message) {
	viewScope.infoMessage = message;
}

function geArrayFromVehiculosDeUnaPropuesta(strNombreDelCampo_prm:String, strUnidPropuesta_prm:String):java.util.Vector{
	//Recibo unid de propuesta recorro los vehiculos asociados a este unid
	//Los valores de los campos deben ser Strings
	var arr:java.util.Vector = new java.util.Vector();
	var collVeh:DocumentCollection = getCollectionByKey(getDbPropuestas(), "v.Sys.GausVehAsocPropuestas", strUnidPropuesta_prm);
	if(collVeh.getCount() > 0){
		var docVeh:NotesDocument = collVeh.getFirstDocument();
		while (docVeh != null) {
			if(docVeh.hasItem(strNombreDelCampo_prm)){
				arr.add(docVeh.getItemValueString(strNombreDelCampo_prm));
			}
			var tmpdoc = collVeh.getNextDocument();
			docVeh.recycle();
			docVeh = tmpdoc;
		}		
	}
	return arr;
}

function setUpdateVehiculoEnRefacturacionyRenovacion(strUnidPropuesta_prm:String){
	var collVeh:DocumentCollection = getCollectionByKey(getDbPropuestas(), "v.Sys.GausVehAsocPropuestas", strUnidPropuesta_prm);
	if(collVeh.getCount() > 0){
		importPackage(ar.com.hdi.autos.connect);
		var docVeh:NotesDocument = collVeh.getFirstDocument();
		while (docVeh != null) {
			/* **** No actualizo mas Suma Asegurada.***** 
			 * Con el pedido 3706 se toma directo del tag <VHVA>
			
			var jveh:GetArrayFromQueryAS400 = new GetArrayFromQueryAS400();
			var strResult:Array = jveh.getSelectAS("vehTB_SET20497_CompletoVehiculo", docVeh);
			if(strResult.toString() != "[]"){
				docVeh.replaceItemValue("veh_sumaAsegurada_nro", parseFloat(strResult[0].split("~")[0]));
				docVeh.replaceItemValue("veh_sumaAseguradaTablas_nro", parseFloat(strResult[0].split("~")[0]));
			}else{
				docVeh.replaceItemValue("veh_status_cod", "20");				
			}
			*/
			var fqcia:String = getFranquiciaWs(wrapDocument(docVeh));
			if(!fqcia.equals("")){
				docVeh.replaceItemValue("veh_franquiciaValor_nro", parseFloat(fqcia));
			}	
			docVeh.save();
			var tmpdoc = collVeh.getNextDocument();
			docVeh.recycle();
			docVeh = tmpdoc;
		}		
	}	
}

function renumerarVehiculosDePropuesta(strUnidPropuesta_prm:String){
	var nroComponente:Integer = 1;
	var collVeh:DocumentCollection = getCollectionByKey(getDbPropuestas(), "v.Sys.GausVehAsocPropuestas", strUnidPropuesta_prm);
	if(collVeh.getCount() > 0){
		var docVeh:NotesDocument = collVeh.getFirstDocument();
		while (docVeh != null) {			
			if(docVeh.getItemValueInteger("veh_componente_nro") != nroComponente){
				docVeh.replaceItemValue("veh_componente_nro", nroComponente);
				docVeh.save();
			}			
			nroComponente++;
			var tmpdoc = collVeh.getNextDocument();
			docVeh.recycle();
			docVeh = tmpdoc;
		}		
	}
}

function wsanuxfp(strCodigoAsegurado:String):String{
	if(isWsActive("wsanuxfp")){
		//La funcion devuelve el valor de have como String. Si tiene Error devuelve "E"
		var strUrlCompleta:String = getFieldValueFromConfig("wsanuxfp", "odbc_select_des") + strCodigoAsegurado;
		//http://softdesa:8050/wsrest/wsanuxfp/A/CA/
	
		var parsedxml:org.w3c.dom.Document = null;
		var domfactory:javax.xml.parsers.DocumentBuilderFactory=javax.xml.parsers.DocumentBuilderFactory.newInstance(); 
		var xmldocument:javax.xml.parsers.DocumentBuilder= domfactory.newDocumentBuilder();
		var url:java.net.URL = new java.net.URL(strUrlCompleta + "/" + @Unique()); //Le agrego el @Unique para evitar cacheo.
		var conn:java.net.URLConnection = url.openConnection();
		
		var uConn:java.net.HttpURLConnection = conn;
		var is:org.xml.sax.InputSource = new org.xml.sax.InputSource(uConn.getInputStream());
		is.setEncoding("ISO-8859-1");
		var parsedxml= xmldocument.parse(is);
		if (getFieldValueFromConfig("wsanuxfp", "odbc_MsgConsole_des") == "1"){
			print("wsanuxfp=" + strUrlCompleta);		
		}else if	(getFieldValueFromConfig("wsanuxfp", "odbc_MsgConsole_des") == "2"){
			AgentLogAutos("wsanuxfp",0,strUrlCompleta)
		}
	
		var strErrMsg:String = isWsWithErrors(parsedxml);
		if(!strErrMsg.equals ("")){
			print("wsanuxfp Error Tag=" + strUrlCompleta+ ": " + strErrMsg);
			return "E";
		}
		
		//Obtenemos el tag <have>
		var dtNodo:DOMNodeList= parsedxml.getElementsByTagName("have"); 
		var nnode:DOMNode= dtNodo.item(0); 
		var strHave:String = nnode.getFirstChild().getNodeValue();
		return strHave;
	}else{//El WS no se encuentra activo
		if (getFieldValueFromConfig("wsanuxfp", "odbc_MsgConsole_des") == "1"){
			print("wsanuxfp= el Ws NO se encuentra activo");		
		}else if	(getFieldValueFromConfig("wsanuxfp", "odbc_MsgConsole_des") == "2"){
			AgentLogAutos("wsanuxfp",0,"el Ws NO se encuentra activo")
		}
		return "";
	}//Termina if de wsanuxfp
}

function getWorkflow(docPropuesta:NotesDocument, key:String) {
	//Se buscan las reglas de la base Dau y se calculan los pasos de aprobacion que correspondan a la propuesta
	
	//Inicializa el objeto 'workflow'
	var workflow = {nivel: 0, detalles: []};
	
	//Obtiene la base Dau
	var dbDau:NotesDatabase = getDbDau();
	if (dbDau == null) {return workflow}
	
	//Recorre los documentos de regla de la base Dau
	var viewReglas:NotesView = dbDau.getView("v.Sys.Reglas");
	var collReglas:NotesDocumentCollection = viewReglas.getAllDocumentsByKey(key, true)
	var docRegla:NotesDocument = collReglas.getFirstDocument();
	var strRegla:String;
	var booRegla:Boolean;

	//Nivel maximo alcanzado por las reglas que se cumplan
	var numNivelMaximo = 0;
	var numNivel = 0;
	//Vector que guarda el detalle de cada regla que se cumpla
	var strReglaDetalleArray:Array = [];

	while (docRegla != null){
		strRegla = docRegla.getItemValueString("reg_regla_cod");
		
		//Evalua la regla 
		if (strRegla.trim() === "")
			booRegla = false;
		else
			booRegla = session.evaluate(strRegla, docPropuesta)[0];
			//print("booRegla=" + booRegla);
		//Si la regla se cumple, se recupera el nivel de aprobacion asociado 
		if (booRegla == true){
			numNivel = docRegla.getItemValue("reg_nivelAsociado_cod")[0];
			//Solo se guarda el maximo nivel alcanzado
			if (numNivel>=numNivelMaximo){numNivelMaximo = numNivel;}
			//Se guarda el detalle de la regla
			strReglaDetalleArray.push(docRegla.getItemValueString("reg_detalleRegla_des"));
		}
		
		//Lee el siguiente documento de regla
		docRegla = collReglas.getNextDocument(docRegla);
	}
	//Si se cumplen reglas, se guardan los datos en el objeto
	if (numNivelMaximo !== 0) {
		workflow.nivel = numNivelMaximo;
		workflow.detalles = strReglaDetalleArray;
		//print("existe regla");
		return workflow;
	}
	return workflow;
}

function getWarningMessages(docPropuesta:NotesXspDocument){
	var arrMailsWarningMessages:Array = getMailsWarningMessages(docPropuesta.getItemValueInteger("sol_poliza_nro").toString());
	if (!arrMailsWarningMessages[0]) return;
	var MessageType:String = arrMailsWarningMessages[1];
	var MessageText:String = arrMailsWarningMessages[2];
	var booMostrarMensageConfig:boolean = isStatusCheckFlag(docPropuesta.getItemValueString("sol_status_cod"), "est_MessageText" + MessageType + "_opt");
	
	if(booMostrarMensageConfig){
		viewScope.put("MessageType", MessageType)
		viewScope.put("MessageText", MessageText)		
	}
}

function getMailsWarningMessages(prmNroPoliza:String):Array{
	var arr:Array = new Array();
	var collMail:DocumentCollection = getCollectionByKey(getDbPropuestas(), "vLK_MailPorPoliza", prmNroPoliza);
	if(collMail.getCount() == 0){
		arr[0] = false; //No tiene mails asociados
		return arr;
	}
	var arrMsg:Array = new Array();
	var docMail:NotesDocument = collMail.getFirstDocument();
	while (docMail != null) {
		arrMsg.push(docMail.getItemValueInteger("orden_nro").toString());
		var tmpdoc = collMail.getNextDocument();
		docMail.recycle();
		docMail = tmpdoc;
	}
	arr[0] = true;
	arr[1] = "Warning";
	arr[2] = "Existen mails en mostrador con este número de póliza. Mail Nro: " + arrMsg.toString();
	return arr;	
}

function redirectToOtherDb(targetDb,pageName,docId,action,moreParams) {
	/* 
	Abre otra base pero en el mismo servidor
	 
	@param targetDb: Path and database name under data directory without an initial slash, e.g., "intranet/myapp.nsf" 
	@param pageName: Name of XPage without the extension, .e.g., "home"
	@param docId: The specfic document UNID
	@param action: One of the common document actions, e.g., "edit" or "read"
	@param moreParams: Additional parameters in the query string, e.g. "&thisvalue=abc&thatvalue=xyz"
	  If there are no other parameters, you do not need the initial ampersand as in the example.
	@return: Requested database in same browser window 
	*/
	 
	var url:XSPUrl = new XSPUrl(database.getHttpURL()); 
	var host:String = url.getHost().split(".")[0];
	var protocol:String = url.getScheme();
	var baseURL:String = protocol + "://" + host + "/" + targetDb;
	if (targetDb == null) {
	  facesContext.getExternalContext().redirect(url.toString());
	 } else {
	  if (pageName == null && docId == null) {
	    facesContext.getExternalContext().redirect(baseURL);
	  } else {
	    var pn = (pageName == null || pageName == "") ? "/$$OpenDominoDocument.xsp" : "/" + pageName + ".xsp";
	    var id = (docId == null || docId == "") ? "" : "documentId=" + docId;
	    var a = (action == null || action == "") ? "" : "&action=" + action + "Document";
	    var mp = (moreParams == null || moreParams == "") ? "" : moreParams;
	    var q = ( (id + a + mp) == "" ) ? "" : "?";
	    facesContext.getExternalContext().redirect(baseURL + pn + q + id + a + mp);
	  }
	 }
	}