import { fakerEN_GB as faker } from '@faker-js/faker';

const arrayElement = faker.helpers.arrayElement;
const fakerPostCode = async () => faker.location.zipCode();

const inspectors = [
	{
		id: process.env.USER_ID_0,
		firstName: 'Linus',
		lastName: 'Norton',
		emailAddress: process.env.USER_EMAIL_0,
		address: { addressLine1: '946 Rippin Yard', postcode: 'NM46 3FR' },
		grade: 'B3',
		fte: 0.6,
		inspectorManager: true,
		chartingOfficerId: '6932ca67-a962-4ac8-b9e5-ef749ae976c0',
		inspectorPhone: faker.phone.number(),
		chartingOfficerPhone: faker.phone.number(),
		filters: {
			caseProcedure: ['Written reps', 'Hearing', 'Inquiry'],
			lpaRegion: ['East'],
			caseType: ['W', 'D'],
			caseSpecialisms: ['Roads and traffics', 'Natural heritage', 'Schedule 1'],
			allocationLevel: ['D', 'E', 'F', 'G', 'H']
		},
		specialisms: [{ name: 'Schedule 1', proficiency: 'trained', validFrom: '2024-07-19T23:28:24.456Z' }],
		preclusions: [
			{ organisation: 'Schroeder Group' },
			{ organisation: 'Schiller, Hegmann and Considine' },
			{ lpaId: 'uMCybo' }
		],
		homeLatLong: { latitude: 52.6309, longitude: 1.2974 }
	},
	{
		id: process.env.USER_ID_1,
		firstName: 'Joshua',
		lastName: 'Wilson',
		emailAddress: process.env.USER_EMAIL_1,
		address: { addressLine1: '6 Daphnee Brow', postcode: 'UY3 7WS' },
		grade: 'B1',
		fte: 0.7,
		inspectorManager: true,
		chartingOfficerId: '75eaf918-d447-4bcc-a458-0e2d96d41a1d',
		inspectorPhone: faker.phone.number(),
		chartingOfficerPhone: faker.phone.number(),
		filters: {
			caseProcedure: ['Written reps', 'Hearing', 'Inquiry'],
			lpaRegion: ['South'],
			caseType: ['W', 'D'],
			caseSpecialisms: ['Access', 'Listed building and enforcement', 'Roads and traffics'],
			allocationLevel: ['A', 'B', 'C', 'D', 'E']
		},
		specialisms: [{ name: 'Schedule 1', proficiency: 'in-training', validFrom: '2026-02-02T12:21:13.655Z' }],
		preclusions: [{ organisation: 'Ryan, Cassin and McDermott' }, { lpaId: '3JKfh1' }, { postcode: 'TH8 6XW' }],
		homeLatLong: { latitude: 51.5074, longitude: -0.1278 }
	},
	{
		id: process.env.USER_ID_2,
		firstName: 'Mathew',
		lastName: 'Willie',
		emailAddress: process.env.USER_EMAIL_2,
		address: { addressLine1: '33 Jamison Drive', postcode: 'GM86 7QY' },
		grade: 'B3',
		fte: 0.5,
		inspectorManager: false,
		chartingOfficerId: '9e45698a-f445-44d0-b490-21f4b1c20211',
		inspectorPhone: faker.phone.number(),
		chartingOfficerPhone: faker.phone.number(),
		filters: {
			caseProcedure: ['Written reps', 'Hearing', 'Inquiry'],
			lpaRegion: ['West'],
			caseType: ['W'],
			caseSpecialisms: [
				'Access',
				'Listed building and enforcement',
				'Roads and traffics',
				'Natural heritage',
				'Schedule 1'
			],
			allocationLevel: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
		},
		specialisms: [{ name: 'Access', proficiency: 'trained', validFrom: '2024-09-16T09:47:28.450Z' }],
		preclusions: [],
		homeLatLong: { latitude: 51.4545, longitude: -2.5879 }
	},
	{
		id: process.env.USER_ID_3,
		firstName: 'Benjamin',
		lastName: 'Jacobs',
		emailAddress: process.env.USER_EMAIL_3,
		address: { addressLine1: '83 Samir Brae', postcode: 'WW88 8XQ' },
		grade: 'B1',
		fte: 0.7,
		inspectorManager: false,
		chartingOfficerId: '78510652-469b-48aa-a297-b1b3652c0d6f',
		inspectorPhone: faker.phone.number(),
		chartingOfficerPhone: faker.phone.number(),
		filters: {
			caseProcedure: ['Written reps', 'Hearing', 'Inquiry'],
			lpaRegion: ['North'],
			caseType: ['W', 'D'],
			caseSpecialisms: ['Access', 'Listed building and enforcement', 'Schedule 1'],
			allocationLevel: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
		},
		specialisms: [],
		preclusions: [{ lpaId: 'A9Qy6O' }, { lpaId: 'PuaLPH' }, { organisation: 'Hills, Ferry and Thompson' }],
		homeLatLong: { latitude: 54.9783, longitude: -1.6174 }
	},
	{
		id: '8d94d3a4-d979-429e-b816-6befab73441e',
		firstName: 'Joanne',
		lastName: 'Hodgson',
		emailAddress: 'Thurman_Schaden56@fake.pins.gov.uk',
		address: { addressLine1: '947 Andre Mount', postcode: 'TR57 2AH' },
		grade: 'B2',
		fte: 0.6,
		inspectorManager: true,
		chartingOfficerId: 'ef14cf1b-2253-4fce-94f4-faec4e7e65e8',
		inspectorPhone: faker.phone.number(),
		chartingOfficerPhone: faker.phone.number(),
		filters: {
			caseProcedure: ['Written reps', 'Hearing', 'Inquiry'],
			lpaRegion: ['South', 'East'],
			caseType: ['W', 'D'],
			caseSpecialisms: ['Natural heritage', 'Schedule 1'],
			allocationLevel: ['F', 'G', 'H']
		},
		specialisms: [],
		preclusions: [],
		homeLatLong: { latitude: 51.2802, longitude: 1.0789 }
	},
	{
		id: '969c6a8d-ece0-4ec1-955d-237d95faad32',
		firstName: 'Tabitha',
		lastName: 'Hagenes-Franecki',
		emailAddress: 'Tabitha.Hagenes-Franecki@fake.pins.gov.uk',
		address: { addressLine1: '73 Gladstone Road', postcode: 'RJ7 5KA' },
		grade: 'B2',
		fte: 0.4,
		inspectorManager: false,
		chartingOfficerId: '2c0f0181-3020-46c1-bca1-6163e7085a12',
		inspectorPhone: faker.phone.number(),
		chartingOfficerPhone: faker.phone.number(),
		filters: {
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
		},
		specialisms: [
			{
				name: 'Roads and traffics',
				proficiency: 'in-training',
				validFrom: '2026-01-25T09:56:04.979Z'
			}
		],
		preclusions: [],
		homeLatLong: { latitude: 52.4862, longitude: -1.8904 }
	},
	{
		id: '9f20bf0c-0f24-49a3-b133-b2659cadfb45',
		firstName: 'Joanie',
		lastName: 'Waelchi',
		emailAddress: 'Joanie.Waelchi70@fake.pins.gov.uk',
		address: { addressLine1: '337 Maureen Fields', postcode: 'UL43 1HT' },
		grade: 'B3',
		fte: 0.9,
		inspectorManager: false,
		chartingOfficerId: 'b63cb773-6a78-436f-b557-39d685607e53',
		inspectorPhone: faker.phone.number(),
		chartingOfficerPhone: faker.phone.number(),
		filters: {
			caseProcedure: ['Written reps', 'Hearing', 'Inquiry'],
			lpaRegion: ['North'],
			caseType: ['W', 'D'],
			caseSpecialisms: [
				'Access',
				'Listed building and enforcement',
				'Roads and traffics',
				'Natural heritage',
				'Schedule 1'
			],
			allocationLevel: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
		},
		specialisms: [],
		preclusions: [{ organisation: 'Glover - Stoltenberg' }, { lpaId: '9UkVPl' }, { organisation: 'Graham - Bayer' }],
		homeLatLong: { latitude: 55.9533, longitude: -3.1883 }
	},
	{
		id: 'f84bc7b1-b543-455a-a781-400577e6e909',
		firstName: 'Kim',
		lastName: 'Denesik',
		emailAddress: 'Kim.Denesik@fake.pins.gov.uk',
		address: { addressLine1: '27 Abdul Croft', postcode: 'HD4 8UF' },
		grade: 'B1',
		fte: 1,
		inspectorManager: false,
		chartingOfficerId: '71f86026-f8ef-40ac-8e1b-b46e45788140',
		inspectorPhone: faker.phone.number(),
		chartingOfficerPhone: faker.phone.number(),
		filters: {
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
		},
		specialisms: [],
		preclusions: [{ organisation: 'Keeling LLC' }, { postcode: 'WV96 0AI' }, { lpaId: 'vEdzfu' }],
		homeLatLong: { latitude: 53.4808, longitude: -2.2426 }
	},
	{
		id: '2978d8e4-1fec-45ca-b5ef-6ff609dc7f45',
		firstName: 'Otis',
		lastName: 'Mitchell',
		emailAddress: 'Otis.Mitchell33@fake.pins.gov.uk',
		address: { addressLine1: '96 Hailie Glade', postcode: 'LB7 9NY' },
		grade: 'B3',
		fte: 0.4,
		inspectorManager: true,
		chartingOfficerId: 'fd567f81-5383-48c7-976a-7138f7356167',
		inspectorPhone: faker.phone.number(),
		chartingOfficerPhone: faker.phone.number(),
		filters: {
			caseProcedure: ['Written reps', 'Hearing', 'Inquiry'],
			lpaRegion: ['West'],
			caseType: ['W', 'D'],
			caseSpecialisms: [
				'Access',
				'Listed building and enforcement',
				'Roads and traffics',
				'Natural heritage',
				'Schedule 1'
			],
			allocationLevel: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
		},
		specialisms: [],
		preclusions: [{ organisation: 'Franecki LLC' }, { lpaId: '6jQX6s' }, { postcode: 'FR98 7SZ' }],
		homeLatLong: { latitude: 53.3113, longitude: -4.6339 }
	},
	{
		id: '1a63dd9e-4738-462a-907e-84fcb02b9746',
		firstName: 'Rudy',
		lastName: 'Renner',
		emailAddress: 'Rudy_Renner@fake.pins.gov.uk',
		address: { addressLine1: '362 Ettie Wynd', postcode: 'TK1 1EU' },
		grade: 'B2',
		fte: 0.5,
		inspectorManager: false,
		chartingOfficerId: '77f41223-a3c6-4ba0-bfd8-7163a98bd326',
		inspectorPhone: faker.phone.number(),
		chartingOfficerPhone: faker.phone.number(),
		filters: {
			caseProcedure: ['Written reps', 'Hearing', 'Inquiry'],
			lpaRegion: ['South'],
			caseType: ['W', 'D'],
			caseSpecialisms: [
				'Access',
				'Listed building and enforcement',
				'Roads and traffics',
				'Natural heritage',
				'Schedule 1'
			],
			allocationLevel: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
		},
		specialisms: [],
		preclusions: [{ postcode: 'RH3 0VP' }, { lpaId: 'nAlJli' }, { organisation: 'Stehr Group' }],
		homeLatLong: { latitude: 50.9097, longitude: -1.4044 }
	}
];

