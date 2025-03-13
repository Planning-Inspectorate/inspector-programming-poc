import { fetchCases } from '@pins/inspector-programming-poc-lib/data/cases.js';
import { fetchInspectors } from '@pins/inspector-programming-poc-lib/data/inspectors.js';
import { getLatLongForPostcode } from '#util/maps.js';

export function buildViewCase({ logger, config }) {
	return async (req, res) => {
		logger.info(`view case for ID: ${req.params.caseId}`);

		const [caseData] = await fetchCases(1);
		caseData.caseId = req.params.caseId;

		const inspectors = await fetchInspectors(10);
		const mapsKey = config.maps.key;

		const casesLatLong = [await getLatLongForPostcode({ key: mapsKey }, caseData.siteAddressPostcode)];

		const inspectorsLatLong = await Promise.all(
			inspectors
				.map((c) => c.address?.postcode)
				.filter(Boolean)
				.map((postcode) => getLatLongForPostcode({ key: mapsKey }, postcode))
				.filter(Boolean)
		);

		return res.render('views/case/view.njk', {
			caseData,
			inspectors,
			apiKey: mapsKey,
			casesLatLong,
			inspectorsLatLong,
			containerClasses: 'pins-container-wide',
			title: 'Case Details'
		});
	};
}
