import { describe, it } from 'node:test';
import assert from 'node:assert';
import { fetchCases } from './cases.js';

describe('fetchCases', () => {
	it('should return cases', async () => {
		const count = 10;
		const filters = {};

		const cases = await fetchCases(count, filters);

		assert.strictEqual(cases.length, 10);
	});

	it('should return cases with filters', async () => {
		const count = 10;
		const filters = {
			caseType: 'W'
		};

		const cases = await fetchCases(count, filters);

		assert.strictEqual(cases[0].caseType, 'W');
	});

	it('should sort cases by age', async () => {
		const count = 10;
		const filters = {};

		const cases = await fetchCases(count, filters);
		const sortedCases = cases.toSorted((a, b) => a.caseAge - b.caseAge);

		assert.deepStrictEqual(cases, sortedCases);
	});
});
