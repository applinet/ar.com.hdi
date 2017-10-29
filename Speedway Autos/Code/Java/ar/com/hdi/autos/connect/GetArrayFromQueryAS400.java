package ar.com.hdi.autos.connect;

import java.io.Serializable;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Vector;

import lotus.domino.NotesException;
import ar.com.hdi.autos.utilidades.DocProfile;
import ar.com.hdi.autos.utilidades.JSFUtil;
import ar.com.hdi.autos.utilidades.LogError;
import ar.com.hdi.autos.utilidades.ODBCProfile;

public class GetArrayFromQueryAS400 implements Serializable {

	private static final long serialVersionUID = 1L;

	public GetArrayFromQueryAS400() {
		// No Args
	}

	@SuppressWarnings("unused")
	private ArrayList<String> selectAS;

	public void setSelectAS(ArrayList<String> selectAS) {
		this.selectAS = selectAS;
	}

	public ArrayList<String> getSelectAS(String strSQL, String[] arrcampos) throws NotesException {
		Connection connection = null;

		ODBCProfile docConf = JSFUtil.getDatosConexionOdbc();

		ArrayList<String> selectAS = new ArrayList<String>();
		try {
			DriverManager.registerDriver(new com.ibm.as400.access.AS400JDBCDriver());

			connection = createConnection(docConf.getUrlConexion(), docConf.getUserRead(), docConf.getPassRead());

			// connection = DriverManager.getConnection(url, user, pwd);
			Statement stmt = connection.createStatement();

			ResultSet rs = stmt.executeQuery(strSQL);
			// connection.close();
			int cont = 0;

			while (rs.next()) {
				cont++;
				String temp = "";
				for (String s : arrcampos) {
					if (s.contains("@text_")) {
						temp = temp + s.substring(7);
					} else {
						temp = temp + rs.getString(s).trim();
					}
				}
				selectAS.add(temp);
			}
		}

		catch (Exception e) {
			System.out.println();
			System.out.println("ERROR: " + e.getMessage());
		}

		finally {
			try {
				if (connection != null)
					connection.close();
			} catch (SQLException e) {
			}
		}
		return selectAS;

	}

	// Nuevo Amgr para Renovacion y Refacturacion
	public ArrayList<String> getSelectAsAmgr(ODBCProfile docConf, DocProfile docProfile) throws NotesException {
		Connection connection = null;
		docProfile.setStrsSQL();

		String strSQL = docProfile.getStrsSQL();
		if (docProfile.getMsgConsola().equals("2")) {
			LogError log = new LogError("ar.com.hdi.autos", docProfile.getClave() + " - sql=" + strSQL);
			log.commitLog(log);
		} else if (docProfile.getMsgConsola().equals("1")) {
			System.out.println(docProfile.getClave() + " - sql=" + strSQL);
		}

		ArrayList<String> selectAS = new ArrayList<String>();

		Vector<String> arrcampos = docProfile.getResultado();

		try {
			DriverManager.registerDriver(new com.ibm.as400.access.AS400JDBCDriver());

			connection = createConnection(docConf.getUrlConexion(), docConf.getUserRead(), docConf.getPassRead());

			// connection = DriverManager.getConnection(url, user, pwd);

			Statement stmt = connection.createStatement();

			ResultSet rs = stmt.executeQuery(strSQL);

			int cont = 0;

			while (rs.next()) {
				cont++;
				String temp = "";
				for (int i = 0; i < arrcampos.size(); i++) {
					if (arrcampos.elementAt(i).contains("@text_")) {
						temp = temp + arrcampos.elementAt(i).substring(7);
					} else {
						temp = temp + rs.getString(arrcampos.elementAt(i)).trim();
					}
				}
				selectAS.add(temp);
			}

		}

		catch (Exception e) {
			System.out.println();
			System.out.println("ERROR: " + e.getMessage());
		}

		finally {
			try {
				if (connection != null)
					connection.close();
			} catch (SQLException e) {
			}
		}
		return selectAS;

	}

