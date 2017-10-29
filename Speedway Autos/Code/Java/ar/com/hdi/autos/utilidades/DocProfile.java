package ar.com.hdi.autos.utilidades;

import java.io.Serializable;
import java.util.Vector;

import lotus.domino.Document;
import lotus.domino.NotesException;
import lotus.domino.NotesFactory;
import lotus.domino.Session;

public class DocProfile implements Serializable {

	private static final long serialVersionUID = 1L;

	public DocProfile() {
		super();
		// Auto-generated constructor stub
	}

	private String clave = "";
	private String tabla = "";
	private String select = "";
	private String where = "";
	private Vector<String> resultado;
	private String msgConsola = "";
	private String strsSQL = "";

	public DocProfile(String clave, String tabla, String select, String where, Vector<String> resultado,
			String msgConsola) {
		super();
		this.clave = clave;
		this.tabla = tabla;
		this.select = select;
		this.where = where;
		this.resultado = resultado;
		this.msgConsola = msgConsola;
	}

	public String getClave() {
		return clave;
	}

	public void setClave(String clave) {
		this.clave = clave;
	}

	public String getTabla() {
		return tabla;
	}

	public void setTabla(String tabla_T) {
		this.tabla = tabla_T;
	}

	public String getSelect() {
		return select;
	}

	public void setSelect(String select) {
		this.select = select;
	}

	public String getWhere() {
		return where;
	}

	public void setWhere(String where) {
		this.where = where;
	}

	public Vector<String> getResultado() {
		return resultado;
	}

	public void setResultado(Vector<String> resultado) {
		this.resultado = resultado;
	}

	public String getMsgConsola() {
		return msgConsola;
	}

	public void setMsgConsola(String msgConsola) {
		this.msgConsola = msgConsola;
	}

	public String getStrsSQL() {
		return strsSQL;
	}

	public void setStrsSQL(String strsSQL) {
		this.strsSQL = strsSQL;
	}

	public void setStrsSQL() {
		this.strsSQL = getSelect() + " FROM " + getTabla() + " " + getWhere();
	}

	@SuppressWarnings("unchecked")
	public void setStrWs(Document docTarget) {
		// INI - Para resolver la llamada desde un agente
		Session s = null;
		try {
			s = NotesFactory.createSession();
		} catch (NotesException e1) {
			if (e1.id == 4493) {
				s = JSFUtil.getSession();
			} else {
				System.out.println("error en session=" + e1.id);
			}
		}
		// FIN - Para resolver la llamada desde un agente
		try {
			Vector vecResult;
			vecResult = s.evaluate(this.getSelect(), docTarget);
			this.setSelect(vecResult.elementAt(0).toString());
		} catch (NotesException e) {
			e.printStackTrace();
		}
	}

	@SuppressWarnings("unchecked")
	public void setStrsSQL(Document docTarget) {
		// INI - Para resolver la llamada desde un agente
		Session s = null;
		try {
			s = NotesFactory.createSession();
		} catch (NotesException e1) {
			if (e1.id == 4493) {
				s = JSFUtil.getSession();
			}
		}
		// FIN - Para resolver la llamada desde un agente
		try {
			Vector vecResult;
			// System.out.println("setStrsSQL_tabla=" + this.getTabla());
			vecResult = s.evaluate(this.getTabla(), docTarget);
			this.setTabla(vecResult.elementAt(0).toString());
			// System.out.println("setStrsSQL_select=" + this.getSelect());
			vecResult = s.evaluate(this.getSelect(), docTarget);
			this.setSelect(vecResult.elementAt(0).toString());
			// System.out.println("setStrsSQL_where=" + this.getWhere());
			vecResult = s.evaluate(this.getWhere(), docTarget);
			this.setWhere(vecResult.elementAt(0).toString());
			// vecResult = s.evaluate(this.getResultado().elementAt(0),
			// docTarget);
			// this.setResultado(vecResult);
			this.strsSQL = getSelect() + getTabla() + " " + getWhere();
			// docTarget.recycle();
		} catch (Exception e) {
			System.out.println();
			System.out.println("ERROR: " + e.getMessage());
			System.out.println("ERROR: " + e.getStackTrace().toString());
			System.out.println("ERROR: " + e.getLocalizedMessage().toString());

		}

	}
}
