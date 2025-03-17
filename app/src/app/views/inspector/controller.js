import { fetchInspectors } from '@pins/inspector-programming-poc-lib/data/inspectors.js';

export function buildViewInspector({ logger }) {
	return async (req, res) => {
		logger.info(req.params.inspectorId);

		const inspectors = await fetchInspectors(10);
		const inspector = inspectors.find((i) => i.id === req.params.inspectorId);
		logger.info(inspector);
		return res.render('views/inspector/view.njk', {
			inspector,
			containerClasses: 'pins-container-wide',
			title: 'Inspector Details'
		});
	};
}
