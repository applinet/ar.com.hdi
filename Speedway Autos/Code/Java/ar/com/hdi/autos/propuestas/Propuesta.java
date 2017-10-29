package ar.com.hdi.autos.propuestas;

import java.io.Serializable;

import lotus.domino.DateTime;
import lotus.domino.Document;

public class Propuesta implements Serializable {

	private static final long serialVersionUID = 1L;

	public Propuesta() {
		// Constructor vacio
	}

	private DateTime fechaEnvio_nro;
	private String sol_rama_cod = "";
	private String sol_rama_des = "";
	private String sol_articulo_cod = "";
	private String sol_articulo_des = "";

	private Integer sol_poliza_nro = 0;
	private String sol_cotizacion_nro = "";
	private String sol_SOLNWEB_nro = "";

	private String sol_status_cod = "";
	private String sol_status_des = "";

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

	private String sol_comentarios_des = "";
	private String sol_UNID_des = ""; // Id Orden Asociada

	// Dudas
	private Integer sol_superpoliza_nro = 0;
	private Integer sol_superpolizaSuplemento_nro = 0;
	private String sol_superpolizaSuplemento_des = "";
	private Integer sol_operacion_nro = 0;
	private Integer sol_operacionSuplemento_nro = 0;

	public DateTime getFechaEnvio_nro() {
		return fechaEnvio_nro;
	}

	public void setFechaEnvio_nro(DateTime fechaEnvio_nro) {
		this.fechaEnvio_nro = fechaEnvio_nro;
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

	public String getSol_cotizacion_nro() {
		return sol_cotizacion_nro;
	}

	public void setSol_cotizacion_nro(String sol_cotizacion_nro) {
		this.sol_cotizacion_nro = sol_cotizacion_nro;
	}

	public String getSol_SOLNWEB_nro() {
		return sol_SOLNWEB_nro;
	}

	public void setSol_SOLNWEB_nro(String sol_SOLNWEB_nro) {
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

	public String getSol_comentarios_des() {
		return sol_comentarios_des;
	}

	public void setSol_comentarios_des(String sol_comentarios_des) {
		this.sol_comentarios_des = sol_comentarios_des;
	}

	public String getSol_UNID_des() {
		return sol_UNID_des;
	}

	public void setSol_UNID_des(String sol_UNID_des) {
		this.sol_UNID_des = sol_UNID_des;
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

	// Devuelvo el NotesDocument creado en DocPropuesta
	public Document getPropuesta(Propuesta propuesta) {
		DocPropuesta docPropuesta = new DocPropuesta();
		return docPropuesta.getCreatedPropuesta(propuesta);
	}
}
