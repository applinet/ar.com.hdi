package ar.com.hdi.autos.utilidades;

import java.io.Serializable;

public class ODBCProfile implements Serializable {

	private static final long serialVersionUID = 1L;

	public ODBCProfile() {

	}

	public ODBCProfile(String urlConexion, String dataSource, int puerto, String userRead, String userWrite,
			String passRead, String passWrite) {
		super();
		this.urlConexion = urlConexion;
		this.dataSource = dataSource;
		this.puerto = puerto;
		this.userRead = userRead;
		this.userWrite = userWrite;
		this.passRead = passRead;
		this.passWrite = passWrite;
	}

	private String urlConexion = "";
	private String dataSource = "";
	private int puerto = 0;
	private String userRead = "";
	private String userWrite = "";
	private String passRead = "";
	private String passWrite = "";

	public String getUrlConexion() {
		return urlConexion;
	}

	public void setUrlConexion(String urlConexion) {
		this.urlConexion = urlConexion;
	}

	public String getDataSource() {
		return dataSource;
	}

	public void setDataSource(String dataSource) {
		this.dataSource = dataSource;
	}

	public int getPuerto() {
		return puerto;
	}

	public void setPuerto(int puerto) {
		this.puerto = puerto;
	}

	public String getUserRead() {
		return userRead;
	}

	public void setUserRead(String userRead) {
		this.userRead = userRead;
	}

	public String getUserWrite() {
		return userWrite;
	}

	public void setUserWrite(String userWrite) {
		this.userWrite = userWrite;
	}

	public String getPassRead() {
		return passRead;
	}

	public void setPassRead(String passRead) {
		this.passRead = passRead;
	}

	public String getPassWrite() {
		return passWrite;
	}

	public void setPassWrite(String passWrite) {
		this.passWrite = passWrite;
	}
}
