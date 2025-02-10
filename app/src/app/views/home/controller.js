import { fetchCases } from '@pins/inspector-programming-poc-lib/data/cases.js';
import { fetchInspectors } from '@pins/inspector-programming-poc-lib/data/inspectors.js';

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
		const inspectors = fetchInspectors();

		return res.render('views/home/view.njk', {
			pageHeading: 'Inspector Programming PoC',
			containerClasses: 'pins-container-wide',
			cases,
			inspectors: inspectors.map((i) => {
				const copy = { ...i };
				copy.preclusions =
					i.preclusions
						.map((p) => {
							if (p.lpaId) {
								return `LPA: ${p.lpaId}`;
							}
							if (p.postcode) {
								return `Postcode: ${p.postcode}`;
							}
							if (p.organisation) {
								return `Org: ${p.organisation}`;
							}
							return '';
						})
						.join('\n') || 'None';
				copy.specialisms =
					i.specialisms
						.map((p) => {
							return `${p.name} (${p.proficiency}, ${p.validFrom?.toDateString()})`;
						})
						.join('\n') || 'None';
				copy.inspectorManager = i.inspectorManager ? 'Yes' : 'No';
				return copy;
			})
		});
	};
}
