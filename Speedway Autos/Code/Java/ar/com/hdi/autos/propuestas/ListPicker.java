package ar.com.hdi.autos.propuestas;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import com.ibm.commons.util.StringUtil;
import com.ibm.xsp.extlib.component.picker.data.IPickerEntry;
import com.ibm.xsp.extlib.component.picker.data.IPickerOptions;
import com.ibm.xsp.extlib.component.picker.data.IPickerResult;
import com.ibm.xsp.extlib.component.picker.data.IValuePickerData;
import com.ibm.xsp.extlib.component.picker.data.SimplePickerResult;

public class ListPicker implements IValuePickerData, Serializable {
	private static final long serialVersionUID = 1L;

	private List<String> options_ = null;

	public ListPicker() {
	}

	public ListPicker(List<String> options) {
		options_ = options;
	}

	@SuppressWarnings("unchecked")
	public ListPicker(Set<String> options) {
		options_ = new ArrayList(options);
	}

	public String[] getSourceLabels() {
		return null;
	}

	public boolean hasCapability(int capability) {
		return false;
	}

	/*
	 * This method appears to be the one that gets the entries for the picker
	 * 
	 * (non-Javadoc)
	 * 
	 * @see com.ibm.xsp.extlib.component.picker.data.IPickerData#readEntries(com. ibm.xsp.extlib.component.picker.data.IPickerOptions)
	 */
	public IPickerResult readEntries(IPickerOptions options) {
		String startKey = options.getStartKey();
		String key = options.getKey();
		int start = options.getStart();
		@SuppressWarnings("unused")
		int count = options.getCount();
		int searchIndex = 0;
		List<String> opts = filteredOptions(key, startKey, start, searchIndex);
		List<IPickerEntry> entries = new ArrayList<IPickerEntry>();
		for (String opt : opts) {
			entries.add(new SimplePickerResult.Entry(opt, opt));
		}

		return new SimplePickerResult(entries, -1);
	}

	private List<String> filteredOptions(String key, String startKey, int start, int searchIndex) {
		List<String> retVal = new ArrayList<String>();
		int first = -1;
		if (StringUtil.isNotEmpty(key)) {
			// We've got a typeahead key passed in, jump to first entry
			// beginning with that key
			for (int i = 0; i < options_.size(); i++) {
				if (StringUtil.startsWithIgnoreCase(options_.get(i), key)) {
					first = i;
					break;
				}
			}
			if (first >= 0) {
				// And add entries that start with the key
				for (int i = first; i < options_.size(); i++) {
					if (StringUtil.startsWithIgnoreCase(options_.get(i), key)) {
						retVal.add(options_.get(i));
					}
				}
			}
		} else if (StringUtil.isNotEmpty(startKey)) {
			// We've got a search key passed in, jump to that entry
			for (int i = 0; i < options_.size(); i++) {
				if (options_.get(i).compareToIgnoreCase(startKey) >= 0) {
					first = i;
					break;
				}
			}
			if (first >= 0) {
				// And add all remaining entries
				for (int i = first; i < options_.size(); i++) {
					retVal.add(options_.get(i));
				}
			}
		} else {
			retVal.addAll(options_);
		}
		return retVal;
	}

	/*
	 * This method appears to be the one that is used for validation, to get an entry based on a value or values in the relevant component. The
	 * ArrayList only has values, so check values passed in and return those that exist in the options
	 * 
	 * (non-Javadoc)
	 * 
	 * @see com.ibm.xsp.extlib.component.picker.data.IPickerData#loadEntries(java .lang.Object[], java.lang.String[])
	 */
	public List<IPickerEntry> loadEntries(Object[] values, String[] attributes) {
		List<IPickerEntry> entries = new ArrayList<IPickerEntry>();
		if (null != values) {
			for (int i = 0; i < values.length; i++) {
				String checkStr = values[i].toString();
				if (StringUtil.isNotEmpty(checkStr)) {
					for (String option : options_) {
						if (checkStr.equals(option)) {
							break;
						}
					}
					entries.add(new SimplePickerResult.Entry(checkStr, checkStr));
				}
			}
		}
		return entries;
	}
}