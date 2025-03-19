import { createSortByDistance, fetchCases, sortCasesByAge } from '@pins/inspector-programming-poc-lib/data/cases.js';
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

		const inspectors = await fetchInspectors(config);
		const selectedInspector = inspectors.find((i) => req.query.inspector === i.id) || inspectors[0];
		const filters = req.query.filters || selectedInspector.filters;
		const sort = req.query.sort || 'age';
		const inspectorLatLong = { latitude: 52.42950704867449, longitude: -1.8996231835728423 };
		const sortFunc = sort === 'age' ? sortCasesByAge : await createSortByDistance(inspectorLatLong);
		const cases = fetchCases(10, filters, sortFunc);

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
			sort
		});
	};
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
