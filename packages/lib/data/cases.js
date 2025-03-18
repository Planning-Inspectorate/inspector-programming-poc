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
 * @param {number} count
 * @param {Record<string, string | string[]>} filters
 * @param {(a: import('./types.js').AppealCase, b: import('./types.js').AppealCase) => number} sort
 * @returns {import('./types.js').AppealCase[]}
 */
export function fetchCases(count = 10, filters = {}, sort = sortCasesByAge) {
	const filter = applyFilters(filters);
	const filteredCases = [];

	for (let i = 0; filteredCases.length < count && i < cases.length; i++) {
		if (filter(cases[i])) {
			filteredCases.push(cases[i]);
		}
	}

	return filteredCases.toSorted(sort);
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
		chartingNotes: faker.lorem.sentence(),
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

export function sortCasesByAge(a, b) {
	return b.caseAge - a.caseAge;
}

export async function createSortByDistance(inspectorLatLong) {
	return (a, b) => {
		const distanceA = distanceBetween(a.siteAddressLatLong, inspectorLatLong);
		const distanceB = distanceBetween(b.siteAddressLatLong, inspectorLatLong);
		return distanceA - distanceB;
	};
}

/**
 * Fairly accurate distance calculation using the Haversine formula
 *
 * @param {import('./types.js').LatLong} latLongA
 * @param {import('./types.js').LatLong} latLongB
 * @returns {number}
 */
function distanceBetween(latLongA, latLongB) {
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
