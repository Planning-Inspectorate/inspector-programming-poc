import { fetchCases } from '@pins/inspector-programming-poc-lib/data/cases.js';
import { fetchInspectors } from '@pins/inspector-programming-poc-lib/data/inspectors.js';
import { getLatLongForPostcode, randomPostcode } from '#util/maps.js';

/**
 * @param {Object} opts
 * @param {import('pino').BaseLogger} opts.logger
 * @returns {import('express').Handler}
 */
export function buildViewHome({ logger }) {
	return async (req, res) => {
		logger.info('view home');

		const defaultFilters = {
			caseProcedure: ['Written reps', 'Hearing', 'Inquiry'],
			lpaRegion: ['North', 'South', 'East', 'West'],
			caseType: ['W', 'D'],
			caseSpecialisms: [
				'Access',
				'Listed building and enforcement',
				'Roads and traffics',
				'Natural heritage',
				'Schedule 1'
			],
			allocationLevel: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
		};

		const filters = req.query.filters || defaultFilters;
		const cases = await fetchCases(10, filters);
		const inspectors = await fetchInspectors(10);

		return res.render('views/home/view.njk', {
			pageHeading: 'Inspector Programming PoC',
			containerClasses: 'pins-container-wide',
			cases: cases.map(caseViewModel),
			inspectors,
			data: {
				filters
			}
		});
	};
}

/**
 * @param {Object} opts
 * @param {import('./config-types.js').Config} opts.config
 * @param {import('pino').BaseLogger} opts.logger
 * @returns {import('express').Handler}
 */
export function buildViewMap({ logger, config }) {
	return async (req, res) => {
		logger.info('view map');
		const mapsKey = config.maps.key;

		const cases = await fetchCases(10, () => randomPostcode({ key: mapsKey }));
		logger.info('fetchInspectors');
		const inspectors = await fetchInspectors(10, () => randomPostcode({ key: mapsKey }));

		logger.info('getLatLongForPostcode');
		const casesLatLong = await Promise.all(
			cases
				.map((c) => c.siteAddressPostcode)
				.filter(Boolean)
				.map((postcode) => getLatLongForPostcode({ key: mapsKey }, postcode))
				.filter(Boolean)
		);

		const inspectorsLatLong = await Promise.all(
			inspectors
				.map((c) => c.address?.postcode)
				.filter(Boolean)
				.map((postcode) => getLatLongForPostcode({ key: mapsKey }, postcode))
				.filter(Boolean)
		);

		return res.render('views/home/view-vector-map.njk', {
			pageHeading: 'Inspector Programming PoC',
			containerClasses: 'pins-container-wide',
			apiKey: mapsKey,
			cases,
			casesLatLong,
			inspectorsLatLong,
			inspectors: inspectors.map(inspectorViewModel)
		});
	};
}

function inspectorViewModel(inspector) {
	const copy = { ...inspector };
	copy.preclusions = preclusionsViewModel(inspector.preclusions);
	copy.specialisms = specialismsViewModel(inspector.specialisms);
	copy.inspectorManager = inspector.inspectorManager ? 'Yes' : 'No';
	return copy;
}

function preclusionsViewModel(preclusions) {
	return (
		preclusions
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
			.join('\n') || 'None'
	);
}

function specialismsViewModel(specialisms) {
	return (
		specialisms
			.map((p) => {
				return `${p.name} (${p.proficiency}, ${p.validFrom?.toDateString()})`;
			})
			.join('\n') || 'None'
	);
}

function caseViewModel(c) {
	const copy = { ...c };
	copy.finalCommentsDate = c.finalCommentsDate.toLocaleDateString();
	return copy;
}
