import { fetchCases } from '@pins/inspector-programming-poc-lib/data/cases.js';

export function buildViewCase({ logger }) {
	return async (req, res) => {
		logger.info(`view case for ID: ${req.params.caseId}`);

		const [caseData] = await fetchCases(1);
		caseData.id = req.params.caseId;

		return res.render('views/case/view.njk', {
			caseData
		});
	};
}
