/**
 * @author Rodrigfer
 */
package ar.com.hdi.autos.vehiculos;

import java.io.Serializable;

public class NuevoComponente implements Serializable {

	private static final long serialVersionUID = 1L;

	private String idPadre_cod;
	private Integer veh_componente_nro;
	private String veh_marca_cod;
	private String veh_marca_des;
	private String veh_modelo_cod;
	private String veh_modelo_des;
	private String veh_submodelo_cod;
	private String veh_submodelo_des;
	private Float veh_sumaAsegurada_nro;
	private Float veh_sumaAseguradaTablas_nro;
	private String veh_anio_nro;
	private String veh_motor_des;
	private String veh_patenteTipo_cod;
	private String veh_patente_des;
	private String veh_chasis_des;
	private String veh_cobertura_cod;
	private String veh_cobertura_des;
	private String veh_statusGaus_des;
	private Float veh_franquiciaValor_nro;
	private String veh_franquiciaInforma_opt;
	private String veh_0km_opt;
	private String veh_averias_opt;
	private String veh_gnc_opt;
	private String veh_tarifa_cod;
	private String veh_uso_cod;
	private String veh_zonaRiesgo_cod;
	private String veh_status_cod;
	private String veh_spwvehABM_cod;

	private String veh_origen_opt;
	private String veh_capitulo_nro;
	private String veh_varianteRc_nro;
	private String veh_varianteAir_nro;
	private String veh_tarifaDiferencial_nro;
	private String ras_proveedor_opt;

	public NuevoComponente() {
		this.setVeh_0km_opt("0");
	}

	public NuevoComponente(String idPadre_cod, Integer veh_componente_nro, String veh_marca_cod, String veh_marca_des,
			String veh_modelo_cod, String veh_modelo_des, String veh_submodelo_cod, String veh_submodelo_des,
			Float veh_sumaAsegurada_nro, Float veh_sumaAseguradaTablas_nro, String veh_anio_nro, String veh_motor_des,
			String veh_patenteTipo_cod, String veh_patente_des, String veh_chasis_des, String veh_cobertura_cod,
			String veh_cobertura_des, String veh_statusGaus_des, Float veh_franquiciaValor_nro,
			String veh_franquiciaInforma_opt, String veh_0km_opt, String veh_averias_opt, String veh_gnc_opt,
			String veh_tarifa_cod, String veh_uso_cod, String veh_zonaRiesgo_cod, String veh_status_cod,
			String veh_spwvehABM_cod, String veh_origen_opt, String veh_capitulo_nro, String veh_varianteRc_nro,
			String veh_varianteAir_nro, String veh_tarifaDiferencial_nro) {
		super();
		this.idPadre_cod = idPadre_cod;
		this.veh_componente_nro = veh_componente_nro;
		this.veh_marca_cod = veh_marca_cod;
		this.veh_marca_des = veh_marca_des;
		this.veh_modelo_cod = veh_modelo_cod;
		this.veh_modelo_des = veh_modelo_des;
		this.veh_submodelo_cod = veh_submodelo_cod;
		this.veh_submodelo_des = veh_submodelo_des;
		this.veh_sumaAsegurada_nro = veh_sumaAsegurada_nro;
		this.veh_sumaAseguradaTablas_nro = veh_sumaAseguradaTablas_nro;
		this.veh_anio_nro = veh_anio_nro;
		this.veh_motor_des = veh_motor_des;
		this.veh_patenteTipo_cod = veh_patenteTipo_cod;
		this.veh_patente_des = veh_patente_des;
		this.veh_chasis_des = veh_chasis_des;
		this.veh_cobertura_cod = veh_cobertura_cod;
		this.veh_cobertura_des = veh_cobertura_des;
		this.veh_statusGaus_des = veh_statusGaus_des;
		this.veh_franquiciaValor_nro = veh_franquiciaValor_nro;
		this.veh_franquiciaInforma_opt = veh_franquiciaInforma_opt;
		this.veh_0km_opt = veh_0km_opt;
		this.veh_averias_opt = veh_averias_opt;
		this.veh_gnc_opt = veh_gnc_opt;
		this.veh_tarifa_cod = veh_tarifa_cod;
		this.veh_uso_cod = veh_uso_cod;
		this.veh_zonaRiesgo_cod = veh_zonaRiesgo_cod;
		this.veh_status_cod = veh_status_cod;
		this.veh_spwvehABM_cod = veh_spwvehABM_cod;
		this.veh_origen_opt = veh_origen_opt;
		this.veh_capitulo_nro = veh_capitulo_nro;
		this.veh_varianteRc_nro = veh_varianteRc_nro;
		this.veh_varianteAir_nro = veh_varianteAir_nro;
		this.veh_tarifaDiferencial_nro = veh_tarifaDiferencial_nro;
	}

