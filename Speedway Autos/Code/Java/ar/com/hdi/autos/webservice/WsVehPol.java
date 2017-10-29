package ar.com.hdi.autos.webservice;

import java.io.Serializable;
import java.net.URL;

import javax.xml.parsers.SAXParser;
import javax.xml.parsers.SAXParserFactory;

import lotus.domino.Database;
import lotus.domino.Document;
import lotus.domino.NotesException;
import lotus.domino.NotesFactory;
import lotus.domino.Session;
import lotus.domino.View;

import org.xml.sax.Attributes;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;
import org.xml.sax.helpers.DefaultHandler;

import ar.com.hdi.autos.utilidades.DocProfile;
import ar.com.hdi.autos.utilidades.JSFUtil;
import ar.com.hdi.autos.utilidades.LogError;
import ar.com.hdi.autos.vehiculos.CreateDocsNuevoComponente;
import ar.com.hdi.autos.vehiculos.NuevoComponente;

public class WsVehPol implements Serializable {

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
			final String idPadre_cod = docProp.getUniversalID();
			final String tarifa = docProp.getItemValueString("tarifa");

			final String sol_tipoMovimiento_cod = (docProp.hasItem("sol_tipoMovimiento_cod")) ? docProp
					.getItemValueString("sol_tipoMovimiento_cod") : "";
			final String sol_tipoOperacion_cod = (docProp.hasItem("sol_tipoOperacion_cod")) ? docProp
					.getItemValueString("sol_tipoOperacion_cod") : "";

			// Para Renovaciones veh_spwvehABM_cod='A' y Refacturacion veh_spwvehABM_cod='M'
			String temp_veh_spwvehABM_cod;
			boolean booTempActualizarSumaAsegurada;
			if (sol_tipoMovimiento_cod.equals("2")) {
				temp_veh_spwvehABM_cod = "A";
				booTempActualizarSumaAsegurada = true;
			} else if (sol_tipoMovimiento_cod.equals("3") && sol_tipoOperacion_cod.equals("11")) {
				temp_veh_spwvehABM_cod = "M";
				booTempActualizarSumaAsegurada = true;
			} else {
				temp_veh_spwvehABM_cod = "";
				booTempActualizarSumaAsegurada = false;
			}
			final String veh_spwvehABM_cod = temp_veh_spwvehABM_cod;
			final boolean booActualizarSumaAsegurada = booTempActualizarSumaAsegurada;

			/*
			 * Para Renovaciones y Refacturacion veh_spwvehABM_cod='A' final String veh_spwvehABM_cod = sol_tipoMovimiento_cod.equals("2") ||
			 * (sol_tipoMovimiento_cod.equals("3") && sol_tipoOperacion_cod.equals("11")) ? "A" : "";
			 */
			SAXParserFactory factory = SAXParserFactory.newInstance();
			SAXParser saxParser = factory.newSAXParser();

