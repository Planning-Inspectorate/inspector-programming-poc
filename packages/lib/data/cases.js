import { fakerEN_GB as faker } from '@faker-js/faker';
import { APPEAL_CASE_STATUS, APPEAL_EVENT_TYPE } from 'pins-data-model';
import fs from 'node:fs';

const arrayElement = faker.helpers.arrayElement;
const casesString = fs.readFileSync(import.meta.dirname + '/cases.json', 'utf-8');
const cases = JSON.parse(casesString);

for (const c of cases) {
	c.finalCommentsDate = new Date(c.finalCommentsDate);
	c.caseSubmittedDate = new Date(c.caseSubmittedDate);
	c.caseValidDate = new Date(c.caseValidDate);
	c.caseStartedDate = new Date(c.caseStartedDate);
	c.targetDate = new Date(c.targetDate);
	c.rosewellTarget = new Date(c.rosewellTarget);
	c.personalTargetDate = new Date(c.personalTargetDate);
	c.appealEventDate = new Date(c.appealEventDate);
}

/**
 * @param {number} limit
 * @param {number} page
 * @param {Record<string, string | string[]>} filters
 * @param {(cases: import('./types.js').AppealCase[]) => import('./types.js').AppealCase[]} sort
 * @returns {import('./types.js').FetchCasesResponse}
 */
export function fetchCases(limit, page, filters, sort = sortCasesByAge) {
	const filter = applyFilters(filters);
	const filteredCases = cases.filter(filter);
	const startIndex = Math.min(limit * (page - 1), filteredCases.length);
	const endIndex = Math.min(limit * page, filteredCases.length);

	return {
		cases: sort(filteredCases).slice(startIndex, endIndex),
		total: filteredCases.length
	};
}

/**
 * @param {string} caseId
 * @returns {import('./types.js').AppealCase}
 */
export function fetchCase(caseId) {
	return cases.find((c) => c.caseId === caseId);
}

// eslint-disable-next-line no-unused-vars
async function createCase(randomPostcode) {
	const allocationBand = arrayElement([1, 2, 3]);
	const caseAge = faker.number.int({ min: 1, max: 52 });
	return {
		caseId: faker.string.numeric(7),
		caseType: arrayElement(['W', 'D']),
		caseStatus: arrayElement(Object.values(APPEAL_CASE_STATUS)),
		caseProcedure: arrayElement(['Written reps', 'Hearing', 'Inquiry']),
		lpaName: arrayElement([
			'Arun',
			'Ashford',
			'Ashfield',
			'Aylesbury Vale',
			'Babergh',
			'Bassetlaw',
			'Basildon',
			'Basingstoke and Deane',
			'City of Edinburgh',
			'Eden',
			'East Dorset',
			'East Dunbartonshire',
			'East Hampshire',
			'East Hertfordshire',
			'East Lindsey',
			'Elmbridge',
			'East Lothian',
			'Eilean Siar',
			'North Norfolk',
			'North Northamptonshire',
			'Northampton',
			'Norwich',
			'North Somerset',
			'North of Tyne',
			'Northamptonshire',
			'Neath Port Talbot',
			'Nottinghamshire',
			'North Tyneside',
			'Nuneaton and Bedworth',
			'North Warwickshire',
			'North West Leicestershire',
			'Newham',
			'Newport',
			'North Yorkshire'
		]),
		allocationBand,
		allocationLevel: randomAllocationLevel(allocationBand),
		caseSpecialisms: arrayElement([
			'Access',
			'Listed building and enforcement',
			'Roads and traffics',
			'Natural heritage',
			'Schedule 1'
		]),
		caseSubmittedDate: faker.date.past(),
		caseValidDate: faker.date.past(),
		siteAddressPostcode: await randomPostcode(),
		siteAddressLatLong: {
			latitude: faker.location.latitude({ min: 51.5, max: 55.05 }),
			longitude: faker.location.longitude({ min: -0.5, max: 0.5 })
		},
		caseLevel: arrayElement(['1', '2', '3']),
		lpaRegion: arrayElement(['North', 'South', 'East', 'West']),
		caseAge,
		linkedCases: faker.string.numeric(7),
		finalCommentsDate: faker.date.future(),
		programmingStatus: arrayElement(['P', 'D', 'S']),
		jurisdiction: arrayElement([
			'Transferred',
			'Transferred Excpeted',
			'Transferred Recovered',
			'Transferred Discretionary',
			'Transfer Requested by Decision Branch',
			'Transferred Rejected',
			'Transferred Reconsidered'
		]),
		appellantCostsAppliedFor: arrayElement(['Yes', 'No']),
		agentId: faker.string.numeric(7),
		appellantId: faker.string.numeric(7),
		caseOfficerId: faker.string.numeric(7),
		eoResponsible: faker.string.numeric(7),
		lpaPhone: faker.phone.number(),
		agentPhone: faker.phone.number(),
		appellantPhone: faker.phone.number(),
		caseOfficerPhone: faker.phone.number(),
		eoPhone: faker.phone.number(),
		caseStartedDate: faker.date.past(),
		targetDate: faker.date.future(),
		rosewellTarget: faker.date.future(),
		personalTargetDate: faker.date.future(),
		appellantProcedurePreferenceDuration: faker.string.numeric(1),
		appealEventType: arrayElement(Object.values(APPEAL_EVENT_TYPE)),
		appealEventDate: faker.date.future(),
		programmingNotes: faker.lorem.sentence(),
		venue: faker.location.streetAddress(),
		jobDetails: faker.lorem.sentence(),
		specialCircumstances: faker.lorem.sentence()
	};
}

