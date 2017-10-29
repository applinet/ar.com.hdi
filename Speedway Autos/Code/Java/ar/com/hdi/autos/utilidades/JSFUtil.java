package ar.com.hdi.autos.utilidades;

import java.util.Map;

import javax.faces.context.FacesContext;
import javax.faces.el.ValueBinding;
import javax.servlet.http.HttpServletRequest;

import lotus.domino.Database;
import lotus.domino.Document;
import lotus.domino.Name;
import lotus.domino.NotesException;
import lotus.domino.Session;
import lotus.domino.View;

import com.ibm.xsp.designer.context.XSPContext;
import com.ibm.xsp.page.compiled.ExpressionEvaluatorImpl;

@SuppressWarnings("unchecked")
public class JSFUtil {

	public JSFUtil() {

	}

	public static XSPContext getContext() {
		return XSPContext.getXSPContext(FacesContext.getCurrentInstance());
	}

	public static String getServerUrl() {
		/***********************************************************************************
		 * Name : getServerurl Decription : returns the path (incl the domainname)
		 ***********************************************************************************/
		FacesContext facesContext = FacesContext.getCurrentInstance();
		Object request = facesContext.getExternalContext().getRequest();
		if (request instanceof HttpServletRequest) {
			String server = ((HttpServletRequest) request).getHeader("Host");
			String protocolFull = ((HttpServletRequest) request).getProtocol(); // returns protocol/version (ex: HTTP/1.1);
			String protocolOnly = protocolFull.split("/")[0]; // get just the protocol (lowercase it in next step...);
			String port = "";
			switch (((HttpServletRequest) request).getServerPort()) {
			case 80:
				port = "";
				break;
			case 443:
				port = "";
				protocolOnly = "https";
				break;
			default:
				port = ":" + ((HttpServletRequest) request).getServerPort();
				;
			}

			return protocolOnly.toLowerCase() + "://" + server + port;

		}

		return "";
	}

	public static Map getApplicationScope() {
		return (Map) resolveVariable("applicationScope");
	}

	public static Database getCurrentDatabase() {
		return (Database) resolveVariable("database");
	}

	public static Map getRequestScope() {
		return (Map) resolveVariable("requestScope");
	}

	public static Session getSession() {
		return (Session) resolveVariable("session");
	}

	public static Session getSessionAsSigner() {
		return (Session) resolveVariable("sessionAsSigner");
	}

	public static Map getSessionScope() {
		return (Map) resolveVariable("sessionScope");
	}

	public static Map getViewScope() {
		return (Map) resolveVariable("viewScope");
	}

	public static Name getCurrentUser() {
		Session session = getSession();
		try {
			return session.createName(session.getEffectiveUserName());
		} catch (NotesException e) {
			e.printStackTrace();
			return null;
		}
	}

	public static Object resolveVariable(String variable) {
		return FacesContext.getCurrentInstance().getApplication().getVariableResolver().resolveVariable(
				FacesContext.getCurrentInstance(), variable);
	}

	public static Database getTablasDatabase() throws NotesException {
		View currentDbProfileView = null;
		Document docUbicTablas = null;
		Database dbTablas = null;

		currentDbProfileView = getCurrentDatabase().getView("Configuracion");
		docUbicTablas = currentDbProfileView.getDocumentByKey("Configuracion");
		String server = docUbicTablas.getItemValueString("conf_server");
		String path = docUbicTablas.getItemValueString("conf_path");
		dbTablas = getSession().getDatabase(server, path);
		// Reciclamos todo menos dbTablas que es el return
		currentDbProfileView.recycle();
		docUbicTablas.recycle();
		return dbTablas;
	}

	public static ODBCProfile getDatosConexionOdbc() throws NotesException {

		Database dbTablas = null;
		View viewConexiones = null;
		Document docConexion = null;

		dbTablas = getTablasDatabase();

		viewConexiones = dbTablas.getView("v.Sys.ODBC");
		docConexion = viewConexiones.getDocumentByKey("BaseConexionAS400");

		ODBCProfile profile = new ODBCProfile(docConexion.getItemValueString("odbc_JdbcUrl_des"), docConexion
				.getItemValueString("odbc_DataSource_des"), docConexion.getItemValueInteger("odbc_Puerto_nro"),
				docConexion.getItemValueString("odbc_LectUser_des"), docConexion
						.getItemValueString("odbc_EscrUser_des"), docConexion.getItemValueString("odbc_LectPass_des"),
				docConexion.getItemValueString("odbc_EscrPass_des"));

		// Reciclar
		dbTablas.recycle();
		viewConexiones.recycle();
		docConexion.recycle();

		return profile;

	}

	public static DocProfile getDocProfile(String clave) throws NotesException {

		Database dbTablas = null;
		View viewConexiones = null;
		Document docConexion = null;

		dbTablas = getTablasDatabase();
		viewConexiones = dbTablas.getView("v.Sys.ODBC");
		docConexion = viewConexiones.getDocumentByKey(clave);
		DocProfile profile = new DocProfile(docConexion.getItemValueString("odbc_Con_cod"), docConexion
				.getItemValueString("odbc_Tabla1_des"), docConexion.getItemValueString("odbc_select_des"), docConexion
				.getItemValueString("odbc_where_des"), docConexion.getItemValue("odbc_queObtengo_des"), docConexion
				.getItemValueString("odbc_MsgConsole_des"));

		// Reciclar
		dbTablas.recycle();
		viewConexiones.recycle();
		docConexion.recycle();

		return profile;

	}

	public static String getFieldValueEvaluateSsjsInJava(FacesContext facesContext, String valueExpr) {

		ExpressionEvaluatorImpl evaluator = new ExpressionEvaluatorImpl(facesContext);
		ValueBinding vb = evaluator.createValueBinding(facesContext.getViewRoot(), valueExpr, null, null);
		String vreslt = (String) vb.getValue(facesContext);
		return vreslt;
	}

	public static Object getObjFieldValueEvaluateSsjsInJava(FacesContext facesContext, String campo) {

		String valueExpr = "#{javascript: getComponent('" + campo + "').getValue();}";
		ExpressionEvaluatorImpl evaluator = new ExpressionEvaluatorImpl(facesContext);
		ValueBinding vb = evaluator.createValueBinding(facesContext.getViewRoot(), valueExpr, null, null);
		Object vreslt = vb.getValue(facesContext);
		return vreslt;
	}

}
