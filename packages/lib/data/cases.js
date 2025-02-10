import { fakerEN_GB as faker } from '@faker-js/faker';
import { APPEAL_CASE_PROCEDURE, APPEAL_CASE_STATUS } from 'pins-data-model';

const arrayElement = faker.helpers.arrayElement;
const fakerPostCode = async () => faker.location.zipCode();

/**
 * @param {number} count
 * @param {() => Promise<string>} randomPostcode
 * @returns {Promise<import('./types.js').AppealCase[]>}
 */
export async function fetchCases(count = 10, randomPostcode = fakerPostCode) {
	/** @type {import('./types.js').AppealCase[]} */
	const cases = [];
	for (let i = 0; i < count; i++) {
		const allocationBand = arrayElement([1, 2, 3]);
		cases.push({
			caseId: faker.string.numeric(7),
			caseType: arrayElement(['W', 'D']),
			caseStatus: arrayElement(Object.values(APPEAL_CASE_STATUS)),
			caseProcedure: arrayElement(Object.values(APPEAL_CASE_PROCEDURE)),
			lpaCode: faker.string.alpha({ length: 1, casing: 'upper' }) + faker.string.numeric(5),
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
			siteAddressPostcode: await randomPostcode()
		});
	}
	return cases;
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
