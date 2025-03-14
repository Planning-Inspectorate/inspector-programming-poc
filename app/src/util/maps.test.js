import { describe, it, beforeEach, afterEach } from 'node:test';
import { getLatLongForPostcode } from '#util/maps.js';
import assert from 'node:assert';
import sinon from 'sinon';

describe('maps', () => {
	let fetchStub;

	beforeEach(() => {
		// Stub global fetch with sinon
		fetchStub = sinon.stub(global, 'fetch');
	});

	afterEach(() => {
		// Restore the original fetch after all tests
		fetchStub.restore();
	});

	it('converts postcode to lat/long', async () => {
		// mock API response
		const mockApiResponse = {
			results: [
				{
					DPA: { X_COORDINATE: 342000, Y_COORDINATE: 160000 }
				}
			]
		};

		// mock fetch to return this response
		fetchStub.resolves({
			json: async () => mockApiResponse
		});

		const latLong = await getLatLongForPostcode({ key: 'fake-api-key' }, 'BS28 4EY');

		assert.strictEqual(latLong.lat, 51.33612253930903);
		assert.strictEqual(latLong.long, -2.8339674380729813);

		assert(fetchStub.calledOnce); // ensure fetch was called once
	});
});
