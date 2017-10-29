package wf;

import javax.faces.context.FacesContext;
import javax.servlet.http.HttpServletRequest;

import lotus.domino.Database;
import lotus.domino.Document;
import lotus.domino.RichTextItem;

import com.ibm.xsp.extlib.beans.PeopleBean;
import com.ibm.xsp.model.domino.wrapped.DominoDocument;
import com.ibm.xsp.xflow.IIdentityResolver;
import com.ibm.xsp.xflow.IProcess;
import com.ibm.xsp.xflow.IStep;
import com.ibm.xsp.xflow.IWorkflowContext;
import com.ibm.xsp.xflow.actionhandler.IActionHandler;
import com.ibm.xsp.xflow.domino.DominoWorkflowContext;
import com.ibm.xsp.xflow.history.AbstractHistoryEntry;

public class SendMailNotification implements IActionHandler {

	public void executeAfterAction(IWorkflowContext workflowContext, IProcess process, IStep nextStep, String action,
			String[] mailToUserList) {
		System.out.println("executeAfterAction");
		System.out.println("process:" + process.toString());
		System.out.println("nextStep:" + nextStep.toString());
		System.out.println("action:" + action.toString());
		System.out.println("mailToUserList:" + mailToUserList.toString());
		System.out.println("Largo:" + mailToUserList.length);
		if (process == null || nextStep == null || action == null || action == "" || mailToUserList == null
				|| (mailToUserList != null && mailToUserList.length == 0)) {
			return;
		}

		try {
			Database db = (Database) FacesContext.getCurrentInstance().getApplication().getVariableResolver()
					.resolveVariable(FacesContext.getCurrentInstance(), "database");
			IIdentityResolver resolver = workflowContext.getIdentityResolver();
			String subject = null;
			if (nextStep != null) {
				if ("1".equals(nextStep.getName()) || "evaluation".equals(nextStep.getName())) {
					subject = "Employee review request of "
							+ PeopleBean.get().getPerson(workflowContext.getRequester()).getDisplayName();
				} else if ("assessment".equals(nextStep.getName()) || "Done".equals(nextStep.getName())) {
					subject = "Approved: " + "Employee review request of "
							+ PeopleBean.get().getPerson(workflowContext.getRequester()).getDisplayName();
				}
			}
			System.out.println("Subject:" + subject);
			for (String s : mailToUserList) {
				System.out.println("Entra al for");
				// workflowContext.getIdentityResolver().workflowToNative(arg0)
				Document mailDoc = db.createDocument();
				mailDoc.replaceItemValue("Form", "Memo");
				mailDoc.replaceItemValue("Subject", subject);
				mailDoc.replaceItemValue("SendTo", resolver.workflowToNative(s));
				String servername = ((HttpServletRequest) FacesContext.getCurrentInstance().getExternalContext()
						.getRequest()).getServerName();
				mailDoc.replaceItemValue("CopyTo", resolver.workflowToNative(workflowContext.getRequester()));
				DominoDocument doc = (DominoDocument) ((DominoWorkflowContext) workflowContext).getDocument();
				RichTextItem body = mailDoc.createRichTextItem("Body");
				body.appendText("Please take action. Thanks!\nhttp://" + servername + "/" + db.getFileName()
						+ "/WebEditReview.xsp?action=editDocument&documentId=" + doc.getDocument().getUniversalID());
				// mailDoc.replaceItemValue("Body", );
				mailDoc.setEncryptOnSend(false);
				mailDoc.setSignOnSend(false);
				mailDoc.send(false);
				mailDoc.recycle();
				AbstractHistoryEntry.formatString("Workflow initiated from a sample data generator");
			}
		} catch (Exception e) {
			e.printStackTrace();
		}

	}

	public void executeBeforeAction(IWorkflowContext arg0, IProcess arg1, IStep arg2, String arg3, String[] arg4) {
		// TODO Auto-generated method stub
		System.out.println("executeBeforeAction");
	}
}
