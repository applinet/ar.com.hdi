package ar.com.hdi.autos.vehiculos;

import java.io.Serializable;

import lotus.domino.DateTime;

public class Tarifa implements Serializable {

	private static final long serialVersionUID = 1L;

	public Tarifa() {// constructor stub

	}

	private String tarifaCod;
	private String tarifaDes;
	private DateTime tarifaDft;

	public Tarifa(String tarifaCod, String tarifaDes, DateTime tarifaDft) {
		super();
		this.tarifaCod = tarifaCod;
		this.tarifaDes = tarifaDes;
		this.tarifaDft = tarifaDft;
	}

	public String getTarifaCod() {
		return tarifaCod;
	}

	public void setTarifaCod(String tarifaCod) {
		this.tarifaCod = tarifaCod;
	}

	public String getTarifaDes() {
		return tarifaDes;
	}

	public void setTarifaDes(String tarifaDes) {
		this.tarifaDes = tarifaDes;
	}

	public DateTime getTarifaDft() {
		return tarifaDft;
	}

	public void setTarifaDft(DateTime tarifaDft) {
		this.tarifaDft = tarifaDft;
	}

}
