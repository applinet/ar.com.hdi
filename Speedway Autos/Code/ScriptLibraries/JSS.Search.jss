function buildOrderQuery() {
 var sol_status_des = viewScope.get("sol_status_des");
 var web_icon_cod = viewScope.get("web_icon_cod");
 var tipoEmision_opt = viewScope.get("tipoEmision_opt");
 var sol_tipoMovimiento_cod = viewScope.get("sol_tipoMovimiento_cod"); 
 var sol_tipoOperacion_cod = viewScope.get("sol_tipoOperacion_cod"); 
 var fechaEmisionReal_nro = viewScope.get("fechaEmisionReal_nro"); 
 var fechaEmisionGaus_nro = viewScope.get("fechaEmisionGaus_nro"); 
 var sol_asegurado_des = viewScope.get("sol_asegurado_des");
 var sol_asegurado_cod = viewScope.get("sol_asegurado_cod");
 var sol_productor_des = viewScope.get("sol_productor_des");
 var sol_productor_cod = viewScope.get("sol_productor_cod"); 
 var sol_productorN5_des = viewScope.get("sol_productorN5_des");
 var sol_productorN5_cod = viewScope.get("sol_productorN5_cod"); 
 var sol_productorN6_des = viewScope.get("sol_productorN6_des");
 var sol_productorN6_cod = viewScope.get("sol_productorN6_cod"); 
 var fieldArray = [];
 
 if (sol_status_des != "" && sol_status_des != null) {
	 if (sol_status_des == "Suspendida"){
		 sol_status_des = "Suspendida Especial";
		 addToQuery(sol_status_des,"AND NOT ",fieldArray,"sol_status_des", "", "=");		 
	 }else{
		 addToQuery(sol_status_des,"AND",fieldArray,"sol_status_des", "", "=");		 
	 }
 }
 if (web_icon_cod != "" && web_icon_cod != null) {
	 if(web_icon_cod == "-"){
		 addToQuery("70","AND",fieldArray,"web_icon_cod", "NOT", "=");
	 }else{
		 addToQuery(web_icon_cod,"AND",fieldArray,"web_icon_cod", "", "=");		 
	 }	  
 }
 if (tipoEmision_opt != "" && tipoEmision_opt != null) {
	 if(tipoEmision_opt == "1"){
		addToQuery(tipoEmision_opt,"AND",fieldArray,"sol_tipoEmision_opt", "", "=");		 
	 }else{
		 addToQuery("1","AND",fieldArray,"sol_tipoEmision_opt", "NOT", "=");		 
	 }
 }
 if (sol_tipoMovimiento_cod != "" && sol_tipoMovimiento_cod != null) {
		addToQuery(sol_tipoMovimiento_cod,"AND",fieldArray,"sol_tipoMovimiento_cod", "", "=");
 } 
 if (sol_tipoOperacion_cod != "" && sol_tipoOperacion_cod != null) {
		addToQuery(sol_tipoOperacion_cod,"AND",fieldArray,"sol_tipoOperacion_cod", "", "=");
 }
 if (fechaEmisionReal_nro != "" && fechaEmisionReal_nro != null) {
	 	var tmp:NotesDateTime = StringToNotesDateTime(fechaEmisionReal_nro.toLocaleString() ,"dd/MM/yyyy hh:mm:ss", "dd/MM/yyyy");
		addToQuery(tmp,"AND",fieldArray,"fechaEmisionReal_nro", "", "=");
 } 
 if (fechaEmisionGaus_nro != "" && fechaEmisionGaus_nro != null) {
	 	var tmp:NotesDateTime = StringToNotesDateTime(fechaEmisionGaus_nro.toLocaleString() ,"dd/MM/yyyy hh:mm:ss", "dd/MM/yyyy");
		addToQuery(tmp,"AND",fieldArray,"fechaEmisionGaus_nro", "", "=");
 } 
 if (sol_asegurado_des != "" && sol_asegurado_des != null) {
	addToQuery(sol_asegurado_des,"AND",fieldArray,"sol_asegurado_des", "", "=");
 }
 if (sol_asegurado_cod != "" && sol_asegurado_cod != null) {
	addToQuery(sol_asegurado_cod,"AND",fieldArray,"sol_asegurado_cod", "", "=");
 }
 if (sol_productor_des != "" && sol_productor_des != null) {
	addToQuery(sol_productor_des,"AND",fieldArray,"sol_productor_des", "", "=");
 }
 if (sol_productor_cod != "" && sol_productor_cod != null) {
	addToQuery(sol_productor_cod,"AND",fieldArray,"sol_productor_cod", "", "=");
 } 
 if (sol_productorN5_des != "" && sol_productorN5_des != null) {
	addToQuery(sol_productorN5_des,"AND",fieldArray,"sol_productorN5_des", "", "=");
 }
 if (sol_productorN5_cod != "" && sol_productorN5_cod != null) {
	addToQuery(sol_productorN5_cod,"AND",fieldArray,"sol_productorN5_cod", "", "=");
 }
 if (sol_productorN6_des != "" && sol_productorN6_des != null) {
	addToQuery(sol_productorN6_des,"AND",fieldArray,"sol_productorN6_des", "", "=");
 }
 if (sol_productorN6_cod != "" && sol_productorN6_cod != null) {
	addToQuery(sol_productorN6_cod,"AND",fieldArray,"sol_productorN6_cod", "", "=");
 }
 
 var fieldQuery = "";
 if (fieldArray.length > 0) {
	if (fieldArray.length == 1) {
		fieldQuery += fieldArray[0];
	} else {
		fieldQuery += "(" + fieldArray.join(" AND ") + ")";
	}
 }
 //print("fieldQuery=" + fieldQuery);
 //sessionScope.put("searchFTIquery", fieldQuery);
 var colArray:Array = multiFTSearch(fieldQuery, "ftiProductiva");
 docsToJSon(colArray);
 sessionScope.searchQry.put("strQuery", fieldQuery)
 return fieldQuery;
}

