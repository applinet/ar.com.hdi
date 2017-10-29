package ar.com.hdi.autos.utilidades;

import java.io.Serializable;
import java.util.Vector;

import lotus.domino.Database;
import lotus.domino.Document;
import lotus.domino.NotesException;
import lotus.domino.RichTextItem;
import lotus.domino.Session;
import lotus.domino.View;

public class MailingConfig implements Serializable {

	private static final long serialVersionUID = 1L;

	public MailingConfig() {
		// Constructor vacio
	}

	public Database dbConfig;
	public View viewMailingConfig;
	public Document docMailConfig;
	public String strMailCat, strAction, strClave, strCode, strNombre, strEnabled, strCondicionesFormula;

	public String strFromFormula, strAsuntoFormula, strCuerpoPlanoFormula;
	public RichTextItem rtCuerpo, rtFirma;
	public String strCuerpoUbic, strIncluirNotesLink, strIncluirNotesLinkTxt, strIncluirAdjunto, strSendToFormula,
			strCopyToFormula, strBlindCopyToFormula;
	public boolean booIncluirNotesLink;

	public Vector<String> vecSendTo;
	public Vector<String> vecCopyTo;
	public Vector<String> vecBlindCopyTo;

	public boolean booEnabled, booCumpleCondiciones;

	public Vector<String> vecFromFResult;
	public Vector<String> vecAsuntoFResult;
	public Vector<String> vecCuerpoPlanoFResult;
	public String strCuerpoPlano;

	public Vector<String> vecSendToFResult;
	public Vector<String> vecCopyToResult;
	public Vector<String> vecBlindCopyToFResult;

	public Vector<String> vecAllSendTo;
	public Vector<String> vecAllCopyTo;
	public Vector<String> vecAllBlindCopyTo;

	public Integer intDestinatariesCount;
	public boolean booIsValid;

	// Getters & Setters

	public String getStrMailCat() {
		return strMailCat;
	}

	public void setStrMailCat(String strMailCat) {
		this.strMailCat = strMailCat;
	}

	public String getStrClave() {
		return strClave;
	}

	public void setStrClave(String strClave) {
		this.strClave = strClave;
	}

	public String getStrCode() {
		return strCode;
	}

	public void setStrCode(String strCode) {
		this.strCode = strCode;
	}

	public String getStrNombre() {
		return strNombre;
	}

	public void setStrNombre(String strNombre) {
		this.strNombre = strNombre;
	}

	public boolean isBooEnabled() {
		return booEnabled;
	}

	public void setBooEnabled(boolean booEnabled) {
		this.booEnabled = booEnabled;
	}

	public String getStrCondicionesFormula() {
		return strCondicionesFormula;
	}

	public void setStrCondicionesFormula(String strCondicionesFormula) {
		this.strCondicionesFormula = strCondicionesFormula;
	}

	public boolean isBooCumpleCondiciones() {
		return booCumpleCondiciones;
	}

	public void setBooCumpleCondiciones(boolean booCumpleCondiciones) {
		this.booCumpleCondiciones = booCumpleCondiciones;
	}

	public boolean isBooIncluirNotesLink() {
		return booIncluirNotesLink;
	}

	public void setBooIncluirNotesLink(boolean booIncluirNotesLink) {
		this.booIncluirNotesLink = booIncluirNotesLink;
	}

	public String getStrIncluirNotesLinkTxt() {
		return strIncluirNotesLinkTxt;
	}

	public void setStrIncluirNotesLinkTxt(String strIncluirNotesLinkTxt) {
		this.strIncluirNotesLinkTxt = strIncluirNotesLinkTxt;
	}

	public Vector<String> getVecFromFResult() {
		return vecFromFResult;
	}

	public void setVecFromFResult(Vector<String> vecFromFResult) {
		this.vecFromFResult = vecFromFResult;
	}

	public Vector<String> getVecAsuntoFResult() {
		return vecAsuntoFResult;
	}

	public void setVecAsuntoFResult(Vector<String> vecAsuntoFResult) {
		this.vecAsuntoFResult = vecAsuntoFResult;
	}

	public String getStrCuerpoPlano() {
		return strCuerpoPlano;
	}

	public void setStrCuerpoPlano(String strCuerpoPlano) {
		this.strCuerpoPlano = strCuerpoPlano;
	}

	public RichTextItem getRtCuerpo() {
		return rtCuerpo;
	}