			DefaultHandler handler = new DefaultHandler() {
				// Defino todas las variables a leer del xml
				boolean bveh_componente_nro = false;
				boolean bveh_marca_cod = false;
				boolean bveh_marca_des = false;
				boolean bveh_modelo_cod = false;
				boolean bveh_modelo_des = false;
				boolean bveh_submodelo_cod = false;
				boolean bveh_submodelo_des = false;
				boolean bveh_sumaAsegurada_nro = false;
				boolean bveh_sumaAseguradaActualizada_nro = false;
				boolean bveh_anio_nro = false;
				boolean bveh_motor_des = false;
				boolean bveh_patenteTipo_cod = false;
				boolean bveh_patente_des = false;
				boolean bveh_chasis_des = false;
				boolean bveh_cobertura_cod = false;
				boolean bveh_cobertura_des = false;
				boolean bveh_statusGaus_des = false;
				boolean bveh_franquiciaValor_nro = false;
				boolean bveh_franquiciaInforma_opt = false;
				boolean bveh_bonificaciones = false;
				boolean bveh_averias_opt = false;
				boolean bveh_gnc_opt = false;
				boolean bveh_tarifa_cod = false;
				boolean bveh_uso_cod = false;
				boolean bveh_zonaRiesgo_cod = false;
				boolean bveh_origen_opt = false;
				boolean bveh_capitulo_nro = false;
				boolean bveh_varianteRc_nro = false;
				boolean bveh_varianteAir_nro = false;
				boolean bveh_tarifaDiferencial_nro = false;
				boolean bras_proveedor_opt = false;

				NuevoComponente myComponente;

				CreateDocsNuevoComponente myComponentes = new CreateDocsNuevoComponente();

				@Override
				public void startElement(String uri, String localName, String qName, Attributes attributes)
						throws SAXException {
					// Recorre elemento a elemento cuando encuentra el tag la variable a true
					if (qName.equals("Vehiculo")) { // Si el tag es vehiculo creo el obj
						myComponente = new NuevoComponente();
						myComponente.setIdPadre_cod(idPadre_cod);
						myComponente.setVeh_tarifa_cod(tarifa);
						myComponente.setVeh_status_cod("10");// Cargo los vehiculos como aprobados
						myComponente.setVeh_spwvehABM_cod(veh_spwvehABM_cod);
						myComponente.setRas_proveedor_opt("");
					}

					bveh_componente_nro = (qName.equalsIgnoreCase("POCO")) ? true : false;
					bveh_marca_cod = (qName.equalsIgnoreCase("VHMC")) ? true : false;
					bveh_marca_des = (qName.equalsIgnoreCase("VHMD")) ? true : false;
					bveh_modelo_cod = (qName.equalsIgnoreCase("VHMO")) ? true : false;
					bveh_modelo_des = (qName.equalsIgnoreCase("VHDM")) ? true : false;
					bveh_submodelo_cod = (qName.equalsIgnoreCase("VHCS")) ? true : false;
					bveh_submodelo_des = (qName.equalsIgnoreCase("VHDS")) ? true : false;
					bveh_sumaAsegurada_nro = (qName.equalsIgnoreCase("VHVU")) ? true : false;
					bveh_sumaAseguradaActualizada_nro = (qName.equalsIgnoreCase("VHVA")) ? true : false;
					bveh_anio_nro = (qName.equalsIgnoreCase("VHAN")) ? true : false;
					bveh_motor_des = (qName.equalsIgnoreCase("MOTO")) ? true : false;
					bveh_patenteTipo_cod = (qName.equalsIgnoreCase("TMAT")) ? true : false;
					bveh_patente_des = (qName.equalsIgnoreCase("NMAT")) ? true : false;
					bveh_chasis_des = (qName.equalsIgnoreCase("CHAS")) ? true : false;
					bveh_cobertura_cod = (qName.equalsIgnoreCase("COBL")) ? true : false;
					bveh_cobertura_des = (qName.equalsIgnoreCase("COBD")) ? true : false;
					bveh_statusGaus_des = (qName.equalsIgnoreCase("STAT")) ? true : false;
					bveh_franquiciaValor_nro = (qName.equalsIgnoreCase("IFRA")) ? true : false;
					bveh_franquiciaInforma_opt = (qName.equalsIgnoreCase("MFRA")) ? true : false;
					bveh_bonificaciones = (qName.equalsIgnoreCase("CCBP")) ? true : false;
					bveh_averias_opt = (qName.equalsIgnoreCase("AVER")) ? true : false;
					bveh_gnc_opt = (qName.equalsIgnoreCase("MGNC")) ? true : false;
					bveh_tarifa_cod = (qName.equalsIgnoreCase("CTRE")) ? true : false;
					bveh_uso_cod = (qName.equalsIgnoreCase("VHUV")) ? true : false;
					bveh_zonaRiesgo_cod = (qName.equalsIgnoreCase("SCTA")) ? true : false;
					bveh_origen_opt = (qName.equalsIgnoreCase("VHNI")) ? true : false;
					bveh_capitulo_nro = (qName.equalsIgnoreCase("VHCA")) ? true : false;
					bveh_varianteRc_nro = (qName.equalsIgnoreCase("VHV1")) ? true : false;
					bveh_varianteAir_nro = (qName.equalsIgnoreCase("VHV2")) ? true : false;
					bveh_tarifaDiferencial_nro = (qName.equalsIgnoreCase("MTDF")) ? true : false;
					bras_proveedor_opt = (qName.equalsIgnoreCase("CCBP")) ? true : false;

				}

				@Override
				public void endElement(String uri, String localName, String qName) throws SAXException {
					if (qName.equals("Vehiculo")) { // Cuando termina el tag Vehiculo
						// Si es renovacion y el vehiculo esta INACTIVO, no lo cargo
						boolean eval = myComponente.getVeh_statusGaus_des().equals("INACTIVO")
								&& sol_tipoMovimiento_cod.equals("2");
						if (sol_tipoMovimiento_cod.equals("2")) {
							myComponente.setVeh_statusGaus_des("");
						}
						if (!eval) {
							myComponentes.AddComponente(myComponente); // Agrego el componente a la lista
						}
					}
					if (qName.equals("Vehiculos")) { // Cuando termina el tag Vehiculos
						myComponentes.commitToDb(); // Grabo en la base
					}
				}

				@Override
				public void characters(char ch[], int start, int length) throws SAXException {
					if (bveh_componente_nro) {
						myComponente.setVeh_componente_nro(Integer.parseInt(new String(ch, start, length)));
						bveh_componente_nro = false;
					}

					if (bveh_marca_cod) {
						myComponente.setVeh_marca_cod(new String(ch, start, length));
						bveh_marca_cod = false;
					}

					if (bveh_marca_des) {
						myComponente.setVeh_marca_des(new String(ch, start, length));
						bveh_marca_des = false;
					}

					if (bveh_modelo_cod) {
						myComponente.setVeh_modelo_cod(new String(ch, start, length));
						bveh_modelo_cod = false;
					}

					if (bveh_modelo_des) {
						myComponente.setVeh_modelo_des(new String(ch, start, length));
						bveh_modelo_des = false;
					}

					if (bveh_submodelo_cod) {
						myComponente.setVeh_submodelo_cod(new String(ch, start, length));
						bveh_submodelo_cod = false;
					}

					if (bveh_submodelo_des) {
						myComponente.setVeh_submodelo_des(new String(ch, start, length));
						bveh_submodelo_des = false;
					}

					if (bveh_sumaAsegurada_nro) {
						String temp = new String(ch, start, length).replace(".", "").replace(",", ".");
						myComponente.setVeh_sumaAsegurada_nro(Float.parseFloat(temp));
						bveh_sumaAsegurada_nro = false;
					}

					if (bveh_sumaAseguradaActualizada_nro && booActualizarSumaAsegurada) {
						String temp = new String(ch, start, length).replace(".", "").replace(",", ".");
						myComponente.setVeh_sumaAsegurada_nro(Float.parseFloat(temp));
						bveh_sumaAseguradaActualizada_nro = false;
					}

					if (bveh_anio_nro) {
						myComponente.setVeh_anio_nro(new String(ch, start, length));
						bveh_anio_nro = false;
					}

					if (bveh_motor_des) {
						myComponente.setVeh_motor_des(new String(ch, start, length));
						bveh_motor_des = false;
					}

					if (bveh_patenteTipo_cod) {
						myComponente.setVeh_patenteTipo_cod(new String(ch, start, length));
						bveh_patenteTipo_cod = false;
					}

					if (bveh_patente_des) {
						// System.out.println("Patente para GNC=" + new String(ch, start, length));
						myComponente.setVeh_patente_des(new String(ch, start, length));
						bveh_patente_des = false;
					}

					if (bveh_chasis_des) {
						myComponente.setVeh_chasis_des(new String(ch, start, length));
						bveh_chasis_des = false;
					}

					if (bveh_cobertura_cod) {
						myComponente.setVeh_cobertura_cod(new String(ch, start, length));
						bveh_cobertura_cod = false;
					}

					if (bveh_cobertura_des) {
						myComponente.setVeh_cobertura_des(new String(ch, start, length));
						bveh_cobertura_des = false;
					}

					if (bveh_statusGaus_des) {
						myComponente.setVeh_statusGaus_des(new String(ch, start, length));
						bveh_statusGaus_des = false;
					}

					if (bveh_franquiciaValor_nro) {
						String temp = new String(ch, start, length).replace(".", "").replace(",", ".");
						myComponente.setVeh_franquiciaValor_nro(Float.parseFloat(temp));
						bveh_franquiciaValor_nro = false;
					}

					if (bveh_franquiciaInforma_opt) {
						myComponente.setVeh_franquiciaInforma_opt(new String(ch, start, length));
						bveh_franquiciaInforma_opt = false;
					}

					if (bveh_bonificaciones) {
						String temp = new String(ch, start, length);
						if (temp.toString().equals("997")) {
							myComponente.setVeh_0km_opt("1");
						}
						bveh_bonificaciones = false;
					}

					if (bveh_averias_opt) {
						myComponente.setVeh_averias_opt(new String(ch, start, length));
						bveh_averias_opt = false;
					}

					if (bveh_gnc_opt) {
						String temp = new String(ch, start, length);
						myComponente.setVeh_gnc_opt(temp.toString().equals("S") ? "1" : "0");
						bveh_gnc_opt = false;
					}
					
					if (bveh_tarifa_cod) {
						if (myComponente.getVeh_tarifa_cod().equals("0")) {
							myComponente.setVeh_tarifa_cod(new String(ch, start, length));
						}
						bveh_tarifa_cod = false;
					}

					if (bveh_uso_cod) {
						myComponente.setVeh_uso_cod(new String(ch, start, length));
						bveh_uso_cod = false;
					}

					if (bveh_zonaRiesgo_cod) {
						myComponente.setVeh_zonaRiesgo_cod(new String(ch, start, length));
						bveh_zonaRiesgo_cod = false;
					}

					if (bveh_origen_opt) {
						myComponente.setVeh_origen_opt(new String(ch, start, length));
						bveh_origen_opt = false;
					}

					if (bveh_capitulo_nro) {
						myComponente.setVeh_capitulo_nro(new String(ch, start, length));
						bveh_capitulo_nro = false;
					}

					if (bveh_varianteRc_nro) {
						myComponente.setVeh_varianteRc_nro(new String(ch, start, length));
						bveh_varianteRc_nro = false;
					}

					if (bveh_varianteAir_nro) {
						myComponente.setVeh_varianteAir_nro(new String(ch, start, length));
						bveh_varianteAir_nro = false;
					}

					if (bveh_tarifaDiferencial_nro) {
						myComponente.setVeh_tarifaDiferencial_nro(new String(ch, start, length));
						bveh_tarifaDiferencial_nro = false;
					}

					if (bras_proveedor_opt) { // Bonificacion de rastreador
						String tempRas = new String(ch, start, length);
						if (tempRas.toString().equals("3")) {// Lojack
							myComponente.setRas_proveedor_opt(new String(ch, start, length));
						} else if (tempRas.toString().equals("35")) { // Ituran
							myComponente.setRas_proveedor_opt(new String(ch, start, length));
						}
						bras_proveedor_opt = false;
					}
				}

			};

			URL urlws = new URL(strUrl);
			InputSource is = new InputSource(urlws.openStream());
			is.setEncoding("ISO-8859-1");
			saxParser.parse(is, handler);

		} catch (Exception e) {
			e.printStackTrace();
		}

	}
}
