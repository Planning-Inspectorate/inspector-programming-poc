import { describe, it } from 'node:test';
import { getLatLongForPostcode } from '#util/maps.js';
import assert from 'node:assert';

describe('maps', () => {
	it('converts', async () => {
		const latLong = await getLatLongForPostcode({ key: 'Eij6xzKNsR3h1wkwsJGPlbbki53RQBYF' }, 'BS28 4EY');
		const tolerance = 0.001; // this tolerence can be adjusted
		assert(Math.abs(latLong.lat - 51.227847) < tolerance);
		assert(Math.abs(latLong.long - -2.8067021) < tolerance);
	});
});