	public void setRtCuerpo(RichTextItem rtCuerpo) {
		this.rtCuerpo = rtCuerpo;
	}

	public String getStrCuerpoUbic() {
		return strCuerpoUbic;
	}

	public void setStrCuerpoUbic(String strCuerpoUbic) {
		this.strCuerpoUbic = strCuerpoUbic;
	}

	public RichTextItem getRtFirma() {
		return rtFirma;
	}

	public void setRtFirma(RichTextItem rtFirma) {
		this.rtFirma = rtFirma;
	}

	public Vector<String> getVecAllSendTo() {
		return vecAllSendTo;
	}

	public void setVecAllSendTo(Vector<String> vecAllSendTo) {
		this.vecAllSendTo = vecAllSendTo;
	}

	public Vector<String> getVecAllCopyTo() {
		return vecAllCopyTo;
	}

	public void setVecAllCopyTo(Vector<String> vecAllCopyTo) {
		this.vecAllCopyTo = vecAllCopyTo;
	}

	public Vector<String> getVecAllBlindCopyTo() {
		return vecAllBlindCopyTo;
	}

	public void setVecAllBlindCopyTo(Vector<String> vecAllBlindCopyTo) {
		this.vecAllBlindCopyTo = vecAllBlindCopyTo;
	}

	public Integer getIntDestinatariesCount() {
		return intDestinatariesCount;
	}

	public void setIntDestinatariesCount(Integer intDestinatariesCount) {
		this.intDestinatariesCount = intDestinatariesCount;
	}

	public boolean isBooIsValid() {
		return booIsValid;
	}

	public void setBooIsValid(boolean booIsValid) {
		this.booIsValid = booIsValid;
	}

	// Funcion para cargar objeto
	@SuppressWarnings( { "unchecked" })
	public MailingConfig newConfig(String strClave_prm, Document docTarget_prm) {
		MailingConfig myMailingConfig = new MailingConfig();
		Session thisSession;
		try {
			thisSession = ar.com.hdi.autos.utilidades.Util.getSessionAmgrXpage();
			Database currentDb = ar.com.hdi.autos.utilidades.Util.getCurrentDatabaseAmgrXpage();
			dbConfig = ar.com.hdi.autos.utilidades.Util.getDatabaseConfiguracion(thisSession, currentDb);
			viewMailingConfig = dbConfig.getView("v.Sys.Mail.Clave");
			docMailConfig = viewMailingConfig.getDocumentByKey(strClave_prm);

			myMailingConfig.setStrCode(docMailConfig.getItemValueString("mail_Codigo_des"));
			myMailingConfig.setStrNombre(docMailConfig.getItemValueString("mail_Nombre_des"));
			myMailingConfig.setBooEnabled(docMailConfig.getItemValueString("mail_Habilitado_des").equals("1") ? true
					: false);

			// MENSAJE
			strFromFormula = docMailConfig.getItemValueString("mail_From_des");
			strAsuntoFormula = docMailConfig.getItemValueString("mail_Asunto_des");
			strCuerpoPlanoFormula = docMailConfig.getItemValueString("mail_CuerpoPlano_des");

			myMailingConfig.setRtCuerpo((RichTextItem) docMailConfig.getFirstItem("mail_CuerpoEnr_des"));
			myMailingConfig.setStrCuerpoUbic(docMailConfig.getItemValueString("mail_CuerpoEnrUbic_opt"));
			myMailingConfig.setRtFirma((RichTextItem) docMailConfig.getFirstItem("mail_Firma_des"));
			myMailingConfig
					.setBooIncluirNotesLink(docMailConfig.getItemValueString("mail_LinkIncluir_des").equals("1") ? true
							: false);

			myMailingConfig.setStrIncluirNotesLinkTxt(docMailConfig.getItemValueString("mail_LinkIncluirTxt_des"));

			strIncluirAdjunto = docMailConfig.getItemValueString("mail_AdjIncluir_des");

			// DESTINATARIOS
			vecSendTo = docMailConfig.getItemValue("mail_SendTo_des");
			strSendToFormula = docMailConfig.getItemValueString("mail_SendToFormula_des");
			vecCopyTo = docMailConfig.getItemValue("mail_CopyTo_des");
			strCopyToFormula = docMailConfig.getItemValueString("mail_CopyToFormula_des");
			vecBlindCopyTo = docMailConfig.getItemValue("mail_BlindCopyTo_des");
			strBlindCopyToFormula = docMailConfig.getItemValueString("mail_BlindCopyToFormula_des");

			// CUMPLE CONDICIONES?
			myMailingConfig.setBooCumpleCondiciones(true);

			// CALCULO FORMULAS

			myMailingConfig.setVecFromFResult(ar.com.hdi.autos.utilidades.Util.evaluateFormula(strFromFormula,
					docTarget_prm));
			myMailingConfig.setVecAsuntoFResult(ar.com.hdi.autos.utilidades.Util.evaluateFormula(strAsuntoFormula,
					docTarget_prm));
			myMailingConfig.setStrCuerpoPlano(ar.com.hdi.autos.utilidades.Util.evaluateFormula(strCuerpoPlanoFormula,
					docTarget_prm).elementAt(0).toString());
			Vector vecSendToFResult = ar.com.hdi.autos.utilidades.Util.evaluateFormula(strSendToFormula, docTarget_prm);
			Vector vecCopyToResult = ar.com.hdi.autos.utilidades.Util.evaluateFormula(strCopyToFormula, docTarget_prm);
			Vector vecBlindCopyToFResult = ar.com.hdi.autos.utilidades.Util.evaluateFormula(strBlindCopyToFormula,
					docTarget_prm);
			myMailingConfig.setVecAllSendTo(ar.com.hdi.autos.utilidades.Util.mergeAndTrimVectors(vecSendTo,
					vecSendToFResult));
			myMailingConfig.setVecAllCopyTo(ar.com.hdi.autos.utilidades.Util.mergeAndTrimVectors(vecCopyTo,
					vecCopyToResult));
			myMailingConfig.setVecAllBlindCopyTo(ar.com.hdi.autos.utilidades.Util.mergeAndTrimVectors(vecBlindCopyTo,
					vecBlindCopyToFResult));

			// Calculo datos varios
			myMailingConfig.setIntDestinatariesCount(myMailingConfig.getVecAllSendTo().size()
					+ myMailingConfig.getVecAllCopyTo().size() + myMailingConfig.getVecAllBlindCopyTo().size());

			myMailingConfig.setBooIsValid(myMailingConfig.getVecAsuntoFResult().elementAt(0).equals("") ? false : true);

		} catch (NotesException e) {
			e.printStackTrace();
		}
		return myMailingConfig;
	}

