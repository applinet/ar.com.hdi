function getIsGroupMember(groupName){
	var result = false;
	var groups = context.getUser().getGroups().toArray();
	if(groups.length > 0) {
		for(var i=0; i<groups.length; i++) {
			if(groups[i] == groupName){
				result = true;
			}
		}
	}
	return result;
}

function isStatusFieldAccessGroup(prm_strStatus_cod:String, prm_strFieldName:String){
	var booResult:boolean = false;
	var vEstados:NotesView = getDbCfg().getView ("v.Sys.LK_EstadosCodigo");
	var docEstado:NotesDocument = vEstados.getDocumentByKey(prm_strStatus_cod);
	if (docEstado != null){
		var vecEst_PermiteEdicionGrupo_des:java.util.Vector = docEstado.getItemValue(prm_strFieldName);
		for (i=0; i<vecEst_PermiteEdicionGrupo_des.size(); i++) {
			if (vecEst_PermiteEdicionGrupo_des.elementAt(i) == "") return true;
			var strEstGrupos:String = vecEst_PermiteEdicionGrupo_des.elementAt(i)
			if (strEstGrupos != ""){
				if(getIsGroupMember(strEstGrupos)) booResult = true;
			}
		}
	}
	if(docEstado != null) docEstado.recycle();
	if(vEstados != null) vEstados.recycle();
	return booResult;
}

function getNextStatusAuthorField(prm_strNextStatus_cod:String):java.util.Vector{
	var vEstados:NotesView = getDbCfg().getView ("v.Sys.LK_EstadosCodigo");
	var docEstado:NotesDocument = vEstados.getDocumentByKey(prm_strNextStatus_cod);
	if (docEstado != null){
		return docEstado.getItemValue("est_PermiteEdicionGrupo_des");
	}	
}