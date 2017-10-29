/* FPR 20140131**Documentacion***********************************************************************
 * Utilizado en:
 * ccDialogNuevoComponente
 * --------------------------------------------------------------------------------------------------
 * Recursos:
 * managed-bean:MbComponente. La scope es view
 * --------------------------------------------------------------------------------------------------
 * Detalle:
 * Se llama directo a la scope y se obtienen propiedades y metodos.
 * 
 */

package ar.com.hdi.autos.vehiculos;

import java.io.Serializable;

import javax.faces.application.FacesMessage;
import javax.faces.component.UIComponent;
import javax.faces.context.FacesContext;
import javax.faces.validator.ValidatorException;

import lotus.domino.NotesException;

public class Componente implements Serializable {

	private static final long serialVersionUID = 1L;

	public Componente() {
		// Auto-generated constructor stub
	}

	public void getConsoleMsg() {
		System.out.println("Mensaje de consola");
	}

	public void getErrorComponente(FacesContext facesContext, UIComponent component, Object value)
			throws NotesException {

		String temp = ar.com.hdi.autos.utilidades.JSFUtil.getFieldValueEvaluateSsjsInJava(facesContext,
				"#{javascript: getComponent('btn_ValidarPatente').getValue();}");

		if (temp == "Ingresar Patente") {
			FacesMessage message = new FacesMessage("La patente es un dato obligatorio");

			// Throw exception so that it prevents document from being saved
			throw new ValidatorException(message);
		}

	}

}