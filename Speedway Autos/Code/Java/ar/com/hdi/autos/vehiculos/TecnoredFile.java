package ar.com.hdi.autos.vehiculos;

import java.util.Vector;

import javax.xml.parsers.SAXParser;
import javax.xml.parsers.SAXParserFactory;

import lotus.domino.Database;
import lotus.domino.Document;

import org.xml.sax.Attributes;
import org.xml.sax.SAXException;
import org.xml.sax.helpers.DefaultHandler;

import ar.com.hdi.autos.utilidades.Email;
import ar.com.hdi.autos.utilidades.MailingConfig;

public class TecnoredFile {

	private static final long serialVersionUID = 1L;

	public static void comenzar(String clave, final Database currentDb) {

		try {
			SAXParserFactory factory = SAXParserFactory.newInstance();
			SAXParser saxParser = factory.newSAXParser();

			DefaultHandler handler = new DefaultHandler() {
				// Defino todas las variables a leer del xml
				NuevoTecnored myInspeccion;
				FotoInspeccion myFoto;
				FotosInspecciones myFotos = new FotosInspecciones();

				StringBuilder builder;
				boolean booIsTagFoto = false;
				boolean booIsTagObservaciones = false;
				boolean booIsTagcartaDeDanios = false;

				@Override
				public void startElement(String uri, String localName, String qName, Attributes attributes)
						throws SAXException {
					if (qName.equals("Inspeccion")) {
						myInspeccion = new NuevoTecnored();
					}

					// ****************** Start Tag DatosInspeccion ****************************************
					if (qName.equals("DatosInspeccion") && attributes != null && attributes.getLength() > 0) {
						// Leo los atributos y seteo Datos
						if (attributes.getValue("cantFotos") != null) {
							myInspeccion.setDatos_cantFotos(attributes.getValue(attributes.getIndex("cantFotos")));
						}
						if (attributes.getValue("cobertura") != null) {
							myInspeccion.setDatos_cobertura(attributes.getValue(attributes.getIndex("cobertura")));
						}
						if (attributes.getValue("fechaInsp") != null) {
							myInspeccion.setDatos_fechaInsp(attributes.getValue(attributes.getIndex("fechaInsp")));
						}
						if (attributes.getValue("horaInsp") != null) {
							myInspeccion.setDatos_horaInsp(attributes.getValue(attributes.getIndex("horaInsp")));
						}
						if (attributes.getValue("inspector") != null) {
							myInspeccion.setDatos_inspector(attributes.getValue(attributes.getIndex("inspector")));
						}
						if (attributes.getValue("nroFormulario") != null) {
							myInspeccion.setDatos_nroFormulario(attributes.getValue(attributes
									.getIndex("nroFormulario")));
						}
						if (attributes.getValue("nroInspAseguradora") != null) {
							String nroIPA = attributes.getValue(attributes.getIndex("nroInspAseguradora"));
							if (nroIPA.contains("IPA")) {
								int numeroIPA = Integer.parseInt(nroIPA.replaceAll("\\D+", ""));
								nroIPA = "IPA-" + numeroIPA;
							}
							myInspeccion.setDatos_nroInspAseguradora(nroIPA);
						}
						if (attributes.getValue("nroInspTecnored") != null) {
							myInspeccion.setDatos_nroInspTecnored(attributes.getValue(attributes
									.getIndex("nroInspTecnored")));
						}
						if (attributes.getValue("tip") != null) {
							myInspeccion.setDatos_tip(attributes.getValue(attributes.getIndex("tip")));
						}
						if (attributes.getValue("ver") != null) {
							myInspeccion.setDatos_ver(attributes.getValue(attributes.getIndex("ver")));
						}
					}

					// ****************** Start Tag Conductor ****************************************
					if (qName.equals("Conductor") && attributes != null && attributes.getLength() > 0) {
						if (attributes.getValue("nombres") != null) {
							myInspeccion.setConductor_nombres(attributes.getValue(attributes.getIndex("nombres")));
						}
						if (attributes.getValue("apellido") != null) {
							myInspeccion.setConductor_apellido(attributes.getValue(attributes.getIndex("apellido")));
						}
						if (attributes.getValue("tipoDocumento") != null) {
							myInspeccion.setConductor_tipoDocumento(attributes.getValue(attributes
									.getIndex("tipoDocumento")));
						}
						if (attributes.getValue("nroDocumento") != null) {
							myInspeccion.setConductor_nroDocumento(attributes.getValue(attributes
									.getIndex("nroDocumento")));
						}
						if (attributes.getValue("localidad") != null) {
							myInspeccion.setConductor_localidad(attributes.getValue(attributes.getIndex("localidad")));
						}
						if (attributes.getValue("provincia") != null) {
							myInspeccion.setConductor_provincia(attributes.getValue(attributes.getIndex("provincia")));
						}
						if (attributes.getValue("telefono") != null) {
							myInspeccion.setConductor_telefono(attributes.getValue(attributes.getIndex("telefono")));
						}
					}

					// ****************** Start Tag Seguridad ****************************************
					if (qName.equals("Seguridad") && attributes != null && attributes.getLength() > 0) {
						if (attributes.getValue("cerradurasFuncionan") != null) {
							myInspeccion.setSeguridad_cerradurasFuncionan(attributes.getValue(attributes
									.getIndex("cerradurasFuncionan")));
						}
						if (attributes.getValue("tieneAlarma") != null) {
							myInspeccion.setSeguridad_tieneAlarma(attributes.getValue(attributes
									.getIndex("tieneAlarma")));
						}
						if (attributes.getValue("marcaEqupoRastreo") != null) {
							myInspeccion.setSeguridad_marcaEqupoRastreo(attributes.getValue(attributes
									.getIndex("marcaEqupoRastreo")));
						}

					}

					// ****************** Start Tag InspeccionTecnica ****************************************
					if (qName.equals("InspeccionTecnica") && attributes != null && attributes.getLength() > 0) {
						if (attributes.getValue("fechaVto") != null) {
							myInspeccion.setInspeccionTecnica_fechaVto(attributes.getValue(attributes
									.getIndex("fechaVto")));
						}
						if (attributes.getValue("numeroOblea") != null) {
							myInspeccion.setInspeccionTecnica_numeroOblea(attributes.getValue(attributes
									.getIndex("numeroOblea")));
						}
					}

					// ****************** Start Tag Vehiculo ****************************************
					if (qName.equals("Vehiculo") && attributes != null && attributes.getLength() > 0) {
						if (attributes.getValue("nroDocumentoCv") != null) {
							myInspeccion.setVehiculo_nroDocumentoCv(attributes.getValue(attributes
									.getIndex("nroDocumentoCv")));
						}
						if (attributes.getValue("anio") != null) {
							myInspeccion.setVehiculo_anio(attributes.getValue(attributes.getIndex("anio")));
						}
						if (attributes.getValue("cantidadAsientos") != null) {
							myInspeccion.setVehiculo_cantidadAsientos(attributes.getValue(attributes
									.getIndex("cantidadAsientos")));
						}
						if (attributes.getValue("color") != null) {
							myInspeccion.setVehiculo_color(attributes.getValue(attributes.getIndex("color")));
						}
						if (attributes.getValue("combustible") != null) {
							myInspeccion.setVehiculo_combustible(attributes
									.getValue(attributes.getIndex("combustible")));
						}
						if (attributes.getValue("dominio") != null) {
							myInspeccion.setVehiculo_dominio(attributes.getValue(attributes.getIndex("dominio")));
						}
						if (attributes.getValue("kilometraje") != null) {
							myInspeccion.setVehiculo_kilometraje(attributes
									.getValue(attributes.getIndex("kilometraje")));
						}
						if (attributes.getValue("marca") != null) {
							myInspeccion.setVehiculo_marca(attributes.getValue(attributes.getIndex("marca")));
						}
						if (attributes.getValue("modelo") != null) {
							myInspeccion.setVehiculo_modelo(attributes.getValue(attributes.getIndex("modelo")));
						}
						if (attributes.getValue("nroChassis") != null) {
							myInspeccion.setVehiculo_nroChassis(attributes.getValue(attributes.getIndex("nroChassis")));
						}
						if (attributes.getValue("nroMotor") != null) {
							myInspeccion.setVehiculo_nroMotor(attributes.getValue(attributes.getIndex("nroMotor")));
						}
						if (attributes.getValue("puestaEnMarcha") != null) {
							myInspeccion.setVehiculo_puestaEnMarcha(attributes.getValue(attributes
									.getIndex("puestaEnMarcha")));
						}
						if (attributes.getValue("tapizados") != null) {
							myInspeccion.setVehiculo_tapizados(attributes.getValue(attributes.getIndex("tapizados")));
						}
						if (attributes.getValue("tipo") != null) {
							myInspeccion.setVehiculo_tipo(attributes.getValue(attributes.getIndex("tipo")));
						}
						if (attributes.getValue("titular") != null) {
							myInspeccion.setVehiculo_titular(attributes.getValue(attributes.getIndex("titular")));
						}
						if (attributes.getValue("uso") != null) {
							myInspeccion.setVehiculo_uso(attributes.getValue(attributes.getIndex("uso")));
						}
						if (attributes.getValue("verificaNumeroChasis") != null) {
							myInspeccion.setVehiculo_verificaNumeroChasis(attributes.getValue(attributes
									.getIndex("verificaNumeroChasis")));
						}
						if (attributes.getValue("verificaNumeroMotor") != null) {
							myInspeccion.setVehiculo_verificaNumeroMotor(attributes.getValue(attributes
									.getIndex("verificaNumeroMotor")));
						}
					}

					// ****************** Start Tag Cubiertas ****************************************
					if (qName.equals("DelanteraIzquierda") && attributes != null && attributes.getLength() > 0) {
						if (attributes.getValue("marca") != null) {
							myInspeccion.setCubiertasDelanteraIzquierda_marca(attributes.getValue(attributes
									.getIndex("marca")));
						}
						if (attributes.getValue("modelo") != null) {
							myInspeccion.setCubiertasDelanteraIzquierda_modelo(attributes.getValue(attributes
									.getIndex("modelo")));
						}
						if (attributes.getValue("rodado") != null) {
							myInspeccion.setCubiertasDelanteraIzquierda_rodado(attributes.getValue(attributes
									.getIndex("rodado")));
						}
						if (attributes.getValue("profundidadMm") != null) {
							myInspeccion.setCubiertasDelanteraIzquierda_profundidadMm(attributes.getValue(attributes
									.getIndex("profundidadMm")));

						}
					}
					if (qName.equals("DelanteraDerecha") && attributes != null && attributes.getLength() > 0) {
						if (attributes.getValue("marca") != null) {
							myInspeccion.setCubiertasDelanteraDerecha_marca(attributes.getValue(attributes
									.getIndex("marca")));
						}
						if (attributes.getValue("modelo") != null) {
							myInspeccion.setCubiertasDelanteraDerecha_modelo(attributes.getValue(attributes
									.getIndex("modelo")));
						}
						if (attributes.getValue("rodado") != null) {
							myInspeccion.setCubiertasDelanteraDerecha_rodado(attributes.getValue(attributes
									.getIndex("rodado")));
						}
						if (attributes.getValue("profundidadMm") != null) {
							myInspeccion.setCubiertasDelanteraDerecha_profundidadMm(attributes.getValue(attributes
									.getIndex("profundidadMm")));
						}
					}

					if (qName.equals("TraseraIzquierda") && attributes != null && attributes.getLength() > 0) {
						if (attributes.getValue("marca") != null) {
							myInspeccion.setCubiertasTraseraIzquierda_marca(attributes.getValue(attributes
									.getIndex("marca")));
						}
						if (attributes.getValue("modelo") != null) {
							myInspeccion.setCubiertasTraseraIzquierda_modelo(attributes.getValue(attributes
									.getIndex("modelo")));
						}
						if (attributes.getValue("rodado") != null) {
							myInspeccion.setCubiertasTraseraIzquierda_rodado(attributes.getValue(attributes
									.getIndex("rodado")));
						}
						if (attributes.getValue("profundidadMm") != null) {
							myInspeccion.setCubiertasTraseraIzquierda_profundidadMm(attributes.getValue(attributes
									.getIndex("profundidadMm")));
						}
					}
					if (qName.equals("TraseraDerecha") && attributes != null && attributes.getLength() > 0) {
						if (attributes.getValue("marca") != null) {
							myInspeccion.setCubiertasTraseraDerecha_marca(attributes.getValue(attributes
									.getIndex("marca")));
						}
						if (attributes.getValue("modelo") != null) {
							myInspeccion.setCubiertasTraseraDerecha_modelo(attributes.getValue(attributes
									.getIndex("modelo")));
						}
						if (attributes.getValue("rodado") != null) {
							myInspeccion.setCubiertasTraseraDerecha_rodado(attributes.getValue(attributes
									.getIndex("rodado")));
						}
						if (attributes.getValue("profundidadMm") != null) {
							myInspeccion.setCubiertasTraseraDerecha_profundidadMm(attributes.getValue(attributes
									.getIndex("profundidadMm")));
						}
					}

					if (qName.equals("Auxilio") && attributes != null && attributes.getLength() > 0) {
						if (attributes.getValue("marca") != null) {
							myInspeccion.setCubiertasAuxilio_marca(attributes.getValue(attributes.getIndex("marca")));
						}
						if (attributes.getValue("modelo") != null) {
							myInspeccion.setCubiertasAuxilio_modelo(attributes.getValue(attributes.getIndex("modelo")));
						}
						if (attributes.getValue("rodado") != null) {
							myInspeccion.setCubiertasAuxilio_rodado(attributes.getValue(attributes.getIndex("rodado")));
						}
						if (attributes.getValue("profundidadMm") != null) {
							myInspeccion.setCubiertasAuxilio_profundidadMm(attributes.getValue(attributes
									.getIndex("profundidadMm")));
						}
					}
					// ****************** Start Tag AccesoriosComplementarios ****************************************
					if (qName.equals("AccesoriosComplementarios") && attributes != null && attributes.getLength() > 0) {
						if (attributes.getValue("abs") != null) {
							myInspeccion.setAccesoriosComplementarios_abs(attributes.getValue(attributes
									.getIndex("abs")));
						}
						if (attributes.getValue("aireAcondicionado") != null) {
							myInspeccion.setAccesoriosComplementarios_aireAcondicionado(attributes.getValue(attributes
									.getIndex("aireAcondicionado")));
						}
						if (attributes.getValue("alarma") != null) {
							myInspeccion.setAccesoriosComplementarios_alarma(attributes.getValue(attributes
									.getIndex("alarma")));
						}
						if (attributes.getValue("cierreCentralizado") != null) {
							myInspeccion.setAccesoriosComplementarios_cierreCentralizado(attributes.getValue(attributes
									.getIndex("cierreCentralizado")));
						}
						if (attributes.getValue("direccionAsistida") != null) {
							myInspeccion.setAccesoriosComplementarios_direccionAsistida(attributes.getValue(attributes
									.getIndex("direccionAsistida")));
						}
						if (attributes.getValue("cristalesGrabados") != null) {
							myInspeccion.setAccesoriosComplementarios_cristalesGrabados(attributes.getValue(attributes
									.getIndex("cristalesGrabados")));
						}
						if (attributes.getValue("airbagAcompanante") != null) {
							myInspeccion.setAccesoriosComplementarios_airbagAcompanante(attributes.getValue(attributes
									.getIndex("airbagAcompanante")));
						}
						if (attributes.getValue("airbagConductor") != null) {
							myInspeccion.setAccesoriosComplementarios_airbagConductor(attributes.getValue(attributes
									.getIndex("airbagConductor")));
						}
						if (attributes.getValue("airbagLateral") != null) {
							myInspeccion.setAccesoriosComplementarios_airbagLateral(attributes.getValue(attributes
									.getIndex("airbagLateral")));
						}
						if (attributes.getValue("llantasDeAleacion") != null) {
							myInspeccion.setAccesoriosComplementarios_llantasDeAleacion(attributes.getValue(attributes
									.getIndex("llantasDeAleacion")));
						}
					}

					// ****************** Start Tag observaciones ****************************************
					if (qName.equalsIgnoreCase("cartaDeDanios")) {
						booIsTagcartaDeDanios = true;
					}

					// ****************** Start Tag observaciones ****************************************
					if (qName.equalsIgnoreCase("observaciones")) {
						booIsTagObservaciones = true;
					}

					// ****************** Start Tag foto ****************************************
					if (qName.equalsIgnoreCase("foto")) {
						myFoto = new FotoInspeccion();
						myFoto.setIntNroFoto(Integer.parseInt(attributes.getValue("fotoNumero")));
						myFoto.setStrFormato(attributes.getValue("formato"));
						builder = new StringBuilder();
						booIsTagFoto = true;
					}
				}

				@Override
				public void endElement(String uri, String localName, String qName) throws SAXException {
					// ****************** End Tag foto ****************************************
					if (qName.equalsIgnoreCase("foto")) {
						myFoto.setStrValorFoto(builder.toString());
						myFotos.AddFoto(myFoto);
					}

					if (qName.equals("DatosInspeccion")) {
						// System.out.println("Finaliza el tag DatosInspeccion");

						try {

							String digitoVer = myInspeccion.getDatos_ver().split("\\|")[2].split("\\-")[1];
							String tempVehVer = myInspeccion.getDatos_ver().split("\\|")[2].split("\\-")[0];
							String VehVer = tempVehVer.substring(1);
							String verificaNumeroChasis = myInspeccion.getVehiculo_verificaNumeroChasis()
									.equalsIgnoreCase("COINCIDE") ? "e2" : "a2";
							String verificaNumeroMotor = myInspeccion.getVehiculo_verificaNumeroMotor()
									.equalsIgnoreCase("COINCIDE") ? "e2" : "a2";
							String label_verificaNumeroChasis = myInspeccion.getVehiculo_verificaNumeroChasis()
									.equalsIgnoreCase("COINCIDE") ? "" : myInspeccion
									.getVehiculo_verificaNumeroChasis();
							String label_verificaNumeroMotor = myInspeccion.getVehiculo_verificaNumeroMotor()
									.equalsIgnoreCase("COINCIDE") ? "" : myInspeccion.getVehiculo_verificaNumeroMotor();
							String img_1 = "i0";// DATO NO ENVIADO POR TECNORED
							String img_2 = myInspeccion.getSeguridad_cerradurasFuncionan().equalsIgnoreCase("SI") ? "i2"
									: "i0";
							// ****** INI - Equipo de Rastreo *******
							String img_3 = "i0";
							String label_marcaEquipoRastreo = "";
							if (!myInspeccion.getSeguridad_marcaEqupoRastreo().equalsIgnoreCase("")) {
								if (!myInspeccion.getSeguridad_marcaEqupoRastreo().substring(0, 3).equalsIgnoreCase(
										"SIN")) {
									// TENGO EQUIPO DE REASTREO
									img_3 = "i3";
									label_marcaEquipoRastreo = "EQUIPO DE RASTREO: "
											+ myInspeccion.getSeguridad_marcaEqupoRastreo();
								}
							}
							// ****** FIN - Equipo de Rastreo *******
							String img_4 = myInspeccion.getAccesoriosComplementarios_cristalesGrabados()
									.equalsIgnoreCase("SI") ? "i4" : "i0";// Grabado de Cristales
							String img_5 = myInspeccion.getVehiculo_puestaEnMarcha().equalsIgnoreCase("SI") ? "i5"
									: "i0";
							String img_6 = myInspeccion.getInspeccionTecnica_fechaVto().equalsIgnoreCase("") ? "i0"
									: "i6"; // RevisionTecnica tiene FechaVto
							String img_7 = myInspeccion.getSeguridad_tieneAlarma().equalsIgnoreCase("SI") ? "i7" : "i0";
							String img_8 = "i0";// FALTA Parabrisas Polarizado??
							String img_9 = myInspeccion.getAccesoriosComplementarios_abs().equalsIgnoreCase("SI") ? "i9"
									: "i0";
							String img_10 = myInspeccion.getAccesoriosComplementarios_airbagConductor()
									.equalsIgnoreCase("SI") ? "i10" : "i0";// Airbag Conductor
							String img_11 = myInspeccion.getAccesoriosComplementarios_airbagAcompanante()
									.equalsIgnoreCase("SI") ? "i11" : "i0";// Airbag Acompañante
							String img_12 = myInspeccion.getAccesoriosComplementarios_airbagLateral().equalsIgnoreCase(
									"SI") ? "i12" : "i0";// Airbag Lateral
							String img_13 = myInspeccion.getAccesoriosComplementarios_aireAcondicionado()
									.equalsIgnoreCase("SI") ? "i13" : "i0";
							String img_14 = myInspeccion.getAccesoriosComplementarios_direccionAsistida()
									.equalsIgnoreCase("SI") ? "i14" : "i0";
							String img_15 = myInspeccion.getAccesoriosComplementarios_cierreCentralizado()
									.equalsIgnoreCase("SI") ? "i15" : "i0";
							String img_16 = "i0";// FALTA GNC

							String label_RevisionTecnicaObligatoria = myInspeccion.getInspeccionTecnica_fechaVto()
									.equalsIgnoreCase("") ? "" : "RTO: " + myInspeccion.getInspeccionTecnica_fechaVto()
									+ " Nº de Oblea:" + myInspeccion.getInspeccionTecnica_numeroOblea();
							String label_nroDocumentoCv = myInspeccion.getVehiculo_nroDocumentoCv()
									.equalsIgnoreCase("") ? myInspeccion.getConductor_nroDocumento() : myInspeccion
									.getVehiculo_nroDocumentoCv();
							String label_llantasDeAleacion = myInspeccion
									.getAccesoriosComplementarios_llantasDeAleacion().equalsIgnoreCase("SI") ? "ALEACION"
									: "";

							if (myInspeccion.getDatos_nroInspAseguradora().equalsIgnoreCase("")
									|| myInspeccion.getDatos_nroInspAseguradora().equalsIgnoreCase("0")) {
								// Crear IPA
								CreateDocsNuevaInspeccion myDocInspeccion = new CreateDocsNuevaInspeccion();
								String id = myDocInspeccion.commitToDb(myInspeccion);
								Document docInspeccion = currentDb.getDocumentByUNID(id);
								if (docInspeccion != null) {
									docInspeccion.computeWithForm(true, false);
									docInspeccion.save();
									MailingConfig myMCtecnored = new MailingConfig();
									MailingConfig myMailTecnored = myMCtecnored.newConfig("InspeccionTecnored",
											docInspeccion);

									if (myMailTecnored.booEnabled) {
										myMailTecnored.sendMailWithCfg(myMailTecnored, docInspeccion);
									}

									myInspeccion.setDatos_nroInspAseguradora(docInspeccion
											.getItemValueString("ins_Consecutivo_des"));
									docInspeccion.recycle();
								}
							}

							String tempBody = "<head> <meta http-equiv=\"Content-Type\" content=\"text/html; charset=iso-8859-1\"> <style type=\"text/css\"> <!-- body {	background-color: #FFFFFF; } .negrita {font-family: Tahoma; font-size: 11px; font-style: normal; color: #000000; font-weight: bold} .dominio {font-size: 32px; font-weight: bold; color:#FFFFFF; } .ver {font-size: 28px; font-weight: bold; } .cabecera {font-size: 16px} .contenido {font-size: 12px;font-family: Arial;} --> </style> </head> <body> <table width=\"1000\" border=\"0\" cellpadding=\"5\" cellspacing=\"0\" bgcolor=\"#FFFFFF\"> <tr> <td> <table width=\"100%\" border=\"0\" cellpadding=\"4\" cellspacing=\"0\" class=\"textos\"> <tr> <td width=\"120\" align=\"center\" style=\"background-color:#1E1E1E; color:#FFFFFF\"><span class=\"dominio\">"
									+ myInspeccion.getVehiculo_dominio()
									+ "</span></td> <td class=\"cabecera\">&nbsp;</td> <td class=\"cabecera\">"
									+ myInspeccion.getVehiculo_marca()
									+ "&nbsp;"
									+ myInspeccion.getVehiculo_modelo()
									+ "&nbsp;("
									+ myInspeccion.getVehiculo_anio()
									+ ") </td> <td align=\"right\"> <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" class=\"textos\"> <tbody> <tr> <td align=\"center\" class=\"ver\"><span>"
									+ myInspeccion.getDatos_ver().substring(0, 4)
									+ "</span></td><!--2007></!--> <td align=\"center\" class=\"ver\">"
									+ myInspeccion.getDatos_ver().substring(4, 5)
									+ "</td> <td align=\"center\" class=\"ver\">"
									+ myInspeccion.getDatos_ver().substring(5, 6)
									+ "</td><!--pipe></!--> <td align=\"center\" class=\"ver\"> <span>"
									+ myInspeccion.getDatos_ver().substring(6, 7)
									+ "</span> </td> <td align=\"center\" class=\"ver\"> <span>"
									+ myInspeccion.getDatos_ver().substring(7, 8)
									+ "</span> </td> <td align=\"center\" class=\"ver\"> <span>"
									+ myInspeccion.getDatos_ver().substring(8, 9)
									+ "</span> </td> <td align=\"center\" class=\"ver\"> <span>"
									+ myInspeccion.getDatos_ver().substring(9, 10)
									+ "</span> </td> <td align=\"center\" class=\"ver\"> <span>"
									+ myInspeccion.getDatos_ver().substring(10, 11)
									+ "</span> </td> <td align=\"center\" class=\"ver\"> <span>"
									+ myInspeccion.getDatos_ver().substring(11, 12)
									+ "</span> </td> <td align=\"center\" class=\"ver\">"
									+ myInspeccion.getDatos_ver().substring(12, 13)
									+ "</td> <!--pipe></!--> <td align=\"center\" class=\"ver\">"
									+ myInspeccion.getDatos_ver().substring(13, 14)
									+ "</td> <!--combustible></!--> <td align=\"center\" class=\"ver\">"
									+ VehVer
									+ "</td> <td align=\"center\" class=\"ver\">-</td> <td align=\"center\" class=\"ver\">"
									+ digitoVer
									+ "</td> </tr> <tr> <td align=\"center\">Año</td> <td align=\"center\">Uso</td> <td align=\"center\"/> <td align=\"center\">Ca</td> <td align=\"center\">Lu</td> <td align=\"center\">Cr</td> <td align=\"center\">Cu</td> <td align=\"center\">Id</td> <td align=\"center\">Ro</td> <td align=\"center\"/> <td align=\"center\">Com</td> <td align=\"center\">Veh</td> <td align=\"center\"/> <td align=\"center\">Dv</td> </tr> </tbody> </table> <span class=\"cabecera\">"
									+ myInspeccion.getDatos_cobertura()
									+ "</span> </td> <tr> <td align=\"center\" nowrap=\"nowrap\" class=\"cabecera\"><strong>"
									+ myInspeccion.getVehiculo_tipo()
									+ "</strong></td> <td class=\"cabecera\">&nbsp;</td> <td class=\"cabecera\">"
									+ myInspeccion.getVehiculo_kilometraje()
									+ "&nbsp;km</td> </tr> </table> <br /> <table width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"3\" style=\"border:solid 1px #333333\"> <tr> <td class=\"contenido\">Inspeccionado el d&iacute;a <strong>"
									+ myInspeccion.getDatos_fechaInsp()
									+ "</strong> a las <strong>"
									+ myInspeccion.getDatos_horaInsp()
									+ "</strong> para  <strong>HDI</strong> con el c&oacute;digo <strong>"
									+ myInspeccion.getDatos_nroInspAseguradora()
									+ "</strong> en <strong>"
									+ myInspeccion.getConductor_localidad()
									+ ", "
									+ myInspeccion.getConductor_provincia()
									+ "</strong> por <strong> TECNORED</strong>, formulario N&ordm; <strong>"
									+ myInspeccion.getDatos_nroFormulario()
									+ "</strong></td> </tr> </table> <br /> <br /> <table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\"> <tr> <td align=\"center\"> <img src=\"TecnoRed_"
									+ img_1
									+ ".png\" width=\"54\" height=\"54\" border=\"0\" /></td> <td align=\"center\"> <img src=\"TecnoRed_"
									+ img_2
									+ ".png\" width=\"54\" height=\"54\" border=\"0\" /></td> <td align=\"center\"><img src=\"TecnoRed_"
									+ img_3
									+ ".png\" width=\"54\" height=\"54\" border=\"0\" /></td> <td align=\"center\"><img src=\"TecnoRed_"
									+ img_4
									+ ".png\" width=\"54\" height=\"54\" border=\"0\" /></td> <td align=\"center\"><img src=\"TecnoRed_"
									+ img_5
									+ ".png\" width=\"54\" height=\"54\" border=\"0\" /></td> <td align=\"center\"><img src=\"TecnoRed_"
									+ img_6
									+ ".png\" width=\"54\" height=\"54\" border=\"0\" /></td> <td align=\"center\"><img src=\"TecnoRed_"
									+ img_7
									+ ".png\" width=\"54\" height=\"54\" border=\"0\" /></td> <td align=\"center\"><img src=\"TecnoRed_"
									+ img_8
									+ ".png\" width=\"54\" height=\"54\" border=\"0\" /></td> <td align=\"center\"><img src=\"TecnoRed_"
									+ img_9
									+ ".png\" width=\"54\" height=\"54\" border=\"0\" /></td> <td align=\"center\"><img src=\"TecnoRed_"
									+ img_10
									+ ".png\" width=\"54\" height=\"54\" border=\"0\" /></td> <td align=\"center\"><img src=\"TecnoRed_"
									+ img_11
									+ ".png\" width=\"54\" height=\"54\" border=\"0\" /></td> <td align=\"center\"><img src=\"TecnoRed_"
									+ img_12
									+ ".png\" width=\"54\" height=\"54\" border=\"0\" /></td> <td align=\"center\"><img src=\"TecnoRed_"
									+ img_13
									+ ".png\" width=\"54\" height=\"54\" border=\"0\" /></td> <td align=\"center\"><img src=\"TecnoRed_"
									+ img_14
									+ ".png\" width=\"54\" height=\"54\" border=\"0\" /></td> <td align=\"center\"><img src=\"TecnoRed_"
									+ img_15
									+ ".png\" width=\"54\" height=\"54\" border=\"0\" /></td> <td align=\"center\"><img src=\"TecnoRed_"
									+ img_16
									+ ".png\" width=\"54\" height=\"54\" border=\"0\" /></td> </tr> <tr> <td align=\"center\" class=\"textos\">Autopartes<br /> grabadas</td> <td align=\"center\" class=\"textos\">Cerraduras</td> <td align=\"center\" class=\"textos\">Equipo de<br />rastreo</td> <td align=\"center\" class=\"textos\">Grabado de<br />cristales</td> <td align=\"center\" class=\"textos\">Puesta en<br />marcha OK</td> <td align=\"center\" class=\"textos\">Revisi&oacute;n<br />t&eacute;cnica</td> <td align=\"center\" class=\"textos\">Alarma</td> <td align=\"center\" class=\"textos\">Parabrisas<br />polarizado</td> <td align=\"center\" class=\"textos\">ABS</td> <td align=\"center\" class=\"textos\">Airbag<br />conductor</td> <td align=\"center\" class=\"textos\">Airbag<br />acompte.</td> <td align=\"center\" class=\"textos\">Airbag<br />Lateral</td> <td align=\"center\" class=\"textos\">AA</td> <td align=\"center\" class=\"textos\">Direcci&oacute;n<br />asistida</td> <td align=\"center\" class=\"textos\">Cierre<br />centralizado</td> <td align=\"center\" class=\"textos\">GNC</td> </tr> </table> <br /> <table width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"3\" class=\"contenido\" style=\"border:solid 1px #333333\"> <tr> <td width=\"50%\"><strong>VIN: </strong>"
									+ myInspeccion.getVehiculo_nroChassis()
									+ " &nbsp;&nbsp;<img src=\"TecnoRed_"
									+ verificaNumeroChasis
									+ ".png\" align=\"absmiddle\" />&nbsp;"
									+ label_verificaNumeroChasis
									+ "</td> <td width=\"20%\">"
									+ myInspeccion.getVehiculo_color()
									+ "</td> <td>"
									+ myInspeccion.getVehiculo_uso()
									+ "</td> </tr> <tr> <td><strong>MOTOR: </strong>"
									+ myInspeccion.getVehiculo_nroMotor()
									+ " &nbsp;&nbsp;<img src=\"TecnoRed_"
									+ verificaNumeroMotor
									+ ".png\" align=\"absmiddle\" />&nbsp;"
									+ label_verificaNumeroMotor
									+ "</td> <td>"
									+ myInspeccion.getVehiculo_combustible()
									+ "</td> <td><strong>INTERIORES: </strong>"
									+ myInspeccion.getVehiculo_tapizados()
									+ " </td> <td><strong>ASIENTOS: </strong>"
									+ myInspeccion.getVehiculo_cantidadAsientos()
									+ " </td> </tr> <tr> <td></td> <td>"
									+ label_RevisionTecnicaObligatoria
									+ "</td> <td>"
									+ label_marcaEquipoRastreo
									+ "</td> </tr> <tr> <td></td> <td></td> <td><strong>TRACCION:</strong></td> </tr> </table> <br /> <table width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"3\" style=\"border:solid 1px #333333\"> <tr> <td class=\"contenido\"><strong>TITULAR:</strong>&nbsp;"
									+ myInspeccion.getVehiculo_titular()
									+ "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>DNI/CUIT:</strong>&nbsp;"
									+ label_nroDocumentoCv
									+ "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>TELEFONO:</strong>&nbsp;"
									+ myInspeccion.getConductor_telefono()
									+ "</td> </tr> </table> </td> </tr> </table> <table width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" id=\"s_d\"> <tr> <td align=\"left\"> <table width=\"990\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\"> <tr> <td width=\"405\" background=\"TecnoRed_tit1_.png\"><img src=\"TecnoRed_li.png\" width=\"405\" height=\"26\" /></td> <td width=\"320\" style=\"background-image:url(TecnoRed_tit1_.png); background-repeat:repeat-x\" align=\"left\"><img src=\"TecnoRed_tit_danios.png\" width=\"320\" height=\"26\" /></td> <td width=\"265\" align=\"left\" style=\"background-image:url(TecnoRed_tit1_.png); background-repeat:repeat-x\"><img src=\"TecnoRed_tit_cubiertas.png\" width=\"265\" height=\"26\" /></td> </tr> </table> </td> </tr> <tr> <td height=\"25\"> <table width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" class=\"contenido\"> <tr> <td width=\"405\"> <img src=\"ImagenNoDisponible.png\" /> </td> <td width=\"320\"></td> <td> <strong>EJE DELANTERO</strong><br />"
									+ myInspeccion.getCubiertasDelanteraIzquierda_marca()
									+ " "
									+ myInspeccion.getCubiertasDelanteraIzquierda_modelo()
									+ " "
									+ myInspeccion.getCubiertasDelanteraIzquierda_rodado()
									+ "&nbsp;&nbsp;&nbsp; <br />PROF:"
									+ myInspeccion.getCubiertasDelanteraIzquierda_profundidadMm()
									+ "mm<br />"
									+ label_llantasDeAleacion
									+ "<strong><br><br>EJE TRASERO</strong><br />"
									+ myInspeccion.getCubiertasTraseraIzquierda_marca()
									+ " "
									+ myInspeccion.getCubiertasTraseraIzquierda_modelo()
									+ " "
									+ myInspeccion.getCubiertasTraseraIzquierda_rodado()
									+ "&nbsp;&nbsp;&nbsp; <br />PROF:"
									+ myInspeccion.getCubiertasTraseraIzquierda_profundidadMm()
									+ "mm<br />"
									+ label_llantasDeAleacion
									+ " <strong><br><br>RUEDA DE AUXILIO </strong><br />"
									+ myInspeccion.getCubiertasAuxilio_marca()
									+ " "
									+ myInspeccion.getCubiertasAuxilio_modelo()
									+ " "
									+ myInspeccion.getCubiertasAuxilio_rodado()
									+ "<br />PROF:"
									+ myInspeccion.getCubiertasAuxilio_profundidadMm()
									+ "mm</td> </tr> </table> </td> </tr> </table> <table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\"> <tr> <td height=\"25\" align=\"left\"> <table width=\"990\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\"> <tr> <td width=\"405\" background=\"TecnoRed_tit1_.png\"><img src=\"TecnoRed_ld.png\" width=\"405\" height=\"26\" /></td> <td width=\"320\" style=\"background-image:url(TecnoRed_tit1_.png); background-repeat:repeat-x\" align=\"left\"><img src=\"TecnoRed_tit_danios.png\" width=\"320\" height=\"26\" /></td> <td width=\"265\" align=\"left\" style=\"background-image:url(TecnoRed_tit1_.png); background-repeat:repeat-x\"><img src=\"TecnoRed_tit_cubiertas.png\" width=\"265\" height=\"26\" /></td> </tr> </table> </td> </tr> <tr> <td valign=\"top\"> <table width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" class=\"contenido\"> <tr> <td width=\"405\"> <img src=\"ImagenNoDisponible.png\" /> </td> <td width=\"320\"></td> <td> <strong>EJE DELANTERO</strong><br />"
									+ myInspeccion.getCubiertasDelanteraDerecha_marca()
									+ " "
									+ myInspeccion.getCubiertasDelanteraDerecha_modelo()
									+ " "
									+ myInspeccion.getCubiertasDelanteraDerecha_rodado()
									+ "&nbsp;&nbsp;&nbsp; <br />PROF:"
									+ myInspeccion.getCubiertasDelanteraDerecha_profundidadMm()
									+ "mm<br />"
									+ label_llantasDeAleacion
									+ "<strong><br><br>EJE TRASERO</strong><br />"
									+ myInspeccion.getCubiertasTraseraDerecha_marca()
									+ " "
									+ myInspeccion.getCubiertasTraseraDerecha_modelo()
									+ " "
									+ myInspeccion.getCubiertasTraseraDerecha_rodado()
									+ "&nbsp;&nbsp;&nbsp; <br />PROF:"
									+ myInspeccion.getCubiertasTraseraDerecha_profundidadMm()
									+ "mm<br />"
									+ label_llantasDeAleacion
									+ "</td> </tr> </table> </td> </tr> </table> <table width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\"> <tr> <td valign=\"top\"><table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\"> <tr> <td valign=\"top\"> <table width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" class=\"contenido\"> <tr> <br /> <td width=\"320\" class=\"contenido\"><strong>CARTA DE DAÑOS:</strong><br /> "
									+ myInspeccion.getCartaDeDanios()
									+ "</td> <td class=\"contenido\">&nbsp;</td> </tr> </table> </td> </tr> </table> </td> </tr> </table> </td> </tr> </table> <br /> <table width=\"100%\" border=\"0\" cellpadding=\"6\" cellspacing=\"0\" class=\"contenido\"> <tr> <td align=\"left\"> <strong>OBSERVACIONES:</strong><br />"
									+ myInspeccion.getObservaciones() + "</td> </tr> </table> <br /> <br /> </body>";

							// Recorrer las fotos
							Vector<FotoInspeccion> misFotos = myFotos.getMisFotos();
							for (int v = 0; v < misFotos.size(); v++) {
								tempBody += "<img alt=\"Icono de xml\"  src=\"data:image/jpg;base64,"
										+ misFotos.elementAt(v).getStrValorFoto() + "\" /> <br/>";
							}

							// Genero el objeto para enviar un mail
							MailingConfig myMC = new MailingConfig();
							MailingConfig myMailConfig = myMC.newConfig("amgrRespuestaInspeccionTecnoRed", null);

							Email mail = new Email();
							mail.setSubject("TecnoRed - Inspección Número ##"
									+ myInspeccion.getDatos_nroInspAseguradora().toUpperCase() + "##" + " - "
									+ myInspeccion.getVehiculo_dominio());
							// String body = "<img alt=\"Icono de xml\"  src=\"data:image/jpg;base64," + myFoto.getStrValorFoto() + "\" />";
							mail.setHTMLPart(tempBody);
							mail.send(myMailConfig.getVecAllSendTo().elementAt(0));

						} catch (Exception e) {
							e.printStackTrace();
						}

					}
				}

				@Override
				public void characters(char ch[], int start, int length) throws SAXException {
					if (booIsTagFoto) {
						builder.append(ch, start, length);
					}

					if (booIsTagcartaDeDanios) {
						myInspeccion.setCartaDeDanios(new String(ch, start, length));
						booIsTagcartaDeDanios = false;
					}

					if (booIsTagObservaciones) {
						myInspeccion.setObservaciones(new String(ch, start, length));
						booIsTagObservaciones = false;
					}

				}
			};

			// InputStream inputstream = new FileInputStream(clave);
			// InputSource is = new InputSource(inputstream);
			// is.setEncoding("ISO-8859-1");
			// saxParser.parse(is, handler);

			saxParser.parse(clave, handler);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
