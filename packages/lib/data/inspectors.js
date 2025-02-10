import { fakerEN_GB as faker } from '@faker-js/faker';

const arrayElement = faker.helpers.arrayElement;

/**
 * @param count
 * @returns {import('./types.js').Inspector[]}
 */
export function fetchInspectors(count = 10) {
	/** @type {import('./types.js').Inspector[]} */
	const inspectors = [];
	for (let i = 0; i < count; i++) {
		const firstName = faker.person.firstName();
		const lastName = faker.person.lastName();
		inspectors.push({
			id: faker.string.uuid(),
			firstName,
			lastName,
			emailAddress: faker.internet.email({ firstName, lastName, provider: 'fake.pins.gov.uk' }),
			address: {
				addressLine1: faker.location.streetAddress(),
				postcode: faker.location.zipCode()
			},
			grade: arrayElement(['B1', 'B2', 'B3']),
			fte: faker.number.float({ min: 0.3, max: 1, fractionDigits: 1 }),
			inspectorManager: faker.datatype.boolean(),
			chartingOfficerId: faker.string.uuid(),
			specialisms: faker.datatype.boolean() ? [specialism()] : [],
			preclusions: faker.datatype.boolean() ? [preclusion(), preclusion(), preclusion()] : []
		});
	}
	return inspectors;
}

function specialism() {
	return {
		name: arrayElement([
			'Access',
			'Listed building and enforcement',
			'Roads and traffics',
			'Natural heritage',
			'Schedule 1'
		]),
		proficiency: arrayElement(['trained', 'in-training']),
		validFrom: faker.date.anytime()
	};
}

function preclusion() {
	switch (faker.number.int({ min: 1, max: 3 })) {
		case 1:
			return {
				lpaId: faker.string.alphanumeric(6)
			};
		case 2:
			return {
				postcode: faker.location.zipCode()
			};
		case 3:
			return {
				organisation: faker.company.name()
			};
	}
}
