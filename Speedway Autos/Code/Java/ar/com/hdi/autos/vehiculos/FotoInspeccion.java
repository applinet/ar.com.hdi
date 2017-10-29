package ar.com.hdi.autos.vehiculos;

import java.io.Serializable;

public class FotoInspeccion implements Serializable {

	private static final long serialVersionUID = 1L;

	int intNroFoto;
	String strFormato;
	String strValorFoto;

	public FotoInspeccion() {

	}

	public FotoInspeccion(int intNroFoto, String strFormato, String strFoto) {
		super();
		this.intNroFoto = intNroFoto;
		this.strFormato = strFormato;
		this.strValorFoto = strFoto;
	}

	public int getIntNroFoto() {
		return intNroFoto;
	}

	public void setIntNroFoto(int intNroFoto) {
		this.intNroFoto = intNroFoto;
	}

	public String getStrFormato() {
		return strFormato;
	}

	public void setStrFormato(String strFormato) {
		this.strFormato = strFormato;
	}

	public String getStrValorFoto() {
		return strValorFoto;
	}

	public void setStrValorFoto(String strValorFoto) {
		this.strValorFoto = strValorFoto;
	}

}