	public String getIdPadre_cod() {
		return idPadre_cod;
	}

	public void setIdPadre_cod(String idPadre_cod) {
		this.idPadre_cod = idPadre_cod;
	}

	public Integer getVeh_componente_nro() {
		return veh_componente_nro;
	}

	public void setVeh_componente_nro(Integer veh_componente_nro) {
		this.veh_componente_nro = veh_componente_nro;
	}

	public String getVeh_marca_cod() {
		return veh_marca_cod;
	}

	public void setVeh_marca_cod(String veh_marca_cod) {
		this.veh_marca_cod = veh_marca_cod;
	}

	public String getVeh_marca_des() {
		return veh_marca_des;
	}

	public void setVeh_marca_des(String veh_marca_des) {
		this.veh_marca_des = veh_marca_des;
	}

	public String getVeh_modelo_cod() {
		return veh_modelo_cod;
	}

	public void setVeh_modelo_cod(String veh_modelo_cod) {
		this.veh_modelo_cod = veh_modelo_cod;
	}

	public String getVeh_modelo_des() {
		return veh_modelo_des;
	}

	public void setVeh_modelo_des(String veh_modelo_des) {
		this.veh_modelo_des = veh_modelo_des;
	}

	public String getVeh_submodelo_cod() {
		return veh_submodelo_cod;
	}

	public void setVeh_submodelo_cod(String veh_submodelo_cod) {
		this.veh_submodelo_cod = veh_submodelo_cod;
	}

	public String getVeh_submodelo_des() {
		return veh_submodelo_des;
	}

	public void setVeh_submodelo_des(String veh_submodelo_des) {
		this.veh_submodelo_des = veh_submodelo_des;
	}

	public Float getVeh_sumaAsegurada_nro() {
		return veh_sumaAsegurada_nro;
	}

	public void setVeh_sumaAsegurada_nro(Float veh_sumaAsegurada_nro) {
		this.veh_sumaAsegurada_nro = veh_sumaAsegurada_nro;
	}

	public Float getVeh_sumaAseguradaTablas_nro() {
		return veh_sumaAseguradaTablas_nro;
	}

	public void setVeh_sumaAseguradaTablas_nro(Float veh_sumaAseguradaTablas_nro) {
		this.veh_sumaAseguradaTablas_nro = veh_sumaAseguradaTablas_nro;
	}

	public String getVeh_anio_nro() {
		return veh_anio_nro;
	}

	public void setVeh_anio_nro(String veh_anio_nro) {
		this.veh_anio_nro = veh_anio_nro;
	}

	public String getVeh_motor_des() {
		return veh_motor_des;
	}

	public void setVeh_motor_des(String veh_motor_des) {
		this.veh_motor_des = veh_motor_des;
	}

	public String getVeh_patenteTipo_cod() {
		return veh_patenteTipo_cod;
	}

	public void setVeh_patenteTipo_cod(String veh_patenteTipo_cod) {
		this.veh_patenteTipo_cod = veh_patenteTipo_cod;
	}

	public String getVeh_patente_des() {
		return veh_patente_des;
	}

	public void setVeh_patente_des(String veh_patente_des) {
		this.veh_patente_des = veh_patente_des;
	}

	public String getVeh_chasis_des() {
		return veh_chasis_des;
	}

	public void setVeh_chasis_des(String veh_chasis_des) {
		this.veh_chasis_des = veh_chasis_des;
	}

	public String getVeh_cobertura_cod() {
		return veh_cobertura_cod;
	}

	public void setVeh_cobertura_cod(String veh_cobertura_cod) {
		this.veh_cobertura_cod = veh_cobertura_cod;
	}

	public String getVeh_cobertura_des() {
		return veh_cobertura_des;
	}

