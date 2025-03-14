import { fakerEN_GB as faker } from '@faker-js/faker';
import { APPEAL_CASE_STATUS, APPEAL_EVENT_TYPE } from 'pins-data-model';

const arrayElement = faker.helpers.arrayElement;
const fakerPostCode = async () => faker.location.zipCode();

/**
 * @param {number} count
 * @param {() => Promise<string>} randomPostcode
 * @param {Record<string, string | string[]>} filters
 * @returns {Promise<import('./types.js').AppealCase[]>}
 */
export async function fetchCases(count = 10, filters = {}, randomPostcode = fakerPostCode) {
	const cases = [];
	const filter = applyFilters(filters);

	while (cases.length < count) {
		const caseData = await createCase(randomPostcode);
		if (filter(caseData)) {
			cases.push(caseData);
		}
	}

	return cases.toSorted(sortCasesByAge);
}

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
		venue: faker.address.streetAddress(),
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

function sortCasesByAge(a, b) {
	return b.caseAge - a.caseAge;
}
