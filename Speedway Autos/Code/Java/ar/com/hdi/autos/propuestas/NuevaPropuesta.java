package ar.com.hdi.autos.propuestas;

import java.io.Serializable;
import java.util.Vector;

import lotus.domino.DateTime;
import lotus.domino.Document;
import lotus.domino.NotesException;
import lotus.domino.Session;

import com.ibm.domino.xsp.module.nsf.NotesContext;

public class NuevaPropuesta implements Serializable {

	private static final long serialVersionUID = 1L;

	CreateDocsNuevaPropuesta myPropuestas = new CreateDocsNuevaPropuesta();

	private DateTime fechaEnvio_nro;
	private DateTime fechaEmisionReal_nro;
	private DateTime fechaEmisionGaus_nro;

	private String sol_rama_cod = "";
	private String sol_rama_des = "";
	private String sol_articulo_cod = "";
	private String sol_articulo_des = "";

	private Integer sol_poliza_nro = 0;
	private Integer sol_cotizacion_nro = 0;
	private Integer sol_SOLNWEB_nro = 0;

	private String sol_status_cod = "";
	private String sol_status_des = "";
	private Vector<String> autor_acl;

	private String sol_tipoMovimiento_cod = "";
	private String sol_tipoMovimiento_des = "";
	private String sol_tipoOperacion_cod = "";
	private String sol_tipoOperacion_des = "";

	private DateTime sol_vigenciaDesdeCabecera_nro;
	private DateTime sol_vigenciaHastaCabecera_nro;
	private DateTime sol_vigenciaDesdeOperacion_nro;
	private DateTime sol_vigenciaHastaOperacion_nro;

	private String sol_asegurado_cod = "";
	private String sol_asegurado_des = "";
	private String sol_productor_cod = "";
	private String sol_productor_des = "";
	private String sol_productorN3_cod = "";
	private String sol_productorN3_des = "";
	private String sol_productorN5_cod = "";
	private String sol_productorN5_des = "";
	private String sol_productorN6_cod = "";
	private String sol_productorN6_des = "";

	private String sol_comentarios_des = "";
	private String log_des = "";
	private String sol_UNID_des = ""; // Id Orden Asociada
	private String idHijo_cod = ""; // Para Linkearlo en el parser de propuestas
	private String superOrden_cod = ""; // @Unique de la nueva
	private String sol_tipoEmision_opt = "0"; // Tipo de emision 0=Manual o 1=Automatica

	public String getSol_tipoEmision_opt() {
		return sol_tipoEmision_opt;
	}

	public void setSol_tipoEmision_opt(String sol_tipoEmision_opt) {
		this.sol_tipoEmision_opt = sol_tipoEmision_opt;
	}

	// Dudas
	private Integer sol_superpoliza_nro = 0;
	private Integer sol_superpolizaSuplemento_nro = 0;
	private String sol_superpolizaSuplemento_des = "";
	private Integer sol_operacion_nro = 0;
	private Integer sol_operacionSuplemento_nro = 0;

	private String univesalId = "";
	private String tarifa = "";
	private String web_icon_cod = "";

	public NuevaPropuesta() {

	}

