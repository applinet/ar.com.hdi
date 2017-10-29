//Utiliza MbValuePicker
package ar.com.hdi.autos.utilidades;

import java.util.ArrayList;
import java.util.List;

import com.ibm.xsp.extlib.component.picker.data.IPickerEntry;
import com.ibm.xsp.extlib.component.picker.data.IPickerOptions;
import com.ibm.xsp.extlib.component.picker.data.IPickerResult;
import com.ibm.xsp.extlib.component.picker.data.IValuePickerData;
import com.ibm.xsp.extlib.component.picker.data.SimplePickerResult;

public class XLValuePicker implements IValuePickerData {

	public XLValuePicker() {
		// Auto-generated constructor stub
	}

	public String[] getSourceLabels() {
		return null;
	}

	public boolean hasCapability(int capability) {
		if (capability == CAPABILITY_EXTRAATTRIBUTES) {
			return false;
		}
		return false;
	}

	public List<IPickerEntry> loadEntries(Object[] ids, String[] attributes) {
		List<IPickerEntry> entries = new ArrayList<IPickerEntry>();
		if (ids != null) {
			for (int i = 0; i < ids.length; i++) {
				String id = ids[i].toString();
				entries.add(new SimplePickerResult.Entry(id, null));
			}
		}
		return entries;
	}

	public IPickerResult readEntries(IPickerOptions options) {
		int start = options.getStart();
		int count = options.getCount();
		List<IPickerEntry> entries = new ArrayList<IPickerEntry>();
		for (int i = start; count > 0 && i < REQUESTS.length; i++, count--) {
			String r = REQUESTS[i];
			entries.add(new SimplePickerResult.Entry(r, null));
		}
		return new SimplePickerResult(entries, -1);
	}

	private static final String[] REQUESTS = { "Morello", "HDI", "HDI", "HDI", "HDI", "HDI", "HDI", "HDI", "HDI",
			"HDI", "HDI", "HDI", "HDI", "HDI", "HDI", "HDI", "Fernando", "HDI", "HDI", "HDI", "HDI", "HDI", "HDI",
			"HDI", "HDI", "HDI", "HDI", "HDI", "HDI", "HDI", "Tortorelli", };

}