	public void setVeh_cobertura_des(String veh_cobertura_des) {
		this.veh_cobertura_des = veh_cobertura_des;
	}

	public String getVeh_statusGaus_des() {
		return veh_statusGaus_des;
	}

	public void setVeh_statusGaus_des(String veh_statusGaus_des) {
		this.veh_statusGaus_des = veh_statusGaus_des;
	}

	public Float getVeh_franquiciaValor_nro() {
		return veh_franquiciaValor_nro;
	}

	public void setVeh_franquiciaValor_nro(Float veh_franquiciaValor_nro) {
		this.veh_franquiciaValor_nro = veh_franquiciaValor_nro;
	}

	public String getVeh_franquiciaInforma_opt() {
		return veh_franquiciaInforma_opt;
	}

	public void setVeh_franquiciaInforma_opt(String veh_franquiciaInforma_opt) {
		this.veh_franquiciaInforma_opt = veh_franquiciaInforma_opt;
	}

	public String getVeh_0km_opt() {
		return veh_0km_opt;
	}

	public void setVeh_0km_opt(String veh_0km_opt) {
		this.veh_0km_opt = veh_0km_opt;
	}

	public String getVeh_averias_opt() {
		return veh_averias_opt;
	}

	public void setVeh_averias_opt(String veh_averias_opt) {
		this.veh_averias_opt = veh_averias_opt;
	}

	public String getVeh_gnc_opt() {
		return veh_gnc_opt;
	}

	public void setVeh_gnc_opt(String veh_gnc_opt) {
		this.veh_gnc_opt = veh_gnc_opt;
	}

	public String getVeh_tarifa_cod() {
		return veh_tarifa_cod;
	}

	public void setVeh_tarifa_cod(String veh_tarifa_cod) {
		this.veh_tarifa_cod = veh_tarifa_cod;
	}

	public String getVeh_uso_cod() {
		return veh_uso_cod;
	}

	public void setVeh_uso_cod(String veh_uso_cod) {
		this.veh_uso_cod = veh_uso_cod;
	}

	public String getVeh_zonaRiesgo_cod() {
		return veh_zonaRiesgo_cod;
	}

	public void setVeh_zonaRiesgo_cod(String veh_zonaRiesgo_cod) {
		this.veh_zonaRiesgo_cod = veh_zonaRiesgo_cod;
	}

	public String getVeh_status_cod() {
		return veh_status_cod;
	}

	public void setVeh_status_cod(String veh_status_cod) {
		this.veh_status_cod = veh_status_cod;
	}

	public String getVeh_spwvehABM_cod() {
		return veh_spwvehABM_cod;
	}

	public void setVeh_spwvehABM_cod(String veh_spwvehABM_cod) {
		this.veh_spwvehABM_cod = veh_spwvehABM_cod;
	}

	public String getVeh_origen_opt() {
		return veh_origen_opt;
	}

	public void setVeh_origen_opt(String veh_origen_opt) {
		this.veh_origen_opt = veh_origen_opt;
	}

	public String getVeh_capitulo_nro() {
		return veh_capitulo_nro;
	}

	public void setVeh_capitulo_nro(String veh_capitulo_nro) {
		this.veh_capitulo_nro = veh_capitulo_nro;
	}

	public String getVeh_varianteRc_nro() {
		return veh_varianteRc_nro;
	}

	public void setVeh_varianteRc_nro(String veh_varianteRc_nro) {
		this.veh_varianteRc_nro = veh_varianteRc_nro;
	}

	public String getVeh_varianteAir_nro() {
		return veh_varianteAir_nro;
	}

	public void setVeh_varianteAir_nro(String veh_varianteAir_nro) {
		this.veh_varianteAir_nro = veh_varianteAir_nro;
	}

	public String getVeh_tarifaDiferencial_nro() {
		return veh_tarifaDiferencial_nro;
	}

	public void setVeh_tarifaDiferencial_nro(String veh_tarifaDiferencial_nro) {
		this.veh_tarifaDiferencial_nro = veh_tarifaDiferencial_nro;
	}

	public static long getSerialVersionUID() {
		return serialVersionUID;
	}

	public String getRas_proveedor_opt() {
		return ras_proveedor_opt;
	}

	public void setRas_proveedor_opt(String ras_proveedor_opt) {
		this.ras_proveedor_opt = ras_proveedor_opt;
	}

}