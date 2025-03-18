import { fetchInspectors } from '@pins/inspector-programming-poc-lib/data/inspectors.js';

/**
 * @param {Object} opts
 * @param {import('pino').BaseLogger} opts.logger
 * @param {import('../config-types.js').Config} opts.config
 * @returns {import('express').Handler}
 */
export function buildViewInspector({ logger, config }) {
	return async (req, res) => {
		logger.info(req.params.inspectorId);

		const inspectors = await fetchInspectors(config);
		const inspector = inspectors.find((i) => i.id === req.params.inspectorId);
		logger.info(inspector);
		return res.render('views/inspector/view.njk', {
			inspector,
			containerClasses: 'pins-container-wide',
			title: 'Inspector Details'
		});
	};
}
