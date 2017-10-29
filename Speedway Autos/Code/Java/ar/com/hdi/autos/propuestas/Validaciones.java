package ar.com.hdi.autos.propuestas;

import java.io.Serializable;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.List;

import javax.faces.application.FacesMessage;
import javax.faces.component.UIComponent;
import javax.faces.component.UIInput;
import javax.faces.context.FacesContext;
import javax.faces.validator.ValidatorException;

import lotus.domino.NotesException;
import ar.com.hdi.autos.utilidades.JSFUtil;
import ar.com.hdi.autos.utilidades.ODBCProfile;

public class Validaciones<Document> implements Serializable {

	private static final long serialVersionUID = 1L;

	public Validaciones() { // No Args
	}

	public void validador(FacesContext facesContext, UIComponent component,
			Object value) {
		// Valida los campos de la propuesta y envia errores como excepcion.
		// Este validador está en el campo sol_vigenciaDesdeCabecera_nro para
		// que primero valide las fechas y luego ingrese aca

		if (isFieldNull("sol_productor_cod", facesContext)) {
			FacesMessage message = new FacesMessage(
					"El codigo de productor es obligatorio.");
			throw new ValidatorException(message);
		}

		if (isFieldNull("sol_asegurado_des", facesContext)) {
			FacesMessage message = new FacesMessage(
					"La descripcion del asegurado es obligatoria.");
			throw new ValidatorException(message);
		}

		/*
		 * NO FUNCIONA YA QUE SOLO TRAE VALUE Y NO PUEDO OBTENER OTRO CAMPO int
		 * diff = ((Date) vigenciaHasta).compareTo((Date) value); if (diff <= 0)
		 * { FacesMessage message = new FacesMessage(
		 * "La fecha hasta debe ser mayor a la fecha desde."); throw new
		 * ValidatorException(message); }
		 */

	}

	public boolean isFieldNull(String campo, FacesContext facesContext) {
		String temp = ar.com.hdi.autos.utilidades.JSFUtil
				.getFieldValueEvaluateSsjsInJava(facesContext,
						"#{javascript: getComponent('" + campo
								+ "').getValue();}");

		return temp == null ? true : false;

	}

	public void Continuar() throws NotesException {
		System.out.println("Continuar_1");
		Connection connection = null;
		System.out.println("Continuar_2");
		ODBCProfile docConf = JSFUtil.getDatosConexionOdbc();
		System.out.println("Continuar_3");
		try {
			DriverManager
					.registerDriver(new com.ibm.as400.access.AS400JDBCDriver());
			System.out.println("Continuar_4");
			connection = DriverManager.getConnection(docConf.getUrlConexion(),
					docConf.getUserRead(), docConf.getPassRead());
			System.out.println("Continuar_5");
			System.out.println("Is closed? " + connection.isClosed());
			connection.close();
			System.out.println("Is closed? " + connection.isClosed());
			System.out.println("Continuar_6");
		} catch (SQLException e) {
			FacesMessage message = new FacesMessage("Sin AS.");
			throw new ValidatorException(message);

		}

	}

	@SuppressWarnings("unchecked")
	public static UIComponent findComponent(UIComponent topComponent,
			String compId) {
		if (compId == null)
			throw new NullPointerException(
					"Component identifier cannot be null");

		if (compId.equals(topComponent.getId()))
			return topComponent;

		if (topComponent.getChildCount() > 0) {
			List<UIComponent> childComponents = topComponent.getChildren();

			for (UIComponent currChildComponent : childComponents) {
				UIComponent foundComponent = findComponent(currChildComponent,
						compId);
				if (foundComponent != null)
					return foundComponent;
			}
		}
		return null;
	}

	public static Object getSubmittedValue(String compId) {
		UIComponent c = findComponent(FacesContext.getCurrentInstance()
				.getViewRoot(), compId);
		// value submitted from the browser
		Object o = ((UIInput) c).getSubmittedValue();

		if (null == o) {
			// else not yet submitted
			o = ((UIInput) c).getValue();
		}
		return o;
	}

	public String getStrDateDiff(String fecha, String articulo) {
		System.out.println("Works");
		return "wk";

	}
}
