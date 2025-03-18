import OSPoint from 'ospoint';

export async function getLatLongForPostcode({ key }, postcode) {
	const params = new URLSearchParams({
		postcode,
		key
	});
	const res = await fetch(`https://api.os.uk/search/places/v1/postcode?${params.toString()}`);

	const places = await res.json();

	if (!places.results) {
		return null;
	}

	const x = places.results[0].DPA?.X_COORDINATE;
	const y = places.results[0].DPA?.Y_COORDINATE;

	return xYToLatLong(x, y);
}

function xYToLatLong(x, y) {
	const point = new OSPoint(y, x);
	const coordinates = point.toWGS84();
	return {
		lat: coordinates.latitude,
		long: coordinates.longitude
	};
}

let places;

export function randomPostcode({ key }) {
	return async () => {
		if (!places) {
			const res = await fetch(`https://api.os.uk/search/places/v1/find?query=england&key=${key}&maxresults=100`);
			places = await res.json();
		}

		if (!places.results) {
			return {};
		}

		const count = places.results.length;
		const randomIndex = Math.floor(Math.random() * count);
		return places.results[randomIndex].DPA?.POSTCODE;
	};
}
