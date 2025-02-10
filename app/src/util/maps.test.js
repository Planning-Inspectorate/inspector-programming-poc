import { describe, it } from 'node:test';
import { getLatLongForPostcode } from '#util/maps.js';
import assert from 'node:assert';

describe('maps', () => {
	it('converts', async () => {
		const latLong = await getLatLongForPostcode({ key: 'Eij6xzKNsR3h1wkwsJGPlbbki53RQBYF' }, 'BS28 4EY');
		assert.equal(latLong.lat, 51.227847);
		assert.strictEqual(latLong.long, -2.8067021);
	});
});
