/* FPR 20140115**Documentacion***********************************************************************
 * Utilizado en:
 * ccFxPatenteTrigger
 * IMPORTANTE: esta funcion se utiliza en el validator de un control, no sirve para un boton
 * --------------------------------------------------------------------------------------------------
 * Recursos:
 * managed-bean:MbValidadorPatente. La scope es view
 * --------------------------------------------------------------------------------------------------
 * Detalle:
 * Se llama directo a la scope y se obtienen propiedades y metodos.
 * Void getMaskOnError:
 * -Hace un insert en Gaus con los datos ingresados de patente
 * -Utiliza la funcion "arrComoDevuelveElResultado" para buscar en tabla gaus el resultado
 * 		Resultado <> OK ==> Busca en gaus las mascaras y devuelve una excepcion con el msg y no graba
 * 		Resultado = OK ==> Setea los datos de patente en la Scope para que los recupere la xpage
 */

package ar.com.hdi.autos.vehiculos;

import java.io.Serializable;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;

import javax.faces.application.FacesMessage;
import javax.faces.component.UIComponent;
import javax.faces.context.FacesContext;
import javax.faces.validator.ValidatorException;

import lotus.domino.NotesException;
import ar.com.hdi.autos.connect.GetArrayFromQueryAS400;
import ar.com.hdi.autos.connect.InsertQueryAS400;
import ar.com.hdi.autos.utilidades.DocProfile;
import ar.com.hdi.autos.utilidades.LogError;

public class ValidarPatenteAS400<Document> implements Serializable {

	private static final long serialVersionUID = 1L;

	public ValidarPatenteAS400() {// No Args
	}

	private String numeroPatente;
	private String tipoPatente;
	private String patenteCompleta;

	public String getNumeroPatente() {
		return numeroPatente;
	}

	public void setNumeroPatente(String numeroPatente) {
		this.numeroPatente = numeroPatente;
	}

	public String getTipoPatente() {
		return tipoPatente;
	}

	public void setTipoPatente(String tipoPatente) {
		this.tipoPatente = tipoPatente;
	}

	public String getPatenteCompleta() {
		return patenteCompleta;
	}

	public void setPatenteCompleta(String patenteCompleta) {
		this.patenteCompleta = patenteCompleta;
	}

	public void getMaskOnError(FacesContext facesContext, UIComponent component, Object value) throws NotesException {

		String G0MCOD = ar.com.hdi.autos.utilidades.JSFUtil.getFieldValueEvaluateSsjsInJava(facesContext,
				"#{javascript: getComponent('veh_patenteTipo_cod').getValue();}");
		String G0NMAT = value.toString().toUpperCase();

		SimpleDateFormat sdf1 = new SimpleDateFormat("yyMMdd_HH:mm:ss");
		String G0CLAVE = sdf1.format(new Date());
		SimpleDateFormat sdf2 = new SimpleDateFormat("MM/dd/yyyy");
		String G0VIGH = sdf2.format(new Date());

		DocProfile profileGTI970 = ar.com.hdi.autos.utilidades.JSFUtil.getDocProfile("vehTB_GTI970");
		DocProfile profileSETPAM01 = ar.com.hdi.autos.utilidades.JSFUtil.getDocProfile("vehTB_SETPAM01");

		String strSql = "INSERT INTO " + profileGTI970.getTabla() + " (G0CLAVE, G0MCOD, G0VIGH, G0NMAT) VALUES ('"
				+ G0CLAVE + "', '" + G0MCOD + "', '" + G0VIGH + "', '" + G0NMAT + "')";

		if (profileGTI970.getMsgConsola().equals("2")) {
			LogError log = new LogError("ar.com.hdi.autos", profileGTI970.getClave() + " - sql=" + strSql);
			log.commitLog(log);
		} else if (profileGTI970.getMsgConsola().equals("1")) {
			System.out.println(profileGTI970.getClave() + " - sql=" + strSql);
		}

		InsertQueryAS400 insert = new InsertQueryAS400();
		insert.ejecutarInsert(strSql);

		String[] arrComoDevuelveElResultado = new String[] { "G0RESULT" };

		GetArrayFromQueryAS400 select = new GetArrayFromQueryAS400();
		ArrayList<String> arrResult = select.getSelectAS("SELECT G0RESULT FROM " + profileGTI970.getTabla()
				+ " WHERE G0CLAVE='" + G0CLAVE + "'", arrComoDevuelveElResultado);

		for (String item : arrResult) {

			if (!item.equals("OK")) {
				arrComoDevuelveElResultado = new String[] { "PMMASK" };
				arrResult = select.getSelectAS("SELECT PMMASK FROM " + profileSETPAM01.getTabla() + " WHERE PMMCOD='"
						+ G0MCOD + "' AND PMCUSO = 'A' AND PMVIGH > '" + G0VIGH + "'", arrComoDevuelveElResultado);
				setPatenteCompleta("Ingrese Patente");
				FacesMessage message = new FacesMessage("Formato de patente invalido.Mascaras Permitidas:"
						+ arrResult.toString());

				// Throw exception so that it prevents document from being saved
				throw new ValidatorException(message);
			} else {
				setNumeroPatente(G0NMAT);
				setTipoPatente(G0MCOD);
				setPatenteCompleta(G0MCOD + " " + G0NMAT);
			}
		}

	}
}
