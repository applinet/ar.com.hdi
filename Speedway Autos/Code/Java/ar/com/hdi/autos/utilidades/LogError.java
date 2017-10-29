package ar.com.hdi.autos.utilidades;

import java.io.Serializable;
import java.util.ArrayList;

import lotus.domino.Log;
import lotus.domino.NotesException;
import lotus.domino.NotesFactory;
import lotus.domino.Session;

public class LogError implements Serializable {

	private static final long serialVersionUID = 1L;

	public LogError() { // Constructor
	}

	private String servidor;
	private String path;
	private String titulo;
	private String mensaje;

	public LogError(String titulo, String mensaje) {
		super();
		ArrayList<String> arrTemp = ar.com.hdi.autos.utilidades.Util.getDbKey("AgentLog");
		this.servidor = arrTemp.get(0);
		this.path = arrTemp.get(1);
		this.titulo = titulo;
		this.mensaje = mensaje;
	}

	public String getServidor() {
		return servidor;
	}

	public void setServidor(String servidor) {
		this.servidor = servidor;
	}

	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}

	public String getTitulo() {
		return titulo;
	}

	public void setTitulo(String titulo) {
		this.titulo = titulo;
	}

	public String getMensaje() {
		return mensaje;
	}

	public void setMensaje(String mensaje) {
		this.mensaje = mensaje;
	}

	public void commitLog(LogError logError) {
		Session thisSession = null;
		try {
			thisSession = NotesFactory.createSession();
		} catch (NotesException e1) {
			if (e1.id == 4493) {
				thisSession = JSFUtil.getSession();
			}
		}
		try {
			Log jsLog = thisSession.createLog(logError.getTitulo());
			jsLog.openNotesLog(logError.getServidor(), logError.getPath());
			jsLog.logAction(logError.getMensaje());
		} catch (NotesException e) {
			e.printStackTrace();
		}
	}
}