	public NuevaPropuesta(DateTime fechaEnvio_nro, String sol_rama_cod, String sol_rama_des, String sol_articulo_cod,
			String sol_articulo_des, Integer sol_poliza_nro, Integer sol_cotizacion_nro, String sol_status_cod,
			String sol_status_des, Vector<String> autor_acl, String sol_tipoMovimiento_cod,
			String sol_tipoMovimiento_des, String sol_tipoOperacion_cod, String sol_tipoOperacion_des,
			DateTime sol_vigenciaDesdeCabecera_nro, DateTime sol_vigenciaHastaCabecera_nro,
			DateTime sol_vigenciaDesdeOperacion_nro, DateTime sol_vigenciaHastaOperacion_nro, String sol_asegurado_cod,
			String sol_asegurado_des, String sol_productor_cod, String sol_productor_des, String sol_comentarios_des,
			String log_des, String sol_UNID_des, String idHijo_cod, Integer sol_superpoliza_nro,
			Integer sol_superpolizaSuplemento_nro, String sol_superpolizaSuplemento_des, Integer sol_operacion_nro,
			Integer sol_operacionSuplemento_nro, String univesalId, String tarifa) {
		super();
		this.fechaEnvio_nro = fechaEnvio_nro;
		this.sol_rama_cod = sol_rama_cod;
		this.sol_rama_des = sol_rama_des;
		this.sol_articulo_cod = sol_articulo_cod;
		this.sol_articulo_des = sol_articulo_des;
		this.sol_poliza_nro = sol_poliza_nro;
		this.sol_cotizacion_nro = sol_cotizacion_nro;
		this.sol_status_cod = sol_status_cod;
		this.sol_status_des = sol_status_des;
		this.autor_acl = autor_acl;
		this.sol_tipoMovimiento_cod = sol_tipoMovimiento_cod;
		this.sol_tipoMovimiento_des = sol_tipoMovimiento_des;
		this.sol_tipoOperacion_cod = sol_tipoOperacion_cod;
		this.sol_tipoOperacion_des = sol_tipoOperacion_des;
		this.sol_vigenciaDesdeCabecera_nro = sol_vigenciaDesdeCabecera_nro;
		this.sol_vigenciaHastaCabecera_nro = sol_vigenciaHastaCabecera_nro;
		this.sol_vigenciaDesdeOperacion_nro = sol_vigenciaDesdeOperacion_nro;
		this.sol_vigenciaHastaOperacion_nro = sol_vigenciaHastaOperacion_nro;
		this.sol_asegurado_cod = sol_asegurado_cod;
		this.sol_asegurado_des = sol_asegurado_des;
		this.sol_productor_cod = sol_productor_cod;
		this.sol_productor_des = sol_productor_des;
		this.sol_comentarios_des = sol_comentarios_des;
		this.log_des = log_des;
		this.sol_UNID_des = sol_UNID_des;
		this.idHijo_cod = idHijo_cod;
		this.sol_superpoliza_nro = sol_superpoliza_nro;
		this.sol_superpolizaSuplemento_nro = sol_superpolizaSuplemento_nro;
		this.sol_superpolizaSuplemento_des = sol_superpolizaSuplemento_des;
		this.sol_operacion_nro = sol_operacion_nro;
		this.sol_operacionSuplemento_nro = sol_operacionSuplemento_nro;
		this.univesalId = univesalId;
		this.tarifa = tarifa;
	}

	public DateTime getFechaEnvio_nro() {
		return fechaEnvio_nro;
	}

	public void setFechaEnvio_nro(DateTime fechaEnvio_nro) {
		this.fechaEnvio_nro = fechaEnvio_nro;
	}

	public DateTime getFechaEmisionReal_nro() {
		return fechaEmisionReal_nro;
	}

	public void setFechaEmisionReal_nro(DateTime fechaEmisionReal_nro) {
		this.fechaEmisionReal_nro = fechaEmisionReal_nro;
	}

	public DateTime getFechaEmisionGaus_nro() {
		return fechaEmisionGaus_nro;
	}

	public void setFechaEmisionGaus_nro(DateTime fechaEmisionGaus_nro) {
		this.fechaEmisionGaus_nro = fechaEmisionGaus_nro;
	}

	public String getSol_rama_cod() {
		return sol_rama_cod;
	}

	public void setSol_rama_cod(String sol_rama_cod) {
		this.sol_rama_cod = sol_rama_cod;
	}

	public String getSol_rama_des() {
		return sol_rama_des;
	}

	public void setSol_rama_des(String sol_rama_des) {
		this.sol_rama_des = sol_rama_des;
	}

	public String getSol_articulo_cod() {
		return sol_articulo_cod;
	}

	public void setSol_articulo_cod(String sol_articulo_cod) {
		this.sol_articulo_cod = sol_articulo_cod;
	}

	public String getSol_articulo_des() {
		return sol_articulo_des;
	}

	public void setSol_articulo_des(String sol_articulo_des) {
		this.sol_articulo_des = sol_articulo_des;
	}

	public Integer getSol_poliza_nro() {
		return sol_poliza_nro;
	}

	public void setSol_poliza_nro(Integer sol_poliza_nro) {
		this.sol_poliza_nro = sol_poliza_nro;
	}

	public Integer getSol_cotizacion_nro() {
		return sol_cotizacion_nro;
	}

	public void setSol_cotizacion_nro(Integer sol_cotizacion_nro) {
		this.sol_cotizacion_nro = sol_cotizacion_nro;
	}