function randomAllocationLevel(band) {
	switch (band) {
		case 1:
			return arrayElement(['E', 'F', 'G', 'H']);
		case 2:
			return arrayElement(['C', 'D']);
		case 3:
			return arrayElement(['A', 'B']);
	}
	return null;
}

function applyFilters(filters) {
	return (appealCase) => {
		return Object.entries(filters).every(([key, value]) => {
			if (key === 'ageRange') {
				const [min, max] = value.split('-');
				return value === 'all' ? true : appealCase.caseAge >= min && appealCase.caseAge <= max;
			} else if (Array.isArray(value)) {
				if (Array.isArray(appealCase[key])) {
					return value.some((v) => appealCase[key].includes(v));
				} else {
					return value.includes(appealCase[key]);
				}
			} else if (typeof value === 'string' && value.length > 0) {
				return appealCase[key] === value;
			} else {
				return true;
			}
		});
	};
}

export function sortCasesByAge(inputCases) {
	return inputCases.toSorted((a, b) => b.caseAge - a.caseAge);
}

export function createSortByDistance(inspectorLatLong) {
	return (inputCases) =>
		inputCases.toSorted((a, b) => {
			const distanceA = distanceBetween(a.siteAddressLatLong, inspectorLatLong);
			const distanceB = distanceBetween(b.siteAddressLatLong, inspectorLatLong);
			return distanceA - distanceB;
		});
}

export function sortByAgeAndDistance(baseLatLong, distanceWeight = 1, ageWeight = 1) {
	const sortByDistance = createSortByDistance(baseLatLong);
	return (inputCases) => {
		const casesByAge = sortCasesByAge(inputCases);
		const casesByDistance = sortByDistance(inputCases);

		return (
			inputCases
				// this could be optimized by using a map to store the index of each case
				.map((caseI) => {
					const distanceScore = casesByDistance.indexOf(caseI);
					const ageScore = casesByAge.indexOf(caseI);
					const score = distanceWeight * distanceScore + ageWeight * ageScore;
					return { case: caseI, score };
				})
				.toSorted((a, b) => a.score - b.score)
				.map((pair) => pair.case)
		);
	};
}

/**
 * Fairly accurate distance calculation using the Haversine formula
 *
 * @param {import('./types.js').LatLong} latLongA
 * @param {import('./types.js').LatLong} latLongB
 * @returns {number} Distance in km
 */
export function distanceBetween(latLongA, latLongB) {
	const earthRadius = 6371;
	const latDiff = ((latLongB.latitude - latLongA.latitude) * Math.PI) / 180;
	const longDiff = ((latLongB.longitude - latLongA.longitude) * Math.PI) / 180;
	const a =
		Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
		Math.cos((latLongA.latitude * Math.PI) / 180) *
			Math.cos((latLongB.latitude * Math.PI) / 180) *
			Math.sin(longDiff / 2) *
			Math.sin(longDiff / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	return earthRadius * c;
}

/**
 * Pairs cases that are geographically close and of a similar age using a weighted algorithm.
 * @param {Array} inputCases - Array of case objects with latitude, longitude, and age properties.
 * @param {number} distanceWeight - Weight for the distance component.
 * @param {number} ageWeight - Weight for the age component.
 * @returns {Array} - Array of paired cases.
 */
export function pairCases(inputCases, distanceWeight = 1, ageWeight = 1) {
	let casesByAge = sortCasesByAge(inputCases);
	const pairs = [];

	while (casesByAge.length > 1) {
		let bestPair = null;
		let bestScore = Infinity;
		const caseI = casesByAge[0];
		const sortByDistance = createSortByDistance(caseI.siteAddressLatLong);
		const casesByDistance = sortByDistance(casesByAge);

		for (let j = 1; j < casesByAge.length; j++) {
			// we normalise the score by saying that case i is the nth closest case to case j
			// that keeps the scoring relative it's score against other cases
			// if we'd just use the raw kilometer distance then the weighting would work differently
			// depending on the area covered by inspectors in more rural areas
			const distanceScore = casesByDistance.indexOf(casesByAge[j]);
			// we do something similar here for age where we select the next oldest case
			// as the cases are already sorted we can just use j as j is the nth oldest case
			const ageScore = j;
			const score = distanceWeight * distanceScore + ageWeight * ageScore;

			if (score < bestScore) {
				bestPair = [caseI, casesByAge[j]];
				bestScore = score;
			}
		}

		if (bestPair) {
			pairs.push(bestPair);
			// Remove the paired cases from the list to avoid re-pairing
			casesByAge = casesByAge.filter((c) => c !== bestPair[0] && c !== bestPair[1]);
		}
	}

	if (casesByAge.length > 0) {
		pairs.push(casesByAge);
	}

	return pairs;
}
