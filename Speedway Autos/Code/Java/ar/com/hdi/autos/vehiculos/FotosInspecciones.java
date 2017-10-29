package ar.com.hdi.autos.vehiculos;

import java.io.Serializable;
import java.util.Vector;

public class FotosInspecciones implements Serializable {

	private static final long serialVersionUID = 1L;

	private final Vector<FotoInspeccion> misFotos;

	// Class Constructor...
	public FotosInspecciones() {
		misFotos = new Vector<FotoInspeccion>();
	}

	public void AddFoto(int intNroFoto, String strFormato, String strValorFoto) {
		misFotos.add(new FotoInspeccion());
	}

	public Vector<FotoInspeccion> getMisFotos() {
		return misFotos;
	}

	public void AddFoto(FotoInspeccion myFoto) {
		misFotos.add(myFoto);

	}

}