	public Integer getSol_SOLNWEB_nro() {
		return sol_SOLNWEB_nro;
	}

	public void setSol_SOLNWEB_nro(Integer sol_SOLNWEB_nro) {
		this.sol_SOLNWEB_nro = sol_SOLNWEB_nro;
	}

	public String getSol_status_cod() {
		return sol_status_cod;
	}

	public void setSol_status_cod(String sol_status_cod) {
		this.sol_status_cod = sol_status_cod;
	}

	public String getSol_status_des() {
		return sol_status_des;
	}

	public void setSol_status_des(String sol_status_des) {
		this.sol_status_des = sol_status_des;
	}

	public Vector<String> getAutor_acl() {
		return autor_acl;
	}

	public void setAutor_acl(Vector<String> autor_acl) {
		this.autor_acl = autor_acl;
	}

	public String getSol_tipoMovimiento_cod() {
		return sol_tipoMovimiento_cod;
	}

	public void setSol_tipoMovimiento_cod(String sol_tipoMovimiento_cod) {
		this.sol_tipoMovimiento_cod = sol_tipoMovimiento_cod;
	}

	public String getSol_tipoMovimiento_des() {
		return sol_tipoMovimiento_des;
	}

	public void setSol_tipoMovimiento_des(String sol_tipoMovimiento_des) {
		this.sol_tipoMovimiento_des = sol_tipoMovimiento_des;
	}

	public String getSol_tipoOperacion_cod() {
		return sol_tipoOperacion_cod;
	}

	public void setSol_tipoOperacion_cod(String sol_tipoOperacion_cod) {
		this.sol_tipoOperacion_cod = sol_tipoOperacion_cod;
	}

	public String getSol_tipoOperacion_des() {
		return sol_tipoOperacion_des;
	}

	public void setSol_tipoOperacion_des(String sol_tipoOperacion_des) {
		this.sol_tipoOperacion_des = sol_tipoOperacion_des;
	}

	public DateTime getSol_vigenciaDesdeCabecera_nro() {
		return sol_vigenciaDesdeCabecera_nro;
	}

	public void setSol_vigenciaDesdeCabecera_nro(DateTime sol_vigenciaDesdeCabecera_nro) {
		this.sol_vigenciaDesdeCabecera_nro = sol_vigenciaDesdeCabecera_nro;
	}

	public DateTime getSol_vigenciaHastaCabecera_nro() {
		return sol_vigenciaHastaCabecera_nro;
	}

	public void setSol_vigenciaHastaCabecera_nro(DateTime sol_vigenciaHastaCabecera_nro) {
		this.sol_vigenciaHastaCabecera_nro = sol_vigenciaHastaCabecera_nro;
	}

	public DateTime getSol_vigenciaDesdeOperacion_nro() {
		return sol_vigenciaDesdeOperacion_nro;
	}

	public void setSol_vigenciaDesdeOperacion_nro(DateTime sol_vigenciaDesdeOperacion_nro) {
		this.sol_vigenciaDesdeOperacion_nro = sol_vigenciaDesdeOperacion_nro;
	}

	public DateTime getSol_vigenciaHastaOperacion_nro() {
		return sol_vigenciaHastaOperacion_nro;
	}

	public void setSol_vigenciaHastaOperacion_nro(DateTime sol_vigenciaHastaOperacion_nro) {
		this.sol_vigenciaHastaOperacion_nro = sol_vigenciaHastaOperacion_nro;
	}

	public String getSol_asegurado_cod() {
		return sol_asegurado_cod;
	}

	public void setSol_asegurado_cod(String sol_asegurado_cod) {
		this.sol_asegurado_cod = sol_asegurado_cod;
	}

	public String getSol_asegurado_des() {
		return sol_asegurado_des;
	}

	public void setSol_asegurado_des(String sol_asegurado_des) {
		this.sol_asegurado_des = sol_asegurado_des;
	}

	public String getSol_productor_cod() {
		return sol_productor_cod;
	}

	public void setSol_productor_cod(String sol_productor_cod) {
		this.sol_productor_cod = sol_productor_cod;
	}

	public String getSol_productor_des() {
		return sol_productor_des;
	}

	public void setSol_productor_des(String sol_productor_des) {
		this.sol_productor_des = sol_productor_des;
	}