function buildOrderQueryInsp() {
	 var ins_iEst_des = viewScope.get("ins_iEst_des");
	 var web_icon_cod = viewScope.get("web_icon_cod");
	 var ins_Inspect_opt = viewScope.get("ins_Inspect_opt"); 
	 var ins_VehPatNro_des = @Trim(viewScope.get("ins_VehPatNro_des")); 
	 var ins_iEnvioFechaDesde_dat = viewScope.get("ins_iEnvioFechaDesde_dat"); 
	 print("ins_iEnvioFechaDesde_dat = " + ins_iEnvioFechaDesde_dat);
	 var ins_iEnvioFechaHasta_dat = viewScope.get("ins_iEnvioFechaHasta_dat"); 
	 print("ins_iEnvioFechaHasta_dat = " + ins_iEnvioFechaHasta_dat);
	 var ins_iFechaDesde_dat = viewScope.get("ins_iFechaDesde_dat"); 
	 var ins_iFechaHasta_dat = viewScope.get("ins_iFechaHasta_dat"); 
	 var ins_Aseg_des = viewScope.get("ins_Aseg_des");
	 var ins_Aseg_cod = viewScope.get("ins_Aseg_cod");
	 var ins_Prod_des = viewScope.get("ins_Prod_des");
	 var ins_Prod_cod = viewScope.get("ins_Prod_cod"); 
	 var fieldArray = [];
	 
	 if (ins_iEst_des != "" && ins_iEst_des != null) {
		 if (ins_iEst_des == "Suspendida"){
			 ins_iEst_des = "Suspendida Especial";
			 addToQuery(ins_iEst_des,"AND NOT ",fieldArray,"ins_iEst_des", "", "=");		 
		 }else{
			 addToQuery(ins_iEst_des,"AND",fieldArray,"ins_iEst_des", "", "=");		 
		 }
	 }
	 if (web_icon_cod != "" && web_icon_cod != null) {
		 if(web_icon_cod == "-"){
			 addToQuery("70","AND",fieldArray,"web_icon_cod", "NOT", "=");
		 }else{
			 addToQuery(web_icon_cod,"AND",fieldArray,"web_icon_cod", "", "=");		 
		 }	  
	 }
	 if (ins_Inspect_opt != "" && ins_Inspect_opt != null) {
		addToQuery(ins_Inspect_opt,"AND",fieldArray,"ins_Inspect_opt", "", "=");
	 } 
	 if (ins_VehPatNro_des != "" && ins_VehPatNro_des != null) {
		addToQuery(ins_VehPatNro_des,"AND",fieldArray,"ins_VehPatNro_des", "", "=");
	 }
	 if (ins_iEnvioFechaDesde_dat != "" && ins_iEnvioFechaDesde_dat != null) {
		 print("toLocaleString=" + ins_iEnvioFechaDesde_dat.toLocaleString()); 
			
		var tmp:NotesDateTime = StringToNotesDateTime(ins_iEnvioFechaDesde_dat.toLocaleString() ,"dd/MM/yyyy hh:mm:ss", "dd/MM/yyyy");
		 print("tmp=" + tmp); 
		addToQuery(tmp,"AND",fieldArray,"ins_iEnvioFecha_dat", "", ">=");
	 } 
	 if (ins_iEnvioFechaHasta_dat != "" && ins_iEnvioFechaHasta_dat != null) {
		var tmp:NotesDateTime = StringToNotesDateTime(ins_iEnvioFechaHasta_dat.toLocaleString() ,"dd/MM/yyyy hh:mm:ss", "dd/MM/yyyy");
		addToQuery(tmp,"AND",fieldArray,"ins_iEnvioFecha_dat", "", "<=");
	 } 
	 if (ins_iFechaDesde_dat != "" && ins_iFechaDesde_dat != null) {
		var tmp:NotesDateTime = StringToNotesDateTime(ins_iFechaDesde_dat.toLocaleString() ,"dd/MM/yyyy hh:mm:ss", "dd/MM/yyyy");
		addToQuery(tmp,"AND",fieldArray,"ins_iFecha_dat", "", ">=");
	 } 
	 if (ins_iFechaHasta_dat != "" && ins_iFechaHasta_dat != null) {
		var tmp:NotesDateTime = StringToNotesDateTime(ins_iFechaHasta_dat.toLocaleString() ,"dd/MM/yyyy hh:mm:ss", "dd/MM/yyyy");
		addToQuery(tmp,"AND",fieldArray,"ins_iFecha_dat", "", "<=");
	 } 
	 if (ins_Aseg_des != "" && ins_Aseg_des != null) {
		addToQuery(ins_Aseg_des,"AND",fieldArray,"ins_Aseg_des", "", "=");
	 }
	 if (ins_Aseg_cod != "" && ins_Aseg_cod != null) {
		addToQuery(ins_Aseg_cod,"AND",fieldArray,"ins_Aseg_cod", "", "=");
	 }
	 if (ins_Prod_des != "" && ins_Prod_des != null) {
		addToQuery(ins_Prod_des,"AND",fieldArray,"ins_Prod_des", "", "=");
	 }
	 if (ins_Prod_cod != "" && ins_Prod_cod != null) {
		addToQuery(ins_Prod_cod,"AND",fieldArray,"ins_Prod_cod", "", "=");
	 }
	 
	 var fieldQuery = "";
	 if (fieldArray.length > 0) {
		if (fieldArray.length == 1) {
			fieldQuery += fieldArray[0];
		} else {
			fieldQuery += "(" + fieldArray.join(" AND ") + ")";
		}
	 }
	 
//	 print("fieldQueryInsp=" + fieldQuery)
	 var colArray:Array = multiFTSearch(fieldQuery, "ftiProductiva");
	 docsToJSonInsp(colArray);
	 sessionScope.searchQry.put("strQuery", fieldQuery)
	 return fieldQuery;
	}


