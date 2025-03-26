import { fetchCase } from '@pins/inspector-programming-poc-lib/data/cases.js';
import { fetchInspectors } from '@pins/inspector-programming-poc-lib/data/inspectors.js';
import { caseViewModel } from '../home/controller.js';

export function buildViewCase({ config }) {
	return async (req, res) => {
		const mapsKey = config.maps.key;
		const caseData = fetchCase(req.params.caseId);
		const inspectors = await fetchInspectors(config);
		const inspectorId = req.query.inspectorId;
		const associatedInspector = inspectors.find((inspector) => inspector.id === inspectorId);
		const inspectorLatLong = associatedInspector.homeLatLong;

		return res.render('views/case/view.njk', {
			caseData,
			inspectors,
			inspectorId,
			apiKey: mapsKey,
			inspectorLatLong,
			pins: [caseViewModel(caseData)],
			containerClasses: 'pins-container-wide',
			title: 'Case Details'
		});
	};
}