	// Amgr para busquedas con documento Falso --> ACA
	public ArrayList<String> getSelectAsAmgr(ODBCProfile docConf, DocProfile docProfile, lotus.domino.Document docProp)
			throws NotesException {
		Connection connection = null;
		docProfile.setStrsSQL(docProp);

		String strSQL = docProfile.getStrsSQL();
		if (docProfile.getMsgConsola().equals("2")) {
			LogError log = new LogError("ar.com.hdi.autos", docProfile.getClave() + " - sql=" + strSQL);
			log.commitLog(log);
		} else if (docProfile.getMsgConsola().equals("1")) {
			System.out.println(docProfile.getClave() + " - sql=" + strSQL);
		}

		ArrayList<String> selectAS = new ArrayList<String>();

		Vector<String> arrcampos = docProfile.getResultado();

		try {
			DriverManager.registerDriver(new com.ibm.as400.access.AS400JDBCDriver());

			connection = createConnection(docConf.getUrlConexion(), docConf.getUserRead(), docConf.getPassRead());

			// connection = DriverManager.getConnection(url, user, pwd);

			Statement stmt = connection.createStatement();

			ResultSet rs = stmt.executeQuery(strSQL);

			int cont = 0;

			while (rs.next()) {
				cont++;
				String temp = "";
				for (int i = 0; i < arrcampos.size(); i++) {
					if (arrcampos.elementAt(i).contains("@text_")) {
						temp = temp + arrcampos.elementAt(i).substring(7);
					} else {
						temp = temp + rs.getString(arrcampos.elementAt(i)).trim();
					}
				}
				selectAS.add(temp);
			}

		}

		catch (Exception e) {
			System.out.println();
			System.out.println("ERROR: " + e.getMessage());
		}

		finally {
			try {
				if (connection != null)
					connection.close();
			} catch (SQLException e) {
			}
		}
		return selectAS;

	}

	// Nuevo Amgr Update para Renovacion y Refacturacion
	public String setUpdateAsAmgr(ODBCProfile docConf, DocProfile docProfile, lotus.domino.Document docProp)
			throws NotesException {
		Connection connection = null;
		String result = "";
		try {
			docProfile.setStrsSQL(docProp);
			String strSQL = docProfile.getStrsSQL();
			if (docProfile.getMsgConsola().equals("2")) {
				LogError log = new LogError("ar.com.hdi.autos", docProfile.getClave() + " - sql=" + strSQL);
				log.commitLog(log);
			} else if (docProfile.getMsgConsola().equals("1")) {
				System.out.println(docProfile.getClave() + " - sql=" + strSQL);
			}

			DriverManager.registerDriver(new com.ibm.as400.access.AS400JDBCDriver());

			connection = createConnection(docConf.getUrlConexion(), docConf.getUserWrite(), docConf.getPassWrite());

			Statement stmt = connection.createStatement();

			int resultStrSql = stmt.executeUpdate(strSQL);
			if (resultStrSql > 0) {
				result = "OK";
			} else {
				result = "ERROR";
			}

		}

		catch (Exception e) {
			System.out.println();
			System.out.println("ERROR: " + e.getMessage());

		}

		finally {
			try {
				if (connection != null)
					connection.close();
				// docProp.recycle();
			} catch (SQLException e) {
			}
		}
		return result;

	}

	// Nuevo Formato
	public ArrayList<String> getSelectAS(String clave) throws NotesException {
		Connection connection = null;
		ODBCProfile docConf = JSFUtil.getDatosConexionOdbc();

		DocProfile docProfile = JSFUtil.getDocProfile(clave);
		docProfile.setStrsSQL();

		String strSQL = docProfile.getStrsSQL();
		ArrayList<String> selectAS = new ArrayList<String>();

		Vector<String> arrcampos = docProfile.getResultado();
		try {
			DriverManager.registerDriver(new com.ibm.as400.access.AS400JDBCDriver());

			connection = createConnection(docConf.getUrlConexion(), docConf.getUserRead(), docConf.getPassRead());

			// connection = DriverManager.getConnection(url, user, pwd);

			Statement stmt = connection.createStatement();
			ResultSet rs = stmt.executeQuery(strSQL);

			int cont = 0;

			while (rs.next()) {
				cont++;
				String temp = "";
				for (int i = 0; i < arrcampos.size(); i++) {
					if (arrcampos.elementAt(i).contains("@text_")) {
						temp = temp + arrcampos.elementAt(i).substring(7);
					} else {
						temp = temp + rs.getString(arrcampos.elementAt(i)).trim();
					}
				}
				selectAS.add(temp);
			}

		}

		catch (Exception e) {
			System.out.println();
			System.out.println("ERROR: " + e.getMessage());
		}

		finally {
			try {
				if (connection != null)
					connection.close();
			} catch (SQLException e) {
			}
		}
		return selectAS;

	}