function addToQuery(str,connector,targetArray,fieldName, negativo, signo) {
	 var ret = "";
	 if ((fieldName != null) && (fieldName != "")) {
		//ret = "[" + fieldName + "]=";
		ret = "[" + fieldName + "]" + signo;
	 }
	 if (@Contains(str, " ")) {
		var arr = str.split(" ");
		targetArray.push(ret + "(" + arr.join(" " + connector + " ") + ")");
	 } else {
		targetArray.push(" (" + negativo + " " + ret + str + ")");
	 }	
 }


/*
Hace una búsqueda indexada en la base que se recibe como parámetro y devuelve los resultados
en una colección.
*/
function ftSearchBase(db:NotesDatabase, strQuery:String):NotesDocumentCollection {
	var colResultados:NotesDocumentCollection;
	
	if (db.isOpen() == false) db.open();
	
	colResultados = db.FTSearch(strQuery,0,8,512);
	return colResultados;
}


/*
Hace una búsqueda indexada en la base actual. Obtiene las bases históricas
y repite la búsqueda en cada una. El resultado final es un array de 
colecciones de documentos con los resultados de todas las búsquedas.
Parámetros:
** strQuery: Query syntax o dato clave a buscar en una vista 
** strTipoBusqueda: Se tomará este parámetro como el nombre de la vista en donde buscar
	la clave, que vendrá en el parámetro strQuery. NO SE TOMARÁ COMO VISTA para hacer lookup
	si el parámetro recibe alguna de estas opciones (hará un FTI)    
	-ftiProductiva: buscará en la base actual con query syntax(strQuery)
	-ftiHistorica: buscará en las bases historicas con query syntax(strQuery)
	-ftiCompleto: buscará en la base actual e Históricas con query syntax(strQuery)
*/
function multiFTSearch(strQuery:String, strTipoBusqueda:String):Array {
	var colResultadosArray:Array = new Array();
	var colTemp:NotesDocumentCollection;
	var db:NotesDatabase;
	var strServer:String;
	var strDBPath:String;

	// Abre la base actual de Propuestas
	strServer = session.createName(database.getServer()).getCommon();
	strDBPath = applicationScope.get("urlNavegador");
	strDBPath = strDBPath.substr(strDBPath.indexOfIgnoreCase(strServer) + strServer.length() + 1);
	
	db = session.getDatabase(database.getServer(), strDBPath);
	//print("function multiFTSearch strQuery:" + strQuery);
	//print("function multiFTSearch strTipoBusqueda:" + strTipoBusqueda);
	if(strTipoBusqueda.equals("ftiProductiva") || strTipoBusqueda.equals("ftiHistorica") || strTipoBusqueda.equals("ftiCompleto")){
		if(strTipoBusqueda.equals("ftiProductiva") || strTipoBusqueda.equals("ftiCompleto")){
			// Búsqueda indexada en la base actual
			colTemp = ftSearchBase(db, strQuery);
			if (colTemp.getCount() > 0) {
				colResultadosArray.push(colTemp);
			}
		}// fin if productiva o completo
			
		if(strTipoBusqueda.equals("ftiHistorica") || strTipoBusqueda.equals("ftiCompleto")){
			var dbHistorica:NotesDatabase;
			var strHisto:String;
			var strPath:String;
			var intIndex;
		
			// Toma la ubicación del directorio de bases históricas
			var docProfile:NotesDocument = getDbCfg().getProfileDocument ("f.p.ConfiguracionAgentes", "");
			if(docProfile != null){
				var strHisto = docProfile.getItemValueString("cfgAg_PathHistoricas_des");
			}
		
			if (strHisto.isEmpty() == false) {
				// Recorre las bases históricas en las que se debe buscar
				var db_Directory:NotesDbDirectory = session.getDbDirectory(database.getServer());
		
				dbHistorica = db_Directory.getFirstDatabase(NotesDbDirectory.DATABASE);
			
				while(dbHistorica != null){
					//Revisa que la base esté en el directorio deseado
					strPath = dbHistorica.getFilePath();
					intIndex = strPath.indexOf(strHisto);
			
					// Si la base existe, pero no está en el directorio deseado, busca otra porque no me sirve
					while(dbHistorica != null && (intIndex == -1 || (intIndex != -1 && strPath.substr(intIndex+strHisto.length()).indexOf("\\") != -1))) {
						dbHistorica = db_Directory.getNextDatabase();
			
						if (dbHistorica != null) {
							strPath = dbHistorica.getFilePath();
							intIndex = strPath.indexOf(strHisto);
						}
					}
			
					if (dbHistorica != null){
						// Búsqueda indexada en la base histórica
						colTemp = ftSearchBase(dbHistorica, strQuery);
			
						if (colTemp.getCount() > 0) {
							colResultadosArray.push(colTemp);
						}
						dbHistorica = db_Directory.getNextDatabase();
					}
				}
			}
		}// fin if Historica o completo
	}else{//lookup en vistas
		colTemp = getCollectionByKey(db, strTipoBusqueda, strQuery);
		if(strTipoBusqueda.equals("VLK_SearchPatente")){
			//Busqueda por Patente: la vista me devuelve el Unid del doc propuesta
			if (colTemp.getCount() > 0) {
				var strUnid:String = colTemp.getFirstDocument().getItemValueString("idPadre_cod")
				colTemp = getCollectionByKey(db, "v.Sys.Prop.Unid", strUnid);
			}
			
			
		}
		if (colTemp.getCount() > 0) {
			colResultadosArray.push(colTemp);
		}
	}// fin if Productiva, Historica o completo
	return colResultadosArray;
}


