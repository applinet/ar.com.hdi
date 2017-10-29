package ar.com.hdi.autos.webservice;

import java.io.IOException;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Vector;

import lotus.domino.Database;
import lotus.domino.Document;
import lotus.domino.DocumentCollection;
import lotus.domino.NotesException;
import lotus.domino.Session;
import lotus.domino.View;
import ar.com.hdi.autos.connect.GetArrayFromQueryAS400;
import ar.com.hdi.autos.utilidades.LogError;

import com.ibm.commons.util.io.json.JsonException;
import com.ibm.commons.util.io.json.JsonGenerator;
import com.ibm.commons.util.io.json.JsonJavaFactory;

public class InspPolPat implements Serializable {

	private static final long serialVersionUID = 1L;

	@SuppressWarnings("unchecked")
	public static String getDocAsJSON(String clave, String strRama_prm, String strPoliza_prm, String strPatente_prm)
			throws NotesException, JsonException, IOException {
		/*
		 * Version de Test, para que Zamba Haga las pruebas Se busca directamente las Inspecciones por Patente
		 */
		GetArrayFromQueryAS400 jce = new ar.com.hdi.autos.connect.GetArrayFromQueryAS400();
		ArrayList<String> ramasAutos = jce.getSelectAS("solTB_RAME");
		if (!ramasAutos.contains(strRama_prm))
			return "[{\"ErrMsg\":\"Las ramas habilitadas son:" + ramasAutos.toString() + " y se ha recibido rama:"
					+ strRama_prm + "\"}]";

		Vector vecLabel = null;
		Vector vecField = null;
		Vector vecResultLabel = null;
		Vector vecResultField = null;
		String strMsgProfile = "";
		String strPalabraClave = "";

		// INI - Para resolver la llamada desde un agente
		Session session = null;
		Database currentDb = null;
		try {
			session = ar.com.hdi.autos.utilidades.Util.getSessionAmgrXpage();
			currentDb = session.getCurrentDatabase();
			View currentDbProfileView = currentDb.getView("Configuracion");
			Document docUbicTablas = currentDbProfileView.getDocumentByKey("Configuracion");
			String server = docUbicTablas.getItemValueString("conf_server");
			String path = docUbicTablas.getItemValueString("conf_path");
			Database dbTablas = session.getDatabase(server, path);

			View viewConexiones = dbTablas.getView("v.Sys.ODBC");
			Document documentProfile = viewConexiones.getDocumentByKey(clave);

			// Obtengo los campos de profile
			vecLabel = documentProfile.getItemValue("odbc_wsCamposLabel_des");
			vecField = documentProfile.getItemValue("odbc_wsCamposField_des");
			strMsgProfile = documentProfile.getItemValueString("odbc_MsgConsole_des");
			strPalabraClave = documentProfile.getItemValueString("odbc_select_des");

		} catch (NotesException e1) {
			e1.printStackTrace();
		}

		// FIN - Para resolver la llamada desde un agente
		loguear(clave, strMsgProfile, "----------- INICIO ------------");
		loguear(clave, strMsgProfile, clave + "=" + strRama_prm + "~" + strPoliza_prm + "~" + strPatente_prm);

		View view = currentDb.getView("v.Sys.Ins.vLK_Patente");// Vista por Patente
		View viewMailLinked = currentDb.getView("v.Sys.MailsLinked");// Vista mail asociados

		List<HashMap> arrOfHashMap1 = new ArrayList<HashMap>();

		DocumentCollection dc = view.getAllDocumentsByKey(strPatente_prm);
		if (dc.getCount() > 0) {
			Document docInsp = dc.getFirstDocument();
			Document tmpDoc;
			Document docPropuestaEncontrada = null;

			while (docInsp != null) {
				loguear(clave, strMsgProfile, "Inspeccion encontrada con esa Patente:"
						+ docInsp.getItemValueString("ins_Consecutivo_des"));

				tmpDoc = dc.getNextDocument(docInsp);
				if (docInsp.getItemValueString("ins_PropUnid_des") != ""
						|| String.valueOf(docInsp.getItemValueInteger("ins_Prop_nro")) != "") {
					Document docPropuesta = null;
					if (docInsp.getItemValueString("ins_PropUnid_des").equals("")) {
						View viewPropuestasPorNro = currentDb.getView("v.Sys.Prop.Cod");// Vista por SOLN
						docPropuesta = viewPropuestasPorNro.getDocumentByKey(String.valueOf(docInsp
								.getItemValueInteger("ins_Prop_nro")));
						loguear(clave, strMsgProfile, "Pruesta se busca por SOLN, porque no tenia unid relacionado");
					} else {
						docPropuesta = currentDb.getDocumentByUNID(docInsp.getItemValueString("ins_PropUnid_des"));
					}

					if (docPropuesta != null) {
						loguear(clave, strMsgProfile, "Propuesta relacionada a la insp Nro:"
								+ docPropuesta.getItemValueInteger("orden_nro"));
						docPropuestaEncontrada = buscarHistPorPoliza(docPropuesta, strPoliza_prm);

						if (docPropuestaEncontrada != null) {
							loguear(clave, strMsgProfile,
									"Encontre la poliza en la historia para arriba en la Prop. Nro:"
											+ String.valueOf(docPropuestaEncontrada.getItemValueInteger("orden_nro")));
							// Busco los mails relacionados a la Inspeccion
							// Filto los mails enviados, solo los recibidos
							DocumentCollection collMail = viewMailLinked.getAllDocumentsByKey(docInsp
									.getItemValueString("ins_Componente_cod"));
							loguear(clave, strMsgProfile, "Busco collecion de Mail asociados a Inspeccion con la key:"
									+ docInsp.getItemValueString("ins_Componente_cod"));
							loguear(clave, strMsgProfile, "Coleccion de mails encontrados=" + collMail.getCount());
							Document docMail = collMail.getFirstDocument();
							Document docMailTemp = null;
							HashMap<String, String> hMapDocProcesado;

							while (null != docMail) {
								docMailTemp = collMail.getNextDocument(docMail);
								Vector vecSendTo = docMail.getItemValue("SendTo");
								boolean booSendOut = false;

								Iterator it = vecSendTo.iterator();
								while (it.hasNext()) {
									if (it.next().toString().toLowerCase().contains(strPalabraClave)) {
										loguear(clave, strMsgProfile, "Mail senTo:" + vecSendTo.toString()
												+ " contiene la palabra " + strPalabraClave + " - unid:"
												+ docMail.getUniversalID());
										booSendOut = true;
									} else {
										loguear(clave, strMsgProfile, "Mail senTo:" + vecSendTo.toString()
												+ " NO contiene la palabra " + strPalabraClave + " - unid:"
												+ docMail.getUniversalID());
									}
								}

								if (booSendOut) {
									hMapDocProcesado = new HashMap<String, String>();
									loguear(clave, strMsgProfile,
											"SendTo contiene emision.Para generar url envio el mail unid:"
													+ docMail.getUniversalID());
									// Cargo Datos de la Inspeccion
									for (int i = 0; i < vecLabel.size(); i++) {
										// Recorro los campos del docConfiguracion
										vecResultLabel = session.evaluate(vecLabel.elementAt(i).toString(), docInsp);
										vecResultField = session.evaluate(vecField.elementAt(i).toString(), docInsp);
										hMapDocProcesado.put(vecResultLabel.elementAt(0).toString(), vecResultField
												.elementAt(0).toString());
									}
									// Cargo Datos del mail
									for (int i = 0; i < vecLabel.size(); i++) {
										// Recorro los campos del docConfiguracion
										vecResultLabel = session.evaluate(vecLabel.elementAt(i).toString(), docMail);
										vecResultField = session.evaluate(vecField.elementAt(i).toString(), docMail);
										if (!vecResultField.elementAt(0).toString().equals("")) {
											hMapDocProcesado.put(vecResultLabel.elementAt(0).toString(), vecResultField
													.elementAt(0).toString());
										}
									}

									hMapDocProcesado.put("Nro. de Poliza", strPoliza_prm);
									arrOfHashMap1.add(hMapDocProcesado);

									loguear(clave, strMsgProfile, "arrOfHashMap1:" + arrOfHashMap1.toString());

								}
								loguear(clave, strMsgProfile, "Loopeo Mail");
								docMail.recycle();
								docMail = docMailTemp;
							}
							loguear(clave, strMsgProfile, "Loopeo siguiente Inspeccion. ");
						}// if la poliza es igual
					}// if docPropuesta es nulo
				}// if la insp tiene id de propuesta
				docInsp.recycle();
				docInsp = tmpDoc;
			}
			dc.recycle();
		}
		loguear(clave, strMsgProfile, "----------- FIN ------------");
		return JsonGenerator.toJson(JsonJavaFactory.instanceEx, arrOfHashMap1);
	}

	private static Document buscarHistPorPoliza(Document docPropuesta, String strPoliza_prm) {
		try {
			Document docTemp = null;
			if (String.valueOf(docPropuesta.getItemValueInteger("sol_poliza_nro")).equals(strPoliza_prm)) {
				return docPropuesta;
			} else {
				if (docPropuesta.getItemValueString("idPadre_cod").equals("")) {
					return null;
				}

				docTemp = docPropuesta.getParentDatabase().getDocumentByUNID(
						docPropuesta.getItemValueString("idPadre_cod"));
				docPropuesta.recycle();
				if (docTemp == null) {
					return null;
				}
				return docPropuesta = buscarHistPorPoliza(docTemp, strPoliza_prm);
			}
		} catch (NotesException e) {
			return null;
		}
	}

	private static void loguear(String clave, String strMsgProfile, String desclog) {
		if (strMsgProfile.equals("2")) {
			LogError log = new LogError(clave, desclog);
			log.commitLog(log);
		} else if (strMsgProfile.equals("1")) {
			System.out.println(clave + "=" + desclog);
		}
	}

}
