import { fetchCases } from '@pins/inspector-programming-poc-lib/data/cases.js';
import { fetchInspectors } from '@pins/inspector-programming-poc-lib/data/inspectors.js';
import { getLatLongForPostcode, randomPostcode } from '#util/maps.js';

export function buildViewCase({ logger, config }) {
	return async (req, res) => {
		logger.info(`view case for ID: ${req.params.caseId}`);
		logger.info(`view case for ID: ${req.params.caseId}`);

		const mapsKey = config.maps.key;
		const [caseData] = await fetchCases(1, undefined, await randomPostcode({ key: mapsKey }));
		caseData.caseId = req.params.caseId;

		const inspectors = await fetchInspectors(10);
		const caseLatLong = await getLatLongForPostcode({ key: mapsKey }, caseData.siteAddressPostcode);
		console.log(caseLatLong);

		return res.render('views/case/view.njk', {
			caseData,
			inspectors,
			apiKey: mapsKey,
			pins: [caseLatLong],
			containerClasses: 'pins-container-wide',
			title: 'Case Details'
		});
	};
}
