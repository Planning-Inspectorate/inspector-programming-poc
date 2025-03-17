import { fetchInspectors } from '@pins/inspector-programming-poc-lib/data/inspectors.js';

export function buildViewInspector({ logger }) {
	return async (req, res) => {
		logger.info(`view case for ID: ${req.params.caseId}`);

		const inspectors = await fetchInspectors(10);
		const inspectorName = `${inspectors[0].firstName} ${inspectors[0].lastName}`;
		inspectors.inspectorName = req.params.inspectorName;

		return res.render('views/inspector/view.njk', {
			inspectors,
			containerClasses: 'pins-container-wide',
			title: 'Inspector Details',
			inspectorName
		});
	};
}
