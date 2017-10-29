/*
 * EJEMPLO DE CLASE EN JS
 * 
 
 var MyClass = function (f, l){//constructor 
    //private members
    var firstName = f,
        lastName = l,
        fullName = function () { //fullName is a private function
            return firstName + " " + lastName;
        };
    return {
        //public members
        getFullName: fullName 
    };
}
 
 * 
 * 
 * */


var mailingConfig = function (strClave_param:String, strMailCat_param:String, strAction_param:String, docTarget_param:NotesDocument){ 
    
	//private members
	var dbConfig:NotesDatabase = getDbCfg ();
	var viewMailingConfig:NotesView = dbConfig.getView("v.Sys.Mail.Clave");
	var docMailConfig:NotesDocument = viewMailingConfig.getDocumentByKey(strClave_param);

	var strMailCat = strMailCat_param;
	var strAction = strAction_param;
	var strClave = strClave_param;

	//MAILING
	var strCode:String = docMailConfig.getItemValueString("mail_Codigo_des");
	var strNombre:String = docMailConfig.getItemValueString("mail_Nombre_des");
	var strEnabled:String = docMailConfig.getItemValueString("mail_Habilitado_des");
	var strCondicionesFormula:String = docMailConfig.getItemValueString("mail_Condiciones_des");
	

	//MENSAJE
	var strFromFormula:String = docMailConfig.getItemValueString("mail_From_des");
	var strAsuntoFormula:String = docMailConfig.getItemValueString("mail_Asunto_des");
	var strCuerpoPlanoFormula:String = docMailConfig.getItemValueString("mail_CuerpoPlano_des");
	var rtCuerpo:NotesRichText = docMailConfig.getFirstItem("mail_CuerpoEnr_des");
	var strCuerpoUbic:String = docMailConfig.getItemValueString("mail_CuerpoEnrUbic_opt");
	var rtFirma:NotesRichText = docMailConfig.getFirstItem("mail_Firma_des");
	var strIncluirNotesLink:String = docMailConfig.getItemValueString("mail_LinkIncluir_des");
	var booIncluirNotesLink = false;
	if (strIncluirNotesLink.equals ("1")) booIncluirNotesLink = true;
	var strIncluirNotesLinkTxt:String = docMailConfig.getItemValueString("mail_LinkIncluirTxt_des");

	//DESTINATARIOS
	var vecSendTo:Vector = docMailConfig.getItemValue("mail_SendTo_des");
	var strSendToFormula:String = docMailConfig.getItemValueString("mail_SendToFormula_des");
	var vecCopyTo:Vector = docMailConfig.getItemValue("mail_CopyTo_des");
	var strCopyToFormula:String = docMailConfig.getItemValueString("mail_CopyToFormula_des");
	var vecBlindCopyTo:Vector = docMailConfig.getItemValue("mail_BlindCopyTo_des");
	var strBlindCopyToFormula:String = docMailConfig.getItemValueString("mail_BlindCopyToFormula_des");
	
	//HABILITADO ?
	var booEnabled = false;
	if (strEnabled.equals ("1")) booEnabled = true;
	
	//CUMPLE CONDICIONES?
	var booCumpleCondiciones = evaluateFormulaBoolean(strCondicionesFormula, docTarget_param);;
	
	//CALCULO FORMULAS
	var vecFromFResult:Vector = evaluateFormula (strFromFormula, docTarget_param);
	var vecAsuntoFResult:Vector = evaluateFormula (strAsuntoFormula, docTarget_param);
	var vecCuerpoPlanoFResult:Vector = evaluateFormula (strCuerpoPlanoFormula, docTarget_param);
	var strCuerpoPlano:String = vecCuerpoPlanoFResult.elementAt (0);
	
	var vecSendToFResult:Vector = evaluateFormula (strSendToFormula, docTarget_param);
	var vecCopyToResult:Vector = evaluateFormula (strCopyToFormula, docTarget_param);
	var vecBlindCopyToFResult:Vector = evaluateFormula (strBlindCopyToFormula, docTarget_param);
	
	var vecAllSendTo:Vector = mergeAndTrimVectors (vecSendTo, vecSendToFResult);
	var vecAllCopyTo:Vector = mergeAndTrimVectors (vecCopyTo, vecCopyToResult);
	var vecAllBlindCopyTo:Vector = mergeAndTrimVectors (vecBlindCopyTo, vecBlindCopyToFResult);
	
	//Calculo datos varios
	var intDestinatariesCount = vecAllSendTo.size() + vecAllCopyTo.size() + vecAllBlindCopyTo.size();
	var booIsValid:boolean = true;
	
	if (vecAsuntoFResult.elementAt (0).equals ("")) booIsValid = false;
        
    return {
        //public members
    	getAction: strAction,
    	getMailCat: strMailCat,
    	getClave: strClave,
        getCode: strCode,
        getNom: strNombre,
        isEnabled: booEnabled,
        getCondicionesFormula: strCondicionesFormula,
        cumpleCondiciones: booCumpleCondiciones,
        incluirNotesLink: booIncluirNotesLink,
        getIncluirNotesLinkTxt: strIncluirNotesLinkTxt,
        
        getFrom: vecFromFResult,
        getAsunto: vecAsuntoFResult,
        getCuerpoPlano: strCuerpoPlano,
        getCuerpo: rtCuerpo,
        getCuerpoUbic: strCuerpoUbic,
        getFirma: rtFirma,
        
        getSendTo: vecAllSendTo, 
        getCopyTo: vecAllCopyTo, 
        getBlindCopyTo: vecAllBlindCopyTo,
        
        getDestinatariesCount: intDestinatariesCount,
        isValid: booIsValid
    };
}


