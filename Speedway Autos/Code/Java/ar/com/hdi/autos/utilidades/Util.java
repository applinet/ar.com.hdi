package ar.com.hdi.autos.utilidades;

import java.io.Serializable;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Vector;

import lotus.domino.Database;
import lotus.domino.DateTime;
import lotus.domino.Document;
import lotus.domino.NotesException;
import lotus.domino.NotesFactory;
import lotus.domino.Session;
import lotus.domino.View;

public class Util implements Serializable {

	private static final long serialVersionUID = 1L;

	public Util() { // constructor stub
	}

	/**
	 * - Funcion StringToNotesDateTime - Parseo un string con formato de ingreso y egreso.
	 * 
	 * @Ejecuto parseo: new SimpleDateFormat("dd/MM/yyyy hh:mm").format(new SimpleDateFormat("yyyyMMdd").parse("20140625")).toString();
	 * 
	 * @param inputFormat
	 *            : String que voy a transformar
	 * @param inputTimeStamp
	 *            : Formato del String que ingresa(inputFormat). ej:"yyyyMMdd"
	 * @param outputFormat
	 *            : El formato que va a tener el dt que devuelvo ej:"dd/MM/yyyy hh:mm"
	 * @return NotesDateTime
	 */
	public static DateTime StringToNotesDateTime(final String inputFormat, String inputTimeStamp,
			final String outputFormat) {
		Session sessiondt = null;
		DateTime dt = null;
		String fecha = null;
		try {
			sessiondt = NotesFactory.createSession();
			fecha = new SimpleDateFormat(outputFormat).format(new SimpleDateFormat(inputTimeStamp).parse(inputFormat))
					.toString();
			dt = sessiondt.createDateTime(fecha);
			sessiondt.recycle();
		} catch (NotesException e) {
			e.printStackTrace();
		} catch (ParseException e) {
			e.printStackTrace();
		}
		return dt;
	}

	/**
	 * getDatabaseConfiguracion
	 * 
	 * @param session
	 *            : NotesSession
	 * @param currentDb
	 *            : La Base Speedway
	 * @return Notes Database: Base de Configuración
	 */
	public static Database getDatabaseConfiguracion(Session session, Database currentDb) {
		Database dbTablas = null;
		try {
			View currentDbProfileView = currentDb.getView("Configuracion");
			Document docUbicTablas = currentDbProfileView.getDocumentByKey("Configuracion");
			String server = docUbicTablas.getItemValueString("conf_server");
			String path = docUbicTablas.getItemValueString("conf_path");
			dbTablas = session.getDatabase(server, path);
			// Recycle
			if (currentDbProfileView != null) {
				currentDbProfileView.recycle();
			}
			if (docUbicTablas != null) {
				docUbicTablas.recycle();
			}
		} catch (NotesException e) {
			e.printStackTrace();
		}

		return dbTablas;
	}

	/**
	 * getDbKey
	 * 
	 * @param clave
	 *            : Clave a buscar
	 * @return Notes Database: Base de Configuración
	 */
	public static ArrayList<String> getDbKey(String clave) {
		ArrayList<String> base = new ArrayList<String>();
		Session session = null;
		Database currentDb = null;
		try {
			session = NotesFactory.createSession();
			currentDb = session.getCurrentDatabase();
		} catch (NotesException e1) {
			if (e1.id == 4493) {
				currentDb = JSFUtil.getCurrentDatabase();
			}
		}

		try {
			View currentDbProfileView = currentDb.getView("Configuracion");
			Document docUbicTablas = currentDbProfileView.getDocumentByKey(clave);
			base.add(docUbicTablas.getItemValueString("conf_server"));
			base.add(docUbicTablas.getItemValueString("conf_path"));

			// Recycle
			if (currentDbProfileView != null) {
				currentDbProfileView.recycle();
			}
			if (docUbicTablas != null) {
				docUbicTablas.recycle();
			}
			if (currentDb != null) {
				currentDb.recycle();
			}
		} catch (NotesException e) {
			e.printStackTrace();
		}
		return base;
	}

