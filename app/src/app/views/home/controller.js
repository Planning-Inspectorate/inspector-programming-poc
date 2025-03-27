import {
	createSortByDistance,
	fetchCases,
	sortByAgeAndDistance,
	sortCasesByAge
} from '@pins/inspector-programming-poc-lib/data/cases.js';
import { fetchInspectors } from '@pins/inspector-programming-poc-lib/data/inspectors.js';

/**
 * @param {Object} opts
 * @param {import('pino').BaseLogger} opts.logger
 * @param {import('../config-types.js').Config} opts.config
 * @returns {import('express').Handler}
 */
export function buildViewHome({ logger, config }) {
	return async (req, res) => {
		logger.info('view home');

		const inspectors = await fetchInspectors(config);
		const selectedInspector = inspectors.find((i) => req.query.inspectorId === i.id) || inspectors[3];
		const filters = req.query.filters || selectedInspector.filters;
		const sort = getSort(req.query.sort, selectedInspector);
		const page = req.query.page ? parseInt(req.query.page) : 1;
		const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
		const { cases, total } = fetchCases(limit, page, filters, sort);
		const formData = {
			filters,
			limit,
			page,
			sort: req.query.sort || 'age',
			inspectorId: selectedInspector.id
		};
		const pagination = getPagination(req, total, formData);
		console.log('Inspector Pin:', {
			id: selectedInspector.id,
			homeLatLong: selectedInspector.homeLatLong
		});
		return res.render('views/home/view.njk', {
			pageHeading: 'Inspector Programming PoC',
			containerClasses: 'pins-container-wide',
			title: 'Unassigned case list',
			cases: cases.map(caseViewModel),
			inspectors,
			...pagination,
			data: formData,
			apiKey: config.maps.key,
			inspectorLatLong: selectedInspector.homeLatLong,
			inspectorPin: {
				id: selectedInspector.id,
				homeLatLong: selectedInspector.homeLatLong,
				firstName: selectedInspector.firstName,
				lastName: selectedInspector.lastName,
				address: selectedInspector.address.postcode,
				grade: selectedInspector.grade,
				fte: selectedInspector.fte,
				caseSpecialisms: selectedInspector.filters.caseSpecialisms
			}
		});
	};
}

function getPagination(req, total, formData) {
	const currentUrl = '/?' + getCurrentUrl(new URLSearchParams(), formData).toString();
	const pageItems = [];

	for (let i = 0; i < Math.ceil(total / formData.limit); i++) {
		pageItems.push({ href: currentUrl + '&page=' + (i + 1), number: i + 1, current: i + 1 === formData.page });
	}

	console.log(currentUrl);

	return {
		pageItems,
		nextPage:
			formData.page < Math.ceil(total / formData.limit)
				? {
						href: currentUrl + '&page=' + (formData.page + 1)
					}
				: null,
		previousPage:
			formData.page > 1
				? {
						href: currentUrl + '&page=' + (formData.page - 1)
					}
				: null
	};
}

function getCurrentUrl(url, formData, prefix = '') {
	for (const [key, value] of Object.entries(formData)) {
		const prefixedKey = prefix ? `${prefix}[${key}]` : key;

		if (Array.isArray(value)) {
			for (const v of value) {
				url.append(prefixedKey, v);
			}
		} else if (typeof value === 'object') {
			getCurrentUrl(url, value, key);
		} else if (key !== 'page') {
			url.set(prefixedKey, value);
		}
	}

	return url;
}

function getSort(sort, selectedInspector) {
	const sortFunctions = {
		age: sortCasesByAge,
		distance: createSortByDistance(selectedInspector.homeLatLong),
		hybrid: sortByAgeAndDistance(selectedInspector.homeLatLong)
	};

	return sortFunctions[sort] || sortFunctions.age;
}

export function caseViewModel(c) {
	return {
		...c,
		finalCommentsDate: c.finalCommentsDate.toLocaleDateString(),
		color:
			c.caseAge > 45
				? 'fa72a8'
				: c.caseAge > 39
					? 'dea529'
					: c.caseAge > 28
						? 'd0b300'
						: c.caseAge > 24
							? 'd0b300'
							: '89a63a'
	};
}

export function buildPostHome({ logger }) {
	return async (req, res) => {
		logger.info('post home');

		const redirectUrl =
			req.body.action === 'view' ? `/inspector/${req.body.inspectorId}` : `/?inspectorId=${req.body.inspectorId}`;

		return res.redirect(redirectUrl);
	};
}
