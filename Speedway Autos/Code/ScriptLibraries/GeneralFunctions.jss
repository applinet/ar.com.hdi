function generalIsGroupMember(groupName){
	var mostrador = false;
	var groups = context.getUser().getGroups().toArray();
	if(groups.length > 0) {
		for(var i=0; i<groups.length; i++) {
			if(groups[i] == groupName){
				mostrador = true;
			}
		}
	}
	return mostrador
}

function setDbsPathVariables () {
	setDbPath ("dbConfig", "Configuracion");
	setDbPath ("dbVeh", "Vehiculos");
	setDbPath ("dbInspecciones", "Inspecciones");
	setDbPath ("dbInspectores", "Inspectores");
}
function getSScopelastView(){
	if (getIsGroupMember("spwAU.N3.MOST.USR_CRUD")) return "/xvUI_Mostrador.xsp";
	if (getIsGroupMember("spwAU.N3.EMIS.USR_CRUD")) return "xvUI_Por_Estado.xsp";
	if (getIsGroupMember("spwAU.N3.COBR.USR_CRUD")) return "xvUI_Cobranzas.xsp";
	if (getIsGroupMember("spwAU.N3.JEFE.USR_CRUD"))  return "xvUI_Jefe.xsp";
	if (getIsGroupMember("spwAU.N4.GERE.Z01_CRU")) return "xvUI_Autorizaciones.xsp";
	if (getIsGroupMember("spwAU.N3.INSP.USR_CRUD")) return "viewIns_Todas.xsp";	
	if (getIsGroupMember("spwAU.N2.COME.USR_CRU")) return "xvUI_Comercial.xsp";
	if (getIsGroupMember("spwAU.N2.CONT.USR_CRU")) return "xvUI_Contaduria.xsp";
	return "";
}

function setDbPath (strSesScopeVar:String, strKey:String) {
	
	var viewCfg:NotesView = session.getCurrentDatabase().getView("v.Sys.Cfg");

	var docCfg:NotesDocument = viewCfg.getDocumentByKey(strKey)
	var strServer:String = docCfg.getItemValueString("conf_server");
	var strPath:String = docCfg.getItemValueString("conf_path");
	
	var dbGet:NotesDatabase = session.getDatabase(strServer, strPath);
	
	sessionScope.put(strSesScopeVar, dbGet);
	
}

function getDbByKey (strKey:String):NotesDatabase {
	
	var viewCfg:NotesView = session.getCurrentDatabase().getView("v.Sys.Cfg");

	var docCfg:NotesDocument = viewCfg.getDocumentByKey(strKey)
	var strServer:String = docCfg.getItemValueString("conf_server");
	var strPath:String = docCfg.getItemValueString("conf_path");

	return session.getDatabase(strServer, strPath, false);
}

function getDbCfg ():NotesDatabase {
	return getDbByKey ("Configuracion");
}
function getDbVeh ():NotesDatabase {
	return getDbByKey ("Vehiculos");
}
function getDbInspecciones ():NotesDatabase {
	return getDbByKey ("Inspecciones");
}
function getDbDocLock ():NotesDatabase {
	return getDbByKey ("DocLocking");
}
function getDbInspectores ():NotesDatabase {
	return getDbByKey ("Inspectores");
}
function getDbPropuestas ():NotesDatabase {
	return getDbByKey ("Propuestas");
}
function getDbProductores ():NotesDatabase {
	return getDbByKey ("Productores");
}
function getDbMails ():NotesDatabase {
	return getDbByKey ("Mails");
}
function getDbMailsDelete ():NotesDatabase {
	return getDbByKey ("MailsDelete");
}
function getDbInsFcs ():NotesDatabase {
	return getDbByKey ("InsFacturas");
}
function getDbLog ():NotesDatabase {
	return getDbByKey ("AgentLog");
}
function getDbDau ():NotesDatabase {
	return getDbByKey ("Dau");
}
function setLog (itemLog:NotesItem, strLog:String) {
	
	var strFullLog:String = @Now ().toString() + " - " + @Name ("[CN]", @UserName());
	strFullLog += " - " + strLog;
			
	if (itemLog.getValueString ().equals ("")) {
		itemLog.setValueString (strFullLog);
	}
	else {
		var vecValues:Vector = itemLog.getValues();
		vecValues.add (0, strFullLog);
		itemLog.setValues (vecValues);
		//itemLog.appendToTextList (strFullLog);	
	}
	
}
function setSysLog (doc_prm:NotesDocument, strLog_prm:String) {
	var strFullLog:String = @Now ().toString() + " - " + @Name ("[CN]", @UserName());
	strFullLog += " - " + strLog_prm;
	
	var vecLog:java.util.Vector = doc_prm.getItemValue("SysLog");
	vecLog.add(strFullLog);
	doc_prm.replaceItemValue("SysLog", vecLog);

}