/**
 * @param {Object} config
 * @returns {Promise<import('./types.js').Inspector[]>}
 */
export async function fetchInspectors(config) {
	for (let i = 0; i < config.inspectors.length; i++) {
		inspectors[i].id = config.inspectors[i].id;
		inspectors[i].emailAddress = config.inspectors[i].emailAddress;
	}

	return inspectors.toSorted((a, b) => {
		if (a.lastName !== b.lastName) {
			return a.lastName < b.lastName ? -1 : 1;
		}
		return a.firstName < b.firstName ? -1 : 1;
	});
}

// eslint-disable-next-line no-unused-vars
async function createInspector() {
	const firstName = faker.person.firstName();
	const lastName = faker.person.lastName();
	return {
		id: faker.string.uuid(),
		firstName,
		lastName,
		emailAddress: faker.internet.email({ firstName, lastName, provider: 'fake.pins.gov.uk' }),
		address: {
			addressLine1: faker.location.streetAddress(),
			postcode: await fakerPostCode()
		},
		grade: arrayElement(['B1', 'B2', 'B3']),
		fte: faker.number.float({ min: 0.3, max: 1, fractionDigits: 1 }),
		inspectorManager: faker.datatype.boolean(),
		chartingOfficerId: faker.string.uuid(),
		specialisms: faker.datatype.boolean() ? [specialism()] : [],
		preclusions: faker.datatype.boolean()
			? [await preclusion(fakerPostCode), await preclusion(fakerPostCode), await preclusion(fakerPostCode)]
			: []
	};
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

/**
 * @param {() => Promise<string>} randomPostcode
 * @returns {Promise<import('./types.js').Preclusion>}
 */
async function preclusion(randomPostcode) {
	switch (faker.number.int({ min: 1, max: 3 })) {
		case 1:
			return {
				lpaId: faker.string.alphanumeric(6)
			};
		case 2:
			return {
				postcode: await randomPostcode()
			};
		case 3:
			return {
				organisation: faker.company.name()
			};
	}
}
