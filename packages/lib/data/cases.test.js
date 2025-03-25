import { describe, it } from 'node:test';
import assert from 'node:assert';
import { fetchCases, pairCases } from './cases.js';

describe('fetchCases', () => {
	it('should return cases', async () => {
		const count = 10;
		const filters = {};

		const { cases } = fetchCases(count, 1, filters);

		assert.strictEqual(cases.length, 10);
	});

	it('should return cases with filters', async () => {
		const count = 10;
		const filters = {
			caseType: 'W'
		};

		const { cases } = fetchCases(count, 1, filters);

		for (const c of cases) {
			assert.strictEqual(c.caseType, 'W');
		}
	});

	it('should return cases with array filters', async () => {
		const count = 10;
		const filters = {
			caseSpecialisms: ['Access', 'Listed building and enforcement']
		};

		const { cases } = fetchCases(count, 1, filters);

		for (const c of cases) {
			assert.strictEqual(
				true,
				c.caseSpecialisms === 'Access' || c.caseSpecialisms === 'Listed building and enforcement'
			);
		}
	});

	it('should sort cases by age', async () => {
		const count = 10;
		const filters = {};

		const { cases } = fetchCases(count, 1, filters);
		const sortedCases = cases.toSorted((a, b) => b.caseAge - a.caseAge);

		assert.deepStrictEqual(cases, sortedCases);
	});
});

describe('pairCases', () => {
	const filters = {
		caseType: 'W',
		lpaRegion: 'North'
	};

	it('should return pairs of cases', async () => {
		const { cases } = fetchCases(10, 1, filters);
		const pairs = pairCases(cases);

		assert.strictEqual(pairs.length, 5);
	});

	it('should return pairs of cases with odd number of cases', async () => {
		const { cases } = fetchCases(11, 1, filters);
		const pairs = pairCases(cases);

		assert.strictEqual(pairs.length, 6);
	});

	it('return cases that are oldest first', async () => {
		const { cases } = fetchCases(10, 1, filters);
		const pairs = pairCases(cases);

		for (const pair of pairs) {
			assert.ok(pair[0].caseAge >= pair[1].caseAge);
		}

		assert.ok(pairs[0][0].caseAge >= pairs[1][0].caseAge);
	});

	it('adjusts to the given weights for distance and age', async () => {
		const cases = [
			{ caseAge: 10, siteAddressLatLong: { latitude: 0, longitude: 0 } },
			{ caseAge: 9, siteAddressLatLong: { latitude: 2, longitude: 2 } },
			{ caseAge: 8, siteAddressLatLong: { latitude: 1, longitude: 1 } },
			{ caseAge: 7, siteAddressLatLong: { latitude: 5, longitude: 5 } },
			{ caseAge: 6, siteAddressLatLong: { latitude: 3, longitude: 3 } },
			{ caseAge: 5, siteAddressLatLong: { latitude: 4, longitude: 4 } }
		];
		const pairs = pairCases(cases, 2, 1);

		assert.strictEqual(pairs[0][0].caseAge, 10);
		assert.strictEqual(pairs[0][1].caseAge, 8);
		assert.strictEqual(pairs[1][0].caseAge, 9);
		assert.strictEqual(pairs[1][1].caseAge, 6);
	});
});