function setItemLogBackEnd (doc_a_loguear:NotesDocument, strLog:String, strFieldName:String) {
	var itemLog:NotesItem = doc_a_loguear.getFirstItem(strFieldName);
	setLog (itemLog, strLog);
}

function setLogBackEnd (doc_a_loguear:NotesDocument, strLog:String) {
	var itemLog:NotesItem = doc_a_loguear.getFirstItem("log_des");
	setLog (itemLog, strLog);
}
function isUserSystem ():boolean {
	return generalIsGroupMember ("spwAU.N5.ADMI.USR_CRUD");
}

function isUserAutos ():boolean {
	return generalIsGroupMember ("spwAU.N3.INSP.USR_CRUD");
}
function isUserComercial ():boolean {
	return generalIsGroupMember ("spwAU.N2.COME.USR_CRU");
}
function isUserInsControlFacturacion ():boolean {
	return generalIsGroupMember ("spwAU.N3.INSP.USR_FC");
}

function getOptionLabel (strOptionKey:String, strOptionCode:String) {
		
	if (@Trim (strOptionKey).equals("") || @Trim (strOptionCode).equals("")) {
		return ("");
	}
	
	var vOpciones:NotesView = getDbCfg().getView ("v.Sys.Opciones.ClaveCodigo");
	var docOpt:NotesDocument = vOpciones.getDocumentByKey(strOptionKey + strOptionCode);
	return (docOpt.getItemValueString("opt_Nombre_des"));
	
}

function getHoySinHora ():java.util.Date {
	return getFechaSinHora (new java.util.Date());
}
function getFechaSinHora (dtFec:java.util.Date):java.util.Date {
	var intYear:int = dtFec.getFullYear();
	var intMonth:int = dtFec.getMonth();
	var intDay:int = dtFec.getDate();
	var dtFecSinHora:java.util.Date = new java.util.Date(intYear, intMonth, intDay, 0, 0, 0);
	return dtFecSinHora;
}

/*
 * Diego Liberman - 2013/09/24
 * 
 * A partir de un alias y de un array, busca ese alias en el array
 * y devuelve el Label asociado.
 * 
 * strOptions_array - Array donde se espera encontrar en cada posición
 * un string con el Label a la izquierda y el Alias a la derecha, 
 * separados por un Pipe.  Ejemplo: [Chevrolet|1], [Ford|2]
 * 
 * strAlias - El Alias a buscar
 * */
function getLabelFromAlias (strOptions_array:Array, strAlias:String):String {
	var strRight:String;
	
	for (i=0; i<strOptions_array.length; i++) {
		strRight = @Right(strOptions_array[i], "|");
		if (strRight.equals(strAlias)) { 
			return (@Left(strOptions_array[i], "|"));
		}
	}
	
	return "<NOT FOUND>";
}

/*
 * 
 * Diego Liberman - 2013/09/27
 * 
 * Recarga el XSP document con los campo del back end document. 
 * 
 * 
 * */
