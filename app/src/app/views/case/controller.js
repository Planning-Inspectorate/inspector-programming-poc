import { fetchCases } from '@pins/inspector-programming-poc-lib/data/cases.js';

export function buildViewCase({ logger }) {
	return async (req, res) => {
		logger.info('view case');
		const caseId = req.params.caseId;
		const [caseData] = await fetchCases(1);
		caseData.id = caseId.id;

		return res.render('views/case/view.njk', {
			caseData
		});
	};
}
