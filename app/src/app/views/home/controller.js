import { fetchCases } from '@pins/inspector-programming-poc-lib/data/cases.js';
import { fetchInspectors } from '@pins/inspector-programming-poc-lib/data/inspectors.js';

/**
 * @param {Object} opts
 * @param {import('pino').BaseLogger} opts.logger
 * @returns {import('express').Handler}
 */
export function buildViewHome({ logger }) {
	return async (req, res) => {
		logger.info('view home');

		await req.entraClient.createEvent('8c70bc62-e16b-450e-84dc-4edff2adf733', 'test event', new Date(), 30);

		const inspectors = await fetchInspectors(10);
		const selectedInspector = inspectors.find((i) => req.query.inspector === i.id) || inspectors[0];
		const filters = req.query.filters || selectedInspector.filters;
		const cases = await fetchCases(10, filters);

		return res.render('views/home/view.njk', {
			pageHeading: 'Inspector Programming PoC',
			containerClasses: 'pins-container-wide',
			title: 'Unassigned Case List',
			cases: cases.map(caseViewModel),
			inspectors,
			inspectorId: selectedInspector.id,
			data: {
				filters
			}
		});
	};
}

function caseViewModel(c) {
	const copy = { ...c };
	copy.finalCommentsDate = c.finalCommentsDate.toLocaleDateString();
	return copy;
}