function updateXspWithDataSource (docXsp:NotesXspDocument) {
	//print ("vamos a actualizar");
	var vecItems:java.util.Vector = docXsp.getDocument().getItems();
	var itemAhogado:NotesItem;
	var strItemName:String;
	
	for (i=0; i<vecItems.size(); i++) {
		itemAhogado = vecItems.elementAt(i);
		strItemName = itemAhogado.getName ();
		//print ("valor: " + docXsp.getDocument().getItemValueString(strItemName));
		newValue = itemAhogado.getValues();
		docXsp.replaceItemValue(strItemName, newValue);
		//myComp = getComponent (strItemName);
		//if (myComp != null && newValue != null) myComp.setValue (newValue.elementAt(0));
	}	
}

function getVigenciaHasta(vigDesde:NotesDateTime, articulo:String){
	var result:NotesDateTime = vigDesde;
	importPackage(ar.com.hdi.autos.connect);
	var jce:GetArrayFromQueryAS400 = new GetArrayFromQueryAS400();
	var doc:NotesDocument = database.createDocument();
	doc.appendItemValue("sol_articulo_cod", getComponent("sol_articulo_cod").getValue());
	doc.appendItemValue("sol_rama_cod", getComponent("sol_rama_cod").getValue());
	var dupe = jce.getSelectAS("solTB_SET621_vigenciaHasta", doc);
	result.adjustMonth(Number(dupe[0]));
	doc.recycle();
	return result;	
}

function getVigenciaHastaParam(prmVigDesde:NotesDateTime, prmArticulo:String, prmRama:String){
	var result:NotesDateTime = prmVigDesde;
	importPackage(ar.com.hdi.autos.connect);
	var jce:GetArrayFromQueryAS400 = new GetArrayFromQueryAS400();
	var doc:NotesDocument = database.createDocument();
	doc.appendItemValue("sol_articulo_cod", prmArticulo);
	doc.appendItemValue("sol_rama_cod", prmRama);
	var dupe = jce.getSelectAS("solTB_SET621_vigenciaHasta", doc);
	result.adjustMonth(Number(dupe[0]));
	doc.recycle();
	return result;	
}

function getYMD (dtFecha:NotesDateTime, strSep:String):String {
	//Get year month day
	
	var dtJs:Date;
	var intYear:int;
	var intMonth:int;
	var intDay:int;
	var strYear:String = "";
	var strMonth:String = "";
	var strDay:String = "";

	dtJs = dtFecha.toJavaDate();
	intYear = dtJs.getFullYear();
	intMonth = dtJs.getMonth() + 1; //Meses van de 0 a 11
	intDay = dtJs.getDate();
	
	strYear = intYear.toString();
	
	if (intMonth < 10) strMonth = "0";
	strMonth += intMonth.toString ();
	
	if (intDay < 10) strDay = "0";
	strDay += intDay.toString ();
	
	return (strYear + strSep + strMonth + strSep + strDay);
}

function isNextStatusAvailable(codStatus:String, codStatusNext:String){
	//Busca si el estado siguiente se encuentra tildado en el checkbox de configuracion de estados
	var result:Boolean = false;
	var vEstados:NotesView = getDbCfg().getView ("v.Sys.LK_EstadosCodigo");
	var docEstado:NotesDocument = vEstados.getDocumentByKey(codStatus);
	if (docEstado != null){
		var arrEstSig:String = docEstado.getItemValue("est_Siguientes_cod");
		for( opt in arrEstSig){
			if (opt.split('|')[1] == codStatusNext){result = true}	
		}	
	}
	vEstados.recycle();
	docEstado.recycle();
	return result
}