/*
 * strClave_param		Es la clave por la cual se va a buscar la configuración del mail a enviar
 * booSave_param		si es TRUE, va a grabar el mail enviado.
 * strMailCat_param		Este String será grabado en el campo MyMailCat, y así se pueden agrupar los mails
 * 						enviados usando algun criterio.
 * 						No aplica si booSave_param es FALSE.
 * docTarget_param		Es el documento sobre el cual va a trabajar la función para evaluar las @Formulas
 * 						de la configuración del mailing.  Puede ser NULL.
 * */
function sendMailWithCfg (strClave_param:String, booSave_param:boolean, strMailCat_param:String, strAction_param:String, docTarget_param:NotesDocument) {
	
	var myMailConfig = mailingConfig (strClave_param, strMailCat_param, strAction_param, docTarget_param);
	if (myMailConfig.isEnabled == false) return false;
	if (myMailConfig.cumpleCondiciones == false) return false;
	if (myMailConfig.getDestinatariesCount < 1) return false; 
	if (myMailConfig.isValid == false) return false;
	
	var newMail:NotesDocument = getDbMails().createDocument();
	
	//CAMPOS DE MAILING
	newMail.replaceItemValue("Form", "Memo");
	newMail.replaceItemValue("SendTo", myMailConfig.getSendTo);
	newMail.replaceItemValue("CopyTo", myMailConfig.getCopyTo);
	newMail.replaceItemValue("BlindCopyTo", myMailConfig.getBlindCopyTo);
	newMail.replaceItemValue("From", myMailConfig.getFrom);
	newMail.replaceItemValue("Principal", myMailConfig.getFrom);
	newMail.replaceItemValue("Subject", myMailConfig.getAsunto);
	
	var rtBody = newMail.createRichTextItem("Body");
	if (myMailConfig.getCuerpoUbic.equals ("1")) rtBody.appendRTItem(myMailConfig.getCuerpo);
	rtBody.appendText(myMailConfig.getCuerpoPlano);
	
	if (myMailConfig.incluirNotesLink && docTarget_param != null && docTarget_param.isNewNote() == false) { 
		rtBody.appendText(myMailConfig.getIncluirNotesLinkTxt);
		rtBody.appendDocLink(docTarget_param);
	}
	
	if (myMailConfig.getCuerpoUbic.equals ("2")) rtBody.appendRTItem(myMailConfig.getCuerpo);
	rtBody.appendRTItem(myMailConfig.getFirma)
		
	//CAMPOS PERSONALIZADOS
	
	newMail.replaceItemValue("MyMailAction", strAction_param);
	newMail.replaceItemValue("MyMailConfigCode", myMailConfig.getCode);
	newMail.replaceItemValue("MyMailClave", strClave_param);
	newMail.replaceItemValue("MyMailNombre", myMailConfig.getNom);
	newMail.replaceItemValue("MyMailCondiciones", myMailConfig.getCondicionesFormula);
	newMail.replaceItemValue("MyMailSentDate", session.createDateTime(new Date()));
	
	linkMailWithDoc (newMail, strMailCat_param, booSave_param, true, false);
	
	
			
	return true;
}


