package ar.com.hdi.autos.propuestas;

import java.io.Serializable;

import lotus.domino.Database;
import lotus.domino.Document;
import lotus.domino.NotesException;
import ar.com.hdi.autos.utilidades.JSFUtil;

public class DocPropuesta implements Serializable {

	private static final long serialVersionUID = 1L;

	public DocPropuesta() {

	}

	private Document doc;
	private Database db;

	public Document getCreatedPropuesta(Propuesta propuesta) {
		try {
			db = JSFUtil.getCurrentDatabase();
			doc = db.createDocument();
			doc.replaceItemValue("Form", "Propuesta");
			replaceValues(doc, propuesta); // Helper method
		} catch (NotesException e) {
			e.printStackTrace();
		}
		return doc;
	}

	// Helper method
	private void replaceValues(Document doc, Propuesta propuesta) {
		try {
			doc.replaceItemValue("fechaEnvio_nro", propuesta.getFechaEnvio_nro());
			doc.replaceItemValue("sol_rama_cod", propuesta.getSol_rama_cod());
			doc.replaceItemValue("sol_rama_des", propuesta.getSol_rama_des());
			doc.replaceItemValue("sol_articulo_cod", propuesta.getSol_articulo_cod());
			doc.replaceItemValue("sol_articulo_des", propuesta.getSol_articulo_des());
			doc.replaceItemValue("sol_poliza_nro", propuesta.getSol_poliza_nro());
			doc.replaceItemValue("sol_cotizacion_nro", propuesta.getSol_cotizacion_nro());
			doc.replaceItemValue("sol_SOLNWEB_nro", propuesta.getSol_SOLNWEB_nro());
			doc.replaceItemValue("sol_status_cod", propuesta.getSol_status_cod());
			doc.replaceItemValue("sol_status_des", propuesta.getSol_status_des());
			doc.replaceItemValue("sol_tipoMovimiento_cod", propuesta.getSol_tipoMovimiento_cod());
			doc.replaceItemValue("sol_tipoMovimiento_des", propuesta.getSol_tipoMovimiento_des());
			doc.replaceItemValue("sol_tipoOperacion_cod", propuesta.getSol_tipoOperacion_cod());
			doc.replaceItemValue("sol_tipoOperacion_des", propuesta.getSol_tipoOperacion_des());
			doc.replaceItemValue("sol_vigenciaDesdeCabecera_nro", propuesta.getSol_vigenciaDesdeCabecera_nro());
			doc.replaceItemValue("sol_vigenciaHastaCabecera_nro", propuesta.getSol_vigenciaHastaCabecera_nro());
			doc.replaceItemValue("sol_vigenciaDesdeOperacion_nro", propuesta.getSol_vigenciaDesdeOperacion_nro());
			doc.replaceItemValue("sol_vigenciaHastaOperacion_nro", propuesta.getSol_vigenciaHastaOperacion_nro());
			doc.replaceItemValue("sol_asegurado_cod", propuesta.getSol_asegurado_cod());
			doc.replaceItemValue("sol_asegurado_des", propuesta.getSol_asegurado_des());
			doc.replaceItemValue("sol_productor_cod", propuesta.getSol_productor_cod());
			doc.replaceItemValue("sol_productor_des", propuesta.getSol_productor_des());
			doc.replaceItemValue("sol_comentarios_des", propuesta.getSol_comentarios_des());
			doc.replaceItemValue("sol_UNID_des", propuesta.getSol_UNID_des());
			doc.replaceItemValue("sol_superpoliza_nro", propuesta.getSol_superpoliza_nro());
			doc.replaceItemValue("sol_superpolizaSuplemento_nro", propuesta.getSol_superpolizaSuplemento_nro());
			doc.replaceItemValue("sol_superpolizaSuplemento_des", propuesta.getSol_superpolizaSuplemento_des());
			doc.replaceItemValue("sol_operacion_nro", propuesta.getSol_operacion_nro());
			doc.replaceItemValue("sol_operacionSuplemento_nro", propuesta.getSol_operacionSuplemento_nro());
			doc.computeWithForm(true, false);
			doc.save();
		} catch (Exception e) {
			System.out.println("ERROR: " + e.getMessage());
		}
	}

}