/* La función recibe cómo parámetro un array con colecciones de documentos.
 * Lee todos los documentos para tomar algunos campos.
 * Con la información de cada documento arma un array.
 * Transforma ese array al formato json.
 * Guarda el resultado final en una variable viewScope */
function docsToJSon(colPropArray:Array) {
	
	var colProp:NotesDocumentCollection;
	var docProp:NotesDocument;
	var jsonData:Array = new Array();

	// Recorre todas las colecciones del array
	for (i=0; i<colPropArray.length; i++) {
		colProp = colPropArray[i];
		
		if (colProp.getCount() > 0){
			// Recorre los documentos de la colección
			docProp = colProp.getFirstDocument();
			while (docProp != null) {
				var datosDoc = {};
				
				datosDoc.sol_idPropuesta_cod = docProp.getItemValueString("idPropuesta_cod");
				datosDoc.sol_pathDb = docProp.getParentDatabase().getFilePath();
				datosDoc.orden_nro = docProp.getItemValueInteger("orden_nro").toString();
				datosDoc.sol_articulo_cod = docProp.getItemValueString("sol_articulo_cod");
				datosDoc.sol_poliza_nro = docProp.getItemValueInteger("sol_poliza_nro");
				datosDoc.sol_status_cod = getStatusLabel(docProp.getItemValueString("sol_status_cod"));
				datosDoc.sol_productor = docProp.getItemValueString("sol_productor_cod") + " - " + docProp.getItemValueString("sol_productor_des"); //sol_productor_cod + " - " + sol_productor_des
				datosDoc.sol_asegurado_des = docProp.getItemValueString("sol_asegurado_des");
				datosDoc.sol_tipoOperacion_des = docProp.getItemValueString("sol_tipoOperacion_des");
				datosDoc.sol_cotizacion_nro = docProp.getItemValueInteger("sol_cotizacion_nro");
				
				jsonData.push(datosDoc);
				docProp = colProp.getNextDocument(docProp);
			}
		}
	}
	viewScope.put("searchFTIdata", toJson(jsonData));
}

