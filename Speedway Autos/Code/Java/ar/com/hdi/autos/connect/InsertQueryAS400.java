package ar.com.hdi.autos.connect;

import java.io.Serializable;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;

import lotus.domino.NotesException;
import ar.com.hdi.autos.utilidades.JSFUtil;
import ar.com.hdi.autos.utilidades.ODBCProfile;

public class InsertQueryAS400 implements Serializable {

	private static final long serialVersionUID = 1L;

	public InsertQueryAS400() {// No Args
	}

	public void ejecutarInsert(String strSQL) throws NotesException {
		Connection connection = null;

		ODBCProfile docConf = JSFUtil.getDatosConexionOdbc();

		try {
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
			} catch (SQLException e) {
			}
		}
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

}
