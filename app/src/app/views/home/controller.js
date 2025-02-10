/**
 * @param {Object} opts
 * @param {import('@prisma/client').PrismaClient} opts.db
 * @param {import('pino').BaseLogger} opts.logger
 * @returns {import('express').Handler}
 */
export function buildViewHome({ logger }) {
	return async (req, res) => {
		logger.info('view home');

		return res.render('views/home/view.njk', {
			pageHeading: 'Inspector Programming PoC',
			containerClasses: 'pins-container-wide',
			cases: [
				{ reference: 'A1B2', location: 'Some place', Assigned: 'No' },
				{ reference: 'A1B3', location: 'Some place', Assigned: 'No' },
				{ reference: 'A1B4', location: 'Some place', Assigned: 'No' },
				{ reference: 'A1B5', location: 'Some place', Assigned: 'No' },
				{ reference: 'A1B6', location: 'Some place', Assigned: 'No' },
				{ reference: 'A6B2', location: 'Some place', Assigned: 'No' },
				{ reference: 'A9B2', location: 'Some place', Assigned: 'No' },
				{ reference: 'A1B8', location: 'Some place', Assigned: 'No' },
				{ reference: 'A1B2', location: 'Some place', Assigned: 'No' },
				{ reference: 'A8B5', location: 'Some place', Assigned: 'No' },
				{ reference: 'A1B2', location: 'Some place', Assigned: 'No' }
			]
		});
	};
}
