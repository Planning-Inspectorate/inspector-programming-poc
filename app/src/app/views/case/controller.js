import { fetchCases } from '@pins/inspector-programming-poc-lib/data/cases.js';
import { fetchInspectors } from '@pins/inspector-programming-poc-lib/data/inspectors.js';

export function buildViewCase({ logger, config }) {
	return async (req, res) => {
		logger.info(`view case for ID: ${req.params.caseId}`);
		logger.info(`view case for ID: ${req.params.caseId}`);

		const [caseData] = await fetchCases(1);
		caseData.caseId = req.params.caseId;

		const inspectors = await fetchInspectors(10);

		return res.render('views/case/view.njk', {
			caseData,
			inspectors,
			containerClasses: 'pins-container-wide',
			title: 'Case Details'
		});
	};
}