var statusConfig = function (form:String){ 
	/*Recibo el nombre del formulario y devuelvo: 
	getDefaultLabel: Descripción Estado Default
	getDefaultCod: Código Estado Default
    getArrLabel: Array con todas las descripciones de estados
    getArrCod: Array con todos los códigos de estados
    getArrDefault: Array con defaultValue
    */
	
	var vEstados:NotesView = getDbCfg().getView ("v.Sys.vLK_TodosEstadosOrdenados");
	var entryCol:NotesViewEntryCollection = vEstados.getAllEntriesByKey(form)
	var entryOpt:NotesViewEntry = entryCol.getFirstEntry();
	var arrLabel:Array = new Array ();
	var arrCod:Array = new Array ();
	var strDefaultLabel:String;
	var strDefaultCod:String;
	var docTemp:NotesDocument;
	while (entryOpt != null) {
		docTemp = entryOpt.getDocument();
		arrLabel.push(docTemp.getItemValueString("est_Nombre_des"));
		arrCod.push(docTemp.getItemValueString("est_Codigo_des"));
		if (docTemp.getItemValueString("est_Default_opt") == "1"){
			strDefaultLabel = docTemp.getItemValueString("est_Nombre_des");
			strDefaultCod = docTemp.getItemValueString("est_Codigo_des");
		}
		//Recycle
		var tmpentry:NotesViewEntry = entryCol.getNextEntry(entryOpt);
		entryOpt.recycle();
		docTemp.recycle();
		entryOpt = tmpentry;		
	};
	vEstados.recycle();
	entryCol.recycle();
		
	return {
        //public members
    	getDefaultLabel: strDefaultLabel,
    	getDefaultCod: strDefaultCod,
        getArrLabel: arrLabel,
        getArrCod: arrCod};
}

function getStatusLabel(codStatus:String){
	var vOpciones:NotesView = getDbCfg().getView ("v.Sys.vLK_EstadosOrdenados");
	var docOpt:NotesDocument = vOpciones.getDocumentByKey(codStatus);
	var result:String = docOpt.getItemValueString("est_Nombre_des");
	vOpciones.recycle();
	docOpt.recycle();
	return result;
}

function getStatusTodosLabel(codStatus:String, formulario:String){
	var arrTemp:java.util.Vector = new java.util.Vector();
	arrTemp.add(formulario);
	arrTemp.add(codStatus);
	var vOpciones:NotesView = getDbCfg().getView ("v.Sys.vLK_TodosEstadosOrdenados");
	var docOpt:NotesDocument = vOpciones.getDocumentByKey(arrTemp);
	var result:String = docOpt.getItemValueString("est_Nombre_des");
	vOpciones.recycle();
	docOpt.recycle();
	return result;
}

function getStatusLabelInsp(codStatus:String){
	var vOpciones:NotesView = getDbCfg().getView("v.Sys.LK_EstadosInspOrdenados");
	var docOpt:NotesDocument = vOpciones.getDocumentByKey(codStatus);
	var result:String = docOpt.getItemValueString("est_Nombre_des");
	vOpciones.recycle();
	docOpt.recycle();
	return result;
}

function isStatusOperacionesPermitidas(prm_statusCod:String, prm_sol_tipoMovimiento_cod:String):boolean{
	var result:boolean;
	var vEstados:NotesView = getDbCfg().getView ("v.Sys.LK_EstadosCodigo");
	var docEstado:NotesDocument = vEstados.getDocumentByKey(prm_statusCod);
	if (docEstado != null){		
		var est_PermiteEmisionTipoOper:java.util.Vector = docEstado.getItemValue("est_PermiteEmisionTipoOper");
		return est_PermiteEmisionTipoOper.contains(prm_sol_tipoMovimiento_cod);
	}
}

function isStatusCheckFlag(codStatus:String, flag:String){
	//Busca si el estado tiene el check de emision
	var result:Boolean = false;
	var vEstados:NotesView = getDbCfg().getView ("v.Sys.LK_EstadosCodigo");
	var docEstado:NotesDocument = vEstados.getDocumentByKey(codStatus);
	if (docEstado != null){
		var marca:String = docEstado.getItemValueString(flag);
		if (marca == "1"){result = true}
	}
	if (vEstados != null){
		vEstados.recycle();	
	}
	if (docEstado != null){
		docEstado.recycle();	
	}
	return result
}

