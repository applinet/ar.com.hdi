package ar.com.hdi.autos.vehiculos;

import java.io.Serializable;
import java.util.Iterator;
import java.util.Vector;

import lotus.domino.Database;
import lotus.domino.Document;
import lotus.domino.NotesException;
import lotus.domino.NotesFactory;
import lotus.domino.Session;
import ar.com.hdi.autos.utilidades.JSFUtil;

/**
 * @author Rodrigfer
 * 
 */
public class CreateDocsNuevoComponente implements Serializable {

	private static final long serialVersionUID = 1L;

	private final Vector<NuevoComponente> misComponentes;

	// Class Constructor...
	public CreateDocsNuevoComponente() {
		misComponentes = new Vector<NuevoComponente>();

	}

	public void AddComponente(String veh_marca_cod, String veh_marca_des, String veh_modelo_cod, String veh_modelo_des,
			String veh_submodelo_cod, String veh_submodelo_des, String veh_sumaAsegurada_nro) {
		misComponentes.add(new NuevoComponente());
	}

	public void AddComponente() {
		misComponentes.add(new NuevoComponente());
	}

	public void AddComponente(NuevoComponente compo) {
		misComponentes.add(compo);
	}

	public java.util.Vector<NuevoComponente> getComponentes() {
		return misComponentes;
	}

