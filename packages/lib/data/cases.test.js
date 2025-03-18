import { describe, it } from 'node:test';
import assert from 'node:assert';
import { fetchCases } from './cases.js';

describe('fetchCases', () => {
	it('should return cases', async () => {
		const count = 10;
		const filters = {};

		const cases = fetchCases(count, filters);

		assert.strictEqual(cases.length, 10);
	});

	it('should return cases with filters', async () => {
		const count = 10;
		const filters = {
			caseType: 'W'
		};

		const cases = fetchCases(count, filters);

		for (const c of cases) {
			assert.strictEqual(c.caseType, 'W');
		}
	});

	it('should return cases with array filters', async () => {
		const count = 10;
		const filters = {
			caseSpecialisms: ['Access', 'Listed building and enforcement']
		};

		const cases = fetchCases(count, filters);

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

		const cases = fetchCases(count, filters);
		const sortedCases = cases.toSorted((a, b) => b.caseAge - a.caseAge);

		assert.deepStrictEqual(cases, sortedCases);
	});
});