/**
 * docMail_param		El documento docMail como un mail.
 * strMailCat_param 	Categoría para el mail
 * booSave_param		si es TRUE graba el doc
 * booSend_param		si es TRUE envia el doc.
 * booMost_param		si es TRUE setea un campo para identificar que el mail estaba en el mostrador.
 * 
 * No Vas a necesitar enviar el mail, cuando es un mail recibido.
 * Usualmente vas a grabar el mail, pero por si acaso el parámetro. 
 */
function linkMailWithDoc (docMail_param:NotesDocument, strMailCat_param:String, booSave_param:boolean, booSend_param:boolean, booMost_param:boolean){
	
	if (booMost_param) docMail_param.replaceItemValue("MyMailMostrador", "1");
	else docMail_param.replaceItemValue("MyMailMostrador", "0");
	docMail_param.replaceItemValue("MyMailCode", session.evaluate("@Unique"));
	docMail_param.replaceItemValue("MyMailCat", strMailCat_param);
	if (booSend_param) docMail_param.send();
	docMail_param.replaceItemValue("Form", "MemoLinked");
	if (booSave_param) docMail_param.save();
	
}


/*
 * Todos los mails asociados a un documento, tienen la misma categoría.
 * Le pasas la categoría y te desVincula a todos los que coinciden con ese
 * criterio de busqueda.
 * */
function removeMailLinks (strCat_param:String):boolean{
	
	var vMails:NotesView = getDbMails ().getView ("v.Sys.MailsLinked");
	var doccMatchings:NotesDocumentCollection = vMails.getAllDocumentsByKey(strCat_param);
	var docMail:NotesDocument = doccMatchings.getFirstDocument();

	while (docMail != null) {
		removeLink (docMail);
		docMail = doccMatchings.getNextDocument(docMail);
	}
	return true;
}

function removeLink (docMail_param:NotesDocument) {
	var strCat:String = docMail_param.getItemValueString("MyMailCat");

	docMail_param.replaceItemValue("MyMailLog_RemoveLink", @Text (@Now ()) + " - Desvinculado de " + strCat);
	docMail_param.replaceItemValue("MyMailCatOld", strCat);
	docMail_param.replaceItemValue("MyMailCat", "");
	
	//Si estaba en el mostrador, que vuelva
	if (docMail_param.getItemValueString("MyMailMostrador").equals("1")) {
		docMail_param.replaceItemValue("Form", "Mail");
	}
	else docMail_param.replaceItemValue("Form", "MemoNotLinked");
	docMail_param.save(false, false);
}

function evaluateFormula (strFormula_param:String, docTarget_param:NotesDocument):Vector {
	if (!strFormula_param.equals ("")) {
		if (docTarget_param != null) return session.evaluate(strFormula_param, docTarget_param);
		else return session.evaluate(strFormula_param);
	}
	//return new new java.util.Vector("");
	//La linea de arriba no anda, con la de abajo consigui lo mismo ya que el campo no existe
	var vecNew:Vector = currentDocument.getDocument().getItemValue("CualquierCosa");
	vecNew.add ("");
	return vecNew;
}
function evaluateFormulaBoolean (strFormula_param:String, docTarget_param:NotesDocument):boolean {

	var vecResult:Vector = evaluateFormula (strFormula_param, docTarget_param);
	if (vecResult.isEmpty()) return true;
	if (vecResult.elementAt (0).toString().equals ("0")) return false;
	return true;

}
function mergeAndTrimVectors (vec1:Vector, vec2:Vector) {
	vec1.addAll (vec2);

	var i:int;

	for (i=0; i<vec1.size();i++) {
		if (vec1.elementAt(i).equals("")) {
			vec1.removeElementAt (i);
			i--;
		}
	}

	return vec1;
}
function getLinkInUrl(){
	print ("getLinkInUrl");
	dBar.info( "geturl=" + context.getUrl());
	var strPrevia:String = context.getUrlParameter("Previa");
	var strProductor:String = context.getUrlParameter("Productor");
	var strMail:String = context.getUrlParameter("Mail");
	dBar.info( "Mail=" + strMail);
	return strPrevia + strProductor + strMail
}

function getMailUnid() {
	
	var strUnid:String = viewScope.get("selectedEmailUNID");

	if (strUnid == null || strUnid.equals ("")) {
		strUnid = context.getUrlParameter("Previa");
	}
	if (strUnid == null || strUnid.equals ("")) {
		strUnid = context.getUrlParameter("Productor");
	}
	if (strUnid == null || strUnid.equals ("")) {
		strUnid = context.getUrlParameter("Mail");
	}
	
	return strUnid;
	
}