	public String getSol_productorN3_cod() {
		return sol_productorN3_cod;
	}

	public void setSol_productorN3_cod(String sol_productorN3_cod) {
		this.sol_productorN3_cod = sol_productorN3_cod;
	}

	public String getSol_productorN3_des() {
		return sol_productorN3_des;
	}

	public void setSol_productorN3_des(String sol_productorN3_des) {
		this.sol_productorN3_des = sol_productorN3_des;
	}

	public String getSol_productorN5_cod() {
		return sol_productorN5_cod;
	}

	public void setSol_productorN5_cod(String sol_productorN5_cod) {
		this.sol_productorN5_cod = sol_productorN5_cod;
	}

	public String getSol_productorN5_des() {
		return sol_productorN5_des;
	}

	public void setSol_productorN5_des(String sol_productorN5_des) {
		this.sol_productorN5_des = sol_productorN5_des;
	}

	public String getSol_productorN6_cod() {
		return sol_productorN6_cod;
	}

	public void setSol_productorN6_cod(String sol_productorN6_cod) {
		this.sol_productorN6_cod = sol_productorN6_cod;
	}

	public String getSol_productorN6_des() {
		return sol_productorN6_des;
	}

	public void setSol_productorN6_des(String sol_productorN6_des) {
		this.sol_productorN6_des = sol_productorN6_des;
	}

	public String getSol_comentarios_des() {
		return sol_comentarios_des;
	}

	public void setSol_comentarios_des(String sol_comentarios_des) {
		this.sol_comentarios_des = sol_comentarios_des;
	}

	public String getLog_des() {
		return log_des;
	}

	public void setLog_des(String log_des) {
		this.log_des = log_des;
	}

	public String getSol_UNID_des() {
		return sol_UNID_des;
	}

	public void setSol_UNID_des(String sol_UNID_des) {
		this.sol_UNID_des = sol_UNID_des;
	}

	public String getIdHijo_cod() {
		return idHijo_cod;
	}

	public void setIdHijo_cod(String idHijo_cod) {
		this.idHijo_cod = idHijo_cod;
	}

	public String getSuperOrden_cod() {
		return superOrden_cod;
	}

	public void setSuperOrden_cod(String superOrden_cod) {
		this.superOrden_cod = superOrden_cod;
	}

	public Integer getSol_superpoliza_nro() {
		return sol_superpoliza_nro;
	}

	public void setSol_superpoliza_nro(Integer sol_superpoliza_nro) {
		this.sol_superpoliza_nro = sol_superpoliza_nro;
	}

	public Integer getSol_superpolizaSuplemento_nro() {
		return sol_superpolizaSuplemento_nro;
	}

	public void setSol_superpolizaSuplemento_nro(Integer sol_superpolizaSuplemento_nro) {
		this.sol_superpolizaSuplemento_nro = sol_superpolizaSuplemento_nro;
	}

	public String getSol_superpolizaSuplemento_des() {
		return sol_superpolizaSuplemento_des;
	}

	public void setSol_superpolizaSuplemento_des(String sol_superpolizaSuplemento_des) {
		this.sol_superpolizaSuplemento_des = sol_superpolizaSuplemento_des;
	}

	public Integer getSol_operacion_nro() {
		return sol_operacion_nro;
	}

	public void setSol_operacion_nro(Integer sol_operacion_nro) {
		this.sol_operacion_nro = sol_operacion_nro;
	}

	public Integer getSol_operacionSuplemento_nro() {
		return sol_operacionSuplemento_nro;
	}

	public void setSol_operacionSuplemento_nro(Integer sol_operacionSuplemento_nro) {
		this.sol_operacionSuplemento_nro = sol_operacionSuplemento_nro;
	}

	public static long getSerialVersionUID() {
		return serialVersionUID;
	}

	public String getUnivesalId() {
		return univesalId;
	}

	public String getTarifa() {
		return tarifa;
	}

	public void setTarifa(String tarifa) {
		this.tarifa = tarifa;
	}

	public String getWeb_icon_cod() {
		return web_icon_cod;
	}

	public void setWeb_icon_cod(String web_icon_cod) {
		this.web_icon_cod = web_icon_cod;
	}

	public void setUnivesalId(String univesalId) {
		this.univesalId = univesalId;
	}

