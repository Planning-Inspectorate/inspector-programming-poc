import { fetchCase } from '@pins/inspector-programming-poc-lib/data/cases.js';
import { fetchInspectors } from '@pins/inspector-programming-poc-lib/data/inspectors.js';

export function buildViewCase({ logger, config }) {
	return async (req, res) => {
		const mapsKey = config.maps.key;
		const caseData = fetchCase(req.params.caseId);
		const inspectors = await fetchInspectors(config);
		const pins = [
			{
				lat: caseData.siteAddressLatLong.latitude,
				long: caseData.siteAddressLatLong.longitude
			}
		];

		logger.info(`Case location: ${JSON.stringify(caseData.siteAddressLatLong)}`);

		return res.render('views/case/view.njk', {
			caseData,
			inspectors,
			apiKey: mapsKey,
			pins,
			containerClasses: 'pins-container-wide',
			title: 'Case Details'
		});
	};
}