	public static ODBCProfile getODBCProfileAmgr(Session session, Database currentDb, String viewKey) {
		// Obtengo datos conexion JDBC
		Database dbConfig = getDatabaseConfiguracion(session, currentDb);
		View viewConexiones;
		ODBCProfile ODBC = null;
		try {
			viewConexiones = dbConfig.getView("v.Sys.ODBC");
			Document docConexion = viewConexiones.getDocumentByKey(viewKey);
			ODBC = new ar.com.hdi.autos.utilidades.ODBCProfile(docConexion.getItemValueString("odbc_JdbcUrl_des"),
					docConexion.getItemValueString("odbc_DataSource_des"), docConexion
							.getItemValueInteger("odbc_Puerto_nro"), docConexion
							.getItemValueString("odbc_LectUser_des"), docConexion
							.getItemValueString("odbc_EscrUser_des"), docConexion
							.getItemValueString("odbc_LectPass_des"), docConexion
							.getItemValueString("odbc_EscrPass_des"));
			// Recycle
			if (docConexion != null) {
				docConexion.recycle();
			}
			;
			if (viewConexiones != null) {
				viewConexiones.recycle();
			}
			;
			if (dbConfig != null) {
				dbConfig.recycle();
			}
			;
		} catch (NotesException e) {
			e.printStackTrace();
		}
		return ODBC;
	}

	@SuppressWarnings("unchecked")
	public static DocProfile getDocProfileAmgr(Session session, Database currentDb, String viewKey) {
		Database dbConfig = getDatabaseConfiguracion(session, currentDb);
		View viewConexiones;
		DocProfile profile = null;
		try {
			viewConexiones = dbConfig.getView("v.Sys.ODBC");
			Document docProfile = viewConexiones.getDocumentByKey(viewKey);
			profile = new DocProfile(docProfile.getItemValueString("odbc_Con_cod"), docProfile
					.getItemValueString("odbc_Tabla1_des"), docProfile.getItemValueString("odbc_select_des"),
					docProfile.getItemValueString("odbc_where_des"), docProfile.getItemValue("odbc_queObtengo_des"),
					docProfile.getItemValueString("odbc_MsgConsole_des"));
			// Recycle
			if (docProfile != null) {
				docProfile.recycle();
			}
			;
			if (viewConexiones != null) {
				viewConexiones.recycle();
			}
			;
			if (dbConfig != null) {
				dbConfig.recycle();
			}

		} catch (NotesException e) {
			e.printStackTrace();
		}
		return profile;
	}

	public static Document getDocAnteriorPorPoliza(Database Db, String viewName, String viewKey) {
		View vEmitidasPorPoliza = null;
		Document doc = null;
		try {
			vEmitidasPorPoliza = Db.getView(viewName);
			doc = vEmitidasPorPoliza.getDocumentByKey(viewKey);
			// Recycle
			if (vEmitidasPorPoliza != null) {
				vEmitidasPorPoliza.recycle();
			}
		} catch (NotesException e) {
			e.printStackTrace();
		}
		return doc;
	}

	@SuppressWarnings("unchecked")
	public static Vector evaluateFormula(String strFormula_param, Document docTarget_param) {
		if (strFormula_param.equals("")) {
			Vector vecResult = new Vector();
			vecResult.add("");
			return vecResult;
		}
		Session thisSession;
		try {
			thisSession = getSessionAmgrXpage();
			if (docTarget_param != null)
				return thisSession.evaluate(strFormula_param, docTarget_param);
			else
				return thisSession.evaluate(strFormula_param);
		} catch (NotesException e) {
			e.printStackTrace();
		}

		return null;

	}

	@SuppressWarnings("unchecked")
	public static Vector mergeAndTrimVectors(Vector<String> vec1, Vector<String> vec2) {
		vec1.addAll(vec2);

		Integer i;

		for (i = 0; i < vec1.size(); i++) {
			if (vec1.elementAt(i).equals("")) {
				vec1.removeElementAt(i);
				i--;
			}
		}

		return vec1;

	}

	public static Session getSessionAmgrXpage() {
		Session session = null;
		try {
			session = NotesFactory.createSession();
		} catch (NotesException e1) {
			if (e1.id == 4493) {
				session = JSFUtil.getSession();
			}
		}
		return session;
	}

	public static Database getCurrentDatabaseAmgrXpage() {
		Session session = null;
		Database currentDb = null;
		try {
			session = NotesFactory.createSession();
			currentDb = session.getCurrentDatabase();
		} catch (NotesException e1) {
			if (e1.id == 4493) {
				currentDb = JSFUtil.getCurrentDatabase();
			}
		}
		return currentDb;
	}

}