function docsToJSonInsp(colInspArray:Array) {
	
	var colInsp:NotesDocumentCollection;
	var docInsp:NotesDocument;
	var jsonData:Array = new Array();
	
	// Recorre todas las colecciones del array
	for (i=0; i<colInspArray.length; i++) {
		colInsp = colInspArray[i];
		
		if (colInsp.getCount() > 0){
			// Recorre los documentos de la colección
			docInsp = colInsp.getFirstDocument();
			while (docInsp != null) {
				var datosDoc = {};
				
				datosDoc.ins_idInsp_cod = docInsp.getUniversalID();
				datosDoc.ins_Consecutivo_des = docInsp.getItemValueString("ins_Consecutivo_des");
				datosDoc.ins_pathDb = docInsp.getParentDatabase().getFilePath();
				datosDoc.ins_Prop_nro = docInsp.getItemValueInteger("ins_Prop_nro").toString();
				datosDoc.ins_Aseg_des = docInsp.getItemValueString("ins_Aseg_des");
				datosDoc.ins_iEst_des = getStatusLabelInsp(docInsp.getItemValueString("ins_iEst_cod"));
				datosDoc.ins_productor = docInsp.getItemValueString("ins_Prod_cod") + " - " + docInsp.getItemValueString("ins_Prod_des"); //sol_productor_cod + " - " + sol_productor_des
				
				jsonData.push(datosDoc);
				docInsp = colInsp.getNextDocument(docInsp);
			}
		}
	}
	viewScope.put("searchFTIdata", toJson(jsonData));
}