	public void commitToDb() {
		// INI - Para resolver la llamada desde un agente
		Session session = null;
		Database currentDB = null;
		try {
			session = NotesFactory.createSession();
			currentDB = session.getCurrentDatabase();
		} catch (NotesException e1) {
			if (e1.id == 4493) {
				currentDB = JSFUtil.getCurrentDatabase();
			}
		}
		// FIN - Para resolver la llamada desde un agente

		try {
			Iterator<NuevoComponente> itr = misComponentes.iterator();
			Document newComponente;
			Document newRastreador = null;
			while (itr.hasNext()) {
				NuevoComponente currentComponente = itr.next();

				newComponente = currentDB.createDocument();
				newComponente.appendItemValue("Form", "Componente");
				newComponente.appendItemValue("idPadre_cod", currentComponente.getIdPadre_cod());
				newComponente.appendItemValue("veh_componente_nro", currentComponente.getVeh_componente_nro());
				newComponente.appendItemValue("veh_marca_cod", currentComponente.getVeh_marca_cod());
				newComponente.appendItemValue("veh_marca_des", currentComponente.getVeh_marca_des());
				newComponente.appendItemValue("veh_modelo_cod", currentComponente.getVeh_modelo_cod());
				newComponente.appendItemValue("veh_modelo_des", currentComponente.getVeh_modelo_des());
				newComponente.appendItemValue("veh_submodelo_cod", currentComponente.getVeh_submodelo_cod());
				newComponente.appendItemValue("veh_submodelo_des", currentComponente.getVeh_submodelo_des());
				newComponente.appendItemValue("veh_sumaAsegurada_nro", currentComponente.getVeh_sumaAsegurada_nro());
				newComponente.appendItemValue("veh_sumaAseguradaTablas_nro", currentComponente
						.getVeh_sumaAseguradaTablas_nro());
				newComponente.appendItemValue("veh_anio_nro", currentComponente.getVeh_anio_nro());
				newComponente.appendItemValue("veh_motor_des", currentComponente.getVeh_motor_des());
				newComponente.appendItemValue("veh_patenteTipo_cod", currentComponente.getVeh_patenteTipo_cod());
				newComponente.appendItemValue("veh_patente_des", currentComponente.getVeh_patente_des());
				newComponente.appendItemValue("veh_chasis_des", currentComponente.getVeh_chasis_des());
				newComponente.appendItemValue("veh_cobertura_cod", currentComponente.getVeh_cobertura_cod());
				newComponente.appendItemValue("veh_cobertura_des", currentComponente.getVeh_cobertura_des());
				newComponente.appendItemValue("veh_statusGaus_des", currentComponente.getVeh_statusGaus_des());
				newComponente
						.appendItemValue("veh_franquiciaValor_nro", currentComponente.getVeh_franquiciaValor_nro());
				newComponente.appendItemValue("veh_franquiciaInforma_opt", currentComponente
						.getVeh_franquiciaInforma_opt());

				newComponente.appendItemValue("veh_0km_opt", currentComponente.getVeh_0km_opt());
				newComponente.appendItemValue("veh_averias_opt", currentComponente.getVeh_averias_opt());
				newComponente.appendItemValue("veh_gnc_opt", currentComponente.getVeh_gnc_opt());
				newComponente.appendItemValue("veh_tarifa_cod", currentComponente.getVeh_tarifa_cod());
				newComponente.appendItemValue("veh_uso_cod", currentComponente.getVeh_uso_cod());
				newComponente.appendItemValue("veh_zonaRiesgo_cod", currentComponente.getVeh_zonaRiesgo_cod());
				newComponente.appendItemValue("veh_status_cod", currentComponente.getVeh_status_cod());
				newComponente.appendItemValue("veh_spwvehABM_cod", currentComponente.getVeh_spwvehABM_cod());
				newComponente.appendItemValue("veh_origen_opt", currentComponente.getVeh_origen_opt());
				newComponente.appendItemValue("veh_capitulo_nro", currentComponente.getVeh_capitulo_nro());
				newComponente.appendItemValue("veh_varianteRc_nro", currentComponente.getVeh_varianteRc_nro());
				newComponente.appendItemValue("veh_varianteAir_nro", currentComponente.getVeh_varianteAir_nro());
				newComponente.appendItemValue("veh_tarifaDiferencial_nro", currentComponente
						.getVeh_tarifaDiferencial_nro());

				newComponente.computeWithForm(true, false);
				newComponente.save();

				if (currentComponente.getRas_proveedor_opt().equals("3")
						|| currentComponente.getRas_proveedor_opt().equals("35")) {
					Document docRastreadorAnterior = currentDB.getView("vLK_RastreadorPorPatente").getDocumentByKey(
							currentComponente.getVeh_patente_des());
					if (docRastreadorAnterior != null) {

						newRastreador = currentDB.createDocument();
						newRastreador.appendItemValue("Form", "Rastreador");
						newRastreador.appendItemValue("idPadre_cod", newComponente.getUniversalID()); // Unid del vehiculo
						newRastreador.appendItemValue("idPropuesta_cod", currentComponente.getIdPadre_cod()); // Unid de propuesta
						newRastreador.appendItemValue("ras_proveedor_opt", currentComponente.getRas_proveedor_opt()); // Codigo de Proveedor

						newRastreador.appendItemValue("ras_estado_opt", docRastreadorAnterior
								.getItemValueString("ras_estado_opt")); // Estado que tiene el rastreador anterior
						newRastreador.appendItemValue("log", docRastreadorAnterior.getItemValueString("log")); // Copio Log que tiene el rastreador
																												// anterior
						newRastreador.appendItemValue("autorAdmin_acl", "[Admin]"); // Campo autor Admin
						newRastreador.appendItemValue("autor_acl", "spwAU.N3.AUTORGRP_CRUD"); // Campo autor
						newRastreador.save();

						newComponente.replaceItemValue("idRastreador_cod", newRastreador.getUniversalID());
						// System.out.println("Grabando id ras:"+ newRastreador.getUniversalID() + " en el id veh " + newComponente.getUniversalID()
						// );
						newComponente.save();
					}

				}
				// Recycle domino objects
				if (newComponente != null) {
					newComponente.recycle();
				}
				if (newRastreador != null) {
					newRastreador.recycle();
				}
				if (currentDB != null) {
					currentDB.recycle();
				}
			}
		} catch (NotesException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}