	public void sendMailWithCfg(MailingConfig myMailConfig, Document docTarget_param) throws NotesException {
		Database currentDb = ar.com.hdi.autos.utilidades.Util.getCurrentDatabaseAmgrXpage();
		Document newMail;
		RichTextItem rtBody;
		if (myMailConfig.booEnabled == false)
			return;
		if (myMailConfig.booCumpleCondiciones == false)
			return;
		if (myMailConfig.intDestinatariesCount < 1)
			return;
		if (myMailConfig.booIsValid = false)
			return;
		try {
			newMail = currentDb.createDocument();
			newMail.replaceItemValue("Form", "Memo");
			newMail.replaceItemValue("SendTo", myMailConfig.vecAllSendTo);
			newMail.replaceItemValue("CopyTo", myMailConfig.vecAllCopyTo);
			newMail.replaceItemValue("BlindCopyTo", myMailConfig.vecAllBlindCopyTo);
			newMail.replaceItemValue("From", myMailConfig.vecFromFResult);
			newMail.replaceItemValue("Principal", myMailConfig.vecFromFResult);
			newMail.replaceItemValue("Subject", myMailConfig.vecAsuntoFResult);
			rtBody = newMail.createRichTextItem("Body");
			if (myMailConfig.strCuerpoUbic.equals("1")) {
				rtBody.appendRTItem(myMailConfig.rtCuerpo);
			}
			rtBody.appendText(myMailConfig.strCuerpoPlano);

			if (myMailConfig.booIncluirNotesLink && (!docTarget_param.equals(null))
					&& docTarget_param.isNewNote() == false) {
				rtBody.appendText(myMailConfig.strIncluirNotesLinkTxt);
				rtBody.appendDocLink(docTarget_param, "");
			}

			if (myMailConfig.strCuerpoUbic.equals("2")) {
				rtBody.appendRTItem(myMailConfig.rtCuerpo);
			}

			rtBody.appendRTItem(myMailConfig.rtFirma);
			newMail.send(false);

		} catch (NotesException e) {
			e.printStackTrace();
		}
	}

}
