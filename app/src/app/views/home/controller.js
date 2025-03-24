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

		return res.render('views/home/view.njk', {
			pageHeading: 'Inspector Programming PoC',
			containerClasses: 'pins-container-wide',
			title: 'Unassigned Case List',
			cases: cases.map(caseViewModel),
			inspectors,
			data: {
				filters,
				sort: req.query.sort,
				inspectorId: selectedInspector.id
			},
			apiKey: mapsKey,
			inspectorLatLong: selectedInspector.homeLatLong
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

export function caseViewModel(c) {
	return {
		...c,
		finalCommentsDate: c.finalCommentsDate.toLocaleDateString(),
		color:
			c.caseAge > 45
				? 'fa72a8'
				: c.caseAge > 39
					? 'dea529'
					: c.caseAge > 28
						? 'd0b300'
						: c.caseAge > 24
							? 'd0b300'
							: '89a63a'
	};
}

export function buildPostHome({ logger }) {
	return async (req, res) => {
		logger.info('post home');

		const redirectUrl =
			req.body.action === 'view' ? `/inspector/${req.body.inspector}` : `/?inspector=${req.body.inspector}`;

		return res.redirect(redirectUrl);
	};
}
