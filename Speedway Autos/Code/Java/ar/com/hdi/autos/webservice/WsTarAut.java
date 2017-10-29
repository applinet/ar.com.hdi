package ar.com.hdi.autos.webservice;

import java.io.Serializable;

import javax.xml.parsers.SAXParser;
import javax.xml.parsers.SAXParserFactory;

import org.xml.sax.Attributes;
import org.xml.sax.SAXException;
import org.xml.sax.helpers.DefaultHandler;

public class WsTarAut implements Serializable {

	private static final long serialVersionUID = 1L;

	public WsTarAut() { // constructor stub
	}

	public static void getArrayTags(String strUrl) {

		try {

			SAXParserFactory factory = SAXParserFactory.newInstance();
			SAXParser saxParser = factory.newSAXParser();

			DefaultHandler handler = new DefaultHandler() {
				// Defino todas las variables a leer del xml
				boolean bTarifaCod = false;
				boolean bTarifaDes = false;
				boolean bTarifaDft = false;

				@Override
				public void startElement(String uri, String localName, String qName, Attributes attributes)
						throws SAXException {
					// Recorre elemento a elemento cuando encuentra el tag la variable a true
					if (qName.equals("Tarifa")) { // Si el tag es vehiculo creo el obj
						System.out.println("Tengo una nuneva Tarifa");
					}

					bTarifaCod = (qName.equalsIgnoreCase("TarifaCod")) ? true : false;
					bTarifaDes = (qName.equalsIgnoreCase("TarifaDes")) ? true : false;
					bTarifaDft = (qName.equalsIgnoreCase("TarifaDft")) ? true : false;
				}

				@Override
				public void endElement(String uri, String localName, String qName) throws SAXException {
					if (qName.equals("Tarifa")) { // Cuando termina el tag Tarifa
						// Podria tener el objeto cargado
					}
				}

				@Override
				public void characters(char ch[], int start, int length) throws SAXException {
					if (bTarifaCod) {
						System.out.println(new String(ch, start, length));
						bTarifaCod = false;
					}

					if (bTarifaDes) {

						bTarifaDes = false;
					}

					if (bTarifaDft) {

						bTarifaDft = false;
					}

				}

			};

			saxParser.parse(strUrl, handler);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
