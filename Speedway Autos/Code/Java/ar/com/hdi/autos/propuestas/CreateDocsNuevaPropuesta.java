package ar.com.hdi.autos.propuestas;

import java.io.Serializable;
import java.util.Iterator;
import java.util.Vector;

import lotus.domino.Database;
import lotus.domino.Document;
import lotus.domino.NotesException;
import lotus.domino.NotesFactory;
import lotus.domino.Session;
import ar.com.hdi.autos.utilidades.JSFUtil;
import ar.com.hdi.autos.webservice.WsVehPol;

public class CreateDocsNuevaPropuesta implements Serializable {

	private static final long serialVersionUID = 1L;

	private final Vector<NuevaPropuesta> misPropuestas;

	// Class Constructor...
	public CreateDocsNuevaPropuesta() {
		misPropuestas = new Vector<NuevaPropuesta>();
	}

	public void AddPropuesta() {
		misPropuestas.add(new NuevaPropuesta());
	}

	public void AddPropuesta(NuevaPropuesta prop) {
		misPropuestas.add(prop);
	}

	public java.util.Vector<NuevaPropuesta> getPropuestas() {
		return misPropuestas;
	}

	public String commitToDb(boolean booProcesarVehiculos) {
		String id = "";
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
			Iterator<NuevaPropuesta> itr = misPropuestas.iterator();
			Document newPropuesta;
			while (itr.hasNext()) {
				NuevaPropuesta propuesta = itr.next();

				newPropuesta = currentDB.createDocument();
				newPropuesta.appendItemValue("Form", "Propuesta");
				newPropuesta.appendItemValue("fechaEnvio_nro", propuesta.getFechaEnvio_nro());
				newPropuesta.appendItemValue("fechaEmisionReal_nro", propuesta.getFechaEmisionReal_nro());
				newPropuesta.appendItemValue("fechaEmisionGaus_nro", propuesta.getFechaEmisionGaus_nro());
				newPropuesta.appendItemValue("sol_status_cod", propuesta.getSol_status_cod());
				newPropuesta.appendItemValue("sol_status_des", propuesta.getSol_status_des());
				newPropuesta.appendItemValue("autor_acl", propuesta.getAutor_acl());

				newPropuesta.appendItemValue("sol_tipoMovimiento_cod", propuesta.getSol_tipoMovimiento_cod());
				newPropuesta.appendItemValue("sol_tipoMovimiento_des", propuesta.getSol_tipoMovimiento_des());
				newPropuesta.appendItemValue("sol_tipoOperacion_cod", propuesta.getSol_tipoOperacion_cod());
				newPropuesta.appendItemValue("sol_tipoOperacion_des", propuesta.getSol_tipoOperacion_des());

				newPropuesta.appendItemValue("sol_articulo_cod", propuesta.getSol_articulo_cod());
				newPropuesta.appendItemValue("sol_articulo_des", propuesta.getSol_articulo_des());
				newPropuesta.appendItemValue("sol_rama_cod", propuesta.getSol_rama_cod());
				newPropuesta.appendItemValue("sol_rama_des", propuesta.getSol_rama_des());
				newPropuesta.appendItemValue("sol_poliza_nro", propuesta.getSol_poliza_nro());
				newPropuesta.appendItemValue("sol_cotizacion_nro", propuesta.getSol_cotizacion_nro());
				newPropuesta.appendItemValue("sol_SOLNWEB_nro", propuesta.getSol_SOLNWEB_nro());
				newPropuesta.appendItemValue("superOrden_cod", propuesta.getSuperOrden_cod());

				newPropuesta.appendItemValue("sol_vigenciaDesdeCabecera_nro", propuesta
						.getSol_vigenciaDesdeCabecera_nro());
				newPropuesta.appendItemValue("sol_vigenciaHastaCabecera_nro", propuesta
						.getSol_vigenciaHastaCabecera_nro());
				newPropuesta.appendItemValue("sol_vigenciaDesdeOperacion_nro", propuesta
						.getSol_vigenciaDesdeOperacion_nro());
				newPropuesta.appendItemValue("sol_vigenciaHastaOperacion_nro", propuesta
						.getSol_vigenciaHastaOperacion_nro());

				newPropuesta.appendItemValue("sol_asegurado_cod", propuesta.getSol_asegurado_cod());
				newPropuesta.appendItemValue("sol_asegurado_des", propuesta.getSol_asegurado_des());
				newPropuesta.appendItemValue("sol_productor_cod", propuesta.getSol_productor_cod());
				newPropuesta.appendItemValue("sol_productor_des", propuesta.getSol_productor_des());
				newPropuesta.appendItemValue("sol_comentarios_des", propuesta.getSol_comentarios_des());
				newPropuesta.appendItemValue("sol_tipoEmision_opt", propuesta.getSol_tipoEmision_opt());
				newPropuesta.appendItemValue("log_des", propuesta.getLog_des());
				// newPropuesta.appendItemValue("sol_UNID_des", propuesta.getSol_UNID_des());

				// Dudas
				newPropuesta.appendItemValue("sol_superpoliza_nro", propuesta.getSol_superpoliza_nro());
				newPropuesta.appendItemValue("sol_superpolizaSuplemento_nro", propuesta
						.getSol_superpolizaSuplemento_nro());
				newPropuesta.appendItemValue("sol_superpolizaSuplemento_des", propuesta
						.getSol_superpolizaSuplemento_des());
				newPropuesta.appendItemValue("sol_operacion_nro", propuesta.getSol_operacion_nro());
				newPropuesta.appendItemValue("sol_operacionSuplemento_nro", propuesta.getSol_operacionSuplemento_nro());
				newPropuesta.appendItemValue("web_icon_cod", propuesta.getWeb_icon_cod());

				newPropuesta.computeWithForm(true, false);
				newPropuesta.save();
				newPropuesta.appendItemValue("tarifa", propuesta.getTarifa());
				id = newPropuesta.getUniversalID(); // Obtengo el UNID del doc Creado
				if (booProcesarVehiculos)
					WsVehPol.comenzar("wsComponentesEnPoliza", newPropuesta);

				currentDB.getAgent("a.ObtCorr").runWithDocumentContext(newPropuesta);
				// Si tengo seteado el hijo lo linkeo
				if (!propuesta.getIdHijo_cod().equals("")) {
					Document docHijo = currentDB.getDocumentByUNID(propuesta.getIdHijo_cod());
					docHijo.replaceItemValue("idPadre_cod", id);
					docHijo.save();
					docHijo.recycle();
				}
				newPropuesta.recycle();

			}
		} catch (NotesException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return id;
	}
}
