import { fetchCases } from '@pins/inspector-programming-poc-lib/data/cases.js';

/**
 * @param {Object} opts
 * @param {import('@prisma/client').PrismaClient} opts.db
 * @param {import('pino').BaseLogger} opts.logger
 * @returns {import('express').Handler}
 */
export function buildViewHome({ logger }) {
	return async (req, res) => {
		logger.info('view home');

		const cases = fetchCases();

		return res.render('views/home/view.njk', {
			pageHeading: 'Inspector Programming PoC',
			containerClasses: 'pins-container-wide',
			cases
		});
	};
}