	public ArrayList<String> getSelectAS(String clave, lotus.domino.Document docProp) throws NotesException {
		Connection connection = null;
		try {
			ODBCProfile docConf = JSFUtil.getDatosConexionOdbc();
			DocProfile docProfile = JSFUtil.getDocProfile(clave);
			docProfile.setStrsSQL(docProp);
			String strSQL = docProfile.getStrsSQL();
			ArrayList<String> selectAS = new ArrayList<String>();
			Vector<String> arrcampos = docProfile.getResultado();
			DriverManager.registerDriver(new com.ibm.as400.access.AS400JDBCDriver());

			connection = createConnection(docConf.getUrlConexion(), docConf.getUserRead(), docConf.getPassRead());

			Statement stmt = connection.createStatement();
			if (docProfile.getMsgConsola().equals("2")) {
				LogError log = new LogError("ar.com.hdi.autos", clave + " - sql=" + strSQL);
				log.commitLog(log);
			} else if (docProfile.getMsgConsola().equals("1")) {
				System.out.println(clave + " - sql=" + strSQL);
			}
			ResultSet rs = stmt.executeQuery(strSQL);

			int cont = 0;

			while (rs.next()) {
				cont++;
				String temp = "";
				for (int i = 0; i < arrcampos.size(); i++) {
					if (arrcampos.elementAt(i).contains("@text_")) {
						temp = temp + arrcampos.elementAt(i).substring(7);
					} else {
						if (rs.getString(arrcampos.elementAt(i)) != null) {
							temp = temp + rs.getString(arrcampos.elementAt(i)).trim();
						}

					}
				}
				selectAS.add(temp);
			}
			return selectAS;
		}

		catch (Exception e) {
			System.out.println();
			System.out.println("ERROR: " + e.getMessage());
			return null;
		}

		finally {
			try {
				if (connection != null)
					connection.close();
				// docProp.recycle();
			} catch (SQLException e) {
			}
		}

	}

	public void doDeleteAS(String clave, lotus.domino.Document docProp) throws NotesException {
		Connection connection = null;
		try {

			ODBCProfile docConf = JSFUtil.getDatosConexionOdbc();
			DocProfile docProfile = JSFUtil.getDocProfile(clave);
			docProfile.setStrsSQL(docProp);
			String strSQL = docProfile.getStrsSQL();

			DriverManager.registerDriver(new com.ibm.as400.access.AS400JDBCDriver());

			connection = createConnection(docConf.getUrlConexion(), docConf.getUserWrite(), docConf.getPassWrite());

			// connection = DriverManager.getConnection(url, user, pwd);

			Statement stmt = connection.createStatement();
			if (docProfile.getMsgConsola().equals("2")) {
				LogError log = new LogError("ar.com.hdi.autos", clave + " - sql=" + strSQL);
				log.commitLog(log);
			} else if (docProfile.getMsgConsola().equals("1")) {
				System.out.println(clave + " - sql=" + strSQL);
			}
			stmt.execute(strSQL);

		}

		catch (Exception e) {
			System.out.println();
			System.out.println("ERROR: " + e.getMessage());
		}

		finally {
			try {
				if (connection != null)
					connection.close();
				// docProp.recycle();
			} catch (SQLException e) {
			}
		}

	}