var opcionesClaveMap = function (clave:String){
	var vOpciones:NotesView = getDbCfg().getView ("v.Sys.Opciones.Clave");
	var entryCol:NotesViewEntryCollection = vOpciones.getAllEntriesByKey(clave)
	var entryOpt:NotesViewEntry = entryCol.getFirstEntry();
	var mapByCod = new java.util.HashMap();
	var mapByDesc = new java.util.HashMap();
	
	while (entryOpt != null) {	
		mapByCod.put(entryOpt.getDocument().getItemValueString("opt_Codigo_des"), entryOpt.getDocument().getItemValueString("opt_Nombre_des"));
		mapByDesc.put(entryOpt.getDocument().getItemValueString("opt_Nombre_des"), entryOpt.getDocument().getItemValueString("opt_Codigo_des"));
		//Recycle
		var tmpentry:NotesViewEntry = entryCol.getNextEntry(entryOpt);
		entryOpt.recycle();
		entryOpt = tmpentry;		
	};
	vOpciones.recycle();
	entryCol.recycle();
		
	return {
        //public members
    	getMapByCod: mapByCod,
    	getMapByDesc: mapByDesc};
}


function getOpcionesClave(clave:String){
	var vOpciones:NotesView = getDbCfg().getView ("v.Sys.Opciones.Clave");
	var entryCol:NotesViewEntryCollection = vOpciones.getAllEntriesByKey(clave)
	var entryOpt:NotesViewEntry = entryCol.getFirstEntry();
	var arrOpts:Array = new Array ();

	while (entryOpt != null) {	
		arrOpts.push(entryOpt.getDocument().getItemValueString("opt_Nombre_des") + "|" + entryOpt.getDocument().getItemValueString("opt_Codigo_des"));
		//Recycle
		var tmpentry:NotesViewEntry = entryCol.getNextEntry(entryOpt);
		entryOpt.recycle();
		entryOpt = tmpentry;		
	};
	vOpciones.recycle();
	entryCol.recycle();
	return arrOpts;
}

function getSelectedValueFromAlias( id ) {
	var ComboBox = getComponent( id );
	var ChildrenList:java.util.ListIterator;
	var result:String;
	ChildrenList = ComboBox.getChildren().listIterator();
	while (ChildrenList.hasNext()) {
		var Child = ChildrenList.next();
		/*** process computed / multiple values ***/
		if( typeof( Child ) == 'com.ibm.xsp.component.UISelectItemsEx' ){
			var hlp = Child.getValue();
			for( var i=0; i< hlp.length; i++ ){
				if(getComponent(id).getValue() == hlp[i].getValue()){
					result = hlp[i].getLabel();
				}
			}
		}
		/*** process single values ***/
		if( typeof( Child ) == 'com.ibm.xsp.component.UISelectItemEx' ){
			if(getComponent(id).getValue() == Child.getItemValue()){
				result = Child.getItemLabel();
			}
		}
	}
	return result;
}
function getCollectionByKey(dbSource:NotesDatabase, vista:String, clave:String){
	var view:NotesView = dbSource.getView(vista);
	var dc:DocumentCollection = view.getAllDocumentsByKey(clave);
	return dc
}

function delay(millisecond){
	var startTime = new Date().getTime(); // get the current time
	while (new Date().getTime() < startTime + millisecond){ 
	}
	return true;
}


function StringToNotesDateTime(inputFormat:String, inputTimeStamp:String, outputFormat:String) {
	fecha = new java.text.SimpleDateFormat(outputFormat).format(new java.text.SimpleDateFormat(inputTimeStamp).parse(inputFormat))
	.toString();
	return session.createDateTime(fecha);
	
}

function evaluateFormula(strFormula_param:String, docTarget_param:NotesDocument){
	if (docTarget_param != null) return session.evaluate(strFormula_param, docTarget_param);
	else return session.evaluate(strFormula_param);
}

function evaluateFormulaXsp(strFormula_param:String, docTarget_param:NotesXspDocument){
	if (docTarget_param != null) return session.evaluate(strFormula_param, docTarget_param.getDocument(true));
	else return session.evaluate(strFormula_param);
}

function getFieldValueFromConfig(clave:String, fieldName:String){
	var dc:DocumentCollection = getCollectionByKey(getDbCfg(), "v.Sys.ODBC", clave);
	if(dc.getCount() < 1){return ""};
	var doc:NotesDocument = dc.getFirstDocument();	
	return doc.getItemValueString(fieldName);
}

