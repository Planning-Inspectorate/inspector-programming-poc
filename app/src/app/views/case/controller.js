import { fetchCases } from '@pins/inspector-programming-poc-lib/data/cases.js';

export function buildViewCase({ logger }) {
	return async (req, res) => {
		logger.info('view case');
		const caseId = req.params.caseId;
		const cases = await fetchCases(10);
		const caseData = cases[0];
		caseData.id = caseId.id;

		return res.render('views/case/view.njk', {
			caseData
		});
	};
}