	public void setInsertAS(String clave, lotus.domino.Document docProp) throws NotesException {
		Connection connection = null;
		try {
			ODBCProfile docConf = JSFUtil.getDatosConexionOdbc();
			DocProfile docProfile = JSFUtil.getDocProfile(clave);
			docProfile.setStrsSQL(docProp);
			String strSQL = docProfile.getStrsSQL();
			if (docProfile.getMsgConsola().equals("2")) {
				LogError log = new LogError("ar.com.hdi.autos", clave + " - sql=" + strSQL);
				log.commitLog(log);
			} else if (docProfile.getMsgConsola().equals("1")) {
				System.out.println(clave + " - sql=" + strSQL);
			}

			DriverManager.registerDriver(new com.ibm.as400.access.AS400JDBCDriver());

			connection = createConnection(docConf.getUrlConexion(), docConf.getUserWrite(), docConf.getPassWrite());

			Statement stmt = connection.createStatement();

			stmt.executeUpdate(strSQL);

		}

		catch (Exception e) {
			System.out.println();
			System.out.println("ERROR: " + e.getMessage());

		}

		finally {
			try {
				if (connection != null)
					connection.close();
				// docProp.recycle();
			} catch (SQLException e) {
			}
		}

	}

	public void setInsertAS(String clave, lotus.domino.DocumentCollection dc) throws NotesException {
		Connection connection = null;
		if (dc.getCount() == 0) {
			System.out.println("EL CONTADOR DA CERO SALIR!!!");
		}
		try {
			ODBCProfile docConf = JSFUtil.getDatosConexionOdbc();
			DocProfile docProfile;

			DriverManager.registerDriver(new com.ibm.as400.access.AS400JDBCDriver());
			connection = createConnection(docConf.getUrlConexion(), docConf.getUserWrite(), docConf.getPassWrite());

			Statement stmt = connection.createStatement();
			lotus.domino.Document docProp = dc.getFirstDocument();
			lotus.domino.Document tmp;
			while (docProp != null) {
				docProfile = JSFUtil.getDocProfile(clave);
				docProfile.setStrsSQL(docProp);
				String strSQL = docProfile.getStrsSQL();
				if (docProfile.getMsgConsola().equals("2")) {
					LogError log = new LogError("ar.com.hdi.autos", clave + " - sql=" + strSQL);
					log.commitLog(log);
				} else if (docProfile.getMsgConsola().equals("1")) {
					System.out.println(clave + " - sql=" + strSQL);
				}
				stmt.executeUpdate(strSQL);
				tmp = dc.getNextDocument(docProp);
				docProp.recycle();
				docProp = tmp;
			}
			dc.recycle();

		}

		catch (Exception e) {
			System.out.println();
			System.out.println("ERROR setInsertAS: " + e.getMessage());
		}

		finally {
			try {
				if (connection != null)
					connection.close();
			} catch (SQLException e) {
			}
		}

	}

	public ArrayList<String> getSelectASList(String strSQL, String[] arrcampos) throws NotesException {
		Connection connection = null;

		ODBCProfile docConf = JSFUtil.getDatosConexionOdbc();

		ArrayList<String> arrlist = new ArrayList<String>();

		try {
			DriverManager.registerDriver(new com.ibm.as400.access.AS400JDBCDriver());

			connection = createConnection(docConf.getUrlConexion(), docConf.getUserRead(), docConf.getPassRead());

			// connection = DriverManager.getConnection(url, user, pwd);
			Statement stmt = connection.createStatement();

			ResultSet rs = stmt.executeQuery(strSQL);
			// connection.close();
			int cont = 0;

			while (rs.next()) {
				cont++;
				String temp = "";
				for (String s : arrcampos) {
					if (s.contains("@text_")) {
						temp = temp + s.substring(7);
					} else {
						temp = temp + rs.getString(s).trim();
					}
				}
				arrlist.add(temp);
			}
		}

		catch (Exception e) {
			System.out.println();
			System.out.println("ERROR: " + e.getMessage());
		}

		finally {
			try {
				if (connection != null)
					connection.close();
			} catch (SQLException e) {
			}
		}
		return arrlist;
	}

	public static Connection createConnection(String url, String username, String password) throws SQLException {

		if ((username == null) || (password == null) || (username.trim().length() == 0)
				|| (password.trim().length() == 0)) {
			return DriverManager.getConnection(url);
		} else {
			return DriverManager.getConnection(url, username, password);
		}
	}

	public static void close(Connection connection) {
		try {
			if (connection != null) {
				connection.close();
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}

	public static void close(Statement st) {
		try {
			if (st != null) {
				st.close();
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}

	public static void close(ResultSet rs) {
		try {
			if (rs != null) {
				rs.close();
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}

}