function getFieldValueAsItemFromConfig(clave:String, fieldName:String):String{
	var dc:DocumentCollection = getCollectionByKey(getDbCfg(), "v.Sys.ODBC", clave);
	if(dc.getCount() < 1){return ""};
	var doc:NotesDocument = dc.getFirstDocument();	
	return doc.getItemValue(fieldName);
}

function getFieldValueFromViewConfig(vista:String, clave:String, fieldName:String){
	var dc:DocumentCollection = getCollectionByKey(getDbCfg(), vista, clave);
	if(dc.getCount() < 1){return ""};
	var doc:NotesDocument = dc.getFirstDocument();	
	return doc.getItemValueString(fieldName);
}

function getDatosDomicilioAsegurado(prm_sol_asegurado_cod:String){
	importPackage(ar.com.hdi.autos.connect);
	var jce:GetArrayFromQueryAS400 = new GetArrayFromQueryAS400();
	var doc:NotesDocument = database.createDocument()
	doc.appendItemValue("sol_asegurado_cod", prm_sol_asegurado_cod);
	var strTemp:String = jce.getSelectAS("solTB_SEHASE99", doc)[0];
	return strTemp.split("~");	
}

function AgentLogAutos(nombre, codigo, msg){
	/*30/04/2013 - FPR
	 *Grabo registo en AgentLog (AgentLogAutos)
	 *nombre= nombre del agente
	 *codigo= 0-> Error de tipo Accion
	 *codigo= 1-> Error de tipo Error con un codigo 
	 *msg= mensaje con una descripcion del error 
	 */
	var jsLog: NotesLog = session.createLog(nombre);
	var dbLog:NotesDatabase = getDbLog ();
	
	jsLog.openNotesLog(session.getServerName(), dbLog.getFilePath())
	if(codigo == 0){
		jsLog.logAction(msg);
	}else{
		jsLog.logError(codigo, msg);	
	}	
}

function wrapDocument(doc: NotesDocument): NotesXspDocument {
    return com.ibm.xsp.model.domino.wrapped.DominoDocument.wrap(doc.getParentDatabase().getFilePath(), doc, null, null, false, null);
}

function evaluarRegla(doc:NotesDocument, ruleName:String):java.util.Vector{
	/* --Evalua el form Reglas del documento de Configuracion.--
	 * Devuelve: un vector
	 * [0] si cumple las condiciones, devuelve true, sino false 
	 * [1] si cumple las condiciones, devuelve el parametro del documento de configuración
	 * [2] String: si tiene tooltip y cumple las condiciones, devuelve el texto del tooltip, sino "" 
	 * */
	var vecResultado:java.util.Vector = new java.util.Vector ();
	var vOpciones:NotesView = getDbCfg().getView ("v.Sys.Reglas");
	if(vOpciones == null){
		vecResultado.add(false);
		return vecResultado;
	}
	var docOpt:NotesDocument = vOpciones.getDocumentByKey(ruleName);
	if(docOpt == null){
		vecResultado.add(false);
		return vecResultado;
	}
	var reglaPropuesta:String = docOpt.getItemValueString("regla_Propuesta_des");
	var reglaVehiculo:String = docOpt.getItemValueString("regla_Vehiculos_des");
	var reglaInspeccion:String = docOpt.getItemValueString("regla_Inspeccion_des");
	var reglaToolTip:String = docOpt.getItemValueString("regla_ToolTip_des");
	
	var booReglaPropuesta:boolean = (evaluateFormula(reglaPropuesta, doc).elementAt(0));
	var booReglaVeh:boolean = ReglaVeh(doc, reglaVehiculo);
	var booReglaInsp:boolean = ReglaInsp(doc, reglaInspeccion);
	
	if(booReglaPropuesta && booReglaVeh && booReglaInsp){
		vecResultado.add(true);
		vecResultado.add(docOpt.getItemValueString("regla_RtaVerdadero_des"));
		vecResultado.add(reglaToolTip);						
	}else{
		vecResultado.add(false);
		vecResultado.add(docOpt.getItemValueString("regla_RtaFalso_des"));
		vecResultado.add("");						
	}	
	return vecResultado;	
}

