package ar.com.hdi.autos.utilidades;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Vector;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

public class UnZip {

	/**
	 * Unzip it
	 * 
	 * @param zipFile
	 *            input zip file
	 * @param output
	 *            zip file output folder
	 */
	public Vector<String> unZipIt(String zipFile, String outputFolder) {

		Vector<String> vecResult = new Vector<String>();
		byte[] buffer = new byte[1024];

		try {
			// get the zip file content
			ZipInputStream zis = new ZipInputStream(new FileInputStream(zipFile));
			// get the zipped file list entry
			ZipEntry ze = zis.getNextEntry();

			while (ze != null) {

				String fileName = ze.getName();
				File newFile = new File(outputFolder + File.separator + fileName);

				// System.out.println("file unzip : " + newFile.getAbsoluteFile());

				vecResult.add(newFile.getAbsoluteFile().toString());
				// create all non exists folders
				// else you will hit FileNotFoundException for compressed folder
				new File(newFile.getParent()).mkdirs();

				FileOutputStream fos = new FileOutputStream(newFile);

				int len;
				while ((len = zis.read(buffer)) > 0) {
					fos.write(buffer, 0, len);
				}

				fos.close();
				ze = zis.getNextEntry();
			}

			zis.closeEntry();
			zis.close();

			// System.out.println("Done Zip");

		} catch (IOException ex) {
			ex.printStackTrace();
		}
		return vecResult;
	}

	public void unZipIt(FileInputStream fIS, String outputFolder) {

		byte[] buffer = new byte[1024];

		try {
			// get the zip file content
			ZipInputStream zis = new ZipInputStream(fIS);
			// get the zipped file list entry
			ZipEntry ze = zis.getNextEntry();

			while (ze != null) {

				String fileName = ze.getName();
				File newFile = new File(outputFolder + File.separator + fileName);

				System.out.println("file unzip : " + newFile.getAbsoluteFile());

				// create all non exists folders
				// else you will hit FileNotFoundException for compressed folder
				new File(newFile.getParent()).mkdirs();

				FileOutputStream fos = new FileOutputStream(newFile);

				int len;
				while ((len = zis.read(buffer)) > 0) {
					fos.write(buffer, 0, len);
				}

				fos.close();
				ze = zis.getNextEntry();
			}

			zis.closeEntry();
			zis.close();

			System.out.println("Done FileInputStream");

		} catch (IOException ex) {
			ex.printStackTrace();
		}
	}
}
