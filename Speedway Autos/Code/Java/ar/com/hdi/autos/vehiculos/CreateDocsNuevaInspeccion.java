package ar.com.hdi.autos.vehiculos;

import java.io.Serializable;

import lotus.domino.Database;
import lotus.domino.Document;
import lotus.domino.NotesException;
import lotus.domino.NotesFactory;
import lotus.domino.Session;
import ar.com.hdi.autos.utilidades.JSFUtil;

public class CreateDocsNuevaInspeccion implements Serializable {

	private static final long serialVersionUID = 1L;

	public CreateDocsNuevaInspeccion() {

	}

	public String commitToDb(NuevoTecnored myInspeccion) {
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
			Document newInspeccion;
			newInspeccion = currentDB.createDocument();
			newInspeccion.appendItemValue("Form", "f.Inspeccion");
			newInspeccion.appendItemValue("ins_Tipo_cod", "20");
			newInspeccion.appendItemValue("ins_Tipo_des", "Previa");
			newInspeccion.appendItemValue("ins_iEstRegreso_cod", "10");
			newInspeccion.appendItemValue("ins_Log_des", session.createDateTime("Today 12").toString()
					+ " - Inspección generada automáticamente. ");
			newInspeccion.appendItemValue("ins_Inspect_opt", "TecnoRed");
			newInspeccion.appendItemValue("ins_iCoordInspector_des", "1");
			newInspeccion.appendItemValue("ins_iEst_cod", "20");
			newInspeccion.appendItemValue("ins_iEst_des", "Enviada");
			newInspeccion.appendItemValue("ins_iEnvioFecha_dat", session.createDateTime("Today 12"));
			newInspeccion.appendItemValue("ins_VehPatNro_des", myInspeccion.getVehiculo_dominio());

			newInspeccion.computeWithForm(true, false);
			newInspeccion.save();
			id = newInspeccion.getUniversalID(); // Obtengo el UNID del doc Creado
			currentDB.getAgent("a.ObtCorr").runWithDocumentContext(newInspeccion);

		} catch (NotesException e) {
			e.printStackTrace();
		}
		return id;

	}

}