function ReglaVeh(doc:NotesDocument, reglaVehiculo:String):boolean{
	/* * Evaluamos los vehiculos de las propuestas segun la regla: 
	 * - al menos 1 vehiculo
	 * - todos los vehiculos
	 * - ningun vehiculo 
	 * */
	var reglaTipo:String = docOpt.getItemValueString("regla_VehiculosTipo_des");
	var collVeh:DocumentCollection = getCollectionByKey(getDbPropuestas(), "v.UI.VehAsocPropuestas_EmbView", doc.getUniversalID());
	if(collVeh.getCount() == 0){//No tiene Vehiculos
		if(reglaTipo.equals("9")){ //No evaluar vehiculos
			return true;
		}else if(reglaTipo.equals("2")){ //Sin vehiculos
			return true;
		}else 
			return false;
	}else{ //Tiene Vehiculos
		if(reglaTipo.equals("9")){ //No evaluar vehiculos
			return true;
		}else if(reglaTipo.equals("2")){ //Sin vehiculos
			return false};
				
		var docVeh:NotesDocument = collVeh.getFirstDocument();
		while (docVeh != null) {
			var booReglaVeh:boolean = evaluateFormula(reglaVehiculo, docVeh).elementAt(0);

			//print(booReglaVeh + "-" + docVeh.getItemValueString("veh_patente_des")); //borrar
			if(reglaTipo.equals("1") && booReglaVeh){ //Al menos 1
				//print("auto=" + docVeh.getItemValueString("veh_patente_des"));//borrar
				return true;
			}else if (reglaTipo.equals("0") && !booReglaVeh){//Todos
				return false;		
			}	
			var tmpdoc = collVeh.getNextDocument();
			docVeh.recycle();
			docVeh = tmpdoc;
		}
		if (reglaTipo.equals("0")){
			return true;			
		}else{
			return false;
		}	
	}
}

function ReglaInsp(doc:NotesDocument, reglaInspeccion:String):boolean{
	/* * Evaluamos las inspecciones de las propuestas segun la regla: 
	 * - al menos 1 vehiculo
	 * - todos los vehiculos
	 * */
	var reglaTipo:String = docOpt.getItemValueString("regla_InspeccionesTipo_des");
	var collInsp:DocumentCollection = getCollectionByKey(getDbInspecciones(), "vLK_InspPorNroProp", doc.getItemValueInteger("orden_nro").toString());
	if(collInsp.getCount() == 0){//No tiene Inspecciones
		if(reglaTipo == "9"){ //No evaluar Inspecciones
			return true;
		}else if(reglaTipo == "2"){ //Sin inspecciones
			return true;
		}else 
			return false;
	}else{ //Tiene Inspecciones
		if(reglaTipo == "9"){ //No evaluar inspeccioness
			return true;
		}else if(reglaTipo == "2"){ //Sin inspecciones
			return false};
		
		var docInsp:NotesDocument = collInsp.getFirstDocument();
		while (docInsp != null) {
			var booReglaInsp:boolean = evaluateFormula(reglaInspeccion, docInsp).elementAt(0);
			//print(booReglaInsp + "-" + docInsp.getItemValueString("ins_Consecutivo_des")); //borrar
			if(reglaTipo == "1" && booReglaInsp){ //Al menos 1
				//print("insp=" + docInsp.getItemValueString("ins_Consecutivo_des"));//borrar
				return true;
			}else if (reglaTipo == "0" && !booReglaInsp){//Todos
				return false;		
			}	
			var tmpdoc = collInsp.getNextDocument();
			docInsp.recycle();
			docInsp = tmpdoc;
		}
		if (reglaTipo.equals("0")){
			return true;			
		}else{
			return false;
		}	
	}	
}

