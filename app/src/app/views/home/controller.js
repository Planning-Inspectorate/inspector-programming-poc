import {
	createSortByDistance,
	fetchCases,
	sortByAgeAndDistance,
	sortCasesByAge
} from '@pins/inspector-programming-poc-lib/data/cases.js';
import { fetchInspectors } from '@pins/inspector-programming-poc-lib/data/inspectors.js';

/**
 * @param {Object} opts
 * @param {import('pino').BaseLogger} opts.logger
 * @param {import('../config-types.js').Config} opts.config
 * @returns {import('express').Handler}
 */
export function buildViewHome({ logger, config }) {
	return async (req, res) => {
		logger.info('view home');

		const mapsKey = config.maps.key;
		const inspectors = await fetchInspectors(config);
		const selectedInspector = inspectors.find((i) => req.query.inspector === i.id) || inspectors[0];
		const filters = req.query.filters || selectedInspector.filters;
		const sort = getSort(req.query.sort, selectedInspector);
		const cases = fetchCases(10, filters, sort);

		const pins = cases.map((caseData) => {
			const { latitude, longitude } = caseData.siteAddressLatLong;
			return {
				lat: latitude,
				long: longitude,
				caseId: caseData.caseId,
				caseAge: caseData.caseAge,
				finalCommentsDate: caseData.finalCommentsDate,
				caseStatus: caseData.caseStatus,
				lpaName: caseData.lpaName,
				siteAddressPostcode: caseData.siteAddressPostcode,
				caseSpecialisms: caseData.caseSpecialisms,
				appealEventType: caseData.appealEventType,
				caseProcedure: caseData.caseProcedure,
				allocationLevel: caseData.allocationLevel
			};
		});

		return res.render('views/home/view.njk', {
			pageHeading: 'Inspector Programming PoC',
			containerClasses: 'pins-container-wide',
			title: 'Unassigned Case List',
			cases: cases.map(caseViewModel),
			inspectors,
			inspectorId: selectedInspector.id,
			data: {
				filters
			},
			apiKey: mapsKey,
			pins,
			sort: req.query.sort
		});
	};
}

function getSort(sort, selectedInspector) {
	const sortFunctions = {
		age: sortCasesByAge,
		distance: createSortByDistance(selectedInspector.homeLatLong),
		hybrid: sortByAgeAndDistance(selectedInspector.homeLatLong)
	};

	return sortFunctions[sort] || sortFunctions.age;
}

function caseViewModel(c) {
	const copy = { ...c };
	copy.finalCommentsDate = c.finalCommentsDate.toLocaleDateString();
	return copy;
}

export function buildPostHome({ logger }) {
	return async (req, res) => {
		logger.info('post home');

		const redirectUrl =
			req.body.action === 'view' ? `/inspector/${req.body.inspector}` : `/?inspector=${req.body.inspector}`;

		return res.redirect(redirectUrl);
	};
}
