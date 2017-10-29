var validateInsSave = function(){
	//FRP - Validar que exista un vehiculo cargado
	var booIsValid:boolean = true;
	if (!validateEmptyField ("ins_vehCobSol_cod1", "Por favor ingrese un vehiculo a inspeccionar")) {
		booIsValid = false;
	}
	if(document1.getItemValueString("ins_Tipo_cod") == "30"){ //Inspeccion de Productor
		if (!validateEmptyField ("sol_productor_cod", "Por favor seleccione el productor que realizó la inspección")) {
			booIsValid = false;
		}
		if (!validateEmptyField ("sol_asegurado_des", "El nombre del asegurado es un dato obligatorio.")) {
			booIsValid = false;
		}
	}
	
	return booIsValid;
}

function validateGeneral (docIns:NotesDocument) {
	var booIsValid:boolean = true;
	
	var controlHoraDesde = getComponent("ins_iHoraDesde_dat1");
	var controlHoraHasta = getComponent("ins_iHoraHasta_dat1");
	var controlFechaCombinada = getComponent("ins_iFecha_dat1");
		
	if (controlHoraDesde.getValue() > controlHoraHasta.getValue()) {
		postValidationError (controlHoraDesde, "La hora Desde no puede ser superior a la hora Hasta")
		booIsValid = false;
	}
	
	var dtHoy:java.util.Date = getHoySinHora ();
		
	if (controlFechaCombinada.getValue() != null) {
		var dtComb:java.util.Date = getFechaSinHora (controlFechaCombinada.getValue());
	
		//Si la fecha ingresada es anterior a HOY.
		if (dtComb.before (dtHoy)) {
			postValidationError (controlFechaCombinada, "La fecha combinada debe ser posterior a hoy")
			booIsValid = false;
		}
	}

	return booIsValid;
	
}

var validateInsAComercial = function(){
	if (!validateEmptyField ("ins_iProb_cod1", "Seleccione el tipo de Problema")) {
		return false;
	}
	return true;
}

var validateInsEnviar = function(){
	var booIsValid:boolean = true;
	
	/*var fldNames:Array = new Array ();
	var fldMsgs:Array = new Array ();
	
	fldNames [0] = "ins_iLugar_des1";
	fldMsgs [0] = "Ingrese un Lugar";
	
	for (i=0; i<fldNames.length; i++) {
		if (!validateEmptyField (fldNames[i], fldMsgs[i])) {
			booIsValid = false;
		}
	}*/
	
	//var control = getComponent("ins_iHoraDesde_des1");
	//postValidationError (control, "Siempre error");
	//booIsValid = false;
	
	if (!validateInspector()) booIsValid = false;
	else {
		//Si entra en este ELSE es porque ingresò el inspector.
		var insNom = document1.getItemValue("ins_Inspect_opt");
		if (@Trim (insNom.elementAt (0)).equals("") == false) {
			//Podria estar vacio si al insepctor lo ingresó en el campo libre.
			var vInspec:NotesView = getDbInspectores().getView ("People");
			var docInspec:NotesDocument = vInspec.getDocumentByKey(insNom);
			var strInspectorEnviar:String = docInspec.getItemValueString("InsEnviar_CT");
			
			if (strInspectorEnviar.equals("1")) {
				if (!validateInsEnviarEstVeh()) booIsValid = false;
			}	
				
		}
	}
	
		
	if (!validateEmptyField ("radioCoordInspectorSi", "Indique si la coordina el inspector")) {
		booIsValid = false;
	}
	else {
		var controlCoordIns = getComponent("radioCoordInspectorSi");
		var valCoordIns = controlCoordIns.getValue();
		if (valCoordIns.equals ("1")) {
			//La coordina el inspector, exigo que le envie algun mensaje.
			if (!validateEmptyField ("ins_inputComIns_des1", "Ingrese un Mensaje para el Inspector")) {
				booIsValid = false;
			}
		}
		else {
			//No la coordina el inspector, exigo que complete más información.
			if (!validateEmptyField ("ins_iFecha_dat1", "Ingrese una fecha combinada")) {
				booIsValid = false;
			}
		}
	}
	//FRP - Validar que exista un vehiculo cargado
	if (!validateEmptyField ("ins_vehCobSol_cod1", "Por favor ingrese un vehiculo a inspeccionar")) {
		booIsValid = false;
	}
	
	if (booIsValid) {
		if (validateGeneral(document1.getDocument()) == false) booIsValid = false;
	}
		
		//var control = getComponent("ins_iHoraDesde_des1");
		//postValidationError (control, "Siempre error");
		//booIsValid = false;

	return booIsValid;
	
}


function validateInspector ():boolean {
	
	
	if (!validateEmptyField ("ins_Inspect_opt1", "Seleccionar el inspector")) {
		return false;
	}	
	
	return true;
}


function validateInsEnviarEstVeh ():boolean {
	//Sgte linea sale y no valida nada, estaba validando el vehiculo  
	//FPR 20140702 - No validar el vehiculo al inspeccionar
	return true;
	var strVeh:String = document1.getItemValueString("ins_Veh_cod");
	//Sgte linea comentada no anda porque no funciona con campos computados.
	//var control = getComponent("ins_Veh_cod1");
	var control = getComponent("ins_iHoraDesde_dat1");
	
	//Busca el Vehiculo Asociado
	var vVehiculos:NotesView = getDbVeh().getView ("v.Sys.Veh");
	var docVeh:NotesDocument = vVehiculos.getDocumentByKey(strVeh);
	if (docVeh == null) {
		return false;
		postValidationError (control, "El código de vehiculo no fue encontrado: " + strVeh)
	}
	
	//-Valida el estado del vehiculo 
	var strVehEstadoActual:String = docVeh.getItemValueString("veh_status_cod");
	var docInsProfile:NotesDocument = getDbCfg ().getProfileDocument ("f.p.InsCfg", "");
	var vecEstadosOK:Vector = docInsProfile.getItemValue("insCfg_ValVehEst_des");
			
	if (vecEstadosOK.indexOf (strVehEstadoActual) == -1) {
		postValidationError (control, "No puede enviar la inspección porque el vehiculo (Estado:" + strVehEstadoActual + ") no contiene un estado válido (" + vecEstadosOK.toString() + "): " + strVeh)
		return false;
	}
	
	return true;
}

var validateInsFinalizar = function(){
	var booIsValid:boolean = true;

	if (!validateEmptyField ("ins_iRtdo_cod1", "Seleccione el Resultado")) booIsValid = false;
	else {
		var strRtdo:String = document1.getItemValueString("ins_iRtdo_cod");
		if (strRtdo.equals ("30")) {
			//Si es No Realizado, validamos haya ingresado el motivo
			if (!validateEmptyField ("ins_iRtdoNoRea_cod1", "Seleccione el Motivo de No Realizado")) booIsValid = false;
		}
		if (strRtdo.equals ("10")) {
			//Si es Aprobada, debe indicar la Cobertura
			if (!validateEmptyField ("ins_iCobAprob_cod1", "Indique la Cobertura Aprobada")) booIsValid = false;
		}
		
	}

	//var control = getComponent("ins_iHoraDesde_des1");
	//postValidationError (control, "Siempre error");
	//booIsValid = false;

	return booIsValid;
}