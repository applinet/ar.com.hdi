function lockDocument (strUnid_prm:String) {
	
	var strUser:String = @Name("[CN]",@UserName());
	var strUnid:String = "";
	if (strUnid_prm.equals ("")) strUnid = context.getUrlParameter("documentId");
	else strUnid = strUnid_prm;
	
	var booIsLocked:boolean = DocLock.isLocked(strUnid);
	var strLockedBy:String = DocLock.getLock (strUnid);

	if (booIsLocked == false) {
		DocLock.addLock(strUnid, strUser);
	}
	
	updateLockScopeVariables ();
	
}



function unLockDocument (strUnid_prm) {	
	
	var strUser:String = @Name("[CN]",@UserName());
	var strUnid:String = "";
	if (strUnid_prm.equals ("")) strUnid = context.getUrlParameter("documentId");
	else strUnid = strUnid_prm;
	
	var booIsLocked:boolean = DocLock.isLocked(strUnid);
	
	if (booIsLocked == false) {
		return;
		//throw new java.lang.Exception("El documento NO se encuentra bloqueado");
	}
	
	var strLockedBy:String = DocLock.getLock (strUnid);
	if (strLockedBy.equals(strUser)) {
		DocLock.removeLock(strUnid);
		updateLockScopeVariables ();
	}
	else {
		throw new java.lang.Exception("El documento sólo puede ser desbloqueado por: " + strLockedBy);
	}
	
}

function updateLockScopeVariables () {
	
	//importPackage(ar.com.hdi.autos.utilidades);

	var strUser:String = @Name("[CN]",@UserName());
	var strUnid:String = context.getUrlParameter("documentId");

	var booIsLocked:boolean = DocLock.isLocked(strUnid);
	var strLockedBy:String = DocLock.getLock (strUnid);

	if (booIsLocked) {
		if (strUser.equals (strLockedBy)) viewScope.put("booIsLockedByCurrentUser", true);
		else viewScope.put("booIsLockedByCurrentUser", false);
	}
	else viewScope.put("booIsLockedByCurrentUser", false);
	viewScope.put("booIsLocked", booIsLocked);
	viewScope.put("strLockedBy", strLockedBy);
	viewScope.put("strLockedMsg", "El documento se encuentra bloqueado por: " + strLockedBy);
	
}

function isLockDocument ():boolean{
	
	updateLockScopeVariables ();
	
	//Si no está bloqueado, FALSE
	if (viewScope.get("booIsLocked") == false) return false;
	
	return true;
}

function unBlockAllowed ():boolean {
	
	updateLockScopeVariables ();
	
	//Si no está bloqueado, FALSE
	if (viewScope.get("booIsLocked") == false) return false;

	//Si está bloqueado pero NO por el usuario actual, FALSE
	if (viewScope.get("booIsLockedByCurrentUser") == false) return false;

	return true;
	
}

function userTryingToEdit ():boolean {
	//Devuelve TRUE si el usuario actual puede editar.
	updateLockScopeVariables ();
	
	//Si no está bloqueado, Bloquealo
	if (viewScope.get("booIsLocked") == false) {
		lockDocument("");
		return true;
	}

	//Si está bloqueado pero NO por el usuario actual, FALSE
	if (viewScope.get("booIsLockedByCurrentUser") == false) return false;

	return true;
}