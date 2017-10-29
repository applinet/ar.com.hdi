/*Agente para Refacturacion y Renovacion
 * Para Anulaciones y otros movimientos 
 * automáticos hay que revisar el código*/

package ar.com.hdi.autos.webservice;

import java.io.Serializable;
import java.net.URL;

import javax.xml.parsers.SAXParser;
import javax.xml.parsers.SAXParserFactory;

import lotus.domino.Database;
import lotus.domino.DateTime;
import lotus.domino.Document;
import lotus.domino.NotesException;
import lotus.domino.NotesFactory;
import lotus.domino.Session;
import lotus.domino.View;

import org.xml.sax.Attributes;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;
import org.xml.sax.helpers.DefaultHandler;

import ar.com.hdi.autos.propuestas.CreateDocsNuevaPropuesta;
import ar.com.hdi.autos.propuestas.NuevaPropuesta;
import ar.com.hdi.autos.utilidades.DocProfile;
import ar.com.hdi.autos.utilidades.JSFUtil;
import ar.com.hdi.autos.utilidades.LogError;

public class WsSupPol implements Serializable {

	private static final long serialVersionUID = 1L;

	@SuppressWarnings("unchecked")
	public static void comenzar(String clave, final lotus.domino.Document docProp) {
		DocProfile docProfile = null;
		// INI - Para resolver la llamada desde un agente
		Session session = null;
		Database currentDb = null;

		try {
			session = NotesFactory.createSession();
			currentDb = session.getCurrentDatabase();
			View currentDbProfileView = currentDb.getView("Configuracion");
			Document docUbicTablas = currentDbProfileView.getDocumentByKey("Configuracion");
			String server = docUbicTablas.getItemValueString("conf_server");
			String path = docUbicTablas.getItemValueString("conf_path");
			Database dbTablas = session.getDatabase(server, path);

			View viewConexiones = dbTablas.getView("v.Sys.ODBC");
			Document documentProfile = viewConexiones.getDocumentByKey(clave);
			docProfile = new DocProfile(documentProfile.getItemValueString("odbc_Con_cod"), documentProfile
					.getItemValueString("odbc_Tabla1_des"), documentProfile.getItemValueString("odbc_select_des"),
					documentProfile.getItemValueString("odbc_where_des"), documentProfile
							.getItemValue("odbc_queObtengo_des"), documentProfile
							.getItemValueString("odbc_MsgConsole_des"));

		} catch (NotesException e1) {
			if (e1.id == 4493) {
				try {
					docProfile = JSFUtil.getDocProfile(clave);
				} catch (NotesException e) {
					e.printStackTrace();
				}
			} else {
				System.out.println("errror no es el de siempre es el=" + e1.id);
			}
		}
		// FIN - Para resolver la llamada desde un agente

		try {
			docProfile.setStrWs(docProp);
			String strUrl = docProfile.getSelect();

			if (docProfile.getMsgConsola().equals("2")) {
				LogError log = new LogError("ar.com.hdi.autos", clave + "=" + strUrl);
				log.commitLog(log);
			} else if (docProfile.getMsgConsola().equals("1")) {
				System.out.println(clave + "=" + strUrl);
			}

			final String auxIdHijo_cod = (docProp.hasItem("auxIdHijo_cod")) ? docProp
					.getItemValueString("auxIdHijo_cod") : "";
			final String auxStatus_cod = (docProp.hasItem("auxStatus_cod")) ? docProp
					.getItemValueString("auxStatus_cod") : "";
			final String auxStatus_des = (docProp.hasItem("auxStatus_des")) ? docProp
					.getItemValueString("auxStatus_des") : "";
			final String web_icon_cod = (docProp.hasItem("web_icon_cod")) ? docProp.getItemValueString("web_icon_cod")
					: "";
			final String sol_tipoEmision_opt = (docProp.hasItem("sol_tipoEmision_opt")) ? docProp
					.getItemValueString("sol_tipoEmision_opt") : "0";
			final String sol_operacionSuplemento_nro = (docProp.hasItem("sol_operacionSuplemento_nro")) ? docProp
					.getItemValueString("sol_operacionSuplemento_nro") : "";

			String sol_operacionSuplemento_temp = ("000" + sol_operacionSuplemento_nro);
			final String sol_operacionSuplemento_a_procesar = sol_operacionSuplemento_temp.substring(
					sol_operacionSuplemento_temp.length() - 3, sol_operacionSuplemento_temp.length());

			SAXParserFactory factory = SAXParserFactory.newInstance();
			SAXParser saxParser = factory.newSAXParser();

			DefaultHandler handler = new DefaultHandler() {
				// Defino todas las variables a leer del xml
				String current_operacionSuplemento = "";
				boolean bsol_operacionSuplemento_nro = false;
				boolean bflagInicializacion = true;
				boolean bflagProcesarEsteSuplemento = false;
				boolean bflagSuplementoCero = false;
				boolean bfechaEnvio_nro = false;
				boolean bsol_tipoMovimiento_cod = false;
				boolean bsol_tipoOperacion_cod = false;
				boolean bsol_asegurado_cod = false;
				boolean bsol_asegurado_des = false;
				boolean bsol_productor_cod = false;
				boolean bsol_productor_des = false;
				boolean bsol_productorN3_cod = false;
				boolean bsol_productorN3_des = false;
				boolean bsol_productorN5_cod = false;
				boolean bsol_productorN5_des = false;
				boolean bsol_productorN6_cod = false;
				boolean bsol_productorN6_des = false;

				boolean b0FINI = false;
				boolean b0FVTO = false;
				boolean b0FHFA = false;
				boolean buFINI = false;
				boolean buFHFA = false;

				private DateTime s0FINI;
				private DateTime s0FVTO;
				private DateTime s0FHFA;
				private DateTime suFINI;
				private DateTime suFHFA;

				NuevaPropuesta myPropuesta;
				CreateDocsNuevaPropuesta myPropuestas = new CreateDocsNuevaPropuesta();

				@Override
				public void startElement(String uri, String localName, String qName, Attributes attributes)
						throws SAXException {
					// Recorre elemento a elemento cuando encuentra el tag la variable a true

					if (qName.equals("SUOP")) { // Si el tag es Suplemento
						bsol_operacionSuplemento_nro = (qName.equalsIgnoreCase("SUOP")) ? true : false;
					}

					if (bflagInicializacion) { // Inicializo los campos
						myPropuesta = new NuevaPropuesta();
						myPropuesta.setIdHijo_cod(auxIdHijo_cod);
						myPropuesta.setSol_status_cod(auxStatus_cod);
						myPropuesta.setSol_status_des(auxStatus_des);
						myPropuesta.setWeb_icon_cod(web_icon_cod);
						myPropuesta.setSol_tipoEmision_opt(sol_tipoEmision_opt);
						bflagInicializacion = false;
					}

					bfechaEnvio_nro = (qName.equalsIgnoreCase("FEMI") && bflagProcesarEsteSuplemento) ? true : false;
					bsol_tipoMovimiento_cod = (qName.equalsIgnoreCase("TIOU") && bflagProcesarEsteSuplemento) ? true
							: false;
					bsol_tipoOperacion_cod = (qName.equalsIgnoreCase("STOU") && bflagProcesarEsteSuplemento) ? true
							: false;
					bsol_asegurado_cod = (qName.equalsIgnoreCase("ASEN") && bflagProcesarEsteSuplemento) ? true : false;
					bsol_asegurado_des = (qName.equalsIgnoreCase("NASE") && bflagProcesarEsteSuplemento) ? true : false;
					bsol_productor_cod = (qName.equalsIgnoreCase("NIVC") && bflagProcesarEsteSuplemento) ? true : false;
					bsol_productor_des = (qName.equalsIgnoreCase("NPRO") && bflagProcesarEsteSuplemento) ? true : false;
					bsol_productorN3_cod = (qName.equalsIgnoreCase("NIV3") && bflagProcesarEsteSuplemento) ? true
							: false;
					bsol_productorN3_des = (qName.equalsIgnoreCase("NPR3") && bflagProcesarEsteSuplemento) ? true
							: false;
					bsol_productorN5_cod = (qName.equalsIgnoreCase("NIV5") && bflagProcesarEsteSuplemento) ? true
							: false;
					bsol_productorN5_des = (qName.equalsIgnoreCase("NPR5") && bflagProcesarEsteSuplemento) ? true
							: false;
					bsol_productorN6_cod = (qName.equalsIgnoreCase("NIV6") && bflagProcesarEsteSuplemento) ? true
							: false;
					bsol_productorN6_des = (qName.equalsIgnoreCase("NPR6") && bflagProcesarEsteSuplemento) ? true
							: false;
					b0FINI = (qName.equalsIgnoreCase("FINI") && bflagSuplementoCero) ? true : false;
					b0FVTO = (qName.equalsIgnoreCase("FVTO") && bflagSuplementoCero) ? true : false;
					b0FHFA = (qName.equalsIgnoreCase("FHFA") && bflagSuplementoCero) ? true : false;
					buFINI = (qName.equalsIgnoreCase("FINI") && !bflagSuplementoCero) ? true : false;
					buFHFA = (qName.equalsIgnoreCase("FHFA") && !bflagSuplementoCero) ? true : false;
				}

				@Override
				public void endElement(String uri, String localName, String qName) throws SAXException {
					if (qName.equals("Suplemento")) { // Cuando termina el tag de un suplemento
						// System.out.println("Finaliza el tag Suplemento");
						bflagProcesarEsteSuplemento = false;

					}
					if (qName.equals("Suplementos")) { // Cuando termina el tag Suplementos

						// ********** INI - PROCESO SEGUN TIPO DE OPERACION ****************
						// Los datos de las fechas los tengo antes que el tipo de movimiento por eso los proceso al final

						myPropuesta.setSol_vigenciaDesdeCabecera_nro(s0FINI); // --> es el mismo para todos los movimientos

						if (myPropuesta.getSol_tipoMovimiento_cod().equals("3")
								&& myPropuesta.getSol_tipoOperacion_cod().equals("11")) { // Endoso de Refacturacion
							myPropuesta.setSol_vigenciaHastaCabecera_nro(s0FVTO);
							myPropuesta.setSol_vigenciaDesdeOperacion_nro(suFINI);
							myPropuesta.setSol_vigenciaHastaOperacion_nro(s0FVTO);

						} else if (myPropuesta.getSol_tipoMovimiento_cod().equals("1")
								|| myPropuesta.getSol_tipoMovimiento_cod().equals("2")) { // Nuevas o Renovacion
							myPropuesta.setSol_vigenciaHastaCabecera_nro(s0FHFA);
							myPropuesta.setSol_vigenciaDesdeOperacion_nro(s0FINI);
							myPropuesta.setSol_vigenciaHastaOperacion_nro(s0FHFA);

						} else {// Resto de movimientos
							myPropuesta.setSol_vigenciaHastaCabecera_nro(suFHFA);
							myPropuesta.setSol_vigenciaDesdeOperacion_nro(suFINI);
							myPropuesta.setSol_vigenciaHastaOperacion_nro(suFHFA);

						}
						// ********** FIN - PROCESO SEGUN TIPO DE OPERACION ****************

						myPropuestas.AddPropuesta(myPropuesta); // Agrego el componente a la lista
						myPropuestas.commitToDb(true); // Grabo en la base
					}
				}

				@Override
				public void characters(char ch[], int start, int length) throws SAXException {

					if (bsol_operacionSuplemento_nro) {
						current_operacionSuplemento = new String(ch, start, length);
						// Cuando es el suplemento que necesito marco:
						// - bflagInicializacion = true --> Para generar el Objeto myPropuesta
						// - bflagProcesarEsteSuplemento = true -->Para leer los tags de este suplemento
						bflagProcesarEsteSuplemento = (current_operacionSuplemento
								.equals(sol_operacionSuplemento_a_procesar)) ? true : false;

						if (current_operacionSuplemento.equals("000")) {// Estoy en el suplemento cero
							bflagSuplementoCero = true;
						} else {
							bflagSuplementoCero = false;
						}

						bsol_operacionSuplemento_nro = false;
					}
					if (bfechaEnvio_nro) {
						myPropuesta.setFechaEnvio_nro(ar.com.hdi.autos.utilidades.Util.StringToNotesDateTime(
								new String(ch, start, length), "yyyyMMdd", "dd/MM/yyyy hh:mm"));
						myPropuesta.setFechaEmisionGaus_nro(myPropuesta.getFechaEnvio_nro());
						myPropuesta.setFechaEmisionReal_nro(myPropuesta.getFechaEnvio_nro());
						bfechaEnvio_nro = false;
					}

					if (bsol_tipoMovimiento_cod) {
						// Cargo las variables por parametros del doc inventado
						try {
							myPropuesta.setSol_rama_cod(docProp.getItemValueString("sol_rama_cod"));
							myPropuesta.setSol_articulo_cod(docProp.getItemValueString("sol_articulo_cod"));
							myPropuesta.setSol_poliza_nro(Integer
									.parseInt(docProp.getItemValueString("sol_poliza_nro")));
							myPropuesta.setSol_superpoliza_nro(Integer.parseInt(docProp
									.getItemValueString("sol_superpoliza_nro")));
							myPropuesta.setLog_des(docProp.getItemValueString("log_des"));
						} catch (NotesException e) {
							e.printStackTrace();
						}
						myPropuesta.setSol_tipoMovimiento_cod(new String(ch, start, length));
						bsol_tipoMovimiento_cod = false;
					}

					if (bsol_tipoOperacion_cod) {
						myPropuesta.setSol_tipoOperacion_cod(new String(ch, start, length));
						bsol_tipoOperacion_cod = false;
					}

					if (bsol_asegurado_cod) {
						myPropuesta.setSol_asegurado_cod(new String(ch, start, length));
						bsol_asegurado_cod = false;
					}

					if (bsol_asegurado_des) {
						StringBuilder currentText = new StringBuilder();
						currentText.append(ch, start, length);

						myPropuesta.setSol_asegurado_des(new String(ch, start, length));
						bsol_asegurado_des = false;
					}

					if (bsol_productor_cod) {
						myPropuesta.setSol_productor_cod(new String(ch, start, length));
						bsol_productor_cod = false;
					}

					if (bsol_productor_des) {
						myPropuesta.setSol_productor_des(new String(ch, start, length));
						bsol_productor_des = false;
					}

					if (bsol_productorN3_cod) {
						Integer intN3 = Integer.parseInt(new String(ch, start, length));
						if (!intN3.equals(0)) {
							myPropuesta.setSol_productorN3_cod(intN3.toString());
						}
						bsol_productorN3_cod = false;
					}

					if (bsol_productorN3_des) {
						String strN3 = new String(ch, start, length);
						if (!strN3.contains("*****")) {
							myPropuesta.setSol_productorN3_des(strN3);
						}
						bsol_productorN3_des = false;
					}

					if (bsol_productorN5_cod) {
						Integer intN5 = Integer.parseInt(new String(ch, start, length));
						if (!intN5.equals(0)) {
							myPropuesta.setSol_productorN5_cod(intN5.toString());
						}
						bsol_productorN5_cod = false;
					}

					if (bsol_productorN5_des) {
						String strN5 = new String(ch, start, length);
						if (!strN5.contains("*****")) {
							myPropuesta.setSol_productorN5_des(strN5);
						}
						bsol_productorN5_des = false;
					}

					if (bsol_productorN6_cod) {
						Integer intN6 = Integer.parseInt(new String(ch, start, length));
						if (!intN6.equals(0)) {
							myPropuesta.setSol_productorN6_cod(intN6.toString());
						}
						bsol_productorN6_cod = false;
					}

					if (bsol_productorN6_des) {
						String strN6 = new String(ch, start, length);
						if (!strN6.contains("*****")) {
							myPropuesta.setSol_productorN6_des(strN6);
						}
						bsol_productorN6_des = false;
					}

					if (b0FINI) {
						s0FINI = ar.com.hdi.autos.utilidades.Util.StringToNotesDateTime(new String(ch, start, length),
								"yyyyMMdd", "dd/MM/yyyy hh:mm");
						b0FINI = false;
					}

					if (b0FVTO) {
						s0FVTO = ar.com.hdi.autos.utilidades.Util.StringToNotesDateTime(new String(ch, start, length),
								"yyyyMMdd", "dd/MM/yyyy hh:mm");
						b0FVTO = false;
					}

					if (b0FHFA) {
						s0FHFA = ar.com.hdi.autos.utilidades.Util.StringToNotesDateTime(new String(ch, start, length),
								"yyyyMMdd", "dd/MM/yyyy hh:mm");
						b0FHFA = false;
					}

					if (buFINI) {
						suFINI = ar.com.hdi.autos.utilidades.Util.StringToNotesDateTime(new String(ch, start, length),
								"yyyyMMdd", "dd/MM/yyyy hh:mm");
						buFINI = false;
					}

					if (buFHFA) {
						suFHFA = ar.com.hdi.autos.utilidades.Util.StringToNotesDateTime(new String(ch, start, length),
								"yyyyMMdd", "dd/MM/yyyy hh:mm");
						buFHFA = false;
					}

				}
			};

			URL urlws = new URL(strUrl);
			InputSource is = new InputSource(urlws.openStream());
			is.setEncoding("ISO-8859-1");
			saxParser.parse(is, handler);

			// saxParser.parse(strUrl, handler);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

}