	public String setMyPropuesta(Document docPropuestaHija, DateTime prm_dtVigDesdeCabPropuestaNueva,
			DateTime prm_dtVigHastaCabPropuestaNueva, DateTime prm_dtVigDesdeOpePropuestaNueva,
			DateTime prm_dtVigHastaOpePropuestaNueva, String prm_status_cod, String prm_status_des,
			String prm_tipoMovimiento_cod, String prm_tipoOperacion_cod, Vector<String> prm_autor_acl, String prm_tarifa) {

		NuevaPropuesta myPropuesta = new NuevaPropuesta();

		NotesContext ctx = NotesContext.getCurrent();
		Session session = ctx.getCurrentSession();

		try {
			myPropuesta.setFechaEnvio_nro(session.createDateTime("Today"));
			myPropuesta.setSol_articulo_cod(docPropuestaHija.getItemValueString("sol_articulo_cod"));
			myPropuesta.setSol_articulo_des(docPropuestaHija.getItemValueString("sol_articulo_des"));
			myPropuesta.setSol_rama_cod(docPropuestaHija.getItemValueString("sol_rama_cod"));
			myPropuesta.setSol_poliza_nro(docPropuestaHija.getItemValueInteger("sol_poliza_nro"));
			myPropuesta.setSol_status_cod(prm_status_cod);
			myPropuesta.setSol_status_des(prm_status_des);
			myPropuesta.setAutor_acl(prm_autor_acl);
			if (prm_tipoMovimiento_cod.equals("1")) {
				myPropuesta.setSuperOrden_cod(session.evaluate("@Unique").elementAt(0).toString());
			} else {
				myPropuesta.setSuperOrden_cod(docPropuestaHija.getItemValueString("superOrden_cod"));
			}

			myPropuesta.setSol_tipoMovimiento_cod(prm_tipoMovimiento_cod);
			myPropuesta.setSol_tipoOperacion_cod(prm_tipoOperacion_cod);

			myPropuesta.setTarifa(prm_tarifa);
			// myPropuesta.setWeb_icon_cod(docPropuestaHija.getItemValueString("web_icon_cod"));

			myPropuesta.setSol_vigenciaDesdeCabecera_nro(prm_dtVigDesdeCabPropuestaNueva);
			myPropuesta.setSol_vigenciaHastaCabecera_nro(prm_dtVigHastaCabPropuestaNueva);
			myPropuesta.setSol_vigenciaDesdeOperacion_nro(prm_dtVigDesdeOpePropuestaNueva);
			myPropuesta.setSol_vigenciaHastaOperacion_nro(prm_dtVigHastaOpePropuestaNueva);

			myPropuesta.setSol_asegurado_cod(docPropuestaHija.getItemValueString("sol_asegurado_cod"));
			myPropuesta.setSol_asegurado_des(docPropuestaHija.getItemValueString("sol_asegurado_des"));
			myPropuesta.setSol_productor_cod(docPropuestaHija.getItemValueString("sol_productor_cod"));
			myPropuesta.setSol_productor_des(docPropuestaHija.getItemValueString("sol_productor_des"));
			myPropuesta.setSol_comentarios_des(docPropuestaHija.getItemValueString("sol_comentarios_des"));
			myPropuesta.setSol_UNID_des(docPropuestaHija.getItemValueString("sol_UNID_des"));
			// Dudas
			myPropuesta.setSol_superpoliza_nro(docPropuestaHija.getItemValueInteger("sol_superpoliza_nro"));
			myPropuesta.setSol_superpolizaSuplemento_nro(docPropuestaHija
					.getItemValueInteger("sol_superpolizaSuplemento_nro"));
			myPropuesta.setSol_superpolizaSuplemento_des(docPropuestaHija
					.getItemValueString("sol_superpolizaSuplemento_des"));
			myPropuesta.setSol_operacion_nro(docPropuestaHija.getItemValueInteger("sol_operacion_nro"));
			myPropuesta.setSol_operacionSuplemento_nro(docPropuestaHija
					.getItemValueInteger("sol_operacionSuplemento_nro"));

			myPropuestas.AddPropuesta(myPropuesta); // Agrego el componente a la lista

		} catch (NotesException e) {
			e.printStackTrace();
		}

		return myPropuestas.commitToDb(true); // Grabo en la base y devuelvo UNID del nuevo doc
	}
}
