package ar.com.hdi.autos.utilidades;

import java.io.Serializable;
import java.util.Vector;

import lotus.domino.AgentContext;
import lotus.domino.Database;
import lotus.domino.Document;
import lotus.domino.MIMEEntity;
import lotus.domino.MIMEHeader;
import lotus.domino.NotesFactory;
import lotus.domino.RichTextItem;
import lotus.domino.Session;
import lotus.domino.Stream;

public class Email implements Serializable {

	private static final long serialVersionUID = 1L;

	private Database db;
	private Document doc;
	private Session session;
	private AgentContext agentContext;
	private MIMEEntity body;
	private MIMEHeader mh;
	private MIMEEntity mc;
	private Stream stream;

	private boolean isTextSet;
	private boolean isHTMLSet;
	private boolean isStyleSet;

	private boolean isRebuildNeeded;
	private boolean isMailBuilt;

	private RichTextItem rtitem;

	private String str_TextPart;
	private String str_HTMLPart;
	private String str_DefaultStyles;
	private String str_Styles;

	public Email() {
		try {
			session = NotesFactory.createSession();

			agentContext = session.getAgentContext();
			db = agentContext.getCurrentDatabase();

			doc = db.createDocument();
			doc.replaceItemValue("Form", "Memo");

			str_DefaultStyles = "body{margin:10px;font-family:verdana,arial,helvetica,sans-serif;}";

			isTextSet = false;
			isHTMLSet = false;

			isRebuildNeeded = true;
			isMailBuilt = false;

		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public void setSubject(String subject) throws Exception {
		doc.replaceItemValue("Subject", subject);
	}

	public void setTextPart(String text) {
		str_TextPart = text;
		isTextSet = true;

		isRebuildNeeded = true;
	}

	public String getTextPart() {
		return str_TextPart;
	}

	public void setHTMLPart(String html) {
		str_HTMLPart = html;
		isHTMLSet = true;

		isRebuildNeeded = true;
	}

	public String getHTMLPart() {
		return str_HTMLPart;
	}

	public void setStyles(String styles) {
		str_Styles = styles;
		isStyleSet = true;

		isRebuildNeeded = true;
	}

	public void setCSS(String CSS) {
		str_Styles = CSS;
		isStyleSet = true;

		isRebuildNeeded = true;
	}

	@SuppressWarnings("unchecked")
	public void setSender(Vector sender) {
		isRebuildNeeded = true;
	}

	public void setReplyTo(String ReplyTo) throws Exception {
		doc.replaceItemValue("ReplyTo", ReplyTo);
		isRebuildNeeded = true;
	}

	public void setCopyTo(String CopyTo) throws Exception {
		doc.replaceItemValue("CopyTo", CopyTo);

		isRebuildNeeded = true;
	}

	public void setBlindCopyTo(String BlindCopyTo) throws Exception {
		doc.replaceItemValue("BlindCopyTo", BlindCopyTo);

		isRebuildNeeded = true;
	}

	private void rebuild() throws Exception {

		if (doc.hasItem("Body")) {
			doc.removeItem("Body");
		}

		if (isHTMLSet) { // Send mulipart/alternative

			// Create the MIME headers

			session.setConvertMIME(false);

			body = doc.createMIMEEntity("Body"); // This line errors if you try and rebuild the message between sends!
			mh = body.createHeader("MIME-Version");
			mh.setHeaderVal("1.0");

			mh = body.createHeader("Content-Type");
			mh.setHeaderValAndParams("multipart/alternative;boundary=\"=NextPart_=\"");

			// Send the text part first
			if (isTextSet) {
				mc = body.createChildEntity();
				stream = session.createStream();
				stream.writeText(str_TextPart);
				mc.setContentFromText(stream, "text/plain", MIMEEntity.ENC_NONE);
			}

			// Now send the HTML part. Order is important!
			mc = body.createChildEntity();
			stream = session.createStream();

			mc = body.createChildEntity();

			stream.writeText("<html>", Stream.EOL_CR);

			stream.writeText("<head>", Stream.EOL_CR);
			stream.writeText("<style>", Stream.EOL_CR);
			stream.writeText(str_DefaultStyles, Stream.EOL_CR);

			if (isStyleSet) {
				stream.writeText(str_Styles, Stream.EOL_CR);
			}

			stream.writeText("</style>", Stream.EOL_CR);
			stream.writeText("</head>", Stream.EOL_CR);

			stream.writeText("<body>", Stream.EOL_CR);
			stream.writeText(str_HTMLPart);
			stream.writeText("</body>", Stream.EOL_CR);
			stream.writeText("</html>", Stream.EOL_CR);
			mc.setContentFromText(stream, "text/html;charset=\"iso-8859-1\"", MIMEEntity.ENC_NONE);

			doc.closeMIMEEntities(true);

			session.setConvertMime(true);

		} else if (isTextSet) { // Just Text will do!

			rtitem = doc.createRichTextItem("Body");
			rtitem.appendText(str_TextPart);

		} else { // No content!
			throw new Exception("No Email Content");
		}

		doc.replaceItemValue("Principal", "Speedway Autos");
		doc.replaceItemValue("InetFrom", "Speedway Autos");

		isMailBuilt = true;
		isRebuildNeeded = false;
	}

	public void send(String sendTo) throws Exception {

		if (isMailBuilt && isRebuildNeeded) {
			throw new Exception("Email Rebuild Not Allowed Here");
		} else if (!isMailBuilt) {
			rebuild();
		}

		doc.replaceItemValue("SendTo", sendTo);

		doc.send();
	}

}