function booInspeccionesDePropuestaOK(prm_strNroProp:String){
	//Esta funcíon está duplicada de JSS400, para no cargar toda la librería. Se le cambio el nombre (isInspeccionesDePropuestaOK)  
	
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

function verificarTagsDocumentacion(docXsp:NotesXspDocument) {
	//docProp:NotesDocument
	//viewScope.get("docxProp")
	/*
	 * Si el usuario agregó tags de documentación faltante
	 * Busca el mail asociado a la propuesta (el que le dio origen)
	 * Compara los campos que guardan los tags
	 * Si el mail tiene algún tag que también esté en la propuesta, 
	 * se avisa al usuario
	 * se quita el tag de la propuesta 
	 */
	
	var strTagsMailArray:Array = new Array ();
	var strTagsPropArray:Array = new Array ();
	var db:NotesDatabase = docXsp.getParentDatabase();
	
	if (docXsp.getValue("Form") == "Propuesta") {
		//Si es propuesta, se busca el mail asociado (el que le dio origen)
		strTagsPropArray = viewScope.get("strDocTagsArray");
		var docMail:NotesDocument = db.getDocumentByUNID(viewScope.get("selectedEmailUNID"));
	
		if (docMail != null) {
			strTagsMailArray = docMail.getItemValue("mai_Documentacion_des");
		}
	} else {
		//Si es mail, se busca la propuesta a la que se lo quiere adjuntar
		strTagsMailArray = docXsp.getValue("mai_Documentacion_des");
		var strClave = viewScope.get("AdjuntarPropuestaNro").toString();
		
		var docProp:NotesDocument = db.getDocumentByUNID(strClave.substr(strClave.indexOf("|") + 1));
		if (docProp != null) {
			strTagsPropArray = docProp.getItemValue("sol_Documentacion_des");
		}
	}
	
	//Si hay tags de documentación faltante en el mail y la propuesta, se verifican para corregir la propuesta
	if (strTagsPropArray != null && strTagsMailArray != null && strTagsPropArray.toString() != "" && strTagsMailArray.toString() != "") {
	
		if (strTagsMailArray.toString() != "") {
			var strTagsArray:Array = new Array();
			var booInformar = false;
	
			for (var i=0; i < strTagsPropArray.length; i++) {
				//Si el mail tiene algún tag que también esté en la propuesta
				if (strTagsMailArray.toString().indexOf(strTagsPropArray[i]) != -1) {
					//Informamos al usuario que se modificarán los tags seleccionados
					booInformar = true;
				} else {
					strTagsArray.push(strTagsPropArray[i]);
				}
			}
			
			if (booInformar == true) {
				if (strTagsArray[0] != "") {
					if (docXsp.getValue("Form") == "Propuesta") {
						setLogBackEnd (docXsp.getDocument(), "Se actualizó la documentación faltante en la propuesta. El mail asociado contiene documentos que la completan.");
						docXsp.setValue("sol_Documentacion_des",strTagsArray);
					} else {
						docProp.replaceItemValue("sol_Documentacion_des",strTagsArray);
						setLogBackEnd (docProp, "Se actualizó la documentación faltante en la propuesta. El mail asociado contiene documentos que la completan.");
						docProp.save(true);
					}
				}
			}
		}
	}
}

// Copia el documento (parámetro doc) a la base productiva
// y lo borra de la base en que se encuentra
function moverDocumentoProd(doc:NotesDocument):NotesDocument {
	var dbProductiva:NotesDatabase = getDbByKey("Navegador - No cambiar");

	if (dbProductiva != null) {
		print("moverDocumentoProd 1");
		// Solo se mueve el documento cuando la base origen es diferente de la base destino
		if (!doc.getParentDatabase().getFilePath().equals(dbProductiva.getFilePath())) {
			print("moverDocumentoProd 1.1");
			// Crea el documento nuevo en la base destino, copia el contenido del documento origen,
			// cambia el UNID y lo guarda
			var docDestino:NotesDocument = dbProductiva.createDocument();
			print("moverDocumentoProd 1.2");
			doc.copyAllItems(docDestino, true);
			docDestino.setUniversalID(doc.getUniversalID());
			docDestino.save(true, false);
			print("moverDocumentoProd 1.3");
			// Borra el documento original
			doc.removePermanently(true);
			print("moverDocumentoProd 1.4");
			return docDestino;
		} else {
			print("moverDocumentoProd 2");
			return null;
		}
	} else {
		print("moverDocumentoProd 3");
		return null;
	